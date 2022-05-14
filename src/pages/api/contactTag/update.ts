import { PrismaClient } from '@prisma/client'
import { NextApiHandler } from 'next'

const prisma = new PrismaClient()

const handler: NextApiHandler = async (request, response) => {
  let contactTag = null
  const {
    id,
    name,
    color,
    nickname,
    contacts
  } = request.body

  try {
    contactTag = await main({
      id,
      name,
      color,
      nickname,
      contacts
    })
  } catch (err) {
    console.log(err)
  }

  await prisma.$disconnect()

  return response.json({ contactTag })
}

async function main ({ id, name, color, nickname, contacts }: { id: number, name: string, color: string, nickname: string, contacts: Array<number> }) {
  await prisma.contactTag.update({
    where: {
      id
    },
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
