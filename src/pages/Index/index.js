import React from 'react'

import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'

// import axios from 'axios'

import { getCurrentCity } from '../../utils'

import { BASE_URL } from '../../utils/url'

import { API } from '../../utils/api'

// 导入顶部搜索组件
import SearchHeader from '../../components/SearchHeader'

// 导入样式
import './index.scss'

// 导入导航图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

// 导航数据
const navs = [
  {
    id: 1,
    title: '整租',
    imgSrc: Nav1,
    path: '/home/list'
  },
  {
    id: 2,
    title: '合租',
    imgSrc: Nav2,
    path: '/home/list'
  },
  {
    id: 3,
    title: '地图找房',
    imgSrc: Nav3,
    path: '/home/map'
  },
  {
    id: 4,
    title: '去出租',
    imgSrc: Nav4,
    path: '/rent/add'
  }
]

// navigator.geolocation.getCurrentPosition(position => {
//   console.log(position)
// })

export default class Index extends React.Component {
  state = {
    // 轮播图数据
    swipers: [],
    isSwiperLoaded: false,
    // 租房小组数据
    groups: [],
    // 资讯数据
    news: [],
    cityName: '全国'
  }
  // 获取轮播图数据
  async getSwipers () {
    const { data: res } = await API.get('/home/swiper')
    this.setState(() => {
      return {
        swipers: res.body,
        isSwiperLoaded: true
      }
    })
  }
  // 获取租房小组数据
  async getGroups () {
    const { data: res} = await API.get('/home/groups', {
      params: {
        area: 'AREA|88cff55c-aaa4-e2e0'
      }
    })
    this.setState(() => {
      return {
        groups: res.body
      }
    })
  }
  // 获取资讯数据
  async getNews () {
    const { data: res } = await API.get('/home/news', {
      params: {
        area: 'AREA|88cff55c-aaa4-e2e0'
      }
    })
    this.setState(() => {
      return {
        news: res.body
      }
    })
  }

  async componentDidMount() {
    this.getSwipers()
    this.getGroups()
    this.getNews()

    // 获取当前城市
    // var curCity = new window.BMap.LocalCity();
    // curCity.get( async res => {
    //   console.log(res)
    //   // map.setCenter(result.name)
    //   const { data: result } = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
    //   // console.log(result)
    //   this.setState({
    //     cityName: result.body.label
    //   })
    // }); 
    const curCity = await getCurrentCity()
    console.log(curCity)
      this.setState({
        cityName: curCity.label
      })
  }
  // 渲染轮播图
  renderSwipers () {
    return this.state.swipers.map(item => (
      <a
        key={item.id}
        href="http://www.baidu.com"
        style={{ display: 'inline-block', width: '100%', height: 212 }}
      >
        <img
          src={ BASE_URL + item.imgSrc}
          alt={item.alt}
          style={{ width: '100%', verticalAlign: 'top' }}
        />
      </a>
    ))
  }
  // 渲染导航组件
  renderNav () {
    return navs.map( item => (
      <Flex.Item key={item.id} onClick={() => this.props.history.push(item.path)}>
        <img src={item.imgSrc} alt=''/>
        <h2>{item.title}</h2>
      </Flex.Item>
    ))
  }

  // 渲染最新资讯
  renderNews() {
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={BASE_URL + item.imgSrc}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }
  render () {
    return (
      <div className='index'>
        <div className='swiper'>
          {
            this.state.isSwiperLoaded
            ? (<Carousel
              autoplay
              infinite
              autoplayInterval={1000}
            >
              {this.renderSwipers()}
            </Carousel>)
            :''
          }
          {/* 顶部搜索 */}
          <SearchHeader cityName={this.state.cityName} />
        </div>
        
        {/* 导航菜单 */}
        <Flex className='nav'>
          {this.renderNav()}
        </Flex>

        {/* 租房小组 */}
        <div className='groups'>
          <h3 className='title'>
            租房小组<span className='more'>更多</span>
          </h3>
          <Grid
            data={this.state.groups}
            columnNum={2}
            square={false}
            hasLine={false}
            renderItem={item =>   <Flex className="group-item" justify="around" key={item.id}>
            <div className="desc">
              <p className="groups-title">{item.title}</p>
              <span className="info">{item.desc}</span>
            </div>
            <img
              src={`http://192.168.123.112:8080${item.imgSrc}`}
              alt=""
            />
          </Flex> }
          ></Grid>

        </div>
        {/* 最新资讯 */}
        <div className='news'>
          <h3 className='group-title'>最新资讯</h3>
          <WingBlank size='md'>
            {this.renderNews()}
          </WingBlank>
        </div>
        
      </div>
    )
  }
}