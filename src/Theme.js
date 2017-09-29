import _ from 'lodash';
import connectVariants from './connectVariants';
import { asVariant } from './VariantProvider';

export default class Theme {
  connect = connectVariants;
  variant = asVariant;

  _compiled = null;

  constructor(namespace, globals = {}, components = {}) {
    if (!namespace) {
      throw new Error('namespace is required');
    }
    this.namespace = namespace;
    this.globals = globals;
    this.registeredComponents = components;
  }

  normalizeThemeConfig = themeConfig =>
    _.isFunction(themeConfig)
      ? globalValues => themeConfig(globalValues)
      : () => themeConfig;

  /**
   * Registers a component's style configuration into the theme.
   *
   * @memberof Theme
   */
  register = (componentName, defaultStyling) => {
    // registering components at render time is not allowed; all components
    // should be registered in the top-level scope before compiling the theme.
    if (this._compiled) {
      throw new Error(
        `Cannot register component ${componentName}; you must register all components before calling theme.compile`,
      );
    }

    const defaultStyleConfig = this.normalizeThemeConfig(defaultStyling);
    this.registeredComponents[componentName] = { default: defaultStyleConfig };

    // convenience chaining to remove need to pass componentName again
    // for defining variants and creating selectors from an initial definition
    const chain = {
      addVariant: (variantName, variantStyling) => {
        this.registerVariant(componentName, variantName, variantStyling);
        return chain;
      },
      createSelector: _.partial(this.createSelector, componentName),
    };

    return chain;
  };

  /**
   * Registers a variant of a component's style configurations. The variant
   * config is additive to the default config; you can just provide the values
   * you want to override from your registered default.
   *
   * @memberof Theme
   */
  registerVariant = (componentName, variantName, variantStyling) => {
    // registering variants at render time is not allowed; all components
    // should be registered in the top-level scope before compiling the theme.
    if (this._compiled) {
      throw new Error(
        `Cannot register variant ${variantName} for ${componentName}; you must register all variants before calling theme.compile`,
      );
    }

    if (!this.registeredComponents[componentName]) {
      throw new Error(
        `Cannot register variant ${variantName} for ${componentName} before the default has been registered`,
      );
    }

    this.registeredComponents[componentName][variantName] = themeValues =>
      this.normalizeThemeConfig(variantStyling)(themeValues);

    return this;
  };

  /**
   * Creates a value selector which can be used to easily select a component's
   * theme values within a styled-components definition.
   *
   * ```
   * const selector = theme.createSelector('button');
   * const Button = styled.button`
   *   color: ${selector('color')};
   * `;
   * ```
   *
   * @memberof Theme
   */
  createSelector = componentName => {
    // using function keyword here since my syntax highlighting is confused
    return (valueName, mutator = _.identity) =>
      function({ theme, variant = 'default' }) {
        const variantList = _.isArray(variant)
          ? [...variant, 'default']
          : [variant, 'default'];
        const styles = variantList.map(
          variantName =>
            _.clone(
              theme[this.namespace].components[componentName][variantName],
            ) || {},
        );
        const computedValues = _.defaultsDeep(...styles);

        if (valueName) {
          return mutator(_.get(computedValues, valueName));
        }

        // empty valueName string returns the whole set
        return mutator(computedValues);
      }.bind(this);
  };

  /**
   * Compiles all component theme definitions registered by the library into
   * a theme object ready to be passed to styled-components' ThemeProvider.
   *
   * @memberof Theme
   */
  compile = () => {
    if (this._compiled) {
      return this._compiled;
    }

    const compileVariants = componentRegistration =>
      Object.keys(componentRegistration).reduce(
        (variants, variantName) => ({
          ...variants,
          [variantName]: componentRegistration[variantName](this.globals),
        }),
        {},
      );

    const compiledComponents = Object.keys(this.registeredComponents).reduce(
      (components, componentName) => ({
        ...components,
        [componentName]: compileVariants(
          this.registeredComponents[componentName],
        ),
      }),
      {},
    );

    this._compiled = {
      [this.namespace]: {
        ...this.globals,
        components: compiledComponents,
      },
    };

    return this._compiled;
  };

  /**
   * Creates a new theme with a basis on a provided theme. Intended to be used
   * by library consumers to alter global theme variables.
   *
   * @memberof Theme
   */
  extend = overrides =>
    new Theme(
      this.namespace,
      _.defaultsDeep(overrides, this.globals),
      this.registeredComponents,
    );
}
