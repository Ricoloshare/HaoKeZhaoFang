import React, {useState} from 'react'
import { useEffect } from 'react/cjs/react.development'
import { baseUrl, http } from '../../../../utils/http'

import FilterMore from '../FilterMore'
import FilterPicker from '../FilterPicker'
import FilterTitle from '../FilterTitle'

import style from './index.module.css'

// 标题栏数组
const titleSelected = {
    area: false,
    mode: false,
    price: false,
    more: false
}
const selectedValues = {
    area: ['area', 'null', null, null],
    mode: ['null'],
    price: ['null'],
    more: []
}

export default function Filter(props) {
    const {value} = JSON.parse(localStorage.getItem("hkzf_city"));

    const [titleSelectedStatus, settitleSelectedStatus] = useState({...titleSelected})
    // 控制 FilterPicker  FilterMore 组件的展示或隐藏
    const [openType, setopenType] = useState('')
    const [filterDate, setfilterDate] = useState(selectedValues)
    const [selectValues, setselectValues] = useState(selectedValues)
    const [isMask, setisMask] = useState(false)
    const [filters, setfilters] = useState({})
 
    useEffect(()=>{
        getFilterDate()
    },[])

    useEffect(()=>{
        props.onFilter(filters)
    }, [filters])

    const getFilters = async() => {
        const {area, mode, price, more} = selectValues
        const params = {}
        params[area[0]] = area[1]
        for(let i = 2; i < area.length; i++){
            if(area[i]){
                params[area[0]] = area[i]
            }
        }
        params['more'] = more.join(",")
        params['mode'] = mode[0]
        params['price'] = price[0]
        setfilters(params)
    }

    const getFilterDate = async() => {
        
        const res = await http.get(`/houses/condition?id=${value}`)
        setfilterDate(res.data.body)
    }

    const onSelected = (type) => {
        setisMask(true)
        const curtitleSelected = {...titleSelectedStatus}
        for(let key in selectValues){
            if(JSON.stringify(selectValues[key]) === JSON.stringify(selectedValues[key])){
                curtitleSelected[key] = false
            }
        }
        settitleSelectedStatus({
            ...curtitleSelected,
            [type]: true
        })
        setopenType(type)
    }

    const onCancel = ()=>{
        const curtitleSelected = {...titleSelectedStatus}
        if(JSON.stringify(selectValues[openType]) === JSON.stringify(selectedValues[openType])){
            curtitleSelected[openType] = false
        }else{
            curtitleSelected[openType] = true 
        }
        settitleSelectedStatus({
            ...curtitleSelected
        })
        setopenType('')
        setisMask(false)
    }

    const onComfirm = () => {
        const curtitleSelected = {...titleSelectedStatus}
        if(JSON.stringify(selectValues[openType]) === JSON.stringify(selectedValues[openType])){
            curtitleSelected[openType] = false
        }else{
            curtitleSelected[openType] = true
        }
        settitleSelectedStatus({
            ...curtitleSelected,
        })
        // settitleSelectedStatus(prevState  => {
        //     console.log(prevState)
        //     return prevState 
        // })
        
        setopenType('')
        setisMask(false)
        getFilters()
        
    }

    const pickerRender = () => {
        const {area, subway, price, rentType} = filterDate;
        if(openType === 'area' || openType === 'mode' || openType === 'price'){
            let data = []
            switch(openType){
                case 'area': 
                    data = [area, subway]
                break;
                case 'mode': 
                    data = rentType
                break
                case 'price': 
                    data = price
                break
                default:
                break
            }
            return <FilterPicker 
                    key={openType}
                    type={openType} 
                    onCancel = {onCancel} 
                    onComfirm={onComfirm} 
                    data={data} 
                    setselectValues = {setselectValues}
                    selectValues = {selectValues}
                    defaultValue = {selectValues}
                    />
        }else{
            return null
        }
        
    }

    const moreRender = () => {
        if(openType === 'more' ){
            return <FilterMore 
                    onCancel = {onCancel} 
                    onComfirm={onComfirm} 
                    data = {filterDate}
                    defaultValue = {selectValues}
                   />
        }
        return 
    }
    return (
        <div className={style.root}>
                {/* 遮罩层组件 */}
                <div className={isMask ? style.mask : ''} onClick={()=>{onCancel()}}></div>

                {/* 内容组件 */}
                <div className={style.content}>
                    {/* 标题栏 */}
                    <FilterTitle  titleSelectedStatus={titleSelectedStatus} onClick = {onSelected}/>

                    {pickerRender()}

                    {moreRender()}
                </div>
        </div>
    )
}