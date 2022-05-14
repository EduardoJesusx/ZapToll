import React from 'react'

import { Box, chakra, Flex, Image, Text } from '@chakra-ui/react'

import { BiMessage } from 'react-icons/bi'

import { Sidebar } from './Sidebar'

const IconBiMessage = chakra(BiMessage)

export const ContactLayout: React.FC = ({ children }) => {
  return (
    <Flex>
      <Sidebar />
      <Flex alignItems="center" marginLeft="50px" flexDirection="column" width="100%" backgroundColor="gray.50" minHeight="100vh">
        <Box overflow="hidden" bgGradient='linear(to-r, teal.500, teal.500, teal.300)' width="100%" height="300px" paddingX="10" paddingY="4">
          <Flex alignItems="center" justifyContent="space-between" >
            <Text color="white" fontWeight="medium" fontSize="xl">Zap Tool</Text>

            <Flex alignItems="center">
              <Box marginLeft="4" color="white">
                <Text lineHeight="1" fontFamily="Nunito" fontWeight="bold">Eugenio Silveira</Text>
                <Text fontSize="sm" >Gerente Comercial</Text>
              </Box>

              <Image
                marginLeft="4"
                borderRadius="full"
                boxSize="50px"
                src="https://bit.ly/dan-abramov"
                alt="Dan Abramov"
              />
            </Flex>
          </Flex>

          <Flex justifyContent="space-between" width="80%" margin="auto">
            <Box>
              <IconBiMessage size={120} color="white" textShadow="lg" />
              <Text color="white" fontWeight="medium" fontSize="xl">Contatos</Text>
            </Box>

          </Flex>
        </Box>

        {children}
      </Flex>
    </Flex>
  )
}
