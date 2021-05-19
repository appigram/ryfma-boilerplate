import React, { useState, useEffect, useRef } from 'react'

// Hook
function useOnClickOutside(ref, handler) {
  useEffect(
    () => {
      const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  );
}

const Popup = ({ className, trigger, content, position = 'bottom center', minWidth = 'max-content'}) => {
  const ref = useRef()
  const [isModalOpen, setModalOpen] = useState(false)
  // Call hook passing in the ref and a function to call on outside click
  useOnClickOutside(ref, () => setModalOpen(false))

  let transformCSS = 'translate3d(-65px, 35px, 0)'
  if (position === 'bottom right') {
    transformCSS = 'translate3d(-125px, 35px, 0)'
  } else if (position === 'bottom left') {
    transformCSS = 'translate3d(0, 35px, 0)'
  }

  return (<span onClick={() => setModalOpen(true)} style={{ position: 'relative' }}>
    {trigger}
    {isModalOpen && <div
      ref={ref}
      style={{
        display: 'flex',
        position: 'absolute',
        inset: '0px auto auto 0px',
        zIndex: 9900,
        transform: transformCSS
      }}
    >
      <div
        className={`ui popup transition visible ${position} ${className}`}
        style={{ left: 'auto', right: 'auto', position: 'initial', minWidth: minWidth }}
      >
        {content}
      </div>
    </div>}
  </span>)
}

export default Popup