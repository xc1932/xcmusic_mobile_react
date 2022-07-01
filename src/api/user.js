import request from './request'

// 1.1获取用户信息
// 说明 : 登录后调用此接口 , 传入用户 id, 可以获取用户详情
// 必选参数 : uid : 用户 id
// 接口地址 : /user/detail
// 调用例子 : /user/detail?uid=32953014
export function getUserInfo(params) {
    return request({
        url: '/user/detail',
        method: 'get',
        params
    })
}

// 1.2获取用户账号信息
// 获取账号信息
// 说明 : 登录后调用此接口 ,可获取用户账号信息
// 接口地址 : /user/account
// 调用例子 : /user/account
export function getUserAccountInfo() {
    return request({
        url: '/user/account',
        method: 'get'
    })
}

// 1.3获取用户等级信息
// 说明 : 登录后调用此接口 , 可以获取用户等级信息,包含当前登录天数,听歌次数,
// 下一等级需要的登录天数和听歌次数,当前等级进度,对应 https://music.163.com/#/user/level
// 接口地址 : /user/level
// 调用例子 : /user/level
export function getUserLevelInfo() {
    return request({
        url: '/user/level',
        method: 'get',
    })
}

// 1.4获取用户信息 , 歌单，收藏，mv, dj 数量
// 说明 : 登录后调用此接口 , 可以获取用户信息
// 接口地址 : /user/subcount
// 调用例子 : /user/subcount
export function getUserInfoAndCollection() {
    return request({
        url: '/user/subcount',
        method: 'get',
    })
}

// 2.1新建用户歌单 
// 必选参数 : name : 歌单名
// 可选参数 :
// privacy : 是否设置为隐私歌单，默认否，传'10'则设置成隐私歌单
// type : 歌单类型,默认'NORMAL',传 'VIDEO'则为视频歌单,传 'SHARED'则为共享歌单
// 接口地址 : /playlist/create
// 调用例子 : /playlist/create?name=测试歌单,/playlist/create?name=test&type=VIDEO
export function createUserPlaylist(params) {
    return request({
        url: '/playlist/create',
        method: 'post',
        params
    })
}

// 2.2删除用户歌单
// 说明 : 调用此接口 , 传入歌单 id 可删除歌单
// 必选参数 : id : 歌单 id,可多个,用逗号隔开
// 接口地址 : /playlist/delete
// 调用例子 : /playlist/delete?id=2947311456 , /playlist/delete?id=5013464397,5013427772
export function deleteUserPlaylist(params) {
    return request({
        url: '/playlist/delete',
        method: 'post',
        params
    })
}

// 2.3获取用户歌单
// 说明 : 登录后调用此接口 , 传入用户 id, 可以获取用户歌单
// 必选参数 : uid : 用户 id
// 可选参数 :
// limit : 返回数量 , 默认为 30
// offset : 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
// 接口地址 : /user/playlist
// 调用例子 : /user/playlist?uid=32953014
export function getUserPlaylist(params) {
    return request({
        url: '/user/playlist',
        method: 'get',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 2.4对用户歌单添加或删除歌曲
// 必选参数 :
// op: 从歌单增加单曲为 add, 删除为 del
// pid: 歌单id tracks: 歌曲 id,可多个,用逗号隔开
// 接口地址 : /playlist/tracks
// 调用例子 : /playlist/tracks?op=add&pid=24381616&tracks=347231
export function updateUserPlaylist(params) {
    return request({
        url: '/playlist/tracks',
        method: 'post',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 3获取用户收藏专辑列表
// 说明 : 调用此接口 , 可获得已收藏专辑列表
// 可选参数 :
// limit: 取出数量 , 默认为 25
// offset: 偏移数量 , 用于分页 , 如 :( 页数 -1)*25, 其中 25 为 limit 的值 , 默认 为 0
// 接口地址 : /album/sublist
// 调用例子 : /album/sublist ( 周杰伦 )
export function getUserAlbums(params) {
    return request({
        method: 'get',
        url: '/album/sublist',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 4获取用户收藏的歌手列表
// 说明 : 调用此接口,可获取收藏的歌手列表
// 接口地址 : /artist/sublist
// 调用例子 : /artist/sublist
export function getUserArtists(params) {
    return request({
        method: 'get',
        url: '/artist/sublist',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 5获取用户收藏的MV列表
// 说明 : 调用此接口,可获取收藏的 MV 列表
// 接口地址 : /mv/sublist
// 调用例子 : /mv/sublist
export function getUserMVs(params) {
    return request({
        method: 'get',
        url: '/mv/sublist',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 6.1获取用户喜欢的音乐列表  
// 必选参数:uid(用户id)
// 接口地址:/likelist
// 调用示例:/likelist?uid=32953014
export function getLikeList(params) {
    return request({
        url: '/likelist',
        method: 'get',
        params: {
            ...params,
            timestamp: new Date().getTime()
        },
    })
}

// 6.2喜欢或取消喜欢音乐
// 必选参数 : id: 歌曲 id
// 可选参数 : like: 布尔值 , 默认为 true 即喜欢 , 若传 false, 则取消喜欢
// 接口地址 : /like
// 调用例子 : /like?id=347230
export function likeSong(params) {
    return request({
        method: 'post',
        url: '/like',
        params: {
            ...params,
            timestamp: new Date().getTime()
        },
    })
}