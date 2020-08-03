import { Request, Response } from 'express';

import knex from '../database/connection';

class PointsController {
  async index(request: Request, response: Response): Promise<Response> {
    const { city, uf, items } = request.query;

    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    const serializedPoints = points.map(point => {
      return {
        ...point,
        image_url: `http://192.168.100.52:5000/uploads/${point.image}`,
      };
    });

    return response.json(serializedPoints);
  }

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
