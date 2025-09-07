import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

import { CSVPlant, Plant } from '../models/plant';
import db from '../database/dbConnection';
import { FloatNullableFilter, plantsWhereInput } from '../database/prisma-client/models';
import { getZoneFilter } from '../helpers/hardinessZoneHelpers';

const createItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sanitizePlants = (rows: CSVPlant[]) => {
            // Attendu: colonnes similaires à exportRows ci-dessus. Les champs non conformes seront ignorés.
            const toPlant = (r: any) => {
                const cleanup = (x: any) => typeof x === 'string' ? x.trim() : x;
                const p: Plant = {
                    code: cleanup(r['CODE']),
                    name: cleanup(r['Nom commun']) || '',
                    latin: cleanup(r['Nom BOTANIQUE']) || '',
                    type: cleanup(r['Type']) || '',
                    zone: cleanup(r['Zone']) || undefined,
                    soil: [], // arr(r.soil),
                    sun: [], // (arr(r.soleil)),
                    // colors: arr(r.couleurs),
                    // bloom: (arr(r.floraison)),
                    native: cleanup(r['indig/nat']),
                    height: Number(cleanup(r['H'])) || undefined, //Number(r.height),
                    spread: Number(cleanup(r['L'])) || undefined,
                    family: cleanup(r['Famille']),
                    genus: cleanup(r['Genre']),
                    species: cleanup(r['Espèce']),
                    functionalGroup: cleanup(r['Groupe fonctionnel']),
                    // nurseries: NURSERIES.slice(0, 1),
                };
                return p;
            };

            return rows.map(toPlant);
        }

        const readCSV = (file: string) => {
            return new Promise((resolve, reject) => {
                const processFile = async () => {
                    const records = [];
                    const filePath = path.join(__dirname, file);
                    const parser = fs.createReadStream(filePath, 'utf8').pipe(
                        parse({
                            columns: true,
                            skip_records_with_empty_values: true,
                            bom: true,
                        }),
                    );
                    for await (const record of parser) {
                        // Work with each record
                        records.push(record);
                    }
                    return records;
                };

                (async () => {
                    const records = await processFile();
                    resolve(records);
                })();
            });
        }

        const fileData = await readCSV('../data/Plantation - liste globale short.csv');
        const newRows = sanitizePlants(fileData as CSVPlant[]);

        const rows = newRows.map(p => ({
            code: p.code,
            latin: p.latin,
            name: p.name,
            type: p.type.toString(),
            zone: p.zone,
            native: p.native,
            droughtTolerant: p.droughtTolerant,
            floodTolerant: p.floodTolerant,
            height: p.height,
            spread: p.spread,
            saltTolerance: p.saltTolerance,
            family: p.family,
            genus: p.genus,
            species: p.species,
            functionalGroup: p.functionalGroup,
        }));
        const filteredPlants = await db.plants.createMany({
            data: rows,
        });

        console.log(filteredPlants);
        res.json(filteredPlants);
    } catch (error) {
        next(error);
    }
};

const getItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const conditions: plantsWhereInput = {};
        if (req.query.q) {
            const searchQuery = String(req.query.q).toLowerCase();
            conditions.latin = { contains: searchQuery };
            conditions.name = { contains: searchQuery };
        }
        if (req.query.type) conditions.type = String(req.query.type);
        if (req.query.zone) conditions.zone = { in: getZoneFilter(String(req.query.zone)) };
        if (req.query.native) conditions.native = 'i';
        if (req.query.droughtTolerant) conditions.droughtTolerant = true;
        if (req.query.floodTolerant) conditions.floodTolerant = true;

        const heightConditions = {} as FloatNullableFilter<never>;
        if (req.query.heightMin) heightConditions.gte = (parseInt(req.query.heightMin as string, 10) / 100);
        if (req.query.heightMax) heightConditions.lte = (parseInt(req.query.heightMax as string, 10) / 100);
        conditions.height = heightConditions;

        const spreadConditions = {} as FloatNullableFilter<never>;
        if (req.query.spreadMin) spreadConditions.gte = (parseInt(req.query.spreadMin as string, 10) / 100);
        if (req.query.spreadMax) spreadConditions.lte = (parseInt(req.query.spreadMax as string, 10) / 100);
        conditions.spread = spreadConditions;

        if (req.query.floodTolerant) conditions.floodTolerant = true;

        if (req.query.functionalGroup) conditions.functionalGroup = String(req.query.functionalGroup);

        if (req.query.species) conditions.species = String(req.query.species);

        const filteredPlants = await db.plants.findMany({
            where: conditions,
            orderBy: {
                latin: 'asc'
            }
        });

        res.json(filteredPlants);
    } catch (error) {
        next(error);
    }
};

const getItemByCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const foundPlant = await db.plants.findUniqueOrThrow({
            where: { code: req.params.id as string },
        });

        console.log('Found ', foundPlant);
        res.json(foundPlant);
    } catch (error) {
        next(error);
    }
};


export {
    createItems,
    getItems,
    getItemByCode,
};
