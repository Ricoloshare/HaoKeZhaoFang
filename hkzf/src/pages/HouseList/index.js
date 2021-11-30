import React, { useEffect, useState }  from 'react'
import SearchHeader from '../../components/SearchHeader'
import { useNavigate  } from 'react-router-dom'
import { baseUrl, http } from '../../utils/http'
import { Grid , Swiper } from 'antd-mobile'
import style from './index.module.css'
import Filter from './components/Filter'
import HouseItem from '../../components/HouseItem'
import {AutoSizer, List, WindowScroller, InfiniteLoader} from 'react-virtualized';
import Sticky from '../../components/Sticky'

export default function HouseList() {
    const history = useNavigate()
    const {label, value} = JSON.parse(localStorage.getItem("hkzf_city"));
    const [houselist, setHouseList] = useState([])
    const [filter, setFilter] = useState({})
    const [count, setCount] = useState(0)

    const onFilter = (filter) => {
        setFilter(filter)
    }

    const getHouses = async(filter) => {
        const params = {
            cityId: value,
            ...filter,
            start: 1,
            end: 20,
        };
        const res = await http.get('/houses',{
            params: params
        })
        const {list, count} = res.data.body
        setHouseList(list)
        setCount(count)
    }
    const rowRenderer = ({key, index, style}) => {
        const item = houselist[index]
        if(item){
            return <HouseItem 
                style={style}
                key={key}
                // 图片地址
                src={baseUrl + item.houseImg}
                onClick={() => this.props.history.push(`/detail/${item.houseCode}`)}
                title={item.title}
                desc={item.desc}
                tags={item.tags}
                price={item.price}
            />
        }else{
            return <div key={key} style={style}>
                <p>loading</p>
            </div>
        }
            
    }
    useEffect(()=>{
        getHouses(filter)
    },[filter])

    const isRowLoaded = ({ index }) => {
        return !!houselist[index];
    }
      
    const loadMoreRows =  ({ startIndex, stopIndex }) => {
        const params = {
            cityId: value,
            ...filter,
            start: startIndex,
            end: stopIndex,
        };

        return new Promise((resolve, reject)=>{
            http.get('/houses',{
                params: params
            })
            .then(res=>{
                const {list, count} = res.data.body
                setHouseList([...houselist, ...list])
                setCount(count)
                resolve()
            })
        })
    }
      
    return (
        <div className={style.houselist}>
            <div className={style.header}>
                <i className={'iconfont icon-back'} onClick={()=> {history(-1)}}></i>
                <SearchHeader location = {label} className = {style.searchHead} />
            </div>
            <Sticky height={40}><Filter onFilter= {onFilter}/></Sticky>
            <InfiniteLoader
                isRowLoaded={isRowLoaded}
                loadMoreRows={loadMoreRows}
                rowCount={count}
            >
                {({ onRowsRendered, registerChild }) => (
                    <WindowScroller>
                    {({ height, isScrolling, scrollTop }) => (
                        <AutoSizer>
                            {({ width}) => (
                            <List
                                autoHeight
                                height={height}
                                isScrolling={isScrolling}
                                rowCount={count}
                                rowHeight={120}
                                scrollTop={scrollTop}
                                rowRenderer={rowRenderer}
                                width={width}
                                onRowsRendered={onRowsRendered}
                                ref={registerChild}
                            />
                            )}
                        </AutoSizer>
                    )}
                    </WindowScroller>
            )}
            </InfiniteLoader>
        </div>
    )
}