import cssProps from 'known-css-properties';
import { paramCase } from 'change-case';

export default selector => props => {
  const styles = selector()(props);
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
