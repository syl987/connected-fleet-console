# ConnectedFleetConsole

Fictional project for managing and retrieving data as well as showcasing data aggregation and state management.

Features `Vehicle` and associated `Log` entities for display and processing.

## Getting Started

Make sure you have a recent version of [Node.js](https://nodejs.org) installed, including `npm` package manager (included).

To install necessary packages to run the apps, use:

```sh
npm ci
```

To run the backend on a dev server at http://localhost:3000/api, use:

```sh
npx nx serve fleet-backend
```

To run the webapp on a dev server at http://localhost:4200/, use:

```sh
npx nx serve fleet-webapp
```

## Run tasks

To create a production bundle:

```sh
npx nx build fleet-webapp && npx nx build fleet-backend
```

To see all available targets to run for the backend, run:

```sh
npx nx show project fleet-backend
```

To see all available targets to run for the webapp, run:

```sh
npx nx show project fleet-webapp
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

### Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Additional Documentation

Additional project documentation is available within the webapp as well as here:

- [Architecture](docs/ARCHITECTURE.md)
- [Requirements](docs/REQUIREMENTS.md)
- [Progression](docs/PROGRESSION.md)
- [Features](docs/FEATURES.md)

## Development

### Current Issues

- invalid date format error: when passing a date string as query param to the search endpoint (http status 400)
- missing loading spinner if the vehicle list contains 1 element from entity cache after navigating from detail after a refresh
- missing loading spinner on search button
- missing loading spinner on server-side table pagination
