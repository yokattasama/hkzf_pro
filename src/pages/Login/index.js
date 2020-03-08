import React from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'
import { API } from '../../utils/api'
import NavHeader from '../../components/NavHeader'

import { withFormik, Form, Field, ErrorMessage } from 'formik'
import styles from './index.module.css'

import * as Yup from 'yup'

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

// const Loginfunc = (props)=> 
class Login extends React.Component {
  // state = {
  //   username: '',
  //   password: ''
  // }
  // getUsername = (e) => {
  //   this.setState({
  //     username: e.target.value
  //   })
  // }
  // getPassword = (e) => {
  //   this.setState({
  //     password: e.target.value
  //   })
  // }
  // handleSubmit = async (e) => {
  //   e.preventDefault()
  //   const { username, password } = this.state
  //   const { data: res } = await API.post('user/login', {
  //     username,
  //     password
  //   })
  //   console.log(res)
  //   const { status, description, body} = res
  //   if(status === 200) {
  //     localStorage.setItem('hkzf_token', body.token)
  //     Toast.info(description, 1, null, false)
  //     this.props.history.go(-1)
  //   } else {
  //     Toast.info(description, 2, null, false)
  //   }
  // }
  render() {
    // const { username, password } = this.state
    // const { values, handleSubmit, handleChange, errors, touched, handleBlur } = this.props
    // console.log(values)
    // console.log(handleChange)
    // console.log(handleSubmit)
    // console.log(errors)
    // console.log(touched)

    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <Form>
            <div className={styles.formItem}>
              <Field className={styles.input} name="username" placeholder="请输入账号"></Field>
              {/* <input
                className={styles.input}
                name="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                
              /> */}
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <ErrorMessage className={styles.error} name='username' component='div'></ErrorMessage>
            {/* {
              errors.username && touched.username && (<div className={styles.error}>{errors.username}</div>)
            } */}
            <div className={styles.formItem}>
            <Field className={styles.input} name="password" type="password" placeholder="请输入密码"></Field>
              {/* <input
                className={styles.input}
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                type="password"
                placeholder="请输入密码"
              /> */}
            </div>
            <ErrorMessage className={styles.error} name='password' component='div'></ErrorMessage>
            {/* {
              errors.password && touched.password && (<div className={styles.error}>{errors.password}</div>)
            } */}
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </Form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

Login = withFormik({
  mapPropsToValues: () => ({ username: '', password: '' }),
  validationSchema: Yup.object().shape({
    username: Yup.string().required('用户名为必填项').matches(REG_UNAME, '长度为5到8位，只能出现数字、字母、下划线'),
    password: Yup.string().required('密码为必填项').matches(REG_PWD, '长度为5到12位，只能出现数字、字母、下划线')
  }),
  handleSubmit: async (values, formikBag) => {
    const { props } = formikBag
    const { data: res } = await API.post('user/login', {
      username: values.username,
      password: values.password
    })
    const { status, description, body} = res
    if(status === 200) {
      localStorage.setItem('hkzf_token', body.token)
      Toast.info(description, 1, null, false)
      // 鉴权 参数
      if(!props.location.state) {
        props.history.go(-1)
      } else {
        props.history.replace(props.location.state.from.pathname)
      }
    } else {
      Toast.info(description, 2, null, false)
    }
  },
  handleBlur: () => {
    console.log('111')
  }
})(Login)

export default Login
