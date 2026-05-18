# Dataverse VAST Suite
**Versatile Automated Synthetic Testing**

Welcome to the Dataverse VAST Suite. This repository serves as the centralized, enterprise-grade end-to-end (E2E) testing framework for IQSS Dataverse and its ecosystem integrations. 

Leveraging Playwright alongside stealth browser profiles, VAST provides a highly resilient, scalable scaffolding capable of bypassing aggressive anti-bot mitigations (such as Anubis). It is designed to seamlessly validate diverse deployments, providing unified coverage for everything from standard Dataverse installations to highly regulated 21 CFR Part 11 compliant environments.

## Prerequisites
Before initializing the suite, ensure your environment meets the following requirements:
* **Node.js:** It is **strongly recommended** that you use only Long Term Support (LTS) versions of Node.js to ensure framework stability.
* **Node Version Manager:** We **strongly recommend** using [nvm](https://github.com/nvm-sh/nvm) (or `nvm-windows`) to manage your Node installations and seamlessly switch between versions.

## Setup and Configuration

1. **Clone the Repository:** Clone this repository into an empty directory on your local machine or CI/CD server.
2. **Install Dependencies:** Navigate to the root directory and run the following command to provision the required packages:
   ```bash
   npm install
   ```
3. **Execute Tests:** You can trigger the automated test suites using the standard Playwright test runner. 
   ```bash
   npx playwright test
   ```
   *(Note: You can target specific environments using project flags, e.g., `npx playwright test --project=21cfrpart11` or `--project=standard`).*
4. **Configuration:** Global test behavior, environment variables, and project definitions are managed centrally within `./playwright.config.ts`.
5. **Extensibility:** The VAST suite is designed to be modular. Additional npm packages and ecosystem integrations can be installed and configured as your testing requirements evolve.
