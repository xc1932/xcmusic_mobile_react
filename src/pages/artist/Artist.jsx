import React, { Component, createRef } from 'react'
import BScroll from 'better-scroll'
import { Toast } from 'antd-mobile'
import { Trophy } from '@icon-park/react'
import withRouter from '@/utils/withRouter'
import { getTopArtist } from '@/api/artist'
import NavBar from '@/components/navbar/NavBar'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import './Artist.less'

class Artist extends Component {
  scrollWrapperRef = createRef()
  listBS = null
  state = {
    artistList: []
  }
  // 生命周期
  componentDidMount() {
    const { scrollWrapperRef } = this
    // 获取数据
    Toast.show({
      icon: 'loading',
      content: '加载中…',
      maskClickable: false,
      duration: 0
    })
    getTopArtist().then(taRes => {
      if (taRes.code === 200) {
        const artistList = taRes.artists.map(a => {
          return {
            artist_id: a.id,
            artist_name: a.name,
            artist_avatar: a.picUrl
          }
        })
        this.setState({ artistList }, () => {
          this.listBS.refresh()
        })
      }
    }).finally(() => {
      Toast.clear()
    })
    // 初始化BS
    this.listBS = new BScroll(scrollWrapperRef.current, {
      click: true
    })
  }
  render() {
    const { scrollWrapperRef } = this
    const { navigate } = this.props
    const { artistList } = this.state
    return (
      <div className='artistPage'>
        <div className="navbarArea">
          <NavBar fontColor='#000' title='热门歌手 - Top50'></NavBar>
        </div>
        <div className="scrollWrapper" ref={scrollWrapperRef}>
          <div className="scrollContent">
            {
              artistList.map((a, index) => {
                return (
                  <div className="artistItem" key={a.artist_id} onClick={() => navigate(`/artistdetail/${a.artist_id}`)}>
                    <div className="index">
                      {
                        index === 0 ? <Trophy theme="filled" size="24" fill="#FFD700" /> :
                          index === 1 ? <Trophy theme="filled" size="24" fill="#C0C0C0" /> :
                            index === 2 ? <Trophy theme="filled" size="24" fill="#B5A642" /> : index + 1
                      }
                    </div>
                    <div className="avatar">
                      <LazyLoadImage src={a.artist_avatar} effect="blur"/>
                    </div>
                    <div className="name">
                      {a.artist_name}
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Artist)
