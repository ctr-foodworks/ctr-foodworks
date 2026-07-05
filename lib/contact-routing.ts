/**
 * Category → destination inbox (env-configured). Shared by the contact form
 * (initial send) and the inbound relay (looping a customer's reply back to the
 * same team) so both always target the same mailbox.
 *
 * Press goes to PR; every other category falls back to CONTACT_TO_GENERAL
 * unless it has its own override.
 */
export function routeFor(
  category: string | null | undefined,
): string | undefined {
  const general = process.env.CONTACT_TO_GENERAL;
  switch (category) {
    case "Press":
      return process.env.CONTACT_TO_PRESS ?? general;
    case "Partnerships":
      return process.env.CONTACT_TO_PARTNERSHIPS ?? general;
    case "Careers":
      return process.env.CONTACT_TO_CAREERS ?? general;
    default:
      return general;
  }
}
