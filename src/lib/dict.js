import Vue from 'vue'
import Axios from 'axios';

let dict = [];

if (window.location.host === 'localhost:8080') {
  Axios.defaults.baseURL = "http://localhost:10014"
} else {
  Axios.defaults.baseURL = "http://60.175.208.233:10014"
}
//字典查询
export const getAllDict = function () {
  Axios.get("/dict").then(res => {
    let body = res.data;
    if (body.code === "200") {
      dict = body.data;
    }
  });
}
// getAllDict();
//字典查询
export const getDict = function (key, value) {
  if (value == undefined) {
    return dict[key];
  }
  else {
    if(dict[key]!=null){
      for (let i = 0; i < dict[key].length; i++) {
        if (value == dict[key][i].value) {
          return dict[key][i].name;
        }
      }
    }


  }
  return "";
}

Vue.prototype.$dict = getDict
Vue.prototype.$allDict = getAllDict
