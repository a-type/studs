## API Documentation

### Default export: `Theme`

`Theme` is a class which defines a 'smart' theme for your library. You should create a theme and expose it so it can be referenced by your components, and utilized by a library consumer.

#### `Theme(namespace: String, globals = {}, components = {})`

```javascript static
const theme = new Theme('myTheme', {
  colors: {
    primary: 'blue',
    secondary: 'green',
  },
  fonts: {
    main: 'sans-serif',
  },
});
```

The constructor takes three parameters, though only two will probably be useful in most cases.

*`namespace: String` (required)*

A namespace to prevent collisions between your theme and any other themes used by library consumers in their apps. You don't need to store or reference this namespace after defining it (unless you're implementing advanced functionality in your component styling, perhaps).

*`globals: Object`*

A set of common values you want to reuse among your components. Common things here might be colors, fonts, sizes, weights, and other such basics. All your styling definitions will have immediate access to these values, and your library users will be able to customize them.
*`components: Object`*

For advanced use cases: you can provide pre-built component registrations using this parameter. This is utilized internally. There's not much reason you'd need to know the makeup of a component registration, but if you'd like you can read the source code and create some yourself.

#### `theme.register(componentName: String, defaultStyling: Function|Object)`

```javascript static
theme.register('button', (values) => ({
  color: values.colors.primary,
  borderRadius: '4px',
}));

theme.register('anchor', { color: 'blue' });
```

`register` adds a component's default styling to your theme. Before you define a component in your library, register all the configurable style properties it will use internally.

*`componentName: String` (required)*

A unique name for the component.

*`defaultStyling : Function|Object` (required)*

If a function, it will be called with the global values you supplied when creating the theme. A function should return an object, where keys are style value names and values are CSS property values.

If it's an object, it will be used as if it were the return value of the function form. You can supply an object if you don't need to utilize any of your global values.

When you define the styling on your component, you will be referencing these values by name.

*returns `{ addVariant, createSelector }`*

The return value of `register` is a chaining helper.

`addVariant` is `theme.registerVariant`, but bound to your component name you provided for convenience. It can be chained consecutively.

`createSelector` is `theme.createSelector`, but bound to your component name you provided for convenience. It returns a selector, as discussed in `theme.createSelector`.

#### `theme.registerVariant(componentName: String, variantName: String, variantStyling: Function|Object)`

`registerVariant` adds a variant style definition to a component. Variants are a named set of overrides to the default styling values. Common variants are things like 'small', 'secondary', or 'dark'.

*`componentName: String` (required)*

The name of the component to register a variant for. This component must already be registered in the theme.

*`variantName: String` (required)*

A name for the variant. Overriding existing variants is currently allowed. You can also override the default variant by passing `'default'`. Overriding is not guaranteed to be supported in the future; it depends on whether this feature causes more problems than it solves.

*`variantStyling: Function|Object` (required)*

Similar to the `defaultStyling` parameter of `theme.register`. This can be a function to compute style values, or an object to define them.

The key difference with variants is that the styling provided here is merged into the defaults, so you only have to provide the values you want to override.

#### `theme.createSelector(componentName: String)`

`createSelector` creates a style value selector function for the component of the specified name.

*returns `function selector(valueName: String|Array)`*

The selector function accepts a value name to select out of your component's style definition. The selection uses `_.get` under the hood, so you can provide a path string or array of strings for nested style definitions.

`selector(valueName)` returns another function which is meant to be used as an interpolation in `styled-components`. You can use it like so:

```javascript static
styled.div`
  color: ${select('foregroundColor')};
`;
```

Note that the returned selector function assumes that one of the properties passed to the `styled-component` is `variant`. If no `variant` property is passed, `'default'` will be used to choose the variant styles. `studs` provides utilities to provide `variant` to your components in a managed way; see `theme.connect` and `theme.variant`.

#### `theme.connect(Component: React.Component)`

`connect` accepts a Component and returns a higher-order component which provides it with a `variant` property provided from higher in the DOM tree. Use this to seamlessly supply variant information to complex library components which contain multiple internal `styled-components`. You can also use it to inform any regular React component of the current variant configuration if a higher component is providing one.

#### `theme.variant(variantName: String|Array)`

`variant` takes a variant name (or array of variant names) and returns a function which takes a Component. The returned function creates a version of the Component which is wrapped in a provider for the supplied variant(s). Perhaps it's better to see code:

```javascript static
const SecondaryButton = theme.variant('secondary')(Button);
const SmallSecondaryButton = theme.variant(['secondary', 'small'])(Button);
```

For the array version, ordering is important. Former variants will override conflicting properties with latter ones. Think of the list as `['mainVariant', 'supportingVariant' ...]`.

#### `theme.compile()`

Compiling a theme finalizes all component registrations and variants and prevents further updates, providing an object which can be passed directly to `styled-components`' `ThemeProvider`.

`theme.compile()` is memoized; subsequent calls will return a cached version of the precompiled output. You can (and should) pass `theme.compile()` directly to a `styled-components` `ThemeProvider`.

#### `theme.extend(overrides: Object)`

Creates a clone of a theme with overridden global values. The `overrides` parameter will be recursively merged with the base theme's global values. All component and variant definitions will be persisted during the copy.

When you expose your theme as part of your library, users can use this method to override the base style values to easily make broad modifications, like changing primary colors or font families, without having to change individual components.

### `connectVariants(Component: React.Component)`

```javascript static
import { connectVariants } from 'studs';

const ConnectedComponent = connectVariants(Component);
```

A very simple component wrapper that provides variant definitions from the context. Wrap any component you want to be aware of the current variant definitions. Exposed on `Theme` as `Theme.connect`.

### `VariantProvider`

```javascript static
import { VariantProvider } from 'studs';

<VariantProvider variant="small">
  <ConnectedComponent />
</VariantProvider>
```

A Provider component that sets variant information in the context. Children of this component which are connected via `connectVariants` will receive the defined variant(s) as a prop, `variant`.

### `asVariant(variant: String|Array)`

```javascript static
import { asVariant } from 'studs';

const SmallButton = asVariant('small')(Button);
```

A higher-order component function which wraps a component with a `VariantProvider` which provides the specified variant(s). Exposed on `Theme` as `Theme.variant`.

### `createThemeProvider(theme: Theme)`

```javascript static
import { createThemeProvider } from 'studs';

const MyThemeProvider = createThemeProvider(myTheme);
```

Utility function to create a customized `styled-components` `ThemeProvider` which will provide the compiled `theme`.

### `spreadStyles(selector: Function)`

```javascript static
import { spreadStyles } from 'studs';

const select = theme
  .register('button', theme => ({
    color: theme.colors.primary,
    background: theme.colors.secondary,
    borderRadius: '4px',
    padding: '4px 8px',
  }))
  .createSelector();

const ButtonImpl = theme.connect(styled.button`${spreadStyles(select)};`);
```

Utility function that uses a component's style selector to quickly and easily generate all style values which correspond to CSS properties.

Simply register style properties for your component which, when converted to `kebab-case`, match a CSS property name. You can then use `spreadStyles` to generate CSS for all these properties within your `styled-components` definition. Properties which do not match a valid CSS property name will be ignored.
