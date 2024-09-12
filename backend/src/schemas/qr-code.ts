import { z } from 'zod';

export const QRCodeSchema = z.object({
  path: z.string()
})