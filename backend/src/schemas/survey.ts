import { z } from 'zod';

const ValidatorConfigSchema = z.object({
  required: z.object({
    message: z.string(),
  }),
  minLength: z.object({
    value: z.number(),
  }),
  minSelected: z.object({
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


const SurveyCheckboxModelSchema = SurveyBaseTypeSchema.extend({
  type: z.literal('checkbox'),
  options: z.array(z.string()),
});

const SurveyRadioModelSchema = SurveyBaseTypeSchema.extend({
  type: z.literal('radio'),
  options: z.array(z.string()),
  name: z.string(),
});

export const SurveyModelSchema = z.union([SurveyInputModelSchema, SurveySelectModelSchema, SurveyCheckboxModelSchema, SurveyRadioModelSchema]);

export const SurveyCosmosDbSchema = z.object({
  id: z.string().uuid(),
  status: z.union([z.literal('not paid'), z.literal('paid')]),
  models: z.array(SurveyModelSchema)
});

export const SurveyStatisticSummarySchema = z.record(z.string(), z.record(z.string(), z.number()));