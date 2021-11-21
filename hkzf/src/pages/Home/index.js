import { NavBar, TabBar } from 'antd-mobile'
import React from 'react'
import {
  Route,
  useNavigate,
  useLocation,
  Routes,
} from 'react-router-dom'

import styled from '@emotion/styled'
import './index.css'

import Index from '../Index'

const Bottom = () => {
  const history = useNavigate()
  const location = useLocation()
  const { pathname } = location

  const setRouteActive = (value) => {
    history(value)
  }

  const tabs = [
    {
      key: '/home',
      title: '首页',
      icon: <i className="iconfont icon-ind" />,
    },
    {
      key: '/home/list',
      title: '找房',
      icon: <i className="iconfont icon-findHouse" />,
    },
    {
      key: '/home/news',
      title: '资讯',
      icon: <i className="iconfont icon-infom" />,
    },
    {
      key: '/home/me',
      title: '我的',
      icon: <i className="iconfont icon-my" />,
    },
  ]

  return (
    <TabBar activeKey={pathname} onChange={value => setRouteActive(value)}>
      {tabs.map(item => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  )
}

export default function home() {
  return (
    <div>
      <Container>
        {/* <div className={'top'}>
          <NavBar>配合路由使用</NavBar>
        </div> */}
        <ContainerBody>
          <Routes>
            <Route path='/' element={<Index />} />
            <Route path='/list' element={<Todo />} />
            <Route path='/news' element={<Message />} />
            <Route path='/me' element={<PersonalCenter />} />
          </Routes>
        </ContainerBody>
        <ContainerBottom>
          <Bottom />
        </ContainerBottom>
      </Container>
    </div>
  )
}
const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
`
const ContainerBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: top;
  align-items: center;
`
const ContainerBottom = styled.div`
  flex: 0;
  border-top: solid 1px var(--adm-border-color);
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  background-color: #fff;
`
function Life() {
  return <div>首页</div>
}

function Todo() {
  return <div>我的代办</div>
}

function Message() {
  return <div>我的消息</div>
}

function PersonalCenter() {
  return <div>个人中心</div>
}
