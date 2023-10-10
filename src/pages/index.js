import Requirement from "@/components/Requirement";
import Schedule from "@/components/Schedule";
import useStore from "@/hooks/useStore";
import * as $ from "jquery";
import { useState } from "react";

export default function Home() {
  const [requirements, setRequirements] = useState([]);
  const [visible, setVisible] = useState(true);
  const setTerm = useStore((state) => state.setTerm);

  function handleGo(e) {
    e.preventDefault();

    setTerm(e.target.term.value);

    let file = e.target.audit.files[0];
    let fr = new FileReader();

    fr.onerror = () => alert("Error reading DARS");
    fr.onload = (event) => {
      let data = event.target.result;
      setRequirements(
        $(data)
          .find("div.requirement")
          .toArray()
          .map((e) => $(e))
          .filter((e) => e.find(".selectcourses").length != 0)
          .filter((e) => e.hasClass("Status_NO") && e.attr("rname") != "TBR"),
      );
    };

    fr.readAsText(file);
    setVisible(false);
  }

  return (
    <main>
      <h1 className="text-2xl text-right px-4 py-2 fixed w-full">
        Class Signup Page
      </h1>
      <div className="flex">
        <div className="flex-none w-2/5 py-2">
          {visible ? (
            <form className="pt-12 px-6" onSubmit={handleGo}>
              <label className="block my-2">
                Select Term:{" "}
                <input
                  className="text-xs border-0 py-1.5 px-2 rounded-md ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 placeholder:text-gray-400"
                  id="term"
                  type="text"
                  placeholder="23F"
                />
              </label>
              <label className="my-2">
                <input
                  className="block py-2 text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-slate-200"
                  id="audit"
                  type="file"
                  accept="text/html"
                />
              </label>
              <button className="bg-slate-200 py-2 px-4 my-2" type="submit">
                GO!
              </button>
            </form>
          ) : (
            ""
          )}
          <div>
            {requirements.map((requirement, i) => (
              <Requirement key={i} src={requirement} />
            ))}
          </div>
        </div>
        <div className="pr-4 w-3/5 pt-12 right-0 fixed">
          <Schedule />
        </div>
      </div>
    </main>
  );
}
