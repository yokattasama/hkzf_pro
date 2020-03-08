import React from 'react'

import { Flex } from 'antd-mobile'

import { withRouter } from 'react-router-dom'

import './index.scss'

import PropTypes from 'prop-types'

function SearchHeader({history, cityName, className}) {
  return (
    <Flex className={['searchbox', className || ''].join(' ')}>
      <Flex className='search'>
        <div className='location' onClick={() => history.push('/citylist')}>
          <span>{cityName}</span>
          <i className='iconfont icon-arrow'></i>
        </div>
        <div className='search-input' onClick={() => history.push('/search')}>
          <i className='iconfont icon-seach'></i>
          <span>请输入小区或者地址</span>
        </div>
      </Flex>
      <i className='iconfont icon-map' onClick={() => history.push('/map')}></i>
    </Flex>
  )
}

SearchHeader.propTypes = {
  cityName: PropTypes.string.isRequired
}

export default withRouter(SearchHeader)