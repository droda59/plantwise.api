import { Router } from 'express';

import {
    createItems,
    getItems,
    getItemByCode,
} from '../controllers/plantController';

const router = Router();

router.get('/', getItems);
router.get('/:id', getItemByCode);
router.post('/import', createItems);

export default router;