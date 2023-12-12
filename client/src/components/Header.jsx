import React, { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { logout } from '../service'
import './Header.css'

const Header = () => {

    const { user, changeUser } = useUser()
    const navigate = useNavigate()

    const handleLogout = useCallback(async () => {
        const { error } = await logout();
        if (error) {
            alert("Failed to logout")
            return
        }
        changeUser(null)
        window.location.pathname = '/signin'
    }, [])

    return (
        <header>
            <button
                style={{ color: '#fff' }}
                onClick={() => {
                    if (user?.email) {
                        navigate('/')
                    }
                }}>
                <h1>PDF Editor</h1>
            </button>
            {
                user?.email &&
                <div className='nav-links'>
                    <Link to='/my-files'>
                        My Files
                    </Link>
                    <p>
                        <span>{user?.email}</span>
                        <button
                            className='btn'
                            onClick={handleLogout}
                        >Logout</button>
                    </p>
                </div>
            }
        </header>
    )
}

export default Header