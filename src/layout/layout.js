import React from 'react';
import { Layout } from 'antd';
import { FeilContainer } from './container';
import { FeilSider } from './sider';
import { FeilHeader } from './header';
import  '../css/layout.css';
import logo from '../assets/images/logo2.png';

const { Header, Content, Footer, Sider } = Layout;

export class FeilLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
        }
    }

    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    render() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={this.state.collapsed}
                onCollapse={this.onCollapse}
            >
                <div className="logo">
                    <img src={logo} className="logo_icon" alt="logo_icon" />
                    <div className="logo_name">飞流数据</div>
                    <div className="clear"></div>
                </div>
                <FeilSider/>
            </Sider>
            <Layout>
                <Header style={{ background: '#404040', padding: 0 }} >
                    <FeilHeader/>
                </Header>
                <Content style={{ margin: '10px 10px'}}>
                    <FeilContainer
                        content={this.props.children}
                    />
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    FeiL Data © 2017 飞流数据
                </Footer>
            </Layout>
        </Layout>
    )
  }
}