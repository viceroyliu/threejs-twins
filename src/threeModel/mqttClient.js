import MqttApi from './MqttApi';

// MQTT客户端设置
export default function setupMqtt(scene) {
  const connectUrl = 'ws://127.0.0.1:8083/mqtt';
  const topic = ['hangche1', 'hangche2'];
  const mqttServer = new MqttApi(connectUrl, topic);

  mqttServer.client.on('message', (topic, message) => {
    console.log('收到消息', topic, message.toString());
    scene.traverse(function(obj) {
      if (obj.name === 'car1') {
        obj.position.z = parseFloat(message);
      }
      if (obj.name === 'car1-1') {
        obj.position.z = parseFloat(message) + 0.43;
      }
    });
  });

  mqttServer.client.on('close', function(error) {
    if (!error) {
      console.log('断开操作');
    }
  });

  return mqttServer;
}
