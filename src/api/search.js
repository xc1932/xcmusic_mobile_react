import request from './request'

// 获取搜索结果
// 说明 : 调用此接口 , 传入搜索关键词可以搜索该音乐 / 专辑 / 歌手 / 歌单 / 用户 ,
// 关键词可以多个 , 以空格隔开 , 如 " 周杰伦 搁浅 "( 不需要登录 ), 可通过 /song/url 接口传入歌曲 id 获取具体的播放链接
// 必选参数 : keywords : 关键词
// 可选参数 : limit : 返回数量 , 默认为 30 offset : 偏移数量，用于分页 ,
// 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
// type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手,
// 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合, 2000:声音(搜索声音返回字段格式会不一样)
// 接口地址 : /search 或者 /cloudsearch(更全)
// 调用例子 : /search?keywords=海阔天空 /cloudsearch?keywords=海阔天空
export function getSearchResult(params) {
    return request({
        url: '/search',
        method: 'get',
        params
    })
}

// 获取搜索建议
// 说明 : 调用此接口 , 传入搜索关键词可获得搜索建议 , 搜索结果同时包含单曲 , 歌手 , 歌单信息
// 必选参数 : keywords : 关键词
// 可选参数 : type : 如果传 'mobile' 则返回移动端数据
// 接口地址 : /search/suggest
// 调用例子 : /search/suggest?keywords=海阔天空 /search/suggest?keywords=海阔天空&type=mobile
export function getSearchSuggest(params) {
    return request({
        url: '/search/suggest',
        method: 'get',
        params
    })
}

// 获取默认搜索关键词
// 说明 : 调用此接口 , 可获取默认搜索关键词
// 接口地址 : /search/default
export function getDefaultSearchKeywords() {
    return request({
        url: '/search/default',
        method: 'get',
        params: {
            timestamp: new Date().getTime()
        }
    })
}

// 获取热搜列表(简略)
// 说明 : 调用此接口,可获取热门搜索列表
// 接口地址 : /search/hot
// 调用例子 : /search/hot
export function getHotSearchList() {
    return request({
        url: '/search/hot',
        method: 'get',
    })
}

// 获取热搜列表(详细)
// 说明 : 调用此接口,可获取热门搜索列表
// 接口地址 : /search/hot/detail
// 调用例子 : /search/hot/detail
export function getHotSearchDetailList() {
    return request({
        url: '/search/hot/detail',
        method: 'get',
    })
}

