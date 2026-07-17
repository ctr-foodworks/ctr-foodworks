import Script from "next/script";

/**
 * GA4 tag — renders only when NEXT_PUBLIC_GA_MEASUREMENT_ID is set, so the
 * repo ships nothing until a property is provisioned. Loads gtag.js after the
 * page is interactive. The Google Ads tag (AW-…) lives separately in the site
 * layout; both share window.dataLayer, which is the standard multi-tag setup.
 */
export function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!id) return null;

  return (
    <>
      <Script
        id="ga4-js"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
