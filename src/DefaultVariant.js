import React from 'react';
import VariantProvider from './VariantProvider';

/**
 * Helper component that resets variants to default to prevent higher components
 * from contributing variants to ones lower in the tree.
 */
export default ({ children }) => (
  <VariantProvider variant={['default']} compose={false}>
    {children}
  </VariantProvider>
);
