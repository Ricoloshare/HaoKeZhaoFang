import React, { useEffect, useState, useRef} from 'react'
import { Toast  } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import {  http } from '../../utils/http'
import { getCurrentCity } from '../../utils/utils'
import cityStyled from './index.module.css'
import {AutoSizer, List} from 'react-virtualized';
import NavHeader from '../../components/NavHeader'

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
    // const back = () =>{
    //     history(-1)
    // }
    const [cityLists, setcityLists] = useState({})
    const [cityIndexs, setcityIndexs] = useState([])
    const couterRef  = useRef()
    const [activeIndex, setActiveIndex] = useState(0)
    useEffect(() => {
        const fetchData = async () => {
            const result = await http.get('/area/city', {
                params: {
                    level: 1
                }
            })
            const {cityList, cityIndex} = formatCtyData(result.data.body) 
            const res = await http.get('/area/hot')
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
            <div key={key} style={style} className={cityStyled.city}>
                <div className={cityStyled.title}>{formatCityIndex(letter)}</div>
                {
                    cityLists[letter] ? cityLists[letter].map((item)=>{
                        return <div className={cityStyled.name} key={item.value} onClick={()=> changeCity(item)}>{item.label}</div>
                    }) : ''
                }
            </div>
        );
    }
    const changeCity = async (city) => {
        if(city.label === '上海' || city.label === '深圳' || city.label === '北京' || city.label === '广州'){
            // const res = await axios.get(`${baseUrl}/area/map`)
            localStorage.setItem('hkzf_city', JSON.stringify(city))
            history(-1)
        }else{
            return Toast.show({
                content: '暂无房屋信息',
                maskClickable: true
              })
        }
        

    }
    const getRowHeight = ({index}) => {
            const letter = cityIndexs[index]
            const height = cityLists[letter] ? 50 * cityLists[letter].length + 30 : 0
            return height
        }
    const moveToRender = ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex }) => {
        console.log(overscanStartIndex, overscanStopIndex, startIndex, stopIndex)
        if(startIndex !== activeIndex){
            setActiveIndex(startIndex)
        }
    }
    const moveto = (index) => {
        setActiveIndex(index)
        couterRef.current.scrollToRow(index)
    }
    return (
        <div className={cityStyled.citylist}>
            <NavHeader title={'城市选择'}/>
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
        <ul className={cityStyled['city-index']}>
            {
                props.cityIndexs.map((item, index) => {
                    return <li className={cityStyled['city-index-item']}  key={item} onClick={()=>props.moveto(index)}>
                        <span className={props.activeIndex === index ? cityStyled['index-active'] : ''} >{item === 'hot' ? '热': item.toUpperCase()}</span>
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
  
