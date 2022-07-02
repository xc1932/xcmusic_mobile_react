import React, { Component } from 'react'
import { PlayOne } from '@icon-park/react'
import { longNumberConvert } from '@/utils/common'
import withRouter from '@/utils/withRouter'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import './RectanglePlaylistItem.less'

class RectanglePlaylistItem extends Component {
    render() {
        const { playlist, navigate } = this.props
        return (
            <div className='rectanglePlaylistItem' onClick={() => navigate(`/playlist/${playlist.playlist_id}`)}>
                <div className="playlistCover">
                    <LazyLoadImage src={playlist.playlist_cover} effect="blur"/>
                </div>
                <div className="playlistTitle">
                    {playlist.playlist_name}
                </div>
                <div className="playCount">
                    <PlayOne theme="outline" size="16" fill="#fff" />
                    {longNumberConvert(playlist.playlist_playCount)}
                </div>
            </div>
        )
    }
}
export default withRouter(RectanglePlaylistItem)
//  playlist:{
//     playlist_id,
//     playlist_name,
//     playlist_cover,
//     playlist_playCount
// }
