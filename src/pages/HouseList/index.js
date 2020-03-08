import React from 'react'

import SearchHeader from '../../components/SearchHeader'
import { List, WindowScroller, AutoSizer, InfiniteLoader } from 'react-virtualized'
import HouseItem from '../../components/HouseItem'
import Sticky from '../../components/Sticky'
import NoHouse from '../../components/NoHouse'

import { Flex, Toast } from 'antd-mobile'

import Filter from './components/Filter'

import styles from './index.module.css'

import { API } from '../../utils/api'

import { BASE_URL } from '../../utils/url'

import { getCurrentCity } from '../../utils/index'
// 获取当前城市信息
// 若写在外面只会在项目创建的时候运行一次
// const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))

export default class HouseList extends React.Component {

  // 初始化筛选数据
  filters = {}
  state = {
    list: [],
    count: 0,
    // 房屋数据载入状态
    isLoading: true
  }
  label = ''
  value = ''
  async componentDidMount () {
    const { label, value } = await getCurrentCity()
    this.label = label
    this.value = value
    this.searHouses()
  }

  async searHouses () {
    Toast.loading('载入中', 0, null, false)
    const { data: res } = await API.get('houses',{
      params: {
        cityId: this.value,
        ...this.filters,
        start: 1,
        end: 20
      }
    })
    Toast.hide()
    const { list, count } = res.body
    if(count !== 0) {
      Toast.info(`共找到${count}套房源`, 1, null, false)
    }
    this.setState({
      list,
      count,
      isLoading: false
    })
  }
  onFilter = (filters) => {
    // 更新筛选数据后更新页面位置
    window.scroll(0,0)
    this.filters = filters
    this.searHouses()
  }
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection 
    style, // Style object to be applied to row (to position it)
  }) => {
    // 根据索引号来获取当前这一行的房屋数据
    const { list } = this.state
    const house = list[index]
    if(!house) {
      return (
        <div key={key} style={style}>
          <p className={styles.loading} />
        </div>
      )
    }
    return (
      <HouseItem onClick={() => this.props.history.push(`/detail/${house.houseCode}`)} key={key} style={style} title={house.title} desc={house.desc} src={BASE_URL + house.houseImg} tags={house.tags} price={house.price}></HouseItem>
    )
  }
  isRowLoaded = ({ index }) => {
    
    return !!this.state.list[index]
  }
  loadMoreRows = ({startIndex, stopIndex }) => {
    return new Promise( resolve => {
      API.get('houses',{
      params: {
        cityId: this.value,
        ...this.filters,
        start: startIndex,
        end: stopIndex
      }
    }).then(res => {
        this.setState({
          list: [...this.state.list, ...res.data.body.list]
        })
        resolve()
      })
    })
  }
  renderHouseList () {
    const { count, isLoading } = this.state
    if(count === 0 && !isLoading) {
      return (
        <NoHouse>没有找到符合条件的房源，请更改筛选条件</NoHouse>
      )
    }
    return (
      <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
            rowCount={this.state.count}>
            {
              ({ onRowsRendered, registerChild }) => (
                 <WindowScroller>
                  {
                    ({ height, isScrolling, scrollTop }) => (
                      <AutoSizer>
                        {
                          ({ width }) => (
                            <List
                            onRowsRendered={onRowsRendered}
                            ref={registerChild}
                            autoHeight
                            isScrolling={isScrolling}
                            width={width}
                            height={height}
                            rowCount={this.state.count}
                            rowHeight={120}
                            rowRenderer={this.rowRenderer}
                            scrollTop={scrollTop}
                            />
                          )
                        }
                      </AutoSizer>
                    )
                  }
                </WindowScroller>
              )
            }
          </InfiniteLoader>
         
    )
  }
  render () {
    return (
      <div>
        <Flex className={styles.header}>
        <i className="iconfont icon-back" onClick={() => this.props.history.go(-1)}/>
        <SearchHeader cityName={this.label} className={styles.searchHeader}/>
        </Flex>
        {/* 筛选栏 */}
        <Sticky height={40}>
          <Filter onFilter={this.onFilter}/>
        </Sticky>
        {/* 房屋列表 */}
        <div className={styles.houseList}>
          {this.renderHouseList()}         
        </div>
      </div>
    )
  }
}