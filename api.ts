import axios from 'axios'

export const api = axios.create({
    // baseURL: 'http://localhost:3000/',
    baseURL: 'https://expressjs-prisma-production-3541.up.railway.app/',
})

export const imagemDefault = 'https://drive.google.com/uc?export=view&id=1m6viwMw3f-3LVSTpCMz-MXfMZYtRdQlb'
