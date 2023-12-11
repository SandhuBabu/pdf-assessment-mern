import axios from 'axios'

const BASE_URL = "http://localhost:5000"

export const signin = (data) => {
    return axios.post(`${BASE_URL}/signin`, data)
        .then(res => {
            const { token, ...rest } = res?.data
            localStorage.setItem('token', token)
            return { data: rest, error: false }
        }).catch(err => {
            console.log(err);
            return { error: true, data: err.response.data }
        })
}

export const signup = (data) => {
    return axios.post(`${BASE_URL}/signup`, data)
        .then(res => {
            const { token, ...rest } = res?.data
            localStorage.setItem('token', token)
            return { data: rest, error: false }
        }).catch(err => {
            console.log(err);
            return { error: true, data: err.response.data }
        })
}

export const logout = () => {
    return axios.post(`${BASE_URL}/logout`, null, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(res => {
        localStorage.clear()
        return { error: false }
    }).catch(err => {
        console.log(err);
        return { error: true }
    })
}


export const getUser = async () => {
    return axios.get(`${BASE_URL}/user`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(res => {
        return { error: false, data: res?.data }
    }).catch((err) => {
        return { error: true, data: err.response.data }
    })
}

export const uploadFile = (data) => {
    return axios.post(`${BASE_URL}/upload`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(res => {
        return { data: res?.data, error: false }
    }).catch(err => {
        console.log(err);
        return { data: err?.response?.data, error: true }
    })
}

export const getMyFiles = () => {
    return axios.get(`${BASE_URL}/my-files`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(res => {
        return {
            error: false,
            data: res?.data || []
        }
    }).catch(err => {
        console.log(err);
        return {
            error: true,
            data: err.response.data
        }
    })
}