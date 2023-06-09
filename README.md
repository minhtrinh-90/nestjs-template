# About

This is my NestJS template with my preferred toolings, such as Prisma ORM, Passport, S3 upload support.

# Structure

## DB

Schema definition and seed script can be found in prisma folder.

## Source

In the src folder, code is organized by modules, as per NestJS convention.
The common folder contains definitions that can be shared between modules.

# Config

For database connection and other sensitive config, rename .env.example to provide the necessary environment variables.
For other less sensitive, check src/common/configs/config.ts

# Running the code

Install the dependencies. Then start the server by `npm run start:dev`.

# OpenAPI (Swagger)

OpenAPI interface is available at the server's _/docs_ url.

## Data types

API return types are auto-generated by Prisma in _src/\_gen/prisma-class_.
Do provide DTOs for body requirements with constraints.

# Database

## Docker Postgres

If needed a Dockerized Postgres DB instance can be start by running `npm run docker:db:up`.

## Initialize

Provide the postgres connection in .env file.
Run `npm run migrate:dev` or `npm run db:push` to initialize the database.

## Seed data

A sample seed script is provided at _prisma/seed.ts_.
To seed the database, run `npm run prisma:seed`. 1 admin & 1 user will be created, together with 50 samples posts.

**DO NOT RUN** seed on production database, as data will be lost.

## Studio

A web interface can be used to access the database by running `npm run prisma:studio`.

# AWS

## Config

AWS credentials is configured to be taken from the local computer's config file,
at either `~/.aws/credentials` or `~/.aws/config`. No sensitive information is committed to the source code.

Please provide your own profile and S3 bucket with the appropriate permission for upload functionality to work.

# Building for production

Use `npm run build` to build the code. Then `npm run start:prod` to start the production server.

# Linting

Pre-configured with prettier and eslint. Automatic import sorting with [simple-import-sort](https://github.com/lydell/eslint-plugin-simple-import-sort/).

# Shorthands

_@_ is mapped to the _src_ folder for imports.

# Testing

Sample tests provided for auth section, both unit & e2e tests.

# License

Released under MIT License. Feel free to change and use in your own project.

# Credits

This source base is heavily modified from [this template](https://github.com/marcjulian/nestjs-prisma).
