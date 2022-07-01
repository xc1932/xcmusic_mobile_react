import React, { Component, createRef } from 'react'
import BScroll from 'better-scroll'
import Plyr from 'plyr'
import PubSub from 'pubsub-js'
import { Toast } from 'antd-mobile'
import { Play, Comment, ShareOne } from '@icon-park/react'
import withRouter from '@/utils/withRouter'
import { longNumberConvert, playTimeFormat } from '@/utils/common'
import { getMVDetail, getMVUrl, getSimilarMV } from '@/api/mv'
import { getVideoDetail, getVideoUrl, getVideoInfo } from '@/api/video'
import Loading from '@/components/loading/Loading'
import NavBar from '@/components/navbar/NavBar'
import './VideoPlayer.less'

class VideoPlayer extends Component {
    videoRef = createRef()
    videoPlayer = null
    scrollWrapperRef = createRef()
    listBS = null
    state = {
        mvInfo: null,
        similarMVs: []
    }
    // 方法
    // plyr样式
    plyrStyle = () => ({ '--plyr-color-main': '#31c27c' })
    // 获取mv数据
    getMVData = (mvId) => {
        Toast.show({
            icon: 'loading',
            content: '加载中…',
            maskClickable: false,
            duration: 0
        })
        const task1 = getMVDetail({ mvid: mvId })
        const task2 = getMVUrl({ id: mvId })
        Promise.all([task1, task2]).then(allRes => {
            const detail = allRes[0].data
            const mvInfo = {
                mv_id: detail.id,
                mv_name: detail.name,
                mv_desc: detail.desc,
                mv_cover: detail.cover,
                mv_artist: {
                    artist_id: detail.artistId,
                    artist_name: detail.artistName,
                    artist_avatar: detail.artists.length > 0 ? detail.artists[0].img1v1Url : null
                },
                mv_commentCount: detail.commentCount,
                mv_playCount: detail.playCount,
                mv_shareCount: detail.shareCount,
                mv_publishTime: detail.publishTime,
                mv_url: allRes[1].data.url
            }
            this.setState({ mvInfo })
        }).finally(() => {
            Toast.clear()
        })
    }
    // 获取相似mv
    getSimilarMVData = (mvId) => {
        Toast.show({
            icon: 'loading',
            content: '加载中…',
            maskClickable: false,
            duration: 0
        })
        getSimilarMV({ mvid: mvId }).then(similarMVRes => {
            if (similarMVRes.code === 200) {
                const similarMVs = similarMVRes.mvs.map(mv => {
                    return {
                        mv_id: mv.id,
                        mv_name: mv.name,
                        mv_cover: mv.cover,
                        mv_duration: mv.duration,
                        mv_playCount: mv.playCount,
                        mv_artist: {
                            artist_id: mv.artistId,
                            artist_name: mv.artistName
                        }
                    }
                })
                this.setState({ similarMVs }, () => {
                    this.listBS.refresh()
                })
            }
        }).finally(() => {
            Toast.clear()
        })
    }
    // 获取video数据
    getVideoDate = (videoId) => {

    }
    // 初始化
    initData = (id, type) => {
        const { getMVData, getSimilarMVData, getVideoDate } = this
        // type: 0:mv 1:video
        if (type === 0) {
            getMVData(id)
            getSimilarMVData(id)
        } else {
            getVideoDate(id)
        }
    }
    // 生命周期
    UNSAFE_componentWillReceiveProps(newProps) {
        const { params: { id }, location: { state: { type } } } = newProps
        this.initData(id, type)
    }
    componentDidMount() {
        const { videoRef, scrollWrapperRef } = this
        const { params: { id }, location: { state: { type } } } = this.props
        // 初始化数据
        this.initData(id, type)
        // 初始化player
        this.videoPlayer = new Plyr(videoRef.current, {
            controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen']
        })
        this.videoPlayer.on('enterfullscreen', () => {
        })
        this.videoPlayer.on('exitfullscreen', () => {
        })
        // video 页面关闭播放器
        PubSub.publish('Player_Pause')
        // 初始化bs
        this.listBS = new BScroll(scrollWrapperRef.current, {
            click: true
        })
    }
    render() {
        const { videoRef, scrollWrapperRef, plyrStyle } = this
        const { navigate } = this.props
        const { mvInfo, similarMVs } = this.state
        return (
            <div className='videoPlayerPage'>
                <div className="navbarArea">
                    <NavBar></NavBar>
                </div>
                <div className="videoContainer">
                    <video
                        ref={videoRef}
                        className='plyr'
                        src={mvInfo?.mv_url}
                        style={plyrStyle()}
                    ></video>
                </div>
                <div className="info">
                    {
                        mvInfo == null ? <Loading /> :
                            <>
                                <div className="artist">
                                    <div className="avatar">
                                        <img src={mvInfo?.mv_artist.artist_avatar} />
                                    </div>
                                    <div className="name">{mvInfo?.mv_artist.artist_name}</div>
                                </div>
                                <div className="desc">
                                    <div className="title">{mvInfo?.mv_name}</div>
                                    <div className="desc">{mvInfo?.mv_desc}</div>
                                    <div className="dynamicDetail">
                                        <div className="left">
                                            <div className="playCount">
                                                {longNumberConvert(mvInfo?.mv_playCount) + '次观看'}
                                            </div>
                                            <div className="publishTime">{mvInfo?.mv_publishTime}</div>
                                        </div>
                                        <div className="right">
                                            <div className="commentCount">
                                                <Comment theme="outline" size="18" fill="#999" />
                                                {mvInfo?.mv_commentCount}
                                            </div>
                                            <div className="shareCount">
                                                <ShareOne theme="outline" size="18" fill="#999" />
                                                {mvInfo?.mv_shareCount}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                    }
                </div>
                <div className="scrollWrapper" ref={scrollWrapperRef}>
                    <div className="scrollContent">
                        {
                            similarMVs.map(mv => {
                                return (
                                    <div
                                        className="similarMVItem"
                                        key={mv.mv_id}
                                        onClick={() => navigate(`/video/${mv.mv_id}`, { replace: true, state: { type: 0 } })}>
                                        <div className="left">
                                            <img src={mv?.mv_cover} />
                                            <div className="duration">{playTimeFormat(Math.floor(mv?.mv_duration / 1000))}</div>
                                        </div>
                                        <div className="right">
                                            <div className="title">{mv?.mv_name}</div>
                                            <div className="artist">{mv?.mv_artist.artist_name}</div>
                                            <div className="playCount">{longNumberConvert(mv?.mv_playCount)}播放</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div >
        )
    }
}

export default withRouter(VideoPlayer)
