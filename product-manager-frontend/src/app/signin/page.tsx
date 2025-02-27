'use client'

import {signup} from '@/app/actions/auth'
import {useActionState} from 'react'

export default function LoginPage() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <form action={action}>
      <div>
        <label htmlFor="name">CPF</label>
        <input id="name" name="cpf" placeholder="Name" />
      </div>
      {state?.errors?.cpf && <p>{state.errors.cpf}</p>}

      <button disabled={pending} type="submit">
        Sign Up
      </button>
    </form>
  )
}
