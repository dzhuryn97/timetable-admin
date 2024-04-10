import React, {useEffect, useState} from 'react';
import {ChakraProvider} from '@chakra-ui/react'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Layout from "./pages/Layout";
import Main from "./pages/Main";
import List from "./pages/Doctor/List";
import Item from "./pages/Doctor/Item";
import {AuthContext} from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import AuthUser from "./models/AuthUser";
import Login from "./pages/Auth/Login";
import Logout from "./pages/Auth/Logout";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Create from "./pages/Doctor/Create";
import NotificationShower, {NotificationProvider} from "./components/NotificationShower";

const router = createBrowserRouter([
    {
        "path": "",
        element: <ProtectedRoute />,
        children:[
            {
                path: "/",
                element: <Layout/>,
                children: [
                    {
                        index: true,
                        element: <List/>
                    },
                    {
                        path: "doctor",
                        children: [
                            {
                                index: true,
                                element: <List/>
                            },
                            {
                                path: "create",
                                element: <Create/>
                            },
                            {
                                path: ":id",
                                element: <Item/>
                            }
                        ]
                    }
                ]
            },
        ]
    },
    {
        path: "/login",
        element: <Login/>,
    },
    {
        path: "/logout",
        element: <Logout/>,
    },

]);

const queryClient = new QueryClient();


function App() {

    // useEffect(() => {
    //     const token = sessionStorage.getItem('authToken');
    //     const authName = sessionStorage.getItem('authName');
    //
    //     if(token && authName){
    //         const authUser = new AuthUser(token,authName)
    //         setAuthUser(authUser);
    //
    //         console.log('setAuthUser First')
    //     }
    //
    //
    //     // const connection = createConnection(serverUrl, roomId);
    //     // connection.connect();
    //     // return () => {
    //     //     connection.disconnect();
    //     // };
    // }, []);

    const [authUser, setAuthUser] = useState<AuthUser| null>(null)


    return (
        <ChakraProvider>
            <QueryClientProvider client={queryClient}>
                <AuthContext.Provider value={{
                    authUser: authUser,
                    setAuthUser: setAuthUser
                }}>
                    <NotificationProvider>
                        <RouterProvider router={router}/>
                        <NotificationShower/>
                    </NotificationProvider>
                </AuthContext.Provider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ChakraProvider>
    );
}

export default App;
