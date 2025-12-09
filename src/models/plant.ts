type PlantTypeValue = '1 AR' | '1b ARB' | '2 CON' | '3 ARBU' | '4 VIV' | '5 GRAM' | '6 GRMP' | '7 FOU' | '8 AQUA' | '9 ANU' | '10 FH' | '11 ENS' | '12 BUL' | '13 MOU';

export interface Plant {
    id?: number;
    code: string;
    type: PlantTypeValue;

    family?: string;
    genus?: string;
    species?: string;
    cultivar?: string;
    note?: string;
    synonym?: string;
    commonName?: string;

    zone?: string;
    native?: string;
    height?: number; // m (approx)
    spread?: number; // m (approx)
    plantationDistance?: number; // m (approx)

    sunTolerance?: string;
    soilHumidity?: string;
    soilRichness?: string;
    soilStructure?: string;
    groundSaltTolerance?: string;
    airSaltTolerance?: string;
    soilAcidity?: string;

    bloom?: string;
    functionalGroup?: string;
    grouping?: string;

    remarks?: string;

    vascanID?: string;
    hydroID?: string;
    referenceUrl?: string;
}
