import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
const Home = lazy(() => import('@/pages/home/Home.jsx'))
const Video = lazy(() => import('@/pages/video/Video.jsx'))
const VideoPlayer = lazy(() => import('@/pages/video-player/VideoPlayer.jsx'))
const User = lazy(() => import('@/pages/user/User.jsx'))
const Setting = lazy(() => import('@/pages/setting/Setting.jsx'))
const Login = lazy(() => import('@/pages/login/Login.jsx'))
const Search = lazy(() => import('@/pages/search/Search.jsx'))
const DailyRecommend = lazy(() => import('@/pages/daily-recommend/DailyRecommend.jsx'))
const PlayList = lazy(() => import('@/pages/playlist/PlayList.jsx'))
const PlayListDetail = lazy(() => import('@/pages/playlist-detail/PlayListDetail.jsx'))
const Artist = lazy(() => import('@/pages/artist/Artist.jsx'))
const ArtistDetail = lazy(() => import('@/pages/artist-detail/ArtistDetail.jsx'))
const Album = lazy(() => import('@/pages/album/Album.jsx'))
const AlbumDetail = lazy(() => import('@/pages/album-detail/AlbumDetail.jsx'))
const TopList = lazy(() => import('@/pages/toplist/TopList.jsx'))

// 路由表
export default [
    {
        path: '/',
        element: <Navigate to='/home' /> //router6中的重定向,Redirct被废弃
    },
    {
        path: '/home',
        element: <Home />
    },
    {
        path: '/video',
        element: <Video />
    },
    {
        path: '/video/:id',
        element: <VideoPlayer />
    },
    {
        path: '/user',
        element: <User />
    },
    {
        path: '/setting',
        element: <Setting />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/search',
        element: <Search />
    },
    {
        path: '/dailyrecommend',
        element: <DailyRecommend />
    },
    {
        path: '/playlist',
        element: <PlayList />,
        children: [
            {
                path: '/playlist/:id',
                element: <PlayListDetail />,
            }
        ]
    },
    {
        path: '/artist',
        element: <Artist />
    },
    {
        path: '/artistdetail/:id',
        element: <ArtistDetail />
    },
    {
        path: '/album',
        element: <Album />,
        children: [
            {
                path: '/album/:id',
                element: <AlbumDetail />,
            }
        ]
    },
    {
        path: '/toplist',
        element: <TopList />
    },
]

