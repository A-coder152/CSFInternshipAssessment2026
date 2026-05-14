# Retrospective: FarmTracker Assessment

## Overview
My goal was to audit, fix, and extend the FarmTracker application while demonstrating professional-grade engineering practices within a tight timeframe.

## Trade-offs
- **Refactoring vs. Features**: I prioritized a significant architectural refactor (Service-Repository pattern) over extensive frontend polish. I believe this provides higher long-term value, as it makes the codebase more scalable and maintainable.
- **Manual Validation**: I implemented manual, robust validation instead of adding a dependency like `Joi` or `Zod` to keep the project lightweight and dependency-minimal, which aligns with the starter app's simplicity while still ensuring data integrity.

## What I Would Do Differently With More Time
- **Modern Frontend**: Replace the current separate HTML file architecture with a Single Page Application framework (e.g., React) to provide smoother state management and a better user experience.
- **Advanced Testing**: Implement true unit tests for services by mocking repositories, rather than relying solely on integration tests.
- **Configuration**: Externalize environment-specific settings (like database paths and port numbers) to a `.env` file for better deployment flexibility.

## What I Deliberately Left Alone
- **Frontend CSS/Styling**: I kept existing CSS styles largely untouched. While they are basic, they serve the application's purpose. I prioritized backend structure and feature robustness over visual overhauls to ensure the core application logic was solid.
