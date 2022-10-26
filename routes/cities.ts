import express, { } from 'express';
import CitiesController from '../controllers/CitiesController';
const routerCity = express.Router();

routerCity.get('/city/:province/:city', CitiesController.find);

export default routerCity;
