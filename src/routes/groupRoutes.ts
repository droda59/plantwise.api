import { Router } from 'express';

import {
    getAllFunctionalGroups,
} from '../controllers/groupController';

const router = Router();

router.get('/', getAllFunctionalGroups);

export default router;