# InventSaas Solution's Repository

This repository holds the source code for the InventSaas Solution's frontend and backend. The frontend is built using React and the backend is built using NodeJS, both taking advantage of TypeScript.

## Features

The InventSaas application provides the following features:

- User registration and login
  - Administrators and employees can be part of a Store
- Store management
- Product management
- Inventory management
- Sales management
- Purchases management

## Technologies

### Frontend

As mentioned, the frontend is developed in React using TypeScript. Moreover, we combined the following libraries for nice looking UI components:

- Ant Design
- Chart.js

### Backend

The backend is developed in NodeJS (Express) using TypeScript. It connects to a PostgreSQL database, and a Redis server for caching. The backend is also responsible for sending emails using SendInBlue.

## Getting Started

### Install Docker

The easiest way to get started is to install Docker. You can find the installation instructions for your operating system [here](https://docs.docker.com/get-docker/).

After installing Docker, you can run continue with the following steps.

### Clone the repository

Clone the repository using the following command:

```bash
git clone https://github.com/ArqSoftPractica/Cagnoli-Juan-Yanez.git
```

This will create a folder called `Cagnoli-Juan-Yanez` with the source code inside, in your local machine.

### Create and run the application

To create and run the application, you can use the following command:

```bash
docker-compose up -d
```

This will create a docker application called Inventsaas_CJY the following containers, in the background:

- `inventsaas-frontend`: The frontend application
- `inventsaas-backend`: The backend application
- `inventsaas-postgresql`: The PostgreSQL database
- `inventsaas-redis`: The Redis server

### Access the application

After running the application, you can access it using the following URL:

[http://localhost:3000](http://localhost:3000)

### Stop the application

To stop the application and remove the containers, you can use the following command:

```bash
docker-compose down
```

## Stress Testing

To stress test the application, we used JMeter. The test plan can be found in the `./stress_testing` folder. To run it, you need to have JMeter installed. You can find the installation instructions for your operating system [here](https://jmeter.apache.org/download_jmeter.cgi).

## Authors

- Francisco Cagnoli
- Andrés Juan
- Hernán Yañez

Version 1.0