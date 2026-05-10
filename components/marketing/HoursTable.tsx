import { hours } from "@/lib/hours";

export function HoursTable() {
  return (
    <table className="w-full border-collapse">
      <tbody>
        {hours.map((row) => (
          <tr key={row.days} className="border-b border-white/[0.08]">
            <td
              className={`py-4 text-[14px] font-light ${
                row.emphasis ? "text-[var(--secondary-ochre)]" : "text-white/55"
              }`}
            >
              {row.days}
              {row.emphasis ? " ✦" : ""}
            </td>
            <td
              className={`py-4 text-right text-[14px] ${
                row.emphasis ? "font-medium text-[var(--secondary-ochre)]" : "font-light text-white"
              }`}
            >
              {row.hours}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
