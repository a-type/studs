import Theme, {
  connectVariants,
  VariantProvider,
  asVariant,
  createThemeProvider,
} from '../src';

describe('the library index', () => {
  test('defines Theme', () => {
    expect(Theme).toBeDefined();
  });

  test('defines connectVariants', () => {
    expect(connectVariants).toBeDefined();
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
