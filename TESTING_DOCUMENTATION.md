# Testing Documentation

## 1. Testing Strategy
My overall approach to testing the Task Manager API Client was to ensure robustness through a "Pyramid of Testing" strategy, prioritizing a solid foundation of unit tests followed by targeted integration tests.

### Strategy Decisions:
*   **Isolation**: I chose to heavily rely on **Unit Tests (60%+)** to verify the business logic of Models (`Todo`, `User`) and Utility functions (`taskProcessor`). This ensures that the core logic is bug-free before interacting with external systems.
*   **Mocking Dependencies**: For the `APIClient`, I decided to **mock the global `fetch` API**. This strategy was chosen to make tests deterministic, faster, and capable of simulating network errors (404, 500) without needing a real backend.
*   **Behavior Verification**: I employed **Spies** to verify that side effects (like console logging) and internal method calls occurred as expected, ensuring that the code isn't just producing the right output, but also executing the correct process.

## 2. Test Types Implemented

### Unit Tests
These tests focus on individual functions and classes in isolation.
*   **Classes Tested**: `Todo`, `PriorityTodo`, `User`.
    *   *Key Scenarios*: Constructor initialization, method behavior (`toggle`, `isOverdue`), inheritance checks, and JSON serialization.
*   **Functions Tested**: `filterByStatus`, `calculateStatistics`, `groupByUser`.
    *   *Rationale*: These pure functions contain core business logic for data transformation and must be verified for correctness against various datasets.
*   **Error Handling**: A dedicated suite (`errorHandling.test.js`) validates how the system behaves under invalid inputs (null, undefined, type mismatches).

### Integration Tests
These tests verify that different modules work together correctly.
*   **Module Interactions**:
    *   `APIClient` parsing raw JSON responses into domain `User` and `Todo` objects.
    *   `User` class managing collections of `Todo` objects (adding, filtering).
*   **Mocking Strategy**: Used `jest.fn()` to mock `global.fetch`. This allowed me to inject specific JSON responses and verify that the `APIClient` correctly constructs URLs and handles response headers.
*   **Workflows**: Verified complete data flows, such as fetching data -> transforming it -> instantiating Model classes.

### Mocks & Spies
*   **Mocked Dependencies**:
    *   `api.js`: A full mock implementation of the API client was created in `tests/__mocks__` to support high-level workflow tests without network calls.
    *   `global.fetch`: Mocked to simulate network success, failures, and various HTTP status codes.
*   **Spies**:
    *   `console.error`: Spied on to verify error logging without polluting the test runner output.
    *   `Array.prototype.filter/reduce`: Spied on to ensure efficient array methods were utilized by utility functions.
    *   Justification: Spying ensures that refactoring code (e.g., changing an algorithm) doesn't accidentally remove required side effects or performance optimizations.

## 3. Test Coverage Analysis

### Coverage Summary
*   **Overall Coverage**: **~97%** (Exceeds 80% target)
*   **Statement Coverage**: 97.21%
*   **Branch Coverage**: 94.73%
*   **Function Coverage**: 96.42%

### Analysis
*   **High Coverage Areas**: The Model classes and Task Processor utilities have near 100% coverage, ensuring core logic is rock solid.
*   **Lower Coverage Areas**: Slight gaps exist in specific edge-case error handling within the API client where unreachable code (due to specific mock setups) might exist.
*   **Actions Taken**: I wrote a specific `errorHandling.test.js` file containing over 30 tests specifically targeting edge cases, boundary conditions, and null inputs, which significantly boosted branch coverage.

## 4. Challenges & Solutions

### Challenge 1: ESM Configuration with Jest
**Issue**: The project uses Native ES Modules (`"type": "module"`), but Jest has experimental support for this in Node.js, leading to import errors.
**Solution**: I configured the test script to use `node --experimental-vm-modules node_modules/jest/bin/jest.js` and created a `jest.config.js` that exports the config using ESM syntax. This allowed Jest to natively understand `import`/`export` statements.

### Challenge 2: Testing Console Side Effects
**Issue**: Testing functions that log errors (`console.error`) cluttered the test output and made it hard to read reports.
**Solution**: I used `jest.spyOn(console, 'error').mockImplementation(() => {})`. This swallowed the logs during the test execution (keeping output clean) while still allowing me to assert `expect(consoleSpy).toHaveBeenCalled()`.

### Challenge 3: Asynchronous Error Handling
**Issue**: Testing async methods in `APIClient` that throw errors was tricky; simple `expect(api.method()).toThrow()` failed because the promise rejected asynchronously.
**Solution**: I learned to use `await expect(api.method()).rejects.toThrow()`, which properly handles the promise rejection lifecycle in Jest.

## 5. Key Learnings
*   **Unit vs. Integration**: I learned that Unit tests are for *logic* (does 1+1=2?), while Integration tests are for *contracts* (does the API return data I can use?).
*   **Mocking**: Mocking is essential for simulating "unhappy paths" like 500 Server Errors, which are difficult to force against a live API.
*   **Code Quality**: Writing tests forced me to handle `null` and `undefined` checks in my source code, preventing potential runtime crashes.

## 6. Differences Between Test Types

| Test Type | Scope | Example in Project | When to Use |
|-----------|-------|--------------------|-------------|
| **Unit** | Isolated function/class | `Todo.toggle()` switches boolean state. | Verifying complex logic, math, or state changes within a single component. |
| **Integration** | Interaction between modules | `APIClient.fetchUsers()` calls fetch and returns `User[]`. | Verifying that data flows correctly between systems (e.g., API -> Model). |
| **E2E** | Full system flow | *Not implemented (would use Selenium/Cypress)* | Verifying user scenarios from UI click to Database persistence. |