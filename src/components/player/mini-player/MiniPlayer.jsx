import React, { Component, createRef } from 'react'
import PubSub from 'pubsub-js'
import { NoticeBar, ProgressCircle } from 'antd-mobile'
import {
    PlayOne,
    Pause,
    MusicList
} from '@icon-park/react'
import withRouter from '@/utils/withRouter'
import './MiniPlayer.less'

class MiniPlayer extends Component {
    // ref
    miniplayerRef = createRef()
    baseRef = createRef()
    coverRef = createRef()

    state = {
        percent: 0
    }

    // lifecycle
    componentDidMount() {
        // 播放器位置控制
        this.miniplayerPositionSwitch()
        // 订阅播放进度
        PubSub.subscribe('Player_CurrentProcess', (_, { currentProcess }) => {
            this.setState({ percent: currentProcess })
        })
    }
    componentDidUpdate() {
        // 播放器位置控制
        this.miniplayerPositionSwitch()
    }

    // methods
    // 播放暂停
    miniplayPlaySwicth = (e) => {
        const { playSwitch } = this.props
        e.stopPropagation()
        playSwitch()
    }

    // 展开/折叠播放列表
    playlistSwitch = (e) => {
        e.stopPropagation()
        PubSub.publish('Player_ShowPlayerList', { showPlayerList: true })
    }

    // 播放器位置控制
    miniplayerPositionSwitch = () => {
        const mianPages = ['/home', '/video', '/user', '/setting']
        const { pathname } = this.props.location
        const { isFullscreen } = this.props
        const miniplayerDOM = this.miniplayerRef.current
        if (isFullscreen || /^\/video\/\d{1,}/.test(pathname) || /^\/login/.test(pathname)) {
            miniplayerDOM.style.bottom = '-40px'
        } else {
            // 主要页面player在tabber之上显示
            if (mianPages.includes(pathname)) {
                miniplayerDOM.style.bottom = '65px'
            } else {
                miniplayerDOM.style.bottom = '15px'
            }
        }
    }


    render() {
        const { currentTrack, playStatus, fullscreenSwicth } = this.props
        const { percent } = this.state
        // title
        const artistsName = currentTrack.track_artists.map(a => a.artist_name).join('、')
        const title = `${currentTrack.track_name} - ${artistsName}`
        // 滚动标题的样式
        const noticebarStyle = {
            '--icon-font-size': '0',
            '--height': '100%',
            '--border-color': 'none',
            '--background-color': 'none',
            '--text-color': '#000'
        }
        // 进度圈的样式
        const processcircleStyle = {
            '--size': '30px',
            '--track-width': '1px',
            '--fill-color': '#000'
        }

        // 唱片旋转动画
        const coverDOM = this.coverRef.current
        const baseDOM = this.baseRef.current
        if (coverDOM !== null && baseDOM !== null && !playStatus) {
            const coverDOMTransform = getComputedStyle(coverDOM).transform
            const baseDOMTransform = getComputedStyle(baseDOM).transform
            baseDOM.style.transform = baseDOMTransform === 'none' ?
                coverDOMTransform : coverDOMTransform.concat(baseDOMTransform)
        }
        return (
            <div className='miniplayer'
                ref={this.miniplayerRef}
                onClick={() => fullscreenSwicth(true)}
            >
                <div className="base" ref={this.baseRef}>
                    <div
                        className="miniplayer-cover"
                        ref={this.coverRef}
                        style={playStatus ? { animation: 'diskrotate 15s linear infinite' } : {}}
                    >
                        <img src={currentTrack.track_album.album_cover} />
                    </div>
                </div>

                <div className="miniplayer-title">
                    <NoticeBar
                        content={title}
                        speed={40}
                        style={noticebarStyle}
                    />
                </div>
                <div className="miniplayer-controls">
                    <ProgressCircle style={processcircleStyle} percent={percent}>
                        {
                            !playStatus ?
                                <PlayOne theme="filled" size="20" fill="#000" onClick={this.miniplayPlaySwicth} /> :
                                <Pause theme="filled" size="20" fill="#000" onClick={this.miniplayPlaySwicth} />
                        }
                    </ProgressCircle>
                    <MusicList theme="filled" size="24" fill="#000" onClick={this.playlistSwitch} />
                </div>
            </div>
        )
    }
}
export default withRouter(MiniPlayer)
