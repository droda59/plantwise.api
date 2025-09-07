import { Router } from 'express';

import {
    getGenusList,
    getSpeciesForGenus,
} from '../controllers/genusController';

const router = Router();

router.get('/', getGenusList);
router.get('/:id', getSpeciesForGenus);

export default router;