# AI Development Rules for AI Voice Transcriber

This document provides guidelines for AI assistants working on this codebase. Adhering to these rules ensures consistency, maintainability, and simplicity.

## Tech Stack Overview

This project is built with a modern, lightweight tech stack. Understand these choices before making changes.

-   **Framework:** React 19 with TypeScript for building the user interface.
-   **Build Tool:** Vite is used for a fast and efficient development experience.
-   **Styling:** All styling is done exclusively with Tailwind CSS using a utility-first approach.
-   **AI Integration:** The official `@google/genai` SDK is used to interact with the Google Gemini API for all AI-powered features.
-   **State Management:** Application state is managed using React's built-in hooks (`useState`, `useCallback`, `useRef`, `useEffect`).
-   **Icons:** Icons are implemented as custom SVG components within `src/components/Icons.tsx` to maintain a consistent look and feel.
-   **Audio Handling:** Native browser APIs, including the Web Audio API and `MediaRecorder`, are used for all audio recording and processing tasks.
-   **Project Structure:** The code is organized into functional directories: `components`, `hooks`, `utils`, and `types`.

## Library and Coding Rules

Follow these rules strictly to maintain the integrity of the codebase.

1.  **UI Components:**
    -   **DO NOT** add third-party component libraries (e.g., Material-UI, Ant Design, shadcn/ui).
    -   **DO** build all new UI elements as small, reusable React components using TypeScript and styled with Tailwind CSS.

2.  **Styling:**
    -   **DO** use Tailwind CSS utility classes for all styling.
    -   **DO NOT** add custom CSS files, CSS Modules, or CSS-in-JS libraries (e.g., Styled Components, Emotion).

3.  **State Management:**
    -   **DO** continue to use React's built-in hooks for state management.
    -   **DO NOT** introduce external state management libraries like Redux, Zustand, or MobX.

4.  **Icons:**
    -   **DO** use the existing icons from `src/components/Icons.tsx`.
    -   If a new icon is required, **DO** create it as a new SVG component within that same file, following the existing pattern.
    -   **DO NOT** install external icon libraries like `lucide-react` or `react-icons`.

5.  **API Communication:**
    -   **DO** use the `@google/genai` package for all communication with the Gemini API.
    -   For any other HTTP requests, **DO** use the native `fetch` API.
    -   **DO NOT** add HTTP client libraries like `axios`.

6.  **Code Simplicity:**
    -   Prioritize simple, elegant, and readable code.
    -   Avoid over-engineering solutions. Implement the simplest approach that meets the user's request.
    -   Keep components and functions small and focused on a single responsibility.