import { z } from 'zod';

const ValidatorConfigSchema = z.object({
  required: z.object({
    message: z.string(),
  }),
  minLength: z.object({
    value: z.number(),
  }),
}).partial();

const SurveyBaseTypeSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  validator: ValidatorConfigSchema.optional(),
});

const SurveyInputModelSchema = SurveyBaseTypeSchema.extend({
  type: z.literal('input'),
  placeholder: z.string().optional(),
});

const SurveySelectModelSchema = SurveyBaseTypeSchema.extend({
  type: z.literal('select'),
  options: z.array(z.string()),
});

export const SurveyModelSchema = z.union([SurveyInputModelSchema, SurveySelectModelSchema]);
