import useStore from "@/hooks/useStore";

function timeToVh(hours, minutes) {
  if (!minutes) minutes = 0;
  return 7.5 * (hours + minutes / 60);
}

function hasOverlap(day, class1, class2) {
  return (
    class1.day.includes(day) &&
    class2.day.includes(day) &&
    class1.time[0] <= class2.time[1] &&
    class2.time[0] <= class1.time[0]
  );
}

export default function Schedule() {
  const selectedSections = useStore((state) => state.selectedSections);
  const term = useStore((state) => state.term);

  let colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "teal",
    "sky",
    "indigo",
    "purple",
    "pink",
  ];

  let first = selectedSections.reduce(
    (acc, section) =>
      section.time[0].hour() < acc ? section.time[0].hour() : acc,
    8,
  );
  let last = selectedSections.reduce(
    (acc, section) =>
      section.time[1].hour() > acc ? section.time[1].hour() : acc,
    13,
  );

  let hours = [];

  for (let i = first; i <= last; i++) {
    hours.push(
      <div className="hourbox" style={{ top: `${timeToVh(i - first)}vh` }}>
        <div>{i == 12 ? 12 : i % 12}</div>
      </div>,
    );
  }

  return (
    <div className="w-full text-sm">
      <table className="w-full text-center">
        <tbody>
          <tr>
            <td className="w-[5%]">&nbsp;</td>
            <td className="w-day">Monday</td>
            <td className="w-day">Tuesday</td>
            <td className="w-day">Wednesday</td>
            <td className="w-day">Thursday</td>
            <td className="w-day">Friday</td>
          </tr>
        </tbody>
      </table>
      <div
        className="flex-auto w-full relative border border-t-0 text-xs"
        style={{ height: `${timeToVh(hours.length)}vh` }}
      >
        {hours}
        {["M", "T", "W", "R", "F"].map((day) => (
          <div
            key={day}
            className={`daybox left-${day}`}
            style={{ height: `${timeToVh(hours.length)}vh` }}
          >
            {selectedSections
              .filter((section) => section.day.includes(day))
              .map((section) => {
                let overlaps = selectedSections.filter((s) =>
                  hasOverlap(day, section, s),
                );

                return (
                  <a
                    key={day + section.section + section.dept + section.num}
                    href={`https://sa.ucla.edu/ro/ClassSearch/Results?t=${term}&subj=${section.dept}&catlg=${section.catlg}`}
                    target="_blank"
                    className={`absolute ${
                      overlaps.length == 1 ? "w-full" : "w-1/" + overlaps.length
                    } ${
                      overlaps.length == 1
                        ? ""
                        : `left-${overlaps.indexOf(section)}/${overlaps.length}`
                    } py-1 bg-${
                      colors[selectedSections.indexOf(section)]
                    }-200 text-center border-double border-${
                      colors[selectedSections.indexOf(section)]
                    }-600 border-4`}
                    style={{
                      height: `${timeToVh(
                        section.time[1].hour() - section.time[0].hour(),
                        section.time[1].minute() - section.time[0].minute(),
                      )}vh`,
                      top: `${timeToVh(
                        section.time[0].hour() - 8,
                        section.time[0].minute(),
                      )}vh`,
                    }}
                  >
                    {section.dept} {section.num}
                    <br />
                    {section.section}
                  </a>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}
