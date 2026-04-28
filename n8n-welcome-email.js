// Generate welcome email for new lead - dark-green Ecomtrada branding
const lead = $('Loop Over Leads').item.json;

const bookingDateUTC = new Date(lead.bookingDate);
const bookingDate = new Date(bookingDateUTC.toLocaleString('en-US', { timeZone: 'Europe/Amsterdam' }));
const dayNames = ['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'];
const monthNames = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
const dayName = dayNames[bookingDate.getDay()];
const day = bookingDate.getDate();
const month = monthNames[bookingDate.getMonth()];
const year = bookingDate.getFullYear();
const hours = bookingDate.getHours().toString().padStart(2,'0');
const minutes = bookingDate.getMinutes().toString().padStart(2,'0');
const formattedDate = dayName + ' ' + day + ' ' + month + ' ' + year + ' om ' + hours + ':' + minutes;
const firstName = lead.name.split(' ')[0];
const callType = lead.leadSource === 'Second Opinion' ? 'second opinion gesprek' : 'kennismakingsgesprek';
const subject = 'Bedankt voor het inplannen van je ' + callType + ', Ecomtrada';

const htmlBody = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>' +
'<body style="margin:0;padding:0;background-color:#0B130F;font-family:sans-serif;">' +
'<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B130F;padding:32px 16px;"><tr><td align="center">' +
'<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">' +
'<tr><td style="padding:0 0 24px 0;"><p style="margin:0;font-size:20px;font-weight:700;color:#fff;">ecomtrada<span style="color:#F9C31F;">.</span></p></td></tr>' +
'<tr><td style="background-color:#162118;border-radius:12px;padding:40px;border:1px solid rgba(31,122,77,0.2);">' +

'<p style="margin:0 0 8px 0;font-size:20px;font-weight:600;color:#F5F4F0;">Welkom, ' + firstName + '!</p>' +
'<p style="margin:0 0 20px 0;font-size:14px;color:#C8D1CC;line-height:1.6;">Leuk dat je een ' + callType + ' hebt ingepland! Ik kijk ernaar uit om met je te spreken.</p>' +

'<div style="background:#1a2b1f;border-radius:8px;padding:16px 20px;margin:0 0 24px 0;border-left:3px solid #F9C31F;">' +
'<p style="margin:0 0 4px 0;font-size:14px;font-weight:600;color:#F9C31F;">📅 Je afspraak</p>' +
'<p style="margin:0;font-size:14px;color:#C8D1CC;">' + formattedDate + '</p></div>' +

'<p style="margin:0 0 12px 0;font-size:16px;font-weight:600;color:#F5F4F0;">Wat kun je verwachten?</p>' +
'<p style="margin:0 0 12px 0;font-size:14px;color:#C8D1CC;line-height:1.6;">Tijdens ons gesprek bespreken we:</p>' +
'<table cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">' +
'<tr><td style="padding:4px 0;font-size:14px;color:#C8D1CC;">• Jouw huidige situatie en doelen</td></tr>' +
'<tr><td style="padding:4px 0;font-size:14px;color:#C8D1CC;">• Hoe Google Ads kan bijdragen aan jullie groei</td></tr>' +
'<tr><td style="padding:4px 0;font-size:14px;color:#C8D1CC;">• Een eerlijk advies of Google Ads bij jullie past</td></tr>' +
'<tr><td style="padding:4px 0;font-size:14px;color:#C8D1CC;">• Concrete volgende stappen als we een match zijn</td></tr></table>' +

'<p style="margin:0 0 12px 0;font-size:16px;font-weight:600;color:#F5F4F0;">Kun je alvast het volgende delen?</p>' +
'<p style="margin:0 0 12px 0;font-size:14px;color:#C8D1CC;line-height:1.6;">Om het meeste uit ons gesprek te halen, zou ik graag vooraf wat informatie ontvangen. Reply gerust op deze email met:</p>' +
'<table cellpadding="0" cellspacing="0" style="margin:0 0 16px 0;">' +
'<tr><td style="padding:4px 0;font-size:14px;color:#C8D1CC;"><strong style="color:#F9C31F;">1.</strong> <strong style="color:#F5F4F0;">Je website URL</strong>, zodat ik alvast kan kijken</td></tr>' +
'<tr><td style="padding:4px 0;font-size:14px;color:#C8D1CC;"><strong style="color:#F9C31F;">2.</strong> <strong style="color:#F5F4F0;">Je maandelijkse advertentiebudget</strong>, een indicatie is prima</td></tr>' +
'<tr><td style="padding:4px 0;font-size:14px;color:#C8D1CC;"><strong style="color:#F9C31F;">3.</strong> <strong style="color:#F5F4F0;">Gebruik je al Google Ads?</strong> Zo ja, sinds wanneer?</td></tr>' +
'<tr><td style="padding:4px 0;font-size:14px;color:#C8D1CC;"><strong style="color:#F9C31F;">4.</strong> <strong style="color:#F5F4F0;">Je belangrijkste doel</strong>, meer omzet, traffic, ROAS, etc.</td></tr></table>' +
'<p style="margin:0 0 28px 0;font-size:13px;color:#5A6B60;">Geen zorgen als je dit niet allemaal paraat hebt, we komen er in het gesprek ook wel uit.</p>' +

'<p style="margin:0 0 4px 0;font-size:14px;color:#C8D1CC;">Tot ' + dayName + '!</p>' +
'<p style="margin:0 0 2px 0;font-size:14px;font-weight:600;color:#F5F4F0;">Lennard Steeman</p>' +
'<p style="margin:0;font-size:12px;color:#5A6B60;">Ecomtrada Google Ads Bureau</p>' +

'</td></tr>' +
'<tr><td style="padding:24px 0 0 0;text-align:center;">' +
'<p style="margin:0 0 8px 0;font-size:12px;color:#5A6B60;">ecomtrada<span style="color:#F9C31F;">.</span> Google Ads Bureau</p>' +
'<p style="margin:0;font-size:11px;color:#3A4B40;"><a href="https://ecomtrada.nl" style="color:#3A4B40;text-decoration:none;">ecomtrada.nl</a></p>' +
'</td></tr></table></td></tr></table></body></html>';

return [{ json: { email: lead.email, name: lead.name, firstName, subject, htmlBody, callType, bookingDate: lead.bookingDate } }];
