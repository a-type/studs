## styled-library-themer
> A theme integration library built on top of styled-components targeting shared component library use cases

`styled-library-themer` integrates and extends `styled-components` to provide a seamless theme and user-customization experience for component libraries. By replacing your 'dumb' theme object with a smart one and exposing powerful utilities to your library's consumers, we can:

* Co-locate component styling properties with our component code while still providing them through the `styled-components` root theme.
* Namespace our theme out-of-the-box without extra complications.
* Easily whip up arbitrary variants of components.
* Utilize shared theme values throughout all our component styles without having to import them everywhere.
* Generate simplified selector functions for our component style values-- no more `${({ theme }) => theme.button.color}`, now we have `${select('color')}`!
* Expose the ability for our library consumers to create customized variants of our components by overriding our defined style properties for specific use cases.
* Let our library consumers override our theme's global shared values to alter colors, fonts, etc with precision and ease.

`styled-library-themer` doesn't override or modify `styled-components` in any way, it leverages the manner in which `styled-components` was designed to be extensible and flexible by building abstractions on top of it. So it's simple to integrate into your existing library!

To begin, create your theme with your shared style values. These global values can be reused by all your components.

```javascript static
// theme.js
import Theme from 'styled-library-themer';

const globals = {
  colors: {
    primary: '#133337',
    secondary: '#4ac9e2',
  },
  fonts: {
    main: '"Open Sans", Helvetica, Arial, sans-serif',
  },
};

const theme = new Theme('myLibraryNamespace', globals);
export default theme;
```

Now, when you define a new component in your library, register its desired configurable style properties:

```javascript static
// Button.js
import theme from './theme';
import styled from 'styled-components';

// `values` is the `globals` you defined when creating the theme
theme.register('button', (values) => ({
  color: values.colors.secondary,
  background: values.colors.primary,
  fontFamily: values.fonts.main,
  borderRadius: '4px',
  padding: '4px 8px',
}));

// button is now registered, but we can also add a variant config
theme.registerVariant('button', 'secondary', (values) => ({
  // variants are recursively merged with defaults, so just define what you need
  color: 'white',
  background: values.colors.secondary,
}));

// after registering our button, we can create a selector to retrieve
// the configurable values we defined
const select = theme.createSelector('button');

// now we can define our component styles
const Button = theme.connect(styled.button`
  color: ${select('color')};
  background: ${select('background')};
  font-family: ${select('fontFamily')};
  border-radius: ${select('borderRadius')};
  padding: ${select('padding')};
`);

// we can also define a variant
Button.Secondary = theme.variant('secondary')(Button);

export default Button;
```

To recap, we created a set of configurable values for our component and defined some default values for them. We also created a variant of that configuration with some values overrided. Then we just applied the values to our `styled-component` definition and whipped up a sub-component which uses our variant to export as well.

Of course, it takes a bit more planning and effort to define all your configurable values ahead of time (but really, not _that_ much more). But as a library provider, this gives you a lot of benefit for your users. You can now document your configurable style values for your component in your library documentation, and just like that, your users can easily customize their own variant using the exact same methods you did.

You don't always have to write all that code, though. `Theme` provides some chaining to do common sets of tasks more easily and avoid repeating the component name:

```javascript static
// Button.js
import theme from './theme';
import styled from 'styled-components';

const select = theme.register('button', (values) => ({
  color: values.colors.secondary,
  background: values.colors.primary,
  fontFamily: values.fonts.main,
  borderRadius: '4px',
  padding: '4px 8px',
})).addVariant('secondary', (values) => ({
  color: 'white',
  background: values.colors.secondary,
})).createSelector();

const Button = theme.connect(styled.button`
  color: ${select('color')};
  background: ${select('background')};
  font-family: ${select('fontFamily')};
  border-radius: ${select('borderRadius')};
  padding: ${select('padding')};
`);

Button.Secondary = theme.variant('secondary')(Button);

export default Button;
```

... a bit more succinct!

When a user wants to utilize your library, they will provide the theme. You should create a customized `ThemeProvider` and export it from your library to make things simple.

```javascript static
/* import ... */
import { createThemeProvider } from 'styled-library-themer';
import theme from './theme';

export const MyLibraryThemeProvider = createThemeProvider(theme);
```

The reason this is critical when using `styled-library-themer` is due to the requirement that a theme made with this library must be compiled on the initial render of the app. Individual components register their own style configurations in the top-level scope of their respective files, and users may also register their own variants to extend your styles. To avoid these changes causing top-level re-renders on load, compilation takes all registered component definitions at render-time and compiles them into a static theme. Once compiled, the theme will not accept new component registrations or variants. This is intended to simplify the theme creation process and prevent performance gotchas. `compile` is memoized, so subsequent calls after the first will not trigger a re-render.

Rather than explain all this to your library users, just tell them to use your custom `ThemeProvider`!
