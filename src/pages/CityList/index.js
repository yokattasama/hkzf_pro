import React from 'react'
import { Toast } from 'antd-mobile'
import NavHeader from '../../components/NavHeader'
// import axios from 'axios'
import { API } from '../../utils/api'
import { getCurrentCity } from '../../utils'
import { AutoSizer, List } from 'react-virtualized'
// import './index.scss'
import styles from './index.module.css'

// 数据处理方法
const dataFormat = (list) => {
  const cityList = {}

  // 遍历数组
  list.forEach( item => {
    // 保存每个item的首字母
    const first = item.short.substr(0,1)
    if(cityList[first]) {
      // 如果有，直接往该分类中push数据
      cityList[first].push(item)

    } else {
      cityList[first] = [item]
    }
  })
  const cityIndex = Object.keys(cityList).sort()
  return {
    cityList,
    cityIndex
  }
}

// 处理城市索引数据
const cityIndexFormat = (letter) => {
  switch (letter) {
    case '#':
      return '当前定位'
    case 'hot':
      return '热门城市'
    default : 
      return letter.toUpperCase()
  }
}
  // List data as an array of strings
  // const list = Array(1000).fill('哈哈哈哈')

//   function rowRenderer({
//     key, // Unique key within array of rows
//     index, // Index of row within collection
//     isScrolling, // The List is currently being scrolled
//     isVisible, // This row is visible within the List (eg it is not an overscanned row)
//     style, // Style object to be applied to row (to position it)
//   }) {
//     return (
//       <div key={key} style={style}>
//         {list[index]}-{index}-{isScrolling+''}-{key}
//       </div>
//     );
//   }

// 索引高度
const TITLE_HEIGHT = 36
// 城市名称高度
const NAME_HEIGHT = 50

// 有数据的城市
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']

export default class CityList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      cityList: {},
      cityIndex: [],
      list: [],
      activeIndex: 0
    }
    this.cityListComponent = React.createRef()
  }
  // 更改城市
  changeCity = ({ label, value }) => {
    if(HOUSE_CITY.indexOf(label) > -1) {
      localStorage.setItem('hkzf_city',JSON.stringify({ label, value }))
      this.props.history.go(-1)
    } else {
      Toast.info('暂无数据', 1, null, false)
    }
  }
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    const { cityList, cityIndex } = this.state
    const letter = cityIndex[index]
    return (
      <div key={key} style={style} className={styles.city}>
        <div className={styles.title}>{cityIndexFormat(letter)}</div>
        {
          cityList[letter].map( (item) => {
            return (
              <div className={styles.name} key={item.value} onClick={() => this.changeCity(item)}>
                {item.label}
              </div>
            )
          })
        }
      </div>
    )
  }
  onRowsRendered = ({ startIndex }) => {
    if(this.state.activeIndex !== startIndex) {
      this.setState({
        activeIndex: startIndex
      })
    }
  }
  // 动态获取每一行的高度
  getRowHeight = ({ index }) => {
    const { cityList, cityIndex } = this.state
    // 每一行高度 = 标题高度 + 城市数量 * 城市名称高度
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
  }
  // 渲染右侧城市索引
  renderCityIndex = () => {
    const { cityIndex, activeIndex } = this.state
    return cityIndex.map((item, index) => 
        <li className={styles.cityIndexItem} key={item} onClick={() => {
          this.cityListComponent.current.scrollToRow(index)
        }}>
          <span className={activeIndex === index ? styles.indexActive : ''}>{item === 'hot' ? '热' : item.toUpperCase()}</span>
        </li>
    )
  }

  async componentDidMount () {
    await this.getCity()
    this.cityListComponent.current.measureAllRows()
  }
  async getCity ()  {
    const { data: res } = await API.get('area/city?level=1')
    const { cityList, cityIndex } = dataFormat(res.body)
    const { data: hotRes } = await API.get('area/hot')
    // 在城市列表数据中加入热门城市
    cityList['hot'] = hotRes.body
    // 在城市列表索引中加入热门城市
    cityIndex.unshift('hot')
    const curCity = await getCurrentCity()
    // 加入当前定位城市
    cityList['#'] = [curCity]
    // 索引加入当前定位城市
    cityIndex.unshift('#')
    this.setState({
      cityList,
      cityIndex
    })
  }
  render () {
    return (
      <div className={styles.cityList}>
        <NavHeader>
          城市选择
        </NavHeader>
        <AutoSizer>
          {({height, width}) => (
            <List
              ref={this.cityListComponent}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              width={width}
              scrollToAlignment='start'
            />
          )}
        </AutoSizer>

        {/* 右侧城市索引 */}
        <ul className={styles.cityIndex}>
          {this.renderCityIndex()}
        </ul>
      </div>
    )
  }
}