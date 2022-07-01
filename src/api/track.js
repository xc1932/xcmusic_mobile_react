import request from './request'

// 获取歌曲详情
// 说明 : 调用此接口 , 传入音乐 id(支持多个 id, 用 , 隔开), 可获得歌曲详情(dt为歌曲时长)
// 必选参数 : ids: 音乐 id, 如 ids=347230
// 接口地址 : /song/detail
// 调用例子 : /song/detail?ids=347230,/song/detail?ids=347230,347231
export function getTracksDetail(params) {
    return request({
        url: '/song/detail',
        method: 'get',
        params
    })
}

// 获取歌曲url(支持多个id用 ，隔开)
// 说明 : 使用歌单详情接口后 , 能得到的音乐的 id, 但不能得到的音乐 url, 调用此接口, 
// 传入的音乐 id( 可多个 , 用逗号隔开 ), 可以获取对应的音乐的 url,未登录状态或者非会
// 员返回试听片段(返回字段包含被截取的正常歌曲的开始时间和结束时间)
// 必选参数 : id : 音乐 id
// 可选参数 : br: 码率,默认设置了 999000 即最大码率,如果要 320k 则可设置为 320000,其他类推
// 接口地址 : /song/url
// 调用例子 : /song/url?id=33894312 /song/url?id=405998841,33894312
export function getTracksUrl(params) {
    if (!params.br) {
        params.br = 320000 //默认最低码率
    }
    return request({
        url: '/song/url',
        method: 'get',
        params
    })
}

// 获取歌词
// 说明 : 调用此接口 , 传入音乐 id 可获得对应音乐的歌词 ( 不需要登录 )
// 必选参数 : id: 音乐 id
// 接口地址 : /lyric
// 调用例子 : /lyric?id=33894312
export function getLyric(params) {
    return request({
        url: '/lyric',
        method: 'get',
        params
    })
}

// 获取歌曲的可用状态（不可靠）
// 说明: 调用此接口,传入歌曲 id, 可获取音乐是否可用,返回 { success: true, message: 'ok' }
// 或者 { success: false, message: '亲爱的,暂无版权' }
// 必选参数 : id : 歌曲 id
// 可选参数 : br: 码率,默认设置了 999000 即最大码率,如果要 320k 则可设置为 320000,其他类推
// 接口地址 : /check/music
// 调用例子 : /check/music?id=33894312
export function checkTrackAvailableStatus(params) {
    return request({
        url: '/check/music',
        method: 'get',
        params
    })
}

// 通过 id 获取每首歌的统一数据格式
// {
//     track_id,
//     track_name,
//     track_alias,
//     track_duration,
//     track_popularity,
//     track_publishTime,
//     track_mv,
//     track_album,
//     track_artists,
//     track_url,
//     track_lyric,
//     track_privilege,
// }

// 获取歌曲的详细播放数据和url
export function getTrackPlayData(ids) {
    const getTrackDetailTask = getTracksDetail({ ids: ids })
    const getTrackUrlTask = getTracksUrl({ id: ids })
    return Promise.all([getTrackDetailTask, getTrackUrlTask])
        .then(res => {
            // 数据处理为统一的数据格式
            const playerData = rawDetailDataConvert(res[0].songs, res[0].privileges, res[1].data)
            return Promise.resolve(playerData)
        })
}

// 数据处理为统一的数据格式
function rawDetailDataConvert(tracks, privileges, urls) {
    return tracks.map(track => {
        const url = urls.find(u => u.id === track.id).url
        const privilege = privileges.find(p => p.id === track.id)
        const album = track.al
        const artists = track.ar
        // 歌曲的id
        const track_id = track.id
        // 歌曲名
        const track_name = track.name
        // 各取别名
        const track_alias = track.alia
        // 歌曲的时长
        const track_duration = track.dt
        // 歌曲的热度
        const track_popularity = track.pop
        // 歌曲的发行时间
        const track_publishTime = track.publishTime
        // 歌曲的 mv id ,非0表示有mv
        const track_mv = track.mv
        // 歌曲的专辑信息
        const track_album = {
            album_id: album.id,
            album_name: album.name,
            album_cover: album.picUrl
        }
        // 歌曲的歌手信息
        const track_artists = artists.map(ar => ({
            artist_id: ar.id,
            artist_name: ar.name
        }))
        // 歌曲的播放地址
        const track_url = url
        // 歌曲的歌词
        const track_lyric = null
        // 歌曲的播放权限
        const track_privilege = trackPrivilegeConvert(url, privilege.fee)

        return {
            track_id,
            track_name,
            track_alias,
            track_duration,
            track_popularity,
            track_publishTime,
            track_mv,
            track_album,
            track_artists,
            track_url,
            track_lyric,
            track_privilege,
        }
    })
}

// 获取歌曲的播放权限
function trackPrivilegeConvert(url, fee) {
    let playable = true, reason = ''
    if (url == null) {
        playable = false
        switch (fee) {
            case 0:
                reason = '无版权'
                break
            case 1:
                reason = 'VIP歌曲'
                break
            case 4:
                reason = '付费专辑'
                break
            case 8:
                reason = '会员专享高品质音乐'
        }
    }
    return { playable, reason }
}