/**
 * Renders a JSON-LD <script> for structured data. Server component.
 *
 * Serialized with JSON.stringify and the `<` escaped to < so the payload
 * can never break out of the <script> element (XSS-safe) even if a data field
 * ever contains markup.
 */
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
