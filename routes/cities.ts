import express, { } from 'express';
import CitiesController from '../controllers/CitiesController';
const routerCity = express.Router();

routerCity.get('/:province/:city', CitiesController.find);

export default routerCity;
