import React, { Component } from 'react'
import { Swiper, Image, Toast } from 'antd-mobile'
import withRouter from '@/utils/withRouter'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import './Banner.less'

import { getBanner } from '@/api/common'

class Banner extends Component {
    state = {
        bannerArr: []
    }

    componentDidMount() {
        // 获取轮播图数据
        this.getBannerData()
    }

    // methods
    // 1.获取轮播图数据
    getBannerData = () => {
        // targetType:
        // 1：单曲(tragetId)
        // 10:专辑(tragetId)
        // 1000：歌单(tragetId)
        // 1004: MV(targetId)
        // 3000：专题,直接跳转(url)
        // 获取轮播图数据
        getBanner().then(bannerRes => {
            if (bannerRes.code === 200) {
                const bannerArr = bannerRes.banners.map(banner => ({
                    imageUrl: banner.imageUrl,
                    targetType: banner.targetType,
                    targetId: banner.targetId,
                    url: banner.url,
                    titleColor: banner.titleColor,
                    typeTitle: banner.typeTitle
                }))
                this.setState({ bannerArr })
            }
        }, () => {
            Toast.show({
                content: '获取轮播图数据失败',
                maskClickable: false
            })
        })
    }

    // 2.页面跳转
    toPage = (banner) => {
        const { navigate } = this.props
        const { targetType, targetId, url } = banner
        switch (targetType) {
            case 1: return
            case 10: navigate(`/album/${targetId}`); return
            case 1000: navigate(`/playlist/${targetId}`); return
            case 1004: navigate(`/video/${targetId}`, { state: { type: 0 } }); return
            case 3000: window.location.href = url; return
        }
    }

    render() {
        const { toPage } = this
        const { bannerArr } = this.state
        return (
            <div className='banner'>
                {
                    bannerArr.length > 0 ? <Swiper
                        autoplay
                        loop>
                        {
                            bannerArr.map((banner, index) => {
                                return (
                                    <Swiper.Item key={index} onClick={() => toPage(banner)}>
                                        <div className="bannerItem">
                                            <LazyLoadImage effect="blur" src={banner.imageUrl}/>
                                            <div
                                                className="banner-title"
                                                style={{ backgroundColor: banner.titleColor }}
                                            >
                                                {banner.typeTitle}
                                            </div>
                                        </div>
                                    </Swiper.Item>
                                )
                            })
                        }
                    </Swiper> : ''
                }
            </div>
        )
    }
}
export default withRouter(Banner)