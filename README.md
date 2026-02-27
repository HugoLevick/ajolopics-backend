<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

NestJS template that includes:

- Authentication with JWT
- Role-based authorization
- TypeORM setup for Postgres (migrations, configuration)
- Swagger API documentation setup at `/docs`
- Custom decorators
- `Auth` and `Users` resources with user registration and login

## Setting Up The Environment

Before you take these steps, you need to have a PostgreSQL instance up and running, and create a database that the app will use.

After that, follow these steps

- Install all related npm packages

```bash
$ npm install
```

- Make a copy of `.env.template` and rename it to `.env`
- In the newly created `.env` file, fill up the environment variables required:

  - `DB_HOST`: Address for the database host
  - `DB_PORT`: Port for the database host
  - `DB_USER`: User that can access the database
  - `DB_PASS`: Password for that user
  - `DB_NAME`: Name of the database created for the application
  - `JWT_SECRET`: Secret string of characters used to sign the JWTs
  - `PORT`: Port where the application will run locally

- After saving the changes, go into a terminal to run the initial migration. This will create the tables and columns the app needs. For more information about migrations, refer to [Migrations](#migrations).

```bash
$ npm run migration:run
```

## Running the app

```bash
# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Migrations

Migrations in TypeORM are files with SQL queries to update a database schema and apply new changes to an existing database.

This project supports several TypeORM commands that help with migration handling.

- `npm run migration:run`: Runs the all of the pending migrations against the database.
- `npm run migration:revert`: Reverts the latest migration ran.
- `npm run migration:generate ./src/migrations/migrationName`: Generates a migration based on the current state of the database and the schema changes in the source code.

TypeORM also has documentation about migrations [here](https://typeorm.io/docs/migrations/why/.)
