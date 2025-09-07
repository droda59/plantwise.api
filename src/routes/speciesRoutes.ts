import { Router } from 'express';

import {
    getPlantsBySpecies,
} from '../controllers/speciesController';

const router = Router();

router.get('/', getPlantsBySpecies);

export default router;