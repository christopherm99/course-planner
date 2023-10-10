import { create } from "zustand";
import * as $ from "jquery";

async function getCourses(term, dept) {
  let data = await $.ajax({
    type: "POST",
    url: "/api/cors",
    data: {
      url: `https://sa.ucla.edu/ro/ClassSearch/Public/Search/GetLevelSeparatedSearchData?input={"search_by":"subject","term_cd":"${term}","subj_area_cd":"${dept}"}&level=2`,
    },
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

export default create((set, get) => ({
  courseList: {},
  selectedSections: [],
  term: "",
  async addDept(dept) {
    if (dept in get().courseList) return;
    set((state) => ({
      courseList: {
        ...state.courseList,
        [dept]: [],
      },
    }));
    let courses = await getCourses(get().term, dept);
    set((state) => ({
      courseList: {
        ...state.courseList,
        [dept]: courses,
      },
    }));
  },
  async selectSection(s) {
    set((state) => ({
      selectedSections: [...state.selectedSections, s],
    }));
  },
  deselectSection(section) {
    set((state) => ({
      selectedSections: state.selectedSections.filter(
        (s) =>
          s.section + s.dept + s.num !==
          section.section + section.dept + section.num,
      ),
    }));
  },
  setTerm(term) {
    if (get().term != term) {
      set({ term, courseList: {} });
    }
  },
}));
