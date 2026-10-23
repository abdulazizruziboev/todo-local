import { themeTogglerButtonEl } from "./htmlElements.js";

checkThemeInit();

function checkThemeInit() {
    const currentTheme = localStorage.getItem("theme");
    if(currentTheme === null && (currentTheme!=="light"||currentTheme!=="dark") ) localStorage.setItem("theme","light");
}

initTheme();

function initTheme() { 
    const currentTheme = localStorage.getItem("theme");
    if(currentTheme === "light") document.firstElementChild.classList.remove("dark");
    else document.firstElementChild.classList.add("dark");
}

function changeTheme() {
    const currentTheme = localStorage.getItem("theme");
    localStorage.setItem("theme",currentTheme === "light" ? "dark" : "light")
    initTheme();    
}

themeTogglerButtonEl.addEventListener("click",changeTheme)