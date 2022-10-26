import cors from 'cors';
import express, { } from 'express';
import routerCity from './cities';
const router = express.Router();

router.use(cors());

router.use(routerCity);

export default router;
