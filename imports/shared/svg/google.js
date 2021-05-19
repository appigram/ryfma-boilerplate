import React from 'react';
import PropTypes from 'prop-types';

const Google = (props) => {
  const { color, size, ...otherProps } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="-50 20 450 450"
      fill="none"
      stroke={color}
      strokeWidth="43"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <path d="M160,224v64h90.528c-13.216,37.248-48.8,64-90.528,64c-52.928,0-96-43.072-96-96c0-52.928,43.072-96,96-96    c22.944,0,45.024,8.224,62.176,23.168l42.048-48.256C235.424,109.824,198.432,96,160,96C71.776,96,0,167.776,0,256    s71.776,160,160,160s160-71.776,160-160v-32H160z"/>
    </svg>
  );
};

Google.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Google.defaultProps = {
  color: 'currentColor',
  size: '24',
};

export default Google;
