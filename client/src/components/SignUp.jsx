import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { signup } from '../service'
import './Form.css'


const SignUp = () => {

    const [userData, setUserData] = useState({})
    const { user, changeUser } = useUser()
    const navigate = useNavigate()

    useEffect(() => {
        if (user?.email)
            navigate('/', { replace: true })
    }, [user])

    const handleChange = useCallback(({ target }) => {
        const { name, value } = target
        setUserData(prev => ({ ...prev, [name]: value.trim() }))
    }, [])

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        if (!user?.email || !user?.password)
            return
        
        const { data, error } = await signup(userData)
        console.log(error, data);
        if (error) {
            alert(data.message)
            return
        }
        changeUser(data)
        navigate('/', { replace: true })
    }, [userData])

    return (
        <div>
            <form onSubmit={handleSubmit} className='upload-form'>
                <h1 className='heading'>Create New Account</h1>

                <div className='input-group'>
                    <p>Email Address</p>
                    <input type="text" name='email' onChange={handleChange} required />
                </div>
                <div className='input-group'>
                    <p>Password</p>
                    <input type="password" name='password' onChange={handleChange} required />
                </div>
                <button className='btn btn-primary' type='submit'>Create Account</button>
            </form>
            <p style={{ margin: '1em auto', width: '30em' }}>
                Already have an account?
                <Link to='/signin' style={{ marginLeft: '10px' }} className='link'>Sign In</Link>
            </p>
        </div>
    )
}

export default SignUp