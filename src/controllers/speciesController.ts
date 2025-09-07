import { Request, Response, NextFunction } from 'express';

import db from '../database/dbConnection';

const getAllSpecies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const speciesList = await db.plants.findMany({
            select: {
                id: false,
                code: false,
                latin: false,
                name: false,
                type: false,
                zone: false,
                native: false,
                droughtTolerant: false,
                floodTolerant: false,
                height: false,
                spread: false,
                saltTolerance: false,
                family: false,
                genus: true,
                species: true,
                functionalGroup: false,
            },
            where: { genus: req.params.id as string },
            distinct: ['species'],
            orderBy: {
                species: 'asc'
            }
        });

        res.json(speciesList);
    } catch (error) {
        next(error);
    }
};

const getPlantsBySpecies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plantsList = await db.plants.findMany({
            where: { species: req.query.species as string },
            orderBy: {
                latin: 'asc'
            }
        });

        res.json(plantsList);
    } catch (error) {
        next(error);
    }
};

export {
    getAllSpecies,
    getPlantsBySpecies,
};
