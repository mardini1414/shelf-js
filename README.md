# @mardinidev/shelf-js

Simple drag and drop for React js

## Status: Experimental 🚧

This library is still in the early stages of development.

## Feature

- drag and drop
- sortable
- can validate which can be dropped

## Installation

```bash
npm install @mardinidev/shelf-js
```

## Use

Here is a simple example of how to use this library:

```jsx
import React from 'react';
import { useShelf, Droppable, Draggable } from '@mardinidev/shelf-js';

const ITEMS = Array(5)
  .fill(1)
  .map((v, i) => `Item-${v + i}`);

export default function App() {
  const [shelfRef] = useShelf({
    onOverClass: 'over',
    onChange: (data) => console.log(data),
  });

  return (
    <div ref={shelfRef} className="container">
      <Droppable shelfKey="RED" className="droppable">
        {ITEMS.map((item) => (
          <Draggable className="draggable" key={item} itemKey={item}>
            {item}
          </Draggable>
        ))}
      </Droppable>
      <Droppable shelfKey="GREEN" className="droppable" />
      <Droppable shelfKey="BLUE" className="droppable" />
    </div>
  );
}
```

css

```css
.container {
  display: flex;
  gap: 1rem;
  box-sizing: border-box;
}

.droppable {
  width: 200px;
  min-height: 400px;
  padding: 0.2rem;
  border: 2px dashed #cacaca;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.draggable {
  padding: 1.4rem 0.6rem;
  background-color: orange;
  color: white;
  border-radius: 8px;
  margin-bottom: 0.2rem;
}

.over {
  transform: scale(1.01);
}

.over[shelf-data-key='RED'] {
  border-color: red;
}

.over[shelf-data-key='GREEN'] {
  border-color: green;
}

.over[shelf-data-key='BLUE'] {
  border-color: blue;
}
```

## API

### Droppable

**Props:**

| name        | Type        | Default     | Required | Description                                                                                                                               |
| ----------- | ----------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `className` | `string`    | `undefined` | `false`  | to add CSS class                                                                                                                          |
| `children`  | `ReactNode` | `undefined` | `false`  | to add children                                                                                                                           |
| `shelfKey`  | `string `   | `undefined` | `false`  | to add meta data for which `Droppable` is received a drop when `onChange` if left empty value will be `null`. Recommended value is unique |

### Draggable

**Props:**

| name         | Type         | Default     | Required | Description                                                                                                                                                         |
| ------------ | ------------ | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `className`  | `string`     | `undefined` | `false`  | to add CSS class                                                                                                                                                    |
| `children`   | `ReactNode ` | `undefined` | `false`  | to add children                                                                                                                                                     |
| `allowedKey` | `string `    | `undefined` | `false`  | to add `allowed key` if from `useShelf` adding the `allowed` option, `allowedKey` must be the same as the `allowed` option, otherwise `Draggable` cannot be dropped |
| `itemKey`    | `string`     | `undefined` | `false`  | to add metadata for which `Draggable` is dropped when `onChange` if left empty the value will be `null`. Recommended value is unique                                |
| `disabled`   | `boolean`    | `false`     | `false`  | to set `Draggable` to disabled or not                                                                                                                               |

### useShelf

**Params:**
TUseShelfParams

| name          | Type                         | Default     | Required | Description                                                                                                                                                                         |
| ------------- | ---------------------------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onOverClass` | `string`                     | `undefined` | `false`  | to add CSS class when the `Draggable` is dragged over the `Droppable`                                                                                                               |
| `allowed`     | `string`                     | `undefined` | `false`  | to add validation for which `Draggable` can be dropped if the value of `allowed` is not equal to the value of `allowedKey` from `Draggable`, then the `Draggable` cannot be dropped |
| `onChange`    | `(data: TShelfData) => void` | `undefined` | `false`  | to see data changes                                                                                                                                                                 |

**Return**

useShelf returns an array where the first index is a `ref` used to get the DOM reference `container`.

## License

This library is licensed under the MIT license. See [LICENSE](./LICENSE) for more information.
