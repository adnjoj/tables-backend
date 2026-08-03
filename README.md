# Tables – Server

Backend service for the **Tables** online conference and communication platform. Built with [NestJS](https://nestjs.com/), it provides user authentication, real‑time messaging with **Signal Protocol** end‑to‑end encryption, and WebRTC for video conferencing.

## Features

- **User registration & authentication** – email/password sign‑up and login with JWT.
- **End‑to‑end encrypted messaging** – messages are encrypted using the [Signal Protocol](https://signal.org/docs/), ensuring that only participants can read them.
- **Video conferencing** – WebRTC with server‑side signaling.
- **Contact management** – add/remove contacts, presence status.
- **Scalable** – designed to support multiple concurrent rooms and calls.

## Tech Stack

- [NestJS](https://nestjs.com/) – progressive Node.js framework.
- [TypeORM](https://typeorm.io/) – ORM for SQL databases.
- [Passport](http://www.passportjs.org/) – authentication (local + JWT strategies).
- [JWT](https://jwt.io/) – stateless authentication.
- [Socket.IO](https://socket.io/) – WebSocket for signaling and real‑time events.
- [WebRTC](https://webrtc.org/) – peer‑to‑peer video/audio communication.
- [libsignal](https://github.com/signalapp/libsignal) – Signal Protocol implementation.
- [class-validator](https://github.com/typestack/class-validator) – DTO validation.