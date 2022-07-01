import React, { Component, createRef } from 'react'
import _ from 'lodash'
import dayjs from 'dayjs'
import BScroll from 'better-scroll'
import { SearchBar, DotLoading } from 'antd-mobile'
import { ArrowLeft, DeleteFive, Down, Up, Fire, Search } from '@icon-park/react'
import { getSearchResult, getSearchSuggest, getDefaultSearchKeywords } from '@/api/search'
import withRouter from '@/utils/withRouter'
import { getTextWidth, longNumberConvert } from '@/utils/common'
import CommonItem from '@/components/item/common-item/CommonItem'
import { getHotSearchList } from '../../api/search'
import './Search.less'

class SearchView extends Component {
  searchRef = createRef()
  scrollWrapperRef = createRef()
  listBS = null
  state = {
    value: '',
    defaultSearchKeywords: '请输入内容',
    searchSuggest: [],
    historyKeywords: [],
    showMoreHistoryKeywords: false,
    recommendKeywords: [],
    playlists: [],
    albums: [],
    mvs: [],
    artists: [],
    showType: 0
  }
  // 样式
  // 搜索栏样式
  searchBarStyle = {
    '--border-radius': '100px',
    '--background': '#eee',
    '--height': '32px',
    '--padding-left': '12px',
  }
  // 方法
  // 计算应该展示的标签
  computedShowKeywords = (keywordsArr, fontSize, containerWidth) => {
    // marginWidth+paddingWidth
    const nonTextWidth = 5 + 10 * 2
    const textWidthArr = keywordsArr.map(t => getTextWidth(t, fontSize) + nonTextWidth)
    let widthSum = 37 //37是more按钮的 marginWidth+paddingWidth
    return keywordsArr.filter((k, i) => {
      widthSum += textWidthArr[i]
      return widthSum < containerWidth
    })
  }
  // 搜索事件
  searchHandler = () => {
    const searchDOM = this.searchRef.current
    const searchValue = searchDOM.nativeElement.value.trim()
    if (searchValue === '') return
    // 获取搜索结果
    this.setState({ showType: 2 })
    const task1 = getSearchResult({ keywords: searchValue, limit: 21, type: 1000 })
    const task2 = getSearchResult({ keywords: searchValue, limit: 21, type: 10 })
    const task3 = getSearchResult({ keywords: searchValue, limit: 20, type: 1004 })
    const task4 = getSearchResult({ keywords: searchValue, limit: 21, type: 100 })
    Promise.all([task1, task2, task3, task4]).then(allRes => {
      const playlists = allRes[0].result.playlists.map(p => {
        return {
          playlist_id: p.id,
          playlist_name: p.name,
          playlist_cover: p.coverImgUrl,
          playlist_playCount: p.playCount,
        }
      })
      const albums = allRes[1].result.albums.map(a => {
        return {
          album_id: a.id,
          album_name: a.name,
          album_cover: a.picUrl,
          album_publishTime: a.publishTime,
        }
      })
      const mvs = allRes[2].result.mvs.map(mv => {
        return {
          mv_id: mv.id,
          mv_name: mv.name,
          mv_cover: mv.cover,
          mv_playCount: mv.playCount,
        }
      })
      const artists = allRes[3].result.artists.map(a => {
        return {
          artist_id: a.id,
          artist_name: a.name,
          artist_avatar: a.picUrl,
        }
      })
      this.setState({ playlists, albums, mvs, artists })
    })
    // 存储搜索记录
    const historyKeywords = JSON.parse(localStorage.getItem('Search_Keywords')) || []
    if (!historyKeywords.includes(searchValue)) {
      const newHistoryKeywords = [...historyKeywords, searchValue]
      localStorage.setItem('Search_Keywords', JSON.stringify(newHistoryKeywords))
      this.setState({ historyKeywords: newHistoryKeywords })
    }
  }
  // 获取搜索建议(节流)
  getSearchSuggest = _.throttle((value) => {
    getSearchSuggest({ keywords: value, type: 'mobile' }).then(res => {
      if (res.code === 200) {
        const searchSuggest = res.result.allMatch.map(s => s.keyword)
        this.setState({ searchSuggest, showType: 1 })
      }
    })
  }, 500)
  // 输入事件
  changeHandler = (value) => {
    this.setState({ value })
    if (value.trim() === '') {
      this.setState({ searchSuggest: [], showType: 0 })
      return
    }
    this.getSearchSuggest(value)
  }
  // 清除事件
  clearHandler = () => {
  }
  // 失去焦点事件
  blurHandler = () => {
  }
  // 删除搜索记录
  deleteHistorySearch = () => {
    localStorage.setItem('Search_Keywords', JSON.stringify([]))
    this.setState({ historyKeywords: [] })
  }
  // 将标签内容添加到搜索框中 
  addToSearchBar = (tag) => {
    this.setState({ value: tag }, () => this.searchHandler())
  }
  // 初始化数据
  initData = () => {
    // 获取默认搜索关键词
    getDefaultSearchKeywords().then(res => {
      if (res.code === 200) {
        const defaultSearchKeywords = res.data.showKeyword
        this.setState({ defaultSearchKeywords })
      }
    })
    // 获取热搜关键词
    getHotSearchList().then(res => {
      if (res.code === 200) {
        const recommendKeywords = res.result.hots.map(h => h.first)
        this.setState({ recommendKeywords })
      }
    })
    // 获取搜索历史记录
    const historyKeywords = JSON.parse(localStorage.getItem('Search_Keywords')) || []
    this.setState({ historyKeywords })
  }
  // 生命周期
  componentDidMount() {
    const { scrollWrapperRef } = this
    // 初始化数据
    this.initData()
    // 初始化BS
    this.listBS = new BScroll(scrollWrapperRef.current, {
      click: true
    })
    this.listBS.refresh()
  }
  componentDidUpdate() {
    this.listBS.refresh()
  }
  render() {
    const {
      searchRef,
      scrollWrapperRef,
      searchBarStyle,
      computedShowKeywords,
      searchHandler,
      changeHandler,
      clearHandler,
      blurHandler,
      deleteHistorySearch,
      addToSearchBar
    } = this
    const { navigate } = this.props
    const {
      value,
      defaultSearchKeywords,
      searchSuggest,
      historyKeywords,
      showMoreHistoryKeywords,
      recommendKeywords,
      showType,
      playlists,
      albums,
      mvs,
      artists
    } = this.state
    const hasMoreHistoryKeywords = computedShowKeywords(historyKeywords, 12, 345).length < historyKeywords.length
    const finalHistoryKeywords = showMoreHistoryKeywords ? historyKeywords : computedShowKeywords(historyKeywords, 12, 345)
    return (
      <div className='searchPage'>
        <div className="searchArea">
          <div className="back" onClick={() => navigate(-1)}>
            <ArrowLeft theme="filled" size="24" fill="#31c27c" />
          </div>
          <SearchBar
            ref={searchRef}
            placeholder={defaultSearchKeywords}
            maxLength={100}
            style={searchBarStyle}
            onChange={(value) => changeHandler(value)}
            onSearch={() => searchHandler()}
            onClear={() => clearHandler()}
            onBlur={() => blurHandler()}
            value={value}
          />
          <div className="searchBtn" onClick={() => searchHandler()}>
            搜索
          </div>
        </div>
        <div className="scrollWrapper" ref={scrollWrapperRef}>
          <div className="scrollContent">
            <div className="defaultArea" style={{ display: showType === 0 ? '' : 'none' }}>
              <div className="hotSearchArea">
                <div className="header">
                  <div className="title">热搜<Fire theme="filled" size="20" fill="#e00" /></div>
                </div>
                <div className="hotSearchShow">
                  {
                    recommendKeywords.map((k, index) => <span className='tag' key={index} onClick={() => addToSearchBar(k)}>{k}</span>)
                  }
                  {
                    recommendKeywords.length === 0 ? < DotLoading /> : ''
                  }
                </div>
              </div>
              <div className="historyArea" style={{ display: finalHistoryKeywords.length === 0 ? 'none' : '' }}>
                <div className="header">
                  <div className="title">历史</div>
                  <div className="delete" onClick={() => deleteHistorySearch()}>
                    <DeleteFive theme="filled" size="20" fill="#666" />
                  </div>
                </div>
                <div className="historyShow">
                  {
                    finalHistoryKeywords.map((k, index) => <span className='tag' key={index} onClick={() => addToSearchBar(k)}>{k}</span>)
                  }
                  {
                    !hasMoreHistoryKeywords ? '' :
                      <span className="more">
                        {
                          showMoreHistoryKeywords ?
                            <Up
                              theme="filled"
                              size="12"
                              fill="#999"
                              onClick={() => this.setState({ showMoreHistoryKeywords: false })} /> :
                            <Down
                              theme="filled"
                              size="12"
                              fill="#999"
                              onClick={() => this.setState({ showMoreHistoryKeywords: true })} />
                        }
                      </span>
                  }
                </div>
              </div>
            </div>
            <div className="suggestArea" style={{ display: showType === 1 ? '' : 'none' }}>
              {
                searchSuggest.map((s, index) =>
                  <div className='suggestItem' key={index} onClick={() => addToSearchBar(s)}>
                    <div className="searchIcon">
                      <Search theme="outline" size="18" fill="#999" />
                    </div>
                    <div className="content">{s}</div>
                  </div>)
              }
            </div>
            <div className="resultArea" style={{ display: showType === 2 ? '' : 'none' }}>
              {
                playlists.length === 0 && albums.length === 0 && mvs.length === 0 && artists.length === 0 ?
                  <div className="loading">
                    <DotLoading />
                  </div> :
                  <div className="resultContent">
                    <div className="playlistContent">
                      <div className="header">歌单</div>
                      <div className="playlistList">
                        {
                          playlists.map(p =>
                            <CommonItem
                              key={p.playlist_id}
                              width='120px'
                              height='120px'
                              id={p.playlist_id}
                              coverUrl={p.playlist_cover}
                              playCount={longNumberConvert(p.playlist_playCount)}
                              name={p.playlist_name}
                              clickHandler={() => navigate(`/playlist/${p.playlist_id}`)}
                            />
                          )
                        }
                      </div>
                    </div>
                    <div className="albumContent">
                      <div className="header">专辑</div>
                      <div className="albumList">
                        {
                          albums.map(a =>
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
                    <div className="artistContent">
                      <div className="header">歌手</div>
                      <div className="artistList">
                        {
                          artists.map(a =>
                            <CommonItem
                              key={a.artist_id}
                              width='120px'
                              height='120px'
                              id={a.artist_id}
                              coverUrl={a.artist_avatar}
                              name={a.artist_name}
                              borderRadius="50%"
                              textAlign='center'
                              clickHandler={() => navigate(`/artistdetail/${a.artist_id}`)}
                            />)
                        }
                      </div>
                    </div>
                    <div className="mvContent">
                      <div className="header">MV</div>
                      <div className="mvList">
                        {
                          mvs.map(mv =>
                            <CommonItem
                              key={mv.mv_id}
                              width='180px'
                              height='100px'
                              id={mv.mv_id}
                              coverUrl={mv.mv_cover}
                              playCount={longNumberConvert(mv.mv_playCount)}
                              name={mv.mv_name}
                              clickHandler={() => navigate(`/video/${mv.mv_id}`, { state: { type: 0 } })}
                            />)
                        }
                      </div>
                    </div>
                  </div>
              }
            </div>
          </div>
        </div>
      </div >
    )
  }
}
export default withRouter(SearchView)