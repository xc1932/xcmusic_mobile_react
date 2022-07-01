import { INCREMENT, DECREMENT } from '../constant'

const initState = {}
export default function settingReducer(preState = initState, action) {
    const { type, data } = action
    switch (type) {

        default:
            return preState
    }
}