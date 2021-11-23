import { baseUrl } from './http'
import axios from 'axios'


export const getCurrentCity = () => {
    const localCity = JSON.parse(localStorage.getItem('hkzf_city'));
    if(!localCity){
        return new Promise((resolve, reject)=>{
            const myCity = new window.BMapGL.LocalCity();
            myCity.get(async data =>{
            try{
                const res = await axios.get(`${baseUrl}/area/info`,{
                                params:{
                                    name: data.name
                                }
                            })
                console.log(res.data.body)
                localStorage.setItem('hkzf_city', JSON.stringify(res.data.body))
                resolve(res.data.body)
            }catch(e){
                reject(e)
            }
        })}); 
    }else{
        return Promise.resolve(localCity)
    }
    
}
