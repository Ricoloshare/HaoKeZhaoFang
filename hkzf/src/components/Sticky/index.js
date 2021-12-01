import React, {useRef, useEffect} from 'react'
import styled from '@emotion/styled'
import style from './index.module.css'

export default function Sticky(props) {
    const content = useRef()
    const placeholder = useRef()

    const handleScroll = () => {
        const contentEl = content.current
        const placeholderEl = placeholder.current
        let top = placeholderEl && placeholderEl.getBoundingClientRect().top
        if(contentEl && placeholderEl && top <= 0){
            contentEl.classList.add(style.fixed)
            placeholderEl.style.height = props.height + 'px'
        }else if(contentEl && placeholderEl && top > 0){
            contentEl.classList.remove(style.fixed)
            placeholderEl.style.height = 0 + 'px'
        }
    }
    useEffect(()=>{
        window.addEventListener('scroll', handleScroll)
        return ()=>{
            window.removeEventListener('scroll', handleScroll)
        }
    })
    return (
        <Container>
            <div ref={placeholder} />
            <div ref={content}>{props.children}</div>
        </Container>
    )
}


const Container = styled.div`
    width: 100%;
`
