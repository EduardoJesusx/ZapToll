import React, { useContext, useEffect, useRef, useState } from 'react'

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Editable,
  EditableInput,
  EditablePreview,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Text,
  Textarea
} from '@chakra-ui/react'

import { ImFileText } from 'react-icons/im'
import { RiQuestionnaireLine } from 'react-icons/ri'
import { IoMdTimer } from 'react-icons/io'
import { BsCardList, BsFillMenuButtonFill } from 'react-icons/bs'
import { BiVideoPlus } from 'react-icons/bi'
import { FaHourglassHalf, FaRegSave, FaRegTrashAlt } from 'react-icons/fa'
import { AiOutlineAudio, AiOutlineFieldNumber, AiOutlineFile } from 'react-icons/ai'

import { api } from '../services/api'
import { DialogContext } from '../context/DialogContext'

type TMessage = {
  id: string
  value: any // eslint-disable-line
  type: string
}

type TMessageText = {
  message: TMessage
  messages: Array<TMessage>
  setMessages: React.Dispatch<React.SetStateAction<TMessage[]>>
  setDisable: React.Dispatch<React.SetStateAction<boolean>>
}

type TItemButtonProps = {
  handleClick: () => void
  disabled?: boolean
}

export const NewMessage: React.FC<{ isOpen: any, onClose: any }> = ({ isOpen, onClose }) => { // eslint-disable-line
  const [disable, setDisable] = useState(false)
  const [messages, setMessages] = useState<TMessage[]>([])
  const [name, setName] = useState<string>('Nova mensagem')

  const { changeOpen, setTitle, setMessage } = useContext(DialogContext)

  const initialRef = useRef(null)

  useEffect(() => {
    console.log(messages)
  }, [messages])

  async function handleSave () {
    console.log(messages.map(block => {
      return {
        type: block.type,
        textBlock: block.type === 'text' && { text: block.value },
        delayBlock: block.type === 'delay' && { delay: block.value }
      }
    }))

    const { data } = await api.post('http://localhost:3000/api/message/new', {
      name,
      blocks: messages.map(block => {
        return {
          type: block.type,
          textBlock: block.type === 'text' ? { text: block.value } : undefined,
          delayBlock: block.type === 'delay' ? { delay: block.value } : undefined
        }
      })
    })

    console.log(data)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      initialFocusRef={initialRef}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Adicionar mensagem</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Editable defaultValue={name} fontSize="lg" transform="translateY(-70%)">
            <EditablePreview ref={initialRef} />
            <EditableInput value={name} onChange={event => setName(event.target.value)} />
          </Editable>

          <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={6}
          >
            {messages.map(message => (
              message.type === 'text'
                ? (
                  <TextMessage key={message.id} message={message} messages={messages} setMessages={setMessages} setDisable={setDisable} />
                  )
                : message.type === 'delay' && (
                  <DelayMessage key={message.id} message={message} messages={messages} setMessages={setMessages} setDisable={setDisable} />
                )
            ))}
          </Flex>

          {/* <Flex as="form" onSubmit={handleSubmit} marginTop="3">
            <Textarea placeholder="Mensagem" value={message} onChange={event => setMessage(event.target.value)} />
            <Button size='sm' padding="0.7rem" type="submit">
              Adicionar
            </Button>
          </Flex> */}

          {/* <Button size='sm' padding="0.7rem" type="submit" onClick={handleEntradaDoCliente}>
            Entrada do cliente
          </Button> */}
          <Grid width="70%" margin="auto" marginTop="30px" alignItems="center" justifyContent="center" flexWrap="wrap" gap={4} gridTemplateColumns="repeat(4, 1fr)" gridTemplateRows="repeat(4, 1fr)">
            {[
              {
                Icon: ImFileText,
                handle: () => {
                  setMessages([...messages, { id: `${Math.floor(Math.random() * 1000000)}`, value: '', type: 'text' }])
                },
                text: 'Texto'
              },
              {
                Icon: RiQuestionnaireLine,
                handle: () => {
                  setMessages([...messages, { id: `${Math.floor(Math.random() * 1000000)}`, value: '', type: 'query' }])
                },
                text: 'Pergunta'
              },
              {
                Icon: BsFillMenuButtonFill,
                handle: () => {
                  setMessages([
                    ...messages,
                    {
                      id: `${Math.floor(Math.random() * 1000000)}`,
                      value: [
                        {
                          id: `${Math.floor(Math.random() * 1000000)}`,
                          value: ''
                        },
                        {
                          id: `${Math.floor(Math.random() * 1000000)}`,
                          value: ''
                        }
                      ],
                      type: 'button'
                    }
                  ])
                },
                text: 'Botões'
              },
              {
                Icon: BsCardList,
                handle: () => {
                  setMessages([
                    ...messages,
                    {
                      id: `${Math.floor(Math.random() * 1000000)}`,
                      value: [
                        {
                          id: `${Math.floor(Math.random() * 1000000)}`,
                          value: ''
                        },
                        {
                          id: `${Math.floor(Math.random() * 1000000)}`,
                          value: ''
                        }
                      ],
                      type: 'menu'
                    }
                  ])
                },
                text: 'Menu'
              },
              {
                Icon: IoMdTimer,
                handle: () => {
                  setMessages([...messages, { id: `${Math.floor(Math.random() * 1000000)}`, value: '5', type: 'delay' }])
                },
                text: 'Aguardar'
              },
              {
                Icon: FaHourglassHalf,
                handle: () => {}, // eslint-disable-line
                text: 'Espera'
              },
              {
                Icon: AiOutlineFieldNumber,
                handle: () => {}, // eslint-disable-line
                text: 'Tentativas'
              },
              {
                Icon: AiOutlineFile,
                handle: () => {}, // eslint-disable-line
                text: 'Arquivo'
              },
              {
                Icon: AiOutlineAudio,
                handle: () => {}, // eslint-disable-line
                text: 'Audio'
              },
              {
                Icon: BiVideoPlus,
                handle: () => {}, // eslint-disable-line
                text: 'Vídeo'
              }
            ].map((item, index) => (
              <ItemButton
                key={index}
                disable={disable}
                handleClick={() => {
                  setDisable(true)
                  item.handle()
                }}
              >
                <item.Icon fontSize="25"></item.Icon>
                <Text textAlign="center" fontSize="sm" fontWeight="medium">{item.text}</Text>
              </ItemButton>
            ))}
          </Grid>
        </ModalBody>

        <ModalFooter>
            <Button
              isDisabled={disable}
              colorScheme='blue'
              mr={3}
              onClick={ () => {
                setTitle('Tem certeza de que deseja salvar?')
                setMessage('clique em confirmar para salvar a mensagem')

                changeOpen(true, async () => {
                  await handleSave()
                  onClose()
                  setMessages([])
                  setName('Nova mensagem')
                }, () => {}) // eslint-disable-line
              }}
            >
              Save
            </Button>
            <Button
              isDisabled={disable}
              onClick={() => {
                setTitle('Tem certeza?')
                setMessage('Todo o conteúdo será perdido!')

                changeOpen(true, () => {
                  setMessages([])
                  onClose()
                }, () => {}) // eslint-disable-line
              }}
            >
              Cancel
            </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const TextMessage: React.FC<TMessageText> = ({ message, messages, setMessages, setDisable }) => {
  const [messageText, setMessageText] = useState(message.value)

  const textAreaRef: any = useRef(null) // eslint-disable-line

  const { changeOpen, setTitle, setMessage } = useContext(DialogContext)

  function handleDelete () {
    setMessages(messages.filter(m => m.id !== message.id))
    setDisable(false)
  }

  function handleCancel () {} // eslint-disable-line

  function handleSave () {
    setMessages(messages.map(m => (m.id === message.id ? { ...m, value: textAreaRef.current.value } : m)))
    setDisable(false)
  }

  // create a function callet "changeText" to change the text selected in the textarea
  function changeText (signal: string) {
    if (!textAreaRef) return
    // get the text selected in the textarea
    const textSelected = textAreaRef.current.value.substring(
      textAreaRef.current.selectionStart,
      textAreaRef.current.selectionEnd
    )

    // and replace it with the text you want to replace
    const newText = textAreaRef.current.value.replace(textSelected, `${signal}${textSelected}${signal}`)
    textAreaRef.current.value = newText
  }

  return (
    <Box
      w="100%"
      maxWidth="1000px"
      padding={3}
      borderRadius="lg"
      borderColor='gray.200'
      border="1px dashed"
    >
      <Flex justifyContent="space-between">
        <Flex gap="2">
          <Button
            size="sm"
            margin="0"
            padding="0"
            colorScheme="teal"
            onClick={() => changeText('*')}
          >
            <Text fontWeight="bold" fontSize="md">B</Text>
          </Button>
          <Button
            size="sm"
            margin="0"
            padding="0"
            colorScheme="teal"
            onClick={() => changeText('_')}
          >
            <Text as="i" fontWeight="normal" fontSize="md">I</Text>
          </Button>
          <Button
            size="sm"
            margin="0"
            padding="0"
            colorScheme="teal"
            onClick={() => changeText('~')}
          >
            <Text as="s" fontWeight="normal" fontSize="md">S</Text>
          </Button>
        </Flex>

        <Flex gap="2">
          <IconButton
            colorScheme="blue"
            aria-label='Call Segun'
            size='sm'
            icon={<FaRegSave />}
            onClick={handleSave}
          />

          <IconButton
            colorScheme="red"
            aria-label='Call Segun'
            size='sm'
            icon={<FaRegTrashAlt />}
            onClick={() => {
              setTitle('Excluir')
              setMessage('Deseja excluir essa mensagem?')
              changeOpen(true, handleDelete, handleCancel)
            }}
          />
        </Flex>
      </Flex>

      <Textarea ref={textAreaRef} marginTop={3} value={messageText} onChange={event => setMessageText(event.target.value)} />
    </Box>
  )
}

const DelayMessage: React.FC<TMessageText> = ({ message, messages, setMessages, setDisable }) => {
  const [delay, setDelay] = useState(Number(message.value))

  const { changeOpen, setTitle, setMessage } = useContext(DialogContext)

  function handleDelete () {
    setMessages(messages.filter(m => m.id !== message.id))
    setDisable(false)
  }

  function handleCancel () {} // eslint-disable-line

  return (
    <Box
      w="100%"
      maxWidth="1000px"
      padding={3}
      borderRadius="lg"
      borderColor='gray.200'
      border="1px dashed"
    >
      <Flex justifyContent="space-between" marginBottom={2}>
        <Flex gap="2">
          <Button
            size="sm"
            margin="0"
            padding="0"
            colorScheme="teal"
            isDisabled={delay <= 1}
            onClick={() => setDelay(Math.max(delay - 1, 1))}
          >
            <Text fontWeight="bold" fontSize="md">-</Text>
          </Button>
          <Button
            size="sm"
            margin="0"
            padding="0"
            colorScheme="teal"
            onClick={() => setDelay(delay + 1)}
          >
            <Text as="i" fontWeight="normal" fontSize="md">+</Text>
          </Button>
        </Flex>
        <Flex gap="2">
          <IconButton
            colorScheme="blue"
            aria-label='Call Segun'
            size='sm'
            icon={<FaRegSave />}
            onClick={() => {
              setMessages(messages.map(m => (m.id === message.id ? { ...m, value: delay } : m)))
              setDisable(false)
            }}
          />
          <IconButton
            colorScheme="red"
            aria-label='Call Segun'
            size='sm'
            icon={<FaRegTrashAlt />}
            onClick={() => {
              setTitle('Excluir')
              setMessage('Deseja excluir essa mensagem?')
              changeOpen(true, handleDelete, handleCancel)
            }}
          />
        </Flex>
      </Flex>

      <Text fontSize="md">Aguarde <Text as="span" fontSize="md" fontWeight="bold">{delay}</Text> segundos</Text>
    </Box>
  )
}

const ItemButton: React.FC<TItemButtonProps | any> = ({ handleClick, children, disable, ...props }) => ( // eslint-disable-line
  <GridItem {...props}>
    <Flex
      as="button"
      flexDirection="column"
      alignItems="center"
      paddingX="3"
      paddingY="4"
      background="blue.50"
      justifyContent="center"
      borderRadius="lg"
      borderColor='gray.200'
      width="90px"
      color='gray.500'
      onClick={disable ? () => {} : handleClick} // eslint-disable-line
      opacity={disable ? 0.5 : 1}
      cursor={disable ? 'not-allowed' : 'pointer'}
    >
      {children}
    </Flex>
  </GridItem>
)
