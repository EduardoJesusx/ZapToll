import { PrismaClient } from '@prisma/client'
import { NextApiHandler } from 'next'

const prisma = new PrismaClient({})

const handler: NextApiHandler = async (request, response) => {
  const {
    contactsId,
    tagsId
  } = request.body

  let contactToTag: any = { error: 'error', message: 'Cara, deu ruim' } // eslint-disable-line

  try {
    contactToTag = await main(contactsId, tagsId)
  } catch (err) {
    console.log('[contact to tag] relationship not created')
    console.log(err)
  }

  prisma.$disconnect()

  response.send(contactToTag)
}

async function main (contactsId: Array<number>, tagsId: Array<number>) {
  console.log('[contact to tag] Creating a relationship between contact and tag')

  let relation: Array<{ A: number, B: number }> = []

  contactsId.forEach(contactId => {
    relation = [
      ...relation,
      ...tagsId.map(tagId => ({
        A: contactId,
        B: tagId
      }))
    ]
  })

  const contactToTag = await prisma.contacttocontacttag.createMany({
    data: relation
  })

  console.log('[contact to tag] relationship created')
  console.log(contactToTag)

  return contactToTag
}

export default handler
