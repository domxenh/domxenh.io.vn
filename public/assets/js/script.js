fetch('../components/header.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
    initMenu();
  });

function initMenu(){

  const toggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const overlay = document.querySelector(".menu-overlay");
  const closeBtn = document.querySelector(".mobile-close");
  const links = document.querySelectorAll(".mobile-link");

  toggle.addEventListener("click", ()=>{
    mobileMenu.classList.add("active");
    overlay.classList.add("active");
  });

  function closeMenu(){
    mobileMenu.classList.remove("active");
    overlay.classList.remove("active");
  }

  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);
  links.forEach(link=>link.addEventListener("click", closeMenu));
}