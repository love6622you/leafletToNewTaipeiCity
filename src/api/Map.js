import api from '../lib/request';

export default class Map {
  /**
   * 取得 GeoLocation Json 資訊
   */
  static getGeolocation(params) {
    return api.get('/xinbei/geolocation-json', { params });
  }

  /**
   * 取得距離資訊
   */
  static postCalcDistance(data) {
    return api.post('/xinbei/calc-distance', data);
  }
}
