import React from 'react';
import PropTypes from 'prop-types';

const tableStyles = {
  fontFamily: 'sans-serif',
  borderCollapse: 'collapse',
};
const rowStyles = {
  border: '1px solid #dddddd',
};
const cellStyles = {
  borderRight: '1px solid #dddddd',
  fontFamily: 'monospace',
  padding: '8px 4px',
};
const headerStyles = {
  ...cellStyles,
  fontFamily: 'sans-serif',
  background: '#f1f1f1',
  fontWeight: 'normal',
};

/**
 * Used to render available configurable style options for a given component within a
 * styleguide or documentation
 */
export default class StyleRenderer extends React.Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
  };

  renderVariantHeaders = () => {
    const { theme, name } = this.props;
    const compiled = theme.compile();
    const allValues = compiled[theme.namespace].components[name];
    const variants = Object.keys(allValues);
    return variants.map(variantName => (
      <th style={headerStyles} key={variantName}>
        Variant: <i>{variantName}</i>
      </th>
    ));
  };

  renderRows = () => {
    const { theme, name } = this.props;
    const selector = theme.createSelector(name);
    const compiled = theme.compile();
    const allValues = compiled[theme.namespace].components[name];
    const variants = Object.keys(allValues);
    const baseValues = allValues.default;
    return Object.keys(baseValues).map(key => (
      <tr key={key} style={rowStyles}>
        <td style={cellStyles}>
          <b>{key}</b>
        </td>
        {variants.map(variantName => (
          <td key={variantName} style={cellStyles}>
            {JSON.stringify(
              selector(key)({ theme: compiled, variant: [variantName] }),
              null,
              '  ',
            )}
          </td>
        ))}
      </tr>
    ));
  };

  render() {
    return (
      <div
        style={{ fontFamily: 'sans-serif' }}
        className="studs-config-renderer"
      >
        <p>
          <b>Configurable Values:</b> These values can be modified using{' '}
          <a href="https://www.npmjs.com/package/react-studs">
            react-studs
          </a>{' '}
          See more{' '}
          <a href="https://www.npmjs.com/package/react-studs#user-customization">
            here.
          </a>
        </p>
        <table style={tableStyles}>
          <thead>
            <tr style={rowStyles}>
              <th style={headerStyles}>Option Name</th>
              {this.renderVariantHeaders()}
            </tr>
          </thead>
          <tbody>{this.renderRows()}</tbody>
        </table>
      </div>
    );
  }
}
