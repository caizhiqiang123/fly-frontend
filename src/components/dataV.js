import React from 'react';
import Iframe from 'react-iframe';

export default class DataV extends React.Component {
    requestFullscreen = ()=>{
        var de = document.documentElement;
        if (de.requestFullscreen) {
            de.requestFullscreen();
        } else if (de.mozRequestFullScreen) {
            de.mozRequestFullScreen();
        } else if (de.webkitRequestFullScreen) {
            de.webkitRequestFullScreen();
        }else if (de.msRequestFullscreen) {
            de.msRequestFullscreen();
        }
    };
    exitFullScreen = ()=>{
        var de = document;
        if (de.exitFullscreen) {
            de.exitFullscreen();
        } else if (de.mozCancelFullScreen) {
            de.mozCancelFullScreen();
        } else if (de.webkitCancelFullScreen) {
            de.webkitCancelFullScreen();
        }else if (de.msExitFullscreen) {
            de.msExitFullscreen();
        }
    };

  render() {
    return (
        <div className="iframe">
            <div className="fullscreen">
                <ul>
                    <li className="enter_full" onClick={this.requestFullscreen}>进入全屏</li>
                    <li className="exit_full" onClick={this.exitFullScreen}>退出全屏</li>
                </ul>
            </div>
            <Iframe url="http://datav.aliyun.com/share/6c9de53169f15c860828d53484602199"
                    width="94%"
                    height="100%"
                    scrolling="no"
                    styles={{marginLeft:-5,marginTop:-5}}
                    allowfullscreen mozallowfullscreen webkitallowfullscreen
                    onClick={this.requestFullscreen}
            />


        </div>

    )
  }
}
