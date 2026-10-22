type ContributionLevel =
  | 'NONE'
  | 'FIRST_QUARTILE'
  | 'SECOND_QUARTILE'
  | 'THIRD_QUARTILE'
  | 'FOURTH_QUARTILE';

type ContributionDay = {
  contributionCount: number;
  contributionLevel: ContributionLevel;
  date: string;
  weekday: number;
};

type ContributionWeek = {
  contributionDays: ContributionDay[];
};

type ContributionCalendar = {
  totalContributions: number;
  weeks: ContributionWeek[];
};

type PublicContributionResponse = {
  total?: {
    lastYear?: number;
  };
  contributions?: {
    date: string;
    count: number;
    level: number;
  }[];
};

const username = 'omavashia2005';

const contributionColors: Record<ContributionLevel, string> = {
  NONE: 'var(--hm-0)',
  FIRST_QUARTILE: 'var(--hm-1)',
  SECOND_QUARTILE: 'var(--hm-2)',
  THIRD_QUARTILE: 'var(--hm-3)',
  FOURTH_QUARTILE: 'var(--hm-4)',
};

const weekdays = [0, 1, 2, 3, 4, 5, 6];

async function getPublicCalendar(): Promise<ContributionCalendar | null> {
  try {
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      {
        headers: {
          Accept: 'application/json',
        },
        // refreshed every 2h
        next: { revalidate: 7200 },
      },
    );

    if (!response.ok) {
      console.error('Public contribution API failed', response.status);
      return null;
    }

    const json = (await response.json()) as PublicContributionResponse;

    if (
      typeof json.total?.lastYear !== 'number' ||
      !Array.isArray(json.contributions)
    ) {
      console.error('Public contribution API returned an invalid response');
      return null;
    }

    const levelNames: ContributionLevel[] = [
      'NONE',
      'FIRST_QUARTILE',
      'SECOND_QUARTILE',
      'THIRD_QUARTILE',
      'FOURTH_QUARTILE',
    ];
    const weeks = new Map<string, ContributionDay[]>();

    for (const contribution of json.contributions) {
      const contributionLevel = levelNames[contribution.level];

      if (!contributionLevel) {
        continue;
      }

      const dayDate = new Date(`${contribution.date}T00:00:00.000Z`);
      const weekday = dayDate.getUTCDay();
      const weekStart = new Date(dayDate);
      weekStart.setUTCDate(dayDate.getUTCDate() - weekday);
      const weekKey = weekStart.toISOString().slice(0, 10);
      const days = weeks.get(weekKey) ?? [];

      days.push({
        contributionCount: contribution.count,
        contributionLevel,
        date: contribution.date,
        weekday,
      });
      weeks.set(weekKey, days);
    }

    if (weeks.size === 0) {
      return null;
    }

    return {
      totalContributions: json.total.lastYear,
      weeks: [...weeks.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, contributionDays]) => ({
          contributionDays: contributionDays.sort((a, b) => a.weekday - b.weekday),
        })),
    };
  } catch (error) {
    console.error('Public contribution API request failed', error);
    return null;
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00.000Z`));
}

export default async function GitHubContributions() {
  const calendar = await getPublicCalendar();

  if (!calendar) {
    return null;
  }

  return (
    <section
      className="mt-12 w-full md:-ml-[calc(250px+4rem)] md:mt-16 md:w-[calc(100%+250px+4rem)] lg:-ml-[calc(280px+6rem)] lg:w-[calc(100%+280px+6rem)]"
      aria-labelledby="github-contributions-title"
    >
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2
          id="github-contributions-title"
          className="font-body text-[0.6rem] tracking-[0.24em] text-(--c-777) uppercase"
        >
          GitHub
        </h2>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-[0.58rem] tracking-[0.03em] text-(--c-666) transition-colors duration-200 hover:text-(--c-fg)/60"
        >
          {calendar.totalContributions.toLocaleString()} contributions
        </a>
      </div>

      <div
        className="grid grid-flow-col auto-cols-fr gap-[2px]"
        role="img"
        aria-label={`${calendar.totalContributions.toLocaleString()} GitHub contributions in the last year`}
      >
        {calendar.weeks.map((week, weekIndex) => (
          <div
            key={`${weekIndex}-${week.contributionDays[0]?.date ?? 'empty'}`}
            // last ~6 months on phones so the cells stay a readable size
            className={`grid gap-[2px] ${weekIndex < calendar.weeks.length - 26 ? 'hidden md:grid' : ''}`}
            style={{ gridTemplateRows: 'repeat(7, minmax(0, 1fr))' }}
          >
            {weekdays.map((weekday) => {
              const day = week.contributionDays.find((item) => item.weekday === weekday);

              if (!day) {
                return <span key={weekday} aria-hidden="true" className="aspect-square" />;
              }

              return (
                <span
                  key={day.date}
                  title={`${day.contributionCount} contributions on ${formatDate(day.date)}`}
                  aria-label={`${day.contributionCount} contributions on ${formatDate(day.date)}`}
                  className="aspect-square rounded-[1px]"
                  style={{ backgroundColor: contributionColors[day.contributionLevel] }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
