import type { Metadata } from "next";
import { getAnnouncements } from "@/lib/api";
import { PageHead } from "@/components/PageHead";
import { AnnouncementsFeed } from "@/components/AnnouncementsFeed";

export const metadata: Metadata = {
  title: "Announcements",
  description:
    "Every announcement from the Youth Commission for Anubhav 2026 — latest first, with diocese-wide notices for all three venues.",
};

// Full list, newest first; diocese-wide (place === null) visually distinguished.
export default async function AnnouncementsPage() {
  let items;
  try {
    items = await getAnnouncements();
  } catch {
    return (
      <div className="bg-bg">
        <PageHead
          kicker="Stay informed"
          title="Announcements"
          sub="Everything from the Youth Commission, latest first."
        />
        <p className="mx-auto max-w-site px-5 pb-20 font-serif text-xl italic text-faint sm:px-8 md:px-12">
          Announcements could not be loaded right now. Please try again shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg">
      <PageHead
        kicker="Stay informed"
        title="Announcements"
        sub="Everything from the Youth Commission, latest first. Diocese-wide notices apply to all three venues."
      />
      <AnnouncementsFeed items={items} />
    </div>
  );
}
