import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import NavHeader from '../../components/NavHeader'
import style from './index.module.css'
import { baseUrl, http } from '../../utils/http'
import { Link } from "react-router-dom";
import HouseItem from '../../components/HouseItem'
import { Toast } from 'antd-mobile'

const baiduMap = ({setisShowList, sethouseLists}) => {
    const BMapGL = window.BMapGL
    const {label, value} = JSON.parse(localStorage.getItem("hkzf_city"));
    const map = new BMapGL.Map("container");
    
    const init = () => {
        const myGeo = new BMapGL.Geocoder();
        
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(label, async (point) =>{
            if(point){
                // 定位到中心点坐标
                map.centerAndZoom(point, 11);
                // 开启鼠标滚轮缩放
                map.enableScrollWheelZoom(true); 
                // 设置地图初始倾斜角度n
                map.setTilt(20); 
                // 添加比例尺控件
                map.addControl(new BMapGL.ScaleControl());
                // 添加缩放控件
                map.addControl(new BMapGL.ZoomControl());
                // 添加定位控件
                map.addControl(new BMapGL.LocationControl());
                
                overLaysRenderDate(value)
                
            }else{
                alert('您选择的地址没有解析到结果！');
            }
        }, label)
    }
    
    const createOverLays = (item, zoom, type) => {
        if(type === 'circle'){
            createCircle(item, zoom)
        }else{
            createRect(item, zoom)
        }
    }

    const overLaysRenderDate = async(areaId)=>{
        try {
            Toast.show({
                icon: 'loading',
                content: '加载中…',
                duration: 0
            })
            const areaData = await http.get(`/area/map`,{
                params:{
                    id: areaId
                }
            })
            Toast.clear()
            const {nextZoom, type} = getTypeAndZoom()
            console.log(nextZoom, type)
            areaData.data.body.forEach(item => {
                createOverLays(item, nextZoom, type)
            })
        } catch (error) {
            Toast.clear()
        }
        
    }  
    
    const getTypeAndZoom = () => {
        const curZoom = map.getZoom()
        let nextZoom, type
        if(curZoom >= 10 && curZoom < 12){ // 11
            nextZoom = 13
            type = 'circle'
        }else if(curZoom >= 12 && curZoom < 14){ // 13
            nextZoom = 15
            type = 'circle'
        }else if(curZoom >= 14 && curZoom < 16){ // 15
            type = 'rect'
        }

        return {
            nextZoom,
            type
        }
    }

    const createRect = (item) => {
        const overlayPoint = new BMapGL.Point(item.coord.longitude, item.coord.latitude)
        const overlay = new BMapGL.Label('', {       // 创建文本标注
            position: overlayPoint,   // 设置标注的地理位置
            offset: new BMapGL.Size(-5, -35)           // 设置标注的偏移量
        })  

        map.addOverlay(overlay); 

        overlay.setContent(`
            <div class='${style.box}'>
                <p class='${style.name}'>${item.label}</p>
                <p>${item.count}套</p>
            </div>`)

        overlay.setStyle({                              // 设置label的样式
            color: '#fff',
            border: '0px solid rgb(255, 0, 0)',
            cursor: 'pointer',
            textAlign: 'center',
        })

        overlay.id = item.value
        overlay.addEventListener("click", async(event)=>{  
            const target = event.domEvent.changedTouches[0]
            const x = window.innerWidth / 2 - target.clientX;
            const y = (window.innerHeight - 330) / 2 - target.clientY;
            map.panBy(x, y)
            Toast.show({
                icon: 'loading',
                content: '加载中…',
                duration: 0
            })
            const res = await http.get('/houses', {params: {cityId: overlay.id}})
            Toast.clear()
            sethouseLists(res.data.body.list)
            setisShowList(true)
        });
    }

    const createCircle = (item, zoom) => {
        const overlayPoint = new BMapGL.Point(item.coord.longitude, item.coord.latitude)
        const overlay = new BMapGL.Label('', {       // 创建文本标注
            position: overlayPoint,   // 设置标注的地理位置
            offset: new BMapGL.Size(-35, -35)           // 设置标注的偏移量
        })  
        map.addOverlay(overlay); 
        overlay.setContent(`
            <div class='${style.bubble}'>
                <p class='${style.name}'>${item.label}</p>
                <p>${item.count}套</p>
            </div>`)
        overlay.setStyle({                              // 设置label的样式
            color: '#fff',
            border: '0px solid rgb(255, 0, 0)',
            cursor: 'pointer',
            textAlign: 'center',
        })
        overlay.id = item.value
        overlay.addEventListener("click", function(){  
            map.centerAndZoom(overlayPoint, zoom);
            map.clearOverlays()
            overLaysRenderDate(overlay.id)
        });
    }

    init()
    map.addEventListener("movestart", ()=>{
        setisShowList(false)
    })
}


export default function Map(){
    const [isShowList, setisShowList] = useState(false)
    const [houseLists, sethouseLists] = useState([])

    useEffect(()=>{
        baiduMap({setisShowList: setisShowList, sethouseLists: sethouseLists})
    },[])
    
    return (
        <div className={style.map}>
            <NavHeader title={'地图找房'}/>
            <Container id="container" />
            <div 
            className={[
                style.houseList,
                isShowList && houseLists.length ? style.show : ''
            ].join(' ')}
            >
                <div className={style.titleWrap}>
                    <h1 className={style.listTitle}>房屋列表</h1>
                    <Link className={style.titleMore} to={'/home/list'}>更多房源</Link>
                </div>
                <div className={style.houseItems}>
                        {/* 房屋结构 */}
                        {houseLists.map(item => (
                            <HouseItem
                                key={item.houseCode}
                                // 图片地址
                                src={baseUrl + item.houseImg}
                                onClick={() => this.props.history.push(`/detail/${item.houseCode}`)}
                                title={item.title}
                                desc={item.desc}
                                tags={item.tags}
                                price={item.price}
                            />
                        ))}
                </div>
            </div>
        </div>
        
    )
}

const Container = styled.div`
width: 100%;
height: 100%;
`