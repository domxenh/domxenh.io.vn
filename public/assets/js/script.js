fetch('/components/header.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
    initHeader();
  });

function initHeader(){

  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".menu-toggle");
  const overlay = document.querySelector(".menu-overlay");
  const closeBtn = document.querySelector(".menu-close");

  toggle.addEventListener("click", ()=>{
    nav.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow="hidden";
  });

  function closeMenu(){
    nav.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow="auto";
  }

  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);
}