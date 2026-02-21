fetch('../components/header.html')
.then(res => res.text())
.then(data=>{
  document.getElementById('header-placeholder').innerHTML = data;
  initHeader();
  setActiveMenu();
});

/* Header logic */
function initHeader(){
  const header = document.querySelector(".header");
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".menu-toggle");
  const overlay = document.querySelector(".menu-overlay");

  window.addEventListener("scroll",()=>{
    if(window.scrollY>50){
      header.classList.add("scrolled");
    }else{
      header.classList.remove("scrolled");
    }
  });

  toggle.addEventListener("click",()=>{
    nav.classList.toggle("active");
    toggle.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  overlay.addEventListener("click",()=>{
    nav.classList.remove("active");
    toggle.classList.remove("active");
    overlay.classList.remove("active");
  });
}

/* Fade in on scroll */
document.addEventListener("DOMContentLoaded", function(){

  const fadeEls = document.querySelectorAll(".fade");

  if(fadeEls.length){
    const observer = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("show");
        }
      });
    });

    fadeEls.forEach(el=>{
      observer.observe(el);
    });
  }

});
/* Active menu */
function setActiveMenu(){
  const links = document.querySelectorAll(".nav-link");
  const path = window.location.pathname;
  links.forEach(link=>{
    if(path.includes(link.getAttribute("href"))){
      link.classList.add("active");
    }
  });
}