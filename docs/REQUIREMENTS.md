## Requirements

### Overview

- [ ] Real-time event monitoring
- [check] Browse events using various search parameters -> Search Page
- [ ] Quick overview of critical issues and affected vehicles
- [check] Implement as full-stack application (Angular + NestJS)

### Objectives

- [ ] Input and process logs (from a file or a stream)
- [check] Database storage with flexible querying and aggregation -> Vehicle, VehicleLog (linked entities)
- [ ] REST-API for logs with filters
- [ ] Implement aggregated views (e.g. errors per vehicle, per code, per time range)
- [ ] Implement as complex Observable streams and Signals
- [check] Search and filtering of logs -> Search Page
- [ ] Live updates in dashboard
- [check] Two or more views of the same data -> Search Page / Vehicle Details (per vehicle)

### Non-Functional

- [check] Endpoint validations and parsing -> VehicleLogController
- [check] Separation of concerns (parsing, storage, logic, controller) -> using standard folder / file / code structure
- [check] Basic API documentation -> Swagger API with descriptions at http://localhost:3000/api

### Input Data

- [ ] Support log text format
- [check] Support either file upload, seed script or a simple generator -> seed script, generated data

### Back-End

- [ ] Parse log text file into the database
- [check] Store data in memory and a simple database -> in-memory database
- [check] Design a query API with various filter params -> VehicleLogController
- [ ] Provide an aggregated endpoint (errors per vehicle in a time range, most frequent error codes, vehicles in critical state)

### Front-End

- [check] Use Angular 15+
- [check] Consume backend APIs
- [check] Senior-level usage of Observables and state management -> check src/app/store folder and its usage in components
- [check] Search / filter Panel for logs -> Search Page
- [check] Results view -> Search Page (implemented as server-side paginated table with log and vehicle data)
- [ ] Aggregated views (cards, charts, lists) per vehicle / per code
- [check] State management for filters -> Search Page (only as form controls, with reset button)
- [check] State management for logs -> dual store design (entity cache / references via ids)
- [ ] State management for aggregated data
- [check] State management for loading / error state -> loading only, errors are handled via toast message
- [check] Usage of complex rxjs operators -> check .effects, .service files + .reducer files for complex selectors
- [check] Handle in-flight requests -> check .effects files for switchMap (other mappers not relevant in this app)
- [check] Use ngrx, signals, rxjs -> using all of these
- [check] Explain in a concept -> check ARCHITECTURE.md

### UI/UX

- [check] Clean design, responsive layout
- [check] Basic accessibility -> handled mostly by material components with a few additions of mine
- [check] Reusable components -> not very practicable in this project but check VehicleCardComponent (used twice)
- [check] Thoughtful structure -> intuitive and self-explanatory layout and navigation

### Organizational

- [check] Github link for source code -> check webapp header
- [check] Requirements description -> this file
- [check] List assumptions -> this file below
- [check] Concept / architecture description -> check ARCHITECTURE.md file
- [check] Relevant README.md with how-to and prerequisites, overview of what works
- [check] API documentation -> check Swagger API at http://localhost:3000/api
- [ ] (optional) Containerization with Docker

## Assumptions

- [check] Browsable vehicle metadata (interconnect with logs) -> Vehicles Page
- [check] Editable vehicle metadata with CRUD operations -> Vehicles Controller
- [ ] Check deployment opportunities with Firebase
