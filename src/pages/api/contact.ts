import { PrismaClient } from '@prisma/client'
import { NextApiHandler } from 'next'

const prisma = new PrismaClient({})

const handler: NextApiHandler = async (request, response) => {
  let contacts: any = { error: 'error', message: 'Cara, deu ruim' } // eslint-disable-line

  const {
    name,
    tagsthatcanhave,
    tagsthatcanthave,
    page
  } = request.query

  console.log(tagsthatcanthave)

  try {
    contacts = await main(
      String(name),
      typeof tagsthatcanhave === 'string' && JSON.parse(tagsthatcanhave),
      typeof tagsthatcanthave === 'string' && JSON.parse(tagsthatcanthave),
      Number(page)
    )
  } catch (err) {
    console.log('[contact] contacts not found')
    console.log(err)
  }

  prisma.$disconnect()

  response.send(contacts)
}

async function main (name: string, tagsthatcanhave: Array<string>, tagsthatcanthave: Array<string>, page: number) {
  const paragraphs = 100
  console.log(`[contact] getting all contacts or contacts with name: ${name}, tagsthatcanhave: ${tagsthatcanhave}, tagsthatcanthave: ${tagsthatcanthave} and page: ${page}`)
  const contacts = await prisma.contact.findMany({
    select: {
      id: true,
      name: true,
      WAId: true,
      contactTag: {
        include: {
          contactTag: true
        }
      }
    },
    take: paragraphs,
    skip: page ? (page - 1) * paragraphs : 0,
    where: {
      name: {
        contains: name
      },
      contactTag: tagsthatcanhave.length > 0
        ? {
            some: {
              AND: [
                {
                  contactTag: {
                    id: {
                      in: tagsthatcanhave.map(id => Number(id))
                    },
                    AND: {
                      id: {
                        notIn: tagsthatcanthave.map(id => Number(id))
                      }
                    }
                  }
                },
                {
                  contactTag: {
                    status: true
                  }
                }
              ]
            }
          }
        : {
            every: {
              AND: [
                {
                  contactTag: {
                    id: {
                      notIn: tagsthatcanthave.map(id => Number(id))
                    }
                  }
                },
                {
                  contactTag: {
                    status: true
                  }
                }
              ]
            }
          }
    }
  })

  const count = await prisma.contact.count()

  const organisedContacts = contacts.map((contact: any) => ({ // eslint-disable-line
    id: contact.id,
    name: contact.name,
    WAId: contact.WAId,
    contactTag: contact.contactTag.map(({ createdAt, contactTag }: any) => ({ // eslint-disable-line
      date: createdAt.toLocaleString('pt-BR'),
      tag: {
        id: contactTag.id,
        name: contactTag.name,
        color: contactTag.color
      }
    }))
  }))

  console.log('[contact] got all contacts')

  return {
    page: page || 1,
    count,
    paragraphs,
    contacts: organisedContacts
  }
}

export default handler
