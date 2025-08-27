export interface Filters {
    q: string;

    // Conditions du site
    zone?: string;
    soil?: 'sableux' | 'limoneux' | 'argileux' | 'riche' | 'pauvre' | 'acide' | 'alcalin';
    sun?: 'plein-soleil' | 'mi-ombre' | 'ombre';
    saltConditions?: 'haute' | 'moyenne' | 'faible';
    droughtTolerant?: boolean;
    floodTolerant?: boolean;

    // Conditions de la plante
    type?: string;
    color?: string;
    bloom?: string;
    native?: boolean;
    heightMin?: number;
    heightMax?: number;
    spreadMin?: number;
    spreadMax?: number;
}
