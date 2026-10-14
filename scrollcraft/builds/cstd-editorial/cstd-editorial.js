/* cstd-editorial 页面脚本：挂载引擎 + 页边批注入场 + folio 页码导航。
   引擎（scrollcraft.js）不做任何修改。 */
(function () {
  "use strict";
  document.documentElement.classList.add("ed-ready");

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (window.ScrollCraft) window.ScrollCraft.mount(document.body);

  // 页边批注 + 扉页题签（data-ed-enter，页面自管入场）：随所属段落进入视口而落位，一次性。
  var notes = document.querySelectorAll("[data-mnote], [data-ed-enter]");
  if (reduced || !("IntersectionObserver" in window)) {
    notes.forEach(function (n) { n.classList.add("is-set"); });
  } else {
    var noteIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-set");
          noteIO.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -18% 0px", threshold: 0.3 });
    notes.forEach(function (n) { noteIO.observe(n); });
  }

  // folio：当前章高亮 + 各章进度细线 + 版权页墨色翻转。
  var folio = document.querySelector("[data-folio-nav]");
  if (folio) {
    var items = Array.prototype.map.call(folio.querySelectorAll(".folio__item"), function (a) {
      var chapter = document.querySelector(a.getAttribute("href"));
      return { a: a, chapter: chapter, bar: a.querySelector("u") };
    }).filter(function (x) { return x.chapter; });

    var darkIO = null;
    var colophon = document.querySelector("[data-colophon]");
    if (colophon && "IntersectionObserver" in window) {
      darkIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) folio.classList.add("is-dark");
          else folio.classList.remove("is-dark");
        });
      }, { threshold: 0.4 });
      darkIO.observe(colophon);
    }

    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      var center = vh * 0.5;
      var active = null;
      items.forEach(function (item) {
        var rect = item.chapter.getBoundingClientRect();
        var p = (vh - rect.top) / (rect.height + vh);
        if (p < 0) p = 0;
        if (p > 1) p = 1;
        item.bar.style.setProperty("--fill", p.toFixed(4));
        if (rect.top <= center && rect.bottom >= center) active = item;
      });
      items.forEach(function (item) { item.a.classList.toggle("is-active", item === active); });
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }
})();
