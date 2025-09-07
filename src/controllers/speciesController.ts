import { Request, Response, NextFunction } from 'express';

import db from '../database/dbConnection';

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
    getPlantsBySpecies,
};
