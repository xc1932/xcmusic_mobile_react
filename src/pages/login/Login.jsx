import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { sendCaptcha, verifyCaptcha, loginWithPhone, loginWithEmail } from '@/api/auth'
import { saveLoginInfoAction } from '@/redux/actions/user'
import { Form, Input, Button, Radio, Space } from 'antd-mobile'
import './Login.less'

function Login(props) {
  // router
  const navigate = useNavigate()

  // redux
  const { saveLoginInfo } = props

  // data
  // 表单实例
  const [form] = Form.useForm()
  // 手机号码字段验证正则
  const phoneRegExp = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
  // 验证码字段验证正则
  const vcodeRegExp = /^\d{4}$/
  // 手机号码验证规则
  const phoneRules = [
    { required: true, message: '手机号不能为空' },
    { pattern: phoneRegExp, message: '无效手机号' },
  ]
  // 验证码验证规则
  const vcodeRules = [
    { required: true, message: '验证码不能为空' },
    { pattern: vcodeRegExp, message: '无效验证码' }
  ]
  // 邮箱验证规则
  const emailRules = [
    { type: 'email', message: '无效邮箱' },
    { required: true, message: '邮箱不能为空' },
  ]
  // 密码验证规则
  const passwordRules = [
    { required: true, message: '密码不能为空' },
  ]

  // state
  const [isLoading, setIsLoading] = useState(false)

  // methods
  const validateSuccessHandler = (values) => {
    if (values.loginMethod === 'phone') {
      // 手机验证码登录
      const loginData = {
        phone: values.phone,
        captcha: values.vcode
      }
      phoneLogin(loginData)
    } else {
      // 邮箱登录
      const loginData = {
        email: values.email,
        password: values.password
      }
      emailLogin(loginData)
    }
  }

  // 手机验证码登录
  const phoneLogin = (loginData) => {
    setIsLoading(true)
    // 验证验证码
    verifyCaptcha(loginData).then(verifyRes => {
      if (verifyRes.code === 200) {
        loginWithPhone(loginData).then(loginRes => {
          if (loginRes.code === 200) {
            //登录信息存储
            saveLoginInfo(loginRes)
            navigate('/user', { replace: true })
          } else {
            setIsLoading(false)
          }
        }, () => {
          setIsLoading(false)
        })
      }
    },
      () => {
        setIsLoading(false)
      })
  }

  // 邮箱密码登录
  const emailLogin = (loginData) => {
    setIsLoading(true)
    loginWithEmail(loginData).then(loginRes => {
      if (loginRes.code === 200) {
        //登录信息存储
        saveLoginInfo(loginRes)
        navigate('/user', { replace: true })
      }
    }, () => {
      setIsLoading(false)
    })
  }

  return props.isLogin ? <Navigate to='/user' /> : (
    <div className='login'>
      <div className="close" onClick={() => navigate(-1)}>
        取消
      </div>
      <div className="avatar"></div>
      <div className="form-area">
        <Form
          form={form}
          layout='horizontal'
          mode='card'
          footer={
            <>
              <Form.Subscribe to={['loginMethod', 'phone', 'email']}>
                {({ loginMethod, phone, email }) => (
                  <div
                    style={{
                      marginBottom: '24px',
                      fontSize: '15px',
                      color: 'var(--adm-color-weak)',
                    }}
                  >
                    你将使用 {loginMethod === 'phone' ? '手机号' : '邮箱'}{' '}
                    {loginMethod === 'phone' ? phone : email} 登录
                  </div>
                )}
              </Form.Subscribe>
              <Button
                block
                type='submit'
                color='primary'
                size='large'
                loadingText='正在登录'
                loading={isLoading}>
                登录
              </Button>
            </>
          }
          initialValues={{
            loginMethod: 'phone',
            phone: '',
          }}
          onFinish={validateSuccessHandler}
        >
          <Form.Item name='loginMethod' label='登录方式'>
            <Radio.Group>
              <Space>
                <Radio value='phone'>手机号</Radio>
                <Radio value='email'>邮箱</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Subscribe to={['loginMethod']}>
            {({ loginMethod }) => {
              return (
                <>
                  {loginMethod === 'phone' && (
                    <>
                      <Form.Item name='phone' label='手机号' rules={phoneRules}>
                        <Input placeholder='请输入手机号' clearable />
                      </Form.Item>
                      <Form.Item
                        name='vcode'
                        label='短信验证码'
                        extra={<SendVcode initialTime={60} form={form} />}
                        rules={vcodeRules}>
                        <Input placeholder='请输入' clearable />
                      </Form.Item>
                    </>
                  )}
                  {loginMethod === 'email' && (
                    <>
                      <Form.Item name='email' label='邮箱' rules={emailRules}>
                        <Input placeholder='请输入邮箱' clearable />
                      </Form.Item>
                      <Form.Item name='password' label='密码' rules={passwordRules}>
                        <Input placeholder='请输入密码' type='password' clearable />
                      </Form.Item>
                    </>
                  )}
                </>
              )
            }}
          </Form.Subscribe>
        </Form>
      </div>
    </div>
  )
}

// 发送短信验证码组件
function SendVcode(props) {
  // state
  const [hasSending, setHasSending] = useState(false)
  const [restTime, setRestTime] = useState(0)

  // methods
  const send = () => {
    // 发送验证码前先验证phone字段
    props.form.validateFields(['phone']).then((values) => {
      // 发送验证码
      sendCaptcha({ phone: values.phone }).then(res => {
        // 倒计时
        countDown()
      })
    })
  }
  // 倒计时
  const countDown = () => {
    const { initialTime } = props
    setHasSending(true)
    setRestTime(initialTime)
    let timer = setInterval(() => {
      setRestTime(restTime => {
        if (restTime <= 0 && timer) {
          setHasSending(false)
          clearInterval(timer)
          timer = null
        }
        return restTime - 1
      })
    }, 1000)
  }

  return (
    <div>
      {
        hasSending ? <a>{restTime}s</a> : <a onClick={send}>发送验证码</a>
      }
    </div>
  )
}


export default connect(
  state => ({
    isLogin: state.user.isLogin
  }),
  {
    saveLoginInfo: saveLoginInfoAction
  }
)(Login)