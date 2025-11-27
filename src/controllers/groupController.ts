import { Request, Response, NextFunction } from 'express';

import db from '../database/dbConnection';

const getAllFunctionalGroups = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const speciesList = await db.plants.groupBy({
            by: ['functionalGroup', 'genus'],
            _count: {
                genus: true
            },
            where: {
                functionalGroup: {
                    not: ''
                }
            },
            orderBy: [
                {
                    functionalGroup: 'asc'
                }, {
                    genus: 'asc'
                }
            ]
        });

        res.json(speciesList.map(s => ({
            functionalGroup: s.functionalGroup,
            genus: s.genus,
            count: s._count.genus
        })));
    } catch (error) {
        next(error);
    }
};

export {
    getAllFunctionalGroups,
};
