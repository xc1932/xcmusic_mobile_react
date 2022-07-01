import React, { Component, createRef } from 'react'
import BScroll from 'better-scroll'
import withRouter from '@/utils/withRouter'
import { getToplistDetail } from '@/api/playlist'
import Loading from '@/components/loading/Loading'
import NavBar from '@/components/navbar/NavBar'
import RectangleToplistItem from '@/components/item/rectangle-toplist-item/RectangleToplistItem'
import './TopList.less'

class TopList extends Component {
    listWrapperRef = createRef()
    listBS = null
    state = {
        toplists: []
    }
    // 方法
    // 获取数据
    initData = () => {
        getToplistDetail().then(toplistRes => {
            if (toplistRes.code === 200) {
                const toplists = toplistRes.list.map(tl => {
                    return {
                        toplist_id: tl.id,
                        toplist_name: tl.name,
                        toplist_cover: tl.coverImgUrl,
                        toplist_updateFrequency: tl.updateFrequency,
                        toplist_tracks: tl.tracks.length > 0 ? tl.tracks : null
                    }
                })
                this.setState({ toplists }, () => {
                    this.listBS.refresh()
                })
            }
        })
    }
    // 生命周期
    componentDidMount() {
        const listWrapperDOM = this.listWrapperRef.current
        // 获取数据
        this.initData()
        // 初始化bs
        this.listBS = new BScroll(listWrapperDOM, {
            click: true
        })
    }
    componentDidUpdate() {
        this.listBS.refresh()
    }
    render() {
        const { listWrapperRef } = this
        const { navigate } = this.props
        const { toplists } = this.state
        return (
            <div className='toplistPage'>                
                <div className="navbarArea">
                    <NavBar fontColor='#000' bgColor='#fff' title='排行榜' />
                </div>
                <div className="listWrapper" ref={listWrapperRef}>
                    <div className="listContent">
                        <div className="recommondToplist" style={{ display: toplists.length === 0 ? 'none' : '' }}>推荐榜单</div>
                        {
                            toplists.map((tl, index) => {
                                if (tl.toplist_tracks !== null) {
                                    return (
                                        <RectangleToplistItem toplist={tl} key={index} />
                                    )
                                }
                            })
                        }
                        <div className="otherToplist" style={{ display: toplists.length === 0 ? 'none' : '' }}>其他榜单</div>
                        <div className="restToplist">
                            {
                                toplists.map((tl, index) => {
                                    if (tl.toplist_tracks == null) {
                                        return (
                                            <div className="simpleToplistItem" key={index} onClick={() => navigate(`/playlist/${tl.toplist_id}`)}>
                                                <img src={tl.toplist_cover} />
                                                <div className="updateFrequency">{tl.toplist_updateFrequency}</div>
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>
                </div>
                {toplists.length === 0 ? <Loading /> : ''}
            </div>
        )
    }
}
export default withRouter(TopList)