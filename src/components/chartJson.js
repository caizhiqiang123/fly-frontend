import React from 'react';
import { Select, DatePicker,Icon } from 'antd';
import moment from 'moment';
// 引入 ECharts 主模块
import echarts from 'echarts';
// 引入柱状图
import  'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/funnel';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';

const RangePicker = DatePicker.RangePicker;
// 日期范围格式
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;
export default class ChartJson extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      from_date:"",
      to_date:"",
      unit:"day",
      chart_type:"line",
    }
  }
  // 切换图表类型
  magicTypeChange=(value)=> {
    console.log(value);
    let chart_type = value.key;
    this.props.onChartTypeChange(chart_type);
    this.setState({
      chart_type:value.key
    });


  };
  // 选择查询日期范围
  timeChange = (dates, dateStrings) => {
    let date ={
      from_date:dateStrings[0],
      to_date:dateStrings[1]
    };
    this.props.onDateRangeChange(date);
  };
  //根据时间粒度查询数据
  selectByTime = (value)=>{
    let unit = value.key;
    this.props.onUnitChange(unit);
 };

  render() {
    if(this.props.chartJson && this.state.chart_type ==="line" || this.state.chart_type ==="bar"){
      let seriesT = [];
      let legendT = [];
      let xAxis = this.props.chartJson[0].time;
      for(let k in this.props.chartJson) {
        seriesT.push({
          name: this.props.chartJson[k].name,
          type: this.state.chart_type,
          data: this.props.chartJson[k].data,
          markPoint : {
            data : [
              {type : 'max', name: '最大值'},
              {type : 'min', name: '最小值'}
            ]
          },
          markLine : {
            data : [
              {type : 'average', name: '平均值'}
            ]
          }
        });
        legendT.push(
            this.props.chartJson[k].name
        )
      }
      setTimeout(() => {
        let myChart = echarts.init(document.getElementById('main'));
        myChart.showLoading();
        myChart.clear();
        // 设置图表参数
        let option = {
          title: {
            // text:"动态的增加数据",
            x:'left'
          },
          color: [
            '#FE8463','#9BCA63','#FAD860','#60C0DD','#0084C6',
            '#D7504B','#C6E579','#26C0C0','#F0805A','#F4E001',
            '#B5C334'
          ],
          tooltip : {
            trigger: 'axis'
          },
          legend: {
            show:true,
            orient:'horizontal',
            textStyle:{color:'black',fontFamily:'SimSun',fontSize:14},
            x:'center',
            y:'top',
            //legend的data: 用于设置图例，data内的字符串数组需要与sereis数组内每一个series的name值对应  
            data:legendT
          },
          toolbox: {
            show : true,
            orient:'vertical',
            feature : {
              mark : {show: true},
              //dataZoom，框选区域缩放，自动与存在的dataZoom控件同步，分别是启用，缩放后退  
              dataZoom: {
                show: true,
                title: {
                  dataZoom: '区域缩放',
                  dataZoomReset: '区域缩放后退'
                }
              },
              dataView : {
                show: true,
                title : '数据视图',
                readOnly: false,
                lang : ['数据视图', '关闭', '刷新'],
              },
              magicType : {
                show:true,
                title:{
                  line: '折线图切换',
                  bar: '柱形图切换',
                  pie: '饼图切换',
                  stack: '堆积',
                  tiled: '平铺',
                },
                type:['stack', 'tiled'],
              },
              restore :{show:true},
              saveAsImage :{show:true}
            }
          },
          dataZoom : {
            show :true,
            realtime: true,
            start :0,
            end : 100
          },
          xAxis: [
            {
              type : 'category',
              scale:true,
              axisLine : {    // 轴线
                show: true,
                lineStyle: {
                  color: 'black',
                  type: 'solid',
                  width: 1
                }
              },
              data :xAxis
            },
          ],
          yAxis:  {
            type : 'value',
            scale:true,
            splitLine : {
              show:true,
              lineStyle: {
                color: '#483d8b',
                type: 'dotted',
                width: 1
              }
            },
            // splitNumber: 10,//分割段数git
            axisLabel : {
              formatter: function (value) {
                // Function formatter
                // return value + '人'
                return value
              }
            },
          },
          series : seriesT
        };
        myChart.hideLoading();
        myChart.setOption(option);
      },0);
    }else if(this.props.chartJson && this.state.chart_type ==="pie" || this.state.chart_type ==="funnel"){
      let legend = [];
      let newData = [];
      for(let k in this.props.chartJson){
        newData.push({
          value:this.props.chartJson[k].data[k],
          name: this.props.chartJson[k].name
        });
        legend.push(
            this.props.chartJson[k].name
        );
      }
      let new_series = [{
        name:'总数',
        type:this.state.chart_type,
        radius : '55%',
        itemStyle : {
          normal : {
            label : {
              show : true,
            },
            labelLine : {
              show : true
            }
          },
          emphasis : {
            label : {
              show : true,
              position : 'right',
              formatter: '{b}: {c}',
              textStyle : {
                fontSize : '20',
                fontWeight : 'bold'
              }
            }
          },
        },
        center: ['50%', '60%'],
        data:newData
      }];
      setTimeout(() => {
        let myChart = echarts.init(document.getElementById('main'));
        myChart.showLoading();
        myChart.clear();
        // 设置图表参数
        let option = {
          title : {
             text: "总数",
            x:'center'
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient : 'vertical',
            x : 'left',
            data:legend
          },
          toolbox: {
            show : true,
            orient:'vertical',
            feature : {
              mark : {show: true},
              //dataZoom，框选区域缩放，自动与存在的dataZoom控件同步，分别是启用，缩放后退  
              dataZoom: {
                show: true,
                title: {
                  dataZoom: '区域缩放',
                  dataZoomReset: '区域缩放后退'
                }
              },
              dataView : {show: true, readOnly: false},
              magicType : {
                show:true,
                type: ['pie', 'funnel']
              },
              restore :{show:true},
              saveAsImage :{show:true}
            }
          },
          calculable : true,
          series:new_series
        };
        myChart.hideLoading()
        myChart.setOption(option);
      },0);
    }

    return (
      <div>
        <div className="event_chart">
          <ul>
            {/*日期控件*/}
            <li className="data_picker">
              <RangePicker
                style={{ width: 200 }}
                defaultValue={[moment('2017-10-01', dateFormat), moment('2017-10-05', dateFormat)]}
                format={dateFormat}
                ranges={{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }}
                onChange={this.timeChange}
              />
            </li>
            <li className="selectGroup">
              <Select labelInValue defaultValue={{ key: 'line' }} style={{ width:120 }}
                      onChange={this.magicTypeChange}>
                <Option value="line"><Icon type="line-chart" style={{color:"#559ef0"}} /><span style={{marginLeft:10}}>线图</span></Option>
                <Option value="bar"><Icon type="bar-chart" style={{color:"#559ef0"}} /><span style={{marginLeft:10}}>柱图</span></Option>
                <Option value="pie"><Icon type="pie-chart" style={{color:"#559ef0"}} /><span style={{marginLeft:10}}>饼图</span></Option>
                <Option value="funnel"><Icon type="filter" style={{color:"#559ef0"}} /><span style={{marginLeft:10}}>漏斗图</span></Option>
              </Select>
              {/*时间分组*/}
              <Select labelInValue defaultValue={{ key: 'day' }} style={{ width:120 }} onChange={this.selectByTime}>
                <Option value="minute">分钟</Option>
                <Option value="hour">按小时</Option>
                <Option value="day">按天</Option>
                <Option value="week">按周</Option>
                <Option value="month">按月</Option>
              </Select>
            </li>
          </ul>
        </div>
        {/*图表*/}
        <div className="chart">
          <div id="main" className="chart-box" style={{ width:"97%", height:450 }}></div>
        </div>

      </div>

    )
  }
}