// title: 内存诊断
// author: Bruce
// date: 2016/6/6

# 内存诊断（Memory Diagnosis）

```原文地址：https://developers.google.com/web/tools/chrome-devtools/profile/memory-problems/memory-diagnosis?hl=en```

有效的内存管理是性能的关键。相同的，本地应用(native applications)和网页应用(web apps)都能受到来自内存的泄漏和膨胀，他们（内存泄漏和膨胀）也同样会在垃圾回收停顿期被处理。

---

内存泄漏是可用的计算机内存逐渐地丢失。内存丢失发生在一个程序不断地错误的返回已分配的临时内存。当你认为你有一个内存泄漏时，跟着下面的调查步骤内容大纲。

**内容大纲**
* 检查页面是否使用了太多的内存
* 发现没有被垃圾回收清理干净的对象
* 缩小内存泄漏的原因
* 确定垃圾回收频率
* 内存分析资源

**老子不想看这么长的文章，请看这里**
* 通过Chrome任务管理器的内存列快速地看一看页面是否正在消耗大量内存。
* 使用Chrome开发者工具的内存视图确定内存使用是否正在增长。
* 使用Chrome开发者工具的heap profiler识别出仍然留存在内存中的分离节点。
* 留意频繁的垃圾回收和垃圾回收停顿期。频繁的垃圾回收和垃圾回收停顿期会影响性能。

## 检查页面是否使用了太多的内存（Check if page uses too much memory）

检查页面是否使用了太多的内存,首先要做的是找出一系列你怀疑是正在泄漏内存的行为。任何的来自站点导航、悬停、点击或者其他莫名其妙的交互,随着时间的推移在某种程度上似乎都会对性能产生负面的影响。

一旦你怀疑有性能问题，当你开始注意到页面在长期的使用后变得缓慢，使用Chrome开发者工具Timeline去诊断过度的内存占用(内存使用率)。

**注解**
* 内存管理菜鸟？先从基础的内存专业术语开始。

### 使用Chrome任务管理器监视内存使用（Monitor memory using Chrome task manager）

使用Chrome任务管理器监视一个页面的活动内存占用（live memory usage)。

通过 '菜单->更多工具->任务管理器' 或 'Shift+Esc' 打开任务管理器。

打开后，在列的头部（任务标题栏）右击鼠标，在弹出的列表中勾选JavaScript使用的内存。执行一些可能会使用大量内存的行为并监视活动内存的变化情况：

![](/article/memory_diagnosis/task-manager.png)

### 使用内存视图确定内存占用是否正在增长（Determine if memory usage is growing using memory view）

诊断是否有内存的问题，可以在Timeline面板上观察内存视图。点击记录按钮并且和你的应用交互,重复执行任何你觉得可以引起一个内存泄漏的步骤。停止纪录。

你可以看到应用程序的内存分配曲线图。随着时间的推移，如果内存消耗的越来越多（没有任何下降），这是一个迹象表明你可能有内存泄漏：

![](/article/memory_diagnosis/normal-sawtooth.png)

一个健康的应用轮廓图应该看起来像一个锯齿形曲线，因为内存被分配，接着，当垃圾回收介入时释放内存。有一些事情是不用去担心的－JavaScript本身一直会有一个开销成本在做一些事情，甚至一个空的requestAnimationFrame也会引起一个锯齿形的曲线，你不可能避免他。

仅仅确保曲线图不是陡峭的,陡峭的曲线图表示正在进行大量的分配操作，换而言之,这可以等同于产生大量的垃圾。你需要留意的是曲线图倾斜度的增长率。

![](/article/memory_diagnosis/steep-sawtooth.png)

这里也有一个DOM节点计数器、文档计数器和事件监听计数在内存视图中，这些数据在一个诊断期是非常有用的。DOM节点使用本地内存(native memory)且不会直接地影响JavaScript内存曲图表。

一旦你怀疑有一个内存泄漏，使用heap profiler和对象分配追踪器去发现泄漏源。

**例子：**尝试这个[内存增长](https://github.com/GoogleChrome/devtools-docs/blob/master/docs/demos/memory/example1.html)的例子，在哪里，你可以练习如何有效地使用Timeline的内存模式。

## 发现没有被垃圾回收清理干净的对象（Discover objects not cleaned up by garbage collection）

使用Chrome开发者工具Profiles面板的Heap profiler来发现没有被垃圾回收清理干净的对象。

heap profiler显示了你页面上JavaScript对象和相关DOM节点的内存分配。这有助于发现因忘记了分离的DOM子树造成的不可见泄漏。

使用heap profiler获取JS heap快照、分析内存曲线图、对比快照并检测DOM泄漏（查看[如何记录heap快照](https://developers.google.com/web/tools/chrome-devtools/profile/memory-problems/heap-snapshots)）。

这里有大量的数据在‘Constructor’和‘Retained Size’列。在引起一个内存泄漏时，有着最短距离的留存对象通常是你的第一候选对象。留存的对象在窗口中按照距离进行了排序，从第一个留存对象开始你的内存泄漏调查。

![](/article/memory_diagnosis/first-retained.jpg)

且留意黄色和红色对象在你的heap快照中。红色节点（有一个深色背景）表示没有来自JavaScript到他们的直接引用，他们还存活着是因为他们是分离的DOM树的一部分。他们可能是JavaScript引用的一个树的节点（可能是一个闭包或者变量），但他恰巧阻止了整个DOM树被垃圾回收。

![](/article/memory_diagnosis/red-yellow-objects.jpg)

黄色节点（有一个黄色背景）表示有来自JavaScript的直接引用。寻找在同一个分离的DOM树中的黄色节点去定位到来自你JavaScript的引用。那里可能是一个属性的链式调用从window到元素（例如：window.foo.bar[2].baz）。

观察下面的动画，以理解分离的节点在整个图片中的变化：

![](/article/memory_diagnosis/detached-nodes.gif)

**例子：**尝试这个[分离的节点](https://github.com/GoogleChrome/devtools-docs/blob/master/docs/demos/memory/example4.html)例子，在哪里，你可以在Timeline观察节点的演变，接着获取heap快照来找到分离的节点。

## 缩小内存泄漏的原因（Narrow down causes of memory leaks）

使用对象分配跟踪器在运行时查看js对象分配来缩小内存泄漏的原因。**对象跟踪器**将堆探查器的详细快照信息与时间轴面板的增量更新和跟踪结合起来。

跟踪对象堆分配分析涉及开始一个记录，执行一系列动作，然后停止记录。对象跟踪器会周期性的（差不多每隔50ms）获取堆快照在整个记录期中和一个最终的快照在记录结束时。堆分配图表显示了正在创建的对象和标识的留存路径：

![](/article/memory_diagnosis/allocation-tracker.png)

学习如何使用这个工具见‘[如何使用分配探查器工具](https://developers.google.com/web/tools/chrome-devtools/profile/memory-problems/allocation-profiler)’。

## 确定垃圾回收频率（Determine garbage collection frequency）

垃圾回收器（例如V8）需要能够找出你的应用中存活的、被认为死亡的（垃圾）和无法取到的对象。如果你是频繁地GC回收，可能是你分配操作太频繁了。

观察垃圾回收间歇同样重要。如果**垃圾回收**漏掉了任何由于你js中的逻辑错误产生的死亡对象，那么内存会被这些不可回收的对象消耗掉。随着时间的推移，这最终会降低你应用的速度（看‘[如何使用分配探查器工具](https://developers.google.com/web/tools/chrome-devtools/profile/memory-problems/allocation-profiler)’）。

这经常发生在你的代码中诸如某些变量和事件监听已经不在需要使用了，但是任然被一些代码引用着。当这些引用被保持着，这些对象不能够被GC正确的清理。

记得检查并取消可能在整个生命周期中被更新／销毁地DOM元素引用的变量。检查对象属性，他们可能引用了其他对象（或者其他DOM元素）。确定对变量缓存保持了关注，他们可能随着时间慢慢最大。

Remember to check and nullify variables that contain references to DOM elements which may be getting updated/destroyed during the lifecycle of your app. Check object properties which may reference other objects (or other DOM elements). Be sure to keep an eye on variable caches which may accumulate over time.

## 内存分析资源（Memory Profiling Resources）

下面是一些好的测试各种内存问题的例子:
* [例子1:增长内存](https://github.com/GoogleChrome/devtools-docs/blob/master/docs/demos/memory/example1.html)
* [例子2:垃圾回收运转](https://github.com/GoogleChrome/devtools-docs/blob/master/docs/demos/memory/example2.html)
* [例子3:分散的对象](https://github.com/GoogleChrome/devtools-docs/blob/master/docs/demos/memory/example3.html)
* [例子4:分离的节点](https://github.com/GoogleChrome/devtools-docs/blob/master/docs/demos/memory/example4.html)
* [例子5:内存和隐藏的类](https://github.com/GoogleChrome/devtools-docs/blob/master/docs/demos/memory/example5.html)
* [例子6:泄漏DOM节点](https://github.com/GoogleChrome/devtools-docs/blob/master/docs/demos/memory/example6.html)
* [例子7:Eval是evil(几乎总是)](https://github.com/GoogleChrome/devtools-docs/blob/master/docs/demos/memory/example7.html) 
* [例子8:记录堆分配](https://github.com/GoogleChrome/devtools-docs/blob/master/docs/demos/memory/example8.html)
* [例子9:DOM的泄漏比预期更大](https://github.com/GoogleChrome/devtools-docs/blob/master/docs/demos/memory/example9.html)
* [例子10:留存路径](https://github.com/GoogleChrome/devtools-docs/blob/master/docs/demos/memory/example10.html)
