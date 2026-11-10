# MERN Stack Authorization Client

React client for account registration, sign-in, protected profile access, logout, and password recovery. It uses React Router 6 and keeps the JWT session in an HttpOnly cookie managed by the sibling Express API.

## Run locally

Requirements: Node.js 22 or later and the API running at http://localhost:1198.

    Copy-Item .env.example .env
    npm install
    npm start

Set REACT_APP_API_URL in .env when the API runs at a different base URL. The development client runs at http://localhost:3000.

For GitHub Pages, configure REACT_APP_API_URL to the deployed API address before building. The app uses HashRouter so password reset links work on GitHub Pages project pages. See the repository README for API configuration and cross-site cookie notes.
