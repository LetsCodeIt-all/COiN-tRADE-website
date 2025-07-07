document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".NavBar");

  // ===================== Navbar =====================
  navbar.innerHTML = `
    <div class="NavBarName">
      <h1>COiN tRADE</h1>
    </div>

    <div class="NavBarContent">
      <div class="NavBarlinks">
        <a href="index.html" class="Home">Home</a>
        <a href="#">Individuals</a>
        <a href="#">Institutions</a>
        <a href="#">Developers</a>
        <a href="#" class="Portfolio">Portfolio</a>
      </div>

      <div class="NavbarBtn">
        <button id="logName"> SignUp</button>
        <i class="fa-solid fa-bars menu-toggle"></i>
      </div>

      <div class="Menu">
        <a href="index.html" class="Home">Home</a>
        <a href="#">Individuals</a>
        <a href="#">Institutions</a>
        <a href="#">Developers</a>
        <a href="#" class="Portfolio">Portfolio</a>
      </div>
    </div>
  `;

  // ===================== Footer =====================
  const footer = document.querySelector(".footer");
  footer.innerHTML = `
    <div class="leftFooter">
      <h4>COiN tRADE</h4>
      <p>Connect us 
        <i class="fa-brands fa-facebook"></i>
        <i class="fa-brands fa-instagram"></i>
        <i class="fa-brands fa-whatsapp"></i>
        <i class="fa-brands fa-discord"></i>
        <i class="fa-brands fa-linkedin"></i>
        <i class="fa-brands fa-reddit"></i>
      </p>
    </div>

    <div class="rightFooter">
      <ul>
        <li>About</li>
        <li>Careers</li>
        <li>Blogs</li>
        <li>Security</li>
        <li>FAQs</li>
      </ul>
    </div>
  `;

  // ===================== Sticky Navbar =====================
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("sticky", window.scrollY >= 100);
  });

  // ===================== Logged-in Logic =====================
  const username = sessionStorage.getItem("name");
  const logBtn = document.querySelector("#logName");
  const portfolioLinks = document.querySelectorAll(".Portfolio");

  if (username) {
    // Show user name
    logBtn.textContent = `Hello, ${username}`;

    // Go to portfolio on click
    portfolioLinks.forEach((link) => {
      link.setAttribute("href", "portfolio.html");
      link.addEventListener("click", (e) => {
        e.preventDefault();
        link.classList.add("active");
        link.style.pointerEvents = "none";
        window.location.href = "portfolio.html";
      });
    });

    // Optional: convert SignUp to Logout
    logBtn.addEventListener("click", () => {
      if (confirm("Log out?")) {
        sessionStorage.clear();
        window.location.href = "login.html";
      }
    });
  } else {
    // If not logged in
    portfolioLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        alert("You haven't signed up yet");
        window.location.href = "login.html";
      });
    });

    logBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }

  // ===================== Active Link Highlight =====================
  const currentUrl = new URL(window.location.href);
  const setActive = (selector) => {
    document.querySelectorAll(selector).forEach((link) => {
      const href = link.getAttribute("href");
      if (href && currentUrl.pathname.includes(href)) {
        link.classList.add("active");
        link.style.pointerEvents = "none";
      }
    });
  };

  setActive(".Home");
  setActive(".Portfolio");

  // ===================== Menu Toggle =====================
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".Menu");

  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.style.display = "flex";
  });

  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".Menu") &&
      !e.target.closest(".menu-toggle") &&
      menu.style.display === "flex"
    ) {
      menu.style.display = "none";
    }
  });
});
