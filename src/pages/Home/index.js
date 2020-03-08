import React, { lazy } from 'react'

import { Route } from 'react-router-dom'

import { TabBar }   from 'antd-mobile'

import './index.css'
// import News from '../News'
import Index from '../Index'
// import Profile from '../Profile'
// import HouseList from '../HouseList'

const News = lazy(() => import('../News'))
const Profile = lazy(() => import('../Profile'))
const HouseList = lazy(() => import('../HouseList'))

const TabItems = [
  {
    title: '首页',
    icon: 'icon-ind',
    path: '/home'
  },
  {
    title: '找房',
    icon: 'icon-findHouse',
    path: '/home/list'
  },
  {
    title: '资讯',
    icon: 'icon-infom',
    path: '/home/news'
  },
  {
    title: '我的',
    icon: 'icon-my',
    path: '/home/profile'
  }
]

export default class Home extends React.Component {
  state = {
    selectedTab: this.props.location.pathname
  }
  renderTabItem () {
    return TabItems.map( item =>  <TabBar.Item
            title={item.title}
            key={item.title}
            icon={<i className={`iconfont ${item.icon}`}></i>}
            selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
            selected={this.state.selectedTab === item.path}
            onPress={() => {
              this.setState({
                selectedTab: item.path,
            })
              this.props.history.push(item.path)
            }}>
          </TabBar.Item>
    )
  }
  componentDidUpdate (prevProps) {
    if(prevProps.location.pathname !== this.props.location.pathname) {
      this.setState(()=> {
        return {
          selectedTab: this.props.location.pathname
        }
      })
    }
  }
  render () {
    return (
      <div className='home'>
        {/* 子路由 */}
        <Route path='/home/news' component={News}></Route>
        <Route exact path='/home' component={Index}></Route>
        <Route path='/home/list' component={HouseList}></Route>
        <Route path='/home/profile' component={Profile}></Route>

        {/* tabBar */}
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#21b97a"
          barTintColor="white"
          noRenderContent={true}
        >
        {this.renderTabItem()}
        </TabBar>
      </div>
    )
  }
}