type PlantTypeValue = '1 AR' | '1b ARB' | '2 CON' | '3 ARBU' | '4 VIV' | '5 GRAM' | '6 GRMP' | '7 FOU' | '8 AQUA' | '9 ANU' | '10 FH' | '11 ENS' | '12 BUL' | '13 MOU';

export interface Plant {
    id?: number;
    code: string;

    latin: string;
    name: string;
    type: PlantTypeValue;

    zone?: string;
    native?: string;
    height?: number; // m (approx)
    spread?: number; // m (approx)
    droughtTolerant?: boolean;
    floodTolerant?: boolean;
    saltTolerance?: 'haute' | 'moyenne' | 'faible';
    sunTolerance?: string;
    bloom?: string;

    family?: string;
    genus?: string;
    species?: string;
    cultivar?: string;
    note?: string;
    synonym?: string;
    commonName?: string;

    functionalGroup?: string;
    vascanID?: string;
}
