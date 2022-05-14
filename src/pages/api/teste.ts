import { NextApiHandler } from 'next'

import { PrismaClient } from '@prisma/client'
import { api } from '../../services/api'

const prisma = new PrismaClient({})

const handler: NextApiHandler = async (request, response) => {
  let contacts = null

  try {
    contacts = await main()
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

  await prisma.contact.deleteMany()

  await prisma.contact.createMany({
    data: formatedContacts
  })

  const returnContacts = await prisma.contact.findMany()

  console.log(returnContacts)

  return returnContacts
}

export default handler
