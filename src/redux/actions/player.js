import store from '../store'
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
import { shuffle } from '@/utils/common'
import { getLyricArr } from '@/utils/lyricProcess'
import { getLyric } from '@/api/track'

// 保存播放数据(1.默认播放第一首    2.根据trackId播放指定歌曲)
export function savePlayerDataAction(playList, trackId) {
    playList = playList.filter(t => t.track_url !== null)
    const playMode = store.getState().player.playMode
    const shuffleList = shuffle(playList)
    let currentIndex = 0
    if (playMode === 1) {
        currentIndex = shuffleList.findIndex(t => t.track_id === trackId)
    } else {
        currentIndex = playList.findIndex(t => t.track_id === trackId)
    }
    // 限定currentIndex的范围
    currentIndex = Math.max(0, Math.min(playList.length - 1, currentIndex))
    const playerData = {
        playList,
        shuffleList,
        playMode,
        currentIndex
    }
    // if (preCurrentIndex) {
    //     playerData.currentIndex = preCurrentIndex
    // }
    localStorage.setItem(PLAYER_PLAYLIST, JSON.stringify(playerData.playList))
    localStorage.setItem(PLAYER_SHUFFLELIST, JSON.stringify(playerData.shuffleList))
    localStorage.setItem(PLAYER_PLAYMODE, JSON.stringify(playerData.playMode))
    localStorage.setItem(PLAYER_CURRENTINDEX, JSON.stringify(playerData.currentIndex))
    return { type: SAVE_PLAYER_DATA, data: playerData }
}

// 删除播放数据
export function deletePlayerDataAction() {
    const preMode = store.getState().player.playMode
    localStorage.setItem(PLAYER_PLAYLIST, JSON.stringify([]))
    localStorage.setItem(PLAYER_SHUFFLELIST, JSON.stringify([]))
    localStorage.setItem(PLAYER_PLAYMODE, JSON.stringify(preMode))
    localStorage.setItem(PLAYER_CURRENTINDEX, JSON.stringify(0))
    return { type: DELETE_PLAYER_DATA }
}

// 上一首/下一首
export function updateCurrentIndexAction({ type }) {
    let { playList, currentIndex } = store.getState().player
    let len = playList.length
    if (type === 'next') {
        currentIndex++
    } else if (type === 'pre') {
        currentIndex--
    }
    if (currentIndex >= len) {
        currentIndex = 0
    }
    if (currentIndex < 0) {
        currentIndex = len - 1
    }
    localStorage.setItem(PLAYER_CURRENTINDEX, JSON.stringify(currentIndex))
    return { type: UPDATE_CURRENTINDEX, data: { newCurrentIndex: currentIndex } }
}

// 模式切换
export function modeSwitchAction() {
    let { playMode } = store.getState().player
    const newPlayMode = (playMode + 1) % 3
    localStorage.setItem(PLAYER_PLAYMODE, JSON.stringify(newPlayMode))
    return { type: UPDATE_PLAYMODE, data: { newPlayMode: newPlayMode } }
}

// 删除指定歌曲
export function deleteTrackAction(trackId) {
    const { playList, shuffleList, playMode, currentIndex, currentTrack } = store.getState().player
    const newPlayList = playList.filter(t => t.track_id !== trackId)
    const newShuffleList = shuffleList.filter(t => t.track_id !== trackId)
    const newPlayMode = playMode
    let newCurrentIndex = currentIndex
    // 根据播放模式,查找之前正在播放歌曲,并返回该歌曲的当前索引。
    if (playMode === 1) {
        const preCurrentTrackIndex = newShuffleList.findIndex(t => t.track_id === currentTrack.track_id)
        if (preCurrentTrackIndex !== -1) {
            newCurrentIndex = preCurrentTrackIndex
        }
    } else {
        const preCurrentTrackIndex = newPlayList.findIndex(t => t.track_id === currentTrack.track_id)
        if (preCurrentTrackIndex !== -1) {
            newCurrentIndex = preCurrentTrackIndex
        }
    }
    // 删除歌曲后正在播放的索引不能超过新的数组长度
    if (newCurrentIndex >= newPlayList.length) {
        newCurrentIndex = newPlayList.length - 1
    }
    if (newPlayList.length <= 0) {
        return deletePlayerDataAction()
    } else {
        const playerData = {
            playList: newPlayList,
            shuffleList: newShuffleList,
            playMode: newPlayMode,
            currentIndex: newCurrentIndex
        }
        localStorage.setItem(PLAYER_PLAYLIST, JSON.stringify(playerData.playList))
        localStorage.setItem(PLAYER_SHUFFLELIST, JSON.stringify(playerData.shuffleList))
        localStorage.setItem(PLAYER_PLAYMODE, JSON.stringify(playerData.playMode))
        localStorage.setItem(PLAYER_CURRENTINDEX, JSON.stringify(playerData.currentIndex))
        return { type: SAVE_PLAYER_DATA, data: playerData }
    }
}

// 播放选中歌曲
export function selectTrackAction(trackId) {
    const { playList, shuffleList, playMode } = store.getState().player
    let newCurrentIndex = 0
    if (playMode === 1) {
        newCurrentIndex = shuffleList.findIndex(t => t.track_id === trackId)
    } else {
        newCurrentIndex = playList.findIndex(t => t.track_id === trackId)
    }
    return { type: UPDATE_CURRENTINDEX, data: { newCurrentIndex } }
}

// 加载歌曲歌词
export function loadTrackLyricAction(trackId) {
    return dispatch => {
        let newPlayerData = updateLyric(trackId, 'loading')
        dispatch({ type: SAVE_PLAYER_DATA, data: newPlayerData })
        getLyric({ id: trackId }).then(lyricRes => {
            let lyric = ''
            // 处理歌词
            if (lyricRes.code === 200) {
                lyric = getLyricArr(lyricRes.lrc?.lyric, lyricRes.tlyric?.lyric)
            } else {
                lyric = '获取歌词失败'
            }
            newPlayerData = updateLyric(trackId, lyric)
            localStorage.setItem(PLAYER_PLAYLIST, JSON.stringify(newPlayerData.playList))
            localStorage.setItem(PLAYER_SHUFFLELIST, JSON.stringify(newPlayerData.shuffleList))
            localStorage.setItem(PLAYER_PLAYMODE, JSON.stringify(newPlayerData.playMode))
            localStorage.setItem(PLAYER_CURRENTINDEX, JSON.stringify(newPlayerData.currentIndex))
            dispatch({ type: SAVE_PLAYER_DATA, data: newPlayerData })
        })
    }
}

function updateLyric(trackId, lyric) {
    const { playList, shuffleList } = store.getState().player
    const cb = t => {
        if (t.track_id === trackId) {
            t.track_lyric = lyric
        }
        return t
    }
    const newPlayList = playList.map(cb)
    const newShuffleList = shuffleList.map(cb)
    const playerData = {
        ...store.getState().player,
        playList: newPlayList,
        shuffleList: newShuffleList,
    }
    return playerData
}