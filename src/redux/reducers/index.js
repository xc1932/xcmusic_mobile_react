import { combineReducers } from 'redux'
import user from './user'
import player from './player'
import setting from './setting'

export default combineReducers({
    user,
    player,
    setting
})