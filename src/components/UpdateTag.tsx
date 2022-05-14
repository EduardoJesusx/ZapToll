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
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  Skeleton,
  useEditableControls,
  ButtonGroup,
  IconButton,
  Text,
  RadioGroup,
  Stack,
  Radio
} from '@chakra-ui/react'
import { ChromePicker } from 'react-color'

import { DialogContext } from '../context/DialogContext'
import { AnimatePresence, motion } from 'framer-motion'
import { api } from '../services/api'
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons'

interface ColorPickerProps {
  color: string
  setColor: (hex: string) => void,
  isColorActive: boolean
}

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

export const UpdateTag: React.FC<{ isOpen: any, onClose: any, id: number | null }> = ({ isOpen, onClose, id }) => { // eslint-disable-line
  const [tag, setTag] = useState({} as ITag)
  const [isColorActive, setIsColorActive] = useState(false)

  const { changeOpen, setTitle, setMessage } = useContext(DialogContext)

  const initialRef = useRef(null)

  useEffect(() => {
    console.log(id)
    async function handleGet () {
      const { data } = await api.post('http://localhost:3000/api/tag/', { id: id })

      if (data.error) {
        console.log(data.error)
        return
      }

      setTag(data)
    }

    handleGet()
  }, [id])

  useEffect(() => {
    console.log(tag)
  }, [tag])

  async function handleSave () {
    console.log(tag)

    const { data } = await api.post('http://localhost:3000/api/tag/update', tag)

    if (data.error) {
      console.log(data.error)
      return
    }

    setIsColorActive(false)

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      initialFocusRef={initialRef}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{tag?.name} - Tag</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Skeleton isLoaded={!!tag.name}>
            <Editable
              defaultValue={tag?.name}
              fontSize='2xl'
              isPreviewFocusable={false}
              onSubmit={event => setTag(previous => ({ ...previous, name: event }))}
            >
              <Text as="span" fontWeight="600" fontSize="lg">Nome:</Text> {' '}
              <EditablePreview />
              <Input as={EditableInput} />
              <EditableControls />
            </Editable>
          </Skeleton>

          <Skeleton isLoaded={!!tag.nickname}>
            <Editable
              defaultValue={tag?.nickname}
              fontSize='2xl'
              isPreviewFocusable={false}
              onSubmit={event => setTag(previous => ({ ...previous, nickname: event }))}
            >
              <Text as="span" fontWeight="600" fontSize="lg">Apelido:</Text> {' '}
              <EditablePreview />
              <Input as={EditableInput} />
              <EditableControls />
            </Editable>
          </Skeleton>

          <Skeleton isLoaded={!!tag.color}>
            <FormControl mt={4}>
              <FormLabel display="flex" alignItems="center" >
                <Text as="span" fontWeight="600" fontSize="lg">Cor:</Text>
                {/* show me a selected color */}
                <Box
                  margin="0 10px"
                  display="inline-block"
                  width="24px"
                  height="24px"
                  borderRadius="sm"
                  cursor="pointer"
                  bg={tag?.color}
                  onClick={() => setIsColorActive(!isColorActive)}
                />
              </FormLabel>

              <ColorPicker color={tag?.color} setColor={hex => setTag(previous => ({ ...previous, color: hex }))} isColorActive={isColorActive} />

              {isColorActive && (
                <Button
                  mt={4}
                  colorScheme="teal"
                  onClick={() => setIsColorActive(!isColorActive)}
                >
                  Esconder
                </Button>
              )}
            </FormControl>
          </Skeleton>

          <Skeleton isLoaded={tag.status !== undefined}>
            <FormControl display='flex' alignItems='center'>
              <FormLabel mb='0'>
                <Text as="span" fontWeight="600" fontSize="lg">Status:</Text>
                <RadioGroup onChange={(value) => setTag(previous => ({ ...previous, status: value === 'true' }))} value={`${tag?.status}`}>
                  <Stack direction='row'>
                    <Radio value={'true'}>Ativo</Radio>
                    <Radio value={'false'}>Inativo</Radio>
                  </Stack>
                </RadioGroup>
              </FormLabel>
            </FormControl>
          </Skeleton>
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
                setMessage('Toda a alteração será perdida!')

                changeOpen(true, () => {
                  setTag({} as ITag)
                  setIsColorActive(false)

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

function EditableControls () {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps
  } = useEditableControls()

  return isEditing
    ? (
    <ButtonGroup justifyContent='center' size='sm'>
      <IconButton aria-label="confirmar" icon={<CheckIcon />} {...getSubmitButtonProps()}/>
      <IconButton aria-label="cancelar" icon={<CloseIcon />} {...getCancelButtonProps()} />
    </ButtonGroup>
      )
    : (
    <ButtonGroup marginLeft={2} justifyContent='center'>
      <IconButton aria-label="editar" size='sm' icon={<EditIcon />} {...getEditButtonProps()} />
    </ButtonGroup>
      )
}

// create a animated color picker component that use AnimatePresence to
// animate the color picker when the colorActive state is true
const ColorPicker: React.FC<ColorPickerProps> = ({ color, setColor, isColorActive }) => {
  return (
    <AnimatePresence>
      {isColorActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 100
          }}
        >
          <ChromePicker
            onChange={color => setColor(color.hex)}
            color={color}
            disableAlpha={true}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
