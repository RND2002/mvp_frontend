export function setTheme(theme: string) {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
    document.cookie = `theme=${theme}; path=/; max-age=31536000`;
}