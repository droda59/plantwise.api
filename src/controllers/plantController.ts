import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
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
                const code = cleanup(r['CODE']);
                const isNative = !!r['indig/nat'];
                // const arr = (x) => typeof x === 'string' ? x.split('|').map(s => s.trim()).filter(Boolean) : [];
                const p: Plant = {
                    code: code,
                    name: cleanup(r['Nom commun']) || '',
                    latin: cleanup(r['Nom BOTANIQUE']) || '',
                    type: cleanup(r['Type']) || '',
                    zone: cleanup(r['Zone']) || undefined,
                    soil: [], // arr(r.soil),
                    sun: [], // (arr(r.soleil)),
                    // colors: arr(r.couleurs),
                    // bloom: (arr(r.floraison)),
                    isNative: isNative,
                    height: cleanup(r['H']) || undefined, //Number(r.height),
                    spread: cleanup(r['L']) || undefined,
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
                    const parser = fs.createReadStream(file).pipe(
                        parse({
                            // CSV options if any
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
                    console.info(records);
                })();



                /*  const reader = new FileReader();
                 reader.onload = () => {
                     try {
                         const text = (reader.result);
                         const rows = parse(
                             text,
                             {
                                 skip_records_with_empty_values: true,
                             }
                         );
                         const [headerLine, ...lines] = text.trim().split(/\r?\n/);
                         const headers = headerLine.split(",").map(h => h.replace(/^"|"$/g, ""));
                         const rows = lines.map(l => {
                             // very simple CSV, assumes no embedded commas except within quotes
                             // const cols = l.match(/((?:\"[^\"]*\")|[^,])+/g)?.map(x => x.replace(/^"|"$/g, "").replaceAll("\\\"", "\"")) || [];
                             const o = {};
                             const data = l.split(',');
                             if (data.length == headers.length) {
                                 headers.forEach((h, i) => o[h] = data[i]);
                             }
                             //                     headers.forEach((h, i) => o[h] = l[i]);
                             return o;
                         });
         
                         resolve(rows.slice(0, 500));
                     } catch (e) { reject(e); }
                 };
                 reader.onerror = reject;
                 reader.readAsText(file); */
            });
        }

        const fileData = await readCSV('../data/Plantation - liste globale.csv');
        const newRows = sanitizePlants(fileData as CSVPlant[]);
        console.log(newRows.length);

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
        /*
        const filters: Filters = {
            q: req.query.q ? String(req.query.q) : '',

            // Conditions du site
            zone: req.query.zone ? String(req.query.zone) : undefined,
            soil: req.query.soil ? String(req.query.soil) as Filters['soil'] : undefined,
            sun: req.query.sun ? String(req.query.sun) as Filters['sun'] : undefined,
            saltConditions: req.query.saltConditions ? String(req.query.saltConditions) as Filters['saltConditions'] : undefined,
            droughtTolerant: req.query.droughtTolerant === 'true' ? true : undefined,
            floodTolerant: req.query.floodTolerant === 'true' ? true : undefined,

            // Conditions de la plante
            type: req.query.type ? String(req.query.type) : undefined,
            color: req.query.color ? String(req.query.color) : undefined,
            bloom: req.query.bloom ? String(req.query.bloom) : undefined,
            native: req.query.native === 'true' ? true : undefined,
            heightMin: req.query.heightMin ? parseInt(req.query.heightMin as string, 10) : undefined,
            heightMax: req.query.heightMax ? parseInt(req.query.heightMax as string, 10) : undefined,
            spreadMin: req.query.spreadMin ? parseInt(req.query.spreadMin as string, 10) : undefined,
            spreadMax: req.query.spreadMax ? parseInt(req.query.spreadMax as string, 10) : undefined,
        };
        */

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
        // if (req.query.saltConditions) conditions.saltTolerance = String(req.query.saltConditions) as Filters['saltConditions'];

        console.log('Conditions:', conditions);

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
            },
            where: conditions,
        });

        console.log(filteredPlants);
        res.json(filteredPlants);
        // res.send('ok');
    } catch (error) {
        next(error);
    }
};

// Read single item
const getItemById = async (req: Request, res: Response, next: NextFunction) => {
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
            },
            where: { id: parseInt(req.query.id as string, 10) },
        });

        console.log(foundPlant);
        res.json(foundPlant);
        // res.send('ok');
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
    getItemById,
    // updateItem,
    // deleteItem,
};
