(() => {
  'use strict';
  const features = [
    ['hours', 'Öffnungszeiten', 'Reguläre Zeiten, Feiertage und ein «Jetzt geöffnet»-Hinweis.'],
    ['timed', 'Zeitlich begrenzte Inhalte', 'Aktionen und Hinweise automatisch ein- und ausblenden.'],
    ['contact', 'Kontaktformular', 'Anfragen direkt über deine Website erhalten.'],
    ['gallery', 'Bildergalerie', 'Arbeiten, Produkte oder Räume mit Bildern präsentieren.'],
    ['booking', 'BYO Calendar', 'Terminreservationen direkt über deine Website verwalten.'],
    ['ai', 'KI Assistent', 'Ein intelligenter Assistent unterstützt deine Kundinnen und Kunden.'],
    ['social', 'Social Media Konnektoren', 'Instagram, Facebook und weitere Kanäle mit der Website verbinden.'],
    ['languages', 'Mehrere Sprachen', 'Deine Inhalte in zusätzlichen Sprachen anbieten.'],
    ['map', 'Standort & Anfahrt', 'Adresse, Kartenansicht und Wegbeschreibung.'],
    ['faq', 'Häufige Fragen', 'Wichtige Antworten an einem Ort bereitstellen.']
  ];
  const form = document.getElementById('project-form');
  const panels = [...document.querySelectorAll('[data-panel]')];
  const steps = [...document.querySelectorAll('[data-step]')];
  const field = name => form.elements.namedItem(name);
  const value = name => field(name).value.trim();
  const selected = () => features.filter(([id]) => document.getElementById(`feature-${id}`).checked);
  const has = id => document.getElementById(`feature-${id}`).checked;
  const pages = () => value('pageCount');
  const plans = {
    small: {label: 'Small', pages: 3, included: ['hours', 'contact', 'gallery'], selected: ['hours', 'contact', 'gallery']},
    basic: {label: 'Basic', pages: 5, included: ['hours', 'map', 'contact', 'gallery'], selected: ['hours', 'map', 'contact', 'gallery']},
    business: {label: 'Business', pages: 8, included: ['hours', 'map', 'contact', 'gallery'], selected: ['hours', 'map', 'contact', 'gallery', 'booking', 'ai', 'social', 'languages', 'faq', 'timed']}
  };
  const requestedPlan = new URLSearchParams(window.location.search).get('plan');
  const activePlanKey = Object.hasOwn(plans, requestedPlan) ? requestedPlan : 'basic';
  const activePlan = plans[activePlanKey];
  const includedFeatures = new Set(activePlan.included);
  const priceForPages = count => 600 + (count > 5 ? (count - 5) * 70 : count < 5 ? -(5 - count) * 50 : 0);
  const extraFeatureCount = () => selected().filter(([id]) => !includedFeatures.has(id)).length;
  const totalPrice = () => priceForPages(Number(pages())) + extraFeatureCount() * 80;
  const formatPrice = price => `CHF ${price.toLocaleString('de-CH')}`;
  let step = 0;

  features.forEach(([id, title, description]) => {
    const label = document.createElement('label');
    label.className = 'feature-card';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'features';
    checkbox.value = id;
    checkbox.id = `feature-${id}`;
    const text = document.createElement('span');
    const strong = document.createElement('strong');
    strong.textContent = title;
    const small = document.createElement('small');
    small.textContent = description;
    const price = document.createElement('em');
    price.className = 'feature-price';
    price.textContent = includedFeatures.has(id) ? 'Im Paket inbegriffen' : '+ CHF 80';
    text.append(strong, small, price);
    label.append(checkbox, text);
    document.getElementById('feature-grid').append(label);
  });

  field('pageCount').value = String(activePlan.pages);
  activePlan.selected.forEach(id => { document.getElementById(`feature-${id}`).checked = true; });

  function toggleDetails(id, enabled) {
    const box = document.getElementById(id);
    box.hidden = !enabled;
    box.querySelectorAll('input, textarea').forEach(input => { input.disabled = !enabled; });
  }

  function update() {
    toggleDetails('hours-details', has('hours'));
    toggleDetails('timed-details', has('timed'));
    const start = value('timedStart');
    const end = value('timedEnd');
    field('timedEnd').min = start;
    field('timedEnd').setCustomValidity(has('timed') && start && end && end < start ? 'Das Enddatum muss am oder nach dem Startdatum liegen.' : '');
    const count = Number(pages());
    const validCount = Number.isInteger(count) && count >= 3 && count <= 30;
    field('pageCount').setCustomValidity(validCount ? '' : 'Bitte wähle zwischen 3 und 30 Seiten.');
    const price = totalPrice();
    document.getElementById('summary-plan').textContent = activePlan.label;
    document.getElementById('summary-pages').textContent = `${count} Seiten`;
    document.getElementById('summary-price').textContent = formatPrice(price);
    document.getElementById('page-count').replaceChildren(document.createTextNode(`${count} `), Object.assign(document.createElement('small'), {textContent: 'Seiten'}));
    document.getElementById('page-price').textContent = formatPrice(price);
    field('pageCount').setAttribute('aria-valuetext', `${count} Seiten`);
    field('pageCount').style.setProperty('--range-progress', `${((count - 3) / 27) * 100}%`);
    document.getElementById('summary-business').textContent = value('business');
    const list = document.getElementById('summary-features');
    list.replaceChildren();
    const choices = selected();
    document.getElementById('feature-count').textContent = choices.length;
    choices.forEach(([id, title]) => {
      const li = document.createElement('li');
      li.textContent = `${title} ${includedFeatures.has(id) ? '· inbegriffen' : '· + CHF 80'}`;
      list.append(li);
    });
    if (!choices.length) {
      const empty = document.createElement('li');
      empty.className = 'empty';
      empty.textContent = 'Noch keine Extras ausgewählt.';
      list.append(empty);
    }
    document.getElementById('request-preview').textContent = requestText();
  }

  function showStep(next, focus = true) {
    step = next;
    panels.forEach((panel, i) => { panel.hidden = i !== step; });
    steps.forEach((button, i) => {
      if (i === step) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    document.getElementById('previous').hidden = step === 0;
    document.getElementById('next').hidden = step === 2;
    document.getElementById('next').textContent = step === 0 ? 'Funktionen wählen →' : 'Zur Anfrage →';
    document.getElementById('step-caption').textContent = `Schritt ${step + 1} von 3`;
    if (focus) document.getElementById(`heading-${step}`).focus();
  }

  function validateThrough(last) {
    update();
    for (let i = 0; i <= last; i++) {
      const invalid = [...panels[i].querySelectorAll('input, select, textarea')].find(input => !input.disabled && !input.checkValidity());
      if (invalid) {
        showStep(i);
        invalid.reportValidity();
        return false;
      }
    }
    return true;
  }

  function go(next) {
    if (next <= step || validateThrough(next - 1)) showStep(next);
  }
  steps.forEach(button => button.addEventListener('click', () => go(Number(button.dataset.step))));
  document.getElementById('previous').addEventListener('click', () => go(Math.max(0, step - 1)));
  document.getElementById('next').addEventListener('click', () => go(Math.min(2, step + 1)));
  form.addEventListener('input', () => {
    update();
    document.getElementById('submit-status').textContent = '';
    document.getElementById('copy-fallback').hidden = true;
  });
  form.addEventListener('change', update);

  function requestText() {
    const lines = [
      'Hallo Build Your Own', '', 'Ich interessiere mich für eine Website mit folgender Konfiguration:', '',
      `Projekt / Firma: ${value('projectName') || 'Noch offen'}`,
      `Bereich: ${value('business')}`,
      `Paket: ${activePlan.label}`,
      `Umfang: ${pages()} ${pages() === '1' ? 'Seite' : 'Seiten'} (ohne rechtliche Seiten)`,
      `Gesamtpreis: ${formatPrice(totalPrice())}`, '',
      'Gewünschte Funktionen:',
      ...selected().map(([, title]) => `- ${title}`)
    ];
    if (!selected().length) lines.push('- Keine zusätzlichen Funktionen ausgewählt');
    if (has('hours')) {
      lines.push('', 'Öffnungszeiten:');
      if (field('holidayHours').checked) lines.push('- Abweichende Feiertags- und Ferienzeiten');
      if (field('openStatus').checked) lines.push('- Status «Jetzt geöffnet / geschlossen»');
      if (value('hoursNote')) lines.push(value('hoursNote'));
    }
    if (has('timed')) {
      lines.push('', 'Zeitlich begrenzte Inhalte:');
      if (value('timedStart')) lines.push(`- Sichtbar ab: ${value('timedStart')}`);
      if (value('timedEnd')) lines.push(`- Sichtbar bis: ${value('timedEnd')}`);
      if (field('repeatContent').checked) lines.push('- Wiederkehrende Inhalte gewünscht');
      if (value('timedNote')) lines.push(value('timedNote'));
    }
    lines.push('', `Gewünschter Start: ${value('timeline')}`, `Bestehende Website: ${value('existingSite') || 'Keine angegeben'}`);
    if (value('message')) lines.push('', 'Weitere Wünsche:', value('message'));
    lines.push('', 'Kontakt:', `Name: ${value('contactName')}`, `E-Mail: ${value('contactEmail')}`, '', 'Ich freue mich auf eure Rückmeldung per E-Mail.');
    return lines.join('\n');
  }

  const status = document.getElementById('submit-status');
  function revealText(text) {
    document.getElementById('copy-fallback').hidden = false;
    document.getElementById('request-text').value = text;
  }
  // Native HTTPS POST keeps the provider's CAPTCHA and delivery confirmation flow.
  // No email client is involved, and no client-side mail credentials are exposed.
  form.noValidate = true;
  let sending = false;
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (sending) return;
    if (step < 2) { go(step + 1); return; }
    if (!validateThrough(2)) return;
    const payload = {
      _subject: `Neue Website-Anfrage${value('projectName') ? `: ${value('projectName')}` : ''}`,
      _template: 'table',
      _next: new URL('./anfrage-erhalten.html', window.location.href).href,
      name: value('contactName'),
      email: value('contactEmail'),
      _replyto: value('contactEmail'),
      'Projekt / Firma': value('projectName') || 'Noch offen',
      Bereich: value('business'),
      Paket: activePlan.label,
      Seitenanzahl: `${pages()} Seiten (ohne rechtliche Seiten)`,
      Gesamtpreis: formatPrice(totalPrice()),
      Funktionen: selected().map(([, title]) => title).join(', ') || 'Keine zusätzlichen Funktionen',
      'Gewünschter Start': value('timeline'),
      'Bestehende Website': value('existingSite') || 'Keine angegeben',
      'Formular-Zusammenfassung': requestText()
    };
    const outbound = document.createElement('form');
    outbound.method = 'POST';
    outbound.action = 'https://formsubmit.co/contact.buildyourown@gmail.com';
    outbound.hidden = true;
    outbound.dataset.transport = 'project-request';
    Object.entries(payload).forEach(([name, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      outbound.append(input);
    });
    document.body.append(outbound);
    sending = true;
    const sendButton = document.getElementById('send-request');
    sendButton.disabled = true;
    sendButton.textContent = 'Weiter zum Versand …';
    status.textContent = 'Deine Anfrage wird an den Versanddienst übergeben. Bitte schliesse dort gegebenenfalls die Sicherheitsprüfung ab.';
    try {
      HTMLFormElement.prototype.submit.call(outbound);
    } catch {
      sending = false;
      sendButton.disabled = false;
      sendButton.textContent = 'Erneut absenden ↗';
      status.textContent = 'Die Anfrage konnte nicht übergeben werden. Deine Eingaben bleiben erhalten. Bitte versuche es erneut.';
      outbound.remove();
    }
  });
  window.addEventListener('pageshow', () => {
    sending = false;
    const button = document.getElementById('send-request');
    button.disabled = false;
    button.textContent = 'Anfrage absenden ↗';
    status.textContent = '';
    document.querySelectorAll('form[data-transport]').forEach(node => node.remove());
    requestAnimationFrame(update);
  });
  document.getElementById('copy-request').addEventListener('click', async () => {
    if (!validateThrough(2)) return;
    const text = requestText();
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      status.textContent = 'Zusammenfassung kopiert. Du kannst sie für deine Unterlagen speichern.';
    } catch {
      revealText(text);
      const box = document.getElementById('request-text');
      box.focus();
      box.select();
      status.textContent = 'Bitte kopiere den markierten Text für deine Unterlagen.';
    }
  });

  // Mustafa hands over a reviewed proposal within this browser tab.
  const proposalId = new URLSearchParams(location.search).get('ai');
  if (proposalId && /^[a-zA-Z0-9-]{1,80}$/.test(proposalId)) {
    try {
      const key = 'byo-mustafa:' + proposalId;
      const raw = sessionStorage.getItem(key);
      const saved = raw ? JSON.parse(raw) : null;
      const proposal = saved?.configuration;
      const businesses = [...field('business').options].map(option => option.value);
      const valid = saved && Date.now() - saved.createdAt < 1800000 && Date.now() >= saved.createdAt
        && proposal && Number.isInteger(proposal.pageCount) && proposal.pageCount >= 3 && proposal.pageCount <= 30
        && Array.isArray(proposal.features) && proposal.features.every(id => features.some(([known]) => id === known))
        && businesses.includes(proposal.business) && typeof proposal.projectName === 'string' && proposal.projectName.length <= 100
        && typeof proposal.notes === 'string' && proposal.notes.length <= 1500;
      if (valid) {
        field('pageCount').value = String(proposal.pageCount);
        field('business').value = proposal.business;
        field('projectName').value = proposal.projectName;
        if (proposal.notes) field('message').value = proposal.notes;
        features.forEach(([id]) => {
          document.getElementById('feature-' + id).checked = includedFeatures.has(id) || proposal.features.includes(id);
        });
        sessionStorage.removeItem(key);
      }
      const clean = new URL(location.href);
      clean.searchParams.delete('ai');
      history.replaceState(null, '', clean.href);
    } catch { /* The manual configurator remains available. */ }
  }

  document.getElementById('year').textContent = new Date().getFullYear();
  update();
  showStep(0, false);
})();
