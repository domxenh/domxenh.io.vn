/* =========================================
   SCRIPT HEADER V4 – FIX MOBILE MENU
   FILE: assets/js/script.js
========================================= */

/* LOAD HEADER */
fetch('../components/header.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
    initHeader();
    setActiveMenu();
  });

function initHeader(){

  const header = document.querySelector(".header");
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".menu-toggle");
  const overlay = document.querySelector(".menu-overlay");
  const closeBtn = document.querySelector(".menu-close");

  /* Scroll shrink */
  window.addEventListener("scroll", ()=>{
    if(window.scrollY > 50){
      header.classList.add("scrolled");
    }else{
      header.classList.remove("scrolled");
    }
  });

  /* Open menu */
  toggle.addEventListener("click", ()=>{
    nav.classList.add("active");
    overlay.classList.add("active");
  });

  /* Close menu */
  function closeMenu(){
    nav.classList.remove("active");
    overlay.classList.remove("active");
  }

  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

}

/* ================= ACTIVE MENU ================= */

function setActiveMenu(){

  const links = document.querySelectorAll(".nav-link");
  const current = window.location.pathname.split("/")[1];

  links.forEach(link=>{
    const linkPath = link.getAttribute("href").split("/")[1];
    if(current === linkPath){
      link.classList.add("active");
    }
  });

}