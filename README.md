# IotHub Browser Only Package

## Features:
* Receives Cloud-to-device messages
* Sends Device-to-cloud messages
* Monitors all IotHub Messages

## How to Use IotHub Device(in the browser)

```js
import {connectDevice} from 'iothub-browser'

const {publish, close} = connectDevice('{device connection string from iothub}', (topic, c2dMessage) => {
  console.log(c2dMessage)
})

publish('{"message": "hello world"}', {prop1: "looks good"})

// ... to lose the connection
close()
```

## How to Use Event Monitoring

Event Monitoring uses the `events` Iothub endpoint which is a eventhub-compatible endpoint.

```js
import {monitorEvents} from 'iothub-browser'

const {close} = monitorEvents('{eventhub-name}', '{eventhub-compatible-connection-string}', (message, context) => {
  console.log(message)
  console.log(context)
})

// ... to close the monitor connection

close()
```