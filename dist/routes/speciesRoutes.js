"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const speciesController_1 = require("../controllers/speciesController");
const router = (0, express_1.Router)();
router.get('/', speciesController_1.getPlantsBySpecies);
router.get('/all', speciesController_1.getAllSpecies);
exports.default = router;
