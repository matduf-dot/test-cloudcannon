/* Maquette TDM — JavaScript natif, sans dépendance */
(function () {
  "use strict";

  /* ---- Sous-menus : clic et clavier, Échap pour fermer (corrige RGAA 7.3) ---- */
  var boutons = document.querySelectorAll(".nav-bouton");
  function fermerTout(sauf) {
    boutons.forEach(function (b) {
      if (b === sauf) return;
      b.setAttribute("aria-expanded", "false");
      document.getElementById(b.getAttribute("aria-controls")).classList.remove("ouvert");
    });
  }
  boutons.forEach(function (b) {
    var menu = document.getElementById(b.getAttribute("aria-controls"));
    b.addEventListener("click", function () {
      var ouvert = b.getAttribute("aria-expanded") === "true";
      fermerTout(b);
      b.setAttribute("aria-expanded", String(!ouvert));
      menu.classList.toggle("ouvert", !ouvert);
    });
    menu.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { fermerTout(); b.focus(); }
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var ouvert = document.querySelector('.nav-bouton[aria-expanded="true"]');
      if (ouvert) { fermerTout(); ouvert.focus(); }
    }
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".nav-item")) fermerTout();
  });

  /* ---- Menu mobile ---- */
  var burger = document.querySelector(".menu-mobile");
  var nav = document.getElementById("nav-principale");
  if (burger) burger.addEventListener("click", function () {
    var ouvert = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!ouvert));
    nav.classList.toggle("ouverte", !ouvert);
  });

  /* ---- Recherche (maquette) ---- */
  var loupe = document.querySelector("[data-focus-recherche]");
  var champ = document.getElementById("recherche-site");
  if (loupe) loupe.addEventListener("click", function () { champ.focus(); });
  var formRecherche = document.querySelector("[data-recherche]");
  formRecherche.addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = formRecherche.querySelector(".recherche-message");
    msg.textContent = champ.value.trim()
      ? "Maquette : la recherche sera active sur le site final."
      : "Saisissez un mot-clé, par exemple « déchèterie ».";
  });

  /* ---- Agenda : filtres commune + type ---- */
  var filtres = document.querySelectorAll(".filtre");
  var selectCommune = document.querySelector("[data-filtre-commune]");
  var evenements = document.querySelectorAll(".evenement");
  var resultat = document.querySelector("[data-resultat]");
  var typeActif = "";
  function filtrer() {
    var commune = selectCommune.value, n = 0;
    evenements.forEach(function (ev) {
      var ok = (!typeActif || ev.dataset.type === typeActif) && (!commune || ev.dataset.commune === commune);
      ev.hidden = !ok;
      if (ok) n++;
    });
    resultat.textContent = n === 0 ? "Aucun événement pour ce choix. Essayez une autre commune ou « Tout »."
      : n + (n > 1 ? " événements" : " événement");
  }
  filtres.forEach(function (f) {
    f.addEventListener("click", function () {
      filtres.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
      f.setAttribute("aria-pressed", "true");
      typeActif = f.dataset.type;
      filtrer();
    });
  });
  selectCommune.addEventListener("change", filtrer);

  /* ---- Carte des communes ---- */
  var bloc = document.querySelector("[data-carte]");
  var bulle = bloc.querySelector(".infobulle");
  var communes = bloc.querySelectorAll(".commune");
  function montrer(a) {
    var r = a.getBoundingClientRect(), b = bloc.getBoundingClientRect();
    bulle.innerHTML = "";
    bulle.appendChild(document.createTextNode(a.dataset.nom));
    var s = document.createElement("span"); s.textContent = "Voir la commune"; bulle.appendChild(s);
    bulle.style.left = (r.left - b.left + r.width / 2) + "px";
    bulle.style.top = (r.top - b.top + r.height / 2) + "px";
    bulle.hidden = false;
  }
  function cacher() { bulle.hidden = true; }
  communes.forEach(function (a) {
    a.addEventListener("mouseenter", function () { montrer(a); });
    a.addEventListener("focus", function () { montrer(a); });
    a.addEventListener("mouseleave", cacher);
    a.addEventListener("blur", cacher);
    a.addEventListener("click", function (e) { e.preventDefault(); });
  });
  var trouver = document.querySelector("[data-trouver]");
  trouver.addEventListener("submit", function (e) {
    e.preventDefault();
    var saisie = document.getElementById("trouver-commune").value.trim().toLowerCase();
    var msg = document.querySelector("[data-trouver-message]");
    var cible = null;
    communes.forEach(function (a) {
      a.classList.remove("actif");
      if (saisie && a.dataset.nom.toLowerCase() === saisie) cible = a;
    });
    if (cible) { cible.classList.add("actif"); montrer(cible); msg.textContent = cible.dataset.nom + " est affichée sur la carte."; }
    else { cacher(); msg.textContent = "Commune introuvable. Choisissez un nom dans la liste proposée."; }
  });

  /* ---- Vidéo : rien n'est chargé depuis YouTube avant le clic (sobriété, RGPD) ---- */
  var video = document.querySelector("[data-video]");
  video.addEventListener("click", function () {
    var id = video.dataset.youtube;
    var msg = document.querySelector("[data-video-message]");
    if (!id) { msg.textContent = "Maquette : la vidéo de l'interco sera intégrée ici, avec ses sous-titres."; return; }
    var iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&cc_load_policy=1&cc_lang_pref=fr&hl=fr";
    iframe.title = "Vidéo : Découvrir Thiers Dore et Montagne";
    iframe.allow = "autoplay; encrypted-media; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.style.cssText = "width:100%;aspect-ratio:16/9;border:0;display:block";
    video.replaceWith(iframe);
    iframe.focus();
  });

  /* ---- Lettre d'information : validation accessible ---- */
  var lettre = document.querySelector("[data-lettre]");
  lettre.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("lettre-email");
    var accord = document.getElementById("lettre-accord");
    var errE = document.getElementById("lettre-email-erreur");
    var errA = document.getElementById("lettre-accord-erreur");
    var msg = document.querySelector("[data-lettre-message]");
    var valide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    errE.textContent = valide ? "" : "Saisissez une adresse e-mail valide, par exemple nom@exemple.fr.";
    email.setAttribute("aria-invalid", String(!valide));
    errA.textContent = accord.checked ? "" : "Cochez la case pour confirmer votre inscription.";
    accord.setAttribute("aria-invalid", String(!accord.checked));
    msg.textContent = "";
    if (!valide) { email.focus(); return; }
    if (!accord.checked) { accord.focus(); return; }
    msg.textContent = "Maquette : inscription simulée, aucune donnée n'est envoyée.";
  });
})();
