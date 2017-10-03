[View source](https://github.com/a-type/react-studs/blob/master/example/components/Anchor.js)

```
const theme = require('../theme').default;
theme.renderDocumentation('Anchor');
```

_Primary_

```
<Anchor>Primary</Anchor>
```

_Secondary_

```
<Anchor.Secondary>Secondary</Anchor.Secondary>
```

_Custom Variant_

```
/*
 * NOTE:
 * You do not have to extend the base theme to provide a custom variant
 * for a component! It's only done here so we can re-compile the theme
 * to avoid an error from the library about defining a variant after
 * compilation. Normally in an app, you'd be defining your variant
 * in the top-level scope and would not have to worry about this
 * error.
 */
const ThemeProvider = require('styled-components').ThemeProvider;
const theme = require('../theme').default.extend('customTheme');


theme.registerVariant('Anchor', 'custom', {
  color: 'pink',
});
const CustomAnchor = theme.variant('custom')(Anchor);

// as in the comment above, we are providing the theme for this
// example specifically. If you implement a custom variant, you don't
// need another ThemeProvider.
<ThemeProvider theme={theme.compile()}>
  <CustomAnchor href="#">Custom!</CustomAnchor>
</ThemeProvider>
```

_Unknown Variant_

```
const theme = require('../theme').default;
const UnknownAnchor = theme.variant('foo')(Anchor);

<UnknownAnchor href="#">Unknown</UnknownAnchor>
```
