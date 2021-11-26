import React from 'react'
import SearchHeader from '../../components/SearchHeader'
import { useNavigate  } from 'react-router-dom'
import { baseUrl, http } from '../../utils/http'
import { Grid , Swiper } from 'antd-mobile'
import style from './index.module.css'

export default function HouseList() {
    const history = useNavigate()
    const {label, value} = JSON.parse(localStorage.getItem("hkzf_city"));

    return (
        <div className={style.houselist}>
            <div className={style.header}>
                <i className={'iconfont icon-back'} onClick={()=> {history(-1)}}></i>
               <SearchHeader location = {label} className = {style.searchHead} />
            </div>
            
        </div>
    )
}