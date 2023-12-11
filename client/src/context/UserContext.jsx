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