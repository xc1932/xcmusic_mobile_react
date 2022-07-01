import React, { Component } from 'react'
import { connect } from 'react-redux'
import PubSub from 'pubsub-js'
import BScroll from 'better-scroll'
import { ActionSheet, Dialog, Toast } from 'antd-mobile'
import { Download, Add, Delete, Close } from '@icon-park/react'
import { download } from '@/utils/common'
import { deletePlayerDataAction, deleteTrackAction, selectTrackAction } from '@/redux/actions/player'
import './PlayerList.less'

class PlayerList extends Component {
    playerlistBS = null
    historylistBS = null
    currentlistBS = null
    state = {
        showPlayerList: false
    }
    // lifecycle
    componentDidMount() {
        // 初始化BetterScroll
        this.playerlistBS = new BScroll('.playerlist-slide-wrapper', {
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            stopPropagation: true,
            click: true,
            slide: {
                loop: false,
                autoplay: false,
                threshold: 0.35,
                startPageXIndex: 1,
            }
        })
        this.historylistBS = new BScroll('.historylist-scroll-wrapper', {
            scrollX: false,
            scrollY: true,
        })
        this.currentlistBS = new BScroll('.currentlist-scroll-wrapper', {
            scrollX: false,
            scrollY: true,
        })
        // 订阅显示播放列表的事件
        PubSub.subscribe('Player_ShowPlayerList', (_, { showPlayerList }) => {
            this.setState({ showPlayerList })
        })
    }
    componentDidUpdate() {
        // 滚动到正在播放(选中)的歌曲
        this.currentlistBS.scrollToElement('.selectedTrack', 1000)
    }
    // methods
    // 点击空白处关闭播放列表
    closePlayerList = (e) => {
        if (e.currentTarget === e.target) {
            this.setState({ showPlayerList: false })
        }
    }
    // 清除当前的播放列表
    clearCurrentPlayList = (e) => {
        e.stopPropagation()
        this.props.deletePlayerData()
    }
    // 删除选中的歌曲
    deleteTrackOfCurrentPlayList = (e, trackId) => {
        e.stopPropagation()
        this.props.deleteTrack(trackId)
        this.currentlistBS.refresh()
    }
    // 播放选中的歌曲
    selectTrackOfCurrentPlayList = (e, trackId) => {
        e.stopPropagation()
        this.props.selectTrack(trackId)
    }
    // 歌曲下载处理
    download = (e) => {
        e.stopPropagation()
        // 面板选项列表
        const actions = [
            {
                text: '当前歌曲',
                key: 'currentTrack',
                onClick: () => {
                    Toast.show({ content: '正在下载...', duration: 1000 })
                    const { currentTrack } = this.props
                    download(currentTrack.track_url, currentTrack.track_name)
                }
            },
            {
                text: '全部歌曲',
                key: 'allTracks',
                onClick: async () => {
                    const result = await Dialog.confirm({
                        content: '下载全部歌曲?',
                    })
                    if (result) {
                        const { playList } = this.props
                        playList.forEach(track => {
                            download(track.track_url, track.track_name)
                        })
                        Toast.show({ content: '即将下载', duration: 1000 })
                    } else {
                        Toast.show({ content: '下载取消', duration: 1000 })
                    }

                }
            },
        ]
        // 实例化动作面板并展示
        const handler = ActionSheet.show({
            actions,
            cancelText: '取消',
            extra: '下载',
            closeOnAction: true
        })
    }
    render() {
        const { playList, currentTrack } = this.props
        const { showPlayerList } = this.state
        // playerList 显示时的样式
        const playerListOfShow = {
            opacity: 1,
            visibility: 'visible'
        }
        // playerlist-wrapper 显示时的样式
        const playerlistWrapperOfShow = {
            marginBottom: '15px'
        }
        // item 选中时的样式
        const selectdStyle = (trackId) => {
            return trackId === currentTrack.track_id ? { color: '#ff0c0c' } : {}
        }
        // item 选中时的类名
        const selectdClassName = (trackId) => {
            return trackId === currentTrack.track_id ? 'item selectedTrack' : 'item'
        }
        return (
            <div
                className='playerList'
                style={showPlayerList ? playerListOfShow : {}}
                onClick={this.closePlayerList}>
                <div
                    className="playerlist-slide-wrapper"
                    style={showPlayerList ? playerlistWrapperOfShow : {}}
                >
                    <div className="playerlist-slide-content">
                        <div className='historyPlay'>
                            <div className="bgArea">
                                <div className="header">
                                    <div className="title">历史播放</div>
                                    <div className="btns">
                                        <Download theme="outline" size="22" fill="#999" />
                                        <Add theme="outline" size="22" fill="#999" />
                                        <Delete theme="outline" size="22" fill="#999" />
                                    </div>
                                </div>
                                <div className="historylist-scroll-wrapper">
                                    <div className="historylist-scroll-content">

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='currentPlay'>
                            <div className="bgArea">
                                <div className="header">
                                    <div className="title">当前播放<span className='count'>({playList.length})</span></div>
                                    <div className="btns">
                                        <Download theme="outline" size="22" fill="#999" onClick={this.download} />
                                        <Add theme="outline" size="22" fill="#999" />
                                        <Delete theme="outline" size="22" fill="#999" onClick={this.clearCurrentPlayList} />
                                    </div>
                                </div>
                                <div className="currentlist-scroll-wrapper">
                                    <div className="currentlist-scroll-content">
                                        {
                                            playList.map(track => {
                                                return (
                                                    <div
                                                        className={selectdClassName(track.track_id)}
                                                        key={track.track_id}
                                                        style={selectdStyle(track.track_id)}
                                                        onClick={(e) => this.selectTrackOfCurrentPlayList(e, track.track_id)}
                                                    >
                                                        <div className="trackInfo">
                                                            <span
                                                                className='trackName'
                                                                style={selectdStyle(track.track_id)}
                                                            >{track.track_name}</span>
                                                            {'\u00A0'}-{'\u00A0'}
                                                            <span
                                                                className='trackArtist'
                                                                style={selectdStyle(track.track_id)}
                                                            >{track.track_artists.map(a => a.artist_name).join('/')}</span>
                                                        </div>
                                                        <div className="btn">
                                                            <Close theme="outline" size="16" fill="#999" onClick={(e) => this.deleteTrackOfCurrentPlayList(e, track.track_id)} />
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        playList: state.player.playList,
        currentTrack: state.player.currentTrack
    }),
    {
        deletePlayerData: deletePlayerDataAction,
        deleteTrack: deleteTrackAction,
        selectTrack: selectTrackAction
    }
)(PlayerList)

