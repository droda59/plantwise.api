import { Request, Response, NextFunction } from 'express';

import db from '../database/dbConnection';

const getGenusList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const genusList = await db.plants.groupBy({
            by: ['genus'],
            _count: {
                genus: true
            },
            orderBy: {
                genus: 'asc'
            }
        });

        res.json(genusList.map(g => ({
            genus: g.genus,
            count: g._count.genus
        })));
    } catch (error) {
        next(error);
    }
};

const getSpeciesForGenus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const speciesList = await db.plants.groupBy({
            by: ['species'],
            _count: {
                species: true
            },
            where: { genus: req.params.id as string },
            orderBy: {
                species: 'asc'
            }
        });

        res.json(speciesList.map(s => ({
            species: s.species,
            count: s._count.species
        })));
    } catch (error) {
        next(error);
    }
};

export {
    getGenusList,
    getSpeciesForGenus,
};
