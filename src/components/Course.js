import { useState } from "react";
import * as $ from "jquery";
import moment from "moment";
import useStore from "@/hooks/useStore";

export default function Course({ course }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const term = useStore((state) => state.term);
  const selectSection = useStore((state) => state.selectSection);
  const deselectSection = useStore((state) => state.deselectSection);

  async function showDetails() {
    if (sections.length != 0) {
      setVisible(!visible);
      return;
    }

    setLoading(true);
    setVisible(!visible);

    let data = await $.ajax({
      type: "POST",
      url: "/api/cors",
      data: {
        url:
          "https://sa.ucla.edu/ro/public/soc/Results/GetCourseSummary?model=" +
          encodeURIComponent(
            `{"Term":"${term}","SubjectAreaCode":"${
              course.dept
            }","CatalogNumber":"${
              course.catlg
            }","IsRoot":true,"SessionGroup":"%","ClassNumber":"%","SequenceNumber":null,"Path":"${(
              course.dept + course.catlg
            ).replace(" ", "")}"}`,
          ) +
          "&FilterFlags=" +
          encodeURIComponent(
            `{"enrollment_status":"O,W,C,X,T,S","advanced":"y","meet_days":"M,T,W,R,F","start_time":"8:00 am","end_time":"8:00 pm","meet_locations":null,"meet_units":null,"instructor":null,"class_career":null,"impacted":null,"enrollment_restrictions":null,"enforced_requisites":null,"individual_studies":null,"summer_session":null}`,
          ),
      },
    });

    setSections(
      $(data)
        .find(
          `[id='${(course.dept + course.catlg).replace(
            " ",
            "",
          )}-children'] > div`,
        )
        .toArray()
        .map((e) => $(e))
        .map((e) => {
          console.log(typeof e.find(".timeColumn p").last().text().trim());
          return {
            section: e.find(".sectionColumn a").text().trim(),
            day: e.find(".dayColumn button").text().trim(),
            time: e.find(".timeColumn p").last().text().trim().includes("-")
              ? e
                  .find(".timeColumn p")
                  .last()
                  .text()
                  .trim()
                  .split("-")
                  .map((time) => moment(time, ["ha", "h:mma"]))
              : e.find(".timeColumn p").last().text().trim(),
          };
        }),
    );

    setLoading(false);
  }

  function toggleCheckbox(s, e) {
    if (typeof s.time === "string") return;
    if (e.target.checked) selectSection({ ...s, ...course });
    else deselectSection({ ...s, ...course });
  }

  return (
    <div>
      <a className="pl-1 cursor-pointer" onClick={showDetails}>
        {course.dept} {course.num}
      </a>
      {visible ? (
        loading ? (
          <div className="pl-2">Loading...</div>
        ) : (
          <div className="pl-1">
            {sections.map((s, i) => (
              <div key={i}>
                <label className="flex h-5 text-xs items-center">
                  <input
                    className="h-2.5 w-4 mr-1 rounded border-gray-300 focus:ring-indigo-600"
                    type="checkbox"
                    onChange={(e) => toggleCheckbox(s, e)}
                  />
                  {s.section} {s.day}{" "}
                  {typeof s.time !== "string"
                    ? s.time[0].format("h:mma") +
                      "-" +
                      s.time[1].format("h:mma")
                    : s.time}
                </label>
              </div>
            ))}
          </div>
        )
      ) : (
        ""
      )}
    </div>
  );
}
