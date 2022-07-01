import React, { Component, createRef } from 'react'
import { connect } from 'react-redux'
import BScroll from 'better-scroll'
import { Play } from '@icon-park/react'
import withRouter from '@/utils/withRouter'
import { savePlayerDataAction, selectTrackAction } from '@/redux/actions/player'
import { getDailyRecommendTracks } from '@/api/recommend'
import { getTrackPlayData } from '@/api/track'
import NavBar from '@/components/navbar/NavBar'
import Loading from '@/components/loading/Loading'
import RectangleTrackItem from '@/components/item/rectangle-track-item/RectangleTrackItem'
import './DailyRecommend.less'
import BG from '@/assets/images/dailyrecommend.jpg'

class DailyRecommend extends Component {
    scrollAreaWrapperRef = createRef()
    listBS = null
    state = {
        scrollY: 0,
        dailyTracks: [],
        complete: false,
        hasPlayed: false
    }
    // imageArea style
    imageAreaStyle = () => {
        const { scrollY } = this.state
        const upPercent = Math.abs(Math.min(0, Math.max(-260, scrollY))) / 260 //-260 - 0
        const downPercent = Math.abs(Math.max(0, scrollY)) / 260 // >=0
        const paddingTop = `${300 + Math.min(0, Math.max(-260, scrollY))}px` //只处理上滑
        const transform = `scale(${1 + downPercent})`
        const marginBottom = (300 * downPercent) / 2 + 'px'
        const borderBottomLeftRadius = `100px ${(1 - upPercent) * 15}px`
        const borderBottomRightRadius = `100px ${(1 - upPercent) * 15}px`
        return {
            backgroundImage: `url(${BG})`,
            paddingTop,
            transform,
            marginBottom,
            borderBottomLeftRadius,
            borderBottomRightRadius,
            // filter
        }
    }
    // scrollAreaContent style
    scrollAreaContentStyle = () => {
        const { playList } = this.props
        return {
            paddingBottom: playList.length > 0 ? '60px' : 0
        }
    }
    // methods
    // 获取推荐歌曲
    getRecommendSongs = () => {
        const { getCompleteData } = this
        // test
        getDailyRecommendTracks().then(dailyRecomTracks => {
            if (dailyRecomTracks.code === 200) {
                const dailyTracks = dailyRecomTracks.data.dailySongs.map(t => {
                    return {
                        track_id: t.id,
                        track_name: t.name,
                        track_alias: t.alia,
                        track_duration: t.dt,
                        track_popularity: t.pop,
                        track_publishTime: t.publishTime,
                        track_album: {
                            album_id: t.al.id,
                            album_name: t.al.name,
                            album_cover: t.al.picUrl
                        },
                        track_artists: t.ar.map(ar => ({
                            artist_id: ar.id,
                            artist_name: ar.name
                        })),
                        track_mv: t.mv
                    }
                })
                this.setState({ dailyTracks })
                // 获取完整的播放数据
                const trackIds = dailyTracks.map(track => track.track_id).join(',')
                getTrackPlayData(trackIds).then(dailyTracksDetail => {
                    this.setState({ dailyTracks: dailyTracksDetail, complete: true })
                })
            }
        })
    }
    // 播放所有推荐歌曲
    playAll = () => {
        const { savePlayerData } = this.props
        const { dailyTracks, complete, hasPlayed } = this.state
        if (hasPlayed || dailyTracks.length == 0) return
        if (complete) {
            // 直接播放
            savePlayerData(dailyTracks)
            this.setState({ hasPlayed: true })
        } else if (dailyTracks.length > 0) {
            // 先获取后播放
            const trackIds = dailyTracks.map(track => track.track_id).join(',')
            getTrackPlayData(trackIds).then(dailyTracksDetail => {
                savePlayerData(dailyTracksDetail)
                this.setState({ dailyTracks: dailyTracksDetail, complete: true, hasPlayed: true })
            })
        }
    }
    // 播放选中歌曲
    playTrack = (trackId) => {
        const { savePlayerData, selectTrack } = this.props
        const { dailyTracks, complete, hasPlayed } = this.state
        if (hasPlayed) {
            selectTrack(trackId)
        } else {
            if (complete) {
                // 已经加载好要播放的歌曲,直接播放
                savePlayerData(dailyTracks, trackId)
                this.setState({ hasPlayed: true })
            } else if (dailyTracks.length > 0) {
                // 先获取后播放
                const trackIds = dailyTracks.map(track => track.track_id).join(',')
                getTrackPlayData(trackIds).then(dailyTracksDetail => {
                    savePlayerData(dailyTracksDetail, trackId)
                    this.setState({ dailyTracks: dailyTracksDetail, complete: true, hasPlayed: true })
                })
            }
        }
    }
    componentDidMount() {
        // 获取数据
        this.getRecommendSongs()
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
        const currentDailyTracks = this.state.dailyTracks
        const prevDailyTracks = prevState.dailyTracks
        const currentPlayList = this.props.playList
        const prevPlayList = prevProps.playList
        if (currentDailyTracks !== prevDailyTracks && currentDailyTracks.length > 0) {
            this.listBS.refresh()
        }
        // miniplayer出现后刷新bs
        if (currentPlayList !== prevPlayList) {
            this.listBS.refresh()
        }
    }
    render() {
        const { imageAreaStyle, scrollAreaContentStyle, playAll } = this
        const { dailyTracks } = this.state
        return (
            <div className='dailyRecommend'>
                {dailyTracks.length === 0 ? <Loading /> : ''}
                <div className="navbarArea">
                    <NavBar title={'每日推荐'} />
                </div>
                <div className="moveArea">
                    <div
                        className="imageArea"
                        style={imageAreaStyle()}
                    ></div>
                    <div className="btnsArea">
                        <div className="playAll" onClick={playAll}>
                            <Play theme="filled" size="24" fill="#31c27c" />
                            <span>播放全部</span>
                        </div>
                    </div>
                </div>
                <div className="scrollAreaWrapper" ref={this.scrollAreaWrapperRef}>
                    <div className="scrollAreaContent" style={scrollAreaContentStyle()}>
                        {
                            dailyTracks.map(t => {
                                return <RectangleTrackItem track={t} key={t.track_id} playTrack={this.playTrack} />
                            })
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
)(withRouter(DailyRecommend))