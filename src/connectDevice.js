import {connect} from 'mqtt'
import {getTimestampExpiresInMinutes, parseConnectionString, createSignatureObj, getSignatureString} from './utils'
import debug from 'debug'
const log = debug('device')

export default function connectDevice (deviceConnectionString, onC2DMessage) {
  // 0. Set up Config
  const expireTimestamp = getTimestampExpiresInMinutes(60)
  const connObj = parseConnectionString(deviceConnectionString)
  const hostName = connObj.HostName
  const sas = connObj.SharedAccessKey
  const deviceId = connObj.DeviceId
  const sigObj = createSignatureObj(`${hostName}/devices/${deviceId}`, null, sas, expireTimestamp)
  const sigStr = getSignatureString(sigObj)

  const config = {
    clean: false,
    clientId: deviceId,
    keepalive: 180,
    password: sigStr,
    protocolId: 'MQTT',
    protocolVersion: 4,
    reconnectPeriod: 1000,
    rejectUnauthorized: true,
    connectTimeout: 30 * 1000,
    reschedulePings: true,
    username: `${hostName}/${deviceId}/api-version=2017-06-30`
  }

  // 1. Connect to IotHub via websocket
  const client = connect(`wss://${hostName}:443/$iothub/websocket?iothub-no-client-cert=true`, config)

  // 2. Register event listeners
  client.on('connect', function () {
    log('emitter connected!')
  })

  client.on('offline', function () {
    log('emitter offline')
  })

  client.on('close', function () {
    log('emitter closed!')
  })

  client.on('message', onC2DMessage)

  client.on('packetsend', () => {
    log('trying to send pocket..')
  })

  // 3. Subscribe to topic for C2D messages
  client.subscribe(`devices/${deviceId}/messages/devicebound/#`, { qos: 0 })

  // 4. Return publish function
  const publish = (messageStr, params = {}) => {
    const appProps = Object.keys(params).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
    }).join('&')
    client.publish(`devices/${deviceId}/messages/events/${appProps}`, messageStr, { qos: 1, retain: false })
  }

  const close = client.close.bind(client)

  return {
    publish,
    close
  }
}
