# Progressive Web App
> Progressive Web App, 简称 PWA，是一种渐进式提升 Web App 的体验的新方法，能给用户原生应用的体验。

PWA 并不是指【某一项】技术，而是通过【一系列】新技术改进，在安全、性能和体验三个方面都有很大提升。

## 为什么要用 PWA？
* 可靠 - 即使在不稳定的网络环境下，也能瞬间加载并展现
* 快速 - 快速响应用户操作，伴随平滑的动画
* 粘性 - 像设备上的原生应用，具有沉浸式的用户体验

通过这些良好的用户体验，完全值得用户将其添加到桌面。

### 可靠 Reliable
![pwa-reliable](/blog/imgs/pwa/pwa-reliable.png)

当用户打开我们站点时，通过 Service Worker 能够让用户在网络条件很差，甚至断网的情况下也能瞬间加载并且展现。

### 快速 Fast
![pwa-fast](/blog/imgs/pwa/pwa-fast.png)

为了保证首屏的加载，在内容请求完成之前，可以优先保证 App Shell 的渲染，做到和 Native App 一样的体验，App Shell 是 PWA 界面展现所需的最小资源。

### 粘性 Engaging
![pwa-engaging](/blog/imgs/pwa/pwa-engaging.png)

* PWA 可以安装到桌面
* PWA 可以实现全屏沉浸式体验
* PWA 可以发送离线通知

### 其他特性
* 安全：基于 HTTPS 协议
* 渐进式：适用于所有浏览器
* 持续更新：始终是最新的，无版本和更新问题
* 可索引：应用清单文件和 Service Worker 可以让搜索引擎索引到，从而将其识别为『应用』
* 可链接：通过链接即可分享内容，无需下载安装

## 改造步骤
* 第一步，应该是安全，将全站 HTTPS 化，因为这是 PWA 的基础，没有 HTTPS，就没有 Service Worker
* 第二步，应该是 Service Worker 来提升基础性能，离线提供静态文件，把用户首屏体验提升上来
* 第三步，App Manifest，这一步可以和第二步同时进行
* 后续，再考虑其他的特性，离线消息推送等

## Service Worker

### 先驱者
* Web Worker（通过 postMessage、onmessage 与主线程进行交互）
* AppCache（已废弃）

### 功能和特性
* 必须在 HTTPS 环境下才能工作
* 一个独立的 worker 线程，独立于当前网页进程，有自己独立的 worker context。
* 一旦被 install，就永远存在，除非被手动 unregister
* 用到的时候可以直接唤醒，不用的时候自动睡眠
* 可编程拦截代理请求和返回，缓存文件，缓存的文件可以被网页进程取到（包括网络离线状态）
* 离线内容开发者可控
* 能向客户端推送消息
* 不能直接操作 DOM
* 异步实现，内部大都是通过 Promise 实现

### 注册
首先需要在主线程中注册

```js
// sw 的地址
const swUrl = '/a/b/sw.js'

// 作用域，可省略，默认是 swUrl 的当前域，即 /a/b
const swScope = { scope: '/' }

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register(swUrl, swScope)
            .then(function (registration) {
                // 注册成功 :)
                console.log('ServiceWorker registration successful with scope: ', registration.scope)
            })
            .catch(function (err) {
                // 注册失败 :(
                console.log('ServiceWorker registration failed: ', err)
            })
    })
}
```

### 安装
在主线程中注册完毕之后，马上将执行 `sw.js` 中的代码。此时 service worker 将经历第一个生命周期 `installing`，并发出第一个事件 `install`。

在 `install` 这个事件中，我们一般对于【静态资源】进行【预缓存】。处理完毕后 service worker 将进入 `installed` 生命周期。










### 生命周期
![sw-lifecycle](/blog/imgs/pwa/sw-lifecycle.png)

* **安装（installing）**：这个状态发生在 Service Worker 注册之后，表示开始安装，触发 install 事件回调指定一些静态资源进行离线缓存。

install 事件回调中有两个方法：

    * event.waitUntil()：传入一个 Promise 为参数，等到该 Promise 为 resolve 状态为止。
    * self.skipWaiting()：self 是当前 context 的 global 变量，执行该方法表示强制当前处在 waiting 状态的 Service Worker 进入 activate 状态。

* **安装后（installed）**：Service Worker 已经完成了安装，并且等待其他的 Service Worker 线程被关闭。

* **激活（activating）**：在这个状态下没有被其他的 Service Worker 控制的客户端，允许当前的 worker 完成安装，并且清除了其他的 worker 以及关联缓存的旧缓存资源，等待新的 Service Worker 线程被激活。

activate 回调中有两个方法：

    * event.waitUntil()：传入一个 Promise 为参数，等到该 Promise 为 resolve 状态为止。
    * self.clients.claim()：在 activate 事件回调中执行该方法表示取得页面的控制权, 这样之后打开页面都会使用版本更新的缓存。旧的 Service Worker 脚本不再控制着页面，之后会被停止。

* **激活后（activated）**：在这个状态会处理 activate 事件回调 (提供了更新缓存策略的机会)。并可以处理功能性的事件 fetch (请求)、sync (后台同步)、push (推送)。

* **废弃状态（redundant）**：这个状态表示一个 Service Worker 的生命周期结束。

这里特别说明一下，进入废弃 (redundant) 状态的原因可能为这几种：

* 安装 (install) 失败
* 激活 (activating) 失败
* 新版本的 Service Worker 替换了它并成为激活状态

### 支持的事件
![sw-evens](/blog/imgs/pwa/sw-evens.png)


## 缓存策略
### Network-only
适用于必须在线才有意义的情况，其实啥都不用干就是这个效果...

![network-only](/blog/imgs/pwa/network-only.gif)

### Cache-only
适用获取在 install 事件中已缓存的数据。但 Cache-first 覆盖了这种情况。

![cache-only](/blog/imgs/pwa/cache-only.gif)

### Network-first
适用于经常更新的内容，例如时间线、收件箱、文章内容等。

* 从网络获取数据成功
![network-first-success](/blog/imgs/pwa/network-first-success.gif)

* 从网络获取数据失败，但从 cache 中获取到了数据
![network-first-fail](/blog/imgs/pwa/network-first-fail.gif)

### Cache-first
适用于比较稳定固定的数据。

* 缓存中没有数据，则请求网络数据
![cache-first](/blog/imgs/pwa/cache-first.gif)

## Generic-fallback
兜底方案，从网络和 cache 里获取数据都失败，此时可以展示一个静态失败页面。

![generic-fallback](/blog/imgs/pwa/generic-fallback.gif)

### Stale-while-revalidate
适用于频繁更新，但是内容的时效性并没有那么重要的场景。例如用户头像，微信的用户头像甚至你不点都不更新...

![stale-while-revalidate](/blog/imgs/pwa/stale-while-revalidate.gif)

### Cache & network race
不太常用，除非你的存储硬件有问题，一般 cache 都比 network 快。

![cache-and-network-race](/blog/imgs/pwa/cache-and-network-race.gif)

> 注意：因为在 `Promise.race` 中，一旦某个 promise 在完成前触发了 reject，将会导致整个 promise 触发 rejct。
> 所以以下是一种只有在所有 promise 都 reject 了才触发整体 reject 的实现。

```js
// Promise.race is no good to us because it rejects if
// a promise rejects before fulfilling. Let's make a proper
// race function:
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    // make sure promises are all promises
    promises = promises.map(p => Promise.resolve(p))
    // resolve this promise as soon as one resolves
    promises.forEach(p => p.then(resolve))
    // reject if all promises reject
    promises.reduce((a, b) => a.catch(() => b))
      .catch(() => reject(Error('All failed')))
  })
}

self.addEventListener('fetch', function(event) {
  event.respondWith(
    promiseAny([
      caches.match(event.request),
      fetch(event.request)
    ])
  )
})
```

### Cache then network
先返回缓存（如果有的话），再返回网络数据。

适用于内容频繁更新的场景，但是由于会返回【两次】数据，注意别影响到用户正在阅读或交互的内容。

例如 twitter、微博的场景，由于新内容会添加在旧内容的上面，同时会调整页面滚动的位置，所以用户不会感觉异常。

![cache-then-network](/blog/imgs/pwa/cache-then-network.gif)

### ServiceWorker-side templating
甚至可以在 sw 侧进行模板渲染。

![sw-side-templating](/blog/imgs/pwa/sw-side-templating.gif)

## 问题
### Q: 在 `install` 时预缓存有没有必要？反正可以在请求后保存下来，而且还担心多缓存了内容。
A: ?

![on-install-as-deps](/blog/imgs/pwa/on-install-as-deps.gif)
作为依赖时，页面将等待资源加载完成。

![on-install-not-as-deps](/blog/imgs/pwa/on-install-not-as-deps.gif)
不作为依赖时，将并发加载。可用于大资源的加载，如游戏的后续关卡的资源。

### Q: 为什么在安装后，不默认直接激活？即为什么需要 `activate` 这个生命周期？
A: 因为有可能此时还有上一版本的旧 sw 正在运行！

若是直接激活，此时可能还有旧缓存，假设我们修改了存储数据的格式，比如新增了字段。若是直接使用新 sw，数据不一致则很可能出错。所以在 `activate` 这个周期中，需要做好数据清理和数据迁移的工作。

![on-activate](/blog/imgs/pwa/on-activate.gif)

> 注意：处于 `activate` 周期时，`fetch` 事件将被放在等待队列里，所以注意别进行耗时操作，不然将阻塞页面加载。









如果暂时没实现全站离线访问，可以先通过按钮（稍后阅读、离线保存），使得用户主动缓存一些资源。
![on-user-interaction](/blog/imgs/pwa/on-user-interaction.gif)

> cache storage 这个 api 可以脱离 sw 单独使用。





### 在推送消息时
在用户同意接受推送消息后，甚至在没有打开网页的情况下也能通过系统的消息服务接收到推送消息。（sw 需要被激活）

适用于通知消息提醒，突发新闻、email、日历日程的更改等等。

![on-push-message](/blog/imgs/pwa/on-push-message.gif)
![on-push-message](../blog/imgs/pwa/on-push-message.gif)

> 注意：在发送推送消息时，用户是在线的，但是点击推送消息时不一定在线！

所以最好在收到推送消息时就缓存该内容，否则用户点击了推送消息，又没有内容，同时该提醒又消失了（没有入口了），这样的用户体验很不好。

twitter app 的反面例子。

https://youtu.be/0i7YdSEQI1w



### 在后台更新时
在用户同意后台更新后，在 sw 激活的情况下，可以进行一次或以一定的时间间隔在后台更新数据。

适用于非紧急更新，尤其是那些对于每次发推送消息就更新来说太频繁的，周期性操作，比如时间线或新闻的更新。

![on-background-sync](/blog/imgs/pwa/on-background-sync.gif)













## 参考资料
* [google 文档][1]
* [百度 lavas][2]
* [offline-cookbook][3]

* PWA之Workbox缓存策略分析  https://juejin.im/post/5a28e6ea51882558513296b4

[1]: https://developers.google.cn/web/progressive-web-apps/
[2]: https://lavas.baidu.com/pwa
[3]: https://jakearchibald.com/2014/offline-cookbook/
