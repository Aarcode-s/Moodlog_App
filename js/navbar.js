// Load reusable navbar markup
fetch("navbar.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("navbar-container").innerHTML = data;

    const appName = document.querySelector(".moodlog");
    const nav = document.getElementById("navbar");

    if (!appName || !nav) return;

    appName.addEventListener("click", function (e) {
      e.stopPropagation();
      nav.classList.toggle("hidden");
    });

    document.addEventListener("click", function (e) {
      if (!nav.contains(e.target) && !appName.contains(e.target)) {
        nav.classList.add("hidden");
      }
    });

    const logoutBtn = document.querySelector(".logout-button");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        try {
          const { logout } = await import("./auth.js");
          await logout();
          window.location.href = "index.html";
        } catch (error) {
          alert(error.message);
        }
      });
    }
  })
  .catch((error) => {
    console.error("Failed to load navbar:", error);
  });

// Support existing inline onclick="toggleNavbar()" in page headers.
window.toggleNavbar = function toggleNavbar() {
  const nav = document.getElementById("navbar");
  if (nav) {
    nav.classList.toggle("hidden");
  }
};
