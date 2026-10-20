
    $(document).ready(function () {
      $('[data-bs-toggle="tooltip"]').tooltip();
    })

    var swiper = (typeof Swiper !== 'undefined' && document.querySelector('.mySwiper')) ? new Swiper(".mySwiper", {
        // slidesPerView: 3,
        spaceBetween: 15,
        loop: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          dynamicBullets: true,
        },
        autoplay:{
            delay: 2000,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          breakpoints: {
            640: {
              slidesPerView: 1,
             
            },
            768: {
              slidesPerView: 1,
              
            },
            1200: {
              slidesPerView: 1,
              
            },
        },
      }) : null;

    // let slideIndex = 0;
    // let slider = document.querySelector(".slider");
    // let slides = document.querySelector(".slides");
    // let slide = document.querySelectorAll(".slide");
    // let dots = document.querySelectorAll(".dots span")
    
    // showslide();
    
    // function plusslide(position) {
    //     slideIndex += position;
    
    //     if (slideIndex > slide.length) {
    //         slideIndex = 1;
    //     }
    //     else if (slideIndex < 1) {
    //         slideIndex = slide.length;
    //     }
    
       
    //     for (let i = 0; i < dots.length; i++) {
    //         const element = dots[i];
    //         element.classList.remove("dot-active");
    //     }
    
    //     slides.style.left = `-${slideIndex - 1}00%`;
    //     dots[slideIndex - 1].classList.add("dot-active");
    // }
    
    // function currentslide(index) {
    //     if (index > slide.length) {
    //         index = 1;
    //     }
    //     else if (index < 1) {
    //         index = slide.length;
    //     }
    
      
    //     for (let i = 0; i < dots.length; i++) {
    //         const element = dots[i];
    //         element.classList.remove("dot-active");
    //     }
    
    //     slides.style.left = `-${index - 1}00%`;
    //     dots[index - 1].classList.add("dot-active");
    
    //     slideIndex = index;
    // }
    
    // function showslide() {
    //     slideIndex++;
    
    //     if (slideIndex > slide.length) {
    //         slideIndex = 1;
    //     }
    //     else if (slideIndex < 1) {
    //         slideIndex = slide.length;
    //     }
    
      
    //     for (let i = 0; i < dots.length; i++) {
    //         const element = dots[i];
    //         element.classList.remove("dot-active");
    //     }
    
    //     slides.style.left = `-${slideIndex - 1}00%`;
    //     dots[slideIndex - 1].classList.add("dot-active");
    // }
    
    
    // let interval = setInterval(()=> {
    //     showslide();
    // } , 3000);   
    
    // slider.addEventListener("mouseover" , ()=> {
    //     clearInterval(interval);     
    // });
    
    // slider.addEventListener("mouseout" , ()=> {
    //     interval = setInterval(()=> {
    //         showslide();   
    //     } , 3000);    
    // });