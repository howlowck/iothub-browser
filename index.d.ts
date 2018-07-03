import { Packet } from "mqtt"
import { Message } from "rhea/typings/message";
import { Connection, Container, Receiver, Session } from "rhea";

interface AmqpContext {
  connection: Connection
  container: Container
  message: Message
  receiver: Receiver
  session: Session
}

/**
 * Publishes the event
 * @param message 
 * @param appParams 
 */
function publish(message: string, appParams: {[key: string]: any}) : void

/**
 * Closes the connection
 * @return void
 */
function close() : void

/**
 * Connect to Created Device on IotHub
 * @param deviceConnectionString Device Connection String (not the iothub connection string)
 * @param onC2DMessage
 */
export function connectDevice(deviceConnectionString: string, onC2DMessage: (topic: string, message: Buffer, packet: Packet) => void) : {publish, close}

/**
 * 
 * @param eventHubName Eventhub-compatible name (under iothub-> endpoints -> events)
 * @param eventHubConnectionString Eventhub-compatible Connection String (under iothub-> endpoints -> events)
 * @param onMessage 
 */
export function monitorEvents(eventHubName: string, eventHubConnectionString: string, onMessage: (message: string, context: AmqpContext) => void): {close}