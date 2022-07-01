import request from './request'


// 获取歌手详情
// 说明 : 调用此接口 , 传入歌手 id, 可获得获取歌手详情
// 必选参数 : id: 歌手 id
// 接口地址 : /artist/detail
// 调用例子 : /artist/detail?id=11972054 (Billie Eilish)
export function getArtistDetail(params) {
    return request({
        url: '/artist/detail',
        method: 'get',
        params
    })
}

// 获取歌手描述
// 说明 : 调用此接口 , 传入歌手 id, 可获得歌手描述
// 必选参数 : id: 歌手 id
// 接口地址 : /artist/desc
// 调用例子 : /artist/desc?id=6452 ( 周杰伦 )
export function getArtistDesc(params) {
    return request({
        url: '/artist/desc',
        method: 'get',
        params
    })
}

// 获取歌手单曲
// 说明 : 调用此接口 , 传入歌手 id, 可获得歌手部分信息和热门歌曲
// 必选参数 : id: 歌手 id, 可由搜索接口获得
// 可选参数 : limit: 取出数量
// 接口地址 : /artists
// 调用例子 : /artists?id=6452
export function getArtistSingle(params) {
    return request({
        url: '/artists',
        method: 'get',
        params
    })
}

// 获取歌手专辑
// 说明 : 调用此接口 , 传入歌手 id, 可获得歌手专辑内容
// 必选参数 : id: 歌手 id
// 可选参数 : limit: 取出数量 , 默认为 50
// offset: 偏移数量,用于分页, 如:( 页数 -1)*50, 其中50为limit的值 , 默认为0
// 接口地址 : /artist/album
// 调用例子 : /artist/album?id=6452&limit=30 ( 周杰伦 )
export function getArtistAlbum(params) {
    return request({
        url: '/artist/album',
        method: 'get',
        params
    })
}

// 获取歌手 mv
// 说明 : 调用此接口 , 传入歌手 id, 可获得歌手 mv 信息 , 具体 mv 播放地址
// 可调用/mv传入此接口获得的 mvid 来拿到 , 如 : /artist/mv?id=6452,/mv?mvid=5461064
// 必选参数 : id: 歌手 id, 可由搜索接口获得
// 可选参数 : limit: 取出数量
// 接口地址 : /artist/mv
// 调用例子 : /artist/mv?id=6452
export function getArtistMV(params) {
    return request({
        url: '/artist/mv',
        method: 'get',
        params
    })
}

// 获取相似歌手
// 说明 : 调用此接口,传入歌手id,可获得相似歌手
// 必选参数 : id: 歌手id
// 可选参数 : limit: 取出数量 
// 接口地址 : /simi/artist
// 调用例子 : /simi/artist?id=6452(对应和周杰伦相似歌手)
export function getSimilarArtist(params) {
    return request({
        url: '/simi/artist',
        method: 'get',
        params
    })
}


// 获取歌手榜
// 说明 : 调用此接口 , 可获取排行榜中的歌手榜
// 可选参数 :
// type : 地区
// 1: 华语
// 2: 欧美
// 3: 韩国
// 4: 日本
// 接口地址 : /toplist/artist
// 调用例子 : /toplist/artist
export function getArtistToplist(params) {
    return request({
        url: '/toplist/artist',
        method: 'get',
        params
    })
}

// 获取热门歌手
// 热门歌手
// 说明 : 调用此接口 , 可获取热门歌手数据
// 可选参数 : limit: 取出数量 , 默认为 50
// offset: 偏移数量 , 用于分页 , 如 :( 页数 -1)*50, 其中 50 为 limit 的值 , 默认 为 0
// 接口地址 : /top/artists
// 调用例子 : /top/artists?offset=0&limit=30
export function getTopArtist(params) {
    return request({
        url: '/top/artists',
        method: 'get',
        params
    })
}