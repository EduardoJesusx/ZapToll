import { PrismaClient } from '@prisma/client'
import { NextApiHandler } from 'next'

const prisma = new PrismaClient({})

const handler: NextApiHandler = async (request, response) => {
  const id = request.body.id

  let message: any = { error: 'error', message: 'Cara, deu ruim' } // eslint-disable-line

  try {
    message = await main(Number(id))
  } catch (err) {
    console.log('[message] message not found')
    console.log(err)
  }

  prisma.$disconnect()

  response.send(message)
}

async function main (id: number) {
  console.log(`[message] getting message with id: ${id}`)

  const message = await prisma.message.findUnique({
    where: {
      id
    },
    include: {
      mensageBlocks: {
        include: {
          delayBlock: true,
          textBlock: true
        }
      }
    }
  })

  console.log('[message] got message')

  return message
}

export default handler
