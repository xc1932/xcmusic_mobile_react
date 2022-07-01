import React, { Component, createRef } from 'react'
import { connect } from 'react-redux'
import BScroll from 'better-scroll'
import dayjs from 'dayjs'
import { Right } from '@icon-park/react'
import { DotLoading } from 'antd-mobile'
import { getRecommendPlaylists, getRecommendMVs } from '@/api/recommend'
import { getNewAlbums } from '@/api/album'
import withRouter from '@/utils/withRouter'
import { longNumberConvert } from '@/utils/common'
import { savePlayerDataAction, deletePlayerDataAction, updateCurrentIndexAction } from '@/redux/actions/player'
import Search from '@/components/search/Search'
import Banner from '@/components/banner/Banner'
import CommonItem from '@/components/item/common-item/CommonItem'
import DailyRecommend from '@/assets/images/category/calendar100.png'
import PlayList from '@/assets/images/category/playlist100.png'
import Artist from '@/assets/images/category/artist100.png'
import Album from '@/assets/images/category/album100.png'
import Rank from '@/assets/images/category/rank100.png'
import './Home.less'


class Home extends Component {
    homeScrollWrapperRef = createRef()
    recommendPlaylistScrollWrapperRef = createRef()
    newAlbumWrapperRef = createRef()
    mvScrollWrapperRef = createRef()
    homeBS = null
    recommendPlaylistBS = null
    newAlbumBS = null
    mvBS = null
    state = {
        recomPlaylists: [],
        recomMVs: [],
        newAlbums: [],
    }

    // methods
    // 初始化数据
    initData = () => {
        const task1 = getRecommendPlaylists()
        const task2 = getRecommendMVs()
        const task3 = getNewAlbums()
        Promise.all([task1, task2, task3]).then(allRes => {
            const recomPlaylists = allRes[0].result.map(p => {
                return {
                    playlist_id: p.id,
                    playlist_name: p.name,
                    playlist_cover: p.picUrl,
                    playlist_playCount: p.playCount
                }
            })
            const recomMVs = allRes[1].result.map(mv => {
                return {
                    mv_id: mv.id,
                    mv_name: mv.name,
                    mv_cover: mv.picUrl,
                    mv_playCount: mv.playCount,
                }
            })
            const newAlbums = allRes[2].albums.map(a => {
                return {
                    album_id: a.id,
                    album_name: a.name,
                    album_cover: a.picUrl,
                    album_publishTime: a.publishTime,
                }
            })
            this.setState({ recomPlaylists, recomMVs, newAlbums }, () => {
                this.refreshBS()
            })
        })
    }

    // refresh bs
    refreshBS = () => {
        this.homeBS.refresh()
        this.recommendPlaylistBS.refresh()
        this.newAlbumBS.refresh()
        this.mvBS.refresh()
    }
    // 生命周期
    componentDidMount() {
        const {
            homeScrollWrapperRef,
            recommendPlaylistScrollWrapperRef,
            newAlbumWrapperRef,
            mvScrollWrapperRef,
        } = this
        // 获取数据
        this.initData()
        // 初始化BS
        this.homeBS = new BScroll(homeScrollWrapperRef.current, {
            click: true
        })
        this.recommendPlaylistBS = new BScroll(recommendPlaylistScrollWrapperRef.current, {
            scrollX: true,
            click: true,
            eventPassthrough: 'vertical' // 保持纵向的原生浏览器滚动
        })
        this.newAlbumBS = new BScroll(newAlbumWrapperRef.current, {
            scrollX: true,
            click: true,
            eventPassthrough: 'vertical' // 保持纵向的原生浏览器滚动
        })
        this.mvBS = new BScroll(mvScrollWrapperRef.current, {
            scrollX: true,
            click: true,
            eventPassthrough: 'vertical' // 保持纵向的原生浏览器滚动
        })
    }
    render() {
        const {
            homeScrollWrapperRef,
            recommendPlaylistScrollWrapperRef,
            newAlbumWrapperRef,
            mvScrollWrapperRef
        } = this
        const { navigate } = this.props
        const { recomPlaylists, newAlbums, recomMVs } = this.state
        return (
            <div className='home'>
                <div className="searchArea">
                    <Search />
                </div>
                <div className="homeScrollWrapper" ref={homeScrollWrapperRef}>
                    <div className="homeScrollContent">
                        <div className="bannerArea">
                            <Banner />
                        </div>
                        <div className="categoryArea">
                            <div className="item" onClick={() => navigate('/dailyrecommend')}>
                                <img src={DailyRecommend} />
                                <span>推荐</span>
                            </div>
                            <div className="item" onClick={() => navigate('/playlist')}>
                                <img src={PlayList} />
                                <span>歌单</span>
                            </div>
                            <div className="item" onClick={() => navigate('/artist')}>
                                <img src={Artist} />
                                <span>歌手</span>
                            </div>
                            <div className="item" onClick={() => navigate('/album')}>
                                <img src={Album} />
                                <span>专辑</span>
                            </div>
                            <div className="item" onClick={() => navigate('/toplist')}>
                                <img src={Rank} />
                                <span>排行</span>
                            </div>
                        </div>
                        <div className="recommendPlaylist">
                            <div className="header">
                                <div className="title">推荐歌单</div>
                                <div className="more" onClick={() => navigate(`/playlist`)}>
                                    更多<Right theme="filled" size="16" fill="#b5a642" />
                                </div>
                            </div>
                            <div
                                className="recommendPlaylistScrollWrapper"
                                ref={recommendPlaylistScrollWrapperRef}
                            >
                                <div className="recommendPlaylistContent">
                                    {
                                        recomPlaylists.map(p =>
                                            <CommonItem
                                                key={p.playlist_id}
                                                width='120px'
                                                height='120px'
                                                id={p.playlist_id}
                                                coverUrl={p.playlist_cover}
                                                playCount={longNumberConvert(p.playlist_playCount)}
                                                name={p.playlist_name}
                                                clickHandler={() => navigate(`/playlist/${p.playlist_id}`)}
                                            />)
                                    }
                                </div>
                            </div>
                            {
                                recomPlaylists.length === 0 ? <DotLoading /> : ''
                            }
                        </div>
                        <div className="newAlbum">
                            <div className="header">
                                <div className="title">新专速递</div>
                                <div className="more" onClick={() => navigate(`/album`)}>
                                    更多<Right theme="filled" size="16" fill="#b5a642" />
                                </div>
                            </div>
                            <div className="newAlbumScrollWrapper" ref={newAlbumWrapperRef}>
                                <div className="newAlbumContent">
                                    {
                                        newAlbums.map(a =>
                                            <CommonItem
                                                key={a.album_id}
                                                width='120px'
                                                height='120px'
                                                id={a.album_id}
                                                coverUrl={a.album_cover}
                                                publishTime={dayjs(a.album_publishTime).format('YYYY-MM-DD')}
                                                name={a.album_name}
                                                clickHandler={() => navigate(`/album/${a.album_id}`)}
                                            />)
                                    }
                                </div>
                            </div>
                            {
                                newAlbums.length === 0 ? <DotLoading /> : ''
                            }
                        </div>
                        <div className="mv">
                            <div className="header">
                                <div className="title">推荐MV</div>
                            </div>
                            <div className="mvScrollWrapper" ref={mvScrollWrapperRef}>
                                <div className="mvContent">
                                    {
                                        recomMVs.map(mv =>
                                            <CommonItem
                                                key={mv.mv_id}
                                                width='200px'
                                                height='120px'
                                                id={mv.mv_id}
                                                coverUrl={mv.mv_cover}
                                                playCount={longNumberConvert(mv.mv_playCount)}
                                                name={mv.mv_name}
                                                clickHandler={() => navigate(`/video/${mv.mv_id}`, { state: { type: 0 } })}
                                            />)
                                    }
                                </div>
                            </div>
                            {
                                recomMVs.length === 0 ? <DotLoading /> : ''
                            }
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(
    state => ({}),
    {
        savePlayerData: savePlayerDataAction,
        deletePlayerData: deletePlayerDataAction,
        updateCurrentIndex: updateCurrentIndexAction,
    }
)(withRouter(Home))
