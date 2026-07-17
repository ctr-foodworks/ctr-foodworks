# CTR Food Works — Local SEO Playbook (Wave 4)

The code changes (waves 0–3) are done. This is the operational, off-site work in
Google/other accounts. Do 1 and 2 first — they unlock the reporting for everything
else.

Canonical facts to use **identically everywhere**:

| Field | Value |
|---|---|
| Name | CTR Food Works |
| Address | 190 Marietta St NW, Atlanta, GA 30303 |
| Location | The former CNN Center, Centennial Park District, Downtown Atlanta |
| Phone | **Needed — see #3.** No public phone exists yet |
| Website | https://www.ctrfoodworks.com |
| Instagram | https://www.instagram.com/ctrfoodworks/ |
| Facebook | **Needed — see #4.** Current site link is a placeholder |
| Category | Food hall / American restaurant / Bar |
| Price | $$ |

Proximity to lean on (all truthful, short walk): Mercedes-Benz Stadium, State Farm
Arena, Georgia Aquarium, Georgia World Congress Center, Centennial Olympic Park.

---

## 1. Activate analytics (env vars)

Set in **Vercel → Settings → Environment Variables** (Production) and redeploy:

1. `NEXT_PUBLIC_GSC_VERIFICATION` — Search Console HTML-tag `content` value.
2. `NEXT_PUBLIC_GA_MEASUREMENT_ID` — GA4 ID (`G-XXXXXXXXXX`).

You're already running **Google Ads** — link the Ads account to GA4 and to Search
Console so paid + organic report together. The new canonical tags now stop your
`gclid`/`utm` ad-click URLs from being indexed as duplicates.

## 2. Google Search Console

1. Add `https://www.ctrfoodworks.com` (Domain property preferred; else URL-prefix +
   the tag from #1). The canonical host is **www** — verify that property, not apex.
2. Submit `https://www.ctrfoodworks.com/sitemap.xml`.
3. Request indexing for the homepage, `/food-and-drinks`, `/events`, `/visit`,
   `/about`, `/private-events`, and each `/food-and-drinks/...` vendor page.
4. The "Opening Spring 2026" copy is gone from the code — once Google recrawls, the
   stale "not open yet" snippets clear. Requesting indexing speeds that up.
5. Confirm apex → www redirects resolve in one hop (Vercel domain settings).

## 3. Get a public phone number

NAP is currently name + address only. A local phone number is a real local-ranking
signal and a required GBP field. Get one (a tracking/Google Voice number is fine),
then add it to: the site footer/Visit page, the JSON-LD (`lib/business.ts`
`BUSINESS.telephone`), GBP, and every citation — identically.

## 4. Create a real Facebook page

The footer/Connect Facebook link points at facebook.com's homepage (a placeholder).
Create an actual CTR Food Works business page, then (a) update the link in the repo
and (b) add the URL to `sameAs` in `lib/business.ts`. Until it's real, it's better
left out than pointing at a placeholder.

## 5. Google Business Profile (biggest local win)

Claim/create at business.google.com; complete every field:

- **Name:** CTR Food Works (no extra keywords).
- **Primary category:** Food hall; secondary: American restaurant, Bar, Event venue.
- **Address / pin:** 190 Marietta St NW, Atlanta, GA 30303 — pin the real entrance
  in the former CNN Center.
- **Hours** (confirm current), **phone** (#3), **website** (www URL).
- **Attributes:** full bar, outdoor/indoor seating, wheelchair accessible, good for
  groups, live sports/events — whatever is true.
- **Description:** lead with "CTR Food Works is a food hall and bar in the former CNN
  Center in Downtown Atlanta's Centennial Park District, steps from Mercedes-Benz
  Stadium and State Farm Arena." Work in food hall, downtown Atlanta, the vendor
  cuisines, and the bar.
- **Products:** each vendor kitchen with its (now unique) description.
- **Photos:** exterior/atrium, the bar, each vendor, events. Replace renders with
  real photos as they come.
- **Google Posts:** events and game-day specials weekly.

## 6. Citations (consistent NAP)

Paste the exact NAP everywhere: Yelp, Apple Business Connect, Bing Places, Facebook,
TripAdvisor, The Infatuation Atlanta, plus downtown/tourism directories (Atlanta.net /
ACVB, Discover Atlanta, Centennial Park District / stadium-area visitor guides). Keep
"190 Marietta St NW" and "St NW" formatting identical everywhere.

**Brand disambiguation:** always use the full "CTR Food Works." Generic "food works"
queries are fragmented with sibling **Chattahoochee Food Works** and the parent
**The Center**; the full name + the CNN Center / downtown location is how you own your
own SERP.

## 7. Press & "best food halls in Atlanta" listicles

Pitch to be added to the roundups that own these queries — your CNN Center location
and stadium proximity are the hook. Targets: Eater Atlanta, Atlanta Magazine, AJC
dining, Creative Loafing, Secret Atlanta, Atlanta Eats, What Now Atlanta, Access
Atlanta, plus downtown/tourism and game-day guides.

Draft pitch (personalize the outlet; send from a real address, no mass-BCC):

> Subject: Food hall in the former CNN Center — CTR Food Works, downtown Atlanta
>
> Hi [name], CTR Food Works is open in the former CNN Center in Downtown Atlanta's
> Centennial Park District — a food hall and bar a short walk from Mercedes-Benz
> Stadium, State Farm Arena, and the Georgia Aquarium. [X] independent kitchens plus
> a large bar, built for game days and downtown crowds. Happy to host a visit or send
> photos, vendor list, and our events calendar. — [name], [phone]

## 8. Reviews

Ask guests for Google reviews from day one (QR on tables/receipts → GBP review link);
respond to all of them, working in "CTR Food Works" and the downtown/CNN Center
location naturally.

## 9. Ongoing (monthly)

- Search Console Performance review; request indexing for new event/vendor pages.
- Keep hours accurate across site + GBP + listings.
- GBP Posts for events/game days; keep the on-site events calendar current (past
  events now auto-drop).
- Swap renders for real photography as it arrives.
