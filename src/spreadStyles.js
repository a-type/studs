import cssProps from 'known-css-properties';
import { paramCase } from 'change-case';

export default (selector, key) => props => {
  const styles = selector(key)(props);
  return Object.keys(styles)
    .map(key => {
      const propName = paramCase(key);
      if (cssProps.all.includes(propName)) {
        return `${propName}: ${styles[key]};\n`;
      }
      return '';
    })
    .reduce((css, line) => `${css}${line}`, '');
};
