import { PrismaClient } from '@prisma/client'
import { NextApiHandler } from 'next'

const prisma = new PrismaClient({})

const handler: NextApiHandler = async (request, response) => {
  let messages: any = { error: 'error', message: 'Cara, deu ruim' } // eslint-disable-line

  try {
    messages = await main()
  } catch (err) {
    console.log('[message] messages not found')
    console.log(err)
  }

  prisma.$disconnect()

  response.send(messages)
}

async function main () {
  console.log('[message] getting all messages')

  const messages = await prisma.message.findMany()

  console.log('[message] got all messages')

  return messages
}

export default handler
