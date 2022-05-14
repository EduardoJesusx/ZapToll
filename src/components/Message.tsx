import React, { useEffect, useState } from 'react'

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text
} from '@chakra-ui/react'

import { api } from '../services/api'
import { IoMdTimer } from 'react-icons/io'

interface MessageProps {
  id: number | undefined
  isOpen: boolean
  onClose: () => void
}

type TMessage = {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  mensageBlocks: Array<any> // eslint-disable-line
}

interface ShippingMessageProps {
  currentMessage: TMessage
}

export const Message: React.FC<MessageProps> = ({ id, isOpen, onClose }) => {
  const [currentMessage, setCurrentMessage] = useState({} as TMessage)
  console.log(currentMessage)

  useEffect(() => {
    if (!id) return

    api.post('http://localhost:3000/api/message/', { id }).then(({ data }) => {
      setCurrentMessage(data)
    })
  }, [id])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{currentMessage.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Tabs>
            <TabList>
              <Tab>Corpo da mensagem</Tab>
              <Tab>Configuração</Tab>
              <Tab>Enviar</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <ShippingBody currentMessage={currentMessage} />
              </TabPanel>
              <TabPanel>
                <ConfigMessage currentMessage={currentMessage} />
              </TabPanel>
              <TabPanel>
                <p>three!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
            <Button
              colorScheme='blue'
              mr={3}
              onClick={ () => {
                onClose()
              }}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                onClose()
              }}
            >
              Cancel
            </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const ShippingBody: React.FC<ShippingMessageProps> = ({ currentMessage }) => {
  if (!currentMessage.name) return <Spinner color='teal' />

  return (
    <Box width="100%">
      <Flex flexDirection="column" width="60%" margin="auto" gap={2}>
        {currentMessage.mensageBlocks.map((messageBlock) => {
          if (messageBlock.type === 'text') {
            return (
              <Box key={messageBlock.id} as="pre" backgroundColor="gray.200" borderRadius="md" padding={2}>
                <Text >{messageBlock.textBlock.text}</Text>
              </Box>
            )
          }

          return (
            <Box key={messageBlock.id} display="flex" alignItems="center" backgroundColor="red.200" borderRadius="md" padding={2}>
              <IoMdTimer />
              <Text marginLeft={2}>{messageBlock.delayBlock.delay}</Text>
            </Box>
          )
        })}
      </Flex>
    </Box>
  )
}

const ConfigMessage: React.FC<ShippingMessageProps> = ({ currentMessage }) => {
  if (!currentMessage.name) return <Spinner color='teal' />

  return (
    <Box width="100%">
      <FormControl>
        <FormLabel>Nome</FormLabel>
        <Input placeholder="Nome" value={currentMessage.name} />
      </FormControl>

    </Box>
  )
}
