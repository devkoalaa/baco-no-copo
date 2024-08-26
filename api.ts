import axios from 'axios'

export const api = axios.create({
    // baseURL: 'http://192.168.237.206:5757/',
    // baseURL: 'http://localhost:5757/',
    baseURL: 'https://baco-api.vercel.app/',
})

export const imagemDefault = 'https://drive.google.com/uc?export=view&id=1BkOWiXuONLBHee6ptdgioA6WcDl4AUFa'
