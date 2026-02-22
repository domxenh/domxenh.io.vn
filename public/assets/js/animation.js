document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".product-card");

  elements.forEach((el, index) => {
    el.style.opacity = 0;
    el.style.transform = "translateY(40px)";
    
    setTimeout(() => {
      el.style.transition = "all 0.8s ease";
      el.style.opacity = 1;
      el.style.transform = "translateY(0)";
    }, index * 300);
  });
});