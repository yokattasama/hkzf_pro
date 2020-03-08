import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import { API, getCity } from '../../../utils'

import styles from './index.module.css'

export default class Search extends Component {
  // 当前城市id
  cityId = getCity().value
  timerId = null
  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }
  // 搜索关键字
  handleSearch = async value => {
    this.setState({
      searchTxt: value
    })
    if(!value) {
      return this.setState({
        tipsList: []
      })
    }
    clearTimeout(this.timerId)
    this.timerId = setTimeout( async () => {
      const { data: res } = await API.get(`area/community`, {
        params: {
          name: value,
          id: this.cityId
        }
      })
      this.setState({
        tipsList: res.body
      })
    }, 500);
  }
  // 点击搜索结果
  handleClick = item => {
    console.log(item)
    this.props.history.replace('/rent/add', {
      name: item.communityName,
      id: item.community
    })
  }
  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li key={item.community} className={styles.tip} onClick={() =>this.handleClick(item)}>
        {item.communityName}
      </li>
    ))
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          showCancelButton={true}
          onCancel={() => history.replace('/rent/add')}
          onChange={this.handleSearch}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
