// Step A: Load navbar.html
fetch("navbar.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("navbar-container").innerHTML = data;

    // Step B: Toggle logic
    const appName = document.querySelector(".moodlog");
    const nav = document.getElementById("navbar");

    appName.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent document click from hiding it
      nav.classList.toggle("hidden");
    });

    document.addEventListener("click", function (e) {
      if (!nav.contains(e.target) && !appName.contains(e.target)) {
        nav.classList.add("hidden");
      }
    });

    // ✅ Step C: Logout binding after navbar is loaded
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
  });
