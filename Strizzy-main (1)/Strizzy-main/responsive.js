document.addEventListener("DOMContentLoaded", function () {
  const dropdownButton = document.querySelector(".dropdown-button");
  const dropdownContent = document.querySelector(".dropdown-content");
  if (dropdownButton && dropdownContent) {
    dropdownButton.addEventListener("click", function () {
      dropdownContent.classList.toggle("open");
    });
  }

  // Mobile / overlay menu toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const header = document.querySelector("header");
  const nav = header ? header.querySelector("nav") : null;
  if (menuToggle && header && nav) {
    menuToggle.addEventListener("click", function () {
      const expanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", String(!expanded));
      header.classList.toggle("open");
    });
    // close when clicking outside
    document.addEventListener("click", function (e) {
      if (header.classList.contains("open")) {
        if (!header.contains(e.target)) {
          header.classList.remove("open");
          menuToggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  }
});
