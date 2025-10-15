import { useEffect, useRef, useState } from "react";
import NavBar from "./NavBar";

export default function Header() {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [pinned, setPinned] = useState(false);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const node = headerRef.current;
    if (!node) return;
    setHeight(node.offsetHeight);

    const handleResize = () => {
      if (headerRef.current) setHeight(headerRef.current.offsetHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setPinned(window.scrollY > 80);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const baseClasses =
    "navbar bg-base-100 transition-transform duration-300 ease-out will-change-transform";
  const pinnedClasses = pinned
    ? "fixed top-0 left-0 right-0 z-40 shadow-lg bg-base-100/90 backdrop-blur header-pinned"
    : "relative shadow-sm header-static";

  return (
    <>
      {pinned && <div style={{ height }} aria-hidden="true" />}
      <header
        ref={headerRef}
        className={`${baseClasses} ${pinnedClasses}`}
      >
        <NavBar />
      </header>
    </>
  );
}
