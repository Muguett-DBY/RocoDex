/* ============================================================================
   cstd-flight · 页面自绘逻辑（引擎不动）
   签名动作「证据并网」：
   - 城市电网 rail：随飞行进度自上而下充能的青蓝总线，节点可点击跳航段，
     已飞越的节点通电。当前节点琥珀环脉动。
   - 并网台账：飞越某区时压入真实验收数据（来自 generatedCstdProofMesh，
     数字全部真实：7 作品 / 31 证据 / 各项覆盖率与验收日期）。
   - 附加：峰值/左右遮罩按文案窗口联动；worldflight §7b 的复布局。
   ========================================================================== */
(function () {
  'use strict';

  if (!window.ScrollCraft) return;
  var sc = ScrollCraft.mount(document.body);
  window.__sc = sc; // 供校验脚本读取 playhead 记录

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var flight = document.querySelector('[data-sc-mode="worldflight"]');
  if (!flight) return;

  var segEls = [].slice.call(flight.querySelectorAll('[data-sc-segment]'));
  var weights = segEls.map(function (s) { return parseFloat(s.getAttribute('data-sc-w')) || 1.3; });
  var labels = segEls.map(function (s) { return s.getAttribute('data-sc-waypoint') || ''; });
  var c0 = [];
  var total = 0;
  weights.forEach(function (w) { c0.push(total); total += w; });

  var flightTop = 0;
  function measure() { flightTop = flight.getBoundingClientRect().top + (scrollY || pageYOffset); }

  /* ---- 台账数据：全部真实（2026-08-09 / 2026-09-06 复核） ------------------ */
  var PROJECTS = [
    { name: 'RocoDex 双站平台', cov: 100, arts: 7, date: '2026-08-09' },
    { name: 'DCF Quantum', cov: 80, arts: 4, date: '2026-08-09' },
    { name: 'CSTD Alpha 研究系统', cov: 80, arts: 5, date: '2026-08-09' },
    { name: '墨尔本行人×微气候', cov: 72, arts: 5, date: '2026-09-06' },
    { name: 'CFZZS 招商 CRM', cov: 80, arts: 3, date: '2026-08-09' },
    { name: 'CSTD Design 工作台', cov: 72, arts: 3, date: '2026-08-09' },
    { name: '奶黄包摄影体验', cov: 80, arts: 4, date: '2026-08-09' }
  ];
  var DISTRICT_LINES = [
    { t: '启程 · 城市上线', idx: '00' },
    { t: '身份并网 · 化工 → 软件系统', idx: '01' },
    { t: '方法并网 · 3 条原则', idx: '02' },
    { t: '口径并网 · 7 项目 / 31 证据', idx: '03' },
    null, // 峰值：7 行项目数据，见下
    { t: '笔记并网 · 8 篇长文', idx: '05' },
    { t: '档案并网 · 双站点同部署', idx: '06' },
    { t: '观测并网 · 能力面上线', idx: '07' },
    { t: '结清 · 7 作品 · 31 证据 · 7/7 verified', idx: '08', close: true }
  ];

  /* ---- 电网 rail ---------------------------------------------------------------- */
  var railLegs = document.getElementById('railLegs');
  var railPct = document.getElementById('railPct');
  var railHead = document.getElementById('railHead');
  var railItems = [];

  segEls.forEach(function (seg, i) {
    var li = document.createElement('li');
    li.className = 'grid-rail__leg';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('data-label', labels[i]);
    btn.setAttribute('aria-label', '飞往 ' + labels[i]);
    var span = document.createElement('span');
    span.textContent = labels[i];
    var dot = document.createElement('i');
    dot.setAttribute('aria-hidden', 'true');
    btn.appendChild(span);
    btn.appendChild(dot);
    li.appendChild(btn);
    railLegs.appendChild(li);
    railItems.push(li);
    btn.addEventListener('click', function () {
      measure();
      var vh = innerHeight;
      var y = flightTop + (c0[i] + 0.16 * weights[i]) * vh;
      scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  // 充能总线 + 游标
  var fill = document.createElement('div');
  fill.className = 'grid-rail__fill';
  railLegs.appendChild(fill);
  var tip = document.createElement('div');
  tip.className = 'grid-rail__tip';
  railLegs.appendChild(tip);

  /* ---- 台账 ---------------------------------------------------------------------- */
  var ledgerLines = document.getElementById('ledgerLines');
  var ledgerHint = document.getElementById('ledgerHint');
  var stamped = {}; // lineId -> true
  var TOTAL_LINES = 8 + PROJECTS.length;

  function stampLine(id, html, close, delay) {
    if (stamped[id]) return;
    stamped[id] = true;
    var li = document.createElement('li');
    li.className = 'ledger__line' + (close ? ' is-close' : '');
    li.innerHTML = html;
    if (!reduce && delay) li.style.animationDelay = delay + 'ms';
    ledgerLines.appendChild(li);
    // 台账只滚到最新一行
    ledgerLines.scrollTop = ledgerLines.scrollHeight;
    ledgerHint.textContent = '并网 ' + Object.keys(stamped).length + ' / ' + TOTAL_LINES;
  }

  function stampDistrict(i) {
    var d = DISTRICT_LINES[i];
    if (d) {
      stampLine('d' + i,
        '<span class="ledger__idx">' + d.idx + '</span><b>' + labels[i] + '</b><span>' + d.t.replace(labels[i], '').replace(/^ · /, '') + '</span>' + (d.close ? '<span class="ledger__ok">verified</span>' : ''),
        !!d.close);
    } else if (i === 4) {
      PROJECTS.forEach(function (p, k) {
        stampLine('p' + k,
          '<span class="ledger__idx">04</span><b>' + p.name + '</b><span>覆盖 ' + p.cov + ' · ' + p.arts + ' 份 · ' + p.date + '</span><span class="ledger__ok">verified</span>',
          false, k * 90);
      });
    }
  }

  /* ---- 遮罩联动（与文案窗口同律） ----------------------------------------------- */
  var scrimPeak = document.getElementById('scrimPeak');
  var scrimLeft = document.getElementById('scrimLeft');
  var scrimRight = document.getElementById('scrimRight');
  // [from, to, rIn, rOut]（全程轨迹分数，与 data-sc-window 一致）
  var WIN_PEAK = [[0.316, 0.390, 0.18, 0.38], [0.424, 0.578, 0.19, 0.24], [0.9376, 1.0, 0.5, 0]];
  var WIN_LEFT = [[0.0, 0.0646, 0, 0.65], [0.212, 0.300, 0.18, 0.2], [0.706, 0.774, 0.18, 0.2]];
  var WIN_RIGHT = [[0.116, 0.198, 0.18, 0.2], [0.602, 0.668, 0.18, 0.2], [0.812, 0.878, 0.18, 0.2]];

  function ramp(pr, from, to, rIn, rOut) {
    var win = Math.max(to - from, 0.001);
    var inEnd = from + win * rIn;
    var outStart = to - win * rOut;
    if (pr < from) return 0;
    if (pr < inEnd) { var x = (pr - from) / Math.max(inEnd - from, 0.001); return x * x * (3 - 2 * x); }
    if (pr <= outStart) return 1;
    var y = 1 - (pr - outStart) / Math.max(to - outStart, 0.001);
    y = y < 0 ? 0 : y > 1 ? 1 : y;
    return y * y * (3 - 2 * y);
  }
  function windowsOpacity(wins, pr) {
    var m = 0;
    for (var i = 0; i < wins.length; i++) m = Math.max(m, ramp(pr, wins[i][0], wins[i][1], wins[i][2], wins[i][3]));
    return m;
  }

  /* ---- 每帧读取 ------------------------------------------------------------------ */
  var queued = false;
  var lastSeg = -1;
  function frame() {
    queued = false;
    var vh = innerHeight;
    var y = scrollY || pageYOffset;
    var t = (y - flightTop) / Math.max(vh, 1);
    if (t < 0) t = 0;
    if (t > total) t = total;
    var pr = t / total;

    // 总线充能
    fill.style.height = (pr * 100).toFixed(2) + '%';
    tip.style.top = 'calc(0.55rem + ' + pr.toFixed(4) + ' * (100% - 1.1rem))';
    tip.style.opacity = pr > 0.001 && pr < 0.999 ? '1' : '0';
    railPct.textContent = Math.round(pr * 100) + '%';

    // 节点状态（通电阈值：进入该航段 15%）
    var current = 0;
    for (var i = 0; i < segEls.length; i++) if (t >= c0[i]) current = i;
    if (current !== lastSeg) {
      lastSeg = current;
      railItems.forEach(function (li, k) {
        li.classList.toggle('is-current', k === current);
        li.classList.toggle('is-passed', k < current || (k === current && t > c0[k] + 0.15 * weights[k]));
      });
      railHead.innerHTML = labels[current] + '<br><span>' + String(current + 1) + ' / ' + segEls.length + ' · CITY GRID</span>';
      var ledgerEl = document.getElementById('ledger');
      if (ledgerEl) ledgerEl.classList.toggle('is-peak', current === 4);
    }

    // 遮罩
    scrimPeak.style.opacity = windowsOpacity(WIN_PEAK, pr).toFixed(3);
    scrimLeft.style.opacity = windowsOpacity(WIN_LEFT, pr).toFixed(3);
    scrimRight.style.opacity = windowsOpacity(WIN_RIGHT, pr).toFixed(3);
  }
  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(frame);
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', function () { measure(); onScroll(); }, { passive: true });

  /* ---- waypoint：飞越某区即并网（含直接落地/回滚补齐） --------------------------- */
  flight.addEventListener('sc:waypoint', function (e) {
    var k = e.detail.index;
    for (var i = 0; i <= k; i++) stampDistrict(i);
  });

  /* ---- worldflight §7b：挂载后重测一遍，防止 spacer 被量成 0 ---------------------- */
  function relayout() { dispatchEvent(new Event('resize')); }
  addEventListener('load', relayout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);

  /* ---- 键盘：聚焦不可见文案块内的链接时，滚到该块的可读位置 ---------------------- */
  document.addEventListener('focusin', function (e) {
    var block = e.target && e.target.closest && e.target.closest('[data-sc-copy]');
    if (!block || !flight.contains(block)) return;
    if (parseFloat(getComputedStyle(block).opacity || '1') > 0.6) return;
    var raw = (block.getAttribute('data-sc-window') || '').trim();
    var pr;
    if (raw === 'hero') pr = 0.02;
    else if (raw === 'finale') pr = 0.985;
    else {
      var spec = raw.split(/\s+/).map(parseFloat);
      pr = isNaN(spec[0]) ? 0.02 : (spec[0] + (isNaN(spec[1]) ? spec[0] : spec[1])) / 2;
    }
    if (!isNaN(pr) && pr > 0) {
      measure();
      scrollTo({ top: Math.max(0, flightTop + pr * total * innerHeight - innerHeight * 0.35), behavior: reduce ? 'auto' : 'smooth' });
    }
  });

  measure();
  frame();
})();
