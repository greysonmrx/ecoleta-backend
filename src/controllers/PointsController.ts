import { Request, Response } from 'express';

import knex from '../database/connection';

class PointsController {
  async store(request: Request, response: Response): Promise<Response> {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const trx = await knex.transaction();

    const point = {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      image: request.file.filename,
    };

    const insertedIds = await trx('points').insert(point);

    const pointId = insertedIds[0];

    const pointItems = items
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((itemId: number) => {
        return {
          point_id: pointId,
          item_id: itemId,
        };
      });

    await trx('point_items').insert(pointItems);

    await trx.commit();

    return response.json({
      id: pointId,
      ...point,
    });
  }
}

export default PointsController;
