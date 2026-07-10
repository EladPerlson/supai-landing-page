# SUPAI — דף נחיתה

דף נחיתה שיווקי בעברית (RTL) לתוסף Shopify **SUPAI** — שירות לקוחות AI שמחבר חנויות Shopify ל-WhatsApp Business.

## מה כלול

- `index.html` — כל תוכן הדף (11 סקשנים)
- `styles.css` — עיצוב SaaS מודרני, רספונסיבי
- `script.js` — אקורדיון FAQ, תפריט מובייל, אנימציות גלילה והקלדה

## פתיחה מקומית

פתחו את `index.html` ישירות בדפדפן, או הריצו שרת מקומי:

```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .
```

ואז גלשו ל-`http://localhost:8080`.

## פריסה

הדף הוא אתר סטטי ללא תלויות build. אפשר לפרוס בכל שירות אחסון סטטי:

- **Netlify** — גררו את התיקייה ל-[app.netlify.com/drop](https://app.netlify.com/drop)
- **Vercel** — `vercel --prod`
- **GitHub Pages** — העלו את הקבצים ל-repo והפעילו Pages
- **Cloudflare Pages** — חברו את ה-repo או העלו ישירות

## התאמות

### קישור Shopify App Store

החליפו את כל הקישורים `href="#"` בכפתורי ה-CTA בקישור האמיתי לדף התוסף ב-Shopify App Store.

### מחירים

המחירים בדף הם placeholder ($19 / $49 / $99). עדכנו אותם ב-`index.html` בסקשן `#pricing`.

## מבנה הסקשנים

1. Hero — כותרת, CTA, מוקאפ WhatsApp
2. הבעיה — שאלות חוזרות של לקוחות
3. הפתרון — SUPAI + דיאגרמת חיבור
4. פיצ'רים — 8 כרטיסיות
5. איך זה עובד — 3 שלבים
6. יתרונות — 6 יתרונות עסקיים
7. דוגמת שיחה — מוקאפ WhatsApp מלא
8. תמחור — Starter / Growth / Pro
9. FAQ — 6 שאלות נפוצות
10. CTA סופי
11. Footer

## רישיון

© 2026 SUPAI. כל הזכויות שמורות.
