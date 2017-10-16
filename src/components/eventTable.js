import React from 'react'
import {Table} from 'antd'
import 'whatwg-fetch';
export default class EventTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tDate: [],
            columns:[],
            loading: true,
            pagination:'',
            tableJson:"",
        }
    }
    render() {
        let pagination={};
        let columns=[];
        let data_source = [];
        if(this.props.tableJson){
            for(let k in this.props.tableJson[0]){
                let col ={};
                let n_key=k;
                col ={
                    title: n_key,
                    dataIndex: n_key,
                    width:100,
                    key: n_key
                };
                columns.push(col);
            }
            for(let i=0;i<this.props.tableJson.length;i++){
                let obj ={};
                for(let key in this.props.tableJson[i]){
                    obj[key] = this.props.tableJson[i][key];
                }
                data_source.push(obj);
            }
            pagination = {
                total: this.props.tableJson.length,
                showSizeChanger: true,
                onShowSizeChange(current, pageSize) {
                    console.log('Current: ', current, '; PageSize: ', pageSize)
                },
                onChange(current) {
                    console.log('Current: ', current)
                }
            }
        }
        return (
            <Table
                columns={columns}
                dataSource={data_source}
                bordered
                pagination={pagination}
                scroll ={{ x: true,y:400}}
                onChange={this.handleTableChange}
            />
        )
    }
}
