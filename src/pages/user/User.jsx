import React, { Component, createRef } from 'react'
import { Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import BScroll from 'better-scroll'
import { Tabs, Swiper, DotLoading, Toast, Popup, Form, Input } from 'antd-mobile'
import { Plus, Logout } from '@icon-park/react'
import withRouter from '@/utils/withRouter'
import { longNumberConvert, playTimeFormat } from '@/utils/common'
import {
  getUserLevelInfo,
  getUserInfoAndCollection,
  getUserPlaylist,
  getUserAlbums,
  getUserArtists,
  getUserMVs,
  createUserPlaylist,
  deleteUserPlaylist
} from '@/api/user'
import CommonListItem from '@/components/item/common-list-item/CommonListItem'
import { logoutAction } from '@/redux/actions/user'
import './User.less'

const tabItems = [
  { key: 'playlist', title: '歌单' },
  { key: 'album', title: '专辑' },
  { key: 'artist', title: '艺人' },
  { key: 'mv', title: 'MV' },
]
class User extends Component {
  scrollWrapperRef = createRef()
  swiperRef = createRef()
  mainBS = null
  state = {
    userInfo: null,
    userPlaylists: [],
    userAlbums: [],
    userArtists: [],
    userMVs: [],
    activeIndex: 0,
    popupShow: false,
    value: ''
  }
  // 方法
  // 获取用户信息
  getUserData = () => {
    Toast.show({
      content: '加载中',
      icon: 'loading',
      maskClickable: false
    })
    const task1 = getUserLevelInfo()
    const task2 = getUserInfoAndCollection()
    Promise.all([task1, task2]).then(allRes => {
      const userInfo = {
        userLevel: allRes[0].data.level,
        likedPlaylistCount: allRes[1].subPlaylistCount,
        likedArtistCount: allRes[1].artistCount,
        likedMVCount: allRes[1].mvCount,
      }
      this.setState({ userInfo })
    })
      .finally(() => {
        Toast.clear()
      })
  }
  // 获取用户收藏信息
  getUserCollectionData = () => {
    const uid = this.props.userProfile.userId
    const task1 = getUserPlaylist({ uid })
    const task2 = getUserAlbums({ limit: 10 })
    const task3 = getUserArtists()
    const task4 = getUserMVs()
    Promise.all([task1, task2, task3, task4]).then(allRes => {
      const userPlaylists = allRes[0].playlist.map(p => {
        return {
          playlist_id: p.id,
          playlist_name: p.name,
          playlist_cover: p.coverImgUrl,
          playlist_trackCount: p.trackCount,
          playlist_playCount: p.playCount,
          playlist_updateTime: p.updateTime,
          playlist_self: p.userId === uid
        }
      })
      const userAlbums = allRes[1].data.map(a => {
        return {
          album_id: a.id,
          album_name: a.name,
          album_cover: a.picUrl,
          album_size: a.size,
        }
      })
      const userArtists = allRes[2].data.map(a => {
        return {
          artist_id: a.id,
          artist_name: a.name,
          artist_cover: a.picUrl,
          artist_albumSize: a.albumSize,
          artist_mvSize: a.mvSize,
        }
      })
      const userMVs = allRes[3].data.map(mv => {
        return {
          mv_id: mv.vid * 1,
          mv_name: mv.title,
          mv_cover: mv.coverUrl,
          mv_duration: mv.durationms,
        }
      })
      this.setState({ userPlaylists, userAlbums, userArtists, userMVs })
    })
  }
  // 更新歌单列表
  updateUserPlaylist = () => {
    const uid = this.props.userProfile.userId
    getUserPlaylist({ uid }).then(res => {
      if (res.code === 200) {
        const userPlaylists = res.playlist.map(p => {
          return {
            playlist_id: p.id,
            playlist_name: p.name,
            playlist_cover: p.coverImgUrl,
            playlist_trackCount: p.trackCount,
            playlist_playCount: p.playCount,
            playlist_updateTime: p.updateTime,
            playlist_self: p.userId === uid
          }
        })
        this.setState({ userPlaylists })
      }
    })
  }
  // 创建歌单
  createPlaylist = () => {
    const { value } = this.state
    if (value.trim() === '') {
      this.setState({ popupShow: false })
      return
    }
    Toast.show({
      content: '创建中',
      icon: 'loading',
      maskClickable: false
    })
    createUserPlaylist({ name: value }).then(res => {
      Toast.clear()
      if (res.code === 200) {
        Toast.show({
          content: '创建成功',
          duration: 1000,
          maskClickable: false
        })
        setTimeout(() => this.updateUserPlaylist(), 0)
      } else {
        Toast.show({
          content: '创建成失败',
          duration: 1000,
          maskClickable: false
        })
      }
    }).finally(() => {
      this.setState({ popupShow: false, value: '' })
    })
  }
  // 删除歌单
  deleteUserPlaylistHandler = (e, id) => {
    e.stopPropagation()
    Toast.show({
      content: '删除中',
      icon: 'loading',
      maskClickable: false
    })
    deleteUserPlaylist({ id }).then(res => {
      Toast.clear()
      if (res.code === 200) {
        Toast.show({
          content: '删除成功',
          duration: 1000,
          maskClickable: false
        })
        setTimeout(() => this.updateUserPlaylist(), 0)
      } else {
        Toast.show({
          content: '删除成失败',
          duration: 1000,
          maskClickable: false
        })
      }
    })
  }
  // 生命周期
  componentDidMount() {
    const { isLogin } = this.props
    if (!isLogin) return
    // 获取用户信息
    this.getUserData()
    // 获取用户收藏信息
    this.getUserCollectionData()
    // 初始化BS
    this.mainBS = new BScroll(this.scrollWrapperRef.current, {
      click: true
    })
  }
  componentDidUpdate() {
    if (this.mainBS) this.mainBS.refresh()
  }
  render() {
    const { scrollWrapperRef, swiperRef, createPlaylist, deleteUserPlaylistHandler } = this
    const { userProfile, navigate, logout, isLogin } = this.props
    const { userInfo, userPlaylists, userAlbums, userArtists, userMVs, activeIndex, popupShow, value } = this.state
    const defaultPlaylist = userPlaylists.length > 0 ? userPlaylists[0] : null
    const myPlaylists = userPlaylists.length > 0 ? userPlaylists.filter(p => p.playlist_self).slice(1) : []
    const collectPlaylists = userPlaylists.length > 0 ? userPlaylists.filter(p => !p.playlist_self) : []
    return !isLogin ? <Navigate to='/home' /> : (
      <div className='userPage' ref={scrollWrapperRef}>
        <div className="scrollContent">
          <div className="userCarWrapper">
            <div className="userInfoCard">
              <div className="logout" onClick={() => { logout() }}>
                <Logout theme="outline" size="24" fill="#999" />
              </div>
              <div className="avatar">
                <img src={userProfile.avatarUrl} />
              </div>
              <div className="nickname">{userProfile.nickname}</div>
              <div className="detail">
                <div className="follows">{longNumberConvert(userProfile.follows)} 关注</div>
                <div className="followeds">{longNumberConvert(userProfile.followeds)} 粉丝</div>
                <div className="level" style={{ display: userInfo == null ? 'none' : '' }}>Lv.{userInfo?.userLevel}</div>
              </div>
              <div className="collectCount" style={{ display: userInfo == null ? 'none' : '' }}>
                <div className="playlistCount">{userInfo?.likedPlaylistCount} 歌单 - </div>
                <div className="artistCount">{userInfo?.likedArtistCount} 艺人 - </div>
                <div className="mvCount">{userInfo?.likedMVCount} MV</div>
              </div>
            </div>
          </div>
          <div
            className="defaultPlaylistCard"
            onClick={() => defaultPlaylist ? navigate(`/playlist/${defaultPlaylist?.playlist_id}`) : ''}>
            <div className="left" style={{ display: defaultPlaylist ? '' : 'none' }}>
              <img src={defaultPlaylist?.playlist_cover} />
            </div>
            <div className="right" style={{ display: defaultPlaylist ? '' : 'none' }}>
              <div className="title">我喜欢的音乐</div>
              <div className="count">{defaultPlaylist?.playlist_playCount} 首</div>
            </div>
          </div>
          <div className="collectionCard">
            <Tabs
              activeKey={tabItems[activeIndex].key}
              onChange={key => {
                const activeIndex = tabItems.findIndex(item => item.key === key)
                swiperRef.current?.swipeTo(activeIndex)
                this.setState({ activeIndex }, () => {
                  this.mainBS.scrollTo(0, -325)
                })
              }}
            >
              {tabItems.map(item => (
                <Tabs.Tab title={item.title} key={item.key} />
              ))}
            </Tabs>
            <Swiper
              direction='horizontal'
              loop
              indicator={() => null}
              ref={swiperRef}
              defaultIndex={activeIndex}
              onIndexChange={activeIndex => {
                this.setState({ activeIndex }, () => {
                  this.mainBS.scrollTo(0, -325)
                })
              }}
            >
              <Swiper.Item>
                {userPlaylists?.length === 0 ? <div className="dotloading"><DotLoading /></div> : ''}
                <div className='playlistArea' style={{ display: userPlaylists?.length === 0 ? 'none' : '' }}>
                  <div className="myPlaylist">
                    <div className="header">
                      <div className="title">
                        自建歌单
                        <span
                          className='count'
                        >({myPlaylists.length}个)</span>
                      </div>
                      <div className="btn" onClick={() => this.setState({ popupShow: true })}>
                        <Plus theme="outline" size="24" fill="#333" />
                      </div>
                    </div>
                    {
                      myPlaylists.map(mp =>
                        <CommonListItem
                          key={mp.playlist_id}
                          id={mp.playlist_id}
                          coverUrl={mp.playlist_cover}
                          title={mp.playlist_name}
                          deleteShow={true}
                          clickHandler={() => navigate(`/playlist/${mp.playlist_id}`)}
                          deleteHandler={deleteUserPlaylistHandler}
                        >
                          <div className="size">{mp.playlist_trackCount}首</div>
                        </CommonListItem>)
                    }
                  </div>
                  <div className="collectPlaylist">
                    <div className="header">
                      <div className="title">
                        收藏歌单
                        <span
                          className='count'
                        >({collectPlaylists.length}个)</span>
                      </div>
                    </div>
                    {
                      collectPlaylists.map(cp =>
                        <CommonListItem
                          key={cp.playlist_id}
                          id={cp.playlist_id}
                          coverUrl={cp.playlist_cover}
                          title={cp.playlist_name}
                          clickHandler={() => navigate(`/playlist/${cp.playlist_id}`)}
                        >
                          <div className="collectPlaylistCount">
                            <div className="size">{cp.playlist_trackCount}首</div>
                            <div className="playCount">{longNumberConvert(cp.playlist_playCount)}播放</div>
                          </div>
                        </CommonListItem>)
                    }
                  </div>
                </div>
              </Swiper.Item>
              <Swiper.Item>
                {userAlbums?.length === 0 ? <div className="dotloading"><DotLoading /></div> : ''}
                <div className='albumArea' style={{ display: userAlbums?.length === 0 ? 'none' : '' }}>
                  <div className="header">
                    <div className="title">专辑<span className='count'>({userAlbums.length}个)</span>
                    </div>
                  </div>
                  {
                    userAlbums.map(a =>
                      <CommonListItem
                        key={a.album_id}
                        id={a.album_id}
                        coverUrl={a.album_cover}
                        title={a.album_name}
                        clickHandler={() => navigate(`/album/${a.album_id}`)}
                      >
                        <div className="size">{a.album_size}首</div>
                      </CommonListItem>)
                  }
                </div>
              </Swiper.Item>
              <Swiper.Item>
                {userArtists?.length === 0 ? <div className="dotloading"><DotLoading /></div> : ''}
                <div className='artistArea' style={{ display: userArtists?.length === 0 ? 'none' : '' }}>
                  <div className="header">
                    <div className="title">艺人<span className='count'>({userArtists.length}个)</span>
                    </div>
                  </div>
                  {
                    userArtists.map(a =>
                      <CommonListItem
                        key={a.artist_id}
                        id={a.artist_id}
                        coverUrl={a.artist_cover}
                        title={a.artist_name}
                        clickHandler={() => navigate(`/artistdetail/${a.artist_id}`)}
                      >
                        <div className="artistAreaSize">
                          <div className="albumSize">{a.artist_albumSize}个专辑</div>
                          <div className="mvSize">{a.artist_mvSize}个MV</div>
                        </div>
                      </CommonListItem>)
                  }
                </div>
              </Swiper.Item>
              <Swiper.Item>
                {userMVs?.length === 0 ? <div className="dotloading"><DotLoading /></div> : ''}
                <div className='mvArea' style={{ display: userMVs?.length === 0 ? 'none' : '' }}>
                  <div className="header">
                    <div className="title">MV<span className='count'>({userMVs.length}个)</span>
                    </div>
                  </div>
                  {
                    userMVs.map(mv =>
                      <CommonListItem
                        key={mv.mv_id}
                        id={mv.mv_id}
                        coverUrl={mv.mv_cover}
                        title={mv.mv_name}
                        width='90px'
                        clickHandler={() => navigate(`/video/${mv.mv_id}`, { state: { type: 0 } })}
                      >
                        <div className="duration">{playTimeFormat(Math.ceil(mv.mv_duration / 1000))}</div>
                      </CommonListItem>)
                  }
                </div>
              </Swiper.Item>
            </Swiper>
          </div>
        </div>
        <Popup
          visible={popupShow}
          onMaskClick={() => {
            this.setState({ popupShow: false })
          }}
          bodyStyle={{
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            minHeight: '30vh',
          }}
        >
          <Form layout='horizontal' mode='card'>
            <div className="btnBar">
              <div className="cancel" onClick={() => this.setState({ popupShow: false, value: '' })}>取消</div>
              <div className="create" onClick={() => createPlaylist()}>完成</div>
            </div>
            <Form.Item label='歌单名'>
              <Input placeholder='请输入' value={value} onChange={value => { this.setState({ value }) }} />
            </Form.Item>
          </Form>
        </Popup>
      </div>
    )
  }
}
export default connect(
  state => ({
    isLogin: state.user.isLogin,
    userProfile: state.user.profile
  }),
  {
    logout: logoutAction
  }
)(withRouter(User))