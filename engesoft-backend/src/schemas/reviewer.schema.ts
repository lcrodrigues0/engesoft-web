import { z } from 'zod';

export const registerReviewerSchema = z.object({
    institutionName: z.string().trim().min(1, 'Nome da instituição é obrigatório'),
    street: z.string().trim().min(1, 'Logradouro é obrigatório'),
    number: z.string().trim().min(1, 'Número é obrigatório'),
    complement: z.string().trim().optional(),
    neighborhood: z.string().trim().min(1, 'Bairro é obrigatório'),
    city: z.string().trim().min(1, 'Cidade é obrigatória'),
    stateUf: z
        .string()
        .trim()
        .toUpperCase()
        .regex(/^[A-Z]{2}$/, 'UF deve ter 2 letras'),
    zipCode: z
        .string()
        .trim()
        .regex(/^\d{8}$/, 'CEP deve conter 8 dígitos numéricos'),
    expertiseAreasIds: z
        .array(z.string().trim().min(1))
        .min(1, 'Selecione pelo menos um tema de habilitação'),
});

export type RegisterReviewerInput = z.infer<typeof registerReviewerSchema>;
