import React, { Component, createRef } from 'react'
import { Outlet } from 'react-router-dom'
import BScroll from 'better-scroll'
import { Tabs, Swiper, Toast, DotLoading } from 'antd-mobile'
import withRouter from '@/utils/withRouter'
import { getNewDisc } from '@/api/album'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Loading from '@/components/loading/Loading'
import NavBar from '@/components/navbar/NavBar'
import './Album.less'

const tabItems = [
  { key: 'ALL', title: '全部' },
  { key: 'ZH', title: '华语' },
  { key: 'EA', title: '欧美' },
  { key: 'KR', title: '韩国' },
  { key: 'JP', title: '日本' },
]
class Album extends Component {
  swiperRef = createRef()
  allWrapperRef = createRef()
  zhWrapperRef = createRef()
  eaWrapperRef = createRef()
  krWrapperRef = createRef()
  jpWrapperRef = createRef()
  allWrapperBS = null
  zhWrapperBS = null
  eaWrapperBS = null
  krWrapperBS = null
  jpWrapperBS = null
  state = {
    activeIndex: 0,
    selectedTab: 'ALL',
    ALL: [],
    ZH: [],
    EA: [],
    KR: [],
    JP: [],
    isLoading: false
  }
  // 方法
  // tab切换
  tabSwitch = (key) => {
    const activeIndex = tabItems.findIndex(item => item.key === key)
    this.setState({ activeIndex, selectedTab: tabItems[activeIndex].key })
    this.swiperRef.current.swipeTo(activeIndex)
  }
  // swiper切换
  swiperSwitch = (activeIndex) => {
    this.setState({ activeIndex, selectedTab: tabItems[activeIndex].key })
  }
  // 刷新BS
  refreshBS = () => {
    const { allWrapperBS, zhWrapperBS, eaWrapperBS, krWrapperBS, jpWrapperBS } = this
    allWrapperBS.refresh()
    zhWrapperBS.refresh()
    eaWrapperBS.refresh()
    krWrapperBS.refresh()
    jpWrapperBS.refresh()
  }
  // 结束pullup
  finishPullup = () => {
    const { allWrapperBS, zhWrapperBS, eaWrapperBS, krWrapperBS, jpWrapperBS } = this
    allWrapperBS.finishPullUp()
    zhWrapperBS.finishPullUp()
    eaWrapperBS.finishPullUp()
    krWrapperBS.finishPullUp()
    jpWrapperBS.finishPullUp()
  }
  // 获取数据
  getData = (area) => {
    const { refreshBS } = this
    const stateObj = this.state
    const limit = 21
    if (stateObj[area].length > 500) {
      Toast.show({
        content: '没有更多了 ^v^ ~',
        maskClickable: false
      })
      this.finishPullup()
      return
    }
    const offset = Math.floor(stateObj[area].length / limit) * limit
    this.setState({ isLoading: true })
    getNewDisc({ area, limit, offset }).then(albumsRes => {
      if (albumsRes.code === 200) {
        const newAlbums = albumsRes.albums.map(a => {
          return {
            album_id: a.id,
            album_name: a.name,
            album_cover: a.picUrl
          }
        })
        this.setState({ [area]: [...stateObj[area], ...newAlbums] }, () => {
          refreshBS()
        })
        this.setState({ isLoading: false })
      }
    }).finally(() => {
      this.finishPullup()
    })
  }
  // 初始化数据
  initData = () => {
    this.getData('ALL')
    this.getData('ZH')
    this.getData('EA')
    this.getData('KR')
    this.getData('JP')
  }
  // 生命周期
  componentDidMount() {
    const { allWrapperRef, zhWrapperRef, eaWrapperRef, krWrapperRef, jpWrapperRef, getData } = this
    // 初始化bs
    this.allWrapperBS = new BScroll(allWrapperRef.current, {
      click: true,
      pullUpLoad: true
    }).on('pullingUp', () => getData('ALL'))
    this.zhWrapperBS = new BScroll(zhWrapperRef.current, {
      click: true,
      pullUpLoad: true
    }).on('pullingUp', () => getData('ZH'))
    this.eaWrapperBS = new BScroll(eaWrapperRef.current, {
      click: true,
      pullUpLoad: true
    }).on('pullingUp', () => getData('EA'))
    this.krWrapperBS = new BScroll(krWrapperRef.current, {
      click: true,
      pullUpLoad: true
    }).on('pullingUp', () => getData('KR'))
    this.jpWrapperBS = new BScroll(jpWrapperRef.current, {
      click: true,
      pullUpLoad: true
    }).on('pullingUp', () => getData('JP'))
    // 获取数据
    this.initData()
  }
  componentDidUpdate() {
    this.refreshBS()
  }
  render() {
    const { swiperRef, allWrapperRef, zhWrapperRef, eaWrapperRef, krWrapperRef, jpWrapperRef, tabSwitch, swiperSwitch } = this
    const { navigate } = this.props
    const { activeIndex, ALL, ZH, EA, KR, JP, isLoading } = this.state
    return (
      <div className='albumPage'>
        <div className="navbarArea">
          <NavBar title='新专速递' fontColor='#000' bgColor='#fff'></NavBar>
        </div>
        <div className="tabsArea">
          <Tabs
            activeKey={tabItems[activeIndex].key}
            onChange={tabSwitch}
          >
            {tabItems.map(item => (
              <Tabs.Tab title={item.title} key={item.key} />
            ))}
          </Tabs>
        </div>
        <div className="swiperArea">
          <Swiper
            ref={swiperRef}
            loop
            direction='horizontal'
            indicator={() => null}
            defaultIndex={activeIndex}
            style={{ '--height': '100%' }}
            onIndexChange={swiperSwitch}
          >
            <Swiper.Item key='ALL'>
              <div className='allListWrapper' ref={allWrapperRef}>
                <div className="allListContent">
                  {
                    ALL.map((a, index) => {
                      return (
                        <div className="albumItem" key={index} onClick={() => navigate(`${a.album_id}`)}>
                          <div className="albumCover">
                            <LazyLoadImage src={a.album_cover} effect="blur" />
                          </div>
                          <div className="albumTitle">
                            {a.album_name}
                          </div>
                        </div>
                      )
                    })
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
            </Swiper.Item>
            <Swiper.Item key='ZH'>
              <div className='zhListWrapper' ref={zhWrapperRef}>
                <div className="zhListContent">
                  {
                    ZH.map((a, index) => {
                      return (
                        <div className="albumItem" key={index} onClick={() => navigate(`${a.album_id}`)}>
                          <div className="albumCover">
                            <LazyLoadImage src={a.album_cover} effect="blur" />
                          </div>
                          <div className="albumTitle">
                            {a.album_name}
                          </div>
                        </div>
                      )
                    })
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
            </Swiper.Item>
            <Swiper.Item key='EA'>
              <div className='eaListWrapper' ref={eaWrapperRef}>
                <div className="eaListContent">
                  {
                    EA.map((a, index) => {
                      return (
                        <div className="albumItem" key={index} onClick={() => navigate(`${a.album_id}`)}>
                          <div className="albumCover">
                            <LazyLoadImage src={a.album_cover} effect="blur" />
                          </div>
                          <div className="albumTitle">
                            {a.album_name}
                          </div>
                        </div>
                      )
                    })
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
            </Swiper.Item>
            <Swiper.Item key='KR'>
              <div className='krListWrapper' ref={krWrapperRef}>
                <div className="krListContent">
                  {
                    KR.map((a, index) => {
                      return (
                        <div className="albumItem" key={index} onClick={() => navigate(`${a.album_id}`)}>
                          <div className="albumCover">
                            <LazyLoadImage src={a.album_cover} effect="blur" />
                          </div>
                          <div className="albumTitle">
                            {a.album_name}
                          </div>
                        </div>
                      )
                    })
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
            </Swiper.Item>
            <Swiper.Item key='JP'>
              <div className='jpListWrapper' ref={jpWrapperRef}>
                <div className="jpListContent">
                  {
                    JP.map((a, index) => {
                      return (
                        <div className="albumItem" key={index} onClick={() => navigate(`${a.album_id}`)}>
                          <div className="albumCover">
                            <LazyLoadImage src={a.album_cover} effect="blur" />
                          </div>
                          <div className="albumTitle">
                            {a.album_name}
                          </div>
                        </div>
                      )
                    })
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
            </Swiper.Item>
          </Swiper>
        </div>
        {ALL.length === 0 ? <Loading /> : ''}
        <Outlet />
      </div>
    )
  }
}

export default withRouter(Album)
