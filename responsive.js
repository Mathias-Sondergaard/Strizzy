document.addEventListener("DOMContentLoaded", function() {
  const dropdownButton = document.querySelector('.dropdown-button');
  const dropdownContent = document.querySelector('.dropdown-content');
  if(dropdownButton && dropdownContent){
    dropdownButton.addEventListener('click', function() {
      dropdownContent.classList.toggle('open');
    });
  }

  // Mobile menu toggle (applies to header menu-toggle button)
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('header nav');
  if(menuToggle && nav){
    menuToggle.addEventListener('click', function(){
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
    // close nav when clicking outside on small screens
    document.addEventListener('click', function(e){
      if(window.innerWidth <= 900 && nav.classList.contains('open')){
        if(!nav.contains(e.target) && !menuToggle.contains(e.target)){
          nav.classList.remove('open');
          menuToggle.setAttribute('aria-expanded','false');
        }
      }
    });
  }
});
