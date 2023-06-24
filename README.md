![Version](https://img.shields.io/badge/version-0.0.0-blue.svg?cacheSeconds=2592000)
![Prerequisite](https://img.shields.io/badge/docker-%3E%3D4.20.0-blue.svg)

# Light-it's Healthcare Challenge Repository

This repository holds the source code for Light-it's Healthcare challenge

## Features

The application provides the following features:

- User registration and login
- Symptoms evaluation
- Diagnosis history

## Technologies

### Frontend

The frontend is developed in React using TypeScript and Tailwind among other libraries.

### Backend

The backend is developed in NodeJS (Express) using TypeScript. It connects to a PostgreSQL database, and a Redis server for caching.

## Getting Started

### Install Docker

The easiest way to get started is to install Docker. You can find the installation instructions for your operating system [here](https://docs.docker.com/get-docker/).

After installing Docker, you can run continue with the following steps.

### Clone the repository

Clone the repository using the following command:

```bash
git clone https://github.com/hyanezs/light-it_HealthcareChallenge.git
```

This will create a folder called `light-it_HealthcareChallenge` with the source code inside, in your local machine.

### Create and run the application

To create and run the application, you can use the following command:

```bash
docker-compose up -d
```

This will create a docker application called healthcare_chg the following containers, in the background:

- `healthcare-frontend`: The frontend application
- `healthcare-backend`: The backend application
- `healthcare-postgresql`: The PostgreSQL database
- `healthcare-redis`: The Redis server

### Access the application

After running the application, you can access it using the following URL:

[http://localhost:3000](http://localhost:3000)

### Stop the application

To stop the application and remove the containers, you can use the following command:

```bash
docker-compose down
```

## Author

👤 **hyanezs**
