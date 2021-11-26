import React from 'react'
import style from './index.module.css'
import {Flex} from '../common'
import { Button, Space } from 'antd-mobile'

export default function FilterFooter(props){
    const {cancelText, okText, onCancel, onOk, className} = props;
    
    return <Flex className={[style.root, className ||''].join(' ')}>
    {/* 取消按钮 */}
    <Button className={[style.cancel].join(' ')} onClick={onCancel}>
        {cancelText ? cancelText : '取消'}
    </Button>

    {/* 确定按钮 */}
    <Button className={[style.ok].join(' ')} color='primary' onClick={onOk}>
        {okText ? okText : '确定'}
    </Button>
    </Flex>
}