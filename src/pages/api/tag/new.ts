import { PrismaClient } from '@prisma/client'
import { NextApiHandler } from 'next'

const prisma = new PrismaClient({})

const handler: NextApiHandler = async (request, response) => {
  const {
    name,
    color,
    nickname
  } = request.body

  let tag: any = { error: 'error', message: 'Cara, deu ruim' } // eslint-disable-line

  try {
    tag = await main(name, color, nickname)
  } catch (err) {
    console.log('[tag] tag not created')
    console.log(err)
  }

  prisma.$disconnect()

  response.send(tag)
}

async function main (name: string, color: string, nickname: string) {
  console.log('[tag] creating tag')

  const tag = await prisma.contactTag.create({
    data: {
      name,
      color,
      nickname
    }
  })

  console.log('[tag] tag created')

  return tag
}

export default handler
