# Maandelijkse Update Email - n8n Workflow Setup

## Workflow structuur

### Nodes (in volgorde):

1. **Schedule Trigger**
   - Type: Schedule
   - Wanneer: 1e van de maand, 09:00 CET
   - Timezone: Europe/Amsterdam

2. **HTTP Request - Google Ads News**
   - URL: https://searchengineland.com/category/google/google-ads/feed
   - Method: GET
   - Haalt recente PPC artikelen op

3. **Claude AI - Generate Content**
   - Model: claude-sonnet-4-6 (of nieuwer)
   - System prompt: zie `n8n-monthly-update-claude-prompt.md`
   - User prompt: "Generate the monthly update for {{currentMonth}} {{currentYear}}. Here are recent Google Ads articles for context: {{newsArticles}}"
   - Output: JSON met googleAdsUpdate, aiTip, holidays

4. **Code Node - Build Email**
   - Code: zie `n8n-monthly-update-email.js`
   - Genereert branded HTML in 4 talen (NL, EN, DE, FR)

5. **Send Email - Approval to Lennard**
   - To: jouw email
   - Subject: "[APPROVAL] Maandelijkse Update {{month}} {{year}}"
   - Body: de gegenereerde email + approve/reject links

6. **Wait - Approval Webhook**
   - Type: Webhook
   - Wacht op jouw goedkeuring via de link in de email

7. **IF - Approved?**
   - Ja: door naar stap 8
   - Nee: stop workflow

8. **Notion - Get Active Clients**
   - Haalt alle actieve klanten op (zelfde als wekelijkse rapportages)
   - Inclusief: naam, email, taal

9. **Loop Over Clients**
   - Voor elke klant:
     - Selecteer juiste taalversie van de email
     - Vervang {{firstName}} placeholder
     - Vervang content placeholders

10. **Send Email - To Client**
    - Verstuurt de gepersonaliseerde email per klant

## Fase 2 (later toe te voegen):

### Extra nodes tussen stap 8 en 9:

- **Google Ads API** - Top 3 producten per klant ophalen
- **Claude AI** - Niche trends zoeken per klant (op basis van branche uit Notion)
- **Code Node** - Extra blokjes toevoegen aan de email template:
  - "Jouw top 3 producten deze maand"
  - "Trending in jouw niche"
