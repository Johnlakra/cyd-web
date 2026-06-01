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
  email: "youth@dioceseofjalandhar.in",
  credit: "Powered by Softech Smart Solutions",
  creditUrl: "www.softechsmartsolutions.in",
} as const;

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Timetable", href: "/timetable" },
  { label: "Announcements", href: "/announcements" },
  { label: "Speakers", href: "/speakers" },
  { label: "Stats", href: "/stats" },
] as const;
