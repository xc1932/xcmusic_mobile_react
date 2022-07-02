import React, { Component } from 'react'
import { PlayOne } from '@icon-park/react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import './CommonItem.less'

export default class CommonItem extends Component {
    // style
    styleComputed = () => {

    }
    render() {
        const { width, height, borderRadius, textAlign, coverUrl, playCount, publishTime, name, clickHandler } = this.props
        return (
            <div className='commonItem' style={{ width }} onClick={() => clickHandler()}>
                <div className="commonItemTop">
                    <div className="commonItemCover" style={{ width, height, borderRadius }}>
                        <LazyLoadImage src={coverUrl} effect="blur" />
                    </div>
                    <div className="commonItemPlayCount" style={{ display: playCount ? '' : 'none' }}>
                        <PlayOne theme="filled" size="18" fill="#fff" />
                        {playCount}
                    </div>
                    <div className="commonItemPublishTime" style={{ display: publishTime ? '' : 'none' }}>{publishTime}</div>
                </div>
                <div className="commonItemBot" style={{ width, textAlign }}>
                    {name}
                </div>
            </div>
        )
    }
}
