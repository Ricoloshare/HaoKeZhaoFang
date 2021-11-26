import React, {useEffect, useState} from 'react'
import style from './index.module.css'
import {Flex} from '../../../../components/common'
// import {  } from 'react/cjs/react.development';


const titleList = [
    {title: '区域', type: 'area'},
    {title: '方式', type: 'mode'},
    {title: '价格', type: 'price'},
    {title: '筛选', type: 'more'}
]


export default function FilterTitle(props) {
    const {titleSelectedStatus, onClick} = props;

    return (
        <Flex className={style.root}>
            {
                titleList.map( item => {
                    return (
                        <div key={item.type} 
                        onClick={ () => onClick(item.type) } 
                        >
                            <span 
                            className={[style.dropdown, titleSelectedStatus[item.type] ? style.selected : ''].join(' ')}
                            >
                                <span>{item.title}</span>
                                <i className="iconfont icon-arrow" />
                            </span>
                        </div>
                    )
                })
            }

        </Flex>
    )
}

