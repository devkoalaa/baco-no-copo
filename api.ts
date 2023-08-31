import axios from 'axios'

export const api = axios.create({
    baseURL: 'https://expressjs-prisma-production-3541.up.railway.app/',
})

export const imagemDefault = 'https://lh3.googleusercontent.com/u/0/drive-viewer/AITFw-wYu7jttI7XmNg4q3RYRShmdZ0qV6ljCi3HYQAYdlXH0k7dtohmd2mpdJQB8EebUnHIWkj-xLpbXm1bYZFhsJpzOqxjqw=w1366-h643'
