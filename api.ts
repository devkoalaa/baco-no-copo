import axios from 'axios'

export const api = axios.create({
    // baseURL: 'http://localhost:3000/',
    baseURL: 'https://baco-api.up.railway.app/',
})

export const imagemDefault = 'https://drive.google.com/uc?export=view&id=1m6viwMw3f-3LVSTpCMz-MXfMZYtRdQlb'
