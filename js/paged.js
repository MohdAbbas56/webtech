const showMenu = (toggleId, navId) => {

    const toggle = document.getElementById(toggleId);
    const nav = document.getElementById(navId);

    toggle.addEventListener('click', () => {

        nav.classList.toggle('show-menu')
        toggle.classList.toggle('show-icon')

    })

}

showMenu('nav__toggle', 'nav__menu');


window.addEventListener("scroll", () => {
    const header1 = document.querySelector("header");

    header1.classList.toggle("sticky", window.scrollY > 0)

})

$(document).ready(function(){
    $('.top-to-scroll-icon').click( function (){
        $('html, body').animate({scrollTop : 0}, 200);

        return false;
    });
});

window.addEventListener("scroll", () => {
    const toTopBtn = document.querySelector('.top-to-scroll-icon');
    if (window.pageYOffset > 400) {
        toTopBtn.style.display = "flex";
    } else {
        toTopBtn.style.display = "none"
    }
});





// const scrlSmth = document.getElementById('top-to-btn');
// scrlSmth.addEventListener('click', () => {

//     window.scrollTo({ top: 0, behavior: 'smooth' });
// });


$(document).ready(function () {
    $('.filter-link').click(function () {

        const value = $(this).attr('data-fliter');

        if (value == 'newsWebsite') {
            $('.imageBox').show('100');
        } else {
            $('.imageBox').not('.' + value).hide('1000');
            $('.imageBox').filter('.' + value).show('1000');
        }
    })

$('.filter-link').click(function(){
    $(this).addClass('actives').siblings().removeClass('actives');
})

})




$(document).ready(function () {
    $('.filter-link1').click(function () {
        const value = $(this).attr('data-fliter');
        if (value == 'health') {
            $('.imageBox1').show('1000');
        } else {

            $('.imageBox1').not('.' + value).hide('1000');
            $('.imageBox1').filter('.' + value).show('1000');
        }

    })

    $('.filter-link1').click(function(){
        $(this).addClass('actives').siblings().removeClass('actives')
    })
})

$(document).ready(function () {
    $('.filter-link2').click(function () {
        const value = $(this).attr('data-fliter');
        if (value == 'onlineStore') {
            $('.imageBox2').show('1000');
        } else {
            $('.imageBox2').not('.' + value).hide('1000');
            $('.imageBox2').filter('.' + value).show('1000');
        }
    })

    $('.filter-link2').click(function () {
        $(this).addClass('actives').siblings().removeClass('actives');

    })

})


$(document).ready(function () {
    $('.filter-link3').click(function () {
        const value = $(this).attr('data-fliter');

        if (value == 'blogWebsite') {
            $('.imageBox3').show('1000');
        } else {
            $('.imageBox3').not('.' + value).hide('1000');
            $('.imageBox3').filter('.' + value).show('1000');
        }

    })

    $('.filter-link3').click(function () {
        $(this).addClass('actives').siblings().removeClass('actives');
    })

})



$(document).ready(function () {
    $('.filter-link4').click(function () {
        const value = $(this).attr('data-fliter');
        if (value == 'portfolio') {
            $('.imageBox4').show('1000');
        } else {
            $('.imageBox4').not('.' + value).hide('1000');
            $('.imageBox4').filter('.' + value).show('1000');
        }
    })

    $('.filter-link4').click(function () {
        $(this).addClass('actives').siblings().removeClass('actives');
    })
})


$(document).ready(function () {
    $('.filter-link5').click(function () {
        const value = $(this).attr('data-fliter');
        if (value == 'community') {
            $('.imageBox5').show('1000');
        } else {
            $('.imageBox5').not('.' + value).hide('1000');
            $('.imageBox5').filter('.' + value).show('1000');
        }
    })

    $('.filter-link5').click(function(){
        $(this).addClass('actives').siblings().removeClass('actives');
    })
})

