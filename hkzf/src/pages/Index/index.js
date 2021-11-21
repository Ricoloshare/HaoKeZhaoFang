import React, { useState, useEffect } from 'react'
import { Grid , Swiper } from 'antd-mobile'
import styled from '@emotion/styled'
import axios from 'axios'
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'
import { baseUrl } from '../../utils/http'
import {    useNavigate  } from 'react-router-dom'
import './index.css'
export default function Index () {
  const [swiper, setSwiper] = useState([])
  const [areaGroup, setareaGroup] = useState([])
  const [news, setNews] = useState([])
  useEffect(() => {
    axios.get(`${baseUrl}/home/swiper`)
        .then((res)=>{
            
            setSwiper(res.data.body) 
        })
    axios.get(`${baseUrl}/home/groups`,{
        params:{
            area: 'AREA|88cff55c-aaa4-e2e0'
        }
    })
        .then((res)=>{
            console.log(res)
            setareaGroup(res.data.body) 
        })
    axios.get(`${baseUrl}/home/news`,{
        params:{
            area: 'AREA|88cff55c-aaa4-e2e0'
        }
    })
        .then((res)=>{
            console.log(res)
            setNews(res.data.body) 
        })
    return () => {
    }
  }, [])
  const items = swiper.map((data, index) => (
    <Swiper.Item key={index}>
      <Container
        key={data.id}
        style={{ backgroundImage: `url(${baseUrl}${data.imgSrc})` }}
      >
      </Container>
    </Swiper.Item>
  ))
  return (
      <Wrapper>
        <SwiperEle>
            <Swiper autoplay>{items}</Swiper>
            <Search></Search>
        </SwiperEle>
        <Nav/>
        <AreaGroup group={areaGroup} />
        <News news={news}></News>
      </Wrapper>
  )
}

const Search = () => {
    const history = useNavigate()
    return (
        <SearchContainer>
            <SearchBox>
                <div className='location' onClick={()=> history('/citylist')}>
                    <span>上海</span>
                    <i className={'iconfont icon-arrow'}></i>
                </div>
                <div className='form' onClick={()=> history('/search')}>
                    <i className={'iconfont icon-seach'}></i>
                    <span className='text'>请输入小区或地址</span>
                </div>
            </SearchBox>
            <i className={'iconfont icon-map'} style={{color: 'white', fontSize: '35px'}} onClick={()=> history('/map')}></i>
        </SearchContainer>
    )
}


const navs = [{
    id: 1,
    img: Nav1,
    title: '整租',
    path: '/home/list'
},{
    id: 2,
    img: Nav2,
    title: '合租',
    path: '/home/list'
},{
    id: 3,
    img: Nav3,
    title: '地图找房',
    path: '/home/list'
},{
    id: 4,
    img: Nav4,
    title: '出租',
    path: '/home/list'
},]
const SwiperEle = styled.div`
    height: 212px;
    position: 'relative';
`
const SearchContainer = styled.div`
    width: 100%;
    display: flex;
    position: absolute;
    top: 20px;
    left: 0;
    padding: 0 10px;
`
const SearchBox = styled.div`
    display: flex;
    flex: 1;
    height: 34px;
    margin: 0 10px;
    padding: 5px 5px 5px 8px;
    border-radius: 3px;
    background-color: #fff;
    align-items: center;
`
const NavContainer = styled(Grid.Item)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 10px 0;
`
const Image = styled.img`
    width: 48px;
    margin-bottom: 7px;
`
const Font = styled.h2`
    font-size: 13px;
    font-weight: normal;
`
const Wrapper = styled.div`
    width: 100%;
`

const Container = styled.div`
  height: 212px;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  user-select: none;
  background-size: contain;
`
const AreaGroupTitle = styled.div`
    width: 100%;
    display: flex;
    padding: 10px;
    justify-content: space-between;
    
`
const AreaGroupLink = styled.p`
    color: #ccc;
    font-size: 14px;
`
const Tiltle = styled.p`
    color: #000;
    font-size: 15px;
    font-weight: bold;
`
const AreaGroupContainer = styled.div`
    background-color: #eee;
    padding: 0px 0 5px 0;
`
const AreaGroupContent = styled.div`
    height: 100px;
    display: flex;
    background-color: #fff;
    justify-content: space-around;
    align-items: center;
`
const AreaGroupContentLeft = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`
const AreaGroupContentRight = styled.img`
    width: 68px;
    height: 68px;
`
const NewsContentLeft = styled.img`
    height: 120px;
    width: 380px;
    margin-right: 20px;
`
const NewsContentRight = styled.div`
`
const NewsContent = styled.div`
    height: 150px;
    display: flex;
    background-color: #fff;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid #ccc;
    padding: 0 10px;
`
const Nav = () => {
    const history = useNavigate()
    return (
        <Grid columns={4} gap={8}>  
          {navs.map(item =>
            <NavContainer key={item.id} onClick={()=> history(item.path)}>
                <Image src={item.img} />
                <Font>{item.title}</Font>
            </NavContainer>
          )}
        </Grid>
    )
}

const AreaGroup = (props) => {
    return (
        <AreaGroupContainer>
            <AreaGroupTitle>
                <Tiltle>租房小组</Tiltle>
                <AreaGroupLink>更多</AreaGroupLink>
            </AreaGroupTitle>
            <Grid columns={2} gap={8} > 
                {props.group.map((item)=><AreaGroupContent key={item.id}>
                    <AreaGroupContentLeft>
                        <p>{item.title}</p>
                        <p>{item.desc}</p>
                    </AreaGroupContentLeft>
                    <AreaGroupContentRight src={`${baseUrl}${item.imgSrc}`} />
                </AreaGroupContent>)}
            </Grid>
        </AreaGroupContainer>
    )
}

const News = (props) => {
    return (
        <AreaGroupContainer>
            <AreaGroupTitle>
                <Tiltle>最新资讯</Tiltle>
            </AreaGroupTitle>
            <div style={{marginBottom:'50px'}}>
                {props.news.map((item)=>
                    <NewsContent key={item.id}>
                        <NewsContentLeft src={`${baseUrl}${item.imgSrc}`}></NewsContentLeft>
                        <NewsContentRight>
                            <Tiltle>{item.title}</Tiltle>
                            <p>{item.from}-{item.date}</p>
                        </NewsContentRight>
                    </NewsContent>
                )}
            </div>
        </AreaGroupContainer>
    )
}

