interface ExperienceItemProps {
  title: string;
  date: {
    created: string;
    updated: string | "current";
  };
}

const Seperator = () => <div className="border-border border-t" />;

export const ExperienceItem = ({ title, date }: ExperienceItemProps) => {
  return (
    <div className="flex w-full justify-between py-2">
      <p>{title}</p>
      <p className="mt-0 text-muted">
        {date.created} - {date.updated}
      </p>
    </div>
  );
};

export const Experiences = () => {
  return (
    <div>
      <h2 className="mt-6 py-2 text-muted capitalize">Experience</h2>
      <Seperator />
      <ExperienceItem title="Apartool" date={{ created: "Aug 2023", updated: "Present" }} />
      <Seperator />
      <ExperienceItem title="Freelance" date={{ created: "Jan 2023", updated: "Mar 2023" }} />
      <Seperator />
      <ExperienceItem title="2Shapes Technologies SLU" date={{ created: "Dec 2017", updated: "Dec 2022" }} />
    </div>
  );
};
