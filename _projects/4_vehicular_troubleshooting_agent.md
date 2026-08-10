---
layout: page
title: Vehicular Troubleshooting Assistant for Bosch
description: Voice-based multilingual RAG agent for field technicians
img:
importance: 1
category: work
---

A six-month project under the **Bosch University Connect Program**, a collaboration between Bosch and the Centre of Cognitive Computing and Computational Intelligence (C3I) at PES University.

Field technicians diagnosing vehicle faults can't stop to type queries into a laptop — their hands are busy and the reference material they need is buried in long service manuals. We built a voice-based, multilingual generative AI chatbot that provides **Vehicular Troubleshooting Assistance (VTA)**: a technician describes the symptom out loud, in their own language, and the system retrieves the relevant diagnostic procedure and reads it back.

The retrieval side is a RAG pipeline over Bosch service documentation. Multilingual support mattered a great deal here — the technicians who most need this are not working in English, and translating queries into English before retrieval loses too much of the domain vocabulary.

We later deployed an agentic version built with **LlamaIndex** and **FastAPI**, which could chain diagnostic steps rather than answering each question in isolation.
