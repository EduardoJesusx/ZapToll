import { PrismaClient } from '@prisma/client'
import { NextApiHandler } from 'next'
import { api } from '../../../services/api'
// import { api } from '../../../services/api'

const prisma = new PrismaClient({})

const handler: NextApiHandler = async (request, response) => {
  const { id, to } = request.body

  let message: any = { error: 'error', message: 'Cara, deu ruim' }

  try {
    message = await main(id, to)
  } catch (err) {
    console.log('[message] message not sent')
    console.log(err)
  }

  prisma.$disconnect()

  response.send(message)
}

async function main (id: number, to: string) {
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
  console.log('[message] sending message')

  // await api.post('http://localhost:3333/send', {
  //   to,
  //   message: message.mensageBlocks.map((block: any) => {
  //     return {
  //       type: block.type,
  //       index: block.index,
  //       textBlock: block.textBlock && block.textBlock.text,
  //       delayBlock: block.delayBlock && block.delayBlock.delay
  //     }
  //   })
  // })

  for (const block of message.mensageBlocks) {
    console.log(block)

    if (block.type === 'text') {
      await api.post('http://localhost:3333/text', {
        to,
        text: block.textBlock?.text
      })
    }

    if (block.type === 'delay') {
      console.log(Number(block.delayBlock?.delay) * 1000)
      await api.post('http://localhost:3333/digitando', { to })
      await delay(Number(block.delayBlock?.delay) * 1000)
    }
  }

  console.log('[message] message sent')

  return { message }
}

const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time)) // in milliseconds

export default handler
