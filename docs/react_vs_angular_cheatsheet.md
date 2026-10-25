# ⚡ React vs Angular: Concept Translation Cheatsheet

A side-by-side comparative guide designed for developers mastering both **React** and **Angular** through the **Timeline** application.

---

## 🏛️ Core Philosophy

| Dimension | React | Angular |
|---|---|---|
| **Paradigm** | Minimalist UI Library + Ecosystem | Comprehensive Enterprise Framework |
| **Language** | JavaScript / TypeScript + JSX | TypeScript + HTML Templates |
| **Component Model** | Pure JavaScript functions | Classes with `@Component` decorator |
| **Data Flow** | One-way unidirectional (Props down, events up) | One-way default with optional two-way binding (`[(ngModel)]`) |

---

## 🔄 Concept Comparison Table

### 1. Component Structure & Template Syntax

#### React (JSX)
```jsx
export default function MemoryCard({ memory, onToggleCore }) {
  return (
    <div className={`card ${memory.isCoreMemory ? 'core' : ''}`}>
      <h3>{memory.title}</h3>
      {memory.insideJoke && <p className="joke">{memory.insideJoke}</p>}
      <button onClick={() => onToggleCore(memory.id)}>❤️</button>
    </div>
  );
}
```

#### Angular (Control Flow & Signals)
```html
<div class="card" [class.core]="memory().isCoreMemory">
  <h3>{{ memory().title }}</h3>
  @if (memory().insideJoke) {
    <p class="joke">{{ memory().insideJoke }}</p>
  }
  <button (click)="toggleCore()">❤️</button>
</div>
```

---

### 2. State & Reactivity

| React Concept | Angular Equivalent | Notes |
|---|---|---|
| `useState(initialVal)` | `signal(initialVal)` | React uses render-cycle state; Angular Signals provide fine-grained reactivity. |
| `useEffect(() => {}, [dep])` | `effect(() => {})` or `ngOnInit()` | Synchronizing side effects with external systems (e.g. backend API calls). |
| Derived Calculation (`const x = fn(state)`) | `computed(() => fn(signal()))` | Avoids redundant state; updates automatically when dependencies change. |

---

### 3. Data Flow Between Components

| React | Angular |
|---|---|
| **Parent ➔ Child**: Props (`<Card memory={item} />`) | `@Input()` or `memory = input.required<Memory>()` |
| **Child ➔ Parent**: Callbacks (`<Card onSave={handleSave} />`) | `@Output()` or `onSave = output<Memory>()` |
| **Context**: `useContext(ThemeContext)` | Dependency Injection: `inject(ThemeService)` |

---

### 4. HTTP & Backend API Integration

* **React**: Uses standard `fetch()` or `axios` inside `useEffect` or Custom Hooks (`useMemories`).
* **Angular**: Injects `HttpClient` and handles streams via RxJS Observables or converts directly to Signals via `toSignal()`.
