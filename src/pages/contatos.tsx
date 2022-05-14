import React, { useContext, useEffect, useRef, useState } from 'react'
import { GetStaticProps } from 'next'

import { PrismaClient } from '@prisma/client'

import {
  Box,
  Flex,
  IconButton,
  Heading,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Grid,
  GridItem,
  Tag,
  TagLabel,
  TagLeftIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  chakra,
  Input
} from '@chakra-ui/react'
import Select from 'react-select'

import { GrRefresh } from 'react-icons/gr'

import { api } from '../services/api'
import { AddIcon } from '@chakra-ui/icons'
import { DialogContext } from '../context/DialogContext'
import { AiOutlineTags } from 'react-icons/ai'
import { NewTag } from '../components/NewTag'
import { ContactLayout } from '../components/ContactLayout'
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri'

type THome = {
  contacts: Array<any> // eslint-disable-line
}

type TTag = {
  id: number
  name: string
  nickname: string
  color: string
  status: boolean
}

type TPaginator = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const IconAiOutlineTags = chakra(AiOutlineTags)

const Home: React.FC<THome> = ({ contacts: initialContacts }) => {
  const [contacts, setContacts] = useState(initialContacts)
  const [contactId, setContactId] = useState<number[]>([])
  const [checkedItems, setCheckedItems] = useState(contacts.map((tag) => ({ id: tag.id, value: false })))
  const [tags, setTags] = useState<TTag[]>([])
  const [nameFilter, setNameFilter] = useState('')
  const [tagsThatCanHave, setTagsThatCanHave] = useState<number[]>([])
  const [tagsThatCantHave, setTagsThatCantHave] = useState<number[]>([])
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(0)

  const allChecked = checkedItems.length > 0 && checkedItems.every(({ value }) => value)
  const isIndeterminate = checkedItems.some(({ value }) => value) && !allChecked

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isNewTagOpen, onOpen: onNewTagOpen, onClose: onNewTagClose } = useDisclosure()

  let timeout: any // eslint-disable-line

  useEffect(() => {
    console.log('> Chegou no useEffect')
    console.log(contacts)
  }, [contacts])

  async function loadTags () {
    const response = await api.get('http://localhost:3000/api/tag/all?active=true')

    const data = response.data.map((tag: any) => ({ // eslint-disable-line
      id: tag.id,
      name: tag.name,
      nickname: tag.nickname,
      color: tag.color,
      status: tag.status
    }))

    setTags(data)
  }

  useEffect(() => {
    loadTags()
  }, [])

  useEffect(() => {
    clearTimeout(timeout)

    console.log('> Nome filtrado: ', nameFilter)
    console.log('> Tags que pode ter: ', tagsThatCanHave)
    console.log('> Tags que não pode ter: ', tagsThatCantHave)

    timeout = setTimeout(async () => {
      const { data } = await api.get(`http://localhost:3000/api/contact?name=${nameFilter}&tagsthatcanhave=[${tagsThatCanHave}]&tagsthatcanthave=[${tagsThatCantHave}]&page=${page}`)

      if (data.error) {
        console.log(data.error)
        return
      }

      setPage(data.page)
      setCount(data.count)
      setContacts(data.contacts)
      setCheckedItems(data.contacts.map((tag: any) => ({ id: tag.id, value: false }))) // eslint-disable-line
    }, 750)
  }, [nameFilter, tagsThatCanHave, tagsThatCantHave, page])

  return (
    <>
      <ContactLayout>
        <Box width="100%" alignItems="center" justifyContent="center" backgroundColor="gray.50">
          <Box margin="auto" transform="translateY(-40px)" maxWidth="1300px" zIndex={5} width="90%" borderRadius="md" boxShadow="xl" backgroundColor="white" padding={3}>

            {/* <Flex as="form" padding="3" gap="6" onSubmit={handleSubmit}>
              <Input placeholder="Mensagem" value={message} onChange={(event) => setMessage(event.target.value)} />
              <IconButton aria-label="Enviar mensagem" colorScheme="green" icon={<FaPaperPlane />} type="submit" />
            </Flex> */}
            <Heading padding="3">Contatos</Heading>
            <IconButton aria-label="Atualizar" icon={<GrRefresh />} />

            <FormControl marginTop="3">
              <FormLabel htmlFor="nameFilter">Filtro</FormLabel>
              <Flex gap="4">
                <Box maxWidth={400}>
                  <Input
                    id="nameFilter"
                    value={nameFilter}
                    onChange={(event) => setNameFilter(event.target.value)}
                    placeholder="Digite o nome do contato"
                  />
                </Box>

                <Box maxWidth={400}>
                  <Select
                    placeholder="Contatos que possuem a tag"
                    isMulti={true}
                    options={tags.map((tag) => ({ label: tag.name, value: tag.id }))}
                    onChange={(event) => setTagsThatCanHave(event.map((tag) => tag.value))}
                  />
                </Box>

                <Box maxWidth={400}>
                  <Select
                    placeholder="Contatos que não possuem a tag"
                    isMulti={true}
                    options={tags.map((tag) => ({ label: tag.name, value: tag.id }))}
                    onChange={(event) => setTagsThatCantHave(event.map((tag) => tag.value))}
                  />
                </Box>

              </Flex>
            </FormControl>

            <Paginator page={page} totalPages={count} onPageChange={page => setPage(page)} />

            <Box marginTop="4">
              <Checkbox
                isChecked={allChecked}
                isIndeterminate={isIndeterminate}
                onChange={(e) => setCheckedItems(contacts.map((tag) => ({ id: tag.id, value: e.target.checked })))}
              >
                Selecionar Tudo
              </Checkbox>

              <Button
                colorScheme="teal"
                marginLeft="4"
                size="sm"
                isDisabled={!checkedItems.some(({ value }) => value)}
                leftIcon={<IconAiOutlineTags />}
                onClick={() => {
                  setContactId(checkedItems.map(({ id }) => id))
                  onOpen()
                }}
              >
                Relacionar tag
              </Button>
            </Box>
            <Box
              marginTop={2}
              as="section"
              padding="3"
            >
              <TableContainer>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Nome</Th>
                      <Th>Telefone</Th>
                      <Th>Tags</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {contacts.map((contact, index) => (
                      <Tr key={contact.id}>
                        <Td>{contact.name}</Td>
                        <Td>{contact.WAId.replace('@c.us', '')}</Td>
                        <Td>
                          <Grid key={contact.id} templateColumns='repeat(4, 1fr)' maxW="200px" gap={2}>
                            <GridItem>
                              <Tag
                                size="sm"
                                borderRadius="md"
                                variant="solid"
                                colorScheme="teal"
                                cursor="pointer"
                                onClick={() => {
                                  setContactId([contact.id])
                                  onOpen()
                                }}
                              >
                                <TagLeftIcon boxSize='12px' as={AddIcon} />
                                <TagLabel>Adicionar</TagLabel>
                              </Tag>
                            </GridItem>

                            {contact.contactTag.map(({ tag }: any) => ( // eslint-disable-line
                              <GridItem color="#FFF" key={tag.id}>
                                <Tag
                                  size="sm"
                                  borderRadius="md"
                                  variant="solid"
                                  color="#FFF"
                                  backgroundColor={tag.color}
                                >
                                  <TagLabel>{tag.name}</TagLabel>
                                </Tag>
                              </GridItem>
                            ))}
                          </Grid>
                        </Td>
                        <Td>
                          <Checkbox
                            isChecked={checkedItems[index]?.value}
                            size="lg"
                            onChange={(e) => {
                              const newCheckedItems = checkedItems.map((item) => {
                                if (item.id === contact.id) {
                                  return { ...item, value: e.target.checked }
                                }
                                return item
                              })
                              setCheckedItems(newCheckedItems)
                            }}
                          >

                          </Checkbox>
                          {/* <IconButton aria-label="Excluir" icon={<GrRefresh />} /> */}
                        </Td>
                      </Tr>
                    ))}

                  </Tbody>
                </Table>
              </TableContainer>

              <Paginator page={page} totalPages={count} onPageChange={page => setPage(page)} />
            </Box>
          </Box>
        </Box>
      </ContactLayout>
      <AddTag isOpen={isOpen} onClose={onClose} id={contactId} onNewTagOpen={onNewTagOpen} />
      <NewTag isOpen={isNewTagOpen} onClose={() => { loadTags(); onNewTagClose() }} />
    </>
  )
}

const Paginator: React.FC<TPaginator> = ({ page, totalPages, onPageChange }) => {
  const pages = Array.from(Array(Math.floor(totalPages / 100)).keys()).map((key) => key + 1)
  const firstPages = [...pages.splice(Math.max(page - 5, 0), 5), ...pages.slice(page, Math.min(page + 5, Math.floor(totalPages / 100)))]

  return (
    <Box display="flex" justifyContent="center" alignItems="center" marginTop="4" gap={1}>
      <IconButton
        aria-label="Voltar"
        icon={<RiArrowLeftSLine />}
        size="sm"
        onClick={() => onPageChange(page - 1)}
        isDisabled={!(page - 1 > 0)}
      />

      {page > 6 && (
        <Button
          size="sm"
          onClick={() => onPageChange(1)}
        >
          1
        </Button>
      )}

      {firstPages.map(pageNumber => (
        <Button
          key={pageNumber}
          size="sm"
          variant={pageNumber === page ? 'solid' : 'outline'}
          colorScheme={pageNumber === page ? 'teal' : 'gray'}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </Button>
      ))}

      {page !== Math.floor(totalPages / 100) && (
        <Button
          size="sm"
          onClick={() => onPageChange(totalPages / 100)}
        >
          {Math.floor(totalPages / 100)}
        </Button>
      )}

      <IconButton
        aria-label="Avançar"
        icon={<RiArrowRightSLine />}
        size="sm"
        onClick={() => onPageChange(page + 1)}
        isDisabled={!(page + 1 <= Math.floor(totalPages / 100))}
      />
    </Box>
  )
}

export const AddTag: React.FC<{ isOpen: any, onClose: any, id: Array<number>, onNewTagOpen: any }> = ({ isOpen, onClose, id, onNewTagOpen }) => { // eslint-disable-line
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState<any>([]) // eslint-disable-line

  const { changeOpen, setTitle, setMessage } = useContext(DialogContext)

  const initialRef = useRef(null)

  useEffect(() => {
    console.log(id)
    async function handleGet () {
      const { data } = await api.get('http://localhost:3000/api/tag/all?active=true')
      console.log(data)
      if (data.error) {
        console.log(data.error)
        return
      }

      setTags(data.map((tag: any) => ({ // eslint-disable-line
        value: tag.id,
        label: tag.name
      })))
    }

    handleGet()
  }, [id])

  async function handleSave () {
    const { data } = await api.post('http://localhost:3000/api/contactToTag', {
      contactsId: id,
      tagsId: selectedTags.map(({ value }: any) => value) // eslint-disable-line
    })

    if (data.error) {
      console.log(data.error)
    }

    onClose()
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
        <ModalHeader>Teguiar</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <Button
              leftIcon={<AddIcon />}
              colorScheme='teal'
              marginRight='10px'
              size="sm"
              onClick={() => {
                onNewTagOpen()
              }}
            >
              Criar nova tag
            </Button>
            <FormLabel htmlFor="name" marginTop="3">Tag</FormLabel>
            <Box width="300px">
              <Select
                options={tags}
                onChange={event => setSelectedTags(event)}
                closeMenuOnSelect={false}
                isMulti
              />
            </Box>
          </FormControl>
        </ModalBody>

        <ModalFooter>
            <Button
              colorScheme='blue'
              marginRight='10px'
              onClick={() => {
                setTitle('Tem certeza de que deseja salvar?')
                setMessage('Clique em confirmar para salvar a tag')

                changeOpen(true, async () => {
                  await handleSave()
                }, () => {}) // eslint-disable-line
              }}
            >
              Save
            </Button>
            <Button
              onClick={ () => {
                setTitle('Tem certeza?')
                setMessage('Toda a seleção será perdida!')

                changeOpen(true, () => {
                  // setTag({} as ITag)
                  // setIsColorActive(false)

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

const prisma = new PrismaClient({})

export const getStaticProps: GetStaticProps = async () => {
  let contacts: any = [] // eslint-disable-line

  try {
    contacts = await prisma.contact.findMany({
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
      where: {
        contactTag: {
          every: {
            contactTag: {
              status: true
            }
          }
        }
      },
      take: 100
    })

    console.log(contacts[0])
  } catch (error) {
    console.log(error)
  }

  await prisma.$disconnect()
  return {
    props: {
      contacts: contacts.map((contact: any) => ({ // eslint-disable-line
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
    },
    revalidate: 60 * 2 // 2 hours
  }
}

export default Home

/* <Wrap>
  <WrapItem>
    <Center paddingX="2" >
      <Flex flexDir="column">
        <Heading size="md">Nome</Heading>
        {contacts.map((contact) => (
          <Box key={contact.id}>{contact.name}</Box>
        ))}
      </Flex>
    </Center>
  </WrapItem>

  <WrapItem>
    <Center paddingX="2" >
      <Flex flexDir="column">
        <Heading size="md">Número</Heading>
        {contacts.map((contact) => (
          <Box key={contact.id}>{contact.WAId.replace('@c.us', '')}</Box>
        ))}
      </Flex>
    </Center>
  </WrapItem>

  <WrapItem>
    <Center paddingX="2" >
      <Flex flexDir="column">
        <Heading size="md">Tags</Heading>
        {contacts.map((contact, index) => (
          <Grid key={contact.id} templateColumns='repeat(3, 1fr)' templateRows="1fr" maxW="200px" gap={6}>
            <GridItem>
              <Tag
                size="sm"
                borderRadius="full"
                variant="solid"
                colorScheme="teal"
                cursor="pointer"
                onClick={() => {
                  const previous = contacts

                  console.log('eitaporra')

                  previous[index].contactTag.push({
                    id: Math.random(),
                    name: 'teste',
                    color: 'red'
                  })

                  setContacts(previous)
                }}
              >
                <TagLeftIcon boxSize='12px' as={AddIcon} />
                <TagLabel>Adicionar</TagLabel>
              </Tag>
            </GridItem>

            {contact.contactTag.map((tag: any) => ( // eslint-disable-line
              <GridItem color="#FFF" key={tag.id}>
                <Tag
                  size="sm"
                  borderRadius="full"
                  variant="solid"
                  color="#FFF"
                  backgroundColor={tag.color}
                  >
                  <TagLabel>{tag.name}</TagLabel>
                </Tag>
              </GridItem>
            ))}
          </Grid>
        ))}
      </Flex>
    </Center>
  </WrapItem>
</Wrap> */
