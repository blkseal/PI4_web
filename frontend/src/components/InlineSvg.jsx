import React from 'react';

function InlineSvg({ svg, className = '' }) {
  return (
    <span
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export default InlineSvg;
