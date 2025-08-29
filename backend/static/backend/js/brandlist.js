import { useState } from "react";
import { createRoot } from "react-dom/client";

function BrandToggleButton() {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    document.querySelectorAll(".extra-brand").forEach(el => el.classList.toggle("d-none"));
    setExpanded(prev => !prev);
  };

  return (
    <button onClick={handleClick} className="btn btn-outline-warning">
      {expanded ? "See Less" : "See More"}
    </button>
  );
}

const mount = document.getElementById("brand-toggle-button");
if (mount) {
  createRoot(mount).render(<BrandToggleButton />);
}
