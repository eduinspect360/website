// film.js — accessible <dialog> player for the EDUINSPECT360 promo film.
// Opens on click only (no autoplay-on-load). Closing (button / Esc / backdrop)
// pauses the video and returns focus to the trigger. No external libraries.
(function () {
  var dialog = document.getElementById('film-modal');
  var trigger = document.getElementById('hero-watch-film-btn');
  var closeBtn = document.getElementById('film-modal-close');
  if (!dialog || !trigger || !closeBtn) return;
  var video = dialog.querySelector('video');

  function openModal() {
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    if (video) {
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () { /* user gesture required / autoplay blocked — controls remain available */ });
      }
    }
  }

  function closeModal() {
    if (dialog.open) dialog.close();
  }

  trigger.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);

  // Backdrop click: a click that lands directly on the <dialog> element itself
  // (not on any child) means it hit the backdrop area.
  dialog.addEventListener('click', function (e) {
    if (e.target === dialog) closeModal();
  });

  // Esc fires the native 'cancel' event, which closes the dialog and then
  // fires 'close' — handled once here regardless of how the dialog closed.
  dialog.addEventListener('close', function () {
    if (video) video.pause();
    trigger.focus();
  });
})();
