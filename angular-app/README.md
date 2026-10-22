# Angular Frontend (`angular-app`)

This directory will contain the **Angular** implementation of the **PulseTask** application.

## Learning Strategy: The React -> Angular Bridge
Once we master the project in React, we will build the exact same UI, state management, and backend interactions in Angular. This enables direct concept mapping:

| React Concept | Angular Equivalent |
|---|---|
| JSX (`<div>{name}</div>`) | Template syntax (`<div>{{ name }}</div>`) |
| `props` (`<Child title={x} />`) | `@Input()` / `input()` signal |
| Event props (`<Child onSave={fn} />`) | `@Output()` / `output()` EventEmitter |
| `useState(val)` | Angular Signals (`signal(val)`) |
| `useEffect(() => {}, [dep])` | `effect()` or Lifecycle Hooks (`ngOnInit`) |
| Context API / Zustand | Injectable Services (`@Injectable({ providedIn: 'root' })`) & Signals Store |
| React Router | Angular Router (`RouterModule`) |
| `fetch()` / Axios | Angular `HttpClient` + RxJS Observables / Signals |

*We will initialize the Angular CLI project here as soon as we conclude the React phase!*
