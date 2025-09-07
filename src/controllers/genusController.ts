import { Request, Response, NextFunction } from 'express';

import db from '../database/dbConnection';

const getGenusList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const genusList = await db.plants.findMany({
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
                species: false,
                functionalGroup: false,
            },
            distinct: ['genus'],
            orderBy: {
                genus: 'asc'
            }
        });

        res.json(genusList.map(g => g.genus));
    } catch (error) {
        next(error);
    }
};

const getSpeciesForGenus = async (req: Request, res: Response, next: NextFunction) => {
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
                genus: false,
                species: true,
                functionalGroup: false,
            },
            where: { genus: req.params.id as string },
            distinct: ['species'],
            orderBy: {
                species: 'asc'
            }
        });

        res.json(speciesList.map(s => s.species));
    } catch (error) {
        next(error);
    }
};

export {
    getGenusList,
    getSpeciesForGenus,
};
