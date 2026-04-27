import { z } from 'zod';

const addressFields = {
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
    email: z.string().trim().email('E-mail inválido'),
};

const individualSubscriberSchema = z.object({
    subscriberType: z.literal('individual'),
    ...addressFields,
    fullName: z.string().trim().min(1, 'Nome completo é obrigatório'),
    sex: z.string().trim().min(1, 'Sexo é obrigatório'),
    birthDate: z.string().trim().min(1, 'Data de nascimento é obrigatória'),
    identityNumber: z.string().trim().min(1, 'Identidade é obrigatória'),
    cpf: z
        .string()
        .trim()
        .regex(/^\d{11}$/, 'CPF deve conter 11 dígitos numéricos'),
});

const corporateSubscriberSchema = z.object({
    subscriberType: z.literal('corporate'),
    ...addressFields,
    corporateName: z.string().trim().min(1, 'Razão social é obrigatória'),
    cnpj: z
        .string()
        .trim()
        .regex(/^\d{14}$/, 'CNPJ deve conter 14 dígitos numéricos'),
    contactResponsible: z.string().trim().min(1, 'Responsável de contato é obrigatório'),
});

export const registerSubscriberSchema = z.discriminatedUnion('subscriberType', [
    individualSubscriberSchema,
    corporateSubscriberSchema,
]);

export type RegisterSubscriberInput = z.infer<typeof registerSubscriberSchema>;
