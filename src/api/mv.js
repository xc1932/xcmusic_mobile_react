import request from './request'

// 获取 mv 数据
// 说明: 调用此接口, 传入mvid(在搜索音乐的时候传type = 1004获得),可获取对应MV数据,
// 数据包含mv名字,歌手,发布时间,mv视频地址等数据,其中mv视频网易做了防盗链处理,可能不
// 能直接播放,需要播放的话需要调用'mv地址'接口
// 必选参数: mvid: mv 的 id
// 接口地址: /mv/detail
// 调用例子: /mv/detail ? mvid = 5436712
export function getMVDetail(params) {
    return request({
        url: '/mv/detail',
        method: 'get',
        params
    })
}

// 获取 mv 地址
// 说明 : 调用此接口 , 传入 mv id,可获取 mv 播放地址
// 必选参数 : id: mv id
// 可选参数 : r: 分辨率,默认 1080,可从 /mv/detail 接口获取分辨率列表
// 接口地址 : /mv/url
// 调用例子 :
// /mv/url?id=5436712 /mv/url?id=10896407&r=1080
export function getMVUrl(params) {
    return request({
        url: '/mv/url',
        method: 'get',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 获取 mv 评论
// 说明 : 调用此接口 , 传入音乐 id 和 limit 参数 , 可获得该 mv 的所有评论 ( 不需要 登录 )
// 必选参数 : id: mv id
// 可选参数 : limit: 取出评论数量 , 默认为 20
// offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
// before: 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过 5000 条评论的时候需要用到)
// 接口地址 : /comment/mv
// 调用例子 : /comment/mv?id=5436712
export function getMVComment(params) {
    return request({
        url: '/comment/mv',
        method: 'get',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 获取相似 mv
// 说明 : 调用此接口 , 传入 mvid 可获取相似 mv
// 必选参数 : mvid: mv id
// 接口地址 : /simi/mv
// 调用例子 : /simi/mv?mvid=5436712
export function getSimilarMV(params) {
    return request({
        url: '/simi/mv',
        method: 'get',
        params
    })
}