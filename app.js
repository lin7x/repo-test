/**
 * TOULOUSEANDO - Interactive Logic
 * Modern JavaScript with HTML5 <dialog> API, Tab Switching, Interactive Checklist, Polls & Search
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const modalForo = document.getElementById('modalForo');
  const modalSede = document.getElementById('modalSede');
  const modalOrganiza = document.getElementById('modalOrganiza');
  const modalHistorias = document.getElementById('modalHistorias');
  const modalLiderazgo = document.getElementById('modalLiderazgo');
  const modalSearch = document.getElementById('modalSearch');
  const modalProfile = document.getElementById('modalProfile');
  const toastMessage = document.getElementById('toastMessage');

  const modalsMap = {
    foro: modalForo,
    sede: modalSede,
    organiza: modalOrganiza,
    historias: modalHistorias,
    liderazgo: modalLiderazgo,
    search: modalSearch,
    profile: modalProfile
  };

  // Helper: Open Modal with Modern API & Focus
  function openModal(modal) {
    if (!modal) return;
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
  }

  // Modern Web Guidance: Light Dismiss Fallback for older browsers
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const outside = (e, dialog) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    for (const dialog of document.querySelectorAll('dialog[closedby="any"]')) {
      let pressedOutside = false;
      dialog.addEventListener('pointerdown', (e) => { pressedOutside = outside(e, dialog); });
      dialog.addEventListener('pointerup', (e) => { 
        if (pressedOutside && outside(e, dialog)) dialog.close(); 
      });
    }
  }

  // Show Toast
  let toastTimer = null;
  function showToast(text) {
    if (!toastMessage) return;
    toastMessage.textContent = text;
    toastMessage.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMessage.classList.remove('show');
    }, 2800);
  }

  // 1. Navigation Links & Buttons
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      if (modalsMap[target]) {
        openModal(modalsMap[target]);
      }
    });
  });

  // Top Nav Actions (Search & Profile)
  const openSearchBtn = document.getElementById('openSearchBtn');
  if (openSearchBtn) {
    openSearchBtn.addEventListener('click', () => openModal(modalSearch));
  }

  const openProfileBtn = document.getElementById('openProfileBtn');
  if (openProfileBtn) {
    openProfileBtn.addEventListener('click', () => openModal(modalProfile));
  }

  // 2. Category Cards Click
  document.querySelectorAll('.sketch-card').forEach(card => {
    const cardId = card.dataset.card;
    card.addEventListener('click', () => {
      if (modalsMap[cardId]) {
        openModal(modalsMap[cardId]);
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (modalsMap[cardId]) {
          openModal(modalsMap[cardId]);
        }
      }
    });
  });

  // 3. Hero CTA Buttons
  const exploreBtn = document.getElementById('exploreBtn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      document.getElementById('secciones')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const tourQuickBtn = document.getElementById('tourQuickBtn');
  if (tourQuickBtn) {
    tourQuickBtn.addEventListener('click', () => {
      openModal(modalSede);
    });
  }

  // 4. Browser Mockup Interactions
  const bookmarkBtn = document.getElementById('bookmarkBtn');
  if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', () => {
      bookmarkBtn.classList.toggle('bookmarked');
      if (bookmarkBtn.classList.contains('bookmarked')) {
        showToast('¡Añadido a favoritos de Toulouseando! ⭐');
      } else {
        showToast('Eliminado de favoritos');
      }
    });
  }

  const toggleFrameModeBtn = document.getElementById('toggleFrameModeBtn');
  const browserFrame = document.querySelector('.browser-frame');
  if (toggleFrameModeBtn && browserFrame) {
    toggleFrameModeBtn.addEventListener('click', () => {
      browserFrame.classList.toggle('fullscreen-mode');
      const isFull = browserFrame.classList.contains('fullscreen-mode');
      toggleFrameModeBtn.querySelector('.mode-label').textContent = isFull ? 'Ventana' : 'Pizarra';
      showToast(isFull ? 'Modo Pantalla Completa activado' : 'Modo Pizarra Boceto activado');
    });
  }

  // 5. Interactive Poll in Foro
  const pollBtns = document.querySelectorAll('.poll-btn');
  pollBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pollBtns.forEach(b => b.classList.remove('voted'));
      btn.classList.add('voted');
      let currentVotes = parseInt(btn.dataset.votes || '10', 10);
      currentVotes += 1;
      btn.dataset.votes = currentVotes;
      const countSpan = btn.querySelector('.poll-count');
      if (countSpan) {
        countSpan.textContent = `${currentVotes} votos`;
      }
      showToast('¡Tu voto fue registrado en el Foro Estudiantil! ✏️');
    });
  });

  // Like comment buttons
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('liked');
      const span = btn.querySelector('span');
      if (span) {
        let count = parseInt(span.textContent || '0', 10);
        count = btn.classList.contains('liked') ? count + 1 : count - 1;
        span.textContent = count;
      }
    });
  });

  // Forum New Comment Submission
  const forumForm = document.getElementById('forumForm');
  const newCommentInput = document.getElementById('newCommentInput');
  const commentsSection = document.querySelector('.comments-section');

  if (forumForm && newCommentInput && commentsSection) {
    forumForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = newCommentInput.value.trim();
      if (!text) return;

      const newCard = document.createElement('div');
      newCard.className = 'comment-card';
      newCard.innerHTML = `
        <div class="comment-author">
          <span class="avatar-tag">Tú (Cachimbo 2026-I)</span>
          <span class="comment-time">Justo ahora</span>
        </div>
        <p class="comment-text">"${text}"</p>
        <button class="like-btn liked" aria-label="Dar me gusta">❤️ <span>1</span></button>
      `;

      // Insert at top of list
      const title = commentsSection.querySelector('.comments-title');
      if (title && title.nextSibling) {
        commentsSection.insertBefore(newCard, title.nextSibling);
      } else {
        commentsSection.appendChild(newCard);
      }

      newCommentInput.value = '';
      showToast('¡Tu mensaje ha sido publicado en el foro! 💬');
    });
  }

  // 6. Campus Tabs Switcher
  const campusData = {
    jp: {
      name: 'Sede Javier Prado (Principal)',
      address: '📍 Av. Javier Prado Oeste 980, Magdalena del Mar / San Isidro',
      tip: 'Los ascensores son concurridos 10 minutos antes de clase; si vas al 2do o 3er piso, las escaleras amarillas son rapidísimas y tienen murales geniales.',
      spots: [
        { icon: '☕', title: 'Cafetería y Terraza Creativa', desc: 'Piso 2 • Menús estudiantiles, microondas y café de especialidad.' },
        { icon: '💻', title: 'Laboratorios Mac & Render Farm', desc: 'Piso 4 • Software Adobe, Maya y Figma listos con tu carnet.' },
        { icon: '📚', title: 'CRAI / Biblioteca & Salas de Estudio', desc: 'Piso 1 • Libros de diseño, mesas con tomas de luz y préstamo de wacoms.' },
        { icon: '🛠️', title: 'Talleres Maker & Materiales', desc: 'Sótano 1 • Cortadoras láser, cabina de pintura y herramientas de maquetería.' }
      ]
    },
    ch: {
      name: 'Sede Chorrillos (Creatividad & Espacio)',
      address: '📍 Av. Prolongación Defensores del Morro 1675, Chorrillos',
      tip: 'La luz natural de los talleres de Chorrillos es perfecta para sesiones de fotografía, prototipado a escala y proyectos de interiores.',
      spots: [
        { icon: '📐', title: 'Talleres de Construcción e Interiores', desc: 'Piso 1 • Espacios abiertos para armar estructuras y maquetas gigantes.' },
        { icon: '📸', title: 'Estudios de Foto & Set de Grabación', desc: 'Piso 3 • Cicloramas sinfín, iluminación continua y flashes profesionales.' },
        { icon: '🌿', title: 'Jardín de Descanso y Coworking', desc: 'Área libre para almorzar al aire libre y trabajar en grupo.' },
        { icon: '🎨', title: 'Cabinas de Serigrafía y Grabado', desc: 'Piso 2 • Estampado textil, tintas al agua y prensas de impresión.' }
      ]
    },
    sm: {
      name: 'Sede San Miguel (Digital & Tech)',
      address: '📍 Av. La Marina 2355, San Miguel',
      tip: 'Frente al Centro Comercial Plaza San Miguel, con acceso directo a librerías técnicas y transporte rápido por la Marina.',
      spots: [
        { icon: '🎮', title: 'Game Lab & Realidad Virtual', desc: 'Piso 3 • Visores VR, consolas de testeo y estaciones de motion capture.' },
        { icon: '🎬', title: 'Cabinas de Edición de Audio y Foley', desc: 'Piso 4 • Tratamiento acústico para doblaje, podcasts y diseño sonoro.' },
        { icon: '💻', title: 'Aulas Híbridas y Streaming', desc: 'Piso 2 • Pantallas interactivas y cámaras inteligentes.' },
        { icon: '🥪', title: 'Zona Lounge Cachimbo', desc: 'Piso 1 • Sofás, lockers y dispensadores de agua fresca.' }
      ]
    }
  };

  const campusTabs = document.querySelectorAll('.campus-tab-btn');
  const campusNameEl = document.getElementById('campusName');
  const campusAddressEl = document.getElementById('campusAddress');
  const campusTipEl = document.getElementById('campusTip');
  const campusSpotsGrid = document.querySelector('.campus-spots-grid');

  campusTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      campusTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const campusKey = tab.dataset.campus;
      const data = campusData[campusKey];

      if (data) {
        if (campusNameEl) campusNameEl.textContent = data.name;
        if (campusAddressEl) campusAddressEl.textContent = data.address;
        if (campusTipEl) campusTipEl.textContent = data.tip;

        if (campusSpotsGrid) {
          campusSpotsGrid.innerHTML = data.spots.map(s => `
            <div class="spot-item">
              <span class="spot-icon">${s.icon}</span>
              <div>
                <strong>${s.title}</strong>
                <p>${s.desc}</p>
              </div>
            </div>
          `).join('');
        }
      }
    });
  });

  // 7. Interactive Checklist in Organízate
  const checklistItems = document.querySelectorAll('#checklistItems input[type="checkbox"]');
  const checklistProgress = document.getElementById('checklistProgress');
  const checklistPercent = document.getElementById('checklistPercent');

  function updateChecklist() {
    if (!checklistItems.length) return;
    const total = checklistItems.length;
    let checked = 0;
    checklistItems.forEach(item => {
      if (item.checked) checked++;
    });

    const percent = Math.round((checked / total) * 100);
    if (checklistProgress) checklistProgress.style.width = `${percent}%`;
    if (checklistPercent) checklistPercent.textContent = `${percent}%`;

    if (percent === 100) {
      showToast('🎉 ¡Felicidades! Completaste todo tu checklist de Cachimbo.');
    }
  }

  checklistItems.forEach(item => {
    item.addEventListener('change', updateChecklist);
  });

  // Download planner schedule mock
  const btnDownloadPlanner = document.getElementById('btnDownloadPlanner');
  if (btnDownloadPlanner) {
    btnDownloadPlanner.addEventListener('click', () => {
      showToast('📅 Generando horario descargable en PDF...');
      setTimeout(() => {
        const link = document.createElement('a');
        link.download = 'Horario_Cachimbo_Toulouseando.txt';
        link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(
          "TOULOUSEANDO - HORARIO SUGERIDO CACHIMBO 2026\n" +
          "=================================================\n" +
          "LUNES:     08:00 - 11:00  Fundamentos del Diseño (Aula 302)\n" +
          "MARTES:    10:00 - 13:00  Creatividad y Comunicación (Taller 2)\n" +
          "MIÉRCOLES: 09:00 - 12:00  Herramientas Digitales (Lab Mac 4)\n" +
          "JUEVES:    11:00 - 14:00  Dibujo y Bocetería (Sótano Taller)\n" +
          "VIERNES:   Avance de bitácora y estudio grupal\n\n" +
          "¡Muchos éxitos en tu primer ciclo!"
        );
        link.click();
        showToast('✅ ¡Horario descargado con éxito!');
      }, 700);
    });
  }

  // 8. Stories Carousel
  const storyCards = document.querySelectorAll('.story-card');
  const dotBtns = document.querySelectorAll('.dot-btn');
  const btnNextStory = document.getElementById('btnNextStory');
  let currentStoryIndex = 0;

  function showStory(index) {
    storyCards.forEach((card, idx) => {
      card.classList.toggle('active', idx === index);
    });
    dotBtns.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });
    currentStoryIndex = index;
  }

  if (btnNextStory) {
    btnNextStory.addEventListener('click', () => {
      const nextIndex = (currentStoryIndex + 1) % storyCards.length;
      showStory(nextIndex);
    });
  }

  dotBtns.forEach(dot => {
    dot.addEventListener('click', () => {
      const slide = parseInt(dot.dataset.slide || '1', 10) - 1;
      showStory(slide);
    });
  });

  // 9. Quick Search Engine
  const siteSearchInput = document.getElementById('siteSearchInput');
  const searchResults = document.getElementById('searchResults');
  const tagChips = document.querySelectorAll('.tag-chip');

  const searchKnowledge = [
    { key: 'wifi', title: '📶 Red Wi-Fi Institucional TLS-Alumnos', desc: 'Conéctate a la red "TLS_Estudiantes" usando tu usuario y clave del campus virtual.' },
    { key: 'mac', title: '🖥️ Préstamo y Reserva de Salas Mac', desc: 'Puedes reservar hasta 2 horas diarias de computadoras Mac en el CRAI Piso 1 presentando tu carnet.' },
    { key: 'carnet', title: '💳 Carnet Universitario y Medio Pasaje', desc: 'El trámite del carnet SUNEDU se gestiona en Secretaría Académica durante el primer mes de clases.' },
    { key: 'horarios', title: '⏰ Consulta de Horarios y Aulas', desc: 'Descarga la app oficial de Toulouse o ingresa a tu Intranet para ver el aula de cada día.' },
    { key: 'materiales', title: '📐 Tiendas de útiles y maquetas', desc: 'Encuentra cartulinas, bisturís, reglas T y plumones en la librería de la Av. Salaverry y frente al campus.' },
    { key: 'cafeteria', title: '☕ Cafetería y Microondas', desc: 'Ubicados en el segundo piso. Cuenta con opciones vegetarianas, menú del día y módulos para calentar tu almuerzo.' }
  ];

  function runSearch(query) {
    if (!searchResults) return;
    const q = query.toLowerCase().trim();
    if (!q) {
      searchResults.innerHTML = '<p class="search-placeholder-msg">Haz clic en una sugerencia o escribe tu consulta arriba.</p>';
      return;
    }

    const matches = searchKnowledge.filter(item => 
      item.key.includes(q) || item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
    );

    if (matches.length === 0) {
      searchResults.innerHTML = `<p class="search-placeholder-msg">No encontramos resultados para "${query}". Intenta buscar "wifi", "mac", o "cafetería".</p>`;
    } else {
      searchResults.innerHTML = matches.map(m => `
        <div class="search-result-item">
          <h4>${m.title}</h4>
          <p>${m.desc}</p>
        </div>
      `).join('');
    }
  }

  if (siteSearchInput) {
    siteSearchInput.addEventListener('input', (e) => {
      runSearch(e.target.value);
    });
  }

  tagChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const searchWord = chip.dataset.search;
      if (siteSearchInput) {
        siteSearchInput.value = searchWord;
        runSearch(searchWord);
      }
    });
  });

  // Welcome console message
  console.log('%c🎨 Toulouseando - Tu primer ciclo, acompañado ✨', 'color: #3B82F6; font-size: 16px; font-weight: bold;');
});
