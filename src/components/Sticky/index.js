import React from 'react'

import styles from './index.module.css'

import PropTypes from 'prop-types'

class Sticky extends React.Component {
  // 创建 ref 对象操作 DOM
  placeHolder = React.createRef()
  content = React.createRef()

  handleScroll = () => {
    const { height } = this.props
    const placeHolderEl = this.placeHolder.current
    const contentEl = this.content.current

    const { top } = placeHolderEl.getBoundingClientRect()
    if(top < 0) {
      contentEl.classList.add(styles.fixed)
      placeHolderEl.style.height = `${height}px`
    } else {
      contentEl.classList.remove(styles.fixed)
      placeHolderEl.style.height = '0'
    } 
  }

  componentDidMount () {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render () {
    return (
      <div>
        {/* 占位元素 */}
        <div ref={this.placeHolder}></div>
          {/* 占位元素 */}
        <div ref={this.content}>{this.props.children}</div>
      </div>
    )
  }
}

Sticky.propTypes = {
  height: PropTypes.number.isRequired
}
export default Sticky