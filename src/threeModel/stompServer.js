import {Client} from '@stomp/stompjs';
let stompClient;  // stomp实例

// 连接配置文件
const stompConfig = {
  brokerURL: "ws://47.105.44.218/ws",
  // debug: function (str) {
  //   console.log('STOMP: ' + str);
  // },
  // reconnectDelay: 200, // 失败重连时间，200毫秒
  onConnect: function (frame) { // 连接成功的监听，订阅应该在他内部完成
    // 订阅/topic/chat这个即可，返回的对象有一个unsubscribe的方法
    const subscription = stompClient.subscribe('/jtgx/crane/position/1', function (message) {
      const payload = JSON.parse(message.body);
      console.log(payload)
      // 接收到订阅的消息
    });

    stompClient.publish({destination: '/jtgx/crane/position/1', body: 'hello world'});
  }
}

export function initStompData() {
  // stompConfig
  stompClient = new Client(stompConfig);
  const user = 'guest';
  const message = 'hello world';
  const payLoad = {user: user, message: message};
  // 向服务端/topic/chat 发送数据，body只支持字符串，所以对象数据需转成字符串发送
  // 当然也可以通过headers发送，支持对象形式
  // stompClient.publish({destination: '/jtgx/crane/position/1', body: JSON.stringify(payLoad)});
  // stompClient.publish({destination: '/topic/chat', headers: payLoad});

  // 发生错误的监听
  stompClient.onStompError = function (frame) {
    console.info('Broker reported error:' + frame.headers['message']);
    console.info('Additional details:' + frame.body);
  }

  // 开启连接
  stompClient.activate()
}
