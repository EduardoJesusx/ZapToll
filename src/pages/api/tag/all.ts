import { PrismaClient } from '@prisma/client'
import { NextApiHandler } from 'next'

const prisma = new PrismaClient({})

const handler: NextApiHandler = async (request, response) => {
  const {
    active,
    inactive
  }: any = request.query // eslint-disable-line

  let tags: any = { error: 'error', message: 'Cara, deu ruim' } // eslint-disable-line
  console.log(`[tag] a active: ${active}, inactive: ${inactive}`)

  try {
    tags = await main(active ? JSON.parse(active) : false, inactive ? JSON.parse(inactive) : false)
    console.log(tags)
  } catch (err) {
    console.log('[tag] tags not found')
    console.log(err)
  }

  prisma.$disconnect()

  response.send(tags)
}

async function main (active: boolean, inactive: boolean) {
  console.log('[tag] getting all tags')

  console.log({ active, inactive })

  let tags: any = [] // eslint-disable-line

  if (active === inactive && !active) return tags

  tags = await prisma.contactTag.findMany({
    where: {
      OR: [
        { status: active },
        { status: !inactive }
      ]
    }
  })

  console.log('[tag] got all tags')

  return tags
}

export default handler
