(() => {
  'use strict';
  const features = [["hours","Öffnungszeiten"],["timed","Zeitlich begrenzte Inhalte"],["contact","Kontaktformular"],["gallery","Bildergalerie"],["booking","Termine & Reservationen"],["languages","Mehrere Sprachen"],["map","Standort & Anfahrt"],["faq","Häufige Fragen"]];
  const activePlan = {label: 'Basic'};
  const includedFeatures = new Set(['hours', 'map', 'contact', 'gallery']);
  const priceForPages = count => 600 + (count > 5 ? (count - 5) * 70 : -(5 - count) * 50);
  const formatPrice = price => 'CHF ' + price.toLocaleString('de-CH');
  // Only public endpoint information is shipped to the browser.
  const aiEndpoint = 'https://byo-ai.contact-buildyourown.workers.dev/configure';
  const aiInput = document.getElementById('ai-description');
  const aiGenerate = document.getElementById('ai-generate');
  const aiStatus = document.getElementById('ai-status');
  const aiPreview = document.getElementById('ai-preview');
  const aiApply = document.getElementById('ai-apply');
  let aiProposal = null;
  let aiBusy = false;
  const businessChoices = ['Unternehmen & Dienstleistungen', 'Gastronomie & Hotellerie', 'Handwerk & Bau', 'Portfolio & Kreatives', 'Verein & Organisation', 'Gesundheit & Wohlbefinden', 'Onlinehandel', 'Etwas anderes'];

  function validProposal(proposal) {
    return proposal && Number.isInteger(proposal.pageCount) && proposal.pageCount >= 3 && proposal.pageCount <= 30
      && Array.isArray(proposal.features) && proposal.features.length <= features.length
      && proposal.features.every(id => features.some(([known]) => known === id))
      && businessChoices.includes(proposal.business)
      && typeof proposal.projectName === 'string' && proposal.projectName.length <= 100
      && typeof proposal.explanation === 'string' && proposal.explanation.length <= 1500
      && typeof proposal.notes === 'string' && proposal.notes.length <= 1500;
  }

  aiInput.addEventListener('input', () => {
    aiProposal = null;
    aiPreview.hidden = true;
    aiStatus.textContent = '';
  });

  aiGenerate.addEventListener('click', async () => {
    if (aiBusy) return;
    const description = aiInput.value.trim();
    if (description.length < 15 || description.length > 3000) {
      aiStatus.textContent = 'Bitte beschreibe dein Projekt mit mindestens 15 Zeichen.';
      aiInput.focus();
      return;
    }
    aiBusy = true;
    aiGenerate.disabled = true;
    aiInput.disabled = true;
    aiGenerate.textContent = 'Vorschlag wird erstellt …';
    aiStatus.textContent = 'Mustafa stellt deinen Website-Plan zusammen.';
    aiPreview.hidden = true;
    aiProposal = null;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(aiEndpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({description}),
        signal: controller.signal
      });
      let data;
      try { data = await response.json(); }
      catch { throw new Error('Der KI-Dienst ist noch nicht bereit. Du kannst weiterhin manuell konfigurieren.'); }
      if (!response.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Die KI ist gerade nicht verfügbar.');
      if (!validProposal(data.configuration)) throw new Error('Der Vorschlag war unvollständig. Bitte versuche es nochmals.');
      aiProposal = data.configuration;
      aiProposal.features = [...new Set([...includedFeatures, ...aiProposal.features])];
      const estimatedPrice = priceForPages(aiProposal.pageCount)
        + aiProposal.features.filter(id => !includedFeatures.has(id)).length * 80;
      document.getElementById('ai-pages').textContent = aiProposal.pageCount + ' Seiten · ' + activePlan.label;
      document.getElementById('ai-price').textContent = formatPrice(estimatedPrice);
      document.getElementById('ai-explanation').textContent = aiProposal.explanation;
      document.getElementById('ai-notes').textContent = aiProposal.notes;
      const list = document.getElementById('ai-features');
      list.replaceChildren();
      aiProposal.features.forEach(id => {
        const item = document.createElement('li');
        const feature = features.find(([known]) => known === id);
        item.textContent = feature[1] + (includedFeatures.has(id) ? ' · inbegriffen' : ' · + CHF 80');
        list.append(item);
      });
      aiPreview.hidden = false;
      aiStatus.textContent = 'Mustafas Vorschlag ist bereit. Prüfe ihn und übernimm deine Konfiguration.';
    } catch (error) {
      aiStatus.textContent = error.name === 'AbortError'
        ? 'Die Antwort dauert zu lange. Bitte versuche es erneut oder konfiguriere manuell.'
        : error.name === 'TypeError'
          ? 'Der KI-Dienst ist gerade nicht erreichbar. Du kannst weiterhin manuell konfigurieren.'
          : error.message;
    } finally {
      window.clearTimeout(timer);
      aiBusy = false;
      aiGenerate.disabled = false;
      aiInput.disabled = false;
      aiGenerate.textContent = 'Vorschlag erstellen ↗';
    }
  });

  aiApply.addEventListener('click', () => {
    if (!aiProposal || aiBusy) return;
    try {
      const id = crypto.randomUUID();
      sessionStorage.setItem('byo-mustafa:' + id, JSON.stringify({createdAt: Date.now(), configuration: aiProposal}));
      location.href = './projekt.html?plan=basic&ai=' + encodeURIComponent(id);
    } catch {
      aiStatus.textContent = 'Bitte erlaube die Speicherung für diese Website, damit du den Vorschlag übernehmen kannst.';
    }
  });
  document.getElementById('year').textContent = new Date().getFullYear();
})();
