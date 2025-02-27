import {NextResponse} from 'next/server'

export async function POST(req: Request) {
  try {
    const {cpf} = await req.json()

    // Fazendo a requisição para a API externa
    const response = await fetch(
      'https://api-product-manager-938681356416.us-central1.run.app',
      {method: 'POST', body: JSON.stringify({cpf})},
    )

    const data = await response.json()

    // Retornando a resposta para o cliente
    return NextResponse.json(data)
  } catch (error) {
    // Tratamento de erro
    return NextResponse.json({error: 'Erro ao buscar dados'}, {status: 500})
  }
}
