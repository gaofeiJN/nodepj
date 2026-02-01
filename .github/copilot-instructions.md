# Copilot Instructions for nodetst

## Project Overview

This is a Node.js study/testing project containing multiple standalone applications demonstrating different Node.js patterns and libraries. It's organized as a monorepo with independent subdirectories, each exploring specific technologies.

## Architecture & Key Patterns

### Project Structure

- **expresstest/mongoose/** - Main production-like MVC application using Express + MongoDB/Mongoose
- **clitest/** - CLI application using Commander.js with modular command/option structure
- **event/** - Event-driven patterns using Node's EventEmitter
- **module-test/** - CommonJS/ES Module examples (testing module systems)
- **storage/**, **xhr&fetch/**, **webstorage/** - Browser API examples
- **$test0/**, **gittest/** - Test/experimental code

### Express + Mongoose Pattern (Primary Architecture)

Used in `expresstest/mongoose/`:

**File organization**: Controller → Router → Model → Middleware

- Controllers (`controller/userController.js`) - business logic, call models and return responses
- Routers (`router/index.js`, `router/users.js`) - mount controllers on routes
- Models (`model/index.js`) - define and export Mongoose schemas; `connectDB()` initializes connection
- Middleware (`middleware/validator/`) - validation and error handling

**Key conventions**:

- Mongoose schemas in dedicated files (`userSchema.js`, `videoSchema.js`)
- Password fields use `select: false` to exclude by default; use `.select("+password")` when needed
- Controller methods are async/await with try-catch error handling
- Routes prefixed with `/api/v1/` versioning

### CLI Pattern (clitest/)

Uses Commander.js with modular organization:

- `bin/gfcli.js` - entry point (shebang), imports core modules
- `lib/core/myOption.js` - program options configuration
- `lib/core/myCommand.js` - command definitions (use `.action(handler)` for execution)
- `lib/core/myAction.js` - command action handlers (where business logic lives)

### Module System

- All files default to CommonJS (`module.exports`, `require()`)
- `module-test/package.json` explicitly sets `"type": "commonjs"`
- MJS files exist for testing ES modules

## Developer Workflows

### Run Express Server

```bash
cd expresstest/mongoose
npm install  # Install dependencies (express, mongoose, cors, morgan, bcrypt, etc.)
npm start    # Start server on port 3000 (or process.env.port)
```

### Run CLI Application

```bash
cd clitest
node bin/gfcli.js [command] [options]
# Example: node bin/gfcli.js sayhi John -y
```

### Database Setup

- MongoDB connection string defined in `config.js` (MONGO_PATH)
- Models auto-connect on import (`model/index.js`)
- Schemas include validation rules with custom error messages

## Project-Specific Conventions

1. **Async error handling**: Wrap controller logic in try-catch, return status codes (201 for create, 404 for not found, 500 for errors)
2. **Chinese comments**: Codebase uses Chinese for documentation and error messages
3. **Middleware logging**: Morgan logs to file streams (`fs.WriteStream`) in `logs/access-log.txt`
4. **Password encryption**: Bcrypt used for hashing; compare with `comparePasswordSync()` method
5. **JWT token generation**: `util/jwt.js` handles `createToken()` and `verifyToken()`
6. **Schema toJSON()**: Custom serialization for excluding sensitive fields when converting models to JSON

## Cross-Component Communication

- **Express middleware stack**: JSON parsing → CORS → Logging → Routing
- **Router composition**: Main router imports sub-routers (`users.js`, `videos.js`) and mounts them
- **Model dependency**: Controllers require models from centralized `model/index.js`
- **Validator composition**: Error handling middleware in `middleware/validator/`

## Dependencies & Integration Points

**Core packages** (root `package.json`):

- Express 5.2.1, Nodemon 3.1.11

**Express + Mongoose app** needs:

- mongoose, cors, morgan, bcrypt, commander (for CLI)

**File patterns**:

- Test HTML files in `html/` directories for manual testing
- Log files written to `logs/` subdirectories
- Configuration in `config.js` (e.g., MONGO_PATH)

## Common Patterns to Follow

- Centralize exports in `index.js` files (e.g., `model/index.js`, `router/index.js`)
- Use modular middleware pipeline in Express setup
- Keep business logic in controllers, not in route handlers
- Define schema validation at MongoDB schema level, not in routes
- Use destructuring for imports: `const { User, Video } = require("../model/index")`
