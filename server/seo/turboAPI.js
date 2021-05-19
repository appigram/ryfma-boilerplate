import { Meteor } from 'meteor/meteor'

import request from 'request'
import zlib from 'zlib'

const DEFAULT_API_VERSION = 'v4'
const DEFAULT_API_BASE_URL = 'https://api.webmaster.yandex.net'
const DEFAULT_API_URL = DEFAULT_API_BASE_URL + '/' + DEFAULT_API_VERSION
const MODE_DEBUG = 'DEBUG'
const MODE_PRODUCTION = 'PRODUCTION'

class TurboAPI {
  constructor (hostAddress, token, mode = MODE_DEBUG) {
    this.hostAddress = hostAddress
    this.mode = mode
    this.token = token
    this.authHeader = {
      'Authorization': 'OAuth ' + token
    }

    this.userId = null
    this.hostId = null
    this.isDebug = false
    this.curlLink = ''
    this.uploadAddress = ''
    this.loadStatus = ''
  }

  sendRequest = (method, route, query, headers = [], data = null) => {
    let url = DEFAULT_API_URL + route + query
    const authHeader = this.authHeader

    return new Promise((resolve, reject) => {
      const options = {
        url: url,
        method: method,
        headers: {
          ...authHeader,
          ...headers
        },
        body: data
      }

      request(options, (error, response, body) => {
        if (error) {
          // console.log('sendRequest with error!')
          return reject(error)
        }
        resolve(response.body)
      })
    })
  }

  requestUserId = async () => {
    const apiResponse = await this.sendRequest('GET', '/user/', '?mode=' + this.mode)
    this.userId = JSON.parse(apiResponse).user_id
    return apiResponse.user_id
  }

  requestHost = async () => {
    if (!this.userId) {
      return null
    }
    /*
     * Запросом получаем список хостов, к которому пользователь имеет доступ в Яндекс.Вебмастере
     */
    const apiResponse = await this.sendRequest('GET', '/user/' + this.userId + '/hosts/', '?mode=' + this.mode)
    const hosts = JSON.parse(apiResponse).hosts
    // const apiResponseArray = json_decode(apiResponse, true)
    // Выбираем нужный хост
    let hostId = null
    for (let i = 0; i < hosts.length; i++) {
      const host = hosts[i]
      if (host.ascii_host_url === this.hostAddress) {
        this.hostId = host.host_id
        hostId = host.host_id
      }
    }

    return hostId
  }

  requestUploadAddress = async () => {
    if (!this.userId || !this.hostId) {
      return null
    }
    const rawResponse = await this.sendRequest('GET', '/user/' + this.userId + '/hosts/' + this.hostId + '/turbo/uploadAddress/', '?mode=' + this.mode)
    const apiResponse = JSON.parse(rawResponse)
    console.log('Turbo apiResponse: ', apiResponse)
    this.uploadAddress = apiResponse.upload_address
    return this.uploadAddress
  }

  uploadRss = async (data) => {
    if (!this.uploadAddress) {
      throw new Error('Не задан адрес для отправки данных!')
    }
    const uploadRoute = this.uploadAddress.split(DEFAULT_API_URL)[1]
    const headers = { 'Content-Type': 'application/rss+xml', 'Content-Encoding': 'gzip' }
    const gzippedXML = zlib.gzipSync(data)
    const rawResponse = await this.sendRequest('POST', uploadRoute, '?mode=' + this.mode, headers, gzippedXML)
    const apiResponse = JSON.parse(rawResponse)
    console.log('apiResponse: ', apiResponse)
    if (apiResponse.task_id !== 'undefined') {
      return apiResponse.task_id
    } else {
      return apiResponse
    }
  }

  getTask = async (taskId) => {
    if (!(this.userId) || !(this.hostId)) {
      return null
    }
    const apiResponse = await this.sendRequest('GET', '/user/' + this.userId + '/hosts/' + this.hostId + '/turbo/tasks/' + taskId, '?mode=' + this.mode)
    this.loadStatus = JSON.parse(apiResponse).load_status
    return this.loadStatus
  }

  getTasks = async (type, status, offset, limit) => {
    if (!(this.userId) || !(this.hostId)) {
      return null
    }
    const apiResponse = await this.sendRequest('GET', '/user/' + this.userId + '/hosts/' + this.hostId + '/turbo/tasks', `?task_type_filter=${type}&load_status_filter=${status}&offset=${offset}&limit=${limit}`)
    return JSON.parse(apiResponse)
  }
}

export default TurboAPI
