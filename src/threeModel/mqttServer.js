import MqttApi from './mqttApi';
import {scene} from "./sceneSetup.js";



export function mqttServerFun( connectUrl,topic){
  const mqttServer = new MqttApi(connectUrl, topic);

  mqttServer.client.on('message', (topic, message, packet) => {
    console.log('收到消息')
    // topic 主题
    // message 消息主体
    console.log(topic, message)
    console.log(message.toString())
    scene.traverse(function(obj){
      if(obj.name === 'car1'){
        obj.position.z = parseFloat(message)
      }
      if(obj.name === 'car1-1'){
        obj.position.z = parseFloat(message)+0.43
      }
    })
  })

// 断开的回调
  mqttServer.client.on("close", function(error) {
    if(!error){
      console.log("断开操作");
    }
  });
}
