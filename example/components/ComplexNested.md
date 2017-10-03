[View source](https://github.com/a-type/react-studs/blob/master/example/components/ComplexNested.js)

```
const theme = require('../theme').default;
theme.renderDocumentation('ComplexNested');
```

`ComplexNested` is a demonstration of the usage of the `compose` feature of defining a variant-enabled component.

Below are two examples of a component which has nested components inside it. One of the components is a composing variant component (the first small button), and another is a non-composing variant component (the second small button).

This component defines a custom variant for itself (which changes its background color), and also defines the same variant on the button, changing its background color as well.

Without outer variant applied, inner variant components behave as expected:

```
<ComplexNested/>
```

When an outer variant is applied, we see that the first small button composes its 'small' variant with the custom outer variant. The second small button overrides the outer variant, so it does not receive the custom background color:

```
<ComplexNested.Custom/>
```

Using composition is up to the needs of your components. If you want users to be able to customize the styling of internal components using their own variants, you should utilize composition. If you want to ensure that an internal component keeps consistent styling without the possibility of user intervention, don't enable composition.
