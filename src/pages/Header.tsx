import {
    Avatar,
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink, Button,
    Heading, List, ListItem,
    Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader,
    PopoverTrigger
} from "@chakra-ui/react";
import {NavLink} from "react-router-dom";

export default function Header(){
    return <Box
        as={"header"}
        display={"flex"}
        justifyContent="space-between"
        p={"10px"}
    >
        <Box>
            <Breadcrumb>
                <BreadcrumbItem>
                    <BreadcrumbLink href='#'>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href='#'>Docs</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href='#'>Breadcrumb</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <Heading>Main Dashboard</Heading>
        </Box>
        <Box
        >
            <Popover>
                <PopoverTrigger>
                    <Avatar name='Dan Abrahmov'  />
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverHeader>Hey, Dan Abrahmov</PopoverHeader>
                    <PopoverBody>
                        <List>
                            <ListItem>
                                <NavLink to={'/profile'}>Profile</NavLink>
                            </ListItem>
                            <ListItem>
                                <NavLink to={'/logut'}>Logout</NavLink>
                            </ListItem>
                        </List>
                    </PopoverBody>
                </PopoverContent>
            </Popover>

        </Box>
    </Box>
}