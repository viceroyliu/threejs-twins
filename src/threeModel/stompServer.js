import {Client} from '@stomp/stompjs';
import {scene} from "./sceneSetup.js";

let stompClient;  // stomp实例

// 计算位置 传过来的单位是毫米 (计算数据,是否为小车x,x轴)
function computePosition(n, trolleyXAxis = false, XAxis = true,) {
  const mNum = XAxis ? n / 10000 : n / 1000;  // x轴单位为0.1毫米，y轴单位1毫米，全部换算为米
  // 1. X轴为85米，但threeJS需要分为25等份，并且初始值需要减10。
  // const xNum = (mNum / 85 * 25 - 10).toFixed(0);
  // 2. X轴的区间为52.4~85，小于52.4直接为0
  const xNum = mNum - 52.4 > 0 ? ((mNum - 52.4) / 32.6 * 15).toFixed(0) : 0;
  // Y轴为25米，但threeJS需要分为10等份，并且初始值需要减5
  const yNum = (mNum / 25 * 10 - 5).toFixed(0);
  if (trolleyXAxis) return Number(xNum) + 0.43; // 小车距离需要偏离
  return XAxis ? xNum : yNum;
}

function subscribeFun(topicUrl, bigCarName, littleCarName) {
  // 订阅，返回的对象有一个unsubscribe的方法，可以用来卸载订阅
  return stompClient.subscribe(topicUrl, function (message) {
    const payload = JSON.parse(message.body);
    // 更改行车1
    scene.traverse(function (obj) {
      if (obj.name === bigCarName) {
        obj.position.z = computePosition(payload.crane_x)
      }
      if (obj.name === littleCarName) {
        obj.position.z = computePosition(payload.crane_x, true);
        obj.position.x = computePosition(payload.crane_y, false, false);
      }
    })
  });
}

export function initStompData(connectUrl, topics) {
// 连接配置文件
  const stompConfig = {
    brokerURL: connectUrl,
    // debug: function (str) {
    //   console.log('STOMP: ' + str);
    // },
    reconnectDelay: 200, // 失败重连时间，200毫秒
    onConnect: function (frame) { // 连接成功的监听，订阅应该在他内部完成
      // 批量订阅
      topics.forEach(item => {
        subscribeFun(item.topicUrl, item.bigCarName, item.littleCarName);
      })

      // 向服务端/topic/chat 发送数据，body只支持字符串，所以对象数据需转成字符串发送
      // stompClient.publish({destination: 'jtgx/crane/position/1', body: 'hello world'});
      //stompClient.publish({destination: 'topic/chat', headers: payLoad});      // 也可以通过headers发送，支持对象形式
      // 发生错误的监听
      stompClient.onStompError = function (frame) {
        console.info('Broker reported error:' + frame.headers['message']);
        console.info('Additional details:' + frame.body);
      }
    }
  }


  // stompConfig
  stompClient = new Client(stompConfig);

  // 开启连接
  stompClient.activate()
}
