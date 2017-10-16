import React from 'react';
import { Select, Icon, Button, Input } from 'antd';
import '../css/eventAnalysis.css';
import * as _ from 'lodash';
import {
  groups,
  eventMeasures,
  filter,
  eventName,
  filterFunc,
  originFetchData
} from '../util/eventPageSource';
import ChartJson from './chartJson';
import EventTable from './eventTable';
// 引入标准Fetch及IE兼容依赖
import 'whatwg-fetch';

const DATA_DIMENSION = {
  mea: 'measure',
  grp: 'group',
  flt: 'filter'
};

const DATA_DRIVES = {
  mea: 'measureDrive',
  grp: 'groupDrive',
  flt: 'filterDrive'
};

const Option = Select.Option;
export default class Event extends React.Component {
  constructor(props) {
    super(props);
    const event = {
      groups,
      eventMeasures,
      filter,
      filterFunc,
      eventName
    };
    Object
      .keys(event)
      .forEach(r => {
        event[r] = event[r].map((name, idx) => {
          return {
            key: name,
            value: name,
            disabled: false,
            idx: idx
          }
        })
      });
    event.groups[0].disabled = true;
    event.eventMeasures[0].disabled = true;
    event.eventName[0].disabled = true;
    this.state = {
      event,
      measureDrive: [{
        eventName: event.eventName[0].key,
        measures: [event.eventMeasures[0]]
      }],
      groupDrive: [
        event.groups[0]
      ],
      newFilterData: [{
        id: "shh&djhsah21",
        filter_name: "城市",
        ops: ["等于", "不等于"],
        values: ["北京", "武汉", "南京", "上海", "广州"]
      }, {
        id: "sdasdsasddsa",
        filter_name: "操作系统",
        ops: ["等于", "不等于"],
        values: ["2", "3"]
      }
      ],
      filterDrive: [],
      res: "",
      filterGroupType: "and",
      date: {},
      from_date: "2017-10-01",
      to_date: "2017-10-05",
      chart_type: "line",
      unit: "day"
    }
  }

  componentDidMount(){
    this.fetchFilter();
  }

  assembFetchData = () => {
    let data = _.cloneDeep(originFetchData);
    data.filters.type = this.state.filterGroupType;
    data.filters.ops = this.state.filterDrive
      .map(r => {
        return {
          "prop": r.opt,
          "operation": r.func,
          "value": [r.value]
        }
      });
    data.events = this.state.measureDrive
      .map(r => {
        return {
          "event_name": r.eventName,
          "aggregator": r.measures.map(r => r.key)
        }
      });
    data.from_date = this.state.from_date;
    data.to_date = this.state.to_date;
    data.chart_type = this.state.chart_type;
    data.unit = this.state.unit;
    data.group_by = this.state.groupDrive
      .map(r => {
        return r.key;
      });
    return data;
  };

  fetchEventData = () => {
    let params = this.assembFetchData();
    console.log(params, 'param!');
    fetch('http://101.200.81.81:8090/api/handler/DruidHandler/event_report_bak', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
      .then((data) => data.json())
      .then((res) => {
        console.log('the serer data is ', res);
        this.setState({ res: res });
      });
  };

  fetchFilter = () => {
    fetch('http://101.200.81.81:8090/api/handler/DruidHandler/get_filter_names', {
      method: "GET",
      headers: {
        'Accept': 'application/json',
      }
    })
      .then((data) => data.json())
      .then((res) => {
        console.log('filter is ', res);
        this.setState({ newFilterData: res.filter_names });
      });
  };

  componentWillMount() {
    this.fetchEventData()
  };

  // types enum: measure, group, filter
  operEventParams = (eventType, oper, id) => {
    let target      = '',
        originData  = [],
        eventTarget = '';
    switch (eventType) {
      case DATA_DIMENSION.mea:
        target = DATA_DRIVES.mea;
        originData = this.state.event.eventMeasures;
        eventTarget = 'eventMeasures';
        break;
      case DATA_DIMENSION.grp:
        target = DATA_DRIVES.grp;
        originData = this.state.event.groups;
        eventTarget = 'groups';
        break;
      case DATA_DIMENSION.flt:
        target = DATA_DRIVES.flt;
        originData = this.state.event.filter;
        eventTarget = 'filter';
        break;
      default:
        break;
    }
    const oldData = _.cloneDeep(this.state[target]);
    if (oldData.length >= originData.length && oper === 'add') {
      return;
    }
    if (oper === 'add') {
      let defualtInitValue = {};
      for (let n of originData) {
        if (n.disabled === false) {
          defualtInitValue = n;
          n.disabled = true;
          break;
        }
      }
      oldData.push(defualtInitValue);
    }
    else if (oper === 'remove') {
      oldData.splice(id, 1);
      originData.forEach(r => {
        let fl = _.findIndex(oldData, (z) => {
          return z.key === r.key;
        });
        if (fl < 0) {
          r.disabled = false;
        }
      });
      const newEvent = this.state.event;
      newEvent[eventTarget] = originData;
      this.setState({ event: newEvent });
    }
    const newObj = {};
    newObj[target] = oldData;
    this.setState(newObj, () => {
      this.fetchEventData();
    });
  };

  assembParamsDOM = (eventType) => {
    let originData, collectionData;
    switch (eventType) {
      case DATA_DIMENSION.mea:
        originData = this.state.event.eventMeasures;
        collectionData = this.state.measureDrive;
        break;
      case DATA_DIMENSION.grp:
        originData = this.state.event.groups;
        collectionData = this.state.groupDrive;
        break;
      case DATA_DIMENSION.flt:
        originData = this.state.event.filter;
        collectionData = this.state.filterDrive;
        break;
      default:
        break;
    }
    if (!collectionData.length) {
      return;
    }
    return <div className="event_params">
      {collectionData.map((c, id) => <span id={id} className="params_select">
           <Select
             defaultValue={c.value}
             size="large"
             className="event_choice"
             style={{ width: "150px" }}
             onChange={(v) => {
             }}>
       {originData.map((r, id) => <Option value={r.value}
                                          disabled={r.disabled}>{r.key}
       </Option>)}
       </Select>
        <Icon type="close-circle" className="icon" onClick={() => {
        }}
              style={{ marginLeft: "5px" }}
        />
       </span>)}
    </div>
  };

  removeEventMeasures = (id) => {
    let removeValue = this.state.measureDrive[id];
    this.state.event.eventName.forEach(r => {
      if (r.key === removeValue.key) {
        r.disabled = false;
      }
    });
    this.setState({ event: this.state.event }, () => {
      this.state.measureDrive.splice(id, 1);
      this.setState({ measureDrive: this.state.measureDrive }, () => {
        this.fetchEventData();
      });
    });
  };

  addEventMeasure = () => {
    let eventName = this.state.event.eventName;
    let nextValue = {};
    for (let n of eventName) {
      if (!n.disabled) {
        nextValue = n;
        n.disabled = true;
        break;
      }
    }
    this.state.measureDrive.push({
      eventName: nextValue.key,
      measures: [this.state.event.eventMeasures[0]]
    });
    if (this.state.measureDrive.length >= 2) {
      this.state.event.eventMeasures.forEach((r, id) => {
        if (id !== 0) {
          r.disabled = false;
        }
      });
      this.setState({ event: this.state.event }, () => {
        this.setState({ measureDrive: this.state.measureDrive }, () => {
          this.fetchEventData();
        });
      });
    }

  };

  addEventMeasureMeasures = (id) => {
    if (this.state.measureDrive[id].measures.length >= this.state.event.eventMeasures.length) {
      return;
    }
    let nextValue = this.state.event.eventMeasures[0];
    let measures = this.state.event.eventMeasures;
    for (let n of measures) {
      if (!n.disabled) {
        nextValue = n;
        n.disabled = true;
        break;
      }
    }
    this.state.measureDrive[id].measures.push(nextValue);
    this.setState({ measureDrive: this.state.measureDrive }, () => {
      this.fetchEventData();
    });
  };

  removeEventMeasureMeasures = (eid, id) => {
    let removeValue = this.state.measureDrive[eid].measures[id];
    this.state.event.eventMeasures.forEach((r) => {
      if (r.key === removeValue.key) {
        r.disabled = false;
      }
    });
    this.setState({ event: this.state.event }, () => {
      this.state.measureDrive[eid].measures.splice(id, 1);
      this.setState({ measureDrive: this.state.measureDrive }, () => {
        this.fetchEventData();
      });
    });

  };

  assemMeasures = () => {
    return <div>
      {this.state.measureDrive.map((r, eventId) => <div key={r.eventName}>
        {eventId === 0 ? (<span>显示:</span>) : (<span style={{ width: "37px", display: "inline-block" }}></span>)}
        <Icon type="minus-circle-o" className="icon-measure"
              onClick={() => {
                this.removeEventMeasures(eventId);
              }}
        />
        <Select
          defaultValue={r.eventName}
          size="large"
          className="event_choice"
          style={{ width: "150px" }}
          onChange={(v) => {
            this.measuresChanged(eventId, v)
          }}>
          {this.state.event.eventName.map((r, id) => <Option key={r.idx} value={r.value}
                                                             disabled={r.disabled}><Icon type="appstore"
                                                                                         style={{ marginRight: "10px" }}/>{r.key}
          </Option>)}
        </Select>
        <span className="text_left">的</span>
        {r.measures.map((r, meid) => <span key={r.idx}>
          <Select
            defaultValue={r.value}
            size="large"
            className="event_choice"
            style={{ width: "150px" }}
            onChange={(v) => {
              this.measuresMeasuresChanged(eventId, meid, v)
            }}>
          {this.state.event.eventMeasures.map((r, mmid) => <Option key={r.idx} value={r.value}
                                                                   disabled={r.disabled}><Icon type="appstore"
                                                                                               style={{ marginRight: "10px" }}/>{r.key}
          </Option>)}
        </Select>
          <Icon type="close-circle" className="icon" onClick={() => {
            this.removeEventMeasureMeasures(eventId, meid)
          }}/>
        </span>)}
        <Icon style={{ marginLeft: "15px" }} type="plus-circle" className="icon" onClick={() => {
          this.addEventMeasureMeasures(eventId)
        }}/>
      </div>)}

    </div>
  };

  groupChanged = (groupId, v) => {
    this.state.groupDrive[groupId] = {
      key: v,
      value: v
    };
    this.setState({ groupDrive: this.state.groupDrive }, () => {
      this.fetchEventData();
    });
  };

  assembGroup = () => {
    return <div>
      {this.state.groupDrive.map((r, groupId) => <div key={r.key} style={{ marginLeft: "35px" }}>
        <span>按:</span>
        <Select
          defaultValue={r.key}
          size="large"
          className="event_choice"
          style={{ width: "150px" }}
          onChange={(v) => {
            this.groupChanged(groupId, v);
          }}>
          {this.state.event.groups.map((r, id) => <Option key={r.key}
                                                          disabled={r.disabled}><Icon type="appstore"
                                                                                      style={{ marginRight: "10px" }}/>{r.key}
          </Option>)}
        </Select>
        <span>查看</span>
        <Icon type="close-circle" className="icon" onClick={() => {
          this.removeGroupsAction(groupId)
        }}/>
        {groupId === (this.state.groupDrive.length - 1) ?
          (<Icon type="plus-circle" className="icon"
                 style={{ marginLeft: "15px" }}
                 onClick={() => {
                   this.operEventParams(DATA_DIMENSION.grp, 'add')
                 }}/>) : ("")}
      </div>)}
    </div>
  };

  removeGroupsAction = (id) => {
    if (this.state.groupDrive.length <= 1) {
      return;
    }
    this.state.groupDrive.splice(id, 1);
    this.state.groupDrive.forEach(r => {
      r.disabled = false;
    });
    this.setState({ groupDrive: this.state.groupDrive });
  };

  fitlerGroupTypeChanged = () => {
    const newType = this.state.filterGroupType === 'and' ? "or" : "and";
    this.setState({ filterGroupType: newType }, () => {
      this.fetchEventData();
    });
  };

  filterGroupChanged = (fid, v) => {
    this.state.filterDrive[fid].opt = v;
    this.setState({ filterDrive: this.state.filterDrive }, () => {
      this.fetchEventData();
    });
  };

  filterGroupFuncChanged = (fid, v) => {
    this.state.filterDrive[fid].func = v;
    this.setState({ filterDrive: this.state.filterDrive }, () => {
      this.fetchEventData();
    });
  };

  filterGroupValueChanged = (fid, v) => {
    this.state.filterDrive[fid].value = v;
    this.setState({ filterDrive: this.state.filterDrive }, () => {
      this.fetchEventData();
    });
  };

  //
  assembFilter = () => {
    let originData = this.state.newFilterData;
    let filterDrive = _.cloneDeep(this.state.filterDrive);
    let filterFunc = this.state.event.filterFunc;
    return <div style={{ position: "relative" }}>
      {filterDrive.length > 1 ? (<div className="filterGroupContainer"><Button
        className="filterGroupButton"
        onClick={this.fitlerGroupTypeChanged}
        type="primary">{this.state.filterGroupType.toUpperCase()}</Button>
        <div className="filterLines"></div>
      </div>) : ("")}
      {filterDrive.map((r, filterId) => <div key={r.flag} style={{ marginLeft: "100px" }}>
        <Select
          defaultValue={originData[0].filter_name}
          size="large"
          className="event_choice"
          style={{ width: "150px", marginRight: "5px" }}
          onChange={(v) => {
            this.filterGroupChanged(filterId, v)
          }}>
          {this.state.newFilterData.map((r, id) => <Option key={r.id} value={r.filter_name}><Icon
            type="appstore" style={{ marginRight: "10px" }}/>{r.filter_name}</Option>)}
        </Select>
        <Select
          size="large"
          className="event_choice"
          defaultValue={filterFunc[0].key}
          style={{ width: "150px", marginRight: "5px" }}
          onChange={(v) => {
            this.filterGroupFuncChanged(filterId, v);
          }}
        >
          {this.state.newFilterData.filter(xr => xr.filter_name === r.opt)[0].ops.map((r, id) => <Option key={id}
                                                                                                         value={r}><Icon
            type="appstore" style={{ marginRight: "10px" }}/>{r}</Option>)}
        </Select>
        <span>
          <Select
            mode="tags"
            style={{ minWidth: "200px" }}
            onChange={(v) => {
              this.filterGroupValueChanged(filterId, v)
            }}
          >
          {this.state.newFilterData.filter(xr => xr.filter_name === r.opt)[0].values.map(r => <Option
            key={r}>{r}</Option>)}
        </Select>
          </span>
        <Icon type="close-circle" className="icon" onClick={() => {
          this.removeGroupFilter(filterId);
        }}
              style={{ marginLeft: "5px" }}
        />
      </div>)}
    </div>
  };

  removeGroupFilter = (id) => {
    let filterOrigin = _.cloneDeep(this.state.filterDrive);
    filterOrigin.splice(id, 1);
    this.setState({ filterDrive: filterOrigin }, () => {
      this.fetchEventData();
    });
  };

  eventParamsChanged = (v, eventType) => {
    let originData, state = this.state.event;
    originData = eventType === DATA_DIMENSION.mea ? state.eventMeasures :
      (eventType === DATA_DIMENSION.grp ? state.groups :
        (eventType === DATA_DIMENSION.flt ? state.filter : []));
    originData.forEach(d => {
      if (d.key === v) {
        d.disabled = true;
      }
    })
  };
  // 日期控件
  onDateRangeChange = (date) => {
    // this.setState({ date: { from: dateStrings[0], to: dateStrings[1] } });
    this.setState({
      from_date: date.from_date,
      to_date: date.to_date
    }, () => {
      this.fetchEventData();
    });

  };
  // 图表类型控件
  onChartTypeChange = (chart_type) => {
    this.setState({
      chart_type: chart_type,
    }, () => {
      this.fetchEventData();
    });
  };

  // 时间粒度类型控件
  onUnitChange = (unit) => {
    this.setState({
      unit: unit,
    }, () => {
      this.fetchEventData();
    });
  };
  addOrRemoveFilter = (type, id) => {
    let originData = this.state.newFilterData;
    const newFt = _.cloneDeep(this.state.filterDrive);
    if (type && type === 'add') {
      newFt.push({
        opt: originData[0].filter_name,
        func: originData[0].ops[0],
        value: [],
        flag: Math.random()
      });
      this.setState({ filterDrive: newFt }, () => {
        this.fetchEventData();
      });
    } else {
      newFt.splice(id, 1);
      this.setState({ filterDrive: newFt }, () => {
        this.fetchEventData();
      });
    }
  };

  measuresChanged = (evid, v) => {
    this.state.measureDrive[evid].eventName = v;
    this.setState({ measureDrive: this.state.measureDrive }, () => {
      this.fetchEventData()
    });
  };

  measuresMeasuresChanged = (evid, mid, v) => {
    let oldValue = this.state.measureDrive[evid].measures[mid];
    this.state.event.eventMeasures.forEach(r => {
      if (oldValue.key === r.key) {
        r.disabled = false;
      }
      if (v === r.key) {
        r.disabled = true;
      }
    });
    this.setState({ event: this.state.event }, () => {
      this.state.measureDrive[evid].measures[mid] = {
        key: v,
        value: v
      };
      this.setState({ measureDrive: this.state.measureDrive }, () => {
        this.fetchEventData();
      });
    });

  };

  render() {
    const measuresSelect = this.assemMeasures();
    const groupsSelect = this.assembGroup();
    const filterSelect = this.assembFilter();

    return (
      <div>
        <div className="event_block">
          <div className="event_property" style={{ position: "relative" }}>
            {measuresSelect}
            <span className="icon-measure-add">
              <Icon type="plus-circle" className="icon-measure" onClick={this.addEventMeasure}/>
            </span>
          </div>
          <div className="event_property">
            {groupsSelect}
          </div>
          {this.state.filterDrive.length ? (<div className="event_property">
            {filterSelect}
          </div>) : ('')}
          <div className="event_property">
         <span onClick={() => {
           this.addOrRemoveFilter('add')
         }}>
            <Icon type="plus-circle" className="icon"/>
          <span className="text_left">添加筛选条件</span>
         </span>
          </div>
        </div>
        {/*引入图表*/}
        <div className="chartIn">
          <ChartJson
            onDateRangeChange={this.onDateRangeChange}
            onChartTypeChange={this.onChartTypeChange}
            onUnitChange={this.onUnitChange}
            chartJson={this.state.res.list_data}
            measureDrive={this.state.measureDrive}
          />
        </div>

        {/*引入table图表*/}
        <div className="tableIn">
          <EventTable tableJson={this.state.res.table_data}/>
        </div>
      </div>
    )
  }
}
