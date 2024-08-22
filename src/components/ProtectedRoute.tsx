import {Navigate, Outlet} from "react-router-dom";
import React, {useContext} from "react";
import {AuthContext} from "../context/AuthContext";

export default function ProtectedRoute(){
    const authContext = useContext(AuthContext);


    if(!authContext.authUser){
        return <Navigate to="/login" />

    }
    return <Outlet/>
}