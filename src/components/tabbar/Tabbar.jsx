import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import {
    Performance,
    PlayTwo,
    User,
    SettingTwo
} from '@icon-park/react'
import withRouter from '@/utils/withRouter'
import './Tabbar.less'

class Tabbar extends Component {
    state = {
        seletedTab: '' //控制选中的标签
    }

    componentDidMount() {
        const { pathname } = this.props.location
        const pathnameArr = ['/home', '/video', '/user', '/setting']
        if (pathnameArr.includes(pathname)) {
            this.setState({ seletedTab: pathname })
        }
    }

    componentDidUpdate() {
        // 处理在非tabbar页面刷新后返回,丢失样式的问题
        const { pathname } = this.props.location
        const { seletedTab } = this.state
        const pathnameArr = ['/home', '/video', '/user', '/setting']
        if (pathnameArr.includes(pathname) && seletedTab !== pathname) {
            this.setState({ seletedTab: pathname })
        }
    }

    //切换选中的标签
    changeSelectTab = (seletedTab) => {
        this.setState({ seletedTab })
    }
    // 自定义高亮类名
    // computedClassName = ({ isActive }) => {
    //     return isActive ? 'selected' : ''
    // }
    render() {
        const { seletedTab } = this.state
        const tabs = [
            {
                key: '/home',
                title: '主页',
                icon: seletedTab => {
                    return seletedTab !== '/home' ? <Performance theme="outline" size="30" fill="#666" />
                        : <Performance theme="filled" size="30" fill="#31c27c" />
                }
            },
            // {
            //     key: '/video',
            //     title: '视频',
            //     icon: seletedTab => {
            //         return seletedTab !== '/video' ? <PlayTwo theme="outline" size="30" fill="#666" />
            //             : <PlayTwo theme="filled" size="30" fill="#31c27c" />
            //     }
            // },
            {
                key: '/user',
                title: '我的',
                icon: seletedTab => {
                    return seletedTab !== '/user' ? <User theme="outline" size="30" fill="#666" />
                        : <User theme="filled" size="30" fill="#31c27c" />
                }
            },
            // {
            //     key: '/setting',
            //     title: '设置',
            //     icon: seletedTab => {
            //         return seletedTab !== '/setting' ? <SettingTwo theme="outline" size="30" fill="#666" />
            //             : <SettingTwo theme="filled" size="30" fill="#31c27c" />
            //     }
            // },
        ]
        return (
            <div className='tabbar'>
                {
                    tabs.map(item => {
                        return (
                            <NavLink
                                key={item.key}
                                to={item.key}
                                className={seletedTab === item.key ? 'selected' : ''}
                                onClick={() => this.changeSelectTab(item.key)}>
                                <div className="icon">{item.icon(seletedTab)}</div>
                                <div className="title">{item.title}</div>
                            </NavLink>
                        )
                    })
                }
            </div>
        )
    }
}

export default withRouter(Tabbar)