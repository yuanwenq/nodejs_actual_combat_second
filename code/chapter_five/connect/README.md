# Connect

## Connect中间件的工作机制

Connect中间件就是 Javascript 函数.这个函数一般会有三个参数: 请求对象，响应对象,以及一个名为 **next** 的回调函数.一个中间件完成自己的工作，要执行后续的中间件时，可以调用这个回调函数。

![connect-life](../../../images/connect-life.png)