// ye code dark/light theme toggle ke liye hai, preference localStorage mein save hoti hai
// dono pages (index.html, about-me.html) is file ko use karte hain

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem("theme", theme);
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains("dark");
  applyTheme(isDark ? "light" : "dark");
}

document.getElementById("theme-toggle")?.addEventListener("click", toggleTheme);
document.getElementById("theme-toggle-mobile")?.addEventListener("click", toggleTheme);

// PWA: service worker register karta hai taaki app installable ho
// aur offline/slow connection pe bhi kaam kare
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {
      // Service worker registration fail ho (jaise unsupported preview environment),
      // to bhi app normally kaam karta rahega, bas offline support nahi milega
    });
  });
}
