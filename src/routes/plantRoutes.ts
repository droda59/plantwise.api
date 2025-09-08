import { Router } from 'express';

import {
    createItems,
    getItems,
    getItemByCode,
    createItem,
} from '../controllers/plantController';

const router = Router();

router.get('/', getItems);
router.get('/:id', getItemByCode);
router.post('/import', createItems);
router.post('/', createItem);

export default router;