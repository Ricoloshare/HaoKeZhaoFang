import React, { useState }  from 'react'


import style from './index.module.css'
const HOUSE_PACKAGE = [
    {
        id: 1,
        name: '衣柜',
        icon: 'icon-wardrobe'
    },
    {
        id: 2,
        name: '洗衣机',
        icon: 'icon-wash'
    },    
    {
        id: 3,
        name: '空调',
        icon: 'icon-air'
    },    
    {
        id: 4,
        name: '天然气',
        icon: 'icon-gas'
    },    
    {
        id: 5,
        name: '冰箱',
        icon: 'icon-ref'
    },
    {
        id: 6,
        name: '暖气',
        icon: 'icon-Heat'
    },
    {
        id: 7,
        name: '电视',
        icon: 'icon-vid'
    },
    {
        id: 8,
        name: '热水器',
        icon: 'icon-heater'
    },
    {
        id: 9,
        name: '宽带',
        icon: 'icon-broadband'
    },
    {
        id: 10,
        name: '沙发',
        icon: 'icon-sofa'
    }
];

export default function HousePage(props){
    const [selectedNames, setselectedNames] = useState([])
    // 根据id判断选中状态
    const toggleSelect = name => {
        let newSelectedNames = [];

        if (selectedNames.includes(name)) {
            let index = selectedNames.indexOf(name);
            selectedNames.splice(index, 1);
            newSelectedNames = selectedNames;
        } else {
            newSelectedNames = [...selectedNames, name];
        }

        // 将数据传递给父组件
        props.onSelect(newSelectedNames);
        setselectedNames([...newSelectedNames])
    }

    const renderItems =  () => {
        const {list, select} = props;
        if (list) {
            const values = HOUSE_PACKAGE.filter(item => list.includes(item.name));
            return values.map( item => {
                return (
                    <div key={item.id} className={style.item}>
                        <i className={['iconfont', style.icon, item.icon].join(' ')} />
                        {item.name}
                    </div>
                )
            })
        } else if (select) {

            return HOUSE_PACKAGE.map( item => {
                const isActive = selectedNames.includes(item.name);
                return (
                    <div key={item.id} className={[style.item, isActive ? style.active : ''].join(' ')}
                        onClick={() => toggleSelect(item.name)}
                    >
                        <i className={['iconfont', style.icon, item.icon].join(' ')} />
                        {item.name}
                    </div>
                )
            })
        } else {
            return '啥也没传递'
        }
    }
    return <div className={style.root}>{renderItems()}</div>
}





    

