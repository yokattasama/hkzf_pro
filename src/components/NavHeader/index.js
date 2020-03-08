import React from 'react'
import { NavBar } from 'antd-mobile'
import { withRouter } from 'react-router-dom'

// 导入校验工具
import PropTypes from 'prop-types'
// import './index.scss'
import styles from './index.module.css'

function NavHeader({ children, history, onLeftClick, className, rightContent }) {
  const defaultHandler = () => history.go(-1)
  return (
    <NavBar
        className={[styles.navBar, className || ''].join(' ')}
        mode="light"
        icon={<i className='iconfont icon-back' />}
        onLeftClick={ onLeftClick || defaultHandler }
        rightContent={rightContent}
      >
        {/* this.props.history.go(-1) */}
        {children}
      </NavBar>
  )
}
NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
  onLeftClick: PropTypes.func,
  className: PropTypes.string,
  rightContent: PropTypes.array
}

export default withRouter(NavHeader)