import { Layout, Menu, MenuProps } from "antd"
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, } from "react-router-dom";
import './App.css'
import 'highlight.js/styles/github.css';
import { routes } from "./router";
import { handleRoutes } from "./utils/tools";
const { Sider, Content } = Layout
const layoutStyle = {
    overflow: 'hidden',
};

const siderStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    background: '#001529',
};

interface RouteHandle {
    name: string
}

type MenuItem = Required<MenuProps>["items"][number]


const App = () => {
    const routers = handleRoutes(routes)
    const navigate = useNavigate()
    const localtion = useLocation()
    const [items, setItems] = useState<MenuItem[]>([])
    const [selectedKeys, setSelectedKeys] = useState(['/'])

    const clickMenu: MenuProps["onClick"] = ({ key, }) => {
        setSelectedKeys([key])
        navigate(`/${key}`)
    }


    useEffect(() => {
        const menuItems = routers.map(item => {
            return {
                key: item.path,
                label: item.name,
                icon: item.icon
            }
        })
        console.log(localtion.pathname, 'localtion.pathname');

        setSelectedKeys([localtion.pathname === '/' ? localtion.pathname : localtion.pathname.slice(1)])

        setItems(menuItems)
    }, [])

    return (
        <>
            <Layout style={layoutStyle}>
                <Sider width="15%" style={siderStyle}>
                    <h2>AI大模型</h2>
                    <ul className="sidebar-menu">
                        {/* {routes.map(item => (<li key={item.id}><Link to={item.pathname}>{(item.handle as RouteHandle).name}</Link></li>))} */}
                        <Menu
                            defaultSelectedKeys={['/']}
                            selectedKeys={selectedKeys}
                            mode="inline"
                            theme="dark"
                            items={items}
                            onClick={clickMenu}
                        />
                    </ul>
                </Sider>
                <Layout>
                    <Content>
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
            {/*  */}
        </>
    )
}

export default App