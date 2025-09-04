import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

import { CSVPlant, Plant, STARTER_PLANTS } from '../models/plant';
import db from '../database/dbConnection';
import { plantsWhereInput } from '../database/prisma-client/models';
import { getZoneFilter } from '../helpers/hardinessZoneHelpers';

/*
function filterPlant(plant: Plant, filters: Filters): boolean {
    if (filters.q) {
        const q = filters.q.toLowerCase();
        if (!(plant.name.toLowerCase().includes(q) || plant.latin.toLowerCase().includes(q))) return false;
    }
    if (filters.type && plant.type.value !== filters.type) return false;
    if (filters.soil && !plant.soil.includes(filters.soil)) return false;
    if (filters.sun && !plant.sun.includes(filters.sun)) return false;
    switch (filters.saltConditions) {
        case 'haute': if (plant.saltTolerance !== 'haute') return false;
        case 'moyenne': if (plant.saltTolerance !== 'haute' && plant.saltTolerance !== 'moyenne') return false;
        case 'faible': if (plant.saltTolerance !== 'haute' && plant.saltTolerance !== 'moyenne' && plant.saltTolerance !== 'faible') return false;
        default: break;
    }
    const plantHeight = plant.height * 100; // Convert to cm for comparison
    if (filters.heightMin && plantHeight < filters.heightMin) return false;
    if (filters.heightMax && plantHeight > filters.heightMax) return false;

    const plantSpread = plant.spread * 100; // Convert to cm for comparison
    if (filters.spreadMin && plantSpread < filters.spreadMin) return false;
    if (filters.spreadMax && plantSpread > filters.spreadMax) return false;

    // if (filters.color && !plant.colors.includes(filters.color)) return false;
    // if (filters.bloom && !plant.bloom.includes(filters.bloom)) return false;
    if (filters.native && !plant.isNative) return false;
    if (filters.droughtTolerant && !plant.droughtTolerant) return false;
    if (filters.floodTolerant && !plant.floodTolerant) return false;
    if (filters.zone && plant.zone > filters.zone) return false;

    return true;
}
*/

// Create an item
const createItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sanitizePlants = (rows: CSVPlant[]) => {
            // Attendu: colonnes similaires à exportRows ci-dessus. Les champs non conformes seront ignorés.
            const toPlant = (r: any) => {
                const cleanup = (x: any) => typeof x === 'string' ? x.trim() : x;
                const isNative = !!r['indig/nat'];
                // const arr = (x) => typeof x === 'string' ? x.split('|').map(s => s.trim()).filter(Boolean) : [];
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
                    isNative,
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
            isNative: p.isNative,
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
        if (req.query.zone) conditions.zone = { in: getZoneFilter(String(req.query.zone)) }; //String(req.query.zone);
        if (req.query.native) conditions.isNative = true;
        if (req.query.droughtTolerant) conditions.droughtTolerant = true;
        if (req.query.floodTolerant) conditions.floodTolerant = true;

        if (req.query.heightMin && req.query.heightMax) conditions.height = {
            gte: (parseInt(req.query.heightMin as string, 10) / 100),
            lte: (parseInt(req.query.heightMax as string, 10) / 100),
        };

        if (req.query.spreadMin && req.query.spreadMax) conditions.spread = {
            gte: (parseInt(req.query.spreadMin as string, 10) / 100),
            lte: (parseInt(req.query.spreadMax as string, 10) / 100),
        };

        if (req.query.floodTolerant) conditions.floodTolerant = true;

        if (req.query.functionalGroup) conditions.functionalGroup = String(req.query.functionalGroup);
        // if (req.query.saltConditions) conditions.saltTolerance = String(req.query.saltConditions) as Filters['saltConditions'];

        const filteredPlants = await db.plants.findMany({
            take: 100,
            skip: 0,
            select: {
                id: true,
                code: true,
                latin: true,
                name: true,
                type: true,
                zone: true,
                isNative: true,
                droughtTolerant: true,
                floodTolerant: true,
                height: true,
                spread: true,
                saltTolerance: true,
                family: true,
                genus: true,
                species: true,
                functionalGroup: true,
            },
            where: conditions,
            orderBy: {
                latin: 'asc'
            }
        });

        res.json(filteredPlants);
        // res.send('ok');
    } catch (error) {
        next(error);
    }
};

// Read single item
const getItemByCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const foundPlant = await db.plants.findUniqueOrThrow({
            select: {
                id: true,
                code: true,
                latin: true,
                name: true,
                type: true,
                zone: true,
                isNative: true,
                droughtTolerant: true,
                floodTolerant: true,
                height: true,
                spread: true,
                saltTolerance: true,
                family: true,
                genus: true,
                species: true,
                functionalGroup: true,
            },
            where: { code: req.params.id as string },
        });

        console.log('Found ', foundPlant);
        res.json(foundPlant);
    } catch (error) {
        next(error);
    }
};

// Update an item
/*
const updateItem = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const itemIndex = STARTER_PLANTS.findIndex((i) => i.code === req.params.id);
        if (itemIndex === -1) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }
        STARTER_PLANTS[itemIndex].name = name;
        res.json(STARTER_PLANTS[itemIndex]);
    } catch (error) {
        next(error);
    }
};
*/

// Delete an item
/*
const deleteItem = (req: Request, res: Response, next: NextFunction) => {
    try {
        const itemIndex = STARTER_PLANTS.findIndex(i => i.code === req.params.id);
        if (itemIndex === -1) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }
        const deletedItem = STARTER_PLANTS.splice(itemIndex, 1)[0];
        res.json(deletedItem);
    } catch (error) {
        next(error);
    }
};
*/

export {
    createItems,
    getItems,
    getItemByCode,
    // updateItem,
    // deleteItem,
};
