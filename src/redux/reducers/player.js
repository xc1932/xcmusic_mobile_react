import {
    SAVE_PLAYER_DATA,
    DELETE_PLAYER_DATA,
    UPDATE_CURRENTINDEX,
    UPDATE_PLAYMODE,
    PLAYER_PLAYLIST,
    PLAYER_SHUFFLELIST,
    PLAYER_PLAYMODE,
    PLAYER_CURRENTINDEX,
} from '../constant'

const playList = JSON.parse(localStorage.getItem(PLAYER_PLAYLIST))
const shuffleList = JSON.parse(localStorage.getItem(PLAYER_SHUFFLELIST))
const playMode = JSON.parse(localStorage.getItem(PLAYER_PLAYMODE))
const currentIndex = JSON.parse(localStorage.getItem(PLAYER_CURRENTINDEX))
const currentTrack = (
    playList && shuffleList && playList.length > 0 &&
    (currentIndex >= 0 && currentIndex <= playList.length - 1)) &&
    (playMode === 0 || playMode === 2 ? playList[currentIndex] : shuffleList[currentIndex]) || null

const initState = {
    playList: playList || [],           //顺序播放列表
    shuffleList: shuffleList || [],     //随机播放列表
    playMode: playMode || 0,            //0:顺序循环播放  1：随机循环播放  2：单曲循环播放
    playStatus: false,                  //播放状态
    currentIndex: currentIndex || 0,    //当前播放索引   
    currentTrack: currentTrack
}

export default function playerReducer(preState = initState, action) {
    const { type, data } = action
    switch (type) {
        // 加载播放歌曲
        case SAVE_PLAYER_DATA:
            return {
                playList: data.playList,
                shuffleList: data.shuffleList,
                playMode: data.playMode,
                playStatus: true,
                currentIndex: data.currentIndex,
                currentTrack: data.playMode === 0 || data.playMode === 2 ?
                    data.playList[data.currentIndex] : data.shuffleList[data.currentIndex]
            }
        // 清空播放器
        case DELETE_PLAYER_DATA:
            return {
                playList: [],
                shuffleList: [],
                playMode: preState.playMode,
                playStatus: false,
                currentIndex: 0,
                currentTrack: null
            }
        // 上一首、下一首
        case UPDATE_CURRENTINDEX:
            // 根据新的索引计算新的播放歌曲
            const newCurrentTrack = preState.playMode === 0 || preState.playMode === 2 ?
                preState.playList[data.newCurrentIndex] : preState.shuffleList[data.newCurrentIndex]
            return {
                ...preState,
                playStatus: true,
                currentIndex: data.newCurrentIndex,
                currentTrack: newCurrentTrack
            }
        // 切换播放模式
        case UPDATE_PLAYMODE:
            return {
                ...preState,
                currentTrack: preState.currentTrack, //使用之前的播放歌曲
                playMode: data.newPlayMode
            }
        default:
            return preState
    }
}