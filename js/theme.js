const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const root = document.documentElement;

function applyTheme(theme) {
    root.setAttribute("data-theme", theme);

    const isDark = theme === "dark";

    themeIcon.textContent = isDark ? "☀" : "☾";

    document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", isDark ? "#08090b" : "#f5f7fa");

    localStorage.setItem("portfolio-theme", theme);
}

const savedTheme = localStorage.getItem("portfolio-theme");

applyTheme(savedTheme || "dark");

themeToggle.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme");

    applyTheme(currentTheme === "dark" ? "light" : "dark");
});