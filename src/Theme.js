import _ from 'lodash';
import connectVariants from './connectVariants';
import { asVariant } from './VariantProvider';
import StyleRenderer from './StyleRenderer';
import React from 'react';

const recompileWarning =
  'Studs theme was recompiled (.compile was called more than once).\n' +
  'This is not advisable in production environments, as it can trigger expensive re-rendering ' +
  'of styled components. Please be sure to register all components and variants before rendering ' +
  'any components and enable production mode in production enviornments.';

const lateRegistrationWarning = name =>
  `A Studs component or variant registration ${name} was made after compilation. ` +
  'If this was due to a hot reload, everything is fine. If this occurred due to your runtime code, ' +
  "it's highly recommended you move this registration to pre-render code.";

export default class Theme {
  connect = connectVariants;
  variant = asVariant;
  eventSubscriptions = [];

  _compiled = null;

  constructor(namespace, globals = {}, options = {}) {
    if (!namespace) {
      throw new Error('namespace is required');
    }
    const isDevelopmentMode = !(
      process &&
      process.env &&
      process.env.NODE_ENV === 'production'
    );
    this._isDevelopmentMode = isDevelopmentMode;
    this.namespace = namespace;
    this.globals = globals;
    this.enableRecompile =
      options.enableRecompile === undefined
        ? isDevelopmentMode
        : options.enableRecompile;
    this.registeredComponents = options.registeredComponents || {};
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
    if (this._compiled && this._isDevelopmentMode) {
      console.warn(lateRegistrationWarning(componentName));
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

    this._publish('COMPONENT_REGISTRATION', { componentName });

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
    if (this._compiled && this._isDevelopmentMode) {
      console.warn(lateRegistrationWarning(`${componentName}:${variantName}`));
    }

    if (!this.registeredComponents[componentName]) {
      throw new Error(
        `Cannot register variant ${variantName} for ${componentName} before the default has been registered`,
      );
    }

    this.registeredComponents[componentName][variantName] = themeValues =>
      this.normalizeThemeConfig(variantStyling)(themeValues);

    this._publish('VARIANT_REGISTRATION', { componentName, variantName });

    return this;
  };

  globalSelector = (valueName, mutator = _.identity) =>
    function({ theme }) {
      return mutator(_.get(theme[this.namespace], valueName));
    }.bind(this);

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
    if (!componentName) {
      return this.globalSelector;
    }
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
    if (this._compiled && !this.enableRecompile) {
      if (this._isDevelopmentMode) {
        console.warn(recompileWarning);
      }
      return this._compiled;
    }

    // Note: mutations appear beyond this point for performance / memory reasons

    const compileVariants = componentRegistration =>
      Object.keys(componentRegistration).reduce((variants, variantName) => {
        variants[variantName] = componentRegistration[variantName](
          this.globals,
        );
        return variants;
      }, {});

    const compiledComponents = Object.keys(
      this.registeredComponents,
    ).reduce((components, componentName) => {
      components[componentName] = compileVariants(
        this.registeredComponents[componentName],
      );
      return components;
    }, {});

    this._compiled = {
      [this.namespace]: {
        ...this.globals,
        components: compiledComponents,
      },
    };

    this._publish('COMPILE', { theme: this._compiled });

    return this._compiled;
  };

  /**
   * Creates a new theme with a basis on a provided theme. Intended to be used
   * by library consumers to alter global theme variables.
   *
   * @memberof Theme
   */
  extend = (overrides, options) =>
    new Theme(this.namespace, _.defaultsDeep(overrides, this.globals), {
      registeredComponents: this.registeredComponents,
      enableRecompile: this.renableRecompile,
      ...options,
    });

  /**
   * Generates documentation you can provide in your own library documentation which
   * enumerates the possible configurable values for a component.
   *
   * @memberof Theme
   */
  renderDocumentation = componentName => (
    <StyleRenderer theme={this} name={componentName} />
  );

  _publish = (eventType, data) => {
    const event = {
      type: eventType,
      ...data,
    };

    this.eventSubscriptions.forEach(callback => {
      callback(event);
    });
  };

  /**
   * Subscribes a callback to various changes:
   *   type: 'COMPONENT_REGISTRATION',
   *   type: 'VARIANT_REGISTRATION',
   *   type: 'COMPILE'
   *
   * Callback will be called with an event object which bears one of these
   * types and additional data about the event if applicable.
   *
   * The primary use for this subscription is internal, to power
   * re-rendering of all themed components for a runtime registration.
   *
   * By default, re-rendering on runtime registrations produces a warning
   * in development mode and is turned off in production mode.
   */
  subscribe = callback => {
    this.eventSubscriptions.push(callback);
  };

  /**
   * Removes a subscription event handler.
   */
  unsubscribe = callback => {
    this.eventSubscriptions = this.eventSubscriptions.filter(
      cb => cb !== callback,
    );
  };
}
