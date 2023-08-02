// mqttApi.js

import * as mqtt from "mqtt/dist/mqtt.min";

class MqttApi {
  constructor(connectUrl, topic) {
    this.client = mqtt.connect(connectUrl);

    this.client.on('connect', () => {
      this.client.subscribe(topic);
    });

    this.client.on('message', (topic, message) => {
      console.log('收到消息');
      console.log(topic, message.toString());
    });

    this.client.on("close", (error) => {
      if (!error) {
        console.log("断开操作");
      }
    });
  }

  publish(topic, message) {
    this.client.publish(topic, message);
  }
}

export default MqttApi;
