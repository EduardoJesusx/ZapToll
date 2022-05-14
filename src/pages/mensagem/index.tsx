import React, { useEffect, useState } from 'react'

import {
  Box,
  chakra,
  Flex,
  LinkBox,
  Text,
  useDisclosure
} from '@chakra-ui/react'

import { motion } from 'framer-motion'

import { AiOutlinePlus } from 'react-icons/ai'

import { MessageLayout } from '../../components/MessageLayout'
import { NewMessage } from '../../components/NewMessage'
import { api } from '../../services/api'
import { Message } from '../../components/Message'
import { BiHash } from 'react-icons/bi'

const IconAiOutlinePlus = chakra(AiOutlinePlus)

type Tmessage = {
  id: number,
  name: string,
  createdAt: string,
  updatedAt: string
}

const MotionBox = motion(Box)

const MessagesPage: React.FC = () => {
  const [messages, setMessges] = useState<Tmessage[]>([])
  const [messageId, setMessageId] = useState<number>()

  const { isOpen: isNewMessageOpen, onOpen: onNewMessageOpen, onClose: initialOnNewMessageClose } = useDisclosure()
  const { isOpen: isMessageOpen, onOpen: initialOnMessageOpen, onClose: initialOnMessageClose } = useDisclosure()

  async function getMessages () {
    const response = await api.get('http://localhost:3000/api/message/all')
    setMessges(response.data)
  }

  function onNewMessageClose () {
    initialOnNewMessageClose()
    getMessages()
  }

  function onMessageOpen (id: number) {
    setMessageId(id)
    initialOnMessageOpen()
  }

  useEffect(() => {
    getMessages()
  }, [])

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <>
      <MessageLayout>
        <Box width="100%" maxWidth="1000px" marginTop="6">
          <Flex flexDirection="column" gap={2}>
            <LinkBox onClick={onNewMessageOpen}>
              <MotionBox
                w='100%'
                padding="0"
                borderRadius={3}
                variants={item}
                duration={0.3}
                cursor="pointer"
                whileHover={{
                  color: '#333'
                }}
              >
                <Flex alignItems="center" paddingX="6" paddingY="3" border='2px dashed' borderRadius="sm" borderColor='gray.300'>
                  <IconAiOutlinePlus fontSize="20" />
                  {/* <LinkOverlay href="/mensagem/nova">
                  </LinkOverlay> */}
                  <Text marginLeft="5" fontSize="sm" fontWeight="medium">Adicionar mensagem</Text>
                </Flex>
              </MotionBox>
            </LinkBox>
              {messages.map((message) => (
                <LinkBox onClick={() => onMessageOpen(message.id)} key={message.id}>
                  <MotionBox
                    w='100%'
                    boxShadow="base"
                    backgroundColor="white"
                    padding="2"
                    borderRadius="md"
                    variants={item}
                    cursor="pointer"
                    whileHover={{
                      backgroundColor: '#086F83',
                      color: 'white'
                    }}
                  >
                    <Flex alignItems="center" paddingX="4" paddingY="3" borderColor='gray.200'>
                      <BiHash opacity={0.6} size={20} />
                      <Text marginLeft="5" fontSize="sm" fontWeight="medium">{message.name}</Text>
                    </Flex>
                  </MotionBox>
                </LinkBox>
              ))}
            </Flex>
        </Box>
      </MessageLayout>
      <NewMessage isOpen={isNewMessageOpen} onClose={onNewMessageClose} />
      <Message id={messageId} isOpen={isMessageOpen} onClose={initialOnMessageClose} />
    </>
  )
}

export default MessagesPage
