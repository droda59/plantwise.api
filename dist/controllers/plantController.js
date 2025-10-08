"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createItem = exports.getItemByCode = exports.getItems = exports.createItems = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const csv_parse_1 = require("csv-parse");
const dbConnection_1 = __importDefault(require("../database/dbConnection"));
const hardinessZoneHelpers_1 = require("../helpers/hardinessZoneHelpers");
const toInt = (value) => parseInt(value, 10) / 100;
const createItems = async (req, res, next) => {
    try {
        const sanitizePlants = (rows) => {
            // Attendu: colonnes similaires à exportRows ci-dessus. Les champs non conformes seront ignorés.
            const toPlant = (r) => {
                const cleanup = (x) => typeof x === 'string' ? x.trim() : x;
                const fullSun = cleanup(r['Ensoleillement plein soleil']) === 'm';
                const sunShade = cleanup(r['Ensoleillement soleil-mi-ombre']) === 's';
                const partialShade = cleanup(r['Ensoleillement mi-ombre']) === 'w';
                const shade = cleanup(r['Ensoleillement ombre']) === 'l';
                const suns = [];
                if (fullSun || sunShade)
                    suns.push('full');
                if (sunShade || partialShade)
                    suns.push('partial');
                if (partialShade || shade)
                    suns.push('shade');
                const p = {
                    code: cleanup(r['CODE']),
                    name: cleanup(r['Nom commun']) || '',
                    latin: cleanup(r['Nom BOTANIQUE']) || '',
                    type: cleanup(r['Type']) || '',
                    zone: cleanup(r['Zone']) || undefined,
                    sunTolerance: suns.join(','),
                    bloom: cleanup(r['Flor']) || undefined,
                    native: cleanup(r['indig/nat']),
                    height: Number(cleanup(r['H'])) || undefined, //Number(r.height),
                    spread: Number(cleanup(r['L'])) || undefined,
                    family: cleanup(r['Famille']),
                    genus: cleanup(r['Genre']),
                    species: cleanup(r['Espèce']),
                    functionalGroup: cleanup(r['Groupe fonctionnel']),
                };
                console.log(p);
                return p;
            };
            return rows.map(toPlant);
        };
        const readCSV = (file) => {
            return new Promise((resolve, reject) => {
                const processFile = async () => {
                    const records = [];
                    const filePath = path_1.default.join(__dirname, file);
                    const parser = fs_1.default.createReadStream(filePath, 'utf8').pipe((0, csv_parse_1.parse)({
                        columns: true,
                        skip_records_with_empty_values: true,
                        bom: true,
                    }));
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
        };
        await dbConnection_1.default.plants.deleteMany();
        const fileData = await readCSV('../data/Plantation - liste globale short.csv');
        const newRows = sanitizePlants(fileData);
        const rows = newRows.map(p => ({
            code: p.code,
            latin: p.latin,
            name: p.name,
            type: p.type,
            zone: p.zone,
            native: p.native,
            droughtTolerant: p.droughtTolerant,
            floodTolerant: p.floodTolerant,
            height: p.height,
            spread: p.spread,
            bloom: p.bloom,
            saltTolerance: p.saltTolerance,
            family: p.family,
            genus: p.genus,
            species: p.species,
            functionalGroup: p.functionalGroup,
            sunTolerance: p.sunTolerance,
        }));
        const filteredPlants = await dbConnection_1.default.plants.createMany({
            data: rows,
        });
        console.log(filteredPlants);
        res.json(filteredPlants);
    }
    catch (error) {
        next(error);
    }
};
exports.createItems = createItems;
const getItems = async (req, res, next) => {
    try {
        const textConditions = {};
        if (req.query.q) {
            const searchQuery = String(req.query.q);
            textConditions.OR = [
                { latin: { contains: searchQuery } },
                { name: { contains: searchQuery } },
            ];
        }
        const conditions = {};
        if (req.query.type)
            conditions.type = String(req.query.type);
        if (req.query.zone)
            conditions.zone = { in: (0, hardinessZoneHelpers_1.getZoneFilter)(String(req.query.zone)) };
        if (req.query.native)
            conditions.native = 'i';
        if (req.query.droughtTolerant)
            conditions.droughtTolerant = true;
        if (req.query.floodTolerant)
            conditions.floodTolerant = true;
        if (req.query.sun)
            conditions.sunTolerance = { contains: String(req.query.sun) };
        if (req.query.bloom)
            conditions.bloom = { contains: String(req.query.bloom) };
        const heightConditions = {};
        if (req.query.heightMin)
            heightConditions.gte = toInt(req.query.heightMin);
        if (req.query.heightMax)
            heightConditions.lte = toInt(req.query.heightMax);
        conditions.height = heightConditions;
        const spreadConditions = {};
        if (req.query.spreadMin)
            spreadConditions.gte = toInt(req.query.spreadMin);
        if (req.query.spreadMax)
            spreadConditions.lte = toInt(req.query.spreadMax);
        conditions.spread = spreadConditions;
        if (req.query.floodTolerant)
            conditions.floodTolerant = true;
        if (req.query.functionalGroup)
            conditions.functionalGroup = String(req.query.functionalGroup);
        if (req.query.genus)
            conditions.genus = String(req.query.genus);
        if (req.query.species)
            conditions.species = String(req.query.species);
        const allConditions = {
            AND: [
                textConditions,
                conditions,
            ]
        };
        const filteredPlants = await dbConnection_1.default.plants.findMany({
            where: allConditions,
            orderBy: {
                latin: 'asc'
            }
        });
        // TODO Format plant to return known format instead of legit db row
        res.json(filteredPlants);
    }
    catch (error) {
        next(error);
    }
};
exports.getItems = getItems;
const getItemByCode = async (req, res, next) => {
    try {
        const foundPlant = await dbConnection_1.default.plants.findUnique({
            where: { code: req.params.id },
        });
        console.log('Found ', foundPlant);
        res.json(foundPlant);
    }
    catch (error) {
        next(error);
    }
};
exports.getItemByCode = getItemByCode;
const createItem = async (req, res, next) => {
    try {
        const createdItem = await dbConnection_1.default.plants.create({
            data: {
                code: req.body.code,
                latin: req.body.latin,
                name: req.body.name,
                type: req.body.type || undefined,
                zone: req.body.zone || undefined,
                bloom: req.body.bloom || undefined,
                sunTolerance: req.body.sunTolerance || undefined,
                native: req.body.native || undefined,
                droughtTolerant: req.body.droughtTolerant || undefined,
                floodTolerant: req.body.floodTolerant || undefined,
                height: req.body.height || undefined,
                spread: req.body.spread || undefined,
                saltTolerance: req.body.saltTolerance || undefined,
                family: req.body.family || undefined,
                genus: req.body.genus || undefined,
                species: req.body.species || undefined,
                functionalGroup: req.body.functionalGroup || undefined,
            }
        });
        res.status(201).json(createdItem);
    }
    catch (error) {
        next(error);
    }
};
exports.createItem = createItem;
