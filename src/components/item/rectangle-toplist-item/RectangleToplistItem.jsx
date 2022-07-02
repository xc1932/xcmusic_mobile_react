import React, { Component } from 'react'
import withRouter from '@/utils/withRouter'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import './RectangleToplistItem.less'

class RectangleToplistItem extends Component {
    render() {
        const { toplist, navigate } = this.props
        return (
            <div className='rectangleToplistItem' onClick={() => navigate(`/playlist/${toplist.toplist_id}`)}>
                <div className="toplistCardLeft">
                    <div className="toplistName">{toplist?.toplist_name}</div>
                    <div className="toplistCover">
                        <LazyLoadImage src={toplist?.toplist_cover} effect="blur"/>
                    </div>
                </div>
                <div className="toplistCardRight">
                    <div className="toplistUpdateFrequency">{toplist?.toplist_updateFrequency} </div>
                    <div className="toplistTracks">
                        {
                            toplist?.toplist_tracks && toplist.toplist_tracks.map((t, index) => {
                                return (
                                    <div className='briefTrackDesc' key={index}>
                                        <span className='boldText'>{`${index + 1} ${t.first} `}</span>
                                        {` - ${t.second} `}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(RectangleToplistItem)