document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.querySelector(".login");
  const heading = document.querySelector(".heading");
  const form = document.getElementById("registerForm");

  const nameLabel = document.querySelector('label[for="name"]');
  const mobileLabel = document.querySelector('label[for="mobile"]');
  const toggleText = document.querySelector(".AnotherText");
  const toggleBtn = document.querySelector("span");

  const nameInput = document.getElementById("name");
  const mobileInput = document.getElementById("mobile");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  passwordInput.addEventListener("input", () => {
    const val = passwordInput.value;

    // Strong condition (you can modify it)
    const isStrong =
      val.length >= 8 &&
      /[a-z]/.test(val) &&
      /[A-Z]/.test(val) &&
      /\d/.test(val) &&
      /[!@#$%^&*]/.test(val);

    // Apply class based on strength
    passwordInput.classList.remove("strong", "weak");

    if (val.length > 0) {
      passwordInput.classList.add(isStrong ? "strong" : "weak");
    }
  });
  function updateUIForMode() {
    const isLoginMode = loginBtn.innerText === "Login";

    nameLabel.style.display = isLoginMode ? "none" : "block";
    mobileLabel.style.display = isLoginMode ? "none" : "block";
    nameInput.style.display = isLoginMode ? "none" : "block";
    mobileInput.style.display = isLoginMode ? "none" : "block";

    heading.innerText = isLoginMode
      ? "Welcome Back"
      : "Get Started With India's Best Crypto Trading Website";

    toggleText.innerText = isLoginMode
      ? "New Here?"
      : "Already have an account?";
    toggleBtn.innerText = isLoginMode ? "signUp" : "Login";

    // Clear input values and toggle disable state
    nameInput.value = "";
    mobileInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";

    nameInput.disabled = isLoginMode;
    mobileInput.disabled = isLoginMode;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const val = passwordInput.value;

    const isStrong =
      val.length >= 8 &&
      /[a-z]/.test(val) &&
      /[A-Z]/.test(val) &&
      /\d/.test(val) &&
      /[!@#$%^&*]/.test(val);

    if (loginBtn.innerText === "Register") {
      if (!isStrong) {
        alert("Please enter a strong password.");
        return;
      }

      // Register user
      sessionStorage.setItem("username", emailInput.value);
      sessionStorage.setItem("password", passwordInput.value);
      sessionStorage.setItem("name", nameInput.value);

      alert("Registered successfully!");
      loginBtn.innerText = "Login";

      updateUIForMode();
    } else {
      // Login logic
      const storedEmail = sessionStorage.getItem("username");
      const storedPassword = sessionStorage.getItem("password");

      if (
        emailInput.value === storedEmail &&
        passwordInput.value === storedPassword
      ) {
        emailInput.value = "";
        passwordInput.value = "";
        alert("Login successful!");
        window.location.href = "index.html";
      } else if (!storedEmail || !storedPassword) {
        loginBtn.innerText = "Register";
        updateUIForMode();
        alert("Please sign up first.");
      } else {
        alert("Invalid username or password.");
      }
    }
  });

  toggleBtn.addEventListener("click", () => {
    loginBtn.innerText = loginBtn.innerText === "Login" ? "Register" : "Login";
    updateUIForMode();
  });

  // Initialize correct UI state
  updateUIForMode();
  let EyeBtn = document.querySelector(".Eyecon");
  EyeBtn.addEventListener("click", (e) => {
    EyeBtn.classList.toggle("fa-eye-slash");
    EyeBtn.classList.toggle("fa-eye");
    let a = passwordInput.getAttribute("type");
    passwordInput.setAttribute("type", a == "password" ? "text" : "password");
  });
});
