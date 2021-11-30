import React, { useEffect, useState }  from 'react'
import SearchHeader from '../../components/SearchHeader'
import { useNavigate  } from 'react-router-dom'
import { baseUrl, http } from '../../utils/http'
import { Toast } from 'antd-mobile'
import style from './index.module.css'
import Filter from './components/Filter'
import HouseItem from '../../components/HouseItem'
import {AutoSizer, List, WindowScroller, InfiniteLoader} from 'react-virtualized';
import Sticky from '../../components/Sticky'
import { getCurrentCity } from '../../utils/utils'

export default function HouseList() {
    const history = useNavigate()
    const [houselist, setHouseList] = useState([])
    const [filter, setFilter] = useState({})
    const [count, setCount] = useState(0)
    const [isLoading, setisLoading] = useState(true)
    const onFilter = (filter) => {
        setFilter(filter)
        // 点击确定按钮时， 页面回到顶部
        window.scrollTo(0, 0);
        getHouses(filter)
    }
    const {label, value} = JSON.parse(localStorage.getItem('hkzf_city'));

    const getHouses = async(filter) => {
        const params = {
            cityId: value,
            ...filter,
            start: 1,
            end: 20,
        };
        Toast.show({
            icon: 'loading',
            content: '加载中…',
            duration: 0,
        })
        setisLoading(true)
        const res = await http.get('/houses',{
            params: params
        })
        // Toast.clear()
        setisLoading(false)
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
    
    const HouseListRender = () => {
        return (
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
        )
    }
    return (
        <div className={style.houselist}>
            <div className={style.header}>
                <i className={'iconfont icon-back'} onClick={()=> {history(-1)}}></i>
                <SearchHeader location = {label} className = {style.searchHead} />
            </div>
            <Sticky height={40}><Filter onFilter= {onFilter}/></Sticky>
            {count === 0 && !isLoading ? <h3 className={style.no}>没有找到房源</h3>  : HouseListRender()}
        </div>
    )
}