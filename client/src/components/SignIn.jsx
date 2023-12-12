import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { signin } from '../service'
import './Form.css'

const SignIn = () => {

    const [userData, setUserData] = useState({})
    const { changeUser, user } = useUser()
    const navigate = useNavigate()

    useEffect(() => {
        console.log(user);
        if (user?.email)
            navigate('/', { replace:true })
    }, [user])

    const handleChange = useCallback(({ target }) => {
        const { name, value } = target
        setUserData(prev => ({ ...prev, [name]: value.trim() }))
    }, [])

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        if(!userData?.email || !userData?.password) {
            return
        }
        
        const { error, data } = await signin(userData)
        if (error) {
            alert(data?.message)
            return
        }
        changeUser(data)
        navigate('/')
    }, [userData])

    return (
        <div>
            <form onSubmit={handleSubmit} className='upload-form'>
                <h1 className='heading'>Sign In</h1>

                <div className='input-group'>
                    <p>Email Address</p>
                    <input type="text" name='email' onChange={handleChange} required />
                </div>
                <div className='input-group'>
                    <p>Password</p>
                    <input type="password" name='password' onChange={handleChange} required />
                </div>
                <button className='btn btn-primary' type='submits'>Sign In</button>
            </form>
            <p style={{ margin: '1em auto', width: '30em' }}>
                Dont have account?
                <Link to='/signup' style={{ marginLeft: '10px' }} className='link'>Create Account</Link>
            </p>
        </div>
    )
}

export default SignIn