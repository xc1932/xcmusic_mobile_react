import React, { Suspense, useEffect, useRef } from 'react'
import { useRoutes, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import routes from './routes'
import Tabbar from './components/tabbar/Tabbar'
import Loading from './components/loading/Loading'
import Player from './components/player/Player'
import './App.less'

function App(props) {
    // router
    const location = useLocation()
    // 根据路由表生成对应路由规则
    const myRoutes = useRoutes(routes)
    // 监听路由变化
    useEffect(() => {
        const mianPages = ['/home', '/video', '/user', '/setting']
        const { pathname } = location
        const tabbarDOM = tabbarRef.current
        // 主要页面显示tabbar,并且player在tabber之上显示
        if (mianPages.includes(pathname)) {
            tabbarDOM.style.marginBottom = '5px'
        } else {
            tabbarDOM.style.marginBottom = '-55px'
        }
    }, [location])

    // refs
    const tabbarRef = useRef(null)
    return (
        <div className='app' style={{
            backgroundColor: location.pathname === '/user' ? '#eee' : ''
        }}>
            < div className="body" >
                <Suspense fallback={<Loading />}>
                    {myRoutes}
                </Suspense>
            </div>
            <div className="tabbarArea" ref={tabbarRef}>
                <Tabbar></Tabbar>
            </div>
            {
                props.playList.length > 0 ? <Player /> : ''
            }
        </ div >
    )
}

export default connect(
    state => ({
        playList: state.player.playList
    }),
    {}
)(App)



