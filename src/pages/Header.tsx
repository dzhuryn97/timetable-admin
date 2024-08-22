import {
    Avatar,
    Box,
    Heading, List, ListItem,
    Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverHeader,
    PopoverTrigger
} from "@chakra-ui/react";
import {NavLink} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../context/AuthContext";

export default function Header(){

    const authContext = useContext(AuthContext);

    return <Box
        as={"header"}
        display={"flex"}
        justifyContent="space-between"
        p={"10px"}
    >
        <Box>
            <Heading>Main Dashboard</Heading>
        </Box>
        <Box
        >
            <Popover>
                <PopoverTrigger>
                    <Avatar name={authContext.authUser?.name}  />
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverHeader>Hey, {authContext.authUser?.name}</PopoverHeader>
                    <PopoverBody>
                        <List>

                            <ListItem>
                                <NavLink to={'/logout'}>Logout</NavLink>
                            </ListItem>
                        </List>
                    </PopoverBody>
                </PopoverContent>
            </Popover>

        </Box>
    </Box>
}