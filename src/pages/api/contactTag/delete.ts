import { PrismaClient } from '@prisma/client'
import { NextApiHandler } from 'next'

const prisma = new PrismaClient()

const handler: NextApiHandler = async (request, response) => {
  let contactTag = null
  const { id } = request.body

  try {
    contactTag = await main({ id })
  } catch (err) {
    console.log(err)
  }

  await prisma.$disconnect()

  return response.json({ contactTag })
}

async function main ({ id }: { id: number }) {
  await prisma.contactTag.delete({
    where: {
      id
    }
  })

  const returnContactTags = await prisma.contactTag.findMany()

  console.log(returnContactTags)

  return returnContactTags
}

export default handler
