
This nested component example illustrates a simple example of variants interacting with components which have nested internal components when a variant is applied to the outer component.

The first anchor is a plain `<Anchor />` component, which has no specified variant. A component with no variant specified will assume the default variant styling, _unless_ a variant is supplied from above. If a parent component has a variant, it will mimic that variant.

The second anchor uses an explicit `'default'` variant, and is not affected by the parent variant change.

_Default_

```
<Nested />
```

_Inverted_

```
<Nested.Secondary />
```
