# GiftRedeemACE

<p align="center">
  <img src=https://img.shields.io/badge/node-%3E=16-blue.svg alt="NodeJS Versions"/>
  <img src=https://github.com/zayne-siew/GiftRedeemACE/actions/workflows/eslint.yml/badge.svg alt="ESLint w Prettier" />
  <img src=https://github.com/zayne-siew/GiftRedeemACE/actions/workflows/node.js.yml/badge.svg alt="Node.js CI" />
</p>

## Description

GiftRedeemACE is an end-to-end solution that verifies and monitors gift redemptions for the various departments in the company.

The frontend consists of a simple webpage requiring the user to enter a valid staff pass ID. It then either directs the staff to redeem their team gift or rejects them, depending on the validity of the staff pass ID and the redemption status.

The backend consists of two parts. Upon instantiation, a staff mapping file is loaded and stored locally on the server, which listens for redemption requests. Upon receiving one, it updates the redemption data and decides how to process the request accordingly.

## Features

- Usage of Mutex: Allows the server to handle multiple requests concurrently without fear of race condition.
- Server-wide Logging: Automated monitoring of requests for easier debugging.
- CI/CD: Fully-linted code with integrated unit tests server-side, fully configured on the GitHub repository.

## Installation

To start, clone the entire project into your local environment (important: keep the project structure intact!).

Start the server on localhost via the terminal; navigate to the root folder and execute

```
cd server
npm i
npm run serve
```

Open one (or more) "client" web page(s) locally and use the forms to submit requests to the server.

## Acknowledgement

This project is a submission for the take-home assignment for GovTech GDS-ACE Internship (Summer 2024).
