import React, {  useState }  from 'react'
import { NavBar, Space, Swiper, Toast} from 'antd-mobile'
import { MoreOutline } from 'antd-mobile-icons'
import { useNavigate, useLocation, useParams  } from 'react-router-dom'
import {Flex} from '../../components/common'
import { baseUrl, http } from '../../utils/http'
import HousePage from'../HousePage'

import style from './index.module.css'
import { useEffect } from 'react/cjs/react.development'

const BMapGL = window.BMapGL
// 覆盖物样式
const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '14px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
}

// const alert = Modal.alert;

export default function HouseDetail(props){
    
    const history = useNavigate()
    const {id} = useParams()
    const [isLoading, setisLoading] = useState(true)
    const [houseInfo, sethouseInfo] = useState({})
    const [isFavorite, setisFavorite] = useState(false)

    const right = (
        <div style={{ fontSize: 18 }}>
          <Space>
            <MoreOutline />
          </Space>
        </div>
      )
    
    const back = () =>{
    history(-1)
    }

    useEffect(()=>{
        window.scrollTo(0, 0);
        getHouseDetail()
    },[])

    // 获取房屋详情数据
    const getHouseDetail = async () => {

        setisLoading(true)

        const res = await http.get(`/houses/${id}`);

        setisLoading(false)
        sethouseInfo(res.data.body)
        console.log(res)
        // 获取数据，渲染地图
        const { community, coord} =res.data.body;
        renderMap(community, coord);
    }
    
    // 渲染地图 
    const renderMap = (community, coord) => {
        const {longitude, latitude} = coord;
        const map = new BMapGL.Map('map');
        const point = new BMapGL.Point(longitude, latitude);
        map.centerAndZoom(point, 17);
        // 添加缩放控件
        map.addControl(new BMapGL.ZoomControl());

        // 创建覆盖物
        const label = new BMapGL.Label('', {
            position: point,
            offset: new BMapGL.Size(0, 0)
        });

        // 设置房源覆盖物内容
        label.setContent(`
            <div class="${style.rect}">
                <span class="${style.housename}">${community}</span>
                <i class="${style.arrow}"></i>
            </div>
        `)
    
        // 设置样式
        label.setStyle(labelStyle);

        // 添加覆盖物到地图中
        map.addOverlay(label);
    }

    const renderSwipers = () => {
        return houseInfo.houseImg ? houseInfo.houseImg.map( (item) => (
            <Swiper.Item key={item} >
                <img key={item} src={baseUrl + item} alt="房屋图片"/>
            </Swiper.Item>
        )) : null
    }

    const handleFavorite = () => {

    }

    const closed = () => {}

    const {
        community,
        title,
        tags,
        price,
        roomType,
        size,
        floor,
        oriented,
        supporting,
        description
    } = houseInfo
    return <>
        <NavBar right={right} onBack={back} className={style.nav}>
            {community}
        </NavBar>

        {/* 轮播图 */}
        <div className={style.slides}>
        {
            !isLoading ? (
                <Swiper autoplay loop={true}>
                    {renderSwipers()}
                </Swiper>
            ) : null
        }
        </div>

        {/* 房屋基本信息 */}
        <div className={style.info}>
            <h3 className={style.infoTitle}>
                {title}
            </h3>
            <Flex className={style.infoTags}>
                <div>
                    {
                        tags ? tags.map( (item, index) => (
                            <span key={item} className={[style.tag, style.tags, style['tag' + (index % 4 + 1)]].join(' ')}>
                                {item}
                            </span>
                        ) ) : null
                    }
                </div>
            </Flex>

                <Flex className={style.infoPrice} >
                    <div className={style.infoPriceItem}>
                        <div>
                            {price}
                            <span className={style.month}>/月</span>
                        </div>
                        <div>租金</div>
                    </div>
                    <div className={style.infoPriceItem}>
                        <div>{roomType}</div>
                        <div>房型</div>
                    </div>
                    <div className={style.infoPriceItem}>
                        <div>{size}平方</div>
                        <div>面积</div>
                    </div>
                </Flex>

                <Flex className={style.infoBasic} align="start">
                    <div>
                        <div>
                            <span className={style.title}>装修：</span>
                            精装
                        </div>
                        <div>
                            <span className={style.title}>楼层：</span>
                            {floor}
                        </div>
                    </div>
                    <div>
                        <div>
                            <span className={style.title}>朝向：</span>
                            {oriented ? oriented.join('、') : null}
                        </div>
                        <div>
                            <span className={style.title}>类型：</span>
                            普通住宅
                        </div>
                    </div>
                </Flex>
        </div>

        {/* 地图位置 */}
        <div className={style.map}>
            <div className={style.houseTitle}>
                小区：
                <span>{title}</span>
            </div>
            <div className={style.mapContainer} id="map">
                地图
            </div>
        </div>

        {/* 房屋配套 */}
        <div className={style.about}>
            <div className={style.houseTitle}>房屋配套</div>
            {
                supporting && supporting.length === 0
                ? <div className={style.titleEmpty}>暂无数据</div>
                : <HousePage list={supporting} />
            }
        </div>

        {/* 房屋概况 */}
        <div className={style.set}>
            <div className={style.houseTitle}>房屋概况</div>
            <div>
                <div className={style.contact}>
                    <div className={style.user}>
                        <img src={baseUrl+ '/img/avatar.png'} alt="头像" />
                        <div className={style.userInfo}>
                            <div>张女士</div>
                            <div className={style.userAuth}>
                                <i className="iconfont icon-auth" />
                                已认证房主
                            </div>
                        </div>
                    </div>
                    <span className={style.userMsg}>发消息</span>
                </div>
                <div className={description ? style.descText : style.titleEmpty }>
                    {description || '暂无房屋数据'}
                </div>
            </div>
        </div>
        {/* 底部按钮 */}
        <div className={style.buttons}>
            <span className={style.favorite} onClick={handleFavorite} >
                <img 
                    src={
                        baseUrl + ( isFavorite ? '/img/star.png' : '/img/unstar.png')
                    }
                    alt="收藏" 
                />
                {isFavorite ? '已收藏' : '收藏'}  
            </span>
            <span className={style.consult} onClick={closed}>在线咨询</span>
            <span className={style.reserve}>
                <a href="tel: 183614999905">电话预定</a>
            </span>
        </div>
    </>
}