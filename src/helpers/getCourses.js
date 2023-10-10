import * as $ from "jquery";

const cache = {};
export default async function getCourses(term, dept) {
  console.log(cache);
  if (term + dept in cache) return cache[term + dept];
  let data = await $.ajax({
    type: "POST",
    url: "/api/cors",
    data: {
      url: `https://sa.ucla.edu/ro/ClassSearch/Public/Search/GetLevelSeparatedSearchData?input={"search_by":"subject","term_cd":"${term}","subj_area_cd":"${dept}"}&level=2`,
    },
  });
  let ret = [];
  try {
    ret = data.map((course) => ({
      num: course.label.match(/[A-Z]*[0-9]+[A-Z]*/)[0],
      catlg: course.value.crs_catlg_no,
    }));
  } catch {
    console.error(`Failed to fetch ${dept}`);
  }
  cache[term + dept] = ret;
  return ret;
}
