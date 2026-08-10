---
layout: page
title: Llama.cpp on z/OS
description: Porting local LLM inference to IBM mainframes with zopencommunity
img:
importance: 2
category: work
---

Selected by IBM for the **Global Remote Mentoring Project** to contribute to the [zopen community](https://zopen.community/), which maintains open-source ports for z/OS. The goal was private, on-device AI inference on enterprise mainframes — no data leaving the box.

Both contributions are merged into [`zopencommunity/llamacppport`](https://github.com/zopencommunity/llamacppport):

- **[Port llama.cpp to z/OS](https://github.com/zopencommunity/llamacppport/pull/3)** — the initial port, achieving a **92% pass rate** on the core test suite. Also built a proof of concept demonstrating practical AI use cases and MCP functionality on the platform.
- **[Enable automatic endianness conversion, SIMD & MASS support](https://github.com/zopencommunity/llamacppport/pull/4)** — integrated acceleration libraries, improving token generation and prompt processing speed by **10%**.

The interesting problem here is **endianness**. IBM Z is big-endian, while essentially every open LLM checkpoint ships little-endian, so the weights are byte-swapped from the machine's point of view. Getting inference working meant handling that conversion rather than assuming the host layout — alongside the usual porting friction around compilation and threading on a platform llama.cpp had never targeted.
