import React, { Component, createRef } from 'react'
import { connect } from 'react-redux'
import PubSub from 'pubsub-js'
import { Toast } from 'antd-mobile'
import { SoundMuteFill } from 'antd-mobile-icons'
import { getTrackPlayData } from '@/api/track'
import { savePlayerDataAction, updateCurrentIndexAction, loadTrackLyricAction } from '@/redux/actions/player'
import MiniPlayer from './mini-player/MiniPlayer'
import FullscreenPlayer from './fullscreen-player/FullscreenPlayer'
import PlayerList from './player-list/PlayerList'
import './Player.less'

class Player extends Component {
  // refs
  audioRef = createRef()

  state = {
    playStatus: false,  //false：暂停   true：播放
    isFullscreen: false,
    currentTime: 0
  }

  // methods
  // 全屏开关
  fullscreenSwicth = (flag) => {
    this.setState({ isFullscreen: flag })
  }

  // 播放开关
  playSwitch = () => {
    const { playStatus } = this.state
    const { currentTrack } = this.props
    // 播放路径不存在,阻止播放
    if (currentTrack.track_url == null) {
      this.setState({ playStatus: false })
      return
    }
    if (playStatus) {
      // 暂停
      this.audioPause()
    } else {
      // 播放
      this.audioPlay()
    }
  }

  // audio 播放
  audioPlay = () => {
    const audioDOM = this.audioRef.current
    // 播放
    try {
      audioDOM.play()
      this.setState({ playStatus: true })
    } catch (error) {
      this.setState({ playStatus: false })
      console.log('audio play Error:', error);
      if (error.message === `Cannot read properties of null (reading 'play')`) return
      // 更新播放器数据     
      this.updatePlayerData()
    }
  }

  // audio 暂停
  audioPause = () => {
    const audioDOM = this.audioRef.current
    try {      
      audioDOM.pause()
      this.setState({ playStatus: false })
    } catch (error) {
      console.log('audio play Error:', error);
      if (error.message === `Cannot read properties of null (reading 'pause')`) return
    }
  }

  // 更新播放器中的音乐数据
  updatePlayerData = () => {
    Toast.show({
      icon: 'loading',
      content: '加载中…',
      maskClickable: false
    })
    // 防止一直显示加载中,10s后无论有没有更新成功,都取消Toast
    const timer = setTimeout(() => {
      Toast.clear()
    }, 10000)
    this.setState({ playStatus: false })
    const { playList, currentIndex, savePlayerData } = this.props
    const trackIds = playList.map(t => t.track_id).join(',')
    // 根据播放器中原有的歌曲 ids 获取新的数据并添加到播放器中
    getTrackPlayData(trackIds).then(newTracksDetail => {
      savePlayerData(newTracksDetail, currentIndex)
      Toast.clear()
      // 成功更新完毕手动清除定时器
      clearTimeout(timer)
    })
  }

  // 播放器可以播放处理
  canplayHandler = () => {
    // 当 audio 获取 url (切换歌曲、将歌曲添加到播放器)并且canplay后，
    // 根据redux中的播放状态操作DOM播放歌曲
    const { realPlayStatus } = this.props
    const { playStatus } = this.state
    if (playStatus || realPlayStatus) {
      this.audioPlay()
    }
  }

  // 时间更新处理
  timeUpdateHandler = (e) => {
    const dt = this.props.currentTrack.track_duration
    const currentTime = e.target.currentTime
    // 广播当前播放时间
    PubSub.publish('Player_CurrentTime', { currentTime })
    // 广播当前播放进度
    PubSub.publish('Player_CurrentProcess', { currentProcess: (currentTime / (dt / 1000)) * 100 })
    this.setState({ currentTime })
  }

  // 音量更新处理
  volumeChangeHandler = (e) => {
    const volumeValue = e.target.volume
    if (volumeValue === 0) {
      Toast.show({
        content: '静音',
        icon: <SoundMuteFill />
      })
    }
  }

  // 歌曲播放结束处理
  endedHandler = () => {
    // 播放结束先设置暂停状态
    this.setState({ playStatus: false })
    const { updateCurrentIndex, playMode } = this.props
    // 播放结束根据播放模式选择播放下一首或是单曲循环
    if (playMode === 2) {
      this.audioPlay()
    } else {
      updateCurrentIndex({ type: 'next' })
    }
  }

  // 播放出错处理
  errorHandler = (err) => {
    // 1.处理播放路径失效问题
    console.log('播放出错(audio Error)', err);
    // 暂停播放
    this.setState({ playStatus: false })
    // 更新播放器数据
    this.updatePlayerData()
  }

  // lifecycle
  componentDidMount() {
    const { updateCurrentIndex } = this.props
    const audioDOM = this.audioRef.current
    // 默认的播放音量为0.3
    audioDOM.volume = 0.3
    // 播放控制     
    PubSub.subscribe('Player_PlaySwitch', () => {
      this.playSwitch()
    })
    PubSub.subscribe('Player_Pause', () => {
      this.audioPause()
    })
    // 歌曲切换控制
    PubSub.subscribe('Player_TrackSwitch', (_, type) => {
      this.setState({ playStatus: false })
      setTimeout(() => {
        if (type === 'pre') {
          updateCurrentIndex({ type: 'pre' })
        }
        if (type === 'next') {
          updateCurrentIndex({ type: 'next' })
        }
      }, 600)
    })
    // slide 拖动结束
    PubSub.subscribe('Player_AfterSlide', (_, { value }) => {
      audioDOM.currentTime = value
      this.audioPlay()
    })
    // 音量控制
    PubSub.subscribe('Player_volumeValue', (_, { volumeValue }) => {
      audioDOM.volume = volumeValue
    })
  }
  componentDidUpdate(prevProps, prevState) {
    const audioDOM = this.audioRef.current
    const { currentTrack } = this.props
    const { playStatus } = this.state
    const currentTrackId = this.props.currentTrack.track_id
    const currentTrackLyric = this.props.currentTrack.track_lyric
    if (currentTrackLyric == null) {
      this.props.loadTrackLyric(currentTrackId)
    }
    //
    // 无可用播放资源,暂停播放
    if (currentTrack.track_url === null) {
      audioDOM.pause()
      if (playStatus) {
        this.setState({ playStatus: false })
      }
    }
  }

  render() {
    const { playStatus, isFullscreen, currentTime } = this.state
    const { currentTrack } = this.props
    return (
      <div className='player'>
        <audio
          src={currentTrack.track_url}
          ref={this.audioRef}
          onCanPlay={this.canplayHandler}
          onTimeUpdate={this.timeUpdateHandler}
          onVolumeChange={this.volumeChangeHandler}
          onEnded={this.endedHandler}
          onError={this.errorHandler}>
        </audio>
        <FullscreenPlayer
          currentTrack={currentTrack}
          playStatus={playStatus}
          isFullscreen={isFullscreen}
          currentTime={currentTime}
          playSwitch={this.playSwitch}
          fullscreenSwicth={this.fullscreenSwicth}
        />
        <MiniPlayer
          currentTrack={currentTrack}
          playStatus={playStatus}
          isFullscreen={isFullscreen}
          playSwitch={this.playSwitch}
          fullscreenSwicth={this.fullscreenSwicth}
        />
        <PlayerList />
      </div>
    )
  }
}

export default connect(
  state => ({
    realPlayStatus: state.player.playStatus,
    playList: state.player.playList,
    currentIndex: state.player.currentIndex,
    currentTrack: state.player.currentTrack,
    playMode: state.player.playMode
  }),
  {
    savePlayerData: savePlayerDataAction,
    updateCurrentIndex: updateCurrentIndexAction,
    loadTrackLyric: loadTrackLyricAction
  }
)(Player)
