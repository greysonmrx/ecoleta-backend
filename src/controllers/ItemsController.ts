import { Response, Request } from 'express';

import knex from '../database/connection';

class ItemsController {
  async index(_request: Request, response: Response): Promise<Response> {
    const items = await knex('items').select('*');

    const serializedItems = items.map(item => {
      return {
        id: item.id,
        title: item.title,
        image_url: `http://192.168.100.52:5000/uploads/${item.image}`,
      };
    });

    return response.json(serializedItems);
  }
}

export default ItemsController;
