import axios from "axios"

export const baseUrl = 'http://localhost:8009'


// export const http = (path, config={}) => {
//     axios(`${baseUrl}${path}`, {
//         method: 'get',
//         ...config
//     })
//     .then((data)=>{
//         return data
//     })
//     .catch((e)=>{
//         return e
//     })
// }