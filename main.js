import Vue from 'vue'
import App from './App'
import api from './common/api.js';

Vue.config.productionTip = false

const toast = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

Vue.prototype.$api = api;
Vue.prototype.$app = { toast };

if (uni.getSystemInfoSync().platform !== "devtools") {
	console.log = () => {}
}

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
