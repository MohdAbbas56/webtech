/* =====================================================================
   site.js  –  loaded on EVERY page (no dependencies, plain JavaScript)
   1. Mega dropdown toggles (mobile / keyboard)
   2. Site search (overlay, live results, keyboard navigation)
   3. FAQ manager (home page: add / open / remove, saved in the browser)
   ===================================================================== */
(function () {
  "use strict";

  var RESUME_URL = "assets/images/CrntCv4WebDesignwer.pdf";
  var ROOT = document.body.getAttribute("data-root") || "";
  var FAQ_KEY = "abbas_faq_v2";

  /* ------------------------------------------------------------------
     small helpers
     ------------------------------------------------------------------ */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  function currentPage() {
    var seg = location.pathname.split("/").filter(Boolean);
    var last = seg.pop() || "index.html";
    if (last.indexOf(".") < 0) { seg.push(last); last = "index.html"; }
    if (last.toLowerCase() === "index.html" && seg.length) {
      var f = seg[seg.length - 1].toLowerCase();
      if (/^(about-us|services|our-work|contact-us|website-templates|creative-ads|canva-design)$/.test(f)) return f + "/index.html";
    }
    return last.toLowerCase();
  }
  function store(method, key, val) {
    try {
      if (method === "get") return window.localStorage.getItem(key);
      if (method === "set") window.localStorage.setItem(key, val);
      if (method === "del") window.localStorage.removeItem(key);
    } catch (e) { /* storage blocked – the site still works, FAQ just won't persist */ }
    return null;
  }

  /* ------------------------------------------------------------------
     1. MEGA MENU
     ------------------------------------------------------------------ */
  function initMega() {
    var items = $$(".nav__link.has-mega");
    if (!items.length) return;

    function closeAll(except) {
      items.forEach(function (li) {
        if (li !== except) {
          li.classList.remove("open");
          var b = $(".mega-caret", li);
          if (b) b.setAttribute("aria-expanded", "false");
        }
      });
    }

    items.forEach(function (li) {
      var btn = $(".mega-caret", li);
      if (!btn) return;
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var open = !li.classList.contains("open");
        closeAll(li);
        li.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", String(open));
      });
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".has-mega")) closeAll();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAll();
    });

    // after clicking a same-page anchor (e.g. index.html#faq) close the mobile menu
    $$(".nav__menu a").forEach(function (a) {
      a.addEventListener("click", function () {
        var menu = $("#nav__menu"), tgl = $("#nav__toggle");
        if (menu) menu.classList.remove("show-menu");
        if (tgl) tgl.classList.remove("show-icon");
        closeAll();
      });
    });
  }

  /* ------------------------------------------------------------------
     2. SEARCH
     ------------------------------------------------------------------ */
  // type -> icon (Remix Icon, already loaded on every page)
  var ICONS = {
    Page: "ri-file-list-3-line",
    Service: "ri-code-box-line",
    Project: "ri-layout-masonry-line",
    Section: "ri-hashtag",
    FAQ: "ri-question-answer-line",
    Contact: "ri-customer-service-2-line",
    Download: "ri-download-2-line"
  };

  var INDEX = [
    /* ---- pages ---- */
    { t: "Home", type: "Page", u: "index.html", d: "Welcome – web developer & designer building websites, apps and creative ads.", k: "home main start welcome md abbas portfolio developer" },
    { t: "Services", type: "Page", u: "services/index.html", d: "Every kind of website and app I can build – static, WordPress, e-commerce, React, PHP/MySQL, Android & iOS.", k: "services what i do build development website types hire" },
    { t: "About Us", type: "Page", u: "about-us/index.html", d: "Who I am, my education, skills and experience as a web developer and designer.", k: "about me md abbas profile biography experience education" },
    { t: "Contact Us", type: "Page", u: "contact-us/index.html", d: "Send an enquiry, call, WhatsApp or email to start your project.", k: "contact enquiry hire call phone whatsapp email message form get in touch" },
    { t: "All Projects", type: "Page", u: "our-work/index.html", d: "Every website and design project I have built for clients.", k: "projects work portfolio clients websites our work gallery" },
    { t: "Website Templates", type: "Page", u: "website-templates/index.html", d: "Website design templates – news, clothing, health, architect, online store, blog and more.", k: "website templates design themes html wordpress layouts" },
    { t: "Creative Ads", type: "Page", u: "creative-ads/index.html", d: "Creative ad designs for architecture, interior, civil construction and office projects.", k: "creative ads advertising banner poster social media architecture interior civil construction" },
    { t: "Canva Design", type: "Page", u: "canva-design/index.html", d: "Canva graphic designs – posts, banners, logos and branding material.", k: "canva design graphic logo banner poster branding social post" },

    /* ---- services (anchors on services.html) ---- */
    { t: "Static & Business Websites", type: "Service", u: "services/index.html#static-websites", d: "Fast, clean multi-page websites for businesses, shops and professionals.", k: "html html5 css css3 bootstrap business website company static" },
    { t: "Landing Pages", type: "Service", u: "services/index.html#landing-pages", d: "High-converting single page sites for campaigns, launches and lead generation.", k: "landing page campaign lead conversion one page marketing" },
    { t: "Portfolio Websites", type: "Service", u: "services/index.html#portfolio-sites", d: "Personal brand and portfolio sites for developers, designers, photographers and creators.", k: "portfolio personal resume cv freelancer showcase" },
    { t: "Architect & Interior Websites", type: "Service", u: "services/index.html#architect-sites", d: "Elegant project-gallery websites for architects, interior designers and builders.", k: "architect interior construction builder gallery decons real estate" },
    { t: "Blog & News Websites", type: "Service", u: "services/index.html#blog-news", d: "Content-driven blog and news portals with categories, search and clean reading layouts.", k: "blog news magazine articles cms posts" },
    { t: "WordPress Development", type: "Service", u: "services/index.html#wordpress", d: "Custom WordPress themes, Elementor builds, plugin setup and fixes.", k: "wordpress wp theme elementor plugin cms woocommerce" },
    { t: "E-Commerce & Online Store", type: "Service", u: "services/index.html#ecommerce", d: "Online shops with product catalogues, cart, checkout and payment integration.", k: "ecommerce e-commerce shop store shopify woocommerce cart payment online shopping" },
    { t: "React & Frontend Apps", type: "Service", u: "services/index.html#react-frontend", d: "Modern interactive interfaces with React, JavaScript, jQuery and responsive layouts.", k: "react javascript js jquery frontend front-end spa ui ux swiper" },
    { t: "PHP & MySQL Websites", type: "Service", u: "services/index.html#php-mysql", d: "Dynamic data-driven sites: login, admin panels, contact forms and databases.", k: "php mysql database backend back-end login admin panel dynamic forms crud server" },
    { t: "Web Apps & Dashboards", type: "Service", u: "services/index.html#web-apps", d: "Custom web applications, booking systems, CRMs and admin dashboards.", k: "web app application dashboard crm booking system custom software saas" },
    { t: "API & Backend Integration", type: "Service", u: "services/index.html#api-backend", d: "REST API, payment gateway, email, WhatsApp and third-party integrations.", k: "api rest integration payment gateway backend json server java" },
    { t: "Android & iOS Apps", type: "Service", u: "services/index.html#mobile-apps", d: "Mobile application development for Android and iOS.", k: "android ios app application mobile phone java" },
    { t: "Maintenance & Speed", type: "Service", u: "services/index.html#maintenance", d: "Maintenance, updates, backups, security and speed / performance optimisation.", k: "maintenance support speed performance backup security update hosting domain" },
    { t: "Dream Website & Application", type: "Service", u: "services/index.html#dream-project", d: "Tell me your idea and I will build your dream website or application.", k: "dream website application idea custom build app" },
    { t: "Custom Software Development", type: "Service", u: "services/index.html#custom-software", d: "Tailor-made software in Python, Java or PHP with MySQL.", k: "custom software development python java php mysql crm billing inventory automation" },
    { t: "Python Development", type: "Service", u: "services/index.html#python", d: "Python applications, automation, APIs and back-ends.", k: "python django flask automation script api backend" },
    { t: "Bug & Error Fixing", type: "Service", u: "services/index.html#bug-fixing", d: "Fix bugs and errors on all types of websites and applications.", k: "bug error fix fixing debug 404 500 broken website application problem issue" },
    { t: "Server Issue Fixing", type: "Service", u: "services/index.html#server-fixing", d: "Fix downtime, 500/502/503 errors, SSL, DNS and permission problems.", k: "server issue down error ssl dns 500 502 503 permission fix" },
    { t: "Server Management & Deployment", type: "Service", u: "services/index.html#server-management", d: "Linux, Apache, Nginx, cPanel, VPS, cloud, IIS and Tomcat setup and management.", k: "server management deployment linux ubuntu centos apache nginx cpanel whm vps cloud iis tomcat hosting" },
    { t: "Database & Application Issues", type: "Service", u: "services/index.html#database-issues", d: "MySQL design, query problems, migration, backup and application crashes.", k: "database mysql query migration backup application crash issue" },
    { t: "Technical Troubleshooting", type: "Service", u: "services/index.html#troubleshooting", d: "Find the root cause of technical problems and fix them.", k: "troubleshooting technical support logs root cause fix" },

    /* ---- home page sections ---- */
    { t: "About Me (section)", type: "Section", u: "index.html#about-me", d: "Md Abbas - Software Developer Engineer: Python, Java, PHP, JavaScript, MySQL, WordPress, servers and troubleshooting. Open to jobs and freelance work.", k: "about me profile skills python java php mysql server software developer engineer resume job hire" },
    { t: "Theme & Template Designs", type: "Section", u: "index.html#templates", d: "Sample website templates by category – news, clothes, health, architect, online store, blog, event, portfolio, membership.", k: "templates themes news clothes health architect store blog event portfolio membership community startup" },
    { t: "Creative Ads Gallery", type: "Section", u: "index.html#creative-ads", d: "Gallery of architecture, interior and construction creative ads.", k: "ads gallery creative architecture interior lightbox" },
    { t: "Projects Completed (counters)", type: "Section", u: "index.html#counter", d: "15+ website designs, 10+ creative ads, 11+ e-commerce websites, 12+ Canva designs.", k: "counter statistics numbers completed projects experience count" },
    { t: "All Types of Design", type: "Section", u: "index.html#all-types", d: "Website design, e-commerce website, creative ads and Canva design.", k: "types design website ecommerce creative ads canva" },
    { t: "Frequently Asked Questions", type: "Section", u: "index.html#faq", d: "Answers to common questions – and add or remove your own FAQs.", k: "faq questions answers help support how long price cost" },
    { t: "Contact Form", type: "Section", u: "index.html#contact", d: "Fill in the enquiry form for a free consultancy.", k: "contact form enquiry free consultancy message submit" },

    /* ---- projects ---- */
    { t: "Ayurved Product Website", type: "Project", u: "our-work/index.html", d: "Health & ayurvedic product website design.", k: "ayurved ayurveda health product medical herbal" },
    { t: "Decons – Architect & Interiors", type: "Project", u: "our-work/index.html", d: "Architecture and interior-design company website (WordPress).", k: "decons architect interiors wordpress architecture" },
    { t: "Logix Shaper", type: "Project", u: "our-work/index.html", d: "Business website project design.", k: "logix shaper business" },
    { t: "SK Solutions", type: "Project", u: "our-work/index.html", d: "Corporate solutions website design.", k: "sk solutions sksolution corporate" },
    { t: "V3M Technology", type: "Project", u: "our-work/index.html", d: "Technology company website design.", k: "v3m technology tech company it" },
    { t: "Bootstrap Demo Websites", type: "Project", u: "website-templates/index.html", d: "Responsive Bootstrap demo site layouts.", k: "bootstrap demo responsive layout" },

    /* ---- contact / downloads ---- */
    { t: "Download Resume (PDF)", type: "Download", u: RESUME_URL, d: "Download Md Abbas's current CV as a PDF.", k: "resume cv download pdf hire job curriculum vitae", dl: true },
    { t: "Call / WhatsApp", type: "Contact", u: "contact-us/index.html", d: "WhatsApp 7256958967 · Call (+91) 8406-86-5156", k: "phone call whatsapp number 7256958967 8406865156 mobile" },
    { t: "Email", type: "Contact", u: "contact-us/index.html", d: "mohdabbas84068@gmail.com", k: "email mail gmail mohdabbas84068 write" }
  ];

  var POPULAR = ["Services", "Resume", "WordPress", "E-commerce", "React", "Contact", "FAQ"];

  function loadFaqForSearch() {
    var raw = store("get", FAQ_KEY), list = null;
    try { list = raw ? JSON.parse(raw) : null; } catch (e) { list = null; }
    if (!Array.isArray(list)) list = FAQ_DEFAULTS;
    return list.map(function (f) {
      return { t: f.q, type: "FAQ", u: "index.html#faq-" + f.id, d: f.a, k: "faq question answer" };
    });
  }

  function tokens(q) {
    return q.toLowerCase().split(/\s+/).filter(Boolean);
  }
  function score(entry, toks) {
    var title = entry.t.toLowerCase(), desc = (entry.d || "").toLowerCase(), kw = (entry.k || "").toLowerCase();
    var total = 0;
    for (var i = 0; i < toks.length; i++) {
      var t = toks[i], s = 0;
      var wordStart = new RegExp("(^|[^a-z0-9])" + escapeRe(t));
      if (title.indexOf(t) === 0) s += 14;
      else if (wordStart.test(title)) s += 10;
      else if (title.indexOf(t) > -1) s += 6;
      if (wordStart.test(kw)) s += 5; else if (kw.indexOf(t) > -1) s += 3;
      if (wordStart.test(desc)) s += 3; else if (desc.indexOf(t) > -1) s += 1;
      if (!s) return 0;          // every word must match something
      total += s;
    }
    return total;
  }

  function highlight(node, text, toks) {
    if (!toks.length) { node.textContent = text; return; }
    var re = new RegExp("(" + toks.map(escapeRe).join("|") + ")", "ig");
    // split() with one capture group puts the matches at the odd indexes
    text.split(re).forEach(function (p, i) {
      if (!p) return;
      if (i % 2 === 1) {
        var m = document.createElement("mark"); m.textContent = p; node.appendChild(m);
      } else { node.appendChild(document.createTextNode(p)); }
    });
  }

  function initSearch() {
    var openers = $$("[data-search-open]");
    if (!openers.length) return;

    var root = el("div", "site-search");
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", "Search this website");

    var box = el("div", "site-search__box");
    var bar = el("div", "site-search__bar");
    var icon = el("i", "ri-search-line");
    var input = el("input");
    input.type = "text";
    input.placeholder = "Search services, projects, resume, FAQ…";
    input.setAttribute("autocomplete", "off");
    input.setAttribute("aria-label", "Search");
    var closeBtn = el("button", "site-search__close", "Esc");
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Close search");
    bar.appendChild(icon); bar.appendChild(input); bar.appendChild(closeBtn);

    var body = el("div", "site-search__body");
    var hint = el("div", "site-search__hint");
    hint.innerHTML = "<span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span>";

    box.appendChild(bar); box.appendChild(body); box.appendChild(hint);
    root.appendChild(box);
    document.body.appendChild(root);

    var links = [], active = -1, lastFocus = null;

    function setActive(i) {
      if (!links.length) { active = -1; return; }
      active = (i + links.length) % links.length;
      links.forEach(function (a, n) { a.classList.toggle("active", n === active); });
      links[active].scrollIntoView({ block: "nearest" });
    }

    function makeItem(entry, toks) {
      var a = el("a", "site-search__item");
      a.href = ROOT + entry.u;
      if (entry.dl) a.setAttribute("download", "");
      var ico = el("span", "ico"); ico.appendChild(el("i", ICONS[entry.type] || ICONS.Page));
      var txt = el("span", "txt");
      var ttl = el("span", "ttl");
      var tname = el("span"); highlight(tname, entry.t, toks);
      ttl.appendChild(tname); ttl.appendChild(el("span", "tag", entry.type));
      var dsc = el("span", "dsc");
      var d = entry.d || "";
      if (d.length > 130) d = d.slice(0, 127) + "…";
      txt.appendChild(ttl); txt.appendChild(dsc);
      highlight(dsc, d, toks);
      a.appendChild(ico); a.appendChild(txt);
      a.addEventListener("click", function (e) { go(entry, e); });
      a.addEventListener("mousemove", function () { setActive(links.indexOf(a)); });
      return a;
    }

    function chips(parent) {
      var wrap = el("div", "site-search__chips");
      POPULAR.forEach(function (w) {
        var b = el("button", null, w); b.type = "button";
        b.addEventListener("click", function () { input.value = w; render(); input.focus(); });
        wrap.appendChild(b);
      });
      parent.appendChild(wrap);
    }

    function render() {
      var q = input.value.trim();
      body.textContent = "";
      links = []; active = -1;
      var all = INDEX.concat(loadFaqForSearch());

      if (!q) {
        body.appendChild(el("div", "site-search__label", "Quick links"));
        ["Services", "Download Resume (PDF)", "All Projects", "Frequently Asked Questions", "Contact Us"].forEach(function (name) {
          var e = all.filter(function (x) { return x.t === name; })[0];
          if (e) { var a = makeItem(e, []); links.push(a); body.appendChild(a); }
        });
        body.appendChild(el("div", "site-search__label", "Popular searches"));
        chips(body);
        setActive(0);
        return;
      }

      var toks = tokens(q);
      var res = all.map(function (e) { return { e: e, s: score(e, toks) }; })
        .filter(function (r) { return r.s > 0; })
        .sort(function (a, b) { return b.s - a.s; })
        .slice(0, 14);

      if (!res.length) {
        var empty = el("div", "site-search__empty");
        var s1 = el("strong", null, "No results for “" + q + "”");
        empty.appendChild(s1);
        empty.appendChild(document.createTextNode("Try a shorter word, or pick one of these:"));
        body.appendChild(empty);
        chips(body);
        return;
      }
      body.appendChild(el("div", "site-search__label", res.length + (res.length === 1 ? " result" : " results")));
      res.forEach(function (r) {
        var a = makeItem(r.e, toks); links.push(a); body.appendChild(a);
      });
      setActive(0);
    }

    function go(entry, ev) {
      var url = entry.u;
      var hashAt = url.indexOf("#");
      var page = hashAt > -1 ? url.slice(0, hashAt) : url;
      if (hashAt > -1 && page.toLowerCase() === currentPage()) {
        if (ev) ev.preventDefault();
        close();
        location.hash = url.slice(hashAt);
        jumpToHash();
      } else {
        close();
      }
    }

    function open() {
      lastFocus = document.activeElement;
      root.classList.add("open");
      document.body.style.overflow = "hidden";
      input.value = "";
      render();
      setTimeout(function () { input.focus(); }, 30);
    }
    function close() {
      root.classList.remove("open");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    openers.forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); open(); }); });
    closeBtn.addEventListener("click", close);
    root.addEventListener("mousedown", function (e) { if (e.target === root) close(); });
    input.addEventListener("input", render);
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
      else if (e.key === "Enter") {
        e.preventDefault();
        if (active > -1 && links[active]) links[active].click();
      }
    });
    document.addEventListener("keydown", function (e) {
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || "");
      if (e.key === "Escape" && root.classList.contains("open")) { close(); }
      else if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        root.classList.contains("open") ? close() : open();
      }
    });
  }

  /* After jumping to an in-page anchor, flash the section so the user sees it */
  function jumpToHash() {
    var id = decodeURIComponent((location.hash || "").slice(1));
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    if (id.indexOf("faq-") === 0) {
      var faqSec = document.getElementById("faq");
      if (faqSec) faqSec.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(function () {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        if (window.SiteFAQ) window.SiteFAQ.open(id.slice(4));
      }, 350);
      return;
    }
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    target.classList.remove("search-flash");
    void target.offsetWidth;
    target.classList.add("search-flash");
  }

  /* ------------------------------------------------------------------
     3. FAQ MANAGER
     ------------------------------------------------------------------ */
  var FAQ_DEFAULTS = [
    { id: "d1", q: "What services do you offer?", a: "I build websites, web and mobile applications and custom software, and I also fix bugs, errors, server issues and database problems. Services include business and e-commerce websites, WordPress, Python / Java / PHP development, server setup and management, maintenance and speed optimisation." },
    { id: "d2", q: "Can you build my dream website or application?", a: "Yes. Share your idea and I will plan, design, develop, test and launch it \u2014 from a simple website to a full custom web or mobile application." },
    { id: "d3", q: "Can you fix bugs and errors on my existing website or app?", a: "Yes. I fix bugs and errors on all types of websites and applications, including broken layouts and forms, PHP / Python / Java errors, 404 and 500 errors, login and payment problems and mobile issues." },
    { id: "d4", q: "Can you fix server problems or manage my server?", a: "Yes. I fix server issues such as downtime, 500 / 502 / 503 errors, SSL, DNS and permission problems, and I handle setup, deployment and management on Linux, Apache, Nginx, cPanel / VPS and cloud servers." },
    { id: "d5", q: "Which technologies do you work with?", a: "Python, Java, PHP, JavaScript, jQuery, React, HTML5, CSS3, Bootstrap, WordPress and MySQL, along with REST APIs, Git and server tools." },
    { id: "d6", q: "How long does a project take?", a: "A simple website can be ready in a few days; a multi-page website usually takes 1\u20132 weeks, and custom software or applications take longer depending on the features. You get a clear timeline before we start." },
    { id: "d7", q: "Will my website work on mobile phones?", a: "Yes. Every website is built responsive, so it works smoothly on mobiles, tablets and desktops." },
    { id: "d8", q: "Do you provide support after the project is live?", a: "Yes. I offer maintenance, updates, backups, speed optimisation and quick technical support after launch." },
    { id: "d9", q: "How do I start a project or get a quote?", a: "Use the Contact page, call or WhatsApp me with your idea. I will reply quickly with a plan, timeline and price." },
  ];

  function initFaq() {
    var list = $("#faqList");
    if (!list) return;

    var form = $("#faqForm"), qIn = $("#faqQuestion"), aIn = $("#faqAnswer");
    var msg = $("#faqMsg"), emptyBox = $("#faqEmpty"), countEl = $("#faqCount");
    var resetBtn = $("#faqReset");
    var items = [];

    function load() {
      var raw = store("get", FAQ_KEY), data = null;
      try { data = raw ? JSON.parse(raw) : null; } catch (e) { data = null; }
      if (!Array.isArray(data)) data = FAQ_DEFAULTS.map(function (f) { return Object.assign({}, f); });
      items = data.filter(function (f) { return f && f.id && f.q && f.a; });
    }
    function save() { store("set", FAQ_KEY, JSON.stringify(items)); }

    function say(text, ok) {
      msg.textContent = text;
      msg.className = "faq-msg " + (ok ? "ok" : "err");
      if (text) { clearTimeout(say.t); say.t = setTimeout(function () { msg.textContent = ""; }, 3500); }
    }
    function updateMeta() {
      emptyBox.hidden = items.length > 0;
      if (countEl) countEl.textContent = items.length + (items.length === 1 ? " question" : " questions");
    }

    function toggle(node, force) {
      var open = typeof force === "boolean" ? force : !node.classList.contains("open");
      node.classList.toggle("open", open);
      $(".faq-q", node).setAttribute("aria-expanded", String(open));
    }

    function makeNode(f) {
      var node = el("div", "faq-item");
      node.id = "faq-" + f.id;
      node.setAttribute("data-id", f.id);

      var head = el("div", "faq-head");
      var q = el("button", "faq-q");
      q.type = "button";
      q.setAttribute("aria-expanded", "false");
      q.setAttribute("aria-controls", "faq-a-" + f.id);
      q.appendChild(el("span", null, f.q));
      var chev = el("span", "chev"); chev.appendChild(el("i", "ri-arrow-down-s-line"));
      q.appendChild(chev);
      q.addEventListener("click", function () { toggle(node); });

      var rm = el("button", "faq-remove");
      rm.type = "button";
      rm.title = "Remove this FAQ";
      rm.setAttribute("aria-label", "Remove FAQ: " + f.q);
      rm.appendChild(el("i", "ri-delete-bin-6-line"));
      rm.addEventListener("click", function () { remove(f.id, node); });

      head.appendChild(q); head.appendChild(rm);

      var wrap = el("div", "faq-a-wrap");
      wrap.id = "faq-a-" + f.id;
      wrap.setAttribute("role", "region");
      var inner = el("div", "faq-a");
      inner.appendChild(el("p", null, f.a));
      wrap.appendChild(inner);

      node.appendChild(head); node.appendChild(wrap);
      return node;
    }

    function renderAll() {
      list.textContent = "";
      items.forEach(function (f) { list.appendChild(makeNode(f)); });
      updateMeta();
    }

    function remove(id, node) {
      node.classList.add("removing");
      setTimeout(function () {
        items = items.filter(function (f) { return f.id !== id; });
        save();
        if (node.parentNode) node.parentNode.removeChild(node);
        updateMeta();
        say("FAQ removed.", true);
      }, 260);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = qIn.value.trim().replace(/\s+/g, " "), a = aIn.value.trim();
      if (q.length < 5) { say("Please type a question (at least 5 characters).", false); qIn.focus(); return; }
      if (a.length < 5) { say("Please type an answer (at least 5 characters).", false); aIn.focus(); return; }
      if (q.length > 200) { say("Question is too long (max 200 characters).", false); return; }
      if (a.length > 1500) { say("Answer is too long (max 1500 characters).", false); return; }
      if (!/[?？]$/.test(q)) q += "?";
      var dup = items.some(function (f) { return f.q.toLowerCase() === q.toLowerCase(); });
      if (dup) { say("This question already exists.", false); return; }

      var f = { id: "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), q: q, a: a };
      items.push(f);
      save();
      var node = makeNode(f);
      list.appendChild(node);
      updateMeta();
      toggle(node, true);
      node.scrollIntoView({ behavior: "smooth", block: "nearest" });
      form.reset();
      say("FAQ added below.", true);
    });

    resetBtn.addEventListener("click", function () {
      if (!window.confirm("Reset the FAQ list back to the default questions? Your added FAQs will be removed.")) return;
      store("del", FAQ_KEY);
      load();
      renderAll();
      say("FAQ list reset to defaults.", true);
    });

    // allow Ctrl+Enter inside the answer box
    aIn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event("submit", { cancelable: true }));
    });

    load();
    renderAll();

    window.SiteFAQ = {
      open: function (id) {
        var n = document.getElementById("faq-" + id);
        if (n) toggle(n, true);
      }
    };
  }

  /* ------------------------------------------------------------------
     boot
     ------------------------------------------------------------------ */
  function boot() {
    initMega();
    initSearch();
    initFaq();
    if (location.hash) setTimeout(jumpToHash, 400);
    window.addEventListener("hashchange", jumpToHash);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
