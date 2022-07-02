import React, { Component } from 'react'
import withRouter from '@/utils/withRouter'
import { PlayTwo, MoreOne } from '@icon-park/react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import './RectangleTrackItem.less'

class RectangleTrackItem extends Component {
    // methods
    // 播放歌曲
    playTrackHandler = (e, trackId) => {
        e.stopPropagation()
        const { playTrack } = this.props
        playTrack(trackId)
    }
    // 播放mv
    playMVHandler = (e, mvId) => {
        e.stopPropagation()
        const { navigate } = this.props
        navigate(`/video/${mvId}`, { state: { type: 0 } })
    }
    // 打开更多操作按钮
    showMoreOperationHandler = (e) => {
        e.stopPropagation()
        console.log('showMoreOperationHandler');
    }
    render() {
        const { playTrackHandler, playMVHandler, showMoreOperationHandler } = this
        const { track } = this.props
        const mvIconStyle = { visibility: track.track_mv ? 'visible' : 'hidden' }
        return (
            <div
                className='rectangleTrackItem'
                style={{ filter: track.track_privilege?.playable ? '' : 'grayscale(100%)' }}
                onClick={(e) => playTrackHandler(e, track.track_id)}>
                <div className="trackCover">
                    <LazyLoadImage src={track?.track_album?.album_cover} effect="blur" />
                </div>
                <div className="trackDesc">
                    <div className="trackName">
                        <div className="privilege" style={{ display: track.track_privilege?.playable ? 'none' : '' }}>({track.track_privilege?.reason})</div>
                        {track.track_name}
                    </div>
                    <div className="trackArtists">
                        {
                            track.track_artists.map(a => a.artist_name).join('、')
                        }
                    </div>
                </div>
                <div className="trackItemsBtns">
                    <PlayTwo theme="outline" size="24" fill="#666" style={mvIconStyle} onClick={(e) => playMVHandler(e, track.track_mv)} />
                    <MoreOne theme="outline" size="24" fill="#666" onClick={showMoreOperationHandler} />
                </div>
            </div>
        )
    }
}

export default withRouter(RectangleTrackItem)

// track:{
//     track_id,
//     track_name,
//     track_alias,
//     track_duration,
//     track_popularity,
//     track_publishTime,
//     track_mv,
//     track_album,
//     track_artists,
//     track_url,
//     track_lyric,
//     track_privilege,
// }
// track_album:{
//     album_id,
//     album_name,
//     album_cover
// }
// track_artists:{
//     artist_id,
//     artist_name
// }
// track_privilege:{
//     playable,
//     reason
// }