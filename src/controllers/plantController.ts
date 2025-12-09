import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import XLSX from 'xlsx';

import db from '../database/dbConnection';
import { FloatNullableFilter, plantsWhereInput } from '../database/prisma-client/models';
import { getZoneFilter } from '../helpers/hardinessZoneHelpers';
import { Plant } from '../models/plant';

const toInt = (value: any) => parseInt(value as string, 10) / 100;

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

const convertXlsxToCsv = (filename: string) => {
    const workbook = XLSX.readFile(`src/data/${filename}.xlsx`, {
        sheets: ["Liste plantes"],
        password: 'aRD_PLNT'
    });
    const worksheet = workbook.Sheets["Liste plantes"];
    const stream = XLSX.stream.to_csv(worksheet);
    stream.pipe(fs.createWriteStream(`src/data/${filename}.csv`));
};

const cleanup = (x: any) => typeof x === 'string' ? x.trim() : x;

const createItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sanitizePlants = (rows: any[]) => {
            // Attendu: colonnes similaires à exportRows ci-dessus. Les champs non conformes seront ignorés.
            const toPlant = (r: any) => {
                const code = cleanup(r['Code']);
                if (!code || !code.length) {
                    return undefined;
                }

                const suns = [];
                if (cleanup(r['soleil']).length > 0) suns.push('full');
                if (cleanup(r['mi-ombre']).length > 0) suns.push('partial');
                if (cleanup(r['ombre']).length > 0) suns.push('shade');

                const soilHumidity = [];
                if (cleanup(r['sec']).length > 0) soilHumidity.push('dry');
                if (cleanup(r['normal']).length > 0) soilHumidity.push('regular');
                if (cleanup(r['humide']).length > 0) soilHumidity.push('wet');

                const soilRichness = [];
                if (cleanup(r['Sol pauvre']).length > 0) soilRichness.push('poor');
                if (cleanup(r['Sol normal']).length > 0) soilRichness.push('regular');
                if (cleanup(r['Sol riche']).length > 0) soilRichness.push('rich');

                const soilStructure = [];
                if (cleanup(r['Sol sablonneux']).length > 0) soilStructure.push('sandy');
                if (cleanup(r['Sol meuble']).length > 0) soilStructure.push('regular');
                if (cleanup(r['Sol lourd']).length > 0) soilStructure.push('heavy');

                const p: Plant = {
                    code,
                    type: cleanup(r['Type']) || '',

                    family: cleanup(r['Famille']),
                    genus: cleanup(r['Genre']),
                    species: cleanup(r['Espèce']),
                    cultivar: cleanup(r['Cultivar']),
                    note: cleanup(r['Note']),
                    synonym: cleanup(r['Synonyme']),
                    commonName: cleanup(r['Nom vernaculaire']),

                    height: Number(cleanup(r['Hauteur'])) || undefined,
                    spread: Number(cleanup(r['Largeur'])) || undefined,
                    plantationDistance: Number(cleanup(r['Distance de plantation HQ'])) || undefined,

                    zone: cleanup(r['Zone']) || undefined,
                    native: cleanup(r['indigène']),
                    sunTolerance: suns.join(','),
                    soilHumidity: soilHumidity.join(','),
                    soilRichness: soilRichness.join(','),
                    soilStructure: soilStructure.join(','),
                    groundSaltTolerance: cleanup(r['Sels déglaçage']),
                    airSaltTolerance: cleanup(r['Embruns salins']),
                    soilAcidity: cleanup(r['Acidité du sol']),

                    bloom: cleanup(r['Floraison']),
                    functionalGroup: cleanup(r['Groupe fonctionnel']),
                    grouping: cleanup(r['Caractéristique']),

                    remarks: cleanup(r['Remarques']),

                    vascanID: cleanup(r['ID vascan']),
                    hydroID: cleanup(r['ID HQ']),
                    referenceUrl: cleanup(r['Lien pépinière']),
                };
                return p;
            };

            return rows.map(toPlant).filter(r => !!r) as Plant[];
        }

        await db.plants.deleteMany();

        const fileName = 'Plantation - liste globale_aRD';
        convertXlsxToCsv(fileName);
        const fileData = await readCSV(`../data/${fileName}.csv`);
        const newRows = sanitizePlants(fileData as any[]);

        const rows = newRows.map(p => ({
            code: p.code,
            type: p.type,

            family: p.family,
            genus: p.genus,
            species: p.species,
            cultivar: p.cultivar,
            note: p.note,
            synonym: p.synonym,
            commonName: p.commonName,

            height: p.height,
            spread: p.spread,
            plantationDistance: p.plantationDistance,

            zone: p.zone,
            native: p.native,
            sunTolerance: p.sunTolerance,
            soilHumidity: p.soilHumidity,
            soilRichness: p.soilRichness,
            soilStructure: p.soilStructure,
            groundSaltTolerance: p.groundSaltTolerance,
            airSaltTolerance: p.airSaltTolerance,
            soilAcidity: p.soilAcidity,

            bloom: p.bloom,
            functionalGroup: p.functionalGroup,
            grouping: p.grouping,

            remarks: p.remarks,

            vascanID: p.vascanID,
            hydroID: p.hydroID,
            referenceUrl: p.referenceUrl,
        }));
        const filteredPlants = await db.plants.createMany({
            data: rows,
        });

        console.log(filteredPlants.count);
        res.json(filteredPlants);
    } catch (error) {
        next(error);
    }
};

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
        if (req.query.native) conditions.native = 'i';

        const sunConditions: plantsWhereInput = {};
        if (req.query.sun) {
            sunConditions.OR = String(req.query.sun).split(',').map(c => (
                { sunTolerance: { contains: c } }
            ));
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

        if (req.query.genus) conditions.genus = String(req.query.genus);
        if (req.query.species) conditions.species = String(req.query.species);

        const allConditions: plantsWhereInput = {
            AND: [
                textConditions,
                sunConditions,
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
    createItems,
    getItems,
    getItemByCode,
    createItem
};
