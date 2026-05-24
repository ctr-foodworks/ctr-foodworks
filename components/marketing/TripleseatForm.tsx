"use client";

import { useEffect, useRef } from "react";

/**
 * Embeds the Tripleseat private-event lead form on the page.
 *
 * Tripleseat's script (`ts_script.js`) auto-injects the form HTML into the
 * surrounding DOM when it loads. Because Next.js's <Script> component
 * doesn't guarantee placement order relative to JSX, we mount the script
 * imperatively from a ref so it lands inside our styled container.
 *
 * Form ID `2845`, public key from the Tripleseat dashboard (Valerie sent
 * the snippet on 2026-05-23). Lives at:
 *   https://ctrfoodworks.tripleseat.com/dynamic_party_request/2845
 */
const TRIPLESEAT_SRC =
  "https://api.tripleseat.com/ts/dynamic_leads/ts_script.js?dynamic_lead_form_id=2845&public_key=acf573bcd87cf882c1b999de864ae5a177bb7c06";

export function TripleseatForm() {
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;
    // Guard against re-injection on fast-refresh / strict-mode double-mount
    if (slot.querySelector('script[data-tripleseat="true"]')) return;

    const script = document.createElement("script");
    script.src = TRIPLESEAT_SRC;
    script.async = true;
    script.dataset.tripleseat = "true";
    slot.appendChild(script);
  }, []);

  return (
    <div className="ts-form w-full">
      {/* Tripleseat injects the form right where the script tag is appended */}
      <div ref={slotRef} className="ts-form-slot" />
      <a
        id="tripleseat_link"
        href="https://www.tripleseat.com"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block text-[9px] font-semibold tracking-[3px] uppercase text-[var(--text-muted-dark)] hover:text-[var(--primary)]"
      >
        Private Event Software powered by Tripleseat
      </a>
    </div>
  );
}
