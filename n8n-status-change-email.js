// Generate branded HTML status change email
// Statuses that get emails: Active, Inactive, Leaving, Churned, Onboarding
// Statuses that skip emails: Lead
// Special case: Lead/Prospect -> Churned gets a "jammer" email
const client = $input.item.json;

// First-run protection: if this is an initialization-only item, skip email generation
if (client.initOnly) {
  return {
    json: {
      ...client,
      skipEmail: true,
      reason: 'First run initialization, syncing Last Communicated Status without sending email'
    }
  };
}

const firstName = (client.clientName || 'Client').split(' ')[0];
const lang = client.language || 'Dutch';
const status = client.currentStatus;
const prevStatus = client.previousStatus;

// Brand constants (matches Ecomtrada branded style from other workflows)
const BRAND = {
  bg: '#0B130F',
  cardBg: '#162118',
  textPrimary: '#F5F4F0',
  textSecondary: '#C8D1CC',
  textMuted: '#5A6B60',
  accentGold: '#F9C31F',
  accentGreen: '#1F7A4D',
  border: '#304138',
  borderRadius: '12px',
  maxWidth: 600,
  fontHeading: "'Plus Jakarta Sans', Helvetica, Arial, sans-serif",
  fontBody: "'DM Sans', Helvetica, Arial, sans-serif",
  logoText: 'ecomtrada',
  logoDot: '.'
};

// HTML builder helpers
function buildHeader() {
  return `<tr><td style="padding:32px 0 24px 0; text-align:center;"><span style="font-family:${BRAND.fontHeading}; font-size:28px; font-weight:700; color:${BRAND.textPrimary}; letter-spacing:-0.5px;">${BRAND.logoText}<span style="color:${BRAND.accentGold};">${BRAND.logoDot}</span></span></td></tr>`;
}

function buildTitle(title) {
  return `<tr><td style="padding:0 0 8px 0;"><h1 style="margin:0; font-family:${BRAND.fontHeading}; font-size:22px; font-weight:700; color:${BRAND.textPrimary}; line-height:1.3;">${title}</h1></td></tr>`;
}

function buildTextSection(heading, body) {
  return `<tr><td style="padding:16px 0;"><table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.cardBg}; border:1px solid ${BRAND.border}; border-radius:${BRAND.borderRadius};"><tr><td style="padding:24px;">${heading ? `<h2 style="margin:0 0 12px 0; font-family:${BRAND.fontHeading}; font-size:16px; font-weight:700; color:${BRAND.textPrimary};">${heading}</h2>` : ''}<p style="margin:0; font-family:${BRAND.fontBody}; font-size:14px; color:${BRAND.textSecondary}; line-height:1.6;">${body}</p></td></tr></table></td></tr>`;
}

function buildFooter() {
  return `<tr><td style="padding:32px 0 16px 0; text-align:center;"><p style="margin:0 0 4px 0; font-family:${BRAND.fontBody}; font-size:12px; color:${BRAND.textMuted};">${BRAND.logoText}<span style="color:${BRAND.accentGold}">.</span> Google Ads Agency for E-commerce</p><p style="margin:0; font-family:${BRAND.fontBody}; font-size:11px; color:${BRAND.textMuted};"><a href="https://ecomtrada.nl" style="color:${BRAND.textMuted}; text-decoration:none;">ecomtrada.nl</a></p></td></tr>`;
}

function buildButton(label, url) {
  return `<tr><td style="padding:8px 0;"><table cellpadding="0" cellspacing="0" style="margin:0;"><tr><td style="background-color:${BRAND.accentGreen}; border-radius:8px;"><a href="${url}" target="_blank" style="display:inline-block; padding:12px 24px; font-family:${BRAND.fontBody}; font-size:14px; font-weight:700; color:${BRAND.textPrimary}; text-decoration:none;">${label}</a></td></tr></table></td></tr>`;
}

function buildButtonGroup(buttons) {
  let rows = buttons.map(b => `<tr><td style="padding:6px 0;"><table cellpadding="0" cellspacing="0"><tr><td style="background-color:${BRAND.accentGreen}; border-radius:8px;"><a href="${b.url}" target="_blank" style="display:inline-block; padding:12px 24px; font-family:${BRAND.fontBody}; font-size:14px; font-weight:600; color:${BRAND.textPrimary}; text-decoration:none;">${b.label}</a></td></tr></table></td></tr>`).join('');
  return `<tr><td style="padding:16px 0;"><table width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr>`;
}

function wrapEmail(bodyHtml) {
  return `<!DOCTYPE html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Ecomtrada</title><style>@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=DM+Sans:wght@400;500;700&display=swap');</style></head><body style="margin:0; padding:0; background-color:${BRAND.bg};"><table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};"><tr><td align="center" style="padding:0 16px;"><table width="${BRAND.maxWidth}" cellpadding="0" cellspacing="0" style="max-width:${BRAND.maxWidth}px; width:100%;">${bodyHtml}</table></td></tr></table></body></html>`;
}

function signOff(l) {
  const name = 'Lennard Steeman';
  if (l === 'German') return `Mit freundlichen Grüßen,<br><strong style="color:${BRAND.textPrimary};">${name}</strong><br>Ecomtrada`;
  if (l === 'French') return `Cordialement,<br><strong style="color:${BRAND.textPrimary};">${name}</strong><br>Ecomtrada`;
  if (l === 'English') return `Best regards,<br><strong style="color:${BRAND.textPrimary};">${name}</strong><br>Ecomtrada`;
  return `Met vriendelijke groet,<br><strong style="color:${BRAND.textPrimary};">${name}</strong><br>Ecomtrada`;
}

// Roadmap builder for Active template
function buildRoadmap(l) {
  const phases = [
    {
      key: 'pre-start',
      label: 'Pre-Start',
      subtitle: { Dutch: 'Voorbereiding', English: 'Preparation', German: 'Vorbereitung', French: 'Préparation' },
      active: true
    },
    {
      key: 'phase1',
      label: 'Phase 1',
      subtitle: { Dutch: 'Initiële Setup', English: 'Initial Setup', German: 'Initiale Einrichtung', French: 'Mise en place' },
      active: false
    },
    {
      key: 'phase2',
      label: 'Phase 2',
      subtitle: { Dutch: 'Optimalisatie', English: 'Optimization', German: 'Optimierung', French: 'Optimisation' },
      active: false
    },
    {
      key: 'phase3',
      label: 'Phase 3',
      subtitle: { Dutch: 'Doorlopend', English: 'Ongoing', German: 'Fortlaufend', French: 'En continu' },
      active: false
    }
  ];

  const footerTexts = {
    Dutch: 'We houden je op de hoogte bij elke fase-overgang.',
    English: 'We will keep you informed at every phase transition.',
    German: 'Wir halten Sie bei jedem Phasenübergang auf dem Laufenden.',
    French: 'Nous vous tiendrons informé à chaque transition de phase.'
  };

  const segmentWidth = '25%';
  let progressCells = phases.map((p, i) => {
    const bgColor = p.active ? BRAND.accentGold : BRAND.border;
    const radius = i === 0 ? 'border-radius:6px 0 0 6px;' : (i === phases.length - 1 ? 'border-radius:0 6px 6px 0;' : '');
    return `<td style="width:${segmentWidth}; height:8px; background-color:${bgColor}; ${radius}"></td>`;
  }).join('');

  let progressBar = `<table width="100%" cellpadding="0" cellspacing="2" style="margin-bottom:20px;"><tr>${progressCells}</tr></table>`;

  let phaseCards = phases.map(p => {
    const borderColor = p.active ? BRAND.accentGold : BRAND.border;
    const emoji = p.active ? '▶️' : '⚪';
    const labelColor = p.active ? BRAND.accentGold : BRAND.textMuted;
    const subtitleColor = p.active ? BRAND.textSecondary : BRAND.textMuted;
    const sub = p.subtitle[l] || p.subtitle['English'];

    return `<td style="width:25%; padding:0 4px; vertical-align:top;"><table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.cardBg}; border:1px solid ${borderColor}; border-radius:8px;"><tr><td style="padding:12px 8px; text-align:center;"><span style="font-size:16px;">${emoji}</span><br><span style="font-family:${BRAND.fontHeading}; font-size:12px; font-weight:700; color:${labelColor}; line-height:1.8;">${p.label}</span><br><span style="font-family:${BRAND.fontBody}; font-size:10px; color:${subtitleColor};">${sub}</span></td></tr></table></td>`;
  }).join('');

  let cardsRow = `<table width="100%" cellpadding="0" cellspacing="0"><tr>${phaseCards}</tr></table>`;

  const footerText = footerTexts[l] || footerTexts['English'];
  let footer = `<p style="margin:16px 0 0 0; font-family:${BRAND.fontBody}; font-size:11px; color:${BRAND.textMuted}; text-align:center;">${footerText}</p>`;

  return progressBar + cardsRow + footer;
}

// Statuses that do NOT get an email
const noEmailStatuses = ['Lead'];

// Special case: Lead or Prospect -> Churned gets a "jammer" email
const isJammerEmail = (status === 'Churned' && (prevStatus === 'Lead' || prevStatus === 'Prospect'));

if (noEmailStatuses.includes(status) && !isJammerEmail) {
  return {
    json: {
      ...client,
      skipEmail: true,
      reason: `No email sent for status: ${status} (handled by other workflows)`
    }
  };
}

// Email templates per language and status
const templates = {};

// ---------- DUTCH ----------
templates.Dutch = {
  Onboarding: {
    subject: `Welkom bij Ecomtrada, ${firstName}! Hier zijn je volgende stappen`,
    title: `Leuk dat je erbij bent, ${firstName}!`,
    sections: [
      { heading: null, body: `Bedankt dat je met ons gaat samenwerken! We kijken er enorm naar uit om voor jou aan de slag te gaan.` },
      { heading: 'Stap 1: Onboardingformulier invullen', body: `Vul het onboardingformulier in zodat we direct aan je strategie kunnen werken.` }
    ],
    buttons: [
      { label: '→ Onboardingformulier invullen', url: 'https://cmcvx25xi7y.typeform.com/to/h8Ugfabb' }
    ],
    sections2: [
      { heading: 'Stap 2: Betaling afronden', body: `Rond de betaling af zodat we alles officieel kunnen opstarten.` }
    ],
    buttons2: [
      { label: '→ Betaling afronden', url: 'https://buy.stripe.com/3cI3cv7h1eC79pm6cc0Ny0O' }
    ],
    sections3: [
      { heading: 'Stap 3: Onboarding-call inplannen', body: `Zodra het formulier en de betaling gedaan zijn, plan een meeting met mij in om alle toegang te regelen zodat wij aan de slag kunnen.` }
    ],
    buttons3: [
      { label: '→ Onboarding-call inplannen', url: 'https://tidycal.com/lennard/onboarding-call' }
    ],
    closingSections: [
      { heading: null, body: `Laat het gerust weten als je meer informatie of verduidelijking nodig hebt. Nogmaals bedankt voor je vertrouwen in ons, we staan klaar om samen iets moois te bereiken!<br><br>${signOff('Dutch')}` }
    ]
  },
  Active: {
    subject: `Welkom ${firstName}! Je account is nu actief`,
    title: `Welkom, ${firstName}!`,
    sections: [
      { heading: null, body: `Je account is nu officieel actief! We beginnen met de <strong style="color:${BRAND.accentGold};">Pre-Start</strong> fase: de voorbereidingsfase waarin we alles klaarzetten voordat je campagnes live gaan.` },
      { heading: 'Wat we nu gaan doen', body: `• Strategie uitwerken op basis van jouw doelen en markt<br>• Campagnes opzetten en configureren<br>• Interne kwaliteitscheck voordat alles live gaat<br><br>Let op: je campagnes gaan pas live in Phase 1, nadat alles is gecontroleerd en goedgekeurd.` },
      { heading: 'Jouw roadmap', body: buildRoadmap('Dutch') },
      { heading: null, body: `Heb je vragen? Neem gerust contact op.<br><br>${signOff('Dutch')}` }
    ]
  },
  Inactive: {
    subject: `Account update: campagnes gepauzeerd`,
    title: `Campagnes gepauzeerd, ${firstName}`,
    sections: [
      { heading: null, body: `We willen je laten weten dat je account op inactief is gezet. Je campagnes zijn momenteel gepauzeerd.` },
      { heading: 'Wat betekent dit?', body: `Dit kan te maken hebben met een seizoensbreak, budgetherziening of strategische beslissing. Je accountinstellingen en historische data blijven volledig bewaard.<br><br>Als je klaar bent om weer te starten, laat het ons weten en we kunnen je campagnes snel weer activeren.<br><br>${signOff('Dutch')}` }
    ]
  },
  Leaving: {
    subject: `We vinden het jammer dat je vertrekt, ${firstName}`,
    title: `Jammer dat je vertrekt, ${firstName}`,
    sections: [
      { heading: null, body: `We hebben je verzoek ontvangen om de samenwerking te beëindigen. We vinden het jammer dat je vertrekt.` },
      { heading: 'Wat er nu gebeurt', body: `• Je campagnes blijven draaien tot het einde van de huidige facturatieperiode<br>• We maken een eindrapport op<br>• Alle accounttoegang en assets worden aan jou overgedragen<br><br>Als er iets is dat we anders hadden kunnen doen, horen we graag je feedback. En als je in de toekomst weer wilt samenwerken, zijn we er altijd.<br><br>${signOff('Dutch')}` }
    ]
  },
  Churned: {
    subject: `Laatste accountoverzicht`,
    title: `Account afgesloten, ${firstName}`,
    sections: [
      { heading: null, body: `Je account bij Ecomtrada is afgesloten. We hebben je eindfacturatie opgesteld en alle account-assets zijn overgedragen.` },
      { heading: null, body: `We wensen je het allerbeste met je bedrijf. Mocht je in de toekomst weer willen samenwerken, neem dan gerust contact op.<br><br>${signOff('Dutch')}` }
    ]
  },
  Jammer: {
    subject: `Jammer dat het er niet van komt, ${firstName}`,
    title: `Jammer, ${firstName}`,
    sections: [
      { heading: null, body: `Jammer dat het er op dit moment niet van komt. We begrijpen dat de timing niet altijd past en respecteren je beslissing volledig.` },
      { heading: null, body: `Mocht je in de toekomst alsnog interesse hebben, dan staan we altijd open voor een gesprek. Succes met alles!<br><br>${signOff('Dutch')}` }
    ]
  }
};

// ---------- ENGLISH ----------
templates.English = {
  Onboarding: {
    subject: `Welcome to Ecomtrada, ${firstName}! Here are your next steps`,
    title: `Great to have you on board, ${firstName}!`,
    sections: [
      { heading: null, body: `Thank you for choosing to work with us! We are really looking forward to getting started for you.` },
      { heading: 'Step 1: Fill in the onboarding form', body: `Complete the onboarding form so we can start working on your strategy right away.` }
    ],
    buttons: [
      { label: '→ Fill in onboarding form', url: 'https://cmcvx25xi7y.typeform.com/to/h8Ugfabb' }
    ],
    sections2: [
      { heading: 'Step 2: Complete payment', body: `Complete the payment so we can officially kick things off.` }
    ],
    buttons2: [
      { label: '→ Complete payment', url: 'https://buy.stripe.com/3cI3cv7h1eC79pm6cc0Ny0O' }
    ],
    sections3: [
      { heading: 'Step 3: Schedule onboarding call', body: `Once the form and payment are done, schedule a meeting with me to arrange all the access so we can get to work.` }
    ],
    buttons3: [
      { label: '→ Schedule onboarding call', url: 'https://tidycal.com/lennard/onboarding-call' }
    ],
    closingSections: [
      { heading: null, body: `Feel free to reach out if you need more information or clarification. Thank you again for your trust in us, we are ready to achieve great things together!<br><br>${signOff('English')}` }
    ]
  },
  Active: {
    subject: `Welcome ${firstName}! Your account is now active`,
    title: `Welcome, ${firstName}!`,
    sections: [
      { heading: null, body: `Your account is now officially active! We are starting with the <strong style="color:${BRAND.accentGold};">Pre-Start</strong> phase: the preparation stage where we set everything up before your campaigns go live.` },
      { heading: 'What we will do now', body: `• Build a strategy based on your goals and market<br>• Set up and configure your campaigns<br>• Internal quality review before everything goes live<br><br>Please note: your campaigns will only go live in Phase 1, after everything has been reviewed and approved.` },
      { heading: 'Your roadmap', body: buildRoadmap('English') },
      { heading: null, body: `Have any questions? Feel free to reach out.<br><br>${signOff('English')}` }
    ]
  },
  Inactive: {
    subject: `Account update: campaigns paused`,
    title: `Campaigns paused, ${firstName}`,
    sections: [
      { heading: null, body: `We wanted to let you know that your account has been set to inactive. Your campaigns are currently paused.` },
      { heading: 'What does this mean?', body: `This could be due to a seasonal break, budget review, or strategic decision. Your account setup and historical data remain fully intact.<br><br>When you are ready to resume, just let us know and we can have your campaigns running again quickly.<br><br>${signOff('English')}` }
    ]
  },
  Leaving: {
    subject: `We are sorry to see you go, ${firstName}`,
    title: `Sorry to see you go, ${firstName}`,
    sections: [
      { heading: null, body: `We have received your request to end our collaboration. We are sorry to see you go.` },
      { heading: 'What happens next', body: `• Your campaigns will continue running until the end of the current billing period<br>• We will prepare a final performance report<br>• All account access and assets will be transferred back to you<br><br>If there is anything we could have done differently, we would love to hear your feedback. And if you ever want to resume, our door is always open.<br><br>${signOff('English')}` }
    ]
  },
  Churned: {
    subject: `Final account summary`,
    title: `Account closed, ${firstName}`,
    sections: [
      { heading: null, body: `Your account with Ecomtrada has been closed. We have prepared your final billing summary and all account assets have been transferred.` },
      { heading: null, body: `We wish you all the best with your business. If you would like to work together again in the future, do not hesitate to reach out.<br><br>${signOff('English')}` }
    ]
  },
  Jammer: {
    subject: `Sorry it did not work out, ${firstName}`,
    title: `Sorry, ${firstName}`,
    sections: [
      { heading: null, body: `We are sorry it did not work out this time. We understand that the timing is not always right and fully respect your decision.` },
      { heading: null, body: `Should you be interested in the future, we are always open for a conversation. Best of luck with everything!<br><br>${signOff('English')}` }
    ]
  }
};

// ---------- GERMAN ----------
templates.German = {
  Onboarding: {
    subject: `Willkommen bei Ecomtrada, ${firstName}! Hier sind Ihre nächsten Schritte`,
    title: `Schön, dass Sie dabei sind, ${firstName}!`,
    sections: [
      { heading: null, body: `Vielen Dank, dass Sie sich für die Zusammenarbeit mit uns entschieden haben! Wir freuen uns sehr darauf, für Sie loszulegen.` },
      { heading: 'Schritt 1: Onboarding-Formular ausfüllen', body: `Füllen Sie das Onboarding-Formular aus, damit wir sofort an Ihrer Strategie arbeiten können.` }
    ],
    buttons: [
      { label: '→ Onboarding-Formular ausfüllen', url: 'https://cmcvx25xi7y.typeform.com/to/h8Ugfabb' }
    ],
    sections2: [
      { heading: 'Schritt 2: Zahlung abschließen', body: `Schließen Sie die Zahlung ab, damit wir alles offiziell starten können.` }
    ],
    buttons2: [
      { label: '→ Zahlung abschließen', url: 'https://buy.stripe.com/3cI3cv7h1eC79pm6cc0Ny0O' }
    ],
    sections3: [
      { heading: 'Schritt 3: Onboarding-Gespräch planen', body: `Sobald das Formular und die Zahlung erledigt sind, planen Sie ein Meeting mit mir, um alle Zugänge einzurichten, damit wir loslegen können.` }
    ],
    buttons3: [
      { label: '→ Onboarding-Gespräch planen', url: 'https://tidycal.com/lennard/onboarding-call' }
    ],
    closingSections: [
      { heading: null, body: `Zögern Sie nicht, uns zu kontaktieren, wenn Sie weitere Informationen oder Klärung benötigen. Nochmals vielen Dank für Ihr Vertrauen, wir sind bereit, gemeinsam Großartiges zu erreichen!<br><br>${signOff('German')}` }
    ]
  },
  Active: {
    subject: `Willkommen ${firstName}! Dein Konto ist jetzt aktiv`,
    title: `Willkommen, ${firstName}!`,
    sections: [
      { heading: null, body: `Dein Konto ist jetzt offiziell aktiv! Wir beginnen mit der <strong style="color:${BRAND.accentGold};">Pre-Start</strong> Phase: der Vorbereitungsphase, in der wir alles einrichten, bevor deine Kampagnen live gehen.` },
      { heading: 'Was wir jetzt tun werden', body: `• Strategie erarbeiten basierend auf deinen Zielen und deinem Markt<br>• Kampagnen aufsetzen und konfigurieren<br>• Interne Qualitätsprüfung bevor alles live geht<br><br>Bitte beachte: Deine Kampagnen gehen erst in Phase 1 live, nachdem alles geprüft und freigegeben wurde.` },
      { heading: 'Deine Roadmap', body: buildRoadmap('German') },
      { heading: null, body: `Hast du Fragen? Melde dich gerne bei uns.<br><br>${signOff('German')}` }
    ]
  },
  Inactive: {
    subject: `Konto-Update: Kampagnen pausiert`,
    title: `Kampagnen pausiert, ${firstName}`,
    sections: [
      { heading: null, body: `Wir möchten Sie darüber informieren, dass Ihr Konto auf inaktiv gesetzt wurde. Ihre Kampagnen sind derzeit pausiert.` },
      { heading: 'Was bedeutet das?', body: `Dies kann an einer saisonalen Pause, einer Budgetüberprüfung oder einer strategischen Entscheidung liegen. Ihre Kontoeinstellungen und historischen Daten bleiben vollständig erhalten.<br><br>Wenn Sie bereit sind, wieder zu starten, lassen Sie es uns wissen und wir können Ihre Kampagnen schnell wieder aktivieren.<br><br>${signOff('German')}` }
    ]
  },
  Leaving: {
    subject: `Es tut uns leid, dass Sie gehen, ${firstName}`,
    title: `Schade, dass Sie gehen, ${firstName}`,
    sections: [
      { heading: null, body: `Wir haben Ihre Anfrage erhalten, die Zusammenarbeit zu beenden. Es tut uns leid, dass Sie gehen.` },
      { heading: 'Was als Nächstes passiert', body: `• Ihre Kampagnen laufen bis zum Ende des aktuellen Abrechnungszeitraums weiter<br>• Wir erstellen einen abschließenden Leistungsbericht<br>• Alle Kontozugänge und Assets werden an Sie zurückübertragen<br><br>Wenn wir etwas anders hätten machen können, würden wir uns über Ihr Feedback freuen. Und wenn Sie in Zukunft wieder zusammenarbeiten möchten, stehen wir Ihnen jederzeit zur Verfügung.<br><br>${signOff('German')}` }
    ]
  },
  Churned: {
    subject: `Abschließende Kontozusammenfassung`,
    title: `Konto geschlossen, ${firstName}`,
    sections: [
      { heading: null, body: `Ihr Konto bei Ecomtrada wurde geschlossen. Wir haben Ihre Schlussrechnung erstellt und alle Konto-Assets wurden übertragen.` },
      { heading: null, body: `Wir wünschen Ihnen alles Gute für Ihr Unternehmen. Wenn Sie in Zukunft wieder zusammenarbeiten möchten, zögern Sie nicht, uns zu kontaktieren.<br><br>${signOff('German')}` }
    ]
  },
  Jammer: {
    subject: `Schade, dass es nicht geklappt hat, ${firstName}`,
    title: `Schade, ${firstName}`,
    sections: [
      { heading: null, body: `Schade, dass es diesmal nicht geklappt hat. Wir verstehen, dass das Timing nicht immer passt und respektieren Ihre Entscheidung.` },
      { heading: null, body: `Sollten Sie in Zukunft Interesse haben, sind wir jederzeit offen für ein Gespräch. Viel Erfolg bei allem!<br><br>${signOff('German')}` }
    ]
  }
};

// ---------- FRENCH ----------
templates.French = {
  Onboarding: {
    subject: `Bienvenue chez Ecomtrada, ${firstName} ! Voici vos prochaines étapes`,
    title: `Ravi de vous avoir, ${firstName} !`,
    sections: [
      { heading: null, body: `Merci d'avoir choisi de travailler avec nous ! Nous avons vraiment hâte de commencer pour vous.` },
      { heading: 'Étape 1 : Remplir le formulaire d\'onboarding', body: `Remplissez le formulaire d'onboarding pour que nous puissions commencer à travailler sur votre stratégie immédiatement.` }
    ],
    buttons: [
      { label: '→ Remplir le formulaire', url: 'https://cmcvx25xi7y.typeform.com/to/h8Ugfabb' }
    ],
    sections2: [
      { heading: 'Étape 2 : Finaliser le paiement', body: `Finalisez le paiement pour que nous puissions officiellement démarrer.` }
    ],
    buttons2: [
      { label: '→ Finaliser le paiement', url: 'https://buy.stripe.com/3cI3cv7h1eC79pm6cc0Ny0O' }
    ],
    sections3: [
      { heading: 'Étape 3 : Planifier l\'appel d\'onboarding', body: `Une fois le formulaire et le paiement effectués, planifiez un rendez-vous avec moi pour organiser tous les accès afin que nous puissions nous mettre au travail.` }
    ],
    buttons3: [
      { label: '→ Planifier l\'appel', url: 'https://tidycal.com/lennard/onboarding-call' }
    ],
    closingSections: [
      { heading: null, body: `N'hésitez pas à nous contacter si vous avez besoin de plus d'informations ou de précisions. Merci encore pour votre confiance, nous sommes prêts à accomplir de grandes choses ensemble !<br><br>${signOff('French')}` }
    ]
  },
  Active: {
    subject: `Bienvenue ${firstName} ! Votre compte est maintenant actif`,
    title: `Bienvenue, ${firstName} !`,
    sections: [
      { heading: null, body: `Votre compte est maintenant officiellement actif ! Nous commençons par la phase <strong style="color:${BRAND.accentGold};">Pre-Start</strong> : la phase de préparation où nous mettons tout en place avant que vos campagnes ne soient lancées.` },
      { heading: 'Ce que nous allons faire maintenant', body: `• Élaborer une stratégie basée sur vos objectifs et votre marché<br>• Configurer et mettre en place vos campagnes<br>• Contrôle qualité interne avant la mise en ligne<br><br>Veuillez noter : vos campagnes ne seront lancées qu'en Phase 1, après que tout a été vérifié et approuvé.` },
      { heading: 'Votre roadmap', body: buildRoadmap('French') },
      { heading: null, body: `Vous avez des questions ? N'hésitez pas à nous contacter.<br><br>${signOff('French')}` }
    ]
  },
  Inactive: {
    subject: `Mise à jour du compte : campagnes en pause`,
    title: `Campagnes en pause, ${firstName}`,
    sections: [
      { heading: null, body: `Nous souhaitons vous informer que votre compte a été mis en inactif. Vos campagnes sont actuellement en pause.` },
      { heading: 'Qu\'est-ce que cela signifie ?', body: `Cela peut être dû à une pause saisonnière, une révision budgétaire ou une décision stratégique. La configuration de votre compte et vos données historiques sont entièrement préservées.<br><br>Lorsque vous serez prêt à reprendre, faites-le nous savoir et nous pourrons relancer vos campagnes rapidement.<br><br>${signOff('French')}` }
    ]
  },
  Leaving: {
    subject: `Nous sommes désolés de vous voir partir, ${firstName}`,
    title: `Désolé de vous voir partir, ${firstName}`,
    sections: [
      { heading: null, body: `Nous avons reçu votre demande de fin de collaboration. Nous sommes désolés de vous voir partir.` },
      { heading: 'Prochaines étapes', body: `• Vos campagnes continueront de fonctionner jusqu'à la fin de la période de facturation en cours<br>• Nous préparerons un rapport de performance final<br>• Tous les accès et assets du compte vous seront transférés<br><br>Si nous aurions pu faire quelque chose différemment, nous serions ravis d'avoir votre retour. Et si vous souhaitez reprendre notre collaboration à l'avenir, notre porte est toujours ouverte.<br><br>${signOff('French')}` }
    ]
  },
  Churned: {
    subject: `Résumé final du compte`,
    title: `Compte clôturé, ${firstName}`,
    sections: [
      { heading: null, body: `Votre compte chez Ecomtrada a été clôturé. Nous avons préparé votre facture finale et tous les assets du compte ont été transférés.` },
      { heading: null, body: `Nous vous souhaitons le meilleur pour votre entreprise. Si vous souhaitez retravailler ensemble à l'avenir, n'hésitez pas à nous contacter.<br><br>${signOff('French')}` }
    ]
  },
  Jammer: {
    subject: `Dommage que cela n'ait pas fonctionné, ${firstName}`,
    title: `Dommage, ${firstName}`,
    sections: [
      { heading: null, body: `Dommage que cela n'ait pas fonctionné cette fois-ci. Nous comprenons que le timing n'est pas toujours idéal et respectons pleinement votre décision.` },
      { heading: null, body: `Si vous êtes intéressé à l'avenir, nous sommes toujours ouverts à une conversation. Bonne chance pour tout !<br><br>${signOff('French')}` }
    ]
  }
};

// Determine which template to use
const langTemplates = templates[lang] || templates['Dutch'];
let templateKey = status;

// Special case: Lead/Prospect -> Churned = Jammer email
if (isJammerEmail) {
  templateKey = 'Jammer';
}

const template = langTemplates[templateKey];

if (!template) {
  return {
    json: {
      ...client,
      skipEmail: true,
      reason: `No email template for status: ${status} (from: ${prevStatus})`
    }
  };
}

// Build the branded HTML email
let bodyHtml = '';
bodyHtml += buildHeader();
bodyHtml += buildTitle(template.title);

// Onboarding has a special structure: sections + buttons interleaved
if (template.buttons) {
  for (const section of template.sections) {
    bodyHtml += buildTextSection(section.heading, section.body);
  }
  bodyHtml += buildButtonGroup(template.buttons);
  if (template.sections2) {
    for (const section of template.sections2) {
      bodyHtml += buildTextSection(section.heading, section.body);
    }
  }
  if (template.buttons2) {
    bodyHtml += buildButtonGroup(template.buttons2);
  }
  if (template.sections3) {
    for (const section of template.sections3) {
      bodyHtml += buildTextSection(section.heading, section.body);
    }
  }
  if (template.buttons3) {
    bodyHtml += buildButtonGroup(template.buttons3);
  }
  if (template.closingSections) {
    for (const section of template.closingSections) {
      bodyHtml += buildTextSection(section.heading, section.body);
    }
  }
} else {
  for (const section of template.sections) {
    bodyHtml += buildTextSection(section.heading, section.body);
  }
}
bodyHtml += buildFooter();

return {
  json: {
    ...client,
    skipEmail: false,
    emailSubject: template.subject,
    htmlEmail: wrapEmail(bodyHtml)
  }
};
