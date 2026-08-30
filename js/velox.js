/* VELOX — Pioneer Oman
   Behaviour only: sticky header state, drawer menu, scroll reveal, enquiry handoff. */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------- masthead shadow */
  var masthead = document.getElementById('masthead');
  if (masthead) {
    var setStuck = function () {
      masthead.classList.toggle('is-stuck', window.scrollY > 8);
    };
    setStuck();
    window.addEventListener('scroll', setStuck, { passive: true });
  }

  /* ------------------------------------------------------ drawer menu */
  var drawer = document.getElementById('drawer');
  if (drawer) {
    var openBtn = document.querySelector('[data-menu-open]');
    var closeBtn = drawer.querySelector('[data-menu-close]');

    var closeDrawer = function () {
      if (drawer.open) drawer.close();
    };

    if (openBtn) {
      openBtn.addEventListener('click', function () {
        if (typeof drawer.showModal === 'function') drawer.showModal();
      });
    }
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    drawer.addEventListener('click', function (e) {
      if (e.target === drawer) closeDrawer();
    });
    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });

    /* A drawer left open while resizing to desktop would trap focus. */
    window.matchMedia('(min-width: 901px)').addEventListener('change', function (e) {
      if (e.matches) closeDrawer();
    });
  }

  /* ------------------------------------------------------ scroll reveal */
  var targets = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    targets.forEach(function (el, i) {
      /* Stagger paired image/detail so a row settles in one motion, not two. */
      el.style.transitionDelay = (i % 2 === 1 ? 90 : 0) + 'ms';
      observer.observe(el);
    });
  }

  /* --------------------------------------------------- enquiry handoff */
  var form = document.getElementById('veloxEnquiry');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var val = function (id) {
        var el = document.getElementById(id);
        return el && el.value.trim() ? el.value.trim() : '—';
      };

      var subject = 'VELOX enquiry — ' + val('vApp');

      var body = [
        'New VELOX enquiry from golfcarts.pioneeroman.com',
        '',
        'Name:          ' + val('vName'),
        'Company:       ' + val('vCompany'),
        'Email:         ' + val('vEmail'),
        'Phone:         ' + val('vPhone'),
        'Application:   ' + val('vApp'),
        'Configuration: ' + val('vConfig'),
        'Units:         ' + val('vQty'),
        '',
        'Message:',
        val('vMessage')
      ].join('\n');

      window.location.href =
        'mailto:mail@pioneeroman.com' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    });
  }

  /* --------------------------------------------------------------- icons */
  window.addEventListener('load', function () {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  });
})();
