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
    sunFull: string; // 'm'
    sunFullPartial: string; // 'w'
    sunPartial: string; // 's'
    sunShade: string; // 'l'
    humidity1: string; // 'oui' or 'non'
    humidity2: string; // 'oui' or 'non'
    humidity3: string; // 'oui' or 'non'
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
    sunTolerance?: string;
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
}

type PlantTypeValue = '1 AR' | '1b ARB' | '2 CON' | '3 ARBU' | '4 VIV' | '5 GRAM' | '6 GRMP' | '7 FOU' | '8 AQUA' | '9 ANU' | '10 FH' | '11 ENS' | '12 BUL' | '13 MOU';
type PlantTypeLabel = 'Arbre' | 'Arbrisseau feuillu' | 'Conifère' | 'Arbuste' | 'Vivace' | 'Graminée' | 'Grimpante' | 'Fougère' | 'Aquatique' | 'Annuelle' | 'Fines herbes' | 'Ensemencement' | 'Bulbe' | 'Mousse';

export interface PlantType {
    value: PlantTypeValue,
    label: PlantTypeLabel
};
