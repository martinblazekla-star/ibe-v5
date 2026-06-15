/* ============================================================
   Journey shell controller.
   Expects window.JOURNEY = {
     title, subtitle, start,
     steps: [{ label, id?, entry, pages:[...] }],
     screens: [{ label, page, group? }],
     journeys: [{ label, href }]   // all selectable journeys
   }
   Multi-page journeys are tracked by the iframe URL. Single-page
   journeys (e.g. Proposal) post {type:'journey-step', step:'<id>'}
   to the parent; the shell maps that id to a step.
   ============================================================ */
(function () {
  var J = window.JOURNEY;
  if (!J) return;

  var stepsEl = document.getElementById("js-steps");
  var frame = document.getElementById("js-frame");
  var sel = document.getElementById("js-screens");
  var journeySel = document.getElementById("js-journey");
  var restart = document.getElementById("js-restart");
  var titleEl = document.getElementById("js-title");
  var subEl = document.getElementById("js-sub");

  if (titleEl) titleEl.textContent = J.title || "";
  if (subEl) subEl.textContent = J.subtitle || "";

  // ---- Build stepper
  var stepNodes = [];
  J.steps.forEach(function (s, i) {
    if (i > 0) {
      var sep = document.createElement("div");
      sep.className = "js-sep";
      stepsEl.appendChild(sep);
    }
    var b = document.createElement("button");
    b.className = "js-step";
    b.type = "button";
    b.innerHTML = '<span class="num">' + (i + 1) + '</span><span class="lbl"></span>';
    b.querySelector(".lbl").textContent = s.label;
    b.addEventListener("click", function () { go(s.entry); });
    stepsEl.appendChild(b);
    stepNodes.push(b);
  });

  // ---- Build journey picker
  if (journeySel && J.journeys) {
    var here = currentSelfFile();
    J.journeys.forEach(function (j) {
      var o = document.createElement("option");
      o.value = j.href;
      o.textContent = j.label;
      if (decodeURIComponent(j.href) === here) o.selected = true;
      journeySel.appendChild(o);
    });
    journeySel.addEventListener("change", function () {
      if (journeySel.value && decodeURIComponent(journeySel.value) !== here) {
        window.location.href = journeySel.value;
      }
    });
  }

  // ---- Build screens dropdown
  if (sel && J.screens) {
    var lastGroup = null;
    var curOpt = null;
    J.screens.forEach(function (sc) {
      if (sc.group && sc.group !== lastGroup) {
        curOpt = document.createElement("optgroup");
        curOpt.label = sc.group;
        sel.appendChild(curOpt);
        lastGroup = sc.group;
      }
      var o = document.createElement("option");
      o.value = sc.page;
      o.textContent = sc.label;
      (curOpt || sel).appendChild(o);
    });
    sel.addEventListener("change", function () { if (sel.value) go(sel.value); });
  }

  if (restart) restart.addEventListener("click", function () { go(J.steps[0].entry); });

  // ---- Navigation
  function go(page) { if (page) frame.src = page; }

  function currentSelfFile() {
    try { return decodeURIComponent(window.location.pathname.split("/").pop()); }
    catch (e) { return ""; }
  }

  function currentFile() {
    try {
      var p = frame.contentWindow.location.pathname;
      return decodeURIComponent(p.split("/").pop());
    } catch (e) {
      try { return decodeURIComponent((frame.getAttribute("src") || "").split("?")[0].split("/").pop()); }
      catch (e2) { return null; }
    }
  }

  function setActive(active) {
    stepNodes.forEach(function (node, i) {
      node.classList.remove("active", "done");
      if (active === -1) return;
      if (i < active) node.classList.add("done");
      else if (i === active) node.classList.add("active");
    });
  }

  function highlight() {
    var f = currentFile();
    var active = -1;
    J.steps.forEach(function (s, i) {
      if (s.pages && s.pages.indexOf(f) !== -1) active = i;
    });
    setActive(active);
    if (sel) {
      var match = false;
      for (var k = 0; k < sel.options.length; k++) {
        if (sel.options[k].value === f) { sel.value = f; match = true; break; }
      }
      if (!match) sel.selectedIndex = 0;
    }
  }

  frame.addEventListener("load", highlight);

  // ---- Single-page journeys post their internal step id
  window.addEventListener("message", function (ev) {
    var d = ev.data;
    if (!d || d.type !== "journey-step") return;
    var idx = -1;
    J.steps.forEach(function (s, i) { if (s.id && s.id === d.step) idx = i; });
    if (idx !== -1) setActive(idx);
  });

  // ---- Boot
  go(J.start || J.steps[0].entry);
})();
