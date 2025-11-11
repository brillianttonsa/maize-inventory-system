import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const mainDiv = document.querySelector("main"); // targets your scrollable main
    if (mainDiv) {
      mainDiv.scrollTop = 0; // scrolls to top
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
