'use client'

import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Icon,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react'
import { ReactElement } from 'react'
import {
    FcAbout,
    FcAssistant,
    FcCollaboration,
    FcDonate,
    FcManager,
} from 'react-icons/fc'

interface CardProps {
    heading: string
    description: string
    icon: ReactElement
    href: string
}

const Card = ({ heading, description, icon, href }: CardProps) => {
    return (
        <Box
            maxW={{ base: 'full', md: '275px' }}
            w={'full'}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={5}>
            <Stack align={'start'} spacing={2}>
                <Flex
                    w={16}
                    h={16}
                    align={'center'}
                    justify={'center'}
                    color={'white'}
                    rounded={'full'}
                    bg={useColorModeValue('gray.100', 'gray.700')}>
                    {icon}
                </Flex>
                <Box mt={2}>
                    <Heading size="md">{heading}</Heading>
                    <Text mt={1} fontSize={'sm'}>
                        {description}
                    </Text>
                </Box>
                <Button variant={'link'} colorScheme={'blue'} size={'sm'}>
                    Learn more
                </Button>
            </Stack>
        </Box>
    )
}

export default function Home() {
    return (
        <Box p={2}>

                <Flex flexWrap="wrap" gridGap={6} justify="left">
                    <Card
                        heading={'Doctors'}
                        icon={<Icon as={FcAssistant} w={10} h={10} />}
                        description={'Lorem ipsum dolor sit amet catetur, adipisicing elit.'}
                        href={'#'}
                    />
                    <Card
                        heading={'Users'}
                        icon={<Icon as={FcCollaboration} w={10} h={10} />}
                        description={'Lorem ipsum dolor sit amet catetur, adipisicing elit.'}
                        href={'#'}
                    />

                </Flex>
        </Box>
    )
}