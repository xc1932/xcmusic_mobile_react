import React, { Component, createRef } from 'react'
import BScroll from 'better-scroll'
import { NoticeBar, DotLoading } from 'antd-mobile'
import { Down } from '@icon-park/react'
import FullscreenControls from '../fullscreen-controls/FullscreenControls'
import { findLyricIndex } from '@/utils/lyricProcess'
import tonearmImage from '@/assets/images/arm.png'
import './FullScreenPlayer.less'

export default class FullscreenPlayer extends Component {
    // refs
    cdWrapperRef = createRef()
    diskAreaRef = createRef()
    baseAreaRef = createRef()
    lyricWrapperRef = createRef()
    currentPage = 0         // 0:cdWrapper 1:lyricWrapper 
    touchStartX = 0       // 手指滑动的开始位置
    touchStartY = 0
    directionLocked = ''
    touchMoveDis = 0        //手指滑动的距离
    successPercent = 0.25    // 滑动成功需要的percent

    // methods
    // 主题滚动区域交互
    touchStartHandler = (e) => {
        // 记录滑动的开始位置
        this.touchStartX = e.touches[0].clientX
        this.touchStartY = e.touches[0].clientY
        this.directionLocked = ''
    }

    touchMoveHandler = (e) => {
        const { cdWrapperRef, lyricWrapperRef, currentPage } = this
        const cdWrapperWidth = cdWrapperRef.current.getBoundingClientRect().width
        const cdWrapperDOM = cdWrapperRef.current
        const lyricWrapperDOM = lyricWrapperRef.current
        cdWrapperDOM.style.transition = ''
        lyricWrapperDOM.style.transition = ''
        // 滑动的当前位置
        const currentTouchX = e.touches[0].clientX
        const currentTouchY = e.touches[0].clientY
        const deltaX = currentTouchX - this.touchStartX
        const deltaY = currentTouchY - this.touchStartY
        if (!this.directionLocked) {
            this.directionLocked = Math.abs(deltaY) > Math.abs(deltaX) ? 'v' : 'h'
        }
        if (currentPage === 1 && this.directionLocked === 'v') return
        // 计算滑动的距离(向右滑动>0,向左滑动<0)
        this.touchMoveDis = deltaX
        // 计算滚动的百分比
        const percent = Math.abs(this.touchMoveDis) / cdWrapperWidth
        // cdWrapper页向左滚动lyricWrapper
        if (currentPage === 0 && this.touchMoveDis < 0) {
            lyricWrapperDOM.style.marginLeft = this.touchMoveDis + 'px'
            cdWrapperDOM.style.opacity = 0.8 - percent
        }
        // lyricWrapper页向右滚动lyricWrapper
        if (currentPage === 1 && this.touchMoveDis > 0) {
            lyricWrapperDOM.style.marginLeft = -cdWrapperWidth + this.touchMoveDis + 'px'
            cdWrapperDOM.style.opacity = percent
        }
    }

    touchEndHandler = (e) => {
        const { cdWrapperRef, lyricWrapperRef, currentPage, touchMoveDis, successPercent } = this
        const cdWrapperWidth = cdWrapperRef.current.getBoundingClientRect().width
        const percent = Math.abs(touchMoveDis) / cdWrapperWidth
        const cdWrapperDOM = cdWrapperRef.current
        const lyricWrapperDOM = lyricWrapperRef.current
        cdWrapperDOM.style.transition = 'all 0.3s ease'
        lyricWrapperDOM.style.transition = 'all 0.3s ease'
        // 在cdWrapper页向左滚动结束
        if (currentPage === 0 && touchMoveDis < 0) {
            if (percent >= successPercent) {
                lyricWrapperDOM.style.marginLeft = -cdWrapperWidth + 'px'
                cdWrapperDOM.style.opacity = 0
                this.currentPage = 1
            } else {
                lyricWrapperDOM.style.marginLeft = 0
                cdWrapperDOM.style.opacity = 1
            }
        }
        // 在lyricWrapper页向右滚动结束
        if (currentPage === 1 && touchMoveDis > 0) {
            if (percent >= successPercent) {
                lyricWrapperDOM.style.marginLeft = 0
                cdWrapperDOM.style.opacity = 1
                this.currentPage = 0
            } else {
                lyricWrapperDOM.style.marginLeft = -cdWrapperWidth + 'px'
                cdWrapperDOM.style.opacity = 0
            }
        }
    }

    // lifecycle
    componentDidMount() {
        const lyric = this.props.currentTrack.track_lyric
        // 初始化BS
        this.lyricBS = new BScroll('.lyricWrapper', {
            scrollX: false,
            scrollY: true,
        })
        if (lyric instanceof Array) {
            // 滚动到歌词开始处
            this.lyricBS.scrollToElement('.lyricContent:first-child')
        }
    }
    componentDidUpdate(prevProps, prevState) {
        // 切换歌曲时,重新刷新bs,并滚动到歌词开始处
        const { currentTrack, currentTime } = this.props
        const currentTrackId = currentTrack.track_id
        const prevTrackId = prevProps.currentTrack.track_id
        const lyric = currentTrack.track_lyric
        if (lyric instanceof Array && currentTrackId !== prevTrackId) {
            this.lyricBS.refresh()
            this.lyricBS.scrollToElement('.lyricContent:first-child')
        }
        // 跟随播放滚动歌词
        if (lyric instanceof Array) {
            const prevLine = findLyricIndex(prevProps.currentTime * 1000, lyric)
            const currentLine = findLyricIndex(currentTime * 1000, lyric)
            const startScrollIndex = 4
            if (currentLine >= startScrollIndex && currentLine > prevLine) {
                this.lyricBS.scrollTo(0, -50 * (currentLine - startScrollIndex), 500)
                this.lyricBS.refresh()
            }
        }
    }
    render() {
        const { currentTrack, playStatus, isFullscreen, currentTime, fullscreenSwicth } = this.props
        const totalTime = Math.floor(currentTrack.track_duration / 1000)
        const artistsName = currentTrack.track_artists.map(t => t.artist_name).join('、')
        const lyric = currentTrack.track_lyric
        // 计算正在播放的歌词索引
        const currentLine = findLyricIndex(currentTime * 1000, lyric)
        // 滚动标题的样式
        const noticebarStyle = {
            '--icon-font-size': '0',
            '--height': '100%',
            '--text-color': '#fff',
            '--border-color': 'none',
            '--background-color': 'none',
            '--font-size': '20px'
        }
        // 全屏时的样式
        const playerStyleOfFullscreen = {
            opacity: 1,
            visibility: 'visible'
        }
        const topStyleOfFullscreen = {
            marginTop: 0
        }
        const bottomStyleOfFullscreen = {
            marginBottom: 0
        }
        // 唱片旋转动画
        const diskAreaDOM = this.diskAreaRef.current
        const baseAreaDOM = this.baseAreaRef.current
        if (diskAreaDOM !== null && baseAreaDOM !== null && !playStatus) {
            const diskAreaDOMTransform = getComputedStyle(diskAreaDOM).transform
            const baseAreaDOMTransform = getComputedStyle(baseAreaDOM).transform
            baseAreaDOM.style.transform = baseAreaDOMTransform === 'none' ?
                diskAreaDOMTransform : diskAreaDOMTransform.concat(baseAreaDOMTransform)
        }
        // 唱臂样式
        const tonearmStyle = { transform: 'rotate(-2deg)' }
        return (
            <div className="background-layer" style={isFullscreen ? playerStyleOfFullscreen : {}}>
                <img src={currentTrack.track_album.album_cover} />
                <div className='fullscreenPlayer'>
                    <div className="fullscreenplayer-top" style={isFullscreen ? topStyleOfFullscreen : {}}>
                        <div className="btn">
                            <Down theme="outline" size="40" fill="#fff" onClick={() => fullscreenSwicth(false)} />
                        </div>
                        <div className="track-name">
                            <NoticeBar
                                content={currentTrack.track_name}
                                speed={40}
                                style={noticebarStyle}
                            />
                        </div>
                        <div className="track-artist">{artistsName}</div>
                    </div>
                    <div
                        className="fullscreenplayer-body"
                        onTouchStart={this.touchStartHandler}
                        onTouchMove={this.touchMoveHandler}
                        onTouchEnd={this.touchEndHandler}
                    >
                        <div className="cdWrapper" ref={this.cdWrapperRef}>
                            <div className="baseArea" ref={this.baseAreaRef}>
                                <div
                                    className="diskArea"
                                    ref={this.diskAreaRef}
                                    style={playStatus ? { animation: 'diskrotate 15s linear 0.6s infinite' } : {}}>
                                    <img src={currentTrack.track_album.album_cover} />
                                </div>
                            </div>
                            <div className="armArea" style={playStatus ? tonearmStyle : {}}>
                                <img src={tonearmImage} />
                            </div>
                        </div>
                        <div className="lyricWrapper" ref={this.lyricWrapperRef}>
                            {
                                lyric instanceof Array ?
                                    <div className="lyricContent">
                                        {
                                            lyric.map((lyricLine, index) => {
                                                return (
                                                    <div
                                                        className={"lyricLine " + (currentLine === index ? 'currentLine' : '')}
                                                        key={lyricLine.startTimeStr}>
                                                        {lyricLine.lyricDesc}
                                                    </div>
                                                )
                                            })
                                        }
                                    </div> :
                                    lyric === 'loading' ? <div className="loading">
                                        <DotLoading color='white' />
                                    </div> : <h1>lyric</h1>
                            }
                        </div>
                    </div>
                    <div className="fullscreenplayer-bottom" style={isFullscreen ? bottomStyleOfFullscreen : {}}>
                        <FullscreenControls
                            playStatus={playStatus}
                            totalTime={totalTime}
                            currentTrack={currentTrack}
                        />
                    </div>
                </div>
            </div >
        )
    }
}
