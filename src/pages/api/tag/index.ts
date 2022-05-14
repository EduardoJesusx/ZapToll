import { PrismaClient } from '@prisma/client'
import { NextApiHandler } from 'next'

const prisma = new PrismaClient({})

const handler: NextApiHandler = async (request, response) => {
  const id = request.body.id

  let tag: any = { error: 'error', message: 'Cara, deu ruim' } // eslint-disable-line

  try {
    tag = await main(id)
  } catch (err) {
    console.log(`[tag] tag with id: ${id} not found`)
    console.log(err)
  }

  prisma.$disconnect()

  response.send(tag)
}

async function main (id: string) {
  console.log(`[tag] getting tag with id: ${id}`)

  const tag = await prisma.contactTag.findUnique({
    where: {
      id: Number(id)
    }
  })

  console.log(`[tag] got tag with id: ${id}`)

  return tag
}

export default handler
