import React, { ReactNode } from 'react'
import {
    IconButton,
    Box,
    CloseButton,
    Flex,
    Icon,
    useColorModeValue,
    Text,
    Drawer,
    DrawerContent,
    useDisclosure,
    BoxProps,
    FlexProps,
} from '@chakra-ui/react'
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import { ReactText } from 'react'
import {NavLink} from "react-router-dom";
import { FaUserDoctor } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";

interface LinkItemProps {
    name: string
    dest: string
    icon: IconType
}
const LinkItems: Array<LinkItemProps> = [
    { name: 'Home', icon: FiHome, dest:'/' },
    { name: 'Doctors', icon: FaUserDoctor, dest:'/doctor' },
    { name: 'Users', icon: FaUser, dest:'/user' },
]

export default function SimpleSidebar() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }} p="4">
                {/* Content */}
            </Box>
        </Box>
    )
}

interface SidebarProps extends BoxProps {
    onClose: () => void
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                    Logo
                </Text>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {LinkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon} dest={link.dest}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    )
}

interface NavItemProps extends FlexProps {
    icon: IconType
    dest: string
    children: ReactText
}
const NavItem = ({ icon, dest, children, ...rest }: NavItemProps) => {
    return (

        <Box
            as={NavLink}
            to={dest}
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'cyan.400',
                    color: 'white',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Box>
    )
}

interface MobileProps extends FlexProps {
    onOpen: () => void
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 24 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue('white', 'gray.900')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent="flex-start"
            {...rest}>
            <IconButton
                variant="outline"
                onClick={onOpen}
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
                Logo
            </Text>
        </Flex>
    )
}

// import {Box, Divider, Heading, List, ListItem} from "@chakra-ui/react";
// import {NavLink} from "react-router-dom";
// import React from "react";
//
// export default function Sidebar() {
//     return <Box
//         as="aside"
//         p={"10px"}
//         bg={"white"}
//     >
//         <Heading>
//             Doctors Schedule
//         </Heading>
//         <Divider/>
//
//         <List>
//             <ListItem>
//                 <NavLink to={"/"}>Dashboard</NavLink>
//
//             </ListItem>
//             <ListItem>
//                 <NavLink to={"/doctor"}>Doctors</NavLink>
//             </ListItem>
//
//         </List>
//
//     </Box>
// }