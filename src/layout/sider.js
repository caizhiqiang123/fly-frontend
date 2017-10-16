import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router';

const SubMenu = Menu.SubMenu;
export class FeilSider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: '',
    }
  }
  handleClick = (e) => {
    this.setState({
      current: e.key
    })
  };
  render() {
    return (
      <div>
        <Menu theme="dark"
              defaultOpenKeys={['sub1']}
              defaultSelectedKeys={[this.state.current]}
              mode="inline"
              onClick={this.handleClick}
        >
          <SubMenu key="sub1" title={<span><Icon type="desktop" /><span>数据概览</span></span>}>
            <Menu.Item key="1"><Link to="/dataV">实时业务概览</Link></Menu.Item>
            <Menu.Item key="2"><Link to="/event">运营数据概览</Link></Menu.Item>
            <Menu.Item key="3"><Link to="/event">产品数据概览</Link></Menu.Item>
            <Menu.Item key="4"><Link to="/event">营销数据概览</Link></Menu.Item>
          </SubMenu>
          <SubMenu
              key="sub2"
              title={<span><Icon type="line-chart" /><span>分析工具</span></span>}
          >
            <Menu.Item key="5"><Link to="/event">事件分析</Link></Menu.Item>
            <Menu.Item key="6"><Link to="/dataV">漏斗分析</Link></Menu.Item>
            <Menu.Item key="7"><Link to="/event">留存分析</Link></Menu.Item>
            <Menu.Item key="8"><Link to="/event">用户路径分析</Link></Menu.Item>
            <Menu.Item key="9"><Link to="/event">激活分析</Link></Menu.Item>
            <Menu.Item key="10"><Link to="/event">页面行为分析</Link></Menu.Item>
          </SubMenu>
          <SubMenu key="sub3" title={<span><Icon type="team" /><span>运营工具</span></span>}>
            <Menu.Item key="11"><Link to="/event">用户分群</Link></Menu.Item>
            <Menu.Item key="12"><Link to="/event">用户画像</Link></Menu.Item>
            <Menu.Item key="13"><Link to="/event">渠道分析</Link></Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    );
  }
}