import { Request, Response, NextFunction } from 'express';

import db from '../database/dbConnection';
import { FloatNullableFilter, plantsWhereInput } from '../database/prisma-client/models';
import { getZoneFilter } from '../helpers/hardinessZoneHelpers';

const toInt = (value: any) => parseInt(value as string, 10) / 100;

const getItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const textConditions: plantsWhereInput = {};
        if (req.query.q) {
            const searchQuery = String(req.query.q);

            textConditions.OR = [
                { species: { contains: searchQuery } },
                { cultivar: { contains: searchQuery } },
                { note: { contains: searchQuery } },
                { synonym: { contains: searchQuery } },
                { commonName: { contains: searchQuery } },
            ];
        }

        const conditions: plantsWhereInput = {};
        if (req.query.type) conditions.type = String(req.query.type);
        if (req.query.zone) conditions.zone = { in: getZoneFilter(String(req.query.zone)) };
        if (req.query.native) conditions.native = 'x';

        const sunConditions: plantsWhereInput = {};
        if (req.query.sun) {
            sunConditions.OR = String(req.query.sun).split(',').map(c => (
                { sunTolerance: { contains: c } }
            ));
        }
        const groundSaltConditions: plantsWhereInput = {};
        if (req.query.groundSalt) {
            groundSaltConditions.OR = [
                { groundSaltTolerance: { equals: 'moyenne' } },
                { groundSaltTolerance: { equals: 'bonne' } },
            ]
        }
        const airSaltConditions: plantsWhereInput = {};
        if (req.query.airSalt) {
            airSaltConditions.OR = [
                { airSaltTolerance: { equals: 'moyenne' } },
                { airSaltTolerance: { equals: 'bonne' } },
            ]
        }
        var humidityConditions: plantsWhereInput = {};
        if (req.query.drought && req.query.flood) {
            humidityConditions.AND = [
                { soilHumidity: { contains: 'dry' } },
                { soilHumidity: { contains: 'wet' } },
            ]
        } else if (req.query.drought) {
            humidityConditions = { soilHumidity: { contains: 'dry' } };
        } else if (req.query.flood) {
            humidityConditions = { soilHumidity: { contains: 'wet' } };
        }
        if (req.query.bloom) conditions.bloom = { contains: String(req.query.bloom) };

        const heightConditions = {} as FloatNullableFilter<never>;
        if (req.query.heightMin) heightConditions.gte = toInt(req.query.heightMin);
        if (req.query.heightMax) heightConditions.lte = toInt(req.query.heightMax);
        conditions.height = heightConditions;

        const spreadConditions = {} as FloatNullableFilter<never>;
        if (req.query.spreadMin) spreadConditions.gte = toInt(req.query.spreadMin);
        if (req.query.spreadMax) spreadConditions.lte = toInt(req.query.spreadMax);
        conditions.spread = spreadConditions;

        if (req.query.functionalGroup) conditions.functionalGroup = String(req.query.functionalGroup);
        if (req.query.grouping) conditions.grouping = String(req.query.grouping);

        if (req.query.genus) conditions.genus = String(req.query.genus);
        if (req.query.species) conditions.species = String(req.query.species);

        const allConditions: plantsWhereInput = {
            AND: [
                textConditions,
                sunConditions,
                groundSaltConditions,
                airSaltConditions,
                humidityConditions,
                conditions,
            ]
        };
        const filteredPlants = await db.plants.findMany({
            select: {
                code: true,
                type: true,

                genus: true,
                species: true,
                cultivar: true,
                note: true,
                synonym: true,
                commonName: true,

                zone: true,
                native: true,
                height: true,
                spread: true,
                sunTolerance: true,
                functionalGroup: true,
            },
            where: allConditions,
            orderBy: {
                genus: 'asc'
            }
        });

        // TODO Format plant to return known format instead of legit db row
        res.json(filteredPlants);
    } catch (error) {
        next(error);
    }
};

const getItemByCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const foundPlant = await db.plants.findUnique({
            where: { code: req.params.id as string },
        });

        res.json(foundPlant);
    } catch (error) {
        next(error);
    }
};

const createItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createdItem = await db.plants.create({
            data: {
                code: req.body.code,
                type: req.body.type || undefined,

                family: req.body.family || undefined,
                genus: req.body.genus || undefined,
                species: req.body.species || undefined,

                zone: req.body.zone || undefined,
                bloom: req.body.bloom || undefined,
                sunTolerance: req.body.sunTolerance || undefined,
                native: req.body.native || undefined,
                height: req.body.height || undefined,
                spread: req.body.spread || undefined,
                functionalGroup: req.body.functionalGroup || undefined,
            }
        });

        res.status(201).json(createdItem);
    } catch (error) {
        next(error);
    }
};

export {
    getItems,
    getItemByCode,
    createItem
};
