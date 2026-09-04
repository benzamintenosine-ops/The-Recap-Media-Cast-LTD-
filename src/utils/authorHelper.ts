/**
 * Author / Reporter name formatting helper
 * - Strips unwanted extensions like (প্রতিবেদক), (লেখক), | স্টাফ রিপোর্টার, etc.
 * - Formats as "নাম, জেলা" (e.g. "মঈন খান, কক্সবাজার") if district is available.
 */
export function formatReporterName(rawAuthor?: string, district?: string): string {
  if (!rawAuthor) return 'প্রতিবেদক';

  // Strip unwanted extensions
  let cleaned = rawAuthor
    .replace(/\s*\(প্রতিবেদক\)/gi, '')
    .replace(/\s*\(লেখক\)/gi, '')
    .replace(/\s*\|\s*স্টাফ রিপোর্টার/gi, '')
    .replace(/\s*\|\s*বিশেষ প্রতিনিধি/gi, '')
    .replace(/\s*\|\s*ব্যুরো প্রধান/gi, '')
    .trim();

  // If district is provided, format as "নাম, জেলা"
  if (district && district.trim()) {
    const cleanDistrict = district.trim();
    // Only append if not already part of the name
    if (!cleaned.includes(cleanDistrict)) {
      cleaned = `${cleaned}, ${cleanDistrict}`;
    }
  }

  return cleaned || 'প্রতিবেদক';
}
