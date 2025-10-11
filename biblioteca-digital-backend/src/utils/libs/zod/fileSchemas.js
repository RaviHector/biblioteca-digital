import { z } from 'zod';

import {
  DOCUMENTS_CONFIG,
  PICTURES_CONFIG,
  VIDEOS_CONFIG,
} from '../../general/constants.js';
import numToMegaBytes from '../../general/numToMegaBytes.js';

// Schema to validate the object that comes from multer lib
const schema = ({ fileName, allowedMimeTypes, sizeLimitInMB }) =>
  z
    .object({
      originalname: z.string({
        required_error: `${fileName} original name is required`,
      }),
      key: z.string({
        required_error: `${fileName} key is required`,
      }),
      location: z.string({
        required_error: `${fileName} location is required`,
      }),
      bucket: z.string({
        required_error: `${fileName} bucket name is required`,
      }), // Maybe will be necessary
      size: z
        .number({ required_error: `${fileName} size is required` })
        .lte(
          numToMegaBytes(sizeLimitInMB),
          `${fileName} cannot be bigger than ${sizeLimitInMB} MB`,
        ),
      mimetype: z.enum(allowedMimeTypes, {
        errorMap: () => ({
          message: `Invalid ${fileName} mime type. Only allowed: ${allowedMimeTypes.join(
            ', ',
          )}`,
        }),
      }),
    })
    .transform(
      ({ originalname: name, mimetype: mimeType, location: url, ...rest }) => ({
        name,
        mimeType,
        url,
        ...rest,
      }),
    );

export const documentSchema = schema(DOCUMENTS_CONFIG).transform(
  ({ size, bucket, ...document }) => document, // Taking off size and bucket props
);
export const pictureSchema = schema(PICTURES_CONFIG).transform(
  ({ size, bucket, ...picture }) => picture, // Taking off size and bucket props
);
export const videoSchema = schema(VIDEOS_CONFIG).transform(
  ({ name, size, bucket, ...video }) => video, // Taking off name, size and bucket props
);
