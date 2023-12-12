import axios from 'axios'

const BASE_URL = "http://localhost:5000"

/**
 * api call function for signin service
 * data is object with keys email and password
 * 
 */
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

/**
 * api call function for signup service
 * data is object with keys email and password
 * 
 */
export const signup = (data) => {
    return axios.post(`${BASE_URL}/signup`, data)
        .then(res => {
            const { token, ...rest } = res?.data
            // saving jwt token in local storage
            localStorage.setItem('token', token)
            return { data: rest, error: false }
        }).catch(err => {
            console.log(err);
            return { error: true, data: err.response.data }
        })
}

// logout api call and remove token from localstorage response is success
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

/**
 * 
 * get user details when page loads with jwt token
 * stored in localstorage
 *  
 * @returns userdata(optional) and error(boolean value) 
 * 
 */
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

/**
 * 
 * @param {*} data include:
 *          1) file: File object and
 *          2) Pages: page numbers that seperated by commas
 * @returns the new pdf file url and error
 */
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

/**
 * 
 * @param {*} signal => to stop api calling when component unmounted 
 * @returns array of file urls and error(boolean value)
 */
export const getMyFiles = (signal) => {
    return axios.get(`${BASE_URL}/my-files`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        signal
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