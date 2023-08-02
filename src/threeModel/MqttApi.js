import * as mqtt from "mqtt/dist/mqtt.min";

class MqttApi {
  client = null;

  constructor(connectUrl, topic) {
    const options = {
      keepalive: 40,
      clean: true,
      clientId: 'mqttjs_clientid',
      username: "guest",
      password: 'guest',
      protocolId: 'MQTT',
      protocolVersion: 4,
      reconnectPeriod: 1000,
      connectTimeout: 10 * 1000
    }

    this.client = mqtt.connect(connectUrl, options);

    this.client.on("connect", () => {
      console.log('链接成功');
      if (topic) {
        this.subscribe(topic);
      }
    });

    this.client.on('reconnect', () => console.log("正在重连....."));

    this.client.on("close", (error) => {
      if(error){
        console.log("客户端出现错误....." + error);
      } else {
        console.log("客户端已断开.....");
      }
    });

    this.client.on("error", (error) => console.log("客户端出现错误....." + error));

    this.client.on("packetsend", (packet) => {
      if (packet && packet.payload) {
        console.log("客户端已发出数据包....." + packet.payload);
      }
    });
  }

  disconnect() {
    if (this.client?.connected) {
      this.client.end();
    }
  }

  reconnect() {
    this.client?.reconnect();
  }

  close() {
    if (this.client?.connected) {
      this.client.end();
      this.client = null;
    }
  }

  publish(topic, message) {
    this.client?.publish(topic, message, { qos: 0, retain: true }, (error) => {
      if (error) {
        console.log(error)
      } else {
        console.log('发布消息成功')
      }
    });
  }

  subscribe(topic) {
    this.client?.subscribe(topic, { qos: 0 }, (error, granted) => {
      if (error) {
        console.log(error)
      } else {
        console.log(`${granted[0].topic} 订阅成功`)
      }
    });
  }

  unsubscribe(topic) {
    this.client?.unsubscribe(topic, (error) => {
      if (error) {
        console.log(error)
      } else {
        console.log('取消订阅成功')
      }
    });
  }
}

export default MqttApi;
