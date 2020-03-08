import React, { Component } from 'react'

import { Spring } from 'react-spring/renderprops'
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'

import { API } from '../../../../utils/api'

// 标题高亮状态
// true 表示高亮； false 表示不高亮
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}

export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    openType: '',
    filterData: {},
    // 默认选中值
    selectedValues
  }
  componentDidMount () {
    this.htmlBody = document.body
    this.getFilterData()
  }
  async getFilterData () {
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const { data: res } = await API.get(`houses/condition?id=${value}`)
    this.setState({
      filterData: res.body
    })
  }
  // 点击标题菜单实现高亮
  // 注意：this指向的问题！！！
  // 说明：要实现完整的功能，需要后续的组件配合完成！
  onTitleClick = type => {
    // 取消页面滚动
    this.htmlBody.className = 'bodyFixed'
    const { titleSelectedStatus, selectedValues } = this.state
    const newTitleSelectedStatus = {...titleSelectedStatus}

    Object.keys(titleSelectedStatus).forEach( item => {
      if(type === item) {
        newTitleSelectedStatus[item] = true
        // console.log('newTitleSelectedStatus',newTitleSelectedStatus)
        return
      }
      const selectVal = selectedValues[item]
      if(item === 'area' && (selectVal.length !== 2 || selectVal[0] !== 'area')) {

        newTitleSelectedStatus[item] = true

      } else if(item === 'mode' && selectVal[0] !== 'null') {

        newTitleSelectedStatus[item] = true

      } else if(item === 'price' && selectVal[0] !== 'null') {

        newTitleSelectedStatus[item] = true

      } else if(item === 'more' && selectVal.length !== 0) {
        // 更多筛选
        newTitleSelectedStatus[item] = true
      } else {
        newTitleSelectedStatus[item] = false
      }
    })
    this.setState({
      titleSelectedStatus: newTitleSelectedStatus,
      openType: type
    })
  }
  // 渲染选择器
  renderFilterPicker () {
    const { openType, filterData: { area, subway, price, rentType }} = this.state
    if(openType !== 'area' && openType !== 'mode' && openType !== 'price') {
      return null
    }
    
    let data = []
    let cols = 3
    let defaultValue = this.state.selectedValues[openType]
    switch (openType) {
      case 'area':
        data = [area, subway]
        break;
      case 'mode':
        data = rentType
        cols = 1
        break;
      case 'price':
        data = price
        cols = 1
        break;
      default:
        break;
    }

    return <FilterPicker 
        key={openType}
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
        type={openType}
        defaultValue={defaultValue}
        />
  }

  // 渲染更多筛选
  renderFilterMore () {
    const { openType,filterData: { roomType, oriented, floor, characteristic} } = this.state
    const data = {
      roomType, oriented, floor, characteristic
    }
    const defaultValue = this.state.selectedValues.more
    if(openType !== 'more') {
      return
    }
    return <FilterMore data={data} onSave={this.onSave} type={openType} defaultValue={defaultValue} onCancel={this.onCancel}/>
  }

  onCancel = (type) => {
    // 继续页面滚动
    this.htmlBody.className = ''
    const { titleSelectedStatus, selectedValues } = this.state
    const newTitleSelectedStatus = {...titleSelectedStatus}
    const selectVal = selectedValues[type]
    if(type === 'area' && (selectVal.length !== 2 || selectVal[0] !== 'area')) {

      newTitleSelectedStatus[type] = true

    } else if(type === 'mode' && selectVal[0] !== 'null') {

      newTitleSelectedStatus[type] = true

    } else if(type === 'price' && selectVal[0] !== 'null') {

      newTitleSelectedStatus[type] = true

    } else if(type === 'more' && selectVal.length !== 0) {
      // 更多筛选
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }
    this.setState({
      openType: '',
      titleSelectedStatus: newTitleSelectedStatus
    })
  }

  onSave = (type,value) => {
    // 继续页面滚动
    this.htmlBody.className = ''
    const { titleSelectedStatus } = this.state
    const newTitleSelectedStatus = {...titleSelectedStatus}
    const selectVal = value
    if(type === 'area' && (selectVal.length !== 2 || selectVal[0] !== 'area')) {

      newTitleSelectedStatus[type] = true

    } else if(type === 'mode' && selectVal[0] !== 'null') {

      newTitleSelectedStatus[type] = true

    } else if(type === 'price' && selectVal[0] !== 'null') {

      newTitleSelectedStatus[type] = true

    } else if(type === 'more' && selectVal.length !== 0) {
      // 更多筛选
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }

    // 组装最新筛选值
    const newSelectedValues = {
      ...this.state.selectedValues,
      [type]: value
    }

    const { area, mode, price, more } = newSelectedValues

    const filters = {}
    // 获取区域数据
    let areaKeys = area[0]
    let areaValue = 'null'

    if(area.length === 3) {
      areaValue = area[2] !== 'null' ? area[2] : area[1]
    }
    filters[areaKeys] = areaValue
    // 获取租金，方式数据
    filters.mode = mode[0]
    filters.price = price[0]

    // 获取更多筛选条件
    const moreArray = []
    more.forEach( item => {
      moreArray.push(item.value)
    })
    filters.more = moreArray.join(',')

    this.props.onFilter(filters)
    this.setState({
      openType: '',
      selectedValues: newSelectedValues,
      titleSelectedStatus: newTitleSelectedStatus
    })
  }

  // 渲染遮罩层
  renderMask () {
    const { openType } = this.state
    const isHide = ( openType === 'more' || openType === '' )
    return (
      <Spring
          from={{opacity: 0}}
          to={{opacity: isHide ? 0 : 1}}>
          {
            (props)=> {
              if(props.opacity === 0) {
                return null
              }
              return (<div style={props} className={styles.mask} onClick={() => this.onCancel(openType)}/>)
            } 
          }
      </Spring>
    )

  }
  render() {
    const { titleSelectedStatus } = this.state

    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {
          this.renderMask()
        }
        
        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            onClick={this.onTitleClick}
          />

          {/* 前三个菜单对应的内容： */}
          {
            this.renderFilterPicker()
          }

          {/* 最后一个菜单对应的内容： */}
          {
            this.renderFilterMore()
          }
        </div>
      </div>
    )
  }
}
