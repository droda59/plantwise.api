export interface CSVPlant {
    code: string;
    quantity: string;
    latin: string;
    type: PlantTypeValue;
    name: string;
    calibre: string;
    ctocDistance: string;
    comment: string;
    zone: string; // hardiness zone (e.g., 3)
    sunFull: string; // 'oui' or 'non'
    sunFullPartial: string; // 'oui' or 'non'
    sunPartial: string; // 'oui' or 'non'
    sunShade: string; // 'oui' or 'non'
    humidity1: string; // 'oui' or 'non'
    humidity2: string; // 'oui' or 'non'
    humidity3: string; // 'oui' or 'non'
    soil: string;
    ph: string;
    height: number; // cm (approx)
    spread: number; // cm (approx)
    floweringMonths: string;
    native: boolean;
    dangers: string;
}

export interface Plant {
    id?: number;
    code: string;
    latin: string;
    name: string;
    type: PlantType;
    zone?: string;
    soil: Array<'sablonneux' | 'limoneux' | 'argileux' | 'riche' | 'pauvre' | 'acide' | 'alcalin' | 'organique' | 'tourbeux' | 'loam argileux' | 'loam sablonneux' | 'humifère' | 'graveleux'>;
    sun: Array<'plein-soleil' | 'mi-ombre' | 'ombre'>;
    isNative: boolean;
    droughtTolerant?: boolean;
    floodTolerant?: boolean;
    height?: number; // m (approx)
    spread?: number; // m (approx)
    saltTolerance?: 'haute' | 'moyenne' | 'faible';
    // nurseries: Nursery[];
}

type PlantTypeValue = '1 AR' | '1b ARB' | '2 CON' | '3 ARBU' | '4 VIV' | '5 GRAM' | '6 GRMP' | '7 FOU' | '8 AQUA' | '9 ANU' | '10 FH' | '11 ENS' | '12 BUL' | '13 MOU';
type PlantTypeLabel = 'Arbre' | 'Arbrisseau feuillu' | 'Conifère' | 'Arbuste' | 'Vivace' | 'Graminée' | 'Grimpante' | 'Fougère' | 'Aquatique' | 'Annuelle' | 'Fines herbes' | 'Ensemencement' | 'Bulbe' | 'Mousse';

export interface PlantType {
    value: PlantTypeValue,
    label: PlantTypeLabel
};

export interface Nursery {
    name: string;
    city: string;
    website: string;
}


/** @type {Nursery[]} */
const NURSERIES = [
    { name: 'Pépinière Boréale', city: 'Blainville', website: 'https://exemple-boreale.qc' },
    { name: 'Centre Jardin Laurentides', city: 'St-Jérôme', website: 'https://exemple-laurentides.qc' },
    { name: 'Jardin Botanix Rive-Nord', city: 'Laval', website: 'https://exemple-botanix.qc' },
];

export const STARTER_PLANTS: Plant[] = [
    {
        id: 'ASC',
        code: 'ASC',
        latin: 'Asclepias tuberosa',
        name: 'Asclépiade tubéreuse',
        type: {
            value: '4 VIV',
            label: 'Vivace'
        },
        zone: 3,
        soil: ['sablonneux', 'pauvre', 'acide'],
        sun: ['plein-soleil'],
        // colors: ['orange'],
        // bloom: ['été'],
        isNative: true,
        droughtTolerant: true,
        height: 0.6,
        spread: 0.45,
        saltTolerance: 'moyenne',
        // nurseries: [NURSERIES[0], NURSERIES[1]],
    },
    {
        id: 'acer-ginnala',
        code: 'ACG',
        name: "Érable de l'Amour",
        latin: 'Acer ginnala',
        type: {
            value: '1 AR',
            label: 'Arbre'
        },
        zone: 3,
        soil: ['limoneux', 'riche', 'acide', 'alcalin'],
        sun: ['plein-soleil', 'mi-ombre'],
        // colors: ['vert', 'rouge automnal'],
        // bloom: ['printemps'],
        isNative: false,
        height: 6,
        spread: 5,
        droughtTolerant: true,
        // nurseries: [NURSERIES[0]],
    },
    {
        id: 'vaccinium-angustifolium',
        code: 'VAA',
        name: 'Bleuet sauvage',
        latin: 'Vaccinium angustifolium',
        type: {
            value: '10 FH',
            label: 'Fines herbes'
        },
        zone: 2,
        soil: ['acide', 'sablonneux'],
        sun: ['plein-soleil', 'mi-ombre'],
        // colors: ['blanc'],
        // bloom: ['printemps'],
        isNative: true,
        saltTolerance: 'haute',
        height: 0.3,
        spread: 1,
        floodTolerant: true,
        // nurseries: [NURSERIES[1]],
    },
    {
        id: 'hydrangea-paniculata',
        code: 'HYP',
        name: 'Hydrangée paniculée',
        latin: 'Hydrangea paniculata',
        type: {
            value: '3 ARBU',
            label: 'Arbuste'
        },
        zone: 3,
        soil: ['riche', 'limoneux'],
        sun: ['plein-soleil', 'mi-ombre'],
        // colors: ['blanc', 'rose'],
        // bloom: ['été', 'automne'],
        isNative: false,
        saltTolerance: 'faible',
        height: 2,
        spread: 2,
        // nurseries: [NURSERIES[2], NURSERIES[0]],
    },
    {
        id: 'thymus-serpyllum',
        code: 'THY',
        name: 'Thym serpolet',
        latin: 'Thymus serpyllum',
        type: {
            value: '10 FH',
            label: 'Fines herbes'
        },
        zone: 2,
        soil: ['pauvre', 'sablonneux'],
        sun: ['plein-soleil'],
        // colors: ['mauve', 'rose'],
        // bloom: ['été'],
        isNative: false,
        height: 0.08,
        spread: 0.5,
        // nurseries: [NURSERIES[0]],
    },
];
