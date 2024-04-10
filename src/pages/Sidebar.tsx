import {Box, Divider, Heading, List, ListItem} from "@chakra-ui/react";
import {NavLink} from "react-router-dom";
import React from "react";

export default function Sidebar() {
    return <Box
        as="aside"
        p={"10px"}
        bg={"white"}
    >
        <Heading>
            Doctors Schedule
        </Heading>
        <Divider/>

        <List>
            <ListItem>
                <NavLink to={"/"}>Dashboard</NavLink>

            </ListItem>
            <ListItem>
                <NavLink to={"/doctor"}>Doctors</NavLink>
            </ListItem>

        </List>

    </Box>
}