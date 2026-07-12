// Global typing for the Google tag (gtag.js) loaded in the (site) layout.
export {};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
