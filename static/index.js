async function getCourses(dept) {
  const term = $("#term").val();
  let data = await $.ajax({
    url: `/cors?https://sa.ucla.edu/ro/ClassSearch/Public/Search/GetLevelSeparatedSearchData?input={"search_by":"subject","term_cd":"${term}","subj_area_cd":"${dept}"}&level=2`,
  });
  try {
    return data.map((course) => ({
      num: course.label.match(/[A-Z]*[0-9]+[A-Z]*/)[0],
      catlg: course.value.crs_catlg_no,
    }));
  } catch {
    console.error(`Failed to fetch ${dept}`);
    return [];
  }
}

$(async () => {
  $.ajax({
    url:
      "/cors?https://sa.ucla.edu/ro/public/soc/Results/GetCourseSummary?model=" +
      encodeURIComponent(
        `{"Term":"23F","SubjectAreaCode":"COM SCI","CatalogNumber":"0001","IsRoot":true,"SessionGroup":"%","ClassNumber":"%","SequenceNumber":null,"Path":"COMSCI0001"}`,
      ) +
      "&FilterFlags=" +
      encodeURIComponent(
        `{"enrollment_status":"O,W,C,X,T,S","advanced":"y","meet_days":"M,T,W,R,F","start_time":"8:00 am","end_time":"8:00 pm","meet_locations":null,"meet_units":null,"instructor":null,"class_career":null,"impacted":null,"enrollment_restrictions":null,"enforced_requisites":null,"individual_studies":null,"summer_session":null}`,
      ),
  }).then((data) => {
    console.log(data);
  });
  $("#go").on("click", async () => {
    const term = $("#term").val();
    let file = $("#audit").prop("files")[0];
    if (!/[0-9]{2}[F,W,S]/.test(term)) {
      console.log(term);
      alert("Invalid term");
      return;
    }
    if (!file) {
      alert("Invalid DARS");
      return;
    }
    console.log("term:", term);
    let fr = new FileReader();
    fr.onerror = (e) => alert("Error reading DARS");
    fr.onload = (event) => {
      let data = event.target.result;
      let depts = new Set();
      $(data)
        .find("div.requirement")
        .each((i, e) => {
          e = $(e);
          if (!e.hasClass("Status_NO") || e.attr("rname") == "TBR") return;
          var $req = $("<div>").append(
            $("<h2>").append(e.find(".reqTitle").contents().first()),
          );
          e.find(".subrequirement").each((i, e) => {
            e = $(e);
            let courses = [];
            e.find(".selectcourses .fromcourselist td")
              .contents()
              .each((i, e) => {
                if (
                  courses.length != 0 &&
                  courses[courses.length - 1].end_num == 0
                ) {
                  courses[courses.length - 1].end_num = $(e)
                    .attr("number")
                    .trim();
                } else if (
                  courses.length != 0 &&
                  e.tagName &&
                  courses[courses.length - 1].or.num == 0
                ) {
                  console.log(e);
                  depts.add($(e).attr("department").trim());
                  courses[courses.length - 1].or.dept = $(e)
                    .attr("department")
                    .trim();
                  courses[courses.length - 1].or.num = $(e)
                    .attr("number")
                    .trim();
                } else if (e.tagName) {
                  depts.add($(e).attr("department").trim());
                  courses.push({
                    dept: $(e).attr("department").trim(),
                    num: $(e).attr("number").trim(),
                    end_num: -1,
                    or: {
                      dept: "",
                      num: -1,
                    },
                  });
                } else if (e.textContent == " TO ") {
                  courses[courses.length - 1].end_num = 0;
                } else if (e.textContent == " OR ") {
                  courses[courses.length - 1].or = {
                    dept: "",
                    num: 0,
                  };
                }
              });
            var term = $("#term").val();
            if (courses.length == 0) return;
            var $subreq = $("<div>")
              .append(
                $("<h3>").append(e.find(".subreqTitle").contents().first()),
              )
              .append($("<p>").append(e.find(".subreqNeeds").text()))
              .append(
                $("<ol>").append(
                  ...courses.map((course) =>
                    $("<li>")
                      .addClass(course.dept.replace(" ", "-") + course.num)
                      .css("color", "red")
                      .append(
                        $("<details>").append(
                          $("<summary>").text(
                            `${course.dept} ${course.num}${
                              course.end_num == -1
                                ? ""
                                : " TO " + course.end_num
                            }${
                              course.or.num == -1
                                ? ""
                                : " OR " + course.or.dept + " " + course.or.num
                            }`,
                          ),
                        ),
                      ),
                  ),
                ),
              );
            $req.append($subreq);
          });
          $("#output").append($req);
        });
      console.log("depts", depts);
      depts.forEach(async (dept) => {
        let courses = await getCourses(dept);
        courses.forEach((course) => {
          if (
            $(`.${dept.replace(" ", "-") + course.num}`).css("color") == "black"
          )
            return;
          $(`.${dept.replace(" ", "-") + course.num}`)
            .css("color", "black")
            .find("details")
            .append(
              $("<a>")
                .attr(
                  "href",
                  `https://sa.ucla.edu/ro/ClassSearch/Results?t=${term}&subj=${dept}&catlg=${course.catlg}`,
                )
                .attr("target", "_blank")
                .text("SOC Link"),
            );
        });
      });
    };
    fr.readAsText(file);
  });
});
