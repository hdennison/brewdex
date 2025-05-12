/**
 * Returns a localized, human-readable relative time string
 * (e.g. "3 days ago", "in 2 hours", or "now") for a given timestamp.
 *
 * @param timestamp  A number (ms or seconds since epoch) or a string (numeric or ISO-8601).
 * @param locale     BCP 47 locale string (default "en").
 * @param options    Intl.RelativeTimeFormat options (default { numeric: "always" }).
 */
export function getRelativeTimeFromNow(
  timestamp: string | number,
  locale = "en",
  options: Intl.RelativeTimeFormatOptions = { numeric: "always" }
): string {
  // Normalize input and detect numeric timestamps
  let t: number;
  let isNumeric = false;

  if (typeof timestamp === "string") {
    const n = Number(timestamp);
    if (!isNaN(n)) {
      t = n;
      isNumeric = true;
    } else {
      t = Date.parse(timestamp);
    }
  } else {
    t = timestamp;
    isNumeric = true;
  }

  // Convert likely-second values (numeric inputs only) into milliseconds
  if (isNumeric && t > 0 && t < 1e11) {
    t *= 1000;
  }

  const now = Date.now();
  const diffMs = t - now;

  // Define time units in descending order
  const divisions: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 1000 * 60 * 60 * 24 * 365],
    ["month", 1000 * 60 * 60 * 24 * 30],
    ["day", 1000 * 60 * 60 * 24],
    ["hour", 1000 * 60 * 60],
    ["minute", 1000 * 60],
    ["second", 1000],
  ];

  const rtf = new Intl.RelativeTimeFormat(locale, options);
  for (const [unit, msPerUnit] of divisions) {
    const amount = diffMs / msPerUnit;
    if (Math.abs(amount) >= 1) {
      return rtf.format(Math.trunc(amount), unit);
    }
  }

  // Fallback for very small differences → "now"
  const rtfAuto = new Intl.RelativeTimeFormat(locale, {
    ...options,
    numeric: "auto",
  });
  return rtfAuto.format(0, "second");
}
