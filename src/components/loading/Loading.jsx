import React, { Component } from 'react'
import { Toast } from 'antd-mobile'

export default class Loading extends Component {
    componentDidMount() {
        Toast.show({
            icon: 'loading',
            content: '加载中…',
            maskClickable: false,
            duration: 0
        })
    }
    componentWillUnmount() {
        Toast.clear()
    }
    render() {
        return (
            <div>
            </div>
        )
    }
}
