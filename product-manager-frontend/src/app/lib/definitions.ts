import {z} from 'zod'

export const SignupFormSchema = z.object({
  cpf: z.string().trim(),
})

export type FormState =
  | {
      errors?: {
        cpf?: string[]
      }
      message?: string
    }
  | undefined
