import React, { Component, createRef } from 'react'
import { Outlet } from 'react-router-dom'
import { Toast, DotLoading } from 'antd-mobile'
import BScroll from 'better-scroll'
import { getHotPlaylistCategories, getPlaylist } from '@/api/playlist'
import Loading from '@/components/loading/Loading'
import NavBar from '@/components/navbar/NavBar'
import RectanglePlaylistItem from '@/components/item/rectangle-playlist-item/RectanglePlaylistItem'
import './PlayList.less'

export default class PlayList extends Component {
    tabsWrapperRef = createRef()
    playlistWrapperRef = createRef()
    tabsBS = null
    playlistBS = null
    state = {
        categories: [],
        selectedTab: '',
        playlists: [],
        hasMore: false,
        isLoading: false
    }
    // methods
    // tab点击处理
    tabClickHandler = (selectedTab, index) => {
        this.setState({
            selectedTab,
            playlists: [],
            hasMore: false,
            isLoading: false
        })
        this.tabsBS.scrollToElement('.tab' + index, 300, true)
        this.getPlaylistOfCat(selectedTab)
    }
    // 获取对应分类的playlist数据
    getPlaylistOfCat = (cat, limit = 51, offset = 0) => {
        this.setState({ isLoading: true })
        getPlaylist({
            cat,
            limit,
            offset
        }).then(playlistRes => {
            if (playlistRes.code === 200) {
                const { playlists } = this.state
                const newPlaylist = playlistRes.playlists.map(pl => {
                    return {
                        playlist_id: pl.id,
                        playlist_name: pl.name,
                        playlist_cover: pl.coverImgUrl,
                        playlist_playCount: pl.playCount
                    }
                })
                this.setState({
                    playlists: [...playlists, ...newPlaylist],
                    hasMore: playlistRes.more,
                    isLoading: false
                }, () => {
                    this.playlistBS.finishPullUp()
                    this.playlistBS.refresh()
                })
            }
        })
    }
    // 上来加载更多数据
    pullingUpHandler = () => {
        const { selectedTab, playlists, hasMore, isLoading } = this.state
        if (!hasMore) {
            if (!isLoading) {
                Toast.show({
                    content: '没有更多了 ^v^ ~'
                })
            }
            return
        }
        const offset = Math.floor(playlists.length / 51)
        this.getPlaylistOfCat(selectedTab, 51, offset)
    }
    // lifecycle
    componentDidMount() {
        const tabsWrapperDOM = this.tabsWrapperRef.current
        const playlistWrapperDOM = this.playlistWrapperRef.current
        // 获取分类数据
        getHotPlaylistCategories().then(cateRes => {
            if (cateRes.code === 200) {
                const categories = cateRes.tags.map(tag => tag.name)
                const selectedTab = categories[0]
                this.setState({ categories, selectedTab }, () => {
                    this.tabsBS.refresh()
                })
                this.getPlaylistOfCat(selectedTab)
            }
        })
        // 初始化bs
        this.tabsBS = new BScroll(tabsWrapperDOM, {
            scrollX: true,
            click: true
        })
        this.playlistBS = new BScroll(playlistWrapperDOM, {
            scrollY: true,
            click: true,
            pullUpLoad: true
        })
        this.playlistBS.on('pullingUp', this.pullingUpHandler)
    }
    componentDidUpdate() {
        this.playlistBS.refresh()
    }
    render() {
        const { tabsWrapperRef, playlistWrapperRef, tabClickHandler } = this
        const { categories, selectedTab, playlists, isLoading } = this.state
        const groupingPlaylists = []
        playlists.forEach((pl, index) => {
            const groupIndex = Math.floor(index / 3)
            if (index % 3 === 0) {
                groupingPlaylists.push([pl])
            } else {
                groupingPlaylists[groupIndex].push(pl)
            }
        })
        return (
            <div className='playlistPage'>
                <div className="navbarArea">
                    <NavBar title='歌单广场' fontColor='#000' bgColor='#fff'></NavBar>
                </div>
                <div className="tabsArea">
                    <div className="tabsWrapper" ref={tabsWrapperRef}>
                        <div className="tabsContent">
                            {
                                categories.map((cate, index) =>
                                    <div
                                        className={`cateTagItem tab${index} ${(selectedTab === cate ? "selectedTab" : '')}`}
                                        key={index}
                                        onClick={() => tabClickHandler(cate, index)}>
                                        {cate}
                                    </div>)
                            }
                        </div>
                    </div>
                </div>
                <div className="playlistWrapper" ref={playlistWrapperRef}>
                    <div className="playlistContent">
                        {
                            groupingPlaylists.map((group, index) => (
                                <div className="playlistGroup" key={index}>
                                    {
                                        group.map(pl => <RectanglePlaylistItem key={pl.playlist_id} playlist={pl} />)
                                    }
                                </div>
                            ))
                        }
                        {
                            isLoading ?
                                <div className='loading'>
                                    加载中<DotLoading />
                                </div>
                                : ''
                        }
                    </div>
                </div>
                {categories.length === 0 ? <Loading /> : ''}
                <Outlet />
            </div>
        )
    }
}
