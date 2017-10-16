export const eventName = ['曝光', '点击', '激活', '新增', '付费'];
export const eventMeasures = ['总次数', '总用户数'];
export const groups = ['城市', '城市级别', '操作系统', '省份', '广告来源','用户等级'];
export const filter = ['广告id', '推广计划id', '城市', '城市级别', '游戏id', '操作系统', '广告位id', '省份', '广告来源', '用户等级'];
export const filterFunc = ['等于', '大于', '小于', '没值', '有值'];
export const eventNameMap = {
    "曝光":"show",
    "激活":"activate",
    "新增":"new",
    "点击":"click",
    "付费":"pay"
};
export const eventMeasuresMap = {
    "总次数":"count",
    "总用户数":"uv"
};
export const groupsMap ={
    "时间":"__time",
    "广告id":"ad_id",
    "推广计划id":"campaign_id",
    "城市":"city",
    "城市级别":"city_lv",
    "游戏id":"gid",
    "操作系统":"os",
    "广告位id":"pid",
    "省份":"prov",
    "广告来源":"source",
    "用户等级":"user_grade"
};
export const filterMap = {
    "广告id":"ad_id",
    "推广计划id":"campaign_id",
    "城市":"city",
    "城市级别":"city_lv",
    "游戏id":"gid",
    "操作系统":"os",
    "广告位id":"pid",
    "省份":"prov",
    "广告来源":"source",
    "用户等级":"user_grade"
};
export const filterFuncMap = {
    "等于":"eq",
    "大于":"gt",
    "小于":"lt",
    "没值":"null",
    "有值":"not_null"
};

export const originFetchData = {
  "from_date": "",
  "to_date": "",
  "unit": "day",
  "chart_type": "line",
  "events": [],
  "group_by": [
    "width", "type"
  ],
  "filters": {
    "type": "",
    "ops": [
      {
        "prop": "name",
        "operation": "lt",
        "value": ["23", "34"]
      },
      {
        "prop": "age",
        "operation": "gt",
        "value": ["23", "56"]
      }
    ]
  }
};
// data example
// {
//   "from_date": "",
//   "to_date": "",
//   "unit": "day",
//   "chart_type": "",
//   "events": [
//     {
//       "event_name": "appview",
//       "aggregator": ["general"]
//     },
//     {
//       "event_name": "pageview",
//       "aggregator": ["general"]
//     }
//
//   ],
//   "group_by": [
//     "width", "type"
//   ],
//   "filters": {
//     "type": "",
//     "ops": [
//       {
//         "prop": "name",
//         "operation": "lt",
//         "value": ["23", "34"]
//       },
//       {
//         "prop": "age",
//         "operation": "gt",
//         "value": ["23", "56"]
//       }
//     ]
//   }
// };