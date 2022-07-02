import React, { Component, createRef } from 'react'
import { connect } from 'react-redux'
import dayjs from 'dayjs'
import BScroll from 'better-scroll'
import { Ellipsis } from 'antd-mobile'
import { Play, Add, Comment, ShareOne } from '@icon-park/react'
import { DotLoading, Toast } from 'antd-mobile'
import withRouter from '@/utils/withRouter'
import { longNumberConvert } from '@/utils/common'
import { getTrackPlayData } from '@/api/track'
import { getAlbumDetail, getAlbumDynamicDetail } from '@/api/album'
import NavBar from '@/components/navbar/NavBar'
import Loading from '@/components/loading/Loading'
import RectangleTrackItem from '@/components/item/rectangle-track-item/RectangleTrackItem'
import { savePlayerDataAction, selectTrackAction } from '@/redux/actions/player'
import './AlbumDetail.less'

class AlbumDetail extends Component {
    scrollAreaWrapperRef = createRef()
    listBS = null
    state = {
        scrollY: 0,
        albumInfo: null,
        tracklist: [],
        complete: false,
        hasPlayed: false
    }
    // imageArea style
    imageAreaStyle = () => {
        const { scrollY, albumInfo } = this.state
        const upPercent = Math.abs(Math.min(0, Math.max(-260, scrollY))) / 260 //-260 - 0
        const downPercent = Math.abs(Math.max(0, scrollY)) / 260 // >=0
        const paddingTop = `${300 + Math.min(0, Math.max(-260, scrollY))}px` //只处理上滑
        const transform = `scale(${1 + downPercent})`
        const marginBottom = (300 * downPercent) / 2 + 'px'
        const borderBottomLeftRadius = `100px ${(1 - upPercent) * 15}px`
        const borderBottomRightRadius = `100px ${(1 - upPercent) * 15}px`
        const coverUrl = albumInfo == null ? '' : albumInfo.album_cover
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
        const { albumInfo } = this.state
        return {
            display: albumInfo == null ? 'none' : ''
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
    getAlbumData = () => {
        const { params } = this.props
        const id = params.id
        // 获取数据
        const task1 = getAlbumDetail({ id })
        const task2 = getAlbumDynamicDetail({ id })
        Promise.all([task1, task2]).then(allRes => {
            const detailRes = allRes[0].album
            const detailDynamicRes = allRes[1]
            const trackIds = allRes[0].songs.map(t => t.id)
            const albumInfo = {
                album_id: detailRes.id,
                album_name: detailRes.name,
                album_cover: detailRes.picUrl,
                album_description: detailRes.description,
                album_trackCount: detailRes.size,
                album_updateTime: detailRes.publishTime,
                album_creator: {
                    creator_nickname: detailRes.artist.name,
                    creator_avatarUrl: detailRes.artist.picUrl
                },
                album_trackIds: trackIds,
                album_bookedCount: detailDynamicRes.subCount,
                album_commentCount: detailDynamicRes.commentCount,
                album_shareCount: detailDynamicRes.shareCount,
            }
            this.setState({ albumInfo })
            getTrackPlayData(trackIds.join(',')).then(tracklist => {
                this.setState({ tracklist, complete: true })
            })
        })
    }
    // 播放所有推荐歌曲
    playAll = () => {
        const { playList, savePlayerData } = this.props
        const { tracklist, complete, hasPlayed } = this.state
        if ((hasPlayed && playList.length > 0) || tracklist.length == 0) return
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
        const { savePlayerData, selectTrack, playList } = this.props
        const { tracklist, complete, hasPlayed } = this.state
        const willPlayedTrack = tracklist.find(t => t.track_id === trackId)
        // 禁止播放没有播放来源的track
        if (willPlayedTrack.track_url == null) {
            Toast.show({
                content: '不能播放该音乐~ ^v^'
            })
            return
        }
        // 已经播放过,直接播放选中的歌曲
        if (hasPlayed && playList.length > 0) {
            selectTrack(trackId)
        } else {
            // 没有播放过
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
        this.getAlbumData()
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
        const { albumInfo, tracklist } = this.state
        return (
            <div className='albumDetailPage'>
                <div className="navbarArea">
                    <NavBar title='专辑' />
                </div>
                <div className="moveArea" style={moveAreaStyle()}>
                    <div className="detailInfoArea" style={detailInfoAreaStyle()}>
                        <div className="infoTop">
                            <div className="albumCover">
                                <img src={albumInfo?.album_cover} />
                            </div>
                            <div className="albumDesc">
                                <div className="title">
                                    <Ellipsis direction='end' rows={2} content={albumInfo?.album_name} />
                                </div>
                                <div className="publishTime">更新于：{dayjs(albumInfo?.album_updateTime).format('YYYY-MM-DD')}</div>
                                <div className="creator">
                                    <div className="avatar">
                                        <img src={albumInfo?.album_creator.creator_avatarUrl} />
                                    </div>
                                    <div className="nickname">
                                        {albumInfo?.album_creator.creator_nickname}
                                    </div>
                                </div>
                                <div className="desc">{albumInfo?.album_description}</div>
                            </div>
                        </div>
                        <div className="infoBottom">
                            <div className="subCount item">
                                <Add theme="outline" size="20" fill="#333" />
                                {longNumberConvert(albumInfo?.album_bookedCount)}
                            </div>
                            <div className="verticalLine"></div>
                            <div className="commentCount item">
                                <Comment theme="outline" size="20" fill="#333" />
                                {longNumberConvert(albumInfo?.album_commentCount)}
                            </div>
                            <div className="verticalLine"></div>
                            <div className="shareCount item">
                                <ShareOne theme="outline" size="20" fill="#333" />
                                {longNumberConvert(albumInfo?.album_shareCount)}
                            </div>
                        </div>
                    </div>
                    <div className="imageArea" style={imageAreaStyle()}></div>
                    <div className="btnsArea">
                        <div className="playAll" onClick={playAll}>
                            <Play theme="filled" size="24" fill="#31c27c" />
                            <span className='playAllTitle'>播放全部 <span className='trackCount'>({albumInfo?.album_trackCount})</span> </span>
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
                            tracklist.length === 0 && albumInfo !== null ?
                                <div className='loading'>
                                    加载中<DotLoading />
                                </div>
                                : ''
                        }
                    </div>
                </div>
                {albumInfo == null ? <Loading /> : ''}
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
)(withRouter(AlbumDetail))

// albumInfo = {
//   album_id,
//   album_name,
//   album_cover,
//   album_description,
//   album_trackCount,
//   album_updateTime,
//   album_creator: {
//       creator_nickname,
//       creator_avatarUrl
//   },
//   album_trackIds,
//   album_bookedCount,
//   album_commentCount,
//   album_shareCount,
// }