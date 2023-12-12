/**
 * 
 * context for saving user details
 * useUser() is a custom hook to access user data in other components
 * 
 * can change user details by function :  changeUser(details)
 * 
 */

import React, { createContext, useContext, useState } from 'react'

const UserContext = createContext()

const UserProvider = ({ children }) => {
    const [user, setUser] = useState();

    const changeUser = (data) => {
        setUser(data)
    }

    return <UserContext.Provider value={{ user, changeUser }}>{children}</UserContext.Provider>
}


const useUser = () => {
    return useContext(UserContext)
}

export {UserProvider, useUser}