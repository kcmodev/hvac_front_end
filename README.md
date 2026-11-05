# HVAC Air Freshener Front End

A React control panel for [pi_hvac_controller](https://github.com/kcmodev/pi_hvac_controller), a Raspberry Pi that sprays air freshener into a home's return duct while the HVAC system runs. From a phone or browser, it shows what the system is doing and triggers a spray on demand.

Built with React 18, TypeScript, Material UI and Vite, and tested with Vitest and React Testing Library.

## Features

- Shows the current HVAC state and the time of the last spray when opened
- Triggers a manual spray, disabling the button and showing progress during the cycle of about 15 seconds
- Shows the controller's message when a spray fails, such as when the sprayer is already running
- Can be added to a phone's home screen as a standalone app, through its web app manifest

## Getting started

Requires Node.js 18 or newer and a running [controller](https://github.com/kcmodev/pi_hvac_controller).

```bash
git clone https://github.com/kcmodev/hvac_front_end.git
cd hvac_front_end
npm install

cp .env.example .env   # then set VITE_API_URL
npm run dev            # http://localhost:3000
```

### Connecting to the controller

This app runs on a different origin from the controller, so two settings have to point at each other:

| Where                   | Setting                                                            | Example                    |
| ----------------------- | ------------------------------------------------------------------ | -------------------------- |
| This project's `.env`   | `VITE_API_URL`: the controller's address, as seen from the browser | `http://192.168.1.50:5000` |
| The controller's `.env` | `CORS_ALLOWED_ORIGIN`: the address this app is served from         | `http://192.168.1.50:3000` |

Without `CORS_ALLOWED_ORIGIN`, the browser hides the controller's responses: the readings show as unavailable, and a spray runs but is reported as a failure. `VITE_API_URL` is read at build time, so rebuild after changing it.

## Scripts

| Command           | Purpose                         |
| ----------------- | ------------------------------- |
| `npm run dev`     | Start the development server    |
| `npm run build`   | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build      |
| `npm test`        | Run the tests                   |
| `npm run lint`    | Run ESLint                      |
| `npm run format`  | Format with Prettier            |

## Project layout

```
├── index.html
├── public/             Icon and web app manifest
└── src/
    ├── api.ts          Typed client for the controller's API
    ├── App.tsx         Control panel
    └── main.tsx        Entry point and theme
```

The tests sit beside the code they cover, and need no controller or hardware.

## Security

Like the controller's API, this app has no authentication. Anyone who can reach it can trigger a spray, so keep both on a trusted home network.

## License

[MIT](LICENSE)
