import multer from 'multer';
import { resolve } from 'path';
import { randomBytes } from 'crypto';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename(_request, file, callback) {
      const fileHash = randomBytes(6).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
