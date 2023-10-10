import * as $ from "jquery";
import SubRequirement from "./SubRequirement";

export default function Requirement({ src }) {
  let subreqs = src
    .find(".subrequirement")
    .toArray()
    .map((e) => $(e))
    .filter((e) => e.find(".selectcourses").length != 0);
  return (
    <div className="pl-2">
      <h2 className="font-bold">
        {src.find(".reqTitle").contents().first().text()}
      </h2>
      <div>
        {subreqs.map((subreq, i) => (
          <div key={i}>
            <SubRequirement src={subreq} />
          </div>
        ))}
      </div>
    </div>
  );
}
