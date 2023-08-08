import { Client } from '@stomp/stompjs'
// mounted () {
//   this.initStompData()
// }
// stomp实例
let stompClient;

// 连接配置文件
const stompConfig = {
  // Typically login, passcode and vhost
  // 连接头信息，通常是认证登录信息
  // connectHeaders: {
  //   login: "guest",
  //   passcode: "guest"
  // },

  // 连接url，应该以 ws:// or wss:// 开头
  brokerURL: "ws://47.105.44.218/ws",

  // debug
  debug: function (str) {
    console.log('STOMP: ' + str);
  },

  // 失败重连时间，200毫秒
  reconnectDelay: 200,

  // Subscriptions should be done inside onConnect as those need to reinstated when the broker reconnects
  // 连接成功的监听，订阅应该在他内部完成
  onConnect: function (frame) {
    // The return object has a method called `unsubscribe`
    // 订阅/topic/chat这个即可，返回的对象有一个unsubscribe的方法
    const subscription = stompClient.subscribe('/topic/chat', function (message) {
      const payload = JSON.parse(message.body);
      // 接收到订阅的消息
    });
  }
}

export function initStompData(){
  // 创建实例
  stompClient = new Client(stompConfig);
  const user = 'guest';
  const message = 'hello world';
  const payLoad = { user: user, message: message };
  // 向服务端/topic/chat 发送数据，body只支持字符串，所以对象数据需转成字符串发送
  // 当然也可以通过headers发送，支持对象形式
  stompClient.publish({destination: '/topic/chat', body: JSON.stringify(payLoad)});
  // stompClient.publish({destination: '/topic/chat', headers: payLoad});

  // 发生错误的监听
  stompClient.onStompError = function(frame) {
    console.info('Broker reported error:' + frame.headers['message']);
    console.info('Additional details:' + frame.body);
  }

  // 开启连接
  stompClient.activate()
}

