# Lesson 2 (FE) — React + TypeScript + Vite

A starter React template for the CareerMate AI frontend lesson. Built with Vite, React, TypeScript, and React Router.

## Prerequisites

- [Node.js](https://nodejs.org/) v20 or later
- npm (included with Node.js)

## Getting started

```bash
cd "Lesson2(FE)"
npm install
npm run dev      # http://localhost:5173
```

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start dev server with hot reload     |
| `npm run build`   | Type-check and build for production  |
| `npm run preview` | Preview the production build locally |

## Routes

| Path               | Page               | Description                        |
| ------------------ | ------------------ | ---------------------------------- |
| `/`                | Cover              | Landing page                       |
| `/register`        | RegisterPage       | Email + password registration      |
| `/forgot-password` | ForgotPasswordPage | Email form to request a reset link |
| `/terms`           | TermsPage          | Placeholder (coming soon)          |
| `/login`           | LoginPage          | Email + password login             |

## Project structure

```text
Lesson2(FE)/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── public/
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── App.css
    ├── index.css
    ├── components/
    │   └── Cover.tsx
    ├── pages/
    │   ├── RegisterPage.tsx
    │   ├── RegisterPage.css
    │   ├── ForgotPasswordPage.tsx
    │   ├── TermsPage.tsx
    │   └── LoginPage.tsx
    └── utils/
        └── validation.ts
```

## Form validation

Client-side validation runs on blur and submit. Validators live in `src/utils/validation.ts`. On successful submit, a success message is shown (no backend yet).

| Page            | Field    | Rules                          |
| --------------- | -------- | ------------------------------ |
| Register        | Email    | Required; valid email format   |
| Register        | Password | Required; minimum 8 characters |
| Login           | Email    | Required; valid email format   |
| Login           | Password | Required only (no min length)  |
| Forgot password | Email    | Required; valid email format   |

## Key files

- **`src/pages/RegisterPage.tsx`** — Registration form with validation and footer links
- **`src/pages/LoginPage.tsx`** — Login form with email and password validation
- **`src/pages/ForgotPasswordPage.tsx`** — Forgot password form with email validation
- **`src/utils/validation.ts`** — `validateEmail`, `validatePassword`, and `validatePasswordRequired` helpers
- **`src/components/Cover.tsx`** — Landing page; "Start for Free" links to `/register`
- **`src/App.tsx`** — Route definitions

## Related lessons

- **Lesson 1** — Static HTML/CSS version in `AlexZhao/Lesson1.html` and `KitmanYiu/Lesson1.html`

1. dist folder (production code, generate when run npm run build)
2. node_modules (This is where all the package("libiary") code installed, this we be generated when run npm install)
3. public (root->dist folder files, don't need touch it)
4. src (code is store in here)
5. .gitignore (tell to ignore files and not upload to git, grey out in editior)
6. index.html (entry)
7. package-lock.json, package.json (package.json tell what package to install, package-lock.json, lock the version base on the rule (eg:^,~))
8. tsconfig.app.json, tsconfig.json (typescript config)
9. vite.config.ts (vite config)

Flow: index.html -> src>main.tsx -> app.tsx -> routes(components/pages)
