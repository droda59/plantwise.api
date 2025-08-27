export type hardinessZonesCanada = '0' | '0a' | '0b' | '1' | '1a' | '1b' | '2' | '2a' | '2b' | '3' | '3a' | '3b' | '4' | '4a' | '4b' | '5' | '5a' | '5b' | '6' | '6a' | '6b' | '7' | '7a' | '7b' | '8' | '8a' | '8b' | '9' | '9a';

const hardinessZone0: hardinessZonesCanada[] = ['0', '0a', '0b'];
const hardinessZone1: hardinessZonesCanada[] = ['1', '1a', '1b'];
const hardinessZone2: hardinessZonesCanada[] = ['2', '2a', '2b'];
const hardinessZone3: hardinessZonesCanada[] = ['3', '3a', '3b'];
const hardinessZone4: hardinessZonesCanada[] = ['4', '4a', '4b'];
const hardinessZone5: hardinessZonesCanada[] = ['5', '5a', '5b'];
const hardinessZone6: hardinessZonesCanada[] = ['6', '6a', '6b'];
const hardinessZone7: hardinessZonesCanada[] = ['7', '7a', '7b'];
const hardinessZone8: hardinessZonesCanada[] = ['8', '8a', '8b'];
const hardinessZone9: hardinessZonesCanada[] = ['9', '9a'];
const hardinessZoneNorthernmost0: hardinessZonesCanada[] = ['0a'];
const hardinessZoneNorthernmost1: hardinessZonesCanada[] = ['1a'];
const hardinessZoneNorthernmost2: hardinessZonesCanada[] = ['2a'];
const hardinessZoneNorthernmost3: hardinessZonesCanada[] = ['3a'];
const hardinessZoneNorthernmost4: hardinessZonesCanada[] = ['4a'];
const hardinessZoneNorthernmost5: hardinessZonesCanada[] = ['5a'];
const hardinessZoneNorthernmost6: hardinessZonesCanada[] = ['6a'];
const hardinessZoneNorthernmost7: hardinessZonesCanada[] = ['7a'];
const hardinessZoneNorthernmost8: hardinessZonesCanada[] = ['8a'];

export function getZoneFilter(zone: string): hardinessZonesCanada[] {
    if (zone === '0' || zone === '0b') return [
        ...hardinessZone0
    ];
    if (zone === '0a') return [
        ...hardinessZoneNorthernmost0
    ];

    if (zone === '1' || zone === '1b') return [
        ...hardinessZone0,
        ...hardinessZone1,
    ];
    if (zone === '1a') return [
        ...hardinessZone0,
        ...hardinessZoneNorthernmost1,
    ];

    if (zone === '2' || zone === '2b') return [
        ...hardinessZone0,
        ...hardinessZone1,
        ...hardinessZone2,
    ];
    if (zone === '2a') return [
        ...hardinessZone0,
        ...hardinessZone1,
        ...hardinessZoneNorthernmost2,
    ];

    if (zone === '3' || zone === '3b') return [
        ...hardinessZone0,
        ...hardinessZone1,
        ...hardinessZone2,
        ...hardinessZone3
    ];
    if (zone === '3a') return [
        ...hardinessZone0,
        ...hardinessZone1,
        ...hardinessZone2,
        ...hardinessZoneNorthernmost3,
    ];

    if (zone === '4' || zone === '4b') return [
        ...hardinessZone0,
        ...hardinessZone1,
        ...hardinessZone2,
        ...hardinessZone3,
        ...hardinessZone4
    ];
    if (zone === '4a') return [
        ...hardinessZone0,
        ...hardinessZone1,
        ...hardinessZone2,
        ...hardinessZone3,
        ...hardinessZoneNorthernmost4,
    ];

    if (zone === '5' || zone === '5b') return [
        ...hardinessZone0,
        ...hardinessZone1,
        ...hardinessZone2,
        ...hardinessZone3,
        ...hardinessZone4,
        ...hardinessZone5,
    ];
    if (zone === '5a') return [
        ...hardinessZone0,
        ...hardinessZone1,
        ...hardinessZone2,
        ...hardinessZone3,
        ...hardinessZone4,
        ...hardinessZoneNorthernmost5,
    ];

    if (zone === '6' || zone === '6b') return [
        ...hardinessZone0,
        ...hardinessZone1,
        ...hardinessZone2,
        ...hardinessZone3,
        ...hardinessZone4,
        ...hardinessZone5,
        ...hardinessZone6,
    ];
    if (zone === '6a') return [
        ...hardinessZone0,
        ...hardinessZone1,
        ...hardinessZone2,
        ...hardinessZone3,
        ...hardinessZone4,
        ...hardinessZone5,
        ...hardinessZoneNorthernmost6,
    ];

    if (zone === '7' || zone === '7b') return [
        ...hardinessZone0,
        ...hardinessZone1,
        ...hardinessZone2,
        ...hardinessZone3,
        ...hardinessZone4,
        ...hardinessZone5,
        ...hardinessZone6,
        ...hardinessZone7,
    ];
    if (zone === '7a') return [
        ...hardinessZone0,
        ...hardinessZone1,
        ...hardinessZone2,
        ...hardinessZone3,
        ...hardinessZone4,
        ...hardinessZone5,
        ...hardinessZone6,
        ...hardinessZoneNorthernmost7,
    ];

    if (zone === '8' || zone === '8b') return [
        ...hardinessZone0,
        ...hardinessZone1,
        ...hardinessZone2,
        ...hardinessZone3,
        ...hardinessZone4,
        ...hardinessZone5,
        ...hardinessZone6,
        ...hardinessZone7,
        ...hardinessZone8,
    ];
    if (zone === '8a') return [
        ...hardinessZone0,
        ...hardinessZone1,
        ...hardinessZone2,
        ...hardinessZone3,
        ...hardinessZone4,
        ...hardinessZone5,
        ...hardinessZone6,
        ...hardinessZone7,
        ...hardinessZoneNorthernmost8,
    ];

    if (zone === '9' || zone === '9a') return [
        ...hardinessZone0,
        ...hardinessZone1,
        ...hardinessZone2,
        ...hardinessZone3,
        ...hardinessZone4,
        ...hardinessZone5,
        ...hardinessZone6,
        ...hardinessZone7,
        ...hardinessZone8,
        ...hardinessZone9,
    ];

    return [];
}
