## Architecture

### Back-End

### Front-End

#### Structure

#### Styling

### Workspace

As both front-end and back-end are to be written in the same language and managed with the same tools, I decided to implement the project as monorepo using [Nx workspace](https://nx.dev) for the opportunity of additional monorepo-related features.

The following tools can be used across the entire workspace:

- Eslint, Stylelint (linting)
- Prettier (formatting)
- TypeScript language tools
- Angular, NestJS, Nx scripts and schematics (code generation)
- Git (version control)
