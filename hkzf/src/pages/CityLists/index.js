import React, { useEffect, useState, useRef, useMemo } from 'react'
import { NavBar } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { baseUrl } from '../../utils/http'
import styled from '@emotion/styled'
import axios from 'axios'
import { getCurrentCity } from '../../utils/utils'
import './index.css'
import {AutoSizer, List} from 'react-virtualized';

const formatCtyData = (list) => {
    const cityList = {}

    list.forEach(item => {
        const first = item.short.substr(0, 1)
        if(cityList[first]){
            cityList[first].push(item)
        }else{
            cityList[first] = [item]
        }
    });

    const cityIndex = Object.keys(cityList).sort()

    return {
        cityList,
        cityIndex
    }
}
export default function CityList() {
    const history = useNavigate()
    const back = () =>{
        history('/home')
    }
    const [cityLists, setcityLists] = useState({})
    const [cityIndexs, setcityIndexs] = useState([])
    const couterRef  = useRef()
    const [activeIndex, setActiveIndex] = useState(0)
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(`${baseUrl}/area/city`, {
                params: {
                    level: 1
                }
            })
            const {cityList, cityIndex} = formatCtyData(result.data.body) 
            const res = await axios.get(`${baseUrl}/area/hot`)
            cityIndex.unshift("hot");
            cityList['hot'] = res.data.body;
            const currentCity = await getCurrentCity();
            cityIndex.unshift("#");
            cityList['#'] = [currentCity];
            setcityIndexs(cityIndex)
            setcityLists(cityList)
            couterRef.current.recomputeRowHeights()
            couterRef.current.measureAllRows()
          };
       
          fetchData();

          
      },[]);

    function rowRenderer({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
        }) {
            
        const letter = cityIndexs[index]
        return (
            <div key={key} style={style} className='city'>
                <div className='title'>{formatCityIndex(letter)}</div>
                {
                    cityLists[letter] ? cityLists[letter].map((item)=>{
                        return <div className='name' key={item.value}>{item.label}</div>
                    }) : ''
                }
            </div>
        );
    }
    const getRowHeight = ({index}) => {
            const letter = cityIndexs[index]
            const height = cityLists[letter] ? 50 * cityLists[letter].length + 30 : 0
            return height
        }
    const moveToRender = ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex }) => {
        console.log(overscanStartIndex, overscanStopIndex, startIndex, stopIndex)
        if(startIndex !== activeIndex){
            // setActiveIndex(startIndex)
        }
    }
    const moveto = (index) => {
        setActiveIndex(index)
        couterRef.current.scrollToRow(index)
    }
    return (
        <div className='citylist'>
            <NavBar onBack={back}>城市选择</NavBar>
            <AutoSizer>
                {({height, width}) => (
                <List
                    height={height}
                    rowCount={cityIndexs.length}
                    rowHeight={getRowHeight}
                    rowRenderer={rowRenderer}
                    width={width}
                    ref={couterRef}
                    onRowsRendered={moveToRender}
                    scrollToAlignment="start"
                />
                )}
            </AutoSizer>
            <NavList cityIndexs = {cityIndexs} activeIndex = {activeIndex} moveto = {moveto} ></NavList>
        </div>
    )
}
const NavList = (props) => {
    
    
    return (
        <ul className='city-index'>
            {
                props.cityIndexs.map((item, index) => {
                    return <li className='city-index-item' key={item} onClick={()=>props.moveto(index)}>
                        <span className={props.activeIndex === index ? 'index-active': ''} >{item === 'hot' ? '热': item.toUpperCase()}</span>
                    </li>
                })
            }
        </ul>
    )
}

const formatCityIndex = (letter) => {
    switch(letter){
        case '#':
            return '当前城市'
        case "hot":
            return '热门城市'
        default:
            return letter.toUpperCase()
    }
}
  
