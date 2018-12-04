// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import dict from './lib/dict.js'
import ElementUI from 'element-ui'
import {
  Loading
} from 'element-ui';
import '@/theme/index.css'
import '@/theme/display.css';
import '@/assets/css/element-custom.css';
import 'font-awesome/css/font-awesome.css';
import Axios from 'axios';

Vue.use(ElementUI)

Vue.config.productionTip = false


Axios.defaults.baseURL = "http://" + window.location.hostname + ":10014"

let loading;


const downloadUrl = url => {
  let iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = url
  iframe.onload = function () {
    document.body.removeChild(iframe)
  }
  document.body.appendChild(iframe)
}

Axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  if (!config.hideLoading) {
    loading = Loading.service({
      lock: true,
    });
  }
  return config;
}, function (error) {
  // Do something with request error
  !!loading && loading.close()
  return Promise.reject(error);
});

// Add a response interceptor
Axios.interceptors.response.use(function (response) {
  // Do something with response data
  !!loading && loading.close()
  if (response.headers && (response.headers['content-type'] === 'application/x-download' || response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
    downloadUrl(response.request.responseURL)
    response.data='';
    response.headers['content-type'] = 'text/json'
    return response;
  }
  return response;
}, function (error) {
  // Do something with response error
  !!loading && loading.close()

  if (error.response.status === 401) {
    router.push({ name: "登录" })
  }
  return Promise.reject(error);
});

Vue.prototype.$http = Axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
