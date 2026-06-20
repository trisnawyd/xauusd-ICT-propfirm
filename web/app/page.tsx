import { CalendarView } from "@/components/calendar-view";
import { CalendarHighlights } from "@/components/calendar-highlights";
import { getCalendarDays, getCalendarHighlights } from "@/lib/calendar";

export const dynamic = "force-static";

export default function CalendarPage() {
  const days = [...getCalendarDays().values()];
  const highlights = getCalendarHighlights();

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
        <p className="text-sm text-muted-foreground">
          Daily bias, LTF analyses, trades and news at a glance.
        </p>
      </header>

      <CalendarHighlights data={highlights} />
      <CalendarView days={days} />
    </div>
  );
}
