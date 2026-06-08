# Accordion FAQ with CRUD

An interactive FAQ accordion built with [Create React App](https://github.com/facebook/create-react-app).
Each entry can be expanded/collapsed, and the list now supports full **CRUD**
(Create, Read, Update, Delete) with automatic persistence to the browser's
`localStorage`, so your changes survive a page reload.

---

## Table of Contents

- [Features](#features)
- [Demo / Screenshots](#demo--screenshots)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [How CRUD Works](#how-crud-works)
- [Data Model](#data-model)
- [Persistence](#persistence)
- [Testing](#testing)
- [Customizing the Seed Data](#customizing-the-seed-data)
- [Troubleshooting](#troubleshooting)

---

## Features

- **Read** — Browse a list of questions. Click the `+` / `-` button to expand or
  collapse the answer for any item.
- **Create** — Add a new question/answer pair through the form at the top of the
  list. Empty submissions are rejected with an inline validation message.
- **Update** — Click the edit (pencil) icon on any item to load it into the form,
  change the text, and save.
- **Delete** — Click the trash icon on any item to remove it instantly.
- **Persistence** — Every change is saved to `localStorage` automatically and
  restored on the next visit.
- **Graceful empty state** — When all questions are deleted, a friendly message
  is shown instead of a blank list.

---

## Demo / Screenshots

Run the app locally (see [Getting Started](#getting-started)) and open
<http://localhost:3000>.

The UI consists of:

1. A heading.
2. A **form** to add or edit a question.
3. A **list** of question cards, each with edit, delete, and expand/collapse
   controls.

---

## Tech Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| UI library   | React 17 (function components + hooks)  |
| Icons        | `react-icons` (Ant Design + Feather)    |
| Tooling      | Create React App (`react-scripts` 4)    |
| Testing      | Jest + React Testing Library            |
| Persistence  | Browser `localStorage`                  |
| Styling      | Plain CSS                               |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or newer recommended)
- npm (bundled with Node) or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Bholu-123/Accordion.git
cd Accordion

# Install dependencies
npm install
# or: yarn install
```

### Run the development server

```bash
npm start
# or: yarn start
```

Open <http://localhost:3000> to view the app. The page reloads automatically on
edits and shows lint errors in the console.

---

## Available Scripts

| Script          | Description                                                            |
| --------------- | --------------------------------------------------------------------- |
| `npm start`     | Runs the app in development mode at <http://localhost:3000>.           |
| `npm test`      | Launches the test runner in interactive watch mode.                   |
| `npm run build` | Builds an optimized production bundle into the `build/` folder.        |
| `npm run eject` | Ejects from CRA (one-way operation — copies config into the project). |

> Swap `npm` for `yarn` if you prefer yarn.

---

## Project Structure

```
src/
├── App.js                    # Root component: owns CRUD state + persistence
├── App.test.js               # Unit/integration tests for CRUD behavior
├── index.js                  # React entry point
├── setupTests.js             # Registers jest-dom matchers
├── Components/
│   ├── data.js               # Seed questions (used on first load)
│   ├── question.js           # Single accordion item (expand/edit/delete)
│   └── QuestionForm.js       # Controlled form for create + edit
└── Styles/
    └── style.css             # All styles, including form & action buttons
```

### Responsibilities

- **`App.js`** — The single source of truth. It holds the `questions` array and
  the `editingId`, exposes the create/update/delete handlers, and syncs state to
  `localStorage`.
- **`QuestionForm.js`** — A reusable controlled form. It works in two modes
  driven by the `initialValues` prop: create mode (empty) and edit mode
  (pre-filled). It validates that both fields are non-empty before submitting.
- **`question.js`** — Renders one item. It is presentational: it keeps only its
  own expand/collapse state and calls the `onEdit` / `onDelete` callbacks passed
  from `App`.

---

## How CRUD Works

All mutations live in `App.js` and operate on the `questions` array in state.

### Create

`QuestionForm` (in create mode) calls `onSubmit({ title, info })`. `App`'s
`addQuestion` appends a new object with a fresh unique `id`:

```js
const addQuestion = ({ title, info }) => {
  setQuestions((prev) => [...prev, { id: createId(), title, info }]);
};
```

### Read

`App` maps over `questions` and renders a `<Question />` for each. Each item
toggles its own answer visibility locally.

### Update

Clicking the edit icon sets `editingId` to that item's id. The form re-renders in
edit mode (pre-filled). On save, `updateQuestion` replaces the matching item:

```js
const updateQuestion = ({ title, info }) => {
  setQuestions((prev) =>
    prev.map((q) => (q.id === editingId ? { ...q, title, info } : q))
  );
  setEditingId(null);
};
```

> The form is re-mounted on edit via `key={editingId || 'new'}` so its internal
> input state is correctly re-initialized from the selected question.

### Delete

Clicking the trash icon calls `deleteQuestion(id)`, which filters the item out
and exits edit mode if that item was being edited:

```js
const deleteQuestion = (id) => {
  setQuestions((prev) => prev.filter((q) => q.id !== id));
  if (editingId === id) setEditingId(null);
};
```

---

## Data Model

Each question is a plain object:

```js
{
  id: 1,                    // unique identifier (number)
  title: 'Question text',   // the question shown in the header
  info: 'Answer text',      // the answer revealed when expanded
}
```

New ids are generated with `Date.now()`, which is sufficient for a single-user
client-side app.

---

## Persistence

State is persisted to `localStorage` under the key `accordion.questions`:

- On startup, `App` reads and parses that key. If it is missing or invalid, it
  falls back to the bundled seed data in `Components/data.js`.
- A `useEffect` writes the current `questions` array to `localStorage` whenever
  it changes.
- All storage access is wrapped in `try/catch` so a corrupted or blocked storage
  never crashes the app.

### Resetting to seed data

To wipe your local changes and restore the original questions, clear the stored
key from your browser's DevTools console:

```js
localStorage.removeItem('accordion.questions');
```

Then reload the page.

---

## Testing

Tests are written with **Jest** and **React Testing Library** and cover the full
CRUD lifecycle plus persistence.

```bash
# Run once (CI mode)
CI=true npm test

# Watch mode
npm test
```

Covered scenarios (`src/App.test.js`):

- Renders seed questions on first load
- **Create** a new question
- **Create** validation blocks empty submissions
- **Delete** a question
- **Update** an existing question
- **Persist** questions across a remount via `localStorage`

---

## Customizing the Seed Data

Edit `src/Components/data.js` to change the questions shown on a fresh load
(i.e. before any user edits are stored). Each entry must include `id`, `title`,
and `info`. Note that once a user has saved changes, the stored `localStorage`
data takes precedence over the seed — clear the storage key to see new seed data.

---

## Troubleshooting

| Problem                                   | Fix                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------- |
| Changes don't persist after reload        | Ensure your browser allows `localStorage` (not in strict private mode). |
| App still shows old/deleted questions     | Run `localStorage.removeItem('accordion.questions')` and reload.    |
| Tests fail with "toBeInTheDocument" error | Make sure `@testing-library/jest-dom` is installed and imported in `setupTests.js`. |
| Port 3000 already in use                  | Stop the other process or run `PORT=3001 npm start`.                |

---

## License

This project is provided as-is for learning purposes.
