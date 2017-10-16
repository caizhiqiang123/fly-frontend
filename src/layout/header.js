import  React, { Component } from 'react';
import {Icon} from 'antd'

export class FeilHeader extends Component {
  render() {
    return (
        <div>
          <div className="header">
            <ul>
              <li className="header_help">
                <div className="help_doc">
                  <a href="https://www.kancloud.cn/book/shadowhtx/aaaa/preview/%E4%BA%A7%E5%93%81%E6%96%87%E6%A1%A3.md" target="_blank"  rel="noopener noreferrer" style={{color:"white"}}>
                    <Icon type="question-circle-o" />
                    <span>帮助文档</span>
                  </a>
                </div>
              </li>
              <li className="header_login">
                <div className="login_btn">
                  <Icon type="user" />
                  <span>请登录</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

    );
  }
}