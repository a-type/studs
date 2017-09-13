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

  test('compiles global values', () => {
    expect(theme.compile()).toEqual({
      [namespace]: {
        ...globals,
        components: {},
      },
    });
  });

  const registerButton = () =>
    theme
      .register('button', values => ({
        color: values.colors.primary,
        fontSize: '16px',
        font: values.fonts.main,
      }))
      .createSelector();

  test('registers a component', () => {
    registerButton();

    const compiled = theme.compile();
    expect(compiled[namespace].components.button.default).toBeDefined();
  });

  test('can select a value for a component', () => {
    const selector = registerButton();
    const compiled = theme.compile();

    expect(selector('color')({ theme: compiled, variant: 'default' })).toEqual(
      globals.colors.primary,
    );
  });

  test('can select all values for a component', () => {
    const selector = registerButton();
    const compiled = theme.compile();

    expect(selector()({ theme: compiled, variant: 'default' })).toEqual({
      color: globals.colors.primary,
      fontSize: '16px',
      font: globals.fonts.main,
    });
  });
});
