## Architecture

### Overview

The **State Management** with ngrx is the centerpiece of the Front-End architecture.

It implements a reactive, event-driven approach with separation of concerns principle in mind (MVC concept).

The **REST API** and **ORM Entities** are the backbone of the Back-End with an in-memory database.

The **DUAL Store Design** connects "Entity Cache" and custom "State"s via complex "Selector"s.

```

                                           Action   ┌───────────────┐  [alters]   ┌──────────────────────────┐
                                 ┌────────────────> │    Reducer    ├───────────> │  State (ids, misc data)  │
                                 │                  │  (controller) │             │          (model)         │
                                 │                  └───────────────┘             └─────────────┬────────────┘
                                 │                                                              │
┌───────────┐   Method   ┌───────┴──────┐  Action   ┌───────────────────────┐                   │
│ Component ├──────────> │   Service    ├─────────> │      Entity Cache     ├──┐                │
│  (view)   │ <──────────┤ (controller) │ <───┐     │ (controller + model)  │  │                │
└───────────┘ Observable └───────┬──────┘     │     └───────────┬───────────┘  │                │
            (into Signals)    ^  │            └─────────────────┴<──────────────────────────────┘
                              │  │         Selector (merging multiple states)  │
                              │  │                                    ┌────────┘
                              │  │  Action  ┌─────────────────┐       │         ┌──────────────────────────┐
                              │  └────────> │     Effects     ├──────>┴───────> │         Back-End         │
                              │             │   (controller)  │   HTTP request  │ (REST API, ORM entities) │
                              │             └────────┬────────┘                 └──────────────────────────┘
                              └──────────────────────┘
          new Action (i.e., follow-up operations for Entity Cache, Reducer or Effects)

```

### Workspace

As both front-end and back-end are to be written in the same language and managed with the same tools, I decided to implement the project as monorepo using [Nx workspace](https://nx.dev) for the opportunity of additional monorepo-related features.

These tools are available workspace-wide:

- Eslint, Stylelint (linting)
- Prettier (formatting)
- TypeScript language tools
- Angular, NestJS, Nx scripts and schematics (code generation)
- Git (version control)

```
├── apps
│   ├── fleet-backend
│   │   ├── src
│   │   └── project.json (NestJS config)
│   └── fleet-webapp
│       ├── src
│       └── project.json (Angular config)
├── dist
│   ├── fleet-backend
│   └── fleet-webapp
├── docs
├── nx.json (workspace Nx config)
└── package.json
```

### Back-End

The back-end is implemented with NestJS using standard practices.

- imports static data
- generates randomized data
- provides APIs to retrieve data from in-memory database
- provides APIs to retrieve aggregated data

```
src
├── app
│   ├── common
│   │   ├── dto (abstract and reusable)
│   │   └── entities (abstract and reusable)
│   ├── modules
│   │   └── vehicles
│   │       ├── controllers (REST API and Swagger definitions)
│   │       ├── dto (with validations)
│   │       ├── entities (with ORM definitions)
│   │       ├── loaders (data loaders and generators)
│   │       ├── mappers (dto <--> entities)
│   │       ├── services (operations and repository access)
│   │       └── vehicles.module.ts
│   └── app.module.ts
└── main.ts
```

### Front-End

The front-end is implemented using Angular 21 using standard and personal best practices.

- good looking and **intuitive UI/UX**
- **DUAL state management design** (entity cache + id references) with complex selectors
  - entity cache: caches data objects even if they are not used at a given time to boost UX whenever they get displayed again (even when newer versions are getting loaded in the background)
  - id references: custom store actions and states are referencing which cached data objects are to be displayed alongside simple state variables, i.e. loading, loaded, page size,...
  - reducer functions alter data of a state
  - effects: any non-state-altering operations such as HTTP requests are handled here, with complex asynchronous processing as managed action streams
  - complex selectors: merge references with their respective cached entities
  - router-store: connected with state management to act on url changes
  - store-devtools: track actions and state changes using a redux browser extension
- strict **separation of concerns** by MVC concept
  - Model (models and ngrx states)
  - View (components)
  - Controller (navigation, effects, reducer functions, helper functions, resolvers)
- well-structured modular **SCSS**
  - modular structure (using @use directive)
  - singular file as entry points (global + component imports)
  - material styling via API-based variables for custom appearance
  - various custom styles, mixins, variable

```
src
├── app
│   ├── components
│   │   ├── core
│   │   │   ├── footer
│   │   │   ├── header (extends sidenav)
│   │   │   ├── sidenav
│   │   │   ├── title-bar (dynamic page title)
│   │   │   └── toast (notifications, mainly on http requests)
│   │   └── main
│   │   │   ├── dashboard-page (real-time features)
│   │   │   ├── documentation-page (assignment info)
│   │   │   ├── search-page (parametrized query features)
│   │   │   └── welcome-page (tech-stack overview)
│   │   └── vehicles
│   │       ├── vehicle-card (reusable data display component)
│   │       ├── vehicles-page (simple data list)
│   │       └── vehicle-detail-page (joint data from multiple sources)
│   ├── helpers (any helpful functions to keep other places tidy)
│   ├── models (interfaces mirroring dto classes from the back-end)
│   ├── options (library configs)
│   ├── resolvers (data loaders for components)
│   ├── services (view-related operations)
│   │       └── data (back-end-related operations)
│   ├── store (state management config, entity cache with local + CRUD operations)
│   │       ├── core (global effects)
│   │       ├── vehicle-logs
│   │       ├── search (relates to vehicle-logs for the search-page)
│   │       └── dashboard (relates to vehicle-logs for the dashboard-page)
│   ├── app.component.ts (main layout)
│   ├── app.config.ts (main config)
│   ├── app.routes.ts (routing config)
├── styles
│   ├── common (global custom styles)
│   ├── material (global material theming)
│   ├── shared (singular entry point for component imports)
│   └── styles.scss (main entry point for styles)
└── main.ts
```

For state management, a collection of ngrx packages is used:

- @ngrx/store (core features)
- @ngrx/data (entity cache for DUAL store design)
- @ngrx/entity (performance-oriented management of large data sets)
- @ngrx/effects (complex and asynchronous operations)
- @ngrx/router-store (connect to angular routing)
- @ngrx/store-devtools (connect to browser plugin)
- @ngrx/schematics (useful CLI commands)
- @ngrx/eslint-plugin (additional eslint rules)
- @ngrx/operators (additional rxjs operators)
