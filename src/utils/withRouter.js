import { useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";

// router6中,路由组件的props中不再包含路由相关的属性
// withRouter是自定义的路由组件,类似router5中withRouter API
export default function withRouter(Child) {
    // 返回一个函数式组件
    return (props) => {
        const navigate = useNavigate(); //等同于history
        const params = useParams();     //等同于match中的params
        const search = useSearchParams()//经过处理的location中的search
        const location = useLocation(); //等同于location

        return <Child {...props} navigate={navigate} params={params} search={search} location={location} ></Child>
    }
}