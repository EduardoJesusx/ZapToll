import { PrismaClient } from '@prisma/client'
import { NextApiHandler } from 'next'

const prisma = new PrismaClient({})

const handler: NextApiHandler = async (request, response) => {
  const {
    id,
    name,
    color,
    nickname,
    status
  } = request.body

  let tag: any = { error: 'error', message: 'Cara, deu ruim' } // eslint-disable-line

  try {
    tag = await main(id, name, color, nickname, status)
  } catch (err) {
    console.log('[tag] tag not updated')
    console.log(err)
  }

  prisma.$disconnect()

  response.send(tag)
}

async function main (id: string, name: string, color: string, nickname: string, status: boolean) {
  console.log('[tag] updating tag')

  const tag = await prisma.contactTag.update({
    where: {
      id: Number(id)
    },
    data: {
      name,
      color,
      nickname,
      status
    }
  })

  console.log('[tag] tag updated')
  console.log(tag)

  return tag
}

export default handler
