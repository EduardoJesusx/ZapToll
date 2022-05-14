import React, { useContext, useRef, useState } from 'react'

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
  Box
} from '@chakra-ui/react'
import { ChromePicker } from 'react-color'

import { DialogContext } from '../context/DialogContext'
import { AnimatePresence, motion } from 'framer-motion'
import { api } from '../services/api'

interface ColorPickerProps {
  color: string
  setColor: React.Dispatch<React.SetStateAction<string>>,
  isColorActive: boolean
}

export const NewTag: React.FC<{ isOpen: any, onClose: any }> = ({ isOpen, onClose }) => { // eslint-disable-line
  const [name, setName] = useState<string>('Nova tag')
  const [nickName, setNickName] = useState('')
  const [color, setColor] = useState('')
  const [isColorActive, setIsColorActive] = useState(false)

  const { changeOpen, setTitle, setMessage } = useContext(DialogContext)

  const initialRef = useRef(null)

  async function handleSave () {
    const { data } = await api.post('http://localhost:3000/api/tag/new', {
      name,
      nickname: nickName,
      color
    })

    if (data.error) {
      console.log(data.error)
      return
    }

    setName('Nova tag')
    setNickName('')
    setColor('#000')
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
        <ModalHeader>Nova tag</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Editable defaultValue={name} fontSize="lg" transform="translateY(-70%)">
            <EditablePreview ref={initialRef} />
            <EditableInput value={name} onChange={event => setName(event.target.value)} />
          </Editable>

          <FormControl>
            <FormLabel>Apelido</FormLabel>
            <Input
              value={nickName}
              htmlSize={1}
              width="auto"
              onChange={event => event.target.value.length <= 3 && setNickName(event.target.value)}
              placeholder='Apelido'
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel display="flex" alignItems="center" >
              Cor
              {/* show me a selected color */}
              <Box
                margin="0 10px"
                display="inline-block"
                width="24px"
                height="24px"
                borderRadius="sm"
                bg={color}
              />
            </FormLabel>

            <ColorPicker color={color} setColor={setColor} isColorActive={isColorActive} />

            <Button
              mt={4}
              colorScheme="teal"
              onClick={() => setIsColorActive(!isColorActive)}
            >
              {isColorActive ? 'Esconder' : 'Selecionar cor'}
            </Button>
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
              onClick={() => {
                setTitle('Tem certeza?')
                setMessage('Todo o conteúdo será perdido!')

                changeOpen(true, () => {
                  setName('Nova tag')
                  setNickName('')
                  setColor('#000')
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
