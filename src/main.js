import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueCookies from 'vue-cookies'
import md5 from 'js-md5';


var _hmt = _hmt || [];
(function() {
var hm = document.createElement("script");
hm.src = "https://hm.baidu.com/hm.js?ca3629bf308ae41cf96590fe334a19e5";
var s = document.getElementsByTagName("script")[0]; 
s.parentNode.insertBefore(hm, s);
})();

Vue.use(VueCookies);
Vue.prototype.$md5 = md5;
Vue.prototype.$hmt = _hmt;

Vue.config.productionTip = false

new Vue({
    vuetify,
    render: h => h(App)
}).$mount('#app')