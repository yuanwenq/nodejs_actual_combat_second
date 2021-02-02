/*
 * @Date: 2021-02-03
 * @Desc: 2-12 创建一个在用户断开连接时能“打扫战场”的监听器
 */
const { debug } = require('console');
const Events = require('events');
const net = require('net');
const channel = new Events.EventEmitter();

channel.clients = {};
channel.subscriptions = {};

channel.on('join', function (id, client) {
  this.clients[id] = client;
  this.subscriptions[id] = (senderId, message) => {
    if (id != senderId) {
      console.log(message);
      this.clients[id].write(message);
    }
  };
  this.on('broadcast', this.subscriptions[id]);
});

channel.on('leave', function (id) {
  channel.removeListener(
    'broadcast', this.subscriptions[id]
  );
  channel.emit('broadcast', id, `${id} has left the chatroom. \n`);
});

channel.on('shutdown', () => {
  channel.emit('broadcast', '', 'The server has shut down. \n');
  channel.removeAllListeners('broadcast');
});

const server = net.createServer((client) => {
  const id = `${client.remoteAddress}:${client.remotePort}`;
  channel.emit('join', id, client);
  client.on('data', (data) => {
    data = data.toString();
    if (data === 'shutdown') {
      channel.emit('shutdown');
    }
    channel.emit('broadcast', id, data);
  });
  client.on('close', () => {
    channel.emit('leave', id)
  });
});

server.listen(8888);