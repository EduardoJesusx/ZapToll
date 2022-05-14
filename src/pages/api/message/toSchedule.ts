import { PrismaClient } from '@prisma/client'
import { NextApiHandler } from 'next'
import { api } from '../../../services/api'

const prisma = new PrismaClient({})

const handler: NextApiHandler = async (request, response) => {
  const { id, to, time } = request.body

  let message: any = { error: 'error', message: 'Cara, deu ruim' }

  try {
    message = await main(id, to, time)
  } catch (err) {
    console.log('[message] message not scheduled')
    console.log(err)
  }

  prisma.$disconnect()

  response.send(message)
}

async function main (id: number, to: string, time: number) {
  const message = await prisma.message.findUnique({
    where: {
      id
    },
    include: {
      mensageBlocks: {
        include: {
          textBlock: true,
          delayBlock: true
        }
      }
    }
  })

  if (!message) throw new Error('[message] message not found')

  console.log(message)
  console.log('[message] scheduling message')

  setTimeout(async () => {
    for (const block of message.mensageBlocks) {
      console.log(block)

      if (block.type === 'text') {
        await api.post('http://localhost:3333/text', {
          to,
          text: block.textBlock?.text
        })
      }

      if (block.type === 'delay') {
        await api.post('http://localhost:3333/digitando', { to })
        await delay(Number(block.delayBlock?.delay) * 1000)
      }
    }
  }, time * 1000)

  console.log('[message] message scheduled')

  return { message }
}

const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time)) // in milliseconds

export default handler
