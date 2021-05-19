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

const Dropdown = ({ className, text, children, divider = false}) => {
  const ref = useRef()
  const [isModalOpen, setModalOpen] = useState(false)
  // Call hook passing in the ref and a function to call on outside click
  useOnClickOutside(ref, () => setModalOpen(false))

  let dividerBlock = <span className="text action">
    {text}
  </span>

  if (divider){
    dividerBlock = <div className="divider action">
      {text}
    </div>
  }

  return (<div
    role="listbox"
    aria-expanded="false"
    className={`${isModalOpen ? 'visible active' : ''} ui top right pointing dropdown ${className}`}
    onClick={() => setModalOpen(true)}
    style={{ position: 'relative' }}
  >
    {dividerBlock}
    <i aria-hidden="true" className="dropdown icon"/>
    {isModalOpen && <div
      ref={ref}
      className='menu transition visible'
    >
      {children}
    </div>}
  </div>)
}

export default Dropdown