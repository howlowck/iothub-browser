/* global WebSocket */
import amqp from 'rhea'
import {parseConnectionString, getHostNameFromEndpoint} from './utils'
import debug from 'debug'
const log = debug('monitor-events')

export default function monitorEvents (eventHubName, eventHubConnectionString, onMessage) {
  // 0. set up the config
  const connectionObj = parseConnectionString(eventHubConnectionString)
  const hostName = getHostNameFromEndpoint(connectionObj.Endpoint)
  const policyName = connectionObj.SharedAccessKeyName
  const sas = connectionObj.SharedAccessKey

  const url = `wss://${hostName}:443/$servicebus/websocket?iothub-no-client-cert=true`
  const ws = amqp.websocket_connect(WebSocket)

  // 1. connect to eventhub
  const connection = amqp.connect({
    hostname: hostName,
    container_id: 'conn' + Date.now(),
    max_frame_size: 4294967295,
    channel_max: 65535,
    idle_timeout: 120000,
    outgoing_locales: 'en-US',
    incoming_locales: 'en-US',
    offered_capabilities: null,
    desired_capabilities: null,
    properties: {},
    connection_details: ws(url, ['AMQPWSB10']),
    reconnect: false,
    username: policyName,
    password: sas
  })

  let sender

  // 2. open communication for $management to get partitionIds
  amqp.on('connection_open', function (context) {
    connection.open_receiver('$management')
    sender = connection.open_sender('$management')
  })

  // 3. send the request to get the partitionIds
  amqp.once('sendable', function (context) {
    sender.send({
      body: '[]',
      application_properties: {
        operation: 'READ',
        name: eventHubName, // hostName,
        type: 'com.microsoft:eventhub'
      }
    })
  })

  // 4. set up filter to only capture from the current timestamp (otherwise will get all events)
  const currentTimestamp = Date.now()
  const filterClause = `amqp.annotation.x-opt-enqueuedtimeutc > '${currentTimestamp}'`

  const opts = (partId) => ({
    desired_capabilities: 'com.microsoft:enable-receiver-runtime-metric',
    autoaccept: true,
    source: {
      address: 'hao-gl-iothub/ConsumerGroups/$default/Partitions/' + partId,
      filter: {
        'apache.org:selector-filter:string': amqp.types.wrap_described(filterClause, 0x468C00000004)
      }
    }
  })

  // 5. Open communication to all partitionId paths, register user-defined onMessage callback
  amqp.once('message', function (context) {
    log('monitoring from eventhub endpoint on iothub ...')
    const partitionIds = context.message.body.partition_ids
    partitionIds.forEach(partId => {
      connection.attach_receiver(opts(partId))
    })
    amqp.on('message', (context) => {
      log(context)
      onMessage(context.message.body.content.toString(), context)
    })
  })

  const close = connection.close.bind(connection)

  return {
    close
  }
}
