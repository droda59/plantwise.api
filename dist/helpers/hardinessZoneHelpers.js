"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getZoneFilter = getZoneFilter;
const hardinessZone0 = ['0', '0a', '0b'];
const hardinessZone1 = ['1', '1a', '1b'];
const hardinessZone2 = ['2', '2a', '2b'];
const hardinessZone3 = ['3', '3a', '3b'];
const hardinessZone4 = ['4', '4a', '4b'];
const hardinessZone5 = ['5', '5a', '5b'];
const hardinessZone6 = ['6', '6a', '6b'];
const hardinessZone7 = ['7', '7a', '7b'];
const hardinessZone8 = ['8', '8a', '8b'];
const hardinessZone9 = ['9', '9a'];
const hardinessZoneNorthernmost0 = ['0a'];
const hardinessZoneNorthernmost1 = ['1a'];
const hardinessZoneNorthernmost2 = ['2a'];
const hardinessZoneNorthernmost3 = ['3a'];
const hardinessZoneNorthernmost4 = ['4a'];
const hardinessZoneNorthernmost5 = ['5a'];
const hardinessZoneNorthernmost6 = ['6a'];
const hardinessZoneNorthernmost7 = ['7a'];
const hardinessZoneNorthernmost8 = ['8a'];
function getZoneFilter(zone) {
    if (zone === '0' || zone === '0b')
        return [
            ...hardinessZone0
        ];
    if (zone === '0a')
        return [
            ...hardinessZoneNorthernmost0
        ];
    if (zone === '1' || zone === '1b')
        return [
            ...hardinessZone0,
            ...hardinessZone1,
        ];
    if (zone === '1a')
        return [
            ...hardinessZone0,
            ...hardinessZoneNorthernmost1,
        ];
    if (zone === '2' || zone === '2b')
        return [
            ...hardinessZone0,
            ...hardinessZone1,
            ...hardinessZone2,
        ];
    if (zone === '2a')
        return [
            ...hardinessZone0,
            ...hardinessZone1,
            ...hardinessZoneNorthernmost2,
        ];
    if (zone === '3' || zone === '3b')
        return [
            ...hardinessZone0,
            ...hardinessZone1,
            ...hardinessZone2,
            ...hardinessZone3
        ];
    if (zone === '3a')
        return [
            ...hardinessZone0,
            ...hardinessZone1,
            ...hardinessZone2,
            ...hardinessZoneNorthernmost3,
        ];
    if (zone === '4' || zone === '4b')
        return [
            ...hardinessZone0,
            ...hardinessZone1,
            ...hardinessZone2,
            ...hardinessZone3,
            ...hardinessZone4
        ];
    if (zone === '4a')
        return [
            ...hardinessZone0,
            ...hardinessZone1,
            ...hardinessZone2,
            ...hardinessZone3,
            ...hardinessZoneNorthernmost4,
        ];
    if (zone === '5' || zone === '5b')
        return [
            ...hardinessZone0,
            ...hardinessZone1,
            ...hardinessZone2,
            ...hardinessZone3,
            ...hardinessZone4,
            ...hardinessZone5,
        ];
    if (zone === '5a')
        return [
            ...hardinessZone0,
            ...hardinessZone1,
            ...hardinessZone2,
            ...hardinessZone3,
            ...hardinessZone4,
            ...hardinessZoneNorthernmost5,
        ];
    if (zone === '6' || zone === '6b')
        return [
            ...hardinessZone0,
            ...hardinessZone1,
            ...hardinessZone2,
            ...hardinessZone3,
            ...hardinessZone4,
            ...hardinessZone5,
            ...hardinessZone6,
        ];
    if (zone === '6a')
        return [
            ...hardinessZone0,
            ...hardinessZone1,
            ...hardinessZone2,
            ...hardinessZone3,
            ...hardinessZone4,
            ...hardinessZone5,
            ...hardinessZoneNorthernmost6,
        ];
    if (zone === '7' || zone === '7b')
        return [
            ...hardinessZone0,
            ...hardinessZone1,
            ...hardinessZone2,
            ...hardinessZone3,
            ...hardinessZone4,
            ...hardinessZone5,
            ...hardinessZone6,
            ...hardinessZone7,
        ];
    if (zone === '7a')
        return [
            ...hardinessZone0,
            ...hardinessZone1,
            ...hardinessZone2,
            ...hardinessZone3,
            ...hardinessZone4,
            ...hardinessZone5,
            ...hardinessZone6,
            ...hardinessZoneNorthernmost7,
        ];
    if (zone === '8' || zone === '8b')
        return [
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
    if (zone === '8a')
        return [
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
    if (zone === '9' || zone === '9a')
        return [
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
