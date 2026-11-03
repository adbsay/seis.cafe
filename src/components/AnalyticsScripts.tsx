import Script from "next/script";

const SAFE_ID = /^[A-Za-z0-9-]+$/;
const ga = process.env.NEXT_PUBLIC_GA4_ID;
const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/** Memuat GA4 dan Meta Pixel hanya jika ID-nya diisi di env. */
export function AnalyticsScripts() {
  const gaId = ga && SAFE_ID.test(ga) ? ga : null;
  const pixelId = pixel && SAFE_ID.test(pixel) ? pixel : null;
  return (
    <>
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}
      {pixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
