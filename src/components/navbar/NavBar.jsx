import React, { Component } from 'react'
import withRouter from '@/utils/withRouter'
import { Left } from '@icon-park/react'
import './NavBar.less'

class NavBar extends Component {
    render() {
        const { title, fontColor, bgColor, navigate } = this.props
        return (
            <div className="navbar" style={{ backgroundColor: bgColor }}>
                <div className="back" onClick={() => navigate(-1)}>
                    <Left theme="outline" size="30" fill={fontColor || "#fff"} />
                </div>
                <div className="title" style={{ color: fontColor }}>{title}</div>
            </div>
        )
    }
}

export default withRouter(NavBar)
