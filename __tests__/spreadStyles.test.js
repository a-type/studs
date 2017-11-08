import spreadStyles from '../src/spreadStyles';
import Theme from '../src/Theme';

describe('the spreadStyles helper', () => {
  const theme = new Theme('test');
  const select = theme
    .register('Foo', {
      subSection: {
        fontFamily: 'sans-serif',
        lineHeight: '1.2',
      },
      color: 'red',
      background: 'blue',
      foo: 'bar',
    })
    .createSelector();
  const compiled = theme.compile();

  test('converts a root style definition into css', () => {
    expect(spreadStyles(select)({ theme: compiled })).toEqual(
      ['color: red;', 'background: blue;', ''].join('\n'),
    );
  });

  test('converts a subsection to css', () => {
    expect(spreadStyles(select, 'subSection')({ theme: compiled })).toEqual(
      ['font-family: sans-serif;', 'line-height: 1.2;', ''].join('\n'),
    );
  });
});
