// title: 解决内存问题
// author: Bruce
// date: 2016/6/6

# 解决内存问题（Fix Memory Problems）

###### *原文地址(需翻墙)：[https://developers.google.com/web/tools/chrome-devtools/profile/memory-problems/?hl=en](https://developers.google.com/web/tools/chrome-devtools/profile/memory-problems/?hl=en)*

###### *转载请注明出处：[https://bruce1i.gitbooks.io/fy-tech/content/Fix_Memory_Problems.html](https://bruce1i.gitbooks.io/fy-tech/content/Fix_Memory_Problems.html)*

内存丢失发生在一个程序不断地错误的返回已分配的临时内存。留意内存泄漏、膨胀和强制垃圾回收。

---

如今的js引擎有着非常高的能力去自动清理**一些**我们在代码中产生的垃圾。这就是说，代码中产生的垃圾只能够清理到一定的程度，并且我们的应用还是容易产生因逻辑错误造成的内存泄露。使用可用的工具找到你的瓶颈；并且记住，不要猜测，而是测试。

---

##### 主题

[内存诊断（Memory Diagnosis）](https://developers.google.com/web/tools/chrome-devtools/profile/memory-problems/memory-diagnosis?hl=en)

[内存专业术语（Memory Terminology）](https://developers.google.com/web/tools/chrome-devtools/profile/memory-problems/memory-101?hl=en)

[如何记录堆快照（How to Record Heap Snapshots）](https://developers.google.com/web/tools/chrome-devtools/profile/memory-problems/heap-snapshots?hl=en)

[如何使用分配探测器工具（How to Use the Allocation Profiler Tool）](https://developers.google.com/web/tools/chrome-devtools/profile/memory-problems/allocation-profiler?hl=en)