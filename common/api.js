import http from '@/common/http.js'
import { formatGetUri } from '@/common/util.js'

const api = {}

/**
 * 获取植物列表
 * @param { type, subType }  
 */ 
api.getList = params => http.get('/plant/list', params);
/**
 * 获取植物详情
 */
api.getDetail = (params) => http.get('/plant/findByPlantId', params);

export default api