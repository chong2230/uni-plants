import Config from '@/config/config.js'
import Mock from '../mock/index.js' //测试用数据

const http = {}
const headers = {}
const baseUrl = Config.httpServer	//'/api';
    
http.request = (url, data, method, contentType) => {
	let token = getApp().globalData.token;
	let uid = getApp().globalData.uid;
	let headers = {
		'Accept': 'application/json',
		'Content-Type': contentType ? contentType : 'application/x-www-form-urlencoded;charset=UTF-8',
		'Authorization': 'Bearer ' + token,
	}
    data = data || {};
	data.plt = getApp().globalData.plt || 'miniprogram';
	data.dt = new Date().getTime();
	data.ver = getApp().globalData.ver || '1.0.0';
	data.nonce = Math.floor(Math.random() * 100000) + 999999;
	if (token) data.access_token =  token;
	if (uid) data.uid = uid;
	if (Config.isMock) {
		return new Promise(resolve=>{
			setTimeout(()=>{
				resolve(Mock[url]);
			}, 10)
		})
	}
    return uni.request({
        url: baseUrl + url,
        method,
        data: data,
        dataType: 'json',
        header: headers
    }).then(res => {
		// console.log(data, res);
        if (res[1].statusCode == 200) {
            return res[1].data
        } else {
            throw res[1].data
        }
    }).catch(err => {
		console.log(err)	
		return Promise.reject()
　　})
 } 
 
 http.get = (url, data, contentType) => {
	 return http.request(url, data, 'GET', contentType)
}

http.post = (url, data, contentType) => {
	 return http.request(url, data, 'POST', contentType)
}

export default http