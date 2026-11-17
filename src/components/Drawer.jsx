import { useEffect, useRef } from "react";
import { X } from "lucide-react";
export default function Drawer({ title, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = ref.current;
    panel.querySelector("button")?.focus();
    function containFocus(event) {
      if (!panel.contains(event.target)) panel.querySelector("button")?.focus();
    }
    function keydown(event) {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const items = [
          ...panel.querySelectorAll(
            'a[href], button, input, select, [tabindex="0"]',
          ),
        ];
        const first = items[0],
          last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener("keydown", keydown);
    document.addEventListener("focusin", containFocus);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("focusin", containFocus);
      previous?.focus();
    };
  }, [onClose]);
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className="drawer"
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-heading">
          <strong>{title}</strong>
          <button
            className="icon-button"
            aria-label="Fechar painel"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
