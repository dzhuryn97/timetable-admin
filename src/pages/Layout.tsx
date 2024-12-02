import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <>
      <Box
        display="flex"
        style={{
          backgroundColor: "#e9ecef",
        }}
        minH={"100%"}
      >
        <Sidebar />

        <Box flexGrow={"1"} m={"0 10px"}>
          <Header />
          <Box bg={"white"} borderRadius={"10px"} p={" 10px"}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </>
  );
}
