"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const genusController_1 = require("../controllers/genusController");
const router = (0, express_1.Router)();
router.get('/', genusController_1.getGenusList);
router.get('/:id', genusController_1.getSpeciesForGenus);
exports.default = router;
