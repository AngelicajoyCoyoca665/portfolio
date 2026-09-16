/* =========================================================
   PORTFOLIO SCRIPT
   Handles: mobile nav, scroll effects, reveal animations,
   dynamic project loading, and the contact form.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  setYear();
  setupNav();
  setupScrollProgress();
  setupRevealAnimations();
  setupActiveNavLink();
  loadProjects();
  setupContactForm();
});

/* ---------- Footer year ---------- */
function setYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------- Nav: mobile toggle + scrolled background ---------- */
function setupNav() {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu after clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });
}

/* ---------- Scroll progress bar at the top of the page ---------- */
function setupScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  });
}

/* ---------- Fade-in-up reveal animation on scroll ---------- */
function setupRevealAnimations() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));
}

/* ---------- Highlight the current section's nav link ---------- */
function setupActiveNavLink() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => observer.observe(section));
}

/* ---------- Load projects dynamically from MySQL (via PHP) ---------- */
async function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  const loadingEl = document.getElementById('projectsLoading');

  // Fallback data used if the PHP/MySQL backend isn't running yet
  // (e.g. viewing this file directly in a browser without a server).
  const fallbackProjects = [
    {
      title: 'Task Flow',
      description: 'A minimal task manager with drag-and-drop boards and due-date reminders.',
      tech_stack: 'PHP,MySQL,JavaScript',
      live_url: '#',
      code_url: '#'
    },
    {
      title: 'Recipe Box',
      description: 'A searchable recipe collection with user accounts and saved favorites.',
      tech_stack: 'PHP,MySQL,CSS',
      live_url: '#',
      code_url: '#'
    },
    {
      title: 'Budget Buddy',
      description: 'A simple personal finance tracker with monthly spending charts.',
      tech_stack: 'JavaScript,PHP,MySQL',
      live_url: '#',
      code_url: '#'
    }
  ];

  try {
    const response = await fetch('php/get_projects.php');
    if (!response.ok) throw new Error('Request failed');
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      renderProjects(data);
    } else {
      renderProjects(fallbackProjects);
    }
  } catch (err) {
    // No PHP server running, or the database hasn't been set up yet.
    renderProjects(fallbackProjects);
  } finally {
    if (loadingEl) loadingEl.remove();
  }

  function renderProjects(projects) {
    grid.innerHTML = projects.map(project => {
      const tags = (project.tech_stack || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
        .map(t => `<span class="project-tag">${escapeHtml(t)}</span>`)
        .join('');

      const thumb = project.image_url
        ? `<img src="${escapeHtml(project.image_url)}" alt="${escapeHtml(project.title)}">`
        : `<i class="fa-solid fa-diagram-project"></i>`;

      return `
        <div class="project-card">
          <div class="project-thumb">${thumb}</div>
          <div class="project-body">
            <h3 class="project-title">${escapeHtml(project.title)}</h3>
            <p class="project-desc">${escapeHtml(project.description || '')}</p>
            <div class="project-tags">${tags}</div>
            <div class="project-links">
              ${project.live_url ? `<a href="${escapeHtml(project.live_url)}" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live</a>` : ''}
              ${project.code_url ? `<a href="${escapeHtml(project.code_url)}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> Code</a>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}

/* Basic HTML-escaping helper so project data never breaks markup */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- Contact form: client-side validation + AJAX submit ---------- */
function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnSpinner = submitBtn.querySelector('.btn-spinner');
  const statusEl = document.getElementById('formStatus');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    if (!validateForm()) return;

    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
      website: form.website.value // honeypot field, should stay empty
    };

    setLoading(true);

    try {
      const response = await fetch('php/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        statusEl.textContent = result.message || 'Message sent — thank you!';
        statusEl.classList.add('success');
        form.reset();
      } else {
        statusEl.textContent = result.message || 'Something went wrong. Please try again.';
        statusEl.classList.add('error');
      }
    } catch (err) {
      statusEl.textContent = 'Could not reach the server. Please make sure the PHP backend is running.';
      statusEl.classList.add('error');
    } finally {
      setLoading(false);
    }
  });

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    btnText.textContent = isLoading ? 'Sending…' : 'Send message';
    btnSpinner.style.display = isLoading ? 'inline-block' : 'none';
  }

  function validateForm() {
    let isValid = true;

    isValid = validateField('name', v => v.length >= 2, 'Please enter your name.') && isValid;
    isValid = validateField('email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Please enter a valid email address.') && isValid;
    isValid = validateField('message', v => v.length >= 10, 'Please write at least 10 characters.') && isValid;

    return isValid;
  }

  function validateField(fieldName, testFn, errorMessage) {
    const field = form[fieldName];
    const errorEl = document.getElementById(fieldName + 'Error');
    const value = field.value.trim();

    if (!testFn(value)) {
      field.classList.add('invalid');
      if (errorEl) errorEl.textContent = errorMessage;
      return false;
    }

    field.classList.remove('invalid');
    if (errorEl) errorEl.textContent = '';
    return true;
  }

  // Clear inline errors as the user types
  ['name', 'email', 'message'].forEach(fieldName => {
    form[fieldName].addEventListener('input', () => {
      form[fieldName].classList.remove('invalid');
      const errorEl = document.getElementById(fieldName + 'Error');
      if (errorEl) errorEl.textContent = '';
    });
  });
}
