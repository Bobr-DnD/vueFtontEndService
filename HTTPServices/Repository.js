import axios from 'axios'

const apiUrl = 'http://localhost:8080/api'
export default axios.create({
    baseURL: apiUrl,
    withCredentials: false,
    headers:{
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})