# Debug and Test an HR SaaS 💻

Billed is a company that produces SaaS solutions for human resources teams. It consists of two user paths: the HR administrator side and the employee side. The aim of the project was to improve the employee's career path and make it more reliable by fixing bugs and writing tests.

## Developed Skills 💼
- Debugging a web application
- Writing a manual E2E test plan
- Writing integration tests with JavaScript
- Writing unit tests with JavaScript

## Description 📄
The app had already been developed, the code as well as a description of several bugs were provided. The objective was to fix bugs identified in a bug report provided by Jest, order bills by date, and ensure the admin can navigate to the dashboard page after correct login.

## Objectives 🎯
- BUG REPORT: Fix bugs identified in bug report provided by Jest.
- BUG HUNT: Identify and solve more bugs.
- UNIT & INTEGRATION TESTS: Increase coverage, cover all statements except back-end firebase calls.
- E2E TEST: Write an E2E test plan for the employee flow.

## Requirements 📋
- Entirely cover Bills and NewBill files with tests
- Use of Jest and Testing Library
- Written E2E test plan
- Generate Jest coverage report

## Challenges & Achievements 🏆
- Writing a mock to replace Firestore functionality
- Applying Jest spyOn functionality

## How to Run the App Locally 🔧

1. Clone the project:
```bash
$ git clone https://github.com/AdrianGeorgeM/Debug-and-Test-an-HR-SaaS
```
2. Navigate to the cloned repository:
```bash
$ cd Debug-and-Test-an-HR-SaaS
```
3. Install npm packages (described in package.json):
```bash
$ npm install
```
4. Install live-server to run a local server:
```bash
$ npm install -g live-server
```
5. Launch the App:
```bash
$ live-server
```
6. Open a browser and navigate to:
```bash
http://127.0.0.1:8080/
```

## How to Perform Tests 🔍

- To run all tests with Jest:
```bash
$ npm run test
```
- To run a single test:
  * Install jest-cli:
  ```bash
  $npm i -g jest-cli
  ```
  * Run your test file:
  ```bash
  $jest src/__tests__/your_test_file.js
  ```

- To view test coverage, open a browser and navigate to:
```bash
http://127.0.0.1:8080/coverage/lcov-report/
```