# AUDIT.md
## FarmTracker Code Review Audit

### Issues Found & Prioritization

#### High Priority
1.  **No input validation on API endpoints**: The current API endpoints (`/api/animals`, `/api/paddocks`, `/api/animals/:id/health-events`) likely lack robust input validation. This can lead to database corruption, unexpected application behavior, or security vulnerabilities (e.g., SQL injection if not using parameterized queries correctly, though SQLite is less prone to this). This is critical for data integrity and application stability.
    *   **Reasoning**: Without proper validation, malformed data can enter the system, leading to bugs, crashes, or security issues.
    *   **Fix First**: Implement Joi or similar validation schema for all incoming request bodies and query parameters.
2.  **Error Handling**: The error handling appears to be basic. Unhandled exceptions could lead to server crashes or expose sensitive information in error messages.
    *   **Reasoning**: Robust error handling is crucial for a stable and secure application.
    *   **Fix First**: Implement a centralized error handling middleware to catch and process errors gracefully, returning appropriate HTTP status codes and messages.
3.  **Missing Unit/Integration Tests for existing functionalities**: While there's `api.test.js`, it might not cover all edge cases or failure paths for existing routes. New features will require thorough testing.
    *   **Reasoning**: Ensures stability of existing features and provides confidence when adding new ones.
    *   **Fix First**: Expand existing tests and add new ones for current API endpoints, especially focusing on validation and error cases.

#### Medium Priority
1.  **Lack of consistent API response structure**: The API responses might not be consistent across all endpoints, making frontend consumption more challenging.
    *   **Reasoning**: Consistent API contracts improve developer experience and reduce frontend complexity.
    *   **Leave for Later**: This can be addressed once core functionality and validation are stable.
2.  **Hardcoded server port**: The backend server port (3000) is likely hardcoded in `server.js`. This limits deployment flexibility.
    *   **Reasoning**: Using environment variables for configuration is a standard practice.
    *   **Leave for Later**: A minor improvement, can be done during a general configuration refactor.

#### Low Priority
1.  **Frontend code organization/modularity**: The frontend `app.js` might become a monolithic file as more features are added, making it harder to maintain.
    *   **Reasoning**: Better modularity improves maintainability and scalability.
    *   **Leave for Later**: A significant refactoring effort, not critical for the current assessment.
2.  **No frontend routing/SPA framework**: The application uses separate HTML files for different views. While functional for a small app, a SPA framework (e.g., React, Vue, Svelte) would offer a smoother user experience and better state management for a growing application.
    *   **Reasoning**: Improves user experience and developer productivity for larger applications.
    *   **Leave for Later**: A major architectural change, out of scope for immediate fixes/features.

### What I would fix first and why:

I would prioritize **input validation** and **error handling** immediately. These are fundamental for the application's stability, security, and data integrity. Without them, any new feature (like weight tracking) or existing functionality is prone to bugs and potential exploits. Addressing these first creates a solid foundation for further development. I would also expand existing tests to cover these new validations and error handling mechanisms.

### What I would leave for later:

Frontend architectural changes (like introducing a SPA framework or extensive modularization) would be left for later. While beneficial, they are significant undertakings that do not directly address the core functionality or immediate stability issues. Similarly, minor configuration improvements like externalizing the server port can be done after critical items are handled.
