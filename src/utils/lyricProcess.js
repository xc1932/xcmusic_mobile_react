// 根据当前时间从歌词数组中查找对应歌词的索引
export function findLyricIndex(currentTime, lyricArr) {
    // currentTime=0直接返回
    if (currentTime === 0) return 0
    // 歌词存在是进行查找
    if (!(lyricArr instanceof Array)) return
    // 先找到第一条大于当currentTime的歌词的索引
    let resIndex = lyricArr.findIndex(item => {
        return item.startTime > currentTime
    })
    // 如果该索引与currentTime之差为500ms则返回该索引
    // 否则返回前一个索引
    if (resIndex === -1) return lyricArr.length - 1
    if (lyricArr[resIndex].startTime - currentTime < 500) {
        return resIndex
    } else {
        resIndex--
        return Math.max(0, resIndex) //防止resIndex小于0
    }
}

// fill lyricArr
export function getLyricArr(lyric, tlyric) {
    const lyricArr = []
    const lyricObj = lyricToObj(lyric)
    const tlyricObj = lyricToObj(tlyric)
    if (lyricObj == null) return '暂无歌词'
    if (tlyricObj) {
        for (let key in tlyricObj) {
            lyricObj[key] && (lyricObj[key].tlyricDesc = tlyricObj[key].lyricDesc)
        }
    }
    // 填充歌词数组
    for (let key in lyricObj) {
        lyricObj[key].startTime *= 1000
        lyricArr.push(lyricObj[key])
    }
    // 根据歌词顺序进行排序
    lyricArr.sort((a, b) => a.startTime - b.startTime)
    return lyricArr
}

// lyric -> Obj 
function lyricToObj(lyric) {
    if (lyric === '' || lyric == null) return
    const obj = {}
    const lyricArr = lyric.split('\n')
    lyricArr.forEach(line => {
        const lyricLineObj = lyricLineToObj(line)
        if (lyricLineObj) {
            const { startTime, startTimeStr, lyricDesc } = lyricLineObj
            if (lyricDesc !== '') {
                obj[startTimeStr] = { startTime, startTimeStr, lyricDesc }
            }
        }
    })
    return obj
}

// [02:25.985]作词 : 张芷芮/席雨/豪斯Music -> 
// {
// startTime: 145.985, 
// startTimeStr: '[02:25.985]', 
// lyricDesc: '作词 : 张芷芮/席雨/豪斯Music'
// }
function lyricLineToObj(lyricLine) {
    if (lyricLine === '') return
    let lyricLineArr = lyricLine.split(']')
    if (lyricLineArr[1] === undefined) return
    const startTimeStr = lyricLineArr[0] += ']'
    const startTime = startTimeStrToSeconds(startTimeStr)
    const lyricDesc = lyricLineArr[1]
    return {
        startTime, startTimeStr, lyricDesc
    }
}

// [xx:xx.xxx] -> 秒数
function startTimeStrToSeconds(startTimeStr) {
    const timeArr = startTimeStr.substring(1, startTimeStr.length - 1).split(':')
    const mins = new Number(timeArr[0]).valueOf()
    const secs = new Number(timeArr[1]).valueOf()
    const res = parseFloat((60 * mins + secs).toFixed(2))
    return res
}