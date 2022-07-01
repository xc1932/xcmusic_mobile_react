// 该文件专门用于配置和暴露store,全文只有一个store对象
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import reducer from './reducers'

export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

