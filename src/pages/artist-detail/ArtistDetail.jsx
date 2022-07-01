import React, { Component, createRef, Fragment } from 'react'
import BScroll from 'better-scroll'
import dayjs from 'dayjs'
import { Tabs, Swiper, Ellipsis, Toast } from 'antd-mobile'
import withRouter from '@/utils/withRouter'
import { playTimeFormat, longNumberConvert } from '@/utils/common'
import { getArtistDetail, getArtistDesc, getArtistAlbum, getArtistMV } from '@/api/artist'
import NavBar from '@/components/navbar/NavBar'
import './ArtistDetail.less'

const tabItems = [
    { key: 'home', title: '主页' },
    { key: 'album', title: '专辑' },
    { key: 'mv', title: 'MV' },
]
class ArtistDetail extends Component {
    swiperRef = createRef()
    homeScrollWrapperRef = createRef()
    albumScrollWrapperRef = createRef()
    mvScrollWrapperRef = createRef()
    homeBS = null
    albumBS = null
    mvBS = null
    state = {
        artistInfo: null,
        artistAlbums: [],
        artistMVs: [],
        activeIndex: 0
    }
    // 方法
    // 初始化数据
    initData = () => {
        const { id } = this.props.params
        const limit = 20
        const task1 = getArtistDetail({ id })
        const task2 = getArtistDesc({ id })
        const task3 = getArtistAlbum({ id, limit })
        const task4 = getArtistMV({ id, limit })
        Toast.show({
            icon: 'loading',
            content: '加载中…',
            maskClickable: false,
            duration: 0
        })
        Promise.all([task1, task2, task3, task4]).then(allRes => {
            const data = allRes[0].data
            const artistInfo = {
                artist_id: data.artist.id,
                artist_name: data.artist.name,
                artist_cover: data.artist.cover,
                artist_identify: data.identify.imageDesc,
                artist_briefDesc: allRes[1].briefDesc,
                artist_introduction: allRes[1].introduction
            }
            const artistAlbums = allRes[2].hotAlbums.map(a => {
                return {
                    album_id: a.id,
                    album_name: a.name,
                    album_cover: a.picUrl,
                    album_publishTime: a.publishTime,
                    album_size: a.size
                }
            })
            const artistMVs = allRes[3].mvs.map(mv => {
                return {
                    mv_id: mv.id,
                    mv_name: mv.name,
                    mv_cover: mv.imgurl,
                    mv_publishTime: mv.publishTime,
                    mv_playCount: mv.playCount,
                    mv_duration: mv.duration
                }
            })
            this.setState({ artistInfo, artistAlbums, artistMVs }, () => {
                this.refreshBScroll()
            })
        }).finally(() => {
            Toast.clear()
        })
    }
    // swiper switch
    swiperSwitch = (activeIndex) => {
        this.setState({ activeIndex })
    }
    // tab switch
    tabSwitch = (key) => {
        const activeIndex = tabItems.findIndex(item => item.key === key)
        this.setState({ activeIndex })
        this.swiperRef.current?.swipeTo(activeIndex)
    }
    // refresh bs
    refreshBScroll = () => {
        this.homeBS.refresh()
        this.albumBS.refresh()
        this.mvBS.refresh()
    }
    // 生命周期
    componentDidMount() {
        const { homeScrollWrapperRef, albumScrollWrapperRef, mvScrollWrapperRef } = this
        // 获取数据
        this.initData()
        // 初始化BS
        this.homeBS = new BScroll(homeScrollWrapperRef.current, {
            click: true
        })
        this.albumBS = new BScroll(albumScrollWrapperRef.current, {
            click: true
        })
        this.mvBS = new BScroll(mvScrollWrapperRef.current, {
            click: true
        })
    }
    componentDidUpdate() {
        setTimeout(() => this.refreshBScroll(), 0)
    }
    render() {
        const { swiperRef, swiperSwitch, tabSwitch, homeScrollWrapperRef, albumScrollWrapperRef, mvScrollWrapperRef } = this
        const { navigate } = this.props
        const { artistInfo, artistAlbums, artistMVs, activeIndex } = this.state
        return (
            <div className='artistDetailPage' style={{ visibility: artistInfo === null ? 'hidden' : 'visible' }}>
                <div className="navbar">
                    <NavBar></NavBar>
                </div>
                <div className="header" style={{ backgroundImage: `url(${artistInfo?.artist_cover})`, }}>
                    <div className="card">
                        <div className="name">{artistInfo?.artist_name}</div>
                        <div className="ident">{artistInfo?.artist_identify}</div>
                    </div>
                </div>
                <div className="mainBody">
                    <div className="tabs">
                        <Tabs
                            activeKey={tabItems[activeIndex].key}
                            onChange={tabSwitch}
                        >
                            {tabItems.map(item => (
                                <Tabs.Tab title={item.title} key={item.key} />
                            ))}
                        </Tabs>
                    </div>
                    <Swiper
                        direction='horizontal'
                        loop
                        indicator={() => null}
                        ref={swiperRef}
                        defaultIndex={activeIndex}
                        onIndexChange={swiperSwitch}
                    >
                        <Swiper.Item>
                            <div className="homeScrollWrapper" ref={homeScrollWrapperRef}>
                                <div className='artistHome' onClick={() => setTimeout(() => this.refreshBScroll(), 0)}>
                                    <div className="title">简介</div>
                                    <div className="briefDesc">
                                        <Ellipsis
                                            direction='end'
                                            rows={3}
                                            content={artistInfo?.artist_briefDesc}
                                            expandText='展开'
                                            collapseText='收起'
                                        />
                                    </div>
                                    <div className="others">
                                        {
                                            artistInfo?.artist_introduction.map(i => {
                                                return (
                                                    <div className="introItem" key={i.ti}>
                                                        <div className="title">{i.ti}</div>
                                                        <div className="desc">
                                                            <Ellipsis
                                                                direction='end'
                                                                rows={3}
                                                                content={i.txt}
                                                                expandText='展开'
                                                                collapseText='收起'
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </Swiper.Item>
                        <Swiper.Item>
                            <div className="albumScrollWrapper" ref={albumScrollWrapperRef}>
                                <div className='artistAlbum'>
                                    {
                                        artistAlbums.map(a => {
                                            return (
                                                <div className="albumItem" key={a.album_id} onClick={() => navigate(`/album/${a.album_id}`)}>
                                                    <div className="albumCover">
                                                        <img src={a.album_cover} />
                                                    </div>
                                                    <div className="albumDesc">
                                                        <div className="albumTop">
                                                            <div className="albumName">{a.album_name}</div>
                                                        </div>
                                                        <div className="albumBot">
                                                            <div className="albumPublishTime">
                                                                {dayjs(a.album_publishTime).format('YYYY-MM-DD')}
                                                            </div>
                                                            <div className="albumSize">{a.album_size}首</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </Swiper.Item>
                        <Swiper.Item>
                            <div className="mvScrollWrapper" ref={mvScrollWrapperRef}>
                                <div className='artistMV'>{
                                    artistMVs.map(mv => {
                                        return (
                                            <div className="mvItem" key={mv.mv_id} onClick={() => navigate(`/video/${mv.mv_id}`, { state: { type: 0 } })}>
                                                <div className="mvLeft">
                                                    <img src={mv.mv_cover} />
                                                    <div className="mvDuration">{playTimeFormat(Math.floor(mv.mv_duration / 1000))}</div>
                                                </div>
                                                <div className="mvRight">
                                                    <div className="mvTop">
                                                        <div className="mvName">{mv.mv_name}</div>
                                                    </div>
                                                    <div className="mvBot">
                                                        <span className="mvPublishTime">{mv.mv_publishTime}</span>
                                                        <span className="mvPlayCount">{longNumberConvert(mv.mv_playCount)}次播放</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }</div>
                            </div>
                        </Swiper.Item>
                    </Swiper>
                </div>
            </div>
        )
    }
}

export default withRouter(ArtistDetail)