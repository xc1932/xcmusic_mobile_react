import request from './request'

// 获取评论(新版)
// 说明 : 调用此接口 , 传入资源类型和资源 id,以及排序方式,可获取对应资源的评论
// 必选参数 :
// id : 资源 id, 如歌曲 id,mv id
// type: 数字 , 资源类型 , 对应歌曲 , mv, 专辑 , 歌单 , 电台, 视频对应以下类型
// 0: 歌曲  1: mv  2: 歌单  3: 专辑  4: 电台  5: 视频  6: 动态
// 可选参数 :
// pageNo:分页参数,第 N 页,默认为 1
// pageSize:分页参数,每页多少条数据,默认 20
// sortType: 排序方式, 1:按推荐排序, 2:按热度排序, 3:按时间排序
// cursor: 当sortType为 3 时且页数不是第一页时需传入,值为上一条数据的 time
// 接口地址 : /comment/new
// 调用例子 : /comment/new?type=0&id=1407551413&sortType=3, 
//          /comment/new?type=0&id=1407551413&sortType=3&cursor=1602072870260&pageSize=20&pageNo=2
export function getComment(params) {
    return request({
        url: '/comment/new',
        method: 'get',
        params
    })
}

// 发送删除评论
// 说明 : 调用此接口,可发送评论或者删除评论
// 接口地址 : /comment
// 1.发送评论
// 必选参数
// t:1 发送, 2 回复
// type: 数字,资源类型,对应歌曲,mv,专辑,歌单,电台,视频对应以下类型
// 0: 歌曲
// 1: mv
// 2: 歌单
// 3: 专辑
// 4: 电台
// 5: 视频
// 6: 动态
// id:对应资源 id
// content :要发送的内容
// commentId :回复的评论 id (回复评论时必填)
// 调用例子 : /comment?t=1&type=1&id=5436712&content=test (往广岛之恋 mv 发送评论: test)
// 注意：如给动态发送评论，则不需要传 id，需要传动态的 threadId,如：
// /comment?t=1&type=6&threadId=A_EV_2_6559519868_32953014&content=test
// 2.删除评论
// 必选参数
// t:0 删除
// type: 数字,资源类型,对应歌曲,mv,专辑,歌单,电台,视频对应以下类型
// 0: 歌曲
// 1: mv
// 2: 歌单
// 3: 专辑
// 4: 电台
// 5: 视频
// 6: 动态
// id:对应资源 id content :内容 id,可通过 /comment/mv 等接口获取
// 调用例子 : /comment?t=0&type=1&id=5436712&commentId=1535550516319 (在广岛之恋 mv 删除评论)
// 注意：如给动态删除评论，则不需要传 id，需要传动态的 threadId,如：
// /comment?t=0&type=6&threadId=A_EV_2_6559519868_32953014&commentId=1419516382
export function deleteComment(params) {
    return request({
        url: '/comment',
        delete: 'post',
        params
    })
}