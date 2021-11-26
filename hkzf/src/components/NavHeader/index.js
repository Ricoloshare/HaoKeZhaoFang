import React from 'react'
import { NavBar  } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
export default function NavHeader (props) {
    const history = useNavigate()
    const back = () =>{
        history(-1)
    }

    return <NavBarHeader onBack={back}>{props.title}</NavBarHeader>
}


const NavBarHeader = styled(NavBar)`
    background-color: rgb(245, 245, 245);
`
    
