import React, { Component } from 'react'
import { Delete } from '@icon-park/react'
import './CommonListItem.less'

export default class CommonListItem extends Component {
    render() {
        const { id, width, coverUrl, title, clickHandler, children, deleteShow, deleteHandler } = this.props
        return (
            <div className='commonListItem' onClick={() => clickHandler()}>
                <div className="cover" style={{ width }}>
                    <img src={coverUrl} />
                </div>
                <div className="right">
                    <div className="title">{title}</div>
                    {children}
                </div>
                <div className="delete" style={{ display: deleteShow ? '' : 'none' }} onClick={(e) => deleteHandler(e, id)}>
                    <Delete theme="outline" size="24" fill="#999" />
                </div>
            </div>
        )
    }
}
