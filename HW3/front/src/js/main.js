window.transitionToPage = function (href) {
    document.querySelector("body").style.opacity = 0;
    setTimeout(function () {
        window.location.href = href;
    }, 500);
};

document.addEventListener("DOMContentLoaded", function (event) {
    document.querySelector("body").style.opacity = 0;
    setTimeout(function () {
        document.querySelector("body").style.opacity = 1;
    }, 500);
    ///////////////////////////
    const loginType = window.location.search.replace("?", "") || "login";
    if (loginType === "login") gotoLogin();
    if (loginType === "register") gotoRegister();
});

function gotoLogin() {
    if (!document.getElementsByClassName("register")[0]) return;
    document.getElementsByClassName("register")[0].style.display = "none";
    document.getElementsByClassName("login")[0].style.display = "inline";
    document.getElementById("loginButton").classList.remove("bg-primary");
    document.getElementById("loginButton").classList.add("bg-white");
    document.getElementById("registerButton").classList.remove("bg-white");
    document.getElementById("registerButton").classList.add("bg-primary");
}

function gotoRegister() {
    if (!document.getElementsByClassName("login")[0]) return;
    document.getElementsByClassName("login")[0].style.display = "none";
    document.getElementsByClassName("register")[0].style.display = "inline";
    document
        .getElementById("registerButton")
        .classList.remove("bg-primary");
    document.getElementById("registerButton").classList.add("bg-white");
    document.getElementById("loginButton").classList.add("bg-primary");
    document.getElementById("loginButton").classList.remove("bg-white");
}

const isSidebarOpen = false;
function openSidebar() {
    if (!document.getElementById("toggleButton")) return;
    document.getElementById("toggleButton").style.display = "none";
    document.getElementById("close").style.display = "block";
    document.getElementById("sidebar").classList.add("d-block");
    document.getElementById("sidebar").classList.remove("d-none");
}
function closeSidebar() {
    if (!document.getElementById("toggleButton")) return;
    document.getElementById("toggleButton").style.display = "block";
    document.getElementById("close").style.display = "none";
    document.getElementById("sidebar").classList.add("d-none");
    document.getElementById("sidebar").classList.remove("d-block");
}