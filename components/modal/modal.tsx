import { useRef } from 'react';
import useOnClickOutside from 'use-onclickoutside';

export function Modal({ children, onClose }) {
  const ref = useRef(null);
  useOnClickOutside(ref, onClose);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div ref={ref} className="bg-gray-800 w-full max-w-md">
        {children}
      </div>
    </div>
  )
}