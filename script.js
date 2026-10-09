document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  if (header){
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive:true });
  }

  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');
  if (toggle && nav){
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  initLightbox();
});

/* ===== Sitewide photo lightbox =====
   Any <img class="can-zoom"> opens an enlarged view.
   Images sharing the same data-group can be paged through with arrows. */
function initLightbox(){
  const triggers = Array.from(document.querySelectorAll('img.can-zoom'));
  if (!triggers.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `
    <button class="lightbox-close" aria-label="Close">&times;</button>
    <button class="lightbox-prev" aria-label="Previous image">&#8249;</button>
    <img src="" alt="">
    <button class="lightbox-next" aria-label="Next image">&#8250;</button>
    <div class="lightbox-cap"></div>
  `;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector('img');
  const capEl = overlay.querySelector('.lightbox-cap');
  const prevBtn = overlay.querySelector('.lightbox-prev');
  const nextBtn = overlay.querySelector('.lightbox-next');
  const closeBtn = overlay.querySelector('.lightbox-close');

  let currentGroup = [];
  let currentIndex = 0;

  function groupFor(trigger){
    const group = trigger.dataset.group || '__single__' + triggers.indexOf(trigger);
    return triggers.filter(t => (t.dataset.group || '__single__' + triggers.indexOf(t)) === group);
  }

  function show(index){
    currentIndex = (index + currentGroup.length) % currentGroup.length;
    const t = currentGroup[currentIndex];
    imgEl.src = t.currentSrc || t.src;
    imgEl.alt = t.alt || '';
    capEl.textContent = t.dataset.caption || t.alt || '';
    const multi = currentGroup.length > 1;
    prevBtn.style.display = multi ? 'flex' : 'none';
    nextBtn.style.display = multi ? 'flex' : 'none';
  }

  function open(trigger){
    currentGroup = groupFor(trigger);
    show(currentGroup.indexOf(trigger));
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  triggers.forEach(t => t.addEventListener('click', () => open(t)));
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(currentIndex - 1));
  nextBtn.addEventListener('click', () => show(currentIndex + 1));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(currentIndex - 1);
    if (e.key === 'ArrowRight') show(currentIndex + 1);
  });
}