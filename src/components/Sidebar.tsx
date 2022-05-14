import React, { useEffect } from 'react'

import { Box, chakra, Flex, IconButton, Tooltip } from '@chakra-ui/react'
import { AnimatePresence, motion, useCycle } from 'framer-motion'

import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { TiMessages } from 'react-icons/ti'
import { SiChatbot } from 'react-icons/si'
import Link from 'next/link'
import { BiMessage, BiTimer } from 'react-icons/bi'
import { AiOutlineTags } from 'react-icons/ai'

const MotionDiv = chakra(motion.div)

const IconBiTimer = chakra(BiTimer)
const IconAiOutlineTags = chakra(AiOutlineTags)
const IconBiMessage = chakra(BiMessage)

export const Sidebar: React.FC = () => {
  const [open, cycleOpen] = useCycle(false, true)

  const option = [
    { icon: IconBiTimer, name: 'Mensagens', link: '/mensagem' },
    { icon: IconAiOutlineTags, name: 'Tags', link: '/tag' },
    { icon: IconBiMessage, name: 'Contatos', link: '/contatos' }
  ]

  useEffect(() => {
    console.log(open)
  }, [open])

  const sideVariants = {
    closed: {
      transition: {
        staggerChildren: 0.2,
        staggerDirection: -1
      }
    },
    open: {
      transition: {
        staggerChildren: 0.2,
        staggerDirection: 1
      }
    }
  }

  return (
    <>
      <AnimatePresence>
        <Flex
          position="fixed"
          zIndex={100}
          left="0"
          top="0"
          flexDirection="column"
          justifyContent="space-between"
          backgroundColor="blue.800"
          borderLeft="black"
          height="100vh"
          paddingX="3"
          paddingY="7"
          boxShadow="md"
        >
          <Box width="100%" paddingX="auto">
            <Link href="/">
              <SiChatbot cursor="pointer" color="white" size="30" />
            </Link>
          </Box>
          {open
            ? (
            <MotionDiv
              initial={{ width: 0 }}
              animate={{
                width: 300
              }}
              exit={{
                width: 0,
                transition: { delay: 0.2, duration: 0.3 }
              }}
            >
              <MotionDiv
                display="flex"
                flexDirection="column"
                gap={3}
                className="container"
                initial="closed"
                animate="open"
                exit="closed"
                variants={sideVariants}
              >
                <Flex width="100%">
                  <TiMessages size={60} color="white" />
                </Flex>
              </MotionDiv>
            </MotionDiv>
              )
            : (
            <MotionDiv
              initial={{ width: 0 }}
              animate={{
                width: 40,
                transition: { delay: 0.2, duration: 0.3 }
              }}
            >
              <MotionDiv
                display="flex"
                flexDirection="column"
                gap={3}
                className="container"
                initial="closed"
                animate="open"
                exit="closed"
                variants={sideVariants}
              >
                {option.map((item) => (
                  <Tooltip key={item.link} hasArrow placement='right' label={item.name}>
                    <Flex width="100%" cursor="pointer">
                      <Link href={item.link}>
                        <item.icon size={30} color="white" />
                      </Link>
                    </Flex>
                  </Tooltip>
                ))}
              </MotionDiv>
            </MotionDiv>
              )}

            <IconButton
              aria-label={open ? 'minimisar' : 'ampliar'}
              fontSize={30}
              icon={open ? <MdOutlineKeyboardArrowLeft /> : <MdOutlineKeyboardArrowRight />}
              colorScheme="blue"
              variant="ghost"
              onClick={() => cycleOpen()}
            />
          </Flex>
      </AnimatePresence>
    </>
  )
}
