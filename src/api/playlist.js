import request from './request'

// 1.1获取歌单分类
// 说明 : 调用此接口,可获取歌单分类,包含 category 信息
// 接口地址 : /playlist/catlist
// 调用例子 : /playlist/catlist
export function getPlaylistCategories() {
    return request({
        url: '/playlist/catlist',
        methods: 'get'
    })
}
// 1.2获取热门歌单分类
// 热门歌单分类
// 说明 : 调用此接口,可获取歌单分类,包含 category 信息
// 接口地址 : /playlist/hot
// 调用例子 : /playlist/hot
export function getHotPlaylistCategories() {
    return request({
        url: '/playlist/hot',
        methods: 'get'
    })
}
// 1.3获取歌单 ( 网友精选碟 )
// 说明 : 调用此接口 , 可获取网友精选碟歌单
// 可选参数 : order: 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
// cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从歌单分类接口获取(/playlist/catlist)
// limit: 取出歌单数量 , 默认为 50
// offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
// 接口地址 : /top/playlist
// 调用例子 : /top/playlist?limit=10&order=new
export function getPlaylist(params) {
    return request({
        url: '/top/playlist',
        method: 'get',
        params
    })
}
// 2.1获取精品歌单标签列表
// 说明 : 调用此接口 , 2.1获取可获取精品歌单标签列表
// 接口地址 : /playlist/highquality/tags
// 调用例子 : /playlist/highquality/tags
export function getHighQualityPlaylistTags() {
    return request({
        url: '/playlist/highquality/tags',
        method: 'get'
    })
}

// 2.2获取精品歌单
// 说明 : 调用此接口 , 可获取精品歌单
// 可选参数 : cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ",
// 默认为 "全部",可从精品歌单标签列表接口获取(/playlist/highquality/tags)
// limit: 取出歌单数量 , 默认为 20
// before: 分页参数,取上一页最后一个歌单的 updateTime 获取下一页数据
// 接口地址 : /top/playlist/highquality
// 调用例子 : /top/playlist/highquality?before=1503639064232&limit=3
export function getgetHighQualityPlaylist(params) {
    return request({
        url: '/top/playlist/highquality',
        method: 'get', params
    })
}

// 3.1获取歌单详情 
// 说明 : 歌单能看到歌单名字, 但看不到具体歌单内容 , 调用此接口 , 传入歌单 id,
// 可以获取对应歌单内的所有的音乐(未登录状态只能获取不完整的歌单,登录后是完整的)，
// 但是返回的 trackIds 是完整的，tracks 则是不完整的，可拿全部 trackIds 请求一
// 次 song/detail 接口获取所有歌曲的详情 
// 必选参数 : id : 歌单 id
// 可选参数 : s : 歌单最近的 s 个收藏者,默认为 8
// 接口地址 : /playlist/detail
// 调用例子 : /playlist/detail?id=24381616
export function getPlaylistDetail(params) {
    return request({
        url: '/playlist/detail',
        method: 'get',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 3.2
// 歌单详情动态
// 说明 : 调用后可获取歌单详情动态部分,如评论数,是否收藏,播放数
// 必选参数 : id : 歌单 id
// 接口地址 : /playlist/detail/dynamic
// 调用例子 : /playlist/detail/dynamic?id=24381616
export function getPlaylistDetailDynamic(params) {
    return request({
        url: '/playlist/detail/dynamic',
        method: 'get',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 3.3获取歌单所有歌曲
// 说明 : 由于网易云接口限制，歌单详情只会提供 10 首歌，通过调用此接口，
// 传入对应的歌单id，即可获得对应的所有歌曲
// 必选参数 : id : 歌单 id
// 可选参数 : limit : 限制获取歌曲的数量，默认值为当前歌单的歌曲数量
// 可选参数 : offset : 默认值为0
// 接口地址 : /playlist/track/all
// 调用例子 : /playlist/track/all?id=24381616&limit=10&offset=1
export function getPlaylistAllSongs(params) {
    return request({
        url: '/playlist/track/all',
        method: 'get',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 4.1.获取推荐歌单
// 说明 : 调用此接口 , 可获取推荐歌单
// 可选参数 : limit: 取出数量 , 默认为 30 (不支持 offset)
// 接口地址 : /personalized
// 调用例子 : /personalized?limit=1
export function getRecommendSonglist(params) {
    return request({
        url: '/personalized',
        methods: 'get',
        params
    })
}

// 4.2.获取每日推荐歌单
// 说明 : 调用此接口 , 可获得每日推荐歌单 ( 需要登录 )
// 接口地址 : /recommend/resource
// 调用例子 : /recommend/resource
export function getDailyRecommendList() {
    return request({
        url: '/recommend/resource',
        methods: 'get',
    })
}

// 5.1.获取所有榜单
// 说明 : 调用此接口,可获取所有榜单 接口地址 : /toplist
// 调用例子 : /toplist
export function getTopList() {
    return request({
        url: '/toplist',
        methods: 'get',
    })
}

// 5.2所有榜单内容摘要
// 说明 : 调用此接口,可获取所有榜单内容摘要
// 接口地址 : /toplist/detail
// 调用例子 : /toplist/detail
export function getToplistDetail() {
    return request({
        url: '/toplist/detail',
        methods: 'get',
    })
}