import axios from "axios"

export const baseUrl = process.env.REACT_APP_URL


export const http = axios.create({
    baseURL: baseUrl
})