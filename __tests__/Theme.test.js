import Theme from '../src/Theme';

describe('the Theme class', () => {
  const namespace = 'testTheme';
  const globals = {
    colors: {
      primary: '#133337',
      secondary: '#4ac9e2',
    },
    fonts: {
      main: 'sans-serif',
    },
  };

  let theme;

  beforeEach(() => {
    theme = new Theme(namespace, globals);
  });

  test('rejects construction without namespace', () => {
    expect(() => new Theme()).toThrow('namespace is required');
  });

  test('compiles global values', () => {
    expect(theme.compile()).toEqual({
      [namespace]: {
        ...globals,
        components: {},
      },
    });

    // not memoized in non-production env
    expect(theme.compile() === theme.compile()).toBeFalsy();
  });

  test('emits an event on compilation', () => {
    const cb = jest.fn();
    theme.subscribe(cb);
    const compiled = theme.compile();
    expect(cb).toBeCalledWith({ type: 'COMPILE', theme: compiled });
    theme.unsubscribe(cb);
  });

  test('memoizes compile when recompile is disabled', () => {
    const noRecompileTheme = new Theme(namespace, globals, {
      enableRecompile: false,
    });
    // compilation is memoized
    expect(noRecompileTheme.compile()).toBe(noRecompileTheme.compile());
  });

  describe('in a production environment', () => {
    let envValue;
    let prodTheme;
    beforeAll(() => {
      envValue = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      prodTheme = new Theme(namespace, globals);
    });

    afterAll(() => {
      process.env.NODE_ENV = envValue;
    });

    test('memoizes compile by default', () => {
      expect(prodTheme.compile()).toBe(prodTheme.compile());
    });
  });

  test('works with no globals', () => {
    expect(new Theme('noglobals').compile()).toEqual({
      noglobals: {
        components: {},
      },
    });
  });

  const registerButton = () =>
    theme.register('button', values => ({
      color: values.colors.primary,
      fontSize: '16px',
      font: values.fonts.main,
    }));

  test('registers a component', () => {
    registerButton();

    const compiled = theme.compile();
    expect(compiled[namespace].components.button.default).toBeDefined();
    expect(compiled[namespace].components.button.default).toEqual({
      color: globals.colors.primary,
      fontSize: '16px',
      font: globals.fonts.main,
    });
  });

  test('registers a component with a plain object', () => {
    theme.register('button', { color: 'red' });

    const compiled = theme.compile();
    expect(compiled[namespace].components.button.default).toBeDefined();
    expect(compiled[namespace].components.button.default).toEqual({
      color: 'red',
    });
  });

  test('emits an event for component registration', () => {
    const cb = jest.fn();
    theme.subscribe(cb);
    theme.register('button', { color: 'red' });
    expect(cb).toBeCalledWith({
      type: 'COMPONENT_REGISTRATION',
      componentName: 'button',
    });
    theme.unsubscribe(cb);
  });

  test('can select a value for a component', () => {
    const selector = registerButton().createSelector();
    const compiled = theme.compile();

    expect(selector('color')({ theme: compiled, variant: 'default' })).toEqual(
      globals.colors.primary,
    );
  });

  test('can select a value for a component without a variant', () => {
    const selector = registerButton().createSelector();
    const compiled = theme.compile();

    expect(selector('color')({ theme: compiled })).toEqual(
      globals.colors.primary,
    );
  });

  test('can select a value for a component with an unknown variant', () => {
    const selector = registerButton().createSelector();
    const compiled = theme.compile();

    expect(selector('color')({ theme: compiled, variant: 'foo' })).toEqual(
      globals.colors.primary,
    );
  });

  test('can select and mutate a value', () => {
    const selector = registerButton().createSelector();
    const compiled = theme.compile();

    expect(selector('color', val => val + '_foo')({ theme: compiled })).toEqual(
      globals.colors.primary + '_foo',
    );
  });

  test('can select all values for a component', () => {
    const selector = registerButton().createSelector();
    const compiled = theme.compile();

    expect(selector()({ theme: compiled, variant: 'default' })).toEqual({
      color: globals.colors.primary,
      fontSize: '16px',
      font: globals.fonts.main,
    });
  });

  test('registers a variant', () => {
    const selector = registerButton()
      .addVariant('secondary', values => ({
        color: values.colors.secondary,
      }))
      .createSelector();
    const compiled = theme.compile();

    expect(compiled[namespace].components.button.secondary).toBeDefined();
    expect(compiled[namespace].components.button.secondary).toEqual({
      color: globals.colors.secondary,
    });
  });

  test('emits an event for variant registration', () => {
    theme.register('button', { color: 'red' });
    const cb = jest.fn();
    theme.subscribe(cb);
    theme.registerVariant('button', 'foo', { color: 'red' });
    expect(cb).toBeCalledWith({
      type: 'VARIANT_REGISTRATION',
      componentName: 'button',
      variantName: 'foo',
    });
    theme.unsubscribe(cb);
  });

  test('rejects variant registration before component registration', () => {
    expect(() => {
      theme.registerVariant('button', 'secondary', () => ({}));
    }).toThrow(/Cannot register variant secondary for button/);
  });

  test('can select from a variant', () => {
    const selector = registerButton()
      .addVariant('secondary', values => ({
        color: values.colors.secondary,
      }))
      .createSelector();
    const compiled = theme.compile();

    expect(
      selector('color')({ theme: compiled, variant: 'secondary' }),
    ).toEqual(globals.colors.secondary);
    expect(
      selector('fontSize')({ theme: compiled, variant: 'secondary' }),
    ).toEqual('16px');
    expect(selector('color')({ theme: compiled, variant: 'default' })).toEqual(
      globals.colors.primary,
    );
  });

  test('can select from multiple variants', () => {
    const selector = registerButton()
      .addVariant('secondary', values => ({
        color: values.colors.secondary,
        font: 'Helvetica',
      }))
      .addVariant('tertiary', values => ({
        color: 'red',
      }))
      .createSelector();
    const compiled = theme.compile();
    const variant = ['tertiary', 'secondary'];

    expect(selector('color')({ theme: compiled, variant })).toEqual('red');
    expect(selector('font')({ theme: compiled, variant })).toEqual('Helvetica');
    expect(selector('fontSize')({ theme: compiled, variant })).toEqual('16px');
  });

  test('can create a selector for a nonexistent component', () => {
    expect(theme.createSelector('foo')).toBeDefined();
  });

  test('is extensible', () => {
    const customTheme = theme.extend({
      colors: { primary: 'red' },
    });
    const compiled = customTheme.compile();

    expect(compiled).toEqual({
      [namespace]: {
        colors: {
          primary: 'red',
          secondary: '#4ac9e2',
        },
        fonts: {
          main: 'sans-serif',
        },
        components: {},
      },
    });
  });

  test('can create a global selector', () => {
    const select = theme.createSelector();
    const compiled = theme.compile();
    expect(select('colors.primary')({ theme: compiled })).toEqual('#133337');
  });

  test('can create a global selector which can be used to traverse components', () => {
    registerButton();
    const compiled = theme.compile();
    const select = theme.createSelector();
    expect(
      select('components.button.default.color')({ theme: compiled }),
    ).toEqual('#133337');
  });
});
