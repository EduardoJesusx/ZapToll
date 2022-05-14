import { FormEvent, useState } from 'react'

import {
  Box,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Image,
  Text,
  Heading,
  chakra,
  LinkBox,
  LinkOverlay,
  Divider,
  Skeleton,
  Link
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

import { BiMessage, BiTimer } from 'react-icons/bi'
import { GoGraph } from 'react-icons/go'
import { FiLogOut } from 'react-icons/fi'
import { AiOutlineTags } from 'react-icons/ai'

import { api } from '../services/api'

const IconBiTimer = chakra(BiTimer)
const IconBiMessage = chakra(BiMessage)
const IconGoGraph = chakra(GoGraph)
const IconAiOutlineTags = chakra(AiOutlineTags)

const MotionGrid = motion(Grid)
const MotionGridItem = motion(GridItem)

export default function Home () {
  const [message, setMessage] = useState('')

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  async function handleSubmit (event: FormEvent) {
    event.preventDefault()

    const { data } = await api.post('text', {
      text: message,
      to: '554784471100@c.us'
    })

    setMessage('')

    console.log(data)
  }

  return (
    <>
      <Flex
        width="100%"
        minHeight="100vh"
        alignItems="center"
        flexDirection="column"
        backgroundColor="gray.50"
        paddingTop={[
          '400px',
          '400px',
          '0'
        ]}
      >
        <Box maxWidth="1000px" zIndex={5} width="90%" margin="auto" transform="translateY(25%)" borderRadius="md" boxShadow="xl" backgroundColor="white">
          <Flex as="header" backgroundColor="white" padding="3" justifyContent="space-between" alignItems="center">
            <Flex>
              {/* <Image
                marginLeft="4"
                borderRadius="md"
                width="100px"
                src="logo.jpg"
                alt="Dan Abramov"
              /> */}

              <Image
                marginLeft="4"
                borderRadius="full"
                boxSize="50px"
                src="https://bit.ly/dan-abramov"
                alt="Dan Abramov"
              />

              <Box marginLeft="4">
                <Text lineHeight="1" fontFamily="Nunito" fontWeight="bold">Eugenio Silveira</Text>
                <Text fontSize="sm" color="gray">Gerente Comercial</Text>
              </Box>
            </Flex>

            <Box>
              <IconButton colorScheme="teal" aria-label="sair" icon={<FiLogOut />} />
            </Box>
          </Flex>

          <Divider />

          {/* <Flex as="form" padding="3" gap="6" onSubmit={handleSubmit}>
            <Input placeholder="Mensagem" value={message} onChange={(event) => setMessage(event.target.value)} />
            <IconButton aria-label="Enviar mensagem" colorScheme="green" icon={<FaPaperPlane />} type="submit" />
          </Flex> */}

          <MotionGrid
            marginTop={4}
            as="section"
            padding="3"
            onSubmit={handleSubmit}
            templateColumns={[
              '1fr',
              '1fr',
              'repeat(3, 1fr)'
            ]}
            gap={7}
            variants={container}
          >
            <LinkBox>
              <MotionGridItem
                width="100%"
                bgGradient='linear(to-r, teal.500, teal.500, green.500)'
                boxShadow="xl"
                color="white"
                borderRadius="lg"
                padding="3"
                whileHover={{ scale: 1.01, y: -10 }}
                variants={item}
              >
                <LinkOverlay href='mensagem'>
                  <Heading display="flex" fontSize="2.3rem" alignItems="center">
                    <IconBiTimer size={120} paddingRight="4" />
                    Agendar Mensagem
                  </Heading>
                </LinkOverlay>
                <Text>Agende mensagens para não se preocupar</Text>
              </MotionGridItem>
            </LinkBox>

            <LinkBox>
              <MotionGridItem
                minHeight="190px"
                width="100%"
                bgGradient='linear(to-r, tomato, , red.300, red.300)'
                boxShadow="xl"
                color="white"
                borderRadius="lg"
                padding="3"
                whileHover={{ scale: 1.01, y: -10 }}
                variants={item}
              >
                <LinkOverlay href='tag'>
                  <Heading minHeight="120px" display="flex" fontSize="2.3rem" alignItems="center">
                    <IconAiOutlineTags size={100} paddingRight="4" />
                    Tag
                  </Heading>
                </LinkOverlay>
                <Text>Sua lista de tags</Text>
              </MotionGridItem>
            </LinkBox>

            <LinkBox>
              <MotionGridItem
                minHeight="190px"
                width="100%"
                bgGradient='linear(to-r, purple.300, , pink.300, pink.300)'
                boxShadow="xl"
                color="white"
                borderRadius="lg"
                padding="3"
                whileHover={{ scale: 1.01, y: -10 }}
                variants={item}
              >
                <LinkOverlay href='contatos'>
                  <Heading minHeight="120px" display="flex" fontSize="2.3rem" alignItems="center">
                    <IconBiMessage size={100} paddingRight="4" />
                    Contatos
                  </Heading>
                </LinkOverlay>
                <Text>Sua lista de contatos</Text>
              </MotionGridItem>
            </LinkBox>

            <LinkBox>
              <MotionGridItem
                minHeight="190px"
                maxWidth={[
                  '100%',
                  '100%',
                  '300px'
                ]}
                width="100%"
                bgGradient='linear(to-r, red.300, red.300, yellow.300)'
                boxShadow="xl"
                color="white"
                borderRadius="lg"
                padding="3"
                whileHover={{ scale: 1.01, y: -10 }}
                variants={item}
              >
                <LinkOverlay href='#'>
                  <Heading minHeight="120px" display="flex" fontSize="2.3rem" alignItems="center">
                    <IconGoGraph size={100} paddingRight="5" />
                    Ferramentas
                  </Heading>
                </LinkOverlay>
                <Text>Ferramentas que te auciliam na analize dos dados</Text>
              </MotionGridItem>
            </LinkBox>
          </MotionGrid>

          <Flex padding={3} overflow="hidden" flexWrap="nowrap" flexDir="row" gap="6">
            <Skeleton>
              <Box width="500px" height="60" borderRadius="md" background="gray.50"></Box>
            </Skeleton>
            <Skeleton>
              <Box width="500px" height="60" borderRadius="md" background="gray.50"></Box>
            </Skeleton>
          </Flex>
        </Box>

        <Flex width="100%" alignItems="center" justifyContent="center" backgroundColor="gray.50" flexDir="column" marginTop={5}>
          <Text fontFamily="Nunito" fontWeight="400">Dirigido por </Text>
          <Image
            src="aguaroxa.jpg"
            width={70}
          />
          <Link href="https://api.whatsapp.com/send?phone=5547984471100" target="_blank">(47) 98447-1100</Link>
        </Flex>
      </Flex>

    </>
  )
}
