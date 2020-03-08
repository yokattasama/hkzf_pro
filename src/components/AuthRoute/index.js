import React from 'react'

import { Route, Redirect } from 'react-router-dom'

import { isAuth } from '../../utils'
const AuthRoute = ({ component: Component, ...rest}) => {
  return  <Route
      {...rest}
      render={ props => {
        const isLogin = isAuth()
        if(isLogin) {
          // 已登录
          return <Component {...props} />
        } else {
          // 未登录
          return <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }} />
        }
      }
      }
    />
}

export default AuthRoute