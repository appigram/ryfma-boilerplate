import React from 'react';
import PropTypes from 'prop-types';

const YandexMoney = (props) => {
  const { color, size, ...otherProps } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <path d="m484.5 53.445h-458.94c-14.09 0-25.56 11.47-25.56 25.57 0 14.084 11.397 25.55 25.56 25.55h458.94c9.19 0 17.86 2.24 25.5 6.22v-31.84c0-14.06-11.44-25.5-25.5-25.5z"/><path d="m484.5 134.565h-458.94c-9.05 0-17.76-2.14-25.56-6.19v302.68c0 14.06 11.44 25.5 25.5 25.5h459c14.06 0 25.5-11.44 25.5-25.5v-74.09c-.759 0-121.971.011-122.73-.02-.01.01-.02 0-.02 0-33.5-.41-60.63-27.79-60.63-61.39 0-33.85 27.55-61.4 61.4-61.4h121.98c0-14.77 0-58.647 0-74.09 0-14.036-11.429-25.5-25.5-25.5z"/><path d="m440.76 326.965h69.24v-62.81h-69.24c11.532 19.268 11.574 43.449 0 62.81z"/><path d="m356.62 295.555c0 17.413 14.2 31.4 31.4 31.4 17.33 0 31.4-14.091 31.4-31.4 0-17.292-14.068-31.4-31.4-31.4-17.255 0-31.4 14.055-31.4 31.4z"/>
    </svg>
  );
};

YandexMoney.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

YandexMoney.defaultProps = {
  color: 'currentColor',
  size: '24',
};

export default YandexMoney;
