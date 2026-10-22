# Angular Frontend (`angular-app`)

This directory will house the **Angular** implementation of the **Timeline** application.

## Learning Strategy: The React -> Angular Bridge
Once we conclude our progressive mastery of Timeline in React, we will build the exact same UI, state management, and backend interactions in Angular.

### Concept Translation Guide:

| Timeline Feature | React Implementation | Angular Equivalent |
|---|---|---|
| **Timeline River & Scrapbook** | JSX conditional rendering & `.map()` | `@for (memory of filteredMemories; track memory.id)` & `@if` / `@switch` |
| **Memory Card** | Component receiving `memory` prop | Standalone Component with `@Input()` or `input()` signal |
| **Toggle Core Memory ❤️** | Callback prop (`onToggleCore`) | Output EventEmitter `@Output()` or `output()` |
| **Friendship Stats** | Derived state (JS date math) | Angular `computed()` Signals |
| **Capture Moment Form** | Controlled form (`value` + `onChange`) | Reactive Forms (`FormGroup`, `FormControl`, `Validators`) |
| **API Integration** | `useEffect` + `fetch()` | Angular `HttpClient` + RxJS Observables / Signals |
| **Nostalgia Surprise Me** | `useRef` + `scrollIntoView()` | `@ViewChild()` or Angular ElementRef |

*Angular CLI scaffolding will be launched here in Phase 2!*
