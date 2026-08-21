(function () {
  if (!document.body.classList.contains("about-page")) return;

  const bar = document.getElementById("about-progress-bar");
  const onScroll = () => {
    if (!bar) return;
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const p = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    bar.style.width = p + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Subtle parallax on ambient orbs
  const orbs = document.querySelectorAll(".about-ambient__orb");
  if (orbs.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY * 0.04;
        orbs.forEach((o, i) => {
          o.style.transform = `translateY(${y * (i % 2 === 0 ? 1 : -0.6)}px)`;
        });
      },
      { passive: true }
    );
  }

  // Pointer glow on cards
  document.querySelectorAll(".about-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty("--mx", x + "%");
      card.style.setProperty("--my", y + "%");
    });
  });
})();
