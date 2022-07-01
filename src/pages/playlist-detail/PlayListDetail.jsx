import React, { Component, createRef } from 'react'
import { connect } from 'react-redux'
import dayjs from 'dayjs'
import BScroll from 'better-scroll'
import { Ellipsis, Toast } from 'antd-mobile'
import { Play, Add, Comment, ShareOne } from '@icon-park/react'
import { DotLoading } from 'antd-mobile'
import withRouter from '@/utils/withRouter'
import { longNumberConvert } from '@/utils/common'
import { getTrackPlayData } from '@/api/track'
import { getPlaylistDetail, getPlaylistDetailDynamic } from '@/api/playlist'
import NavBar from '@/components/navbar/NavBar'
import Loading from '@/components/loading/Loading'
import RectangleTrackItem from '@/components/item/rectangle-track-item/RectangleTrackItem'
import { savePlayerDataAction, selectTrackAction } from '@/redux/actions/player'
import './PlayListDetail.less'

class PlayListDetail extends Component {
    scrollAreaWrapperRef = createRef()
    listBS = null
    state = {
        scrollY: 0,
        playlistInfo: null,
        tracklist: [],
        complete: false,
        hasPlayed: false
    }
    // imageArea style
    imageAreaStyle = () => {
        const { scrollY, playlistInfo } = this.state
        const upPercent = Math.abs(Math.min(0, Math.max(-260, scrollY))) / 260 //-260 - 0
        const downPercent = Math.abs(Math.max(0, scrollY)) / 260 // >=0
        const paddingTop = `${300 + Math.min(0, Math.max(-260, scrollY))}px` //只处理上滑
        const transform = `scale(${1 + downPercent})`
        const marginBottom = (300 * downPercent) / 2 + 'px'
        const borderBottomLeftRadius = `100px ${(1 - upPercent) * 15}px`
        const borderBottomRightRadius = `100px ${(1 - upPercent) * 15}px`
        const coverUrl = playlistInfo == null ? '' : playlistInfo.playlist_cover
        return {
            backgroundImage: `url(${coverUrl})`,
            paddingTop,
            transform,
            marginBottom,
            borderBottomLeftRadius,
            borderBottomRightRadius,
        }
    }
    // scrollAreaContent style
    scrollAreaContentStyle = () => {
        const { playList } = this.props
        return {
            paddingBottom: playList.length > 0 ? '60px' : 0
        }
    }
    // moveArea style
    moveAreaStyle = () => {
        const { playlistInfo } = this.state
        return {
            display: playlistInfo == null ? 'none' : ''
        }
    }
    // detailInfoArea style
    detailInfoAreaStyle = () => {
        const { scrollY } = this.state
        const upPercent = Math.abs(Math.min(0, Math.max(-260, scrollY))) / 260 //-260 - 0
        const borderBottomLeftRadius = `100px ${(1 - upPercent) * 15}px`
        const borderBottomRightRadius = `100px ${(1 - upPercent) * 15}px`
        return {
            opacity: 1 * (1 - upPercent),
            borderBottomLeftRadius,
            borderBottomRightRadius,
        }
    }
    // 方法
    // 获取播放列表数据
    getPlaylistData = () => {
        Toast.show({
            content: '加载中',
            icon: 'loading',
            maskClickable: false
        })
        const { params } = this.props
        const id = params.id
        // 获取数据
        const task1 = getPlaylistDetail({ id })
        const task2 = getPlaylistDetailDynamic({ id })
        Promise.all([task1, task2]).then(allRes => {
            const detailRes = allRes[0].playlist
            const detailDynamicRes = allRes[1]
            const trackIds = detailRes.trackIds.map(t => t.id)
            const playlistInfo = {
                playlist_id: detailRes.id,
                playlist_name: detailRes.name,
                playlist_cover: detailRes.coverImgUrl,
                playlist_description: detailRes.description,
                playlist_trackCount: detailRes.trackCount,
                playlist_updateTime: detailRes.updateTime,
                playlist_creator: {
                    creator_nickname: detailRes.creator.nickname,
                    creator_avatarUrl: detailRes.creator.avatarUrl
                },
                playlist_trackIds: trackIds,
                playlist_bookedCount: detailDynamicRes.bookedCount,
                playlist_commentCount: detailDynamicRes.commentCount,
                playlist_playCount: detailDynamicRes.playCount,
                playlist_shareCount: detailDynamicRes.shareCount,
            }
            this.setState({ playlistInfo })
            getTrackPlayData(trackIds.join(',')).then(tracklist => {
                this.setState({ tracklist, complete: true })
            })
        }).finally(() => {
            Toast.clear()
        })
    }
    // 播放所有推荐歌曲
    playAll = () => {
        const { savePlayerData } = this.props
        const { tracklist, complete, hasPlayed } = this.state
        if (hasPlayed || tracklist.length == 0) return
        if (complete) {
            // 直接播放
            savePlayerData(tracklist)
            this.setState({ hasPlayed: true })
        } else if (tracklist.length > 0) {
            // 先获取后播放
            const trackIds = tracklist.map(track => track.track_id).join(',')
            getTrackPlayData(trackIds).then(tracksDetail => {
                savePlayerData(tracksDetail)
                this.setState({ tracklist: tracksDetail, complete: true, hasPlayed: true })
            })
        }
    }
    // 播放选中歌曲
    playTrack = (trackId) => {
        const { savePlayerData, selectTrack } = this.props
        const { tracklist, complete, hasPlayed } = this.state
        if (hasPlayed) {
            selectTrack(trackId)
        } else {
            if (complete) {
                // 已经加载好要播放的歌曲,直接播放
                savePlayerData(tracklist, trackId)
                this.setState({ hasPlayed: true })
            } else if (tracklist.length > 0) {
                // 先获取后播放
                const trackIds = tracklist.map(track => track.track_id).join(',')
                getTrackPlayData(trackIds).then(tracksDetail => {
                    savePlayerData(tracksDetail, trackId)
                    this.setState({ tracklist: tracksDetail, complete: true, hasPlayed: true })
                })
            }
        }
    }
    // 生命周期
    componentDidMount() {
        // 获取播放列表数据
        this.getPlaylistData()
        // bs初始化
        const scrollAreaWrapperDOM = this.scrollAreaWrapperRef.current
        this.listBS = new BScroll(scrollAreaWrapperDOM, {
            probeType: 3,
            click: true
        })
        this.listBS.on('scroll', (pos) => {
            this.setState({ scrollY: pos.y })
        })
    }
    componentDidUpdate(prevProps, prevState) {
        // 检测成功获取数据时,刷新bs
        const currentTracklist = this.state.tracklist
        const prevTracklist = prevState.tracklist
        const currentPlayList = this.props.playList
        const prevPlayList = prevProps.playList
        if (currentTracklist !== prevTracklist && currentTracklist.length > 0) {
            this.listBS.refresh()
        }
        // miniplayer出现后刷新bs
        if (currentPlayList !== prevPlayList) {
            this.listBS.refresh()
        }
    }
    render() {
        const { imageAreaStyle, scrollAreaContentStyle, moveAreaStyle, detailInfoAreaStyle, playAll } = this
        const { playlistInfo, tracklist } = this.state
        return (
            <div className='playlistDetailPage'>
                <div className="navbarArea">
                    <NavBar title='歌单' />
                </div>
                <div className="moveArea" style={moveAreaStyle()}>
                    <div className="detailInfoArea" style={detailInfoAreaStyle()}>
                        <div className="infoTop">
                            <div className="playlistCover">
                                <img src={playlistInfo?.playlist_cover} />
                            </div>
                            <div className="playlistDesc">
                                <div className="title">
                                    <Ellipsis direction='end' rows={2} content={playlistInfo?.playlist_name} />
                                </div>
                                <div className="updateTime">更新于：{dayjs(playlistInfo?.playlist_updateTime).format('YYYY-MM-DD')}</div>
                                <div className="creator">
                                    <div className="avatar">
                                        <img src={playlistInfo?.playlist_creator.creator_avatarUrl} />
                                    </div>
                                    <div className="nickname">
                                        {playlistInfo?.playlist_creator.creator_nickname}
                                    </div>
                                </div>
                                <div className="desc">{playlistInfo?.playlist_description}</div>
                            </div>
                        </div>
                        <div className="infoBottom">
                            <div className="playCount item">
                                <Play theme="outline" size="20" fill="#333" />
                                {longNumberConvert(playlistInfo?.playlist_playCount)}
                            </div>
                            <div className="verticalLine"></div>
                            <div className="bookedCount item">
                                <Add theme="outline" size="20" fill="#333" />
                                {longNumberConvert(playlistInfo?.playlist_bookedCount)}
                            </div>
                            <div className="verticalLine"></div>
                            <div className="commentCount item">
                                <Comment theme="outline" size="20" fill="#333" />
                                {longNumberConvert(playlistInfo?.playlist_commentCount)}
                            </div>
                            <div className="verticalLine"></div>
                            <div className="shareCount item">
                                <ShareOne theme="outline" size="20" fill="#333" />
                                {longNumberConvert(playlistInfo?.playlist_shareCount)}
                            </div>
                        </div>
                    </div>
                    <div className="imageArea" style={imageAreaStyle()}></div>
                    <div className="btnsArea">
                        <div className="playAll" onClick={playAll}>
                            <Play theme="filled" size="24" fill="#31c27c" />
                            <span className='playAllTitle'>播放全部 <span className='trackCount'>({playlistInfo?.playlist_trackCount})</span> </span>
                        </div>
                    </div>
                </div>
                <div className="scrollAreaWrapper" ref={this.scrollAreaWrapperRef}>
                    <div className="scrollAreaContent" style={scrollAreaContentStyle()}>
                        {
                            tracklist.map(t => {
                                return <RectangleTrackItem track={t} key={t.track_id} playTrack={this.playTrack} />
                            })
                        }
                        {
                            tracklist.length === 0 && playlistInfo !== null ?
                                <div className='loading'>
                                    加载中<DotLoading />
                                </div>
                                : ''
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        playList: state.player.playList
    }),
    {
        savePlayerData: savePlayerDataAction,
        selectTrack: selectTrackAction,
    }
)(withRouter(PlayListDetail))

// playlist:{
//     playlist_id,
//     playlist_name,
//     playlist_cover,
//     playlist_description,
//     playlist_trackCount,
//     playlist_updateTime,
//     playlist_creator: {
//         creator_nickname,
//         creator_avatarUrl
//     },
//     playlist_trackIds,
//     playlist_bookedCount,
//     playlist_commentCount,
//     playlist_playCount,
//     playlist_shareCount,
// }