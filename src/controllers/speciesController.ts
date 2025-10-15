import { Request, Response, NextFunction } from 'express';

import db from '../database/dbConnection';

const getAllSpecies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const speciesList = await db.plants.groupBy({
            by: ['genus', 'species'],
            _count: {
                species: true
            },
            where: { genus: req.params.id as string },
            orderBy: [
                {
                    genus: 'asc'
                }, {
                    species: 'asc'
                }
            ]
        });

        res.json(speciesList.map(s => ({
            genus: s.genus,
            species: s.species,
            count: s._count.species
        })));
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
