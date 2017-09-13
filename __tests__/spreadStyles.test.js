import spreadStyles from '../src/spreadStyles';

describe('the spreadStyles helper', () => {
  const mockSelector = () => () => ({
    color: 'red',
    background: 'blue',
    fontSize: '12px',
    fontFamily: 'Arial',
    foo: 'bar',
    fooBar: 'baz',
    'line-height': '4em',
  });

  test('converts a style definition into css', () => {
    expect(spreadStyles(mockSelector)('mock theme')).toEqual(
      `color: red;
background: blue;
font-size: 12px;
font-family: Arial;
line-height: 4em;
`,
    );
  });
});
