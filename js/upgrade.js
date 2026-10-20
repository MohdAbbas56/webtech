/* upgrade.js - header behaviour (all pages) + hero slider (home) */
(function () {
  "use strict";

  /* ---- header: scrolled colour + mobile menu helpers ---- */
  var header = document.querySelector("header");
  function onScroll() {
    if (header) header.classList.toggle("sticky", window.scrollY > 0);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var toggle = document.getElementById("nav__toggle");
  var menu = document.getElementById("nav__menu");
  function closeMenu() {
    if (menu) menu.classList.remove("show-menu");
    if (toggle) { toggle.classList.remove("show-icon"); toggle.setAttribute("aria-expanded", "false"); }
  }
  if (toggle && menu) {
    toggle.setAttribute("role", "button");
    toggle.setAttribute("tabindex", "0");
    toggle.setAttribute("aria-label", "Open menu");
    toggle.setAttribute("aria-controls", "nav__menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.addEventListener("click", function () {
      var open = menu.classList.contains("show-menu");
      toggle.setAttribute("aria-expanded", String(open));
    });
    toggle.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle.click(); }
    });
    document.addEventListener("click", function (e) {
      if (!menu.classList.contains("show-menu")) return;
      if (!e.target.closest("#nav__menu") && !e.target.closest("#nav__toggle")) closeMenu();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
    window.addEventListener("resize", function () { if (window.innerWidth > 1040) closeMenu(); });
  }

  /* ---- enquiry number: reveal on hover (desktop) / tap (touch) ---- */
  var enq = document.querySelector(".enq");
  if (enq) {
    enq.addEventListener("click", function (e) {
      if (e.target.closest(".enq__num")) return;
      var open = enq.classList.toggle("open");
      enq.setAttribute("aria-expanded", String(open));
    });
    enq.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); enq.click(); } });
    document.addEventListener("click", function (e) { if (!e.target.closest(".enq")) enq.classList.remove("open"); });
  }

  /* ---- highlight the current page in the menu ---- */
  (function () {
    var flat = { "about.html": "about-us", "ourallprojects.html": "our-work", "contact.html": "contact-us", "services.html": "services",
                 "websitetempl.html": "our-work", "creativeadstemp.html": "our-work", "canvadesign.html": "our-work",
                 "website-templates": "our-work", "creative-ads": "our-work", "canva-design": "our-work" };
    function keyOf(path) {
      var p = path.toLowerCase().split("#")[0], m = p.match(/(about-us|services|our-work|contact-us|website-templates|creative-ads|canva-design)\/?(index\.html)?$/);
      if (m) return flat[m[1]] || m[1];
      var f = p.split("/").pop();
      return flat[f] || "home";
    }
    var cur = keyOf(location.pathname);
    document.querySelectorAll(".nav__link").forEach(function (li) {
      var a = li.querySelector("a"); if (!a) return;
      li.classList.toggle("is-active", keyOf(a.pathname) === cur);
    });
  })();

  /* ---- About slider (original owl carousel) - also starts on pages that had no init ---- */
  if (window.jQuery && jQuery.fn.owlCarousel) {
    jQuery(".about-section .owl-carousel").each(function () {
      var $c = jQuery(this);
      if ($c.data("owl.carousel")) return;
      $c.owlCarousel({ loop: true, margin: 10, nav: true, navText: false, dots: false, autoplay: true, autoplayTimeout: 5000,
        autoplayHoverPause: true, responsive: { 0: { items: 1 }, 600: { items: 1 }, 1000: { items: 1 } } });
    });
  }


  /* ---- scroll reveal animation (only below-the-fold blocks, never hides content without JS) ---- */
  (function () {
    if (!("IntersectionObserver" in window) || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
    var sel = ".temp-head, .view-box, .main-box, .web-designer-box, .service-card, .counter-box, .faq-item, .footer-box, .contact-form, .footer-hire__in, .privecy-policy";
    var els = [].slice.call(document.querySelectorAll(sel)).filter(function (e) {
      return e.getBoundingClientRect().top > window.innerHeight * 0.92 && !e.closest(".owl-carousel, .swiper, .mega-panel");
    });
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        x.target.classList.add("in"); io.unobserve(x.target);
        setTimeout(function () { x.target.classList.remove("reveal", "in"); }, 900);     // hand control back to normal hover styles
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (e, i) { e.classList.add("reveal"); e.style.transitionDelay = ((i % 4) * 70) + "ms"; io.observe(e); });
  })();

  /* ---- enquiry form: validates, then opens the visitor's email app with the message filled in ---- */
  var form = document.getElementById("enquiry-form");
  if (form) {
    var status = form.querySelector(".form-status");
    function say(msg, cls) { if (status) { status.textContent = msg; status.className = "form-status " + cls; } }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = function (id) { var el = form.querySelector("#" + id); return el ? el.value.trim() : ""; };
      var name = v("cf-name"), email = v("cf-email"), extra = v("cf-subject"), msg = v("cf-message");
      if (!name || !email || !msg) { say("Please fill in your name, email and message.", "err"); return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { say("Please enter a valid email address.", "err"); return; }
      var subject = "Website enquiry from " + name;
      var body = "Name: " + name + "\nEmail: " + email + (extra ? "\nSubject / Number: " + extra : "") + "\n\n" + msg;
      window.location.href = "mailto:mohdabbas84068@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      say("Thank you! Your email app is opening - just press send. I will reply very soon.", "ok");
    });
    form.addEventListener("reset", function () { say("", ""); });
  }

  /* ---- hero slider (index.html) ---- */
  var heroEl = document.querySelector(".heroSwiper");
  if (heroEl && typeof Swiper !== "undefined") {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    new Swiper(heroEl, {
      loop: true,
      speed: 800,
      effect: "fade",
      fadeEffect: { crossFade: true },
      autoHeight: false,
      autoplay: reduce ? false : { delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: ".hero-pag", clickable: true },
      navigation: { nextEl: ".hero-next", prevEl: ".hero-prev" },
      keyboard: { enabled: true },
      a11y: { enabled: true }
    });
  }
})();
