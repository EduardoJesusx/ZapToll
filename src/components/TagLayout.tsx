import React from 'react'

import { Box, chakra, Flex, Image, Text } from '@chakra-ui/react'

import { UndrawTag } from '../components/UndrawTag'
import { Sidebar } from './Sidebar'
import { AiOutlineTags } from 'react-icons/ai'

const IconAiOutlineTags = chakra(AiOutlineTags)

export const TagLayout: React.FC = ({ children }) => {
  return (
    <Flex>
      <Sidebar />
      <Flex alignItems="center" flexDirection="column" width="100%" backgroundColor="gray.50" height="100vh">
        <Box overflow="hidden" bgGradient='linear(to-r, tomato, , red.300, red.300)' width="100%" height="300px" paddingX="10" paddingY="4">
          <Flex alignItems="center" justifyContent="space-between" >
            <Text color="white" fontWeight="medium" fontSize="xl">Zap Tool</Text>

            <Flex alignItems="center">
              <Box marginLeft="4" color="white">
                <Text lineHeight="1" fontFamily="Nunito" fontWeight="bold">Eugenio Silveira</Text>
                <Text fontSize="sm">Gerente Comercial</Text>
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
              <IconAiOutlineTags size={120} color="white" textShadow="lg" />
              <Text color="white" fontWeight="medium" fontSize="xl">Tag</Text>
            </Box>

            <UndrawTag height={300} width={500} />
          </Flex>
        </Box>

        {children}
      </Flex>
    </Flex>
  )
}
