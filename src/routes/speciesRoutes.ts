import { Router } from 'express';

import {
    getPlantsBySpecies,
    getAllSpecies,
} from '../controllers/speciesController';

const router = Router();

router.get('/', getPlantsBySpecies);
router.get('/all', getAllSpecies);

export default router;