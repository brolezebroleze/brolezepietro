const cards = document.querySelectorAll(
  ".hobby, .card-projeto, .hobby-card-item, .games-banner-card, .sidebar-box, .hero-photo-card, .singer-card, .hobbies-card, .contact-music-card"
);

document.addEventListener("mousemove", (evento) => {
  const margemProximidade = 120;

  cards.forEach((card) => {
    const pos = card.getBoundingClientRect();
    const x = evento.clientX - pos.left;
    const y = evento.clientY - pos.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    const pertoHorizontal = evento.clientX >= pos.left - margemProximidade && evento.clientX <= pos.right + margemProximidade;
    const pertoVertical = evento.clientY >= pos.top - margemProximidade && evento.clientY <= pos.bottom + margemProximidade;

    card.style.setProperty("--glow-opacity", pertoHorizontal && pertoVertical ? "1" : "0");
  });
});

const navItems = document.querySelectorAll('.nav-item');
const pill = document.querySelector('.pill');
const sections = document.querySelectorAll('.page-section');

function movePill(element) {
  const itemRect = element.getBoundingClientRect();
  const parentRect = element.parentElement.getBoundingClientRect();
  const leftPosition = itemRect.left - parentRect.left;
  pill.style.width = `${itemRect.width}px`;
  pill.style.transform = `translateX(${leftPosition}px)`;
}

const activeItem = document.querySelector('.nav-item.active');
if (activeItem) {
  movePill(activeItem);
}

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();

    navItems.forEach(nav => nav.classList.remove('active'));
    e.currentTarget.classList.add('active');
    movePill(e.currentTarget);

    const targetId = e.currentTarget.getAttribute('href');

    sections.forEach(sec => {
      sec.classList.remove('ativo');
      setTimeout(() => {
        if (!sec.classList.contains('ativo')) {
          sec.style.display = 'none';
        }
      }, 800);
    });

    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.style.display = 'flex';
      setTimeout(() => {
        targetSection.classList.add('ativo');
      }, 50);
    }
  });
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

document.querySelectorAll('.progress-track').forEach(track => {
  let isDragging = false;
  const fill = track.querySelector('.progress-bar-fill');
  const card = track.closest('.card-projeto');
  
  const currentTimeEl = card ? card.querySelector('.current-time') : null;
  const remainingTimeEl = card ? card.querySelector('.remaining-time') : null;
  const totalDuration = card ? (parseInt(card.getAttribute('data-duration')) || 240) : 0;

  function updateProgress(e) {
    const rect = track.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    let percentage = (clickX / rect.width) * 100;
    percentage = Math.max(0, Math.min(100, percentage));

    if (fill) fill.style.width = `${percentage}%`;

    if (card) {
      const currentSeconds = (percentage / 100) * totalDuration;
      const remainingSeconds = totalDuration - currentSeconds;

      if (currentTimeEl) currentTimeEl.textContent = formatTime(currentSeconds);
      if (remainingTimeEl) remainingTimeEl.textContent = `-${formatTime(remainingSeconds)}`;
    }
  }

  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateProgress(e);
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) updateProgress(e);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });
});