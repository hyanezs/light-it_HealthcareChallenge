# Backend Application

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
![Prerequisite](https://img.shields.io/badge/docker-%3E%3D4.20.0-blue.svg)

## Available scripts

### Dockerized

#### Prerequisites

- docker >=4.20.0

#### Build

```sh
docker compose build
```

#### Run

```sh
docker compose up
```

### Run app locally

#### Prerequisites

Either dockerized or locally

- postgreSQL >= 15.0
- redis >= 7.0

Set environment variables in .env file. (see [./docker-compose](./docker-compose.yml) for reference)

#### Install

```sh
yarn
```

#### Run

```sh
yarn start
```

Starts api development server at http://localhost:5000/

## Author

👤 **hyanezs**
