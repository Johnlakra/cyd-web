// Static site identity + navigation. Event DATA (venues, announcements, stats,
// timetable, speakers) comes from the backend; this is just chrome + copy.
export const SITE = {
  name: "Anubhav",
  year: "2026",
  tagline: "Retreat for Youth",
  org: "Diocese of Jalandhar",
  commission: "Youth Commission",
  fee: "₹50",
  arrival: "4:00 PM",
  departure: "11:00 AM",
  email: "",
  phone: "+91 78888 38246",
  phoneHref: "+917888838246",
  address: "Bishop's House, Civil Lines, Jalandhar City",
  director: "Fr. Jibin Kumbalathan",
  directorTitle: "Youth Director",
  // Theme of the retreat — Jn 14:6, quoted in the invitation letter.
  themeVerse: "I am the Way, and the Truth, and the Life.",
  themeRef: "John 14:6",
  // Eligibility window (years).
  ageMin: 14,
  ageMax: 30,
  perParishMax: 15,
  credit: "Powered by Softech Smart Solutions",
  creditUrl: "www.softechsmartsolutions.in",
} as const;

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Timetable", href: "/timetable" },
  { label: "Info", href: "/info" },
  { label: "Announcements", href: "/announcements" },
  { label: "Speakers", href: "/speakers" },
  { label: "Stats", href: "/stats" },
] as const;
