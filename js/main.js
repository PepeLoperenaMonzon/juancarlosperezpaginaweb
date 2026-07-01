(function () {
  'use strict';

  // Único lugar donde cambiar el número (formato internacional sin + ni espacios)
  const WHATSAPP_NUMBER = '34686207785';

  const whatsappLink = document.getElementById('whatsapp-link');
  const whatsappFloat = document.getElementById('whatsapp-float');
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

  if (whatsappLink) whatsappLink.href = waUrl;
  if (whatsappFloat) whatsappFloat.href = waUrl;

  // Header scroll effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Mobile nav toggle
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.nav__menu');

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.querySelectorAll('a[href="#inicio"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const inicio = document.getElementById('inicio');
      if (!inicio) return;

      e.preventDefault();
      inicio.scrollIntoView({ behavior: 'smooth' });
      history.pushState(null, '', '#inicio');
    });
  });

  // Form validation & submission
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  const feedbackError = document.getElementById('form-feedback-error');
  const whatsappFallback = document.getElementById('form-whatsapp-fallback');

  function hideFormFeedback() {
    if (successMsg) successMsg.hidden = true;
    if (feedbackError) feedbackError.hidden = true;
  }

  hideFormFeedback();

  const fields = {
    nombre: {
      el: document.getElementById('nombre'),
      error: document.getElementById('error-nombre'),
      validate: (v) => v.trim().length >= 2 || 'Introduce tu nombre (mínimo 2 caracteres).'
    },
    apellidos: {
      el: document.getElementById('apellidos'),
      error: document.getElementById('error-apellidos'),
      validate: (v) => v.trim().length >= 2 || 'Introduce tus apellidos (mínimo 2 caracteres).'
    },
    email: {
      el: document.getElementById('email'),
      error: document.getElementById('error-email'),
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Introduce un e-mail válido.'
    },
    telefono: {
      el: document.getElementById('telefono'),
      error: document.getElementById('error-telefono'),
      validate: (v) => /^[\d\s+()-]{9,}$/.test(v.trim()) || 'Introduce un teléfono válido.'
    },
    motivo: {
      el: document.getElementById('motivo'),
      error: document.getElementById('error-motivo'),
      validate: (v) => v.trim().length >= 10 || 'Describe el motivo de consulta (mínimo 10 caracteres).'
    }
  };

  function validateField(name) {
    const field = fields[name];
    const result = field.validate(field.el.value);
    const isValid = result === true;

    field.el.classList.toggle('error', !isValid);
    field.error.textContent = isValid ? '' : result;
    return isValid;
  }

  Object.keys(fields).forEach(name => {
    fields[name].el.addEventListener('blur', () => validateField(name));
    fields[name].el.addEventListener('input', () => {
      if (fields[name].el.classList.contains('error')) {
        validateField(name);
      }
    });
  });

  if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    hideFormFeedback();

    const allValid = Object.keys(fields).every(name => validateField(name));
    if (!allValid) return;

    const data = {
      nombre: fields.nombre.el.value.trim(),
      apellidos: fields.apellidos.el.value.trim(),
      email: fields.email.el.value.trim(),
      telefono: fields.telefono.el.value.trim(),
      motivo: fields.motivo.el.value.trim()
    };

    const message = [
      'Hola, me gustaría solicitar una cita.',
      '',
      `*Nombre:* ${data.nombre} ${data.apellidos}`,
      `*E-mail:* ${data.email}`,
      `*Teléfono:* ${data.telefono}`,
      `*Motivo de consulta:* ${data.motivo}`
    ].join('\n');

    const waSubmitUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    const waWindow = window.open(waSubmitUrl, '_blank');

    if (!waWindow) {
      if (whatsappFallback) whatsappFallback.href = waSubmitUrl;
      if (feedbackError) feedbackError.hidden = false;
      return;
    }

    form.reset();
    Object.values(fields).forEach(f => {
      f.el.classList.remove('error');
      f.error.textContent = '';
    });

    if (successMsg) {
      successMsg.hidden = false;
      setTimeout(hideFormFeedback, 12000);
    }
  });
  }

  // Hero carousel
  const heroCarousel = document.querySelector('.hero__carousel');
  const heroSlides = document.querySelectorAll('.hero__slide');
  const heroDots = document.querySelectorAll('.hero__dot');
  let heroIndex = 0;
  let heroTimer;
  const CAROUSEL_INTERVAL = 4000;

  function goToSlide(index) {
    if (!heroSlides.length) return;

    heroSlides[heroIndex].classList.remove('hero__slide--active');
    if (heroDots[heroIndex]) {
      heroDots[heroIndex].classList.remove('hero__dot--active');
      heroDots[heroIndex].setAttribute('aria-selected', 'false');
    }

    heroIndex = index;

    heroSlides[heroIndex].classList.add('hero__slide--active');
    if (heroDots[heroIndex]) {
      heroDots[heroIndex].classList.add('hero__dot--active');
      heroDots[heroIndex].setAttribute('aria-selected', 'true');
    }
  }

  function nextSlide() {
    goToSlide((heroIndex + 1) % heroSlides.length);
  }

  function startCarousel() {
    clearInterval(heroTimer);
    heroTimer = setInterval(nextSlide, CAROUSEL_INTERVAL);
  }

  function stopCarousel() {
    clearInterval(heroTimer);
  }

  if (heroSlides.length > 1) {
    heroDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goToSlide(i);
        startCarousel();
      });
    });

    if (heroCarousel) {
      heroCarousel.addEventListener('mouseenter', stopCarousel);
      heroCarousel.addEventListener('mouseleave', startCarousel);
      heroCarousel.addEventListener('focusin', stopCarousel);
      heroCarousel.addEventListener('focusout', startCarousel);
    }

    startCarousel();
  }
})();
