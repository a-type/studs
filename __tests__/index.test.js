import Theme, {
  connectTheme,
  VariantProvider,
  asVariant,
  createThemeProvider,
} from '../src';

describe('the library index', () => {
  test('defines Theme', () => {
    expect(Theme).toBeDefined();
  });

  test('defines connectTheme', () => {
    expect(connectTheme).toBeDefined();
  });

  test('defines VariantProvider', () => {
    expect(VariantProvider).toBeDefined();
  });

  test('defines asVariant', () => {
    expect(asVariant).toBeDefined();
  });

  test('defines createThemeProvider', () => {
    expect(createThemeProvider).toBeDefined();
  });
});
