import React from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Avatar, SearchBar } from 'antd-mobile'
import './Search.less'

function Search(props) {
    // router
    const navigate = useNavigate()

    // redux
    const { isLogin, avatarUrl } = props

    // methods
    const avatarClickHandler = () => {
        if (isLogin) {
            navigate('/user')
        } else {
            navigate('/login')
        }
    }

    // style
    const avatatStyle = {
        '--size': '30px',
        '--border-radius': '50%'
    }
    const searchBarStyle = {
        '--border-radius': '100px',
        '--background': '#eee',
        '--height': '32px',
        '--padding-left': '12px',
    }

    return (
        < div className='search' >
            <div className="avatar" onClick={avatarClickHandler}>
                <Avatar
                    src={avatarUrl}
                    style={avatatStyle}
                ></Avatar>
            </div>
            <SearchBar
                placeholder='请输入内容'
                style={searchBarStyle}
                onFocus={() => navigate('/search')}
            />
        </div>
    )
}

export default connect(
    state => ({
        isLogin: state.user.isLogin,
        avatarUrl: state.user.profile.avatarUrl
    }),
    {}
)(Search)
