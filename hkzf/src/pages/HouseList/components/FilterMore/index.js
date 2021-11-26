import React, {useState} from 'react'
import { baseUrl, http } from '../../../../utils/http'

import FilterFooter from '../../../../components/FilterFooter'

import style from './index.module.css'

export default function FilterMore(props) {
    const {
        onCancel,
        onComfirm,
        data:{
            characteristic, floor, oriented, roomType
        },
        defaultValue
    } = props

    const [selectedValues, setselectedValues] = useState(defaultValue['more'])

    const onClear = () => {
        setselectedValues([])
    }
    const onTagClick = (value) => {
        let selected = [...selectedValues]

        if(selected.includes(value)){
            let index = selected.indexOf(value)
            selected.splice(index, 1)
        }else{
            selected.push(value)
        }
        setselectedValues([...selected])
    }

    const renderFilters = (data) => {
        // 高亮类名： styles.tagActive
        console.log(data)
        return data.map( item => {
            // 判断选中数组中是否有当前标签值
            const isSelected = selectedValues.includes(item.value);
            return (
                <div 
                    key={item.value} 
                    className={[style.tag, isSelected ? style.tagActive : '' ].join(' ')}
                    onClick={ () => onTagClick(item.value) }
                >
                    {item.label}
                </div>
                
            )
        })
    }
    return (
        <div className={style.root}>
                <div className={style.mask} onClick= {()=>onCancel()}  ></div>
                {/* 条件内容 */}
                <div className={style.tags}>
                    <div className={style.name}>户型</div>
                    <div className={style.child}>{renderFilters(roomType)}</div>

                    <div className={style.name}>朝向</div>
                    <div className={style.child}>{renderFilters(oriented)}</div>
                    
                    <div className={style.name}>楼层</div>
                    <div className={style.child}>{renderFilters(floor)}</div>

                    <div className={style.name}>房屋特色</div>
                    <div className={style.child}>{renderFilters(characteristic)}</div>
                </div>
                <FilterFooter 
                    className={style.buttons} 
                    onCancel = {()=>onClear()}  
                    onOk = {()=>onComfirm('more', selectedValues)} 
                    cancelText = {'清除'} 
                />
        </div>
    )
}