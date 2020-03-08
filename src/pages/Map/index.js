import React from 'react'

import NavHeader from '../../components/NavHeader'

import { Toast } from 'antd-mobile'

import HouseItem from '../../components/HouseItem'

// import './index.scss'
import styles from './index.module.css'

// import axios from 'axios'

import { API } from '../../utils/api'

// 导入baseurl
import { BASE_URL } from '../../utils/url'
// 覆盖物样式
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}

export default class Map extends React.Component {
  state = {
    houseList: [],
    showHouseList: false
  }
  componentDidMount () {
    // 初始化地图实例
    // 注意在 react 中全局对象需要使用 window 来访问，否则就会造成 ESlint 报错
    const point = JSON.parse(localStorage.getItem('hkzf_city'))
    const { label, value } = point
    const map = new window.BMap.Map("container")
    this.map = map
    var myGeo = new window.BMap.Geocoder();      
    // 将地址解析结果显示在地图上，并调整地图视野    
    myGeo.getPoint(label, async point =>{      
        if (point) {      
            map.centerAndZoom(point, 10)
            map.addControl(new window.BMap.NavigationControl())
            map.addControl(new window.BMap.ScaleControl())

            this.renderOverlays(value)
            // // 获取房源数据
            // const { data: res} = await axios.get(`http://localhost:8080/area/map?id=${value}`)
            // console.log(res.body)
            // res.body.forEach( item => {
            //   const { coord: { longitude,latitude }, label: areaName, count } = item
            //   const areaPosition = new window.BMap.Point(longitude, latitude)
            //   // 创建label对象
            //   const opts = {
            //     position: areaPosition,
            //     offset: new window.BMap.Size(-35,-35)
            //   }
            //   const Label = new window.BMap.Label('', opts)
            //   Label.setContent(`
            //     <div class="${styles.bubble}">
            //       <p class="${styles.name}">${areaName}</p>
            //       <p>${count}套</p>
            //     </div>
            //   `)
            //   Label.id = item.value
            //   Label.setStyle(labelStyle)
            //   Label.addEventListener('click', () => {
                
            //     // 放大地图
            //     map.centerAndZoom(areaPosition, 13)
            //     // 清除覆盖物
            //     setTimeout(()=> {
            //       map.clearOverlays()
            //     },0)
            //   })
            //   map.addOverlay(Label)
            // })
        }      
        // 创建label对象
        // const opts = {
        //   position: point,
        //   offset: new window.BMap.Size(-35,-35)
        // }
        // const Label = new window.BMap.Label('', opts)
        // Label.setContent(`
        //   <div class="${styles.bubble}">
        //     <p class="${styles.name}">浦东</p>
        //     <p>99套</p>
        //   </div>
        // `)
        // Label.setStyle(labelStyle)
        // Label.addEventListener('click', () => {
        //   console.log('被点击了')
        // })
        // map.addOverlay(Label)
    }, 
    label)
    this.map.addEventListener('movestart', () => {
      if(this.state.showHouseList) {
        this.setState(() => {
          return {
            showHouseList: false
          }
        })
      }
    })
  }
  async renderOverlays(id) {
   try {
    Toast.loading('载入中', 0, null, false)
    const { data: res } = await API.get(`/area/map?id=${id}`)
    // 获取缩放级别和覆盖物形状
    Toast.hide()
    const { nextZoom, type } = this.getTypeAndZoom()
    res.body.forEach( item => {
      // 创建覆盖物
      this.createOverlays(item, nextZoom, type)
    })
   } catch (e) {
     Toast.hide()
   }
    
  }
  getTypeAndZoom () {
    // 获取当前地图缩放级别
    const zoom = this.map.getZoom()
    let nextZoom, type
    if(zoom >= 10 && zoom < 12) {
      nextZoom = 13
      type = 'circle'
    } else if (zoom >= 12 && zoom < 14) {
      nextZoom = 15
      type = 'circle'
    } else if (zoom >= 14 && zoom < 16) {
      // 小区级别地图
      type = 'rect'
    }
    return {
      nextZoom,
      type
    }
  } 
  createOverlays (data, zoom, type) {
    const {
      coord: { longitude, latitude },
      label: areaName,
      count,
      value
    } = data

    // 创建坐标对象
    const areaPoint = new window.BMap.Point(longitude, latitude)

    if(type === 'circle') {
      // 区或镇
      this.createCircle(areaPoint, areaName, count, value, zoom)
    } else {
      // 小区
      this.createRect(areaPoint, areaName, count, value)
    }
  }
  createCircle (point, name, count, id, zoom) {
    // 创建label对象
    const opts = {
      position: point,
      offset: new window.BMap.Size(-35,-35)
    }
    const Label = new window.BMap.Label('', opts)
    Label.setContent(`
      <div class="${styles.bubble}">
        <p class="${styles.name}">${name}</p>
        <p>${count}套</p>
      </div>
    `)
    Label.id = id
    Label.setStyle(labelStyle)
    Label.addEventListener('click', () => {
      this.renderOverlays(id)
      // 放大地图
      this.map.centerAndZoom(point, zoom)
      // 清除覆盖物
      setTimeout(()=> {
        this.map.clearOverlays()
      },0)
    })
    this.map.addOverlay(Label)
  }
  createRect (point, name, count, id) {
    // 创建label对象
    const opts = {
      position: point,
      offset: new window.BMap.Size(-50,-28)
    }
    const Label = new window.BMap.Label('', opts)
    Label.setContent(`
      <div class="${styles.rect}">
        <span class="${styles.housename}">${name}</span>
        <span class="${styles.housenum}">${count}套</span>
        <i class="${styles.arrow}"></i>
      </div>
    `)
    Label.id = id
    Label.setStyle(labelStyle)
    Label.addEventListener('click', e => {
      // console.log(id)
      // 获取小区房源数据
      this.getHouseList(id)
      const target = e.changedTouches[0]
      this.map.panBy(window.innerWidth / 2 - target.clientX, (window.innerHeight - 330) / 2 - target.clientY)
    })
    this.map.addOverlay(Label)
  }
  async getHouseList (id) {
    try {
      Toast.loading('载入中', 0, null, false)
      const { data: res } = await API.get(`/houses?cityId=${id}`)
      Toast.hide()
      this.setState(() => {
        return {
          houseList: res.body.list,
          showHouseList: true
        }
      })
    } catch (e) {
      Toast.hide()
    }
  }
  renderHouseList () {
    return this.state.houseList.map(item => {
        return (
          <HouseItem
            key={item.houseCode}
            src={BASE_URL+item.houseImg}
            title={item.title}
            desc={item.desc}
            tags={item.tags}
            price={item.price}
            onClick={() => this.props.history.push(`detail/${item.houseCode}`)}
            ></HouseItem>
        )
      })
      
      // this.state.houseList.map( item => 
      //   (<div className={styles.house} key={item.houseCode}>
      //       <div className={styles.imgWrap}>
      //         <img
      //           className={styles.img}
      //           src={BASE_URL + item.houseImg}
      //           alt=""
      //         />
      //       </div>
      //       <div className={styles.content}>
      //         <h3 className={styles.title}>
      //           {item.title}
      //         </h3>
      //           <div className={styles.desc}>{item.desc}</div>
      //         <div>
      //           {
      //             item.tags.map((item, index) => {
      //               const tagClass = 'tag' + (index + 1)
      //               return (
      //                 <span className={[styles.tag, styles[tagClass]].join(' ')} key={item}>{item}</span>
      //               )
      //             })
      //           }
      //         </div>
      //         <div className={styles.price}>
      //           <span className={styles.priceNum}>{item.price}</span> 元/月
      //         </div>
      //       </div>
      //     </div> 
      //   ))
  }
  render () {
    return (
      <div className={styles.map}>
        <NavHeader>
          地图找房
        </NavHeader>
        <div id='container' className={styles.container}></div>
        {/* 房源列表 */}
        {/* 房源列表 */}
        <div className={[styles.houseList, this.state.showHouseList ? styles.show : ''].join(' ')}>
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <a className={styles.titleMore} href="/house/list">
              更多房源
            </a>
          </div>
          <div className={styles.houseItems}>
          {this.renderHouseList()}
          </div>
        </div>
      </div>
    )
  }
}