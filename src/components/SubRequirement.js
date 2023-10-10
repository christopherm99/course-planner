import { useState, useEffect } from "react";
import * as $ from "jquery";
import useStore from "@/hooks/useStore";
import Course from "./Course";

function createClassRange(dept, start, end) {
  let start_n = Number(start.match(/[0-9]{1,3}/)[0]);
  let end_n = Number(end.match(/[0-9]{1,3}/)[0]);

  let ret = [];
  for (let i = start_n + 1; i <= end_n; i++) {
    ret.push({
      dept,
      num: start.replace(/[0-9]{1,3}/, i),
    });
  }

  return ret;
}

export default function SubRequirement({ src }) {
  const [courses, setCourses] = useState([]);
  const courseList = useStore((state) => state.courseList);
  const addDept = useStore((state) => state.addDept);

  useEffect(() => {
    let lastTok = "";
    setCourses(
      $(src)
        .find(".selectcourses .fromcourselist td")
        .contents()
        .toArray()
        .map((e) => $(e))
        .reduce((acc, e) => {
          if (lastTok == "TO") {
            lastTok = "";
            return [
              ...acc,
              ...createClassRange(
                e.attr("department").trim(),
                acc[acc.length - 1].num,
                e.attr("number").trim(),
              ),
            ];
          } else if (lastTok == "OR") {
            lastTok = "";
            return acc; // TODO: FIXME
          } else if (e.prop("tagName")) {
            addDept(e.attr("department").trim());
            return [
              ...acc,
              {
                dept: e.attr("department").trim(),
                num: e.attr("number").trim(),
              },
            ];
          } else {
            lastTok = e.text().trim();
            return acc;
          }
        }, []),
    );
  }, []);
  return (
    <div>
      <h3 className="text-xs font-thin text-gray-900">
        {src.find(".subreqTitle").contents().first().text()}
      </h3>
      <div className="text-sm">
        {courses
          .sort((a, b) =>
            (a.dept + a.num.match(/[0-9]{1,3}/)[0]).localeCompare(
              b.dept + b.num.match(/[0-9]{1,3}/)[0],
            ),
          )
          .map((course, i) => {
            // filter(course => courseList[course.dept] && courseList[course.dept].map(c => c.num).includes(course.num))
            let listing = courseList[course.dept].find(
              (c) => c.num === course.num,
            );
            if (listing)
              return (
                <Course key={i} course={{ ...course, catlg: listing.catlg }} />
              );
          })}
      </div>
    </div>
  );
}
