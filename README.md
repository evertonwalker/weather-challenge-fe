# weather-challenge-fe

Vue 3 + Vite weather dashboard: search by place, show current conditions and forecast, persist searched place names locally. The codebase follows a layered layout (ports, application, infrastructure, presentation) with Pinia for app state.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so this project uses `vue-tsc` for type checking. In editors, [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) makes the TypeScript language service aware of `.vue` types.

## Configuration

See [Vite Configuration Reference](https://vite.dev/config/).

### Environment

Weather data comes from [WeatherAPI.com](https://www.weatherapi.com/). Set:

```env
VITE_WEATHER_API_KEY=your_key_here
```

## Project setup

```sh
npm install
```

### Development (compile + HMR)

```sh
npm run dev
```

### Production build (type-check + minify)

```sh
npm run build
```

### Unit tests ([Vitest](https://vitest.dev/))

```sh
npm run test:unit
```

### End-to-end tests ([Playwright](https://playwright.dev))

```sh
# Install browsers for the first run
npx playwright install

# On CI, build first
npm run build

npm run test:e2e
npm run test:e2e -- --project=chromium
npm run test:e2e -- tests/example.spec.ts
npm run test:e2e -- --debug
```

### Lint ([ESLint](https://eslint.org/))

```sh
npm run lint
```

---

## Architecture (folder layout)

High-level dependency rule: **presentation** and **application** depend on **domain** abstractions; **infrastructure** implements those abstractions. The composition root wires concrete implementations and exposes them via Vue `provide` / `inject` (see `main.ts`, `application/bootstrap/dependencies.ts`, `core/di/injectionKeys.ts`).

```text
src/
├── core/
│   ├── config/           # Shared config (e.g. Weather API base URL, env-backed keys)
│   └── di/               # Injection keys for provide/inject (use cases, repositories)
│
├── domain/
│   ├── contracts/        # External API DTOs (e.g. WeatherForecastResponseDto)
│   ├── models/           # View-oriented / domain types (e.g. Day, SmallCardWeather)
│   └── ports/            # Repository interfaces (WeatherForecastRepository, SavedPlacesRepository)
│
├── infrastructure/
│   ├── http/             # HTTP adapters (WeatherApi → implements WeatherForecastRepository)
│   └── persistence/      # Local storage adapters (SavedPlacesLocalStorageRepository)
│
├── application/
│   ├── bootstrap/        # createWeatherDependencies() — composition root for concrete services
│   ├── mappers/          # DTO → view model mapping (weatherViewMapper)
│   ├── useCases/         # Application workflows (GetWeatherByPlaceUseCase)
│   └── stores/           # Pinia stores (weatherStore; injects use cases via DI)
│
├── presentation/
│   └── components/       # One folder per component: ComponentName/ComponentName.vue (+ .spec.ts when tested)
│
├── composables/          # Shared Vue composables (e.g. useIsMobile)
├── router/               # Vue Router setup (routes can grow here)
├── App.vue               # Root view: orchestrates weather flow and saved places
└── main.ts               # App bootstrap: Pinia, router, provide/inject wiring
```

### Notes

- **Ports** live under `domain/ports/`; **DTOs** for third-party JSON shapes live under `domain/contracts/`.
- **Pinia stores** live under `application/stores/` and stay free of direct `localStorage` / `fetch` calls; they consume injected use cases and mappers.
- **Tests** that mount `App` must `provide` the same injection keys as `main.ts` (see `src/__tests__/App.spec.ts`).
