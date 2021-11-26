import React from 'react'
import styled from '@emotion/styled'
import {    useNavigate  } from 'react-router-dom'
import style from './index.module.css'

export default function SearchHeader(props) {
    const history = useNavigate()
    return (
        <SearchContainer className={[style.searchwrapper, props.className || ''].join(" ")}>
            <SearchBox>
                <div className={style.location} onClick={()=> history('/citylist')}>
                    <span>{props.location}</span>
                    <i className={'iconfont icon-arrow'}></i>
                </div>
                <div className={style.form} onClick={()=> history('/search')}>
                    <i className={'iconfont icon-seach'}></i>
                    <span className={style.text}>请输入小区或地址</span>
                </div>
            </SearchBox>
            <i className={'iconfont icon-map'} onClick={()=> history('/map')}></i>
        </SearchContainer>
    )
}


const SearchContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`
const SearchBox = styled.div`
    display: flex;
    flex: 1;
    height: 34px;
    margin: 0 10px 0 0px;
    padding: 5px 5px 5px 8px;
    border-radius: 3px;
    background-color: #fff;
    align-items: center;
`