import React, { useState } from 'react'
import { useNavigate  } from 'react-router-dom'
import {
  Form,
  Input,
  Button,
  NavBar,
  AutoCenter,
  Toast
} from 'antd-mobile'
import { http } from '../../utils/http'

export default function Login(params) {
    const history = useNavigate()
    const [error, seterror] = useState('')
    const onFinish = (values) => {
        console.log(values)
        http.post('/user/login', {
            ...values
        })
        .then((res)=>{
            if(res.data.status !== 200) seterror(res.data.description)
            else{
                localStorage.setItem('hkzf_token',res.data.body.token)
                Toast.show({
                    content: '登录成功',
                    afterClose: () => {
                        history(-1)
                    },
                })
                
            }
        })
        .catch((e)=>{
            seterror(e)
        })
    }
    const onChange = () => {
        seterror('')
    }
    const back = () =>{
        history(-1)
    }
    return (
        <>
            <NavBar onBack={back}>登录</NavBar>
            <AutoCenter>
                <p style={{color: 'red'}}>{error}</p>
                <Form
                    onFinish={onFinish}
                    
                    footer={
                        <Button block type='submit' color='primary'>
                            提交
                        </Button>
                    }
                    >
                    <Form.Item
                        name='username'
                        label='用户名'
                        rules={[{ required: true, message: '用户名不能为空' }]}
                    >
                        <Input onChange={onChange} placeholder='请输入用户名' />
                    </Form.Item>
                    <Form.Item name='password' label='密码' rules={[{ required: true, message: '密码不能为空' }]} >
                        <Input onChange={onChange} placeholder='请输入密码'  type='password'/>
                    </Form.Item>
                </Form>  
            </AutoCenter>
            
        </>
    )
}