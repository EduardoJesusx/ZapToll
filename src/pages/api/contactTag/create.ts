import { PrismaClient } from '@prisma/client'
import { NextApiHandler } from 'next'

const prisma = new PrismaClient()

const handler: NextApiHandler = async (request, response) => {
  let tags = null
  const {
    name,
    color,
    nickname,
    contacts
  } = request.body

  try {
    tags = await main({
      name,
      color,
      nickname,
      contacts
    })
  } catch (err) {
    console.log(err)
  }

  await prisma.$disconnect()

  return response.json({ tags })
}

async function main ({ name, color, nickname, contacts }: { name: string, color: string, nickname: string, contacts: Array<number> }) {
  await prisma.contactTag.create({
    data: {
      name,
      color,
      nickname,
      contacts: {
        connect: contacts.map(contact => ({ id: contact }))
      }
    }
  })

  const returnContactTags = await prisma.contactTag.findMany()

  console.log(returnContactTags)

  return returnContactTags
}

export default handler
