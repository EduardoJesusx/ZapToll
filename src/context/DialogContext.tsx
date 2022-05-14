import { createContext, Dispatch, FC, SetStateAction, useState } from 'react'

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Flex,
  Button
} from '@chakra-ui/react'

import { motion, AnimatePresence } from 'framer-motion'

export interface DialogContextType {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  title: string
  setTitle: Dispatch<SetStateAction<string>>
  message: string
  setMessage: Dispatch<SetStateAction<string>>
  handle: {
    onConfirm: any, // eslint-disable-line 
    onCancel: any // eslint-disable-line 
  },
  changeOpen: (isOpen: boolean, onConfirm: () => void, onCancel: () => void) => void
}

// create a alert dialog context
export const DialogContext = createContext({} as DialogContextType)

export const DialogProvider: FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')

  const [handle, setHandle] = useState({
    onConfirm: () => {}, // eslint-disable-line 
    onCancel: () => {} // eslint-disable-line 
  })

  // create a function to setIsOpen
  function changeOpen (isOpen: boolean, onConfirm: () => void, onCancel: () => void) {
    setHandle({
      onConfirm () {
        setIsOpen(false)
        onConfirm()
      },
      onCancel () {
        setIsOpen(false)
        onCancel()
      }
    })

    setIsOpen(isOpen)
  }

  return (
    <DialogContext.Provider
      value={{
        isOpen,
        setIsOpen,
        title,
        setTitle,
        message,
        setMessage,
        handle,
        changeOpen
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0 }}
            exit={{ opacity: 0 }}
            key="dialog"
          >
            <AlertDialog
              isOpen={isOpen}
              onClose={handle.onCancel}
              leastDestructiveRef={undefined}
            >
              <AlertDialogOverlay />
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  {title}
                </AlertDialogHeader>
                <AlertDialogBody>{message}</AlertDialogBody>
                <AlertDialogFooter>
                  <Flex justifyContent="flex-end">
                    <Button
                      colorScheme="red"
                      onClick={handle.onCancel}
                      mr={3}
                      mb={3}
                    >
                      Cancelar
                    </Button>
                    <Button colorScheme="green" onClick={handle.onConfirm}>
                      Confirmar
                    </Button>
                  </Flex>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </DialogContext.Provider>
  )
}
