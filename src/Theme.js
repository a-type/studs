import _ from 'lodash';
import connectTheme from './connectTheme';
import { asVariant } from './VariantProvider';

export default class Theme {
  connect = connectTheme;
  variant = asVariant;

  _compiled = null;

  constructor(namespace, base, overrides = {}, components = {}) {
    this.namespace = namespace;
    this.globals = _.defaultsDeep(overrides, base);
    this.registeredComponents = components;
  }

  normalizeThemeConfig = themeConfig =>
    _.isFunction(themeConfig)
      ? globalTheme => themeConfig(globalTheme[this.namespace])
      : () => themeConfig;

  /**
   * Registers a component's style configuration into the theme.
   *
   * @memberof Theme
   */
  register = (componentName, defaultTheme) => {
    // registering components at render time is not allowed; all components
    // should be registered in the top-level scope before compiling the theme.
    if (this._compiled) {
      throw new Error(
        `Cannot register component ${componentName}; you must register all components before calling theme.compile`,
      );
    }

    const defaultThemeConfig = this.normalizeThemeConfig(defaultTheme);
    this.registeredComponents[componentName] = { default: defaultThemeConfig };

    // convenience chaining to remove need to pass componentName again
    // for defining variants and creating selectors from an initial definition
    const chain = {
      addVariant: (variantName, variantConfiguration) => {
        this.registerVariant(componentName, variantName, variantConfiguration);
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
  registerVariant = (componentName, variantName, variantConfiguration) => {
    // registering variants at render time is not allowed; all components
    // should be registered in the top-level scope before compiling the theme.
    if (this._compiled) {
      throw new Error(
        `Cannot register variant ${variantName} for ${componentName}; you must register all variants before calling theme.compile`,
      );
    }

    if (
      !this.registeredComponents[componentName] &&
      this.registeredComponents[componentName].default
    ) {
      throw new Error(
        `Cannot register a variant for ${componentName} before the default has been registered`,
      );
    }

    const defaultThemeConfig = this.registeredComponents[componentName].default;
    // variant has defaults based on the provided default configuration
    this.registeredComponents[componentName][variantName] = themeValues =>
      _.defaultsDeep(
        this.normalizeThemeConfig(variantConfiguration)(themeValues),
        defaultThemeConfig(themeValues),
      );

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
  createSelector = componentName => value => ({
    theme,
    variant = 'default',
  }) => {
    const computedValues = (theme[this.namespace].components[componentName][
      variant
    ] || theme[this.namespace].components[componentName].default)(theme);

    if (value) {
      return computedValues[value];
    }

    // empty value string returns the whole set
    return computedValues;
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

    this._compiled = {
      [this.namespace]: {
        ...this.globals,
        components: this.registeredComponents,
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
  extend = (namespace, extensions) =>
    new Theme(namespace, this.globals, extensions, this.registeredComponents);
}
