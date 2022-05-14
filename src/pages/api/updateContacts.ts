import { NextApiHandler } from 'next'

import { PrismaClient } from '@prisma/client'
import { api } from '../../services/api'

const prisma = new PrismaClient({})

const handler: NextApiHandler = async (request, response) => {
  let contacts = null

  try {
    console.log('> Updating all contacts')
    contacts = await main()
    console.log('> Updated all contacts')
  } catch (err) {
    console.log(err)
  }

  await prisma.$disconnect()

  return response.json({ contacts })
}

async function main () {
  const { data } = await api.get('/')

  const formatedContacts = data.contacts.map((contact: any) => ({
    WAId: contact.id._serialized,
    isBusiness: contact.isBusiness,
    isEnterprise: contact.isEnterprise,
    isMe: contact.isMe,
    isMyContact: contact.isMyContact,
    isPSA: contact.isPSA,
    isUser: contact.isUser,
    isVerified: `${contact.isVerified}`,
    isWAContact: `${contact.isWAContact}`,
    plaintextDisabled: contact.plaintextDisabled,
    pushname: `${contact.pushname}`,
    sectionHeader: `${contact.sectionHeader}`,
    shortName: `${contact.shortName}`,
    statusMute: contact.statusMute,
    type: `${contact.type}`,
    verifiedLevel: `${contact.verifiedLevel}`,
    verifiedName: `${contact.verifiedName}`,
    name: `${contact.name}`
  }))

  const contacts = await prisma.contact.findMany({
    select: {
      id: true,
      WAId: true
    }
  })

  contacts.forEach(async ({ id, WAId }) => {
    if (formatedContacts.find((formatedContact: any) => formatedContact.WAId === WAId)) return

    await prisma.contact.update({
      where: {
        id
      },
      data: {
        status: false
      }
    })
  })

  formatedContacts.forEach(async ({ WAId, updatedAt, status, ...rest }: any) => {
    const [contact] = await prisma.contact.findMany({
      where: {
        WAId: WAId
      }
    })

    if (!contact) return

    await prisma.contact.upsert({
      where: {
        id: contact.id
      },
      update: {
        WAId,
        status,
        ...rest
      },
      create: {
        WAId,
        status,
        ...rest
      }
    })
  })

  const returnContacts = await prisma.contact.findMany()

  console.log(returnContacts)

  return returnContacts
}

export default handler
