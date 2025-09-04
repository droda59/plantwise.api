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
    native: string;
    dangers: string;
    family: string;
    genus: string;
    species: string;
    functionalGroup: string;
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
    native?: string;
    droughtTolerant?: boolean;
    floodTolerant?: boolean;
    height?: number; // m (approx)
    spread?: number; // m (approx)
    saltTolerance?: 'haute' | 'moyenne' | 'faible';
    family?: string;
    genus?: string;
    species?: string;
    functionalGroup?: string;
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

