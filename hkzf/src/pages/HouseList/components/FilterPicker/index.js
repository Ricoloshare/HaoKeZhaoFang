import React,{useState} from 'react'
import { baseUrl, http } from '../../../../utils/http'
import {CascadePicker  } from 'antd-mobile'
import FilterFooter from '../../../../components/FilterFooter'
// import style from './index.module.css'

export default function FilterPicker(props) {

    const {onCancel, onComfirm, data, type, defaultValue, setselectValues, selectValues} = props
    // const [value, setValue] = useState([])
    return (
        <>
            <CascadePicker
                options={data}
                visible={true}
                onClose={onCancel}
                onConfirm={
                    onComfirm
                }
                defaultValue = {defaultValue[type]}
                onSelect={val => {
                    setselectValues({
                        ...selectValues,
                        [type]: val
                    })
                }}
            />
            {/* <FilterFooter onCancel = {()=>onCancel()}  onOk = {()=>onComfirm(type, value)}/> */}
        </>
    )
}