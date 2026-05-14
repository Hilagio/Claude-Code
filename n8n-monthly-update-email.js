// Monthly Update Email - Code Node
// Generates branded Ecomtrada monthly update email
// Input: content from Claude node (googleAdsUpdate, aiTip, holidays)
// Sends to Lennard for approval before distributing to clients

const input = $input.item.json;

const monthNames = {
  Dutch: ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'],
  English: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  German: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
  French: ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
};

const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Amsterdam' }));
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

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
  fontBody: "'DM Sans', Helvetica, Arial, sans-serif"
};

function getMonthName(lang) {
  const names = monthNames[lang] || monthNames['Dutch'];
  return names[currentMonth];
}

function buildEmail(lang) {
  const month = getMonthName(lang);
  const labels = {
    Dutch: {
      subject: `Ecomtrada Update ${month} ${currentYear}`,
      greeting: 'Hoi',
      intro: `Hier is je maandelijkse update met het laatste nieuws dat relevant is voor jouw campagnes. Kort, bondig en to the point.`,
      adsTitle: '📢 Google Ads Update',
      aiTitle: '🤖 AI & Advertising',
      holidaysTitle: '📅 Aankomende feestdagen',
      closing: 'Wij houden het in de gaten, zodat jij dat niet hoeft.',
      signOff: `Met vriendelijke groet,<br><strong style="color:${BRAND.textPrimary};">Lennard Steeman</strong><br>Ecomtrada`
    },
    English: {
      subject: `Ecomtrada Update ${month} ${currentYear}`,
      greeting: 'Hi',
      intro: `Here is your monthly update with the latest news relevant to your campaigns. Short, concise and to the point.`,
      adsTitle: '📢 Google Ads Update',
      aiTitle: '🤖 AI & Advertising',
      holidaysTitle: '📅 Upcoming Holidays',
      closing: 'We keep an eye on things, so you don\'t have to.',
      signOff: `Best regards,<br><strong style="color:${BRAND.textPrimary};">Lennard Steeman</strong><br>Ecomtrada`
    },
    German: {
      subject: `Ecomtrada Update ${month} ${currentYear}`,
      greeting: 'Hallo',
      intro: `Hier ist dein monatliches Update mit den neuesten Nachrichten, die für deine Kampagnen relevant sind. Kurz, knapp und auf den Punkt.`,
      adsTitle: '📢 Google Ads Update',
      aiTitle: '🤖 KI & Werbung',
      holidaysTitle: '📅 Kommende Feiertage',
      closing: 'Wir behalten alles im Blick, damit du es nicht musst.',
      signOff: `Mit freundlichen Grüßen,<br><strong style="color:${BRAND.textPrimary};">Lennard Steeman</strong><br>Ecomtrada`
    },
    French: {
      subject: `Ecomtrada Update ${month} ${currentYear}`,
      greeting: 'Bonjour',
      intro: `Voici votre mise à jour mensuelle avec les dernières nouvelles pertinentes pour vos campagnes. Court, concis et droit au but.`,
      adsTitle: '📢 Google Ads Update',
      aiTitle: '🤖 IA & Publicité',
      holidaysTitle: '📅 Jours fériés à venir',
      closing: 'Nous gardons un œil sur tout, pour que vous n\'ayez pas à le faire.',
      signOff: `Cordialement,<br><strong style="color:${BRAND.textPrimary};">Lennard Steeman</strong><br>Ecomtrada`
    }
  };

  const l = labels[lang] || labels['Dutch'];

  const html = `<!DOCTYPE html><html lang="${lang === 'Dutch' ? 'nl' : lang === 'German' ? 'de' : lang === 'French' ? 'fr' : 'en'}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=DM+Sans:wght@400;500;700&display=swap');</style></head>
<body style="margin:0; padding:0; background-color:${BRAND.bg};">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};">
<tr><td align="center" style="padding:0 16px;">
<table width="${BRAND.maxWidth}" cellpadding="0" cellspacing="0" style="max-width:${BRAND.maxWidth}px; width:100%;">

<!-- Logo -->
<tr><td style="padding:32px 0 24px 0; text-align:center;">
<span style="font-family:${BRAND.fontHeading}; font-size:28px; font-weight:700; color:${BRAND.textPrimary}; letter-spacing:-0.5px;">ecomtrada<span style="color:${BRAND.accentGold};">.</span></span>
</td></tr>

<!-- Title -->
<tr><td style="padding:0 0 8px 0;">
<h1 style="margin:0; font-family:${BRAND.fontHeading}; font-size:22px; font-weight:700; color:${BRAND.textPrimary}; line-height:1.3;">${l.subject}</h1>
</td></tr>

<!-- Intro -->
<tr><td style="padding:16px 0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.cardBg}; border:1px solid ${BRAND.border}; border-radius:${BRAND.borderRadius};">
<tr><td style="padding:24px;">
<p style="margin:0; font-family:${BRAND.fontBody}; font-size:14px; color:${BRAND.textSecondary}; line-height:1.6;">${l.greeting} {{firstName}},<br><br>${l.intro}</p>
</td></tr></table>
</td></tr>

<!-- Google Ads Update -->
<tr><td style="padding:8px 0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.cardBg}; border:1px solid ${BRAND.border}; border-radius:${BRAND.borderRadius};">
<tr><td style="padding:24px;">
<h2 style="margin:0 0 12px 0; font-family:${BRAND.fontHeading}; font-size:16px; font-weight:700; color:${BRAND.textPrimary};">${l.adsTitle}</h2>
<p style="margin:0; font-family:${BRAND.fontBody}; font-size:14px; color:${BRAND.textSecondary}; line-height:1.6;">{{googleAdsUpdate}}</p>
</td></tr></table>
</td></tr>

<!-- AI Tip -->
<tr><td style="padding:8px 0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.cardBg}; border:1px solid ${BRAND.border}; border-radius:${BRAND.borderRadius};">
<tr><td style="padding:24px;">
<h2 style="margin:0 0 12px 0; font-family:${BRAND.fontHeading}; font-size:16px; font-weight:700; color:${BRAND.textPrimary};">${l.aiTitle}</h2>
<p style="margin:0; font-family:${BRAND.fontBody}; font-size:14px; color:${BRAND.textSecondary}; line-height:1.6;">{{aiTip}}</p>
</td></tr></table>
</td></tr>

<!-- Holidays -->
<tr><td style="padding:8px 0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.cardBg}; border:1px solid ${BRAND.border}; border-radius:${BRAND.borderRadius}; border-left:3px solid ${BRAND.accentGold};">
<tr><td style="padding:24px;">
<h2 style="margin:0 0 12px 0; font-family:${BRAND.fontHeading}; font-size:16px; font-weight:700; color:${BRAND.accentGold};">${l.holidaysTitle}</h2>
<p style="margin:0; font-family:${BRAND.fontBody}; font-size:14px; color:${BRAND.textSecondary}; line-height:1.6;">{{holidays}}</p>
</td></tr></table>
</td></tr>

<!-- Closing -->
<tr><td style="padding:16px 0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.cardBg}; border:1px solid ${BRAND.border}; border-radius:${BRAND.borderRadius};">
<tr><td style="padding:24px;">
<p style="margin:0; font-family:${BRAND.fontBody}; font-size:14px; color:${BRAND.textSecondary}; line-height:1.6;"><em>${l.closing}</em><br><br>${l.signOff}</p>
</td></tr></table>
</td></tr>

<!-- Footer -->
<tr><td style="padding:32px 0 16px 0; text-align:center;">
<p style="margin:0 0 4px 0; font-family:${BRAND.fontBody}; font-size:12px; color:${BRAND.textMuted};">ecomtrada<span style="color:${BRAND.accentGold}">.</span> Google Ads Agency for E-commerce</p>
<p style="margin:0; font-family:${BRAND.fontBody}; font-size:11px; color:${BRAND.textMuted};"><a href="https://ecomtrada.nl" style="color:${BRAND.textMuted}; text-decoration:none;">ecomtrada.nl</a></p>
</td></tr>

</table></td></tr></table></body></html>`;

  return { subject: l.subject, html };
}

// Generate all 4 language versions
const languages = ['Dutch', 'English', 'German', 'French'];
const emailVersions = {};
for (const lang of languages) {
  emailVersions[lang] = buildEmail(lang);
}

return {
  json: {
    emailVersions,
    month: getMonthName('English'),
    year: currentYear,
    googleAdsUpdate: input.googleAdsUpdate || '',
    aiTip: input.aiTip || '',
    holidays: input.holidays || '',
    approvalRequired: true
  }
};
