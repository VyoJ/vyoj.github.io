---
layout: page
title: HyperCluster
description: Running large language models across a peer-to-peer cluster of edge devices
img:
importance: 4
category: research
related_publications: true
---

**HyperCluster** is my capstone project: a fully decentralized framework for running LLM inference across a cluster of ordinary edge devices connected over a wireless network, with no coordinating server.

The memory footprint of a modern LLM is the obvious problem — no single phone or laptop in the cluster can hold the whole model. HyperCluster addresses this with two pieces:

**Ring-based pipelined inference.** Nodes deterministically self-organize into a computational ring ordered by device capability. Each node runs its shard and passes intermediate hidden states directly to its successor, so activations never round-trip through a central coordinator.

**Generalizable model sharding.** Built on top of HuggingFace Transformers, the sharding layer automatically partitions any dense LLM across heterogeneous devices according to the compute and memory each one actually has available — rather than assuming a uniform cluster.

Peer discovery and P2P transport are handled with [Iroh](https://www.iroh.computer/), so nodes find each other and form the ring without manual configuration.

The work draws on ideas from [exo](https://github.com/exo-explore/exo) for sharding and [prima.cpp](https://github.com/Lizonghang/prima.cpp) for ring pipeline architectures.

- Paper: {% cite samarth2026hypercluster %}
