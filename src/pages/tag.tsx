import React, { useEffect, useState } from 'react'

import {
  Box,
  chakra,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  LinkBox,
  Stack,
  Text,
  useDisclosure
} from '@chakra-ui/react'

import { motion } from 'framer-motion'

import { AiOutlinePlus } from 'react-icons/ai'

import { TagLayout } from '../components/TagLayout'
import { NewTag } from '../components/NewTag'
import { api } from '../services/api'
import { UpdateTag } from '../components/UpdateTag'

const IconAiOutlinePlus = chakra(AiOutlinePlus)

const MotionGrid = motion(Grid)
const MotionGridItem = motion(GridItem)

interface ITag {
  id: number
  name: string
  nickname: string
  color: string
  status: boolean
  contacts: Array<any> // eslint-disable-line
  createdAt: string
  updatedAt: string
}

const Tag: React.FC = () => {
  const [tags, setTags] = useState<ITag[]>([])
  const [tagId, setTagId] = useState<number | null>(null)
  const [filter, setFilter] = useState({ active: true, inactice: false })

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure()

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

  useEffect(() => {
    getTags()
  }, [filter])

  function getTags () {
    async function loadTags () {
      const response = await api.get(`http://localhost:3000/api/tag/all?active=${filter.active}&inactive=${filter.inactice}`)
      setTags(response.data)
    }

    loadTags()
  }

  function onNewTagClose () {
    getTags()
    onClose()
  }

  return (
    <>
      <TagLayout>
        <Flex width="100%" padding={3} gap={3}>
          <Box>
            <Text fontSize="xl">Filtro</Text>
            <Stack>
              <Checkbox
                isChecked={filter.active}
                onChange={event => {
                  setFilter({
                    active: event.target.checked,
                    inactice: filter.inactice
                  })
                }}
                >
                Ativo
              </Checkbox>

              <Checkbox
                isChecked={filter.inactice}
                onChange={event => {
                  setFilter({
                    active: filter.active,
                    inactice: event.target.checked
                  })
                }}
                >
                Inativo
              </Checkbox>
            </Stack>
          </Box>
          <Box width="100%" maxWidth="1000px" transform="translateY(-30px)">
            <MotionGrid variants={container} initial="hidden" animate="visible" width="100%" templateColumns='repeat(4, 1fr)' gap={6}>
              <LinkBox onClick={onOpen}>
                <MotionGridItem
                  w='100%'
                  boxShadow="base"
                  backgroundColor="white"
                  padding="3"
                  borderRadius={3}
                  variants={item}
                  cursor="pointer"
                  whileHover={{
                    marginTop: -4
                  }}
                >
                  <Flex
                    flexDirection="column"
                    alignItems="center"
                    paddingX="10"
                    paddingY="5"
                    border='2px dashed'
                    justifyContent="center"
                    borderRadius="sm"
                    borderColor='gray.200'
                  >
                    <IconAiOutlinePlus fontSize="30" />
                    {/* <LinkOverlay href="/mensagem/nova">
                    </LinkOverlay> */}
                    <Text
                      textAlign="center"
                      fontSize="sm"
                      color="gray.600"
                      fontWeight="medium"
                    >
                      Adicionar tag
                    </Text>
                  </Flex>
                </MotionGridItem>
              </LinkBox>

              {tags.map(tag => (
                <LinkBox
                  key={tag.id}
                  onClick={() => {
                    setTagId(tag.id)
                    onUpdateOpen()
                  }}
                >
                  <MotionGridItem
                    w='100%'
                    boxShadow="base"
                    backgroundColor="white"
                    padding="3"
                    borderRadius={3}
                    variants={item}
                    cursor="pointer"
                    whileHover={{
                      marginTop: -4
                    }}
                  >
                    <Flex
                      flexDirection="column"
                      paddingX="5"
                      paddingY="5"
                      justifyContent="center"
                      borderRadius="sm"
                      borderColor='gray.200'
                    >
                      <Text
                        fontSize="md"
                        color="gray.800"
                        fontWeight="bold"
                      >
                        {tag.name}
                      </Text>

                      <Text
                        fontSize="md"
                        color="gray.600"
                        fontWeight="medium"
                      >
                        {tag.nickname}
                      </Text>
                    </Flex>
                  </MotionGridItem>
                </LinkBox>
              ))}
            </MotionGrid>
          </Box>
        </Flex>
      </TagLayout>
      <NewTag isOpen={isOpen} onClose={onNewTagClose} />
      <UpdateTag id={tagId} isOpen={isUpdateOpen} onClose={onUpdateClose} />
    </>
  )
}

export default Tag
