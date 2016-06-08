// title: RAIL性能模型
// author: Bruce
// date: 2016/6/8

# RAIL性能模型（The RAIL Performance Model）

*原文地址(需翻墙)：[https://developers.google.com/web/tools/chrome-devtools/profile/evaluate-performance/rail?hl=en](https://developers.google.com/web/tools/chrome-devtools/profile/evaluate-performance/rail?hl=en)*

*转载请注明出处：[https://bruce1i.gitbooks.io/fy-tech/content/topics/The_RAIL_Performance_Model.html](https://bruce1i.gitbooks.io/fy-tech/content/topics/The_RAIL_Performance_Model.html)*

RAIL是一个以用户为中心的性能模型。每个页面应用在他的生命周期中都如下4个不同的方面，并且他们以不同的方式影响着性能。

![](http://www.ued.life/article/The_RAIL_Performance_Model/rail.png)

> **内容大纲**
>
> 关注用户
>
> 响应：在100ms内给出响应
>
> 动画：每16ms进行帧渲染
>
> 空闲：最大化空闲时间
>
> 加载：1000ms内提供内容
>
> RAIL标准概要

> **老子不想看这么长的文章，请看这里**
>
> 关注用户，最终的目标不是让你的网站在任何特定的设备上执行的快速，而是让用户满意。
>
> 快速响应用户，在100ms内应答用户。
>
> 在16ms内渲染每一帧并以连贯性为目标，用户讨厌屏幕闪烁。
>
> 最大化主线程空闲时间。
>
> 保持用户的参与，在1000ms内提供交互内容。

## 关注用户（Focus on the user）

让用户的焦点放在你性能的表现上。用户花在你网站上的大部分时间不是等待网站加载，而是在等待使用时的响应。了解用户对性能延迟是何感觉：

延迟  | 用户反应
-----|------
0-16ms | 让屏幕每秒更新60次，这描绘了一帧到屏幕上的时间（Math教授说“1000/60 ~= 16”）。人们非常擅长运动跟踪，并且不喜欢不符合预期的运动，也不喜欢变化的刷新率或者周期性的卡顿。
0-100ms | 在这个时间内响应一个用户行为，会让用户觉得是一个即时的响应。超过100ms，会打破行为和反应之间的联系。
100-300ms | 用户可以感受到一个轻微的可察觉的延迟。
300-1000ms | 在这个时间内，会觉得是在持续的处理任务。对于网络上大多数用户，一个任务指的是加载页面或改变视图。
1000+ms | 超过1秒，用户会失去注意力在他们执行的任务上。
10,000+ms | 用户很沮丧并且可能放弃这个任务，这让他们可能不会再回来了。

## 响应：在100ms内给出响应（响应：在100ms内给出响应）

在用户注意到一个延迟之前，你有100ms的时间去响应用户的输入。这适用于任何输入，无论是点击一个按钮，触发表单，或开始一个动画。

如果你没有响应，会打破行为和反应之间的联系。会引起用户的注意。

虽然在100ms内是一个明显的立即地响应用户的行为，但并不总是正确的。用100ms时间做其他耗时多的工作，但是小心不要阻塞用户。如果可以，在后台调用工作。

对需要超过500ms完成的动作，总是提供反馈。

> **记住**
>
> 在16ms内响应用户的touchmoves和scrolling。

## 动画：每16ms进行帧渲染（Animation: render frames every 16ms）

动画是web应用不可避免的。例如，scrolling和touchmoves都是动画。你的用户是能够真实注意到动画刷新的变化。你的目标是每秒产生60帧，且每一帧都会经过下面这些步骤：

![](http://www.ued.life/article/The_RAIL_Performance_Model/render-frame.png)

从纯粹数学的角度来看，每一帧都有一个16.66ms的预算时间，但是，因为浏览器有自己内部事务要做，在一个动画周期实际只有10ms给你的代码运行。

像动画这样高压力点，关键是你能做什么和不能做什么，做最低限度的事。只要可能，利用100ms响应时间预计算耗时多的工作，最大限度的让你有机会达到60fps。

更多信息，查看[渲染性能](https://developers.google.com/web/fundamentals/performance/rendering/)。

## 空闲：最大化空闲时间（Idle: maximize idle time）

利用空闲时间完成延迟的工作。例如，保持一个最低限度的预加载数据，以便你的应用快速加载，并且利用空闲时间加载剩余数据。

延迟的工作应该被分成50ms的块组。在户开始交互，最高优先级是响应50ms的块组。

为了达到小于100ms的响应，在每小于100ms时间内应用程序必须转让控制给主线程，这样他可以执行他的像素管道，反应给用户输入，等等。

在50ms块工作允许任务完成同时保证立即响应。

## 加载：1000ms内提供内容（Load: deliver content under 1000ms）

在1秒内加载你的站点。如果没有，用户会注意力分散，并会认为这里有一个任务处理坏掉了。

集中在[优化关键的渲染路径](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/)去除渲染阻塞。

你不需要把所有的东西都在1秒内加载，去产生一个完全加载的感觉。能够逐渐的渲染并把一些工作放在后台去做。将不是必须加载的内容延迟到周期性的空闲时间中去（看这个[网站性能优化Udacity课程](https://www.udacity.com/course/website-performance-optimization--ud884?_ga=1.77309589.1043781690.1464589194)了解更多信息）。

## RAIL标准概要（Summary of key rail metrics）

依据RAIL标准来评估你的网站，使用Chrome开发者工具[Timeline tool](https://developers.google.com/web/tools/chrome-devtools/profile/evaluate-performance/timeline-tool)记录用户行为。然后依据RAIL标准去检查Timeline里的时间记录：

RAIL步骤  | 关键指标 | 用户行为
---------|---------|--------
响应(Response) | 输入延迟(从点击到绘画) < 100ms | 用户点击一个图标或者按钮（例如，打开导航菜单）。
响应(Response) | 输入延迟(从点击到绘画) < 100ms | 用户拖动他们的手指，应用的响应是关联在他们手指的位置（例如，下拉刷新，滑动滚动）。
动画(Animation) | 输入的初始响应时间(从点击到绘画) < 100ms | 用户开始滚动页面或者动画开始。
动画(Animation) | 在16ms内完成每一帧的工作（JS到绘画） | 用户滚动页面或者看见一个动画。
空闲(Idle) | 主线程JS工作块不大于50ms | 用户没有和页面进行交互，但主线程应该是足够可用的处理下一个用户输入。
加载(Load) | 1秒后页面应该可用 | 用户加载页面并看见关键路径内容。
加载(Load) | 满足整个页面加载过程中的响应目标 | 用户加载页面并且开始交互。（例如，滚动或或者打开导航）。