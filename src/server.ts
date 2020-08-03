import express from 'express';
import cors from 'cors';
import path from 'path';
import { errors } from 'celebrate';

import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use(errors());

app.use(
  '/uploads',
  express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')),
);

app.listen(5000);
