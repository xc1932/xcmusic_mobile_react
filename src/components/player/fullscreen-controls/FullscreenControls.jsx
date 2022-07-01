import React, { Component, createRef } from 'react'
import { connect } from 'react-redux'
import PubSub from 'pubsub-js'
import BScroll from 'better-scroll'
import { Slider, ActionSheet, Dialog, Toast, Popup, DotLoading, Ellipsis } from 'antd-mobile'
import {
    Like,
    Download,
    Comment,
    Add,
    VolumeNotice,
    PlayCycle,
    ShuffleOne,
    LoopOnce,
    GoStart,
    PlayOne,
    Pause,
    GoEnd,
    MusicList,
    VolumeDown,
    VolumeUp
} from '@icon-park/react'
import { modeSwitchAction } from '@/redux/actions/player'
import { playTimeFormat, download } from '@/utils/common'
import { getComment } from '@/api/comment'
import { getLikeList, likeSong, getUserPlaylist, updateUserPlaylist } from '@/api/user'
import CommonListItem from '@/components/item/common-list-item/CommonListItem'
import './FullscreenControls.less'


class FullscreenControls extends Component {
    scrollWrapperRef = createRef()
    commentWrapperRef = createRef()
    listBS = null
    commentListBS = null
    state = {
        currentTime: 0,
        isDragging: false,
        popupVisable: false,
        addToPlaylistPopupVisable: false,
        userLikedTracks: [],
        userPlaylists: [],
        comments: []
    }

    // methods
    // 模式切换
    modeSwitch = (e) => {
        e.stopPropagation()
        this.props.modeSwitch()
    }
    // 播放暂停
    playSwitch = (e) => {
        e.stopPropagation()
        PubSub.publish('Player_PlaySwitch')
    }
    // 上一首
    previousTrack = (e) => {
        e.stopPropagation()
        PubSub.publish('Player_TrackSwitch', 'pre')
    }
    // 下一首
    nextTrack = (e) => {
        e.stopPropagation()
        PubSub.publish('Player_TrackSwitch', 'next')
    }
    // 展开/折叠播放列表
    playlistSwitch = (e) => {
        e.stopPropagation()
        PubSub.publish('Player_ShowPlayerList', { showPlayerList: true })
    }
    // 处理 slide 拖动事件
    sliderChange = (value) => {
        this.setState({ currentTime: value, isDragging: true })
    }
    // 处理 slide 拖动结束事件
    slideAfterChange = (value) => {
        this.setState({ isDragging: false })
        PubSub.publish('Player_AfterSlide', { value })
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
    // 获取当前歌曲的评论
    getComment = () => {
        const { currentTrack } = this.props
        const currentTrackId = currentTrack.track_id
        getComment({
            id: currentTrackId,
            type: 0,
            sortType: 2
        }).then(commentRes => {
            if (commentRes.code === 200) {
                const comments = commentRes.data.comments.map(c => {
                    return {
                        comment_id: c.commentId,
                        comment_content: c.content,
                        comment_timeStr: c.timeStr,
                        comment_user: {
                            user_id: c.user.userId,
                            user_name: c.user.nickname,
                            user_avatar: c.user.avatarUrl
                        }
                    }
                })
                this.setState({ comments }, () => this.commentListBS.refresh())
            }
        })
    }
    // 音量调节面板控制
    popupControl = (e) => {
        e.stopPropagation()
        this.setState({ popupVisable: true })
        this.getComment()
    }
    // 音量控制
    volumeSliderChange = (volumeValue) => {
        PubSub.publish('Player_volumeValue', { volumeValue })
    }
    // 更新用户喜欢的音乐
    updateUserLikedTracks = () => {
        const { userId } = this.props
        // 获取用户喜欢的音乐列表
        getLikeList({ uid: userId }).then(res => {
            if (res.code === 200) {
                this.setState({ userLikedTracks: res.ids })
            }
        })
    }
    //更新用户的歌单
    updateUserPlaylist = () => {
        const { userId } = this.props
        getUserPlaylist({ uid: userId }).then(res => {
            if (res.code === 200) {
                const userPlaylists = res.playlist.filter(p => p.userId === userId).map(p => {
                    return {
                        playlist_id: p.id,
                        playlist_name: p.name,
                        playlist_cover: p.coverImgUrl,
                        playlist_trackCount: p.trackCount,
                    }
                })
                this.setState({ userPlaylists })
            }
        })
    }
    // 收藏一首歌
    likeATrack = (e, type, id) => {
        e.stopPropagation()
        let like = true
        if (type === 1) {
            like = false
        }
        likeSong({ id, like }).then(res => {
            if (res.code === 200) {
                this.updateUserLikedTracks()
                let { userLikedTracks } = this.state
                if (type === 1) {
                    userLikedTracks = userLikedTracks.filter(i => i !== id)
                    this.setState({ userLikedTracks })
                } else {
                    this.setState({ userLikedTracks: [...userLikedTracks, id] })
                }
            }
        })
    }
    // 添加到歌单
    addToPlaylist = (pId, tId) => {
        updateUserPlaylist({ op: 'add', pid: pId, tracks: tId }).then(res => {
            if (res.code === 200) {
                Toast.show({
                    content: '添加成功',
                    duration: 1000
                })
            }
        }).finally(() => {
            this.setState({ addToPlaylistPopupVisable: false })
        })
    }
    // liftcycle
    componentDidMount() {
        // 订阅播放时间
        PubSub.subscribe('Player_CurrentTime', (_, { currentTime }) => {
            // 拖动 slide 时,阻止更新 slide
            const { isDragging } = this.state
            if (isDragging) return
            this.setState({ currentTime })
        })
        // 更新用户喜欢的音乐
        this.updateUserLikedTracks()
    }
    componentDidUpdate(prevProps) {
        const { currentTrack } = this.props
        const currentTrackId = currentTrack.track_id
        const prevTrackId = prevProps.currentTrack.track_id
        if (currentTrackId !== prevTrackId) {
        }
        // 初始化和刷新bs
        const scrollWrapperDOM = this.scrollWrapperRef.current
        const commentWrapperDOM = this.commentWrapperRef.current
        if (this.listBS == null && scrollWrapperDOM !== null) {
            this.listBS = new BScroll(scrollWrapperDOM, {
                click: true
            })
        }
        if (this.commentListBS == null && commentWrapperDOM !== null) {
            this.commentListBS = new BScroll(commentWrapperDOM, {
                click: true
            })
        }
        if (this.listBS !== null) this.listBS.refresh()
        if (this.commentListBS !== null) this.commentListBS.refresh()
    }
    render() {
        const { scrollWrapperRef, commentWrapperRef, likeATrack, updateUserPlaylist, addToPlaylist } = this
        const { playStatus, playMode, totalTime, currentTrack } = this.props
        const { currentTime, popupVisable, addToPlaylistPopupVisable, userLikedTracks, userPlaylists, comments } = this.state
        return (
            <div className='fullscreenControls'>
                <div className="controls-top">
                    {
                        userLikedTracks.includes(currentTrack.track_id) ?
                            <Like theme="filled" size="30" fill="#f06868" onClick={(e) => likeATrack(e, 1, currentTrack.track_id)} /> :
                            <Like theme="outline" size="30" fill="#fff" onClick={(e) => likeATrack(e, 0, currentTrack.track_id)} />
                    }
                    <Download theme="outline" size="30" fill="#fff" onClick={this.download} />
                    <Comment theme="outline" size="30" fill="#fff" onClick={this.popupControl} />
                    <Add theme="outline" size="30" fill="#fff" onClick={() => this.setState({ addToPlaylistPopupVisable: true })} />
                    <VolumeNotice theme="outline" size="30" fill="#fff" onClick={this.popupControl} />
                </div>
                <div className="processbar">
                    <span className="playedTime">{playTimeFormat(currentTime)}</span>
                    <div className="slider">
                        <Slider max={totalTime}
                            value={Math.floor(currentTime)}
                            onChange={this.sliderChange}
                            onAfterChange={this.slideAfterChange}
                        />
                    </div>
                    <span className="totalTime">{playTimeFormat(totalTime)}</span>
                </div>
                <div className="controls-bottom">
                    <div className="modeControl" onClick={this.modeSwitch}>
                        {
                            playMode === 0 ? <PlayCycle theme="outline" size="30" fill="#fff" /> :
                                playMode === 1 ? <ShuffleOne theme="outline" size="30" fill="#fff" /> :
                                    <LoopOnce theme="outline" size="30" fill="#fff" />
                        }
                    </div>
                    <GoStart theme="outline" size="30" fill="#fff" onClick={this.previousTrack} />
                    <div className="playControl" onClick={this.playSwitch}>
                        {
                            playStatus ? <Pause theme="outline" size="55" fill="#fff" /> :
                                <PlayOne theme="filled" size="55" fill="#fff" />
                        }
                    </div>
                    <GoEnd theme="outline" size="30" fill="#fff" onClick={this.nextTrack} />
                    <MusicList theme="outline" size="30" fill="#fff" onClick={this.playlistSwitch} />
                </div>
                <Popup
                    visible={addToPlaylistPopupVisable}
                    bodyStyle={{
                        minHeight: '80vh',
                        padding: '20px 20px',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                    }}
                    onMaskClick={() => this.setState({ addToPlaylistPopupVisable: false })}
                    afterShow={updateUserPlaylist}
                >
                    <div className="addToPlaylistPopup">
                        <div className="header">收藏到歌单</div>
                        <div className="scrollWrapper" ref={scrollWrapperRef}>
                            <div className="scrollContent">
                                {
                                    userPlaylists.map(mp =>
                                        <CommonListItem
                                            key={mp.playlist_id}
                                            id={mp.playlist_id}
                                            coverUrl={mp.playlist_cover}
                                            title={mp.playlist_name}
                                            clickHandler={() => addToPlaylist(mp.playlist_id, currentTrack.track_id)}
                                        >
                                            <div className="size">{mp.playlist_trackCount}首</div>
                                        </CommonListItem>)
                                }
                                {
                                    userPlaylists.length === 0 ?
                                        <div className="loading">
                                            <DotLoading />
                                        </div>
                                        : ''
                                }
                            </div>
                        </div>
                    </div>
                </Popup>
                <Popup
                    visible={popupVisable}
                    bodyStyle={{
                        minHeight: '80vh',
                        padding: '20px 20px 0',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                    }}
                    onMaskClick={() => this.setState({ popupVisable: false })}
                >
                    <div className="volumeControl">
                        <VolumeDown theme="outline" size="24" fill="#333" />
                        <div className="volumeBar">
                            <Slider
                                min={0}
                                max={1}
                                step={0.01}
                                defaultValue={0.3}
                                onChange={this.volumeSliderChange}
                            />
                        </div>
                        <VolumeUp theme="outline" size="24" fill="#333" />
                    </div>
                    <div className="commentTitle">评论区</div>
                    <div className="commentWrapper" ref={commentWrapperRef}>
                        <div className="commentContent">
                            {
                                comments.map(c => {
                                    return (
                                        <div className="commentItem" key={c.comment_id}>
                                            <div className="user">
                                                <div className="avatar">
                                                    <img src={c.comment_user.user_avatar} />
                                                </div>
                                                <div className="detail">
                                                    <div className="nickname">{c.comment_user.user_name}</div>
                                                    <div className="commentTime">{c.comment_timeStr}</div>
                                                </div>
                                            </div>
                                            <div className="content" onClick={() => setTimeout(() => this.commentListBS.refresh(), 0)}>
                                                <Ellipsis
                                                    direction='end'
                                                    rows={5}
                                                    expandText='展开'
                                                    collapseText='收起'
                                                    content={c.comment_content}
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            {
                                comments.length === 0 ?
                                    <div className="loading">
                                        <DotLoading />
                                    </div>
                                    : ''
                            }
                        </div>
                    </div>
                </Popup>
            </div>
        )
    }
}

export default connect(
    state => ({
        userId: state.user?.profile.userId,
        playMode: state.player.playMode,
        playList: state.player.playList,
        currentTrack: state.player.currentTrack
    }),
    {
        modeSwitch: modeSwitchAction
    }
)(FullscreenControls)