import { PrismaClient } from '@prisma/client'
import { NextApiHandler } from 'next'

const prisma = new PrismaClient({})

const handler: NextApiHandler = async (request, response) => {
  const {
    name,
    blocks
  } = request.body

  let message: any = { error: 'error', message: 'Cara, deu ruim' }

  try {
    message = await main(name, blocks)
  } catch (err) {
    console.log('[message] message not created')
    console.log(err)
  }

  prisma.$disconnect()

  response.send(message)
}

async function main (name: any, blocks: any) {
  const mensageBlocks = blocks.map((block: any, index: number) => {
    return {
      type: block.type,
      index,
      textBlock: block.textBlock && {
        create: { text: block.textBlock.text }
      },
      delayBlock: block.delayBlock && {
        create: { delay: block.delayBlock.delay }
      }
    }
  })

  console.log('[message] creating message')

  const message = await prisma.message.create({
    data: {
      name,
      mensageBlocks: {
        create: mensageBlocks
      }
    }
  })

  console.log('[message] message created')

  return message
}

export default handler
