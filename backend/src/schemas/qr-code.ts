import { z } from 'zod';

export const QRCodeSchema = z.object({
  link: z.string()
})