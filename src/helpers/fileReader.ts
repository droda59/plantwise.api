import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import XLSX from 'xlsx';

import db from '../database/dbConnection';
import { Plant } from '../models/plant';

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

export const createItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await db.plants.deleteMany();

        const fileName = 'Plantation - liste globale_aRD';
        convertXlsxToCsv(fileName);
        const fileData = await readCSV(`../data/${fileName}.csv`);
        const newRows = (fileData as any[]).map(toPlant).filter(r => !!r) as Plant[];

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