import { Router } from 'express';

import {
    getItems,
    getItemByCode,
    createItem,
} from '../controllers/plantController';
import { createItems } from '../helpers/fileReader';

const router = Router();

router.get('/', getItems);
router.get('/:id', getItemByCode);
router.post('/import', createItems);
router.post('/', createItem);

export default router;