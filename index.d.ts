import { Packet } from "mqtt"

/**
 * 
 */

 function publish(message: string, appParams: {[key: string]: any}) : void
 function close() : void

 export function connectDevice(deviceConnectionString: string, onC2DMessage: (topic: string, message: Buffer, packet: Packet) => void) : {publish, close}
 export function monitorEvents(eventHubName: string, eventHubConnectionString: string, onMessage: (message: string, context: any) => void): {close}