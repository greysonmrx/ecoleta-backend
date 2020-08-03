import { Router } from 'express';
import multer from 'multer';
import { celebrate, Joi } from 'celebrate';

import multerConfig from './config/multer';

import ItemsController from './controllers/ItemsController';
import PointsController from './controllers/PointsController';

const routes = Router();
const upload = multer(multerConfig);

const itemsController = new ItemsController();
const pointsController = new PointsController();

routes.get('/items', itemsController.index);

routes.get('/points/:id', pointsController.show);
routes.get('/points', pointsController.index);
routes.post(
  '/points',
  upload.single('image'),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        whatsapp: Joi.string().required(),
        latitude: Joi.string().required(),
        longitude: Joi.string().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().length(2),
        items: Joi.string().required(),
      }),
    },
    { abortEarly: false },
  ),
  pointsController.store,
);

export default routes;
