
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

import { DialogProvider } from '../context/DialogContext'

const theme = extendTheme({
  fonts: {
    heading: 'Nunito, sans-serif',
    body: 'Poppins, Fredoka, sans-serif'
  },
  body: {
    color: '#2D3748'
  }
})

const MyApp = ({ Component, pageProps }: any) => {
  return (
    <ChakraProvider theme={theme}>
      <DialogProvider>
        <Component {...pageProps} />
      </DialogProvider>
    </ChakraProvider>
  )
}

export default MyApp
