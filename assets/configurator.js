(() => {
  'use strict';
  const features = [
    ['hours', 'Öffnungszeiten', 'Reguläre Zeiten, Feiertage und ein «Jetzt geöffnet»-Hinweis.'],
    ['timed', 'Zeitlich begrenzte Inhalte', 'Aktionen und Hinweise automatisch ein- und ausblenden.'],
    ['contact', 'Kontaktformular', 'Anfragen direkt über deine Website erhalten.'],
    ['gallery', 'Bildergalerie', 'Arbeiten, Produkte oder Räume mit Bildern präsentieren.'],
    ['booking', 'Termine & Reservationen', 'Terminanfragen oder ein passendes Buchungssystem.'],
    ['languages', 'Mehrere Sprachen', 'Deine Inhalte in zusätzlichen Sprachen anbieten.'],
    ['map', 'Standort & Anfahrt', 'Adresse, Kartenansicht und Wegbeschreibung.'],
    ['news', 'News & Blog', 'Neuigkeiten, Geschichten und Beiträge veröffentlichen.'],
    ['shop', 'Onlineshop', 'Produkte präsentieren und online verkaufen.'],
    ['editing', 'Inhalte selbst bearbeiten', 'Texte und Bilder nach dem Launch selbst pflegen.'],
    ['menu', 'Speisekarte & Angebote', 'Dein Angebot übersichtlich und digital zeigen.'],
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
  const priceForPages = count => 600 + (count > 5 ? (count - 5) * 70 : count < 5 ? -(5 - count) * 20 : 0);
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
    text.append(strong, small);
    label.append(checkbox, text);
    document.getElementById('feature-grid').append(label);
  });

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
    const price = priceForPages(count);
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
    choices.forEach(([, title]) => {
      const li = document.createElement('li');
      li.textContent = title;
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
      `Umfang: ${pages()} ${pages() === '1' ? 'Seite' : 'Seiten'} (ohne rechtliche Seiten)`,
      `Preis nach Seitenumfang: ${formatPrice(priceForPages(Number(pages())))}`, '',
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
      Seitenanzahl: `${pages()} Seiten (ohne rechtliche Seiten)`,
      Preis: formatPrice(priceForPages(Number(pages()))),
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
  document.getElementById('year').textContent = new Date().getFullYear();
  update();
  showStep(0, false);
})();
