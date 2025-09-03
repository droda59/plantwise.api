import { Router } from 'express';

import {
    createItems,
    getItems,
    getItemByCode,
    // updateItem,
    // deleteItem,
} from '../controllers/plantController';

const router = Router();

router.get('/', getItems);
router.get('/:id', getItemByCode);
router.post('/import', createItems);
// router.put('/:id', updateItem);
// router.delete('/:id', deleteItem);

export default router;