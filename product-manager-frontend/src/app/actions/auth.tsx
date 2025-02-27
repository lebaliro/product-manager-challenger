import {SignupFormSchema, FormState} from '@/app/lib/definitions'

export async function signup(state: FormState, formData: FormData) {
  const cpf = formData.get('cpf')

  try {
    const validatedFields = SignupFormSchema.safeParse({
      cpf,
    })

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    // Faz a requisição para a API externa
    console.log('cpf ==>', JSON.stringify({cpf}))
    const response = await fetch(
      'https://humble-space-parakeet-6r7ggqw9vrp24xgr-3000.app.github.dev/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify({cpf}),
      },
    )

    if (!response.ok) {
      throw new Error('Erro ao enviar dados para a API externa')
    }

    const data = await response.json()
    return {success: true, message: 'Dados enviados com sucesso!', data}
  } catch (error) {
    console.error('Erro:', error)
    return {success: false, message: 'Erro ao enviar dados.'}
  }
}
