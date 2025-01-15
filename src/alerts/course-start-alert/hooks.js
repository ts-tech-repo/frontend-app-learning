import React, { useMemo, useEffect } from "react";
import { useAlert } from "../../generic/user-messages";
import { useModel } from "../../generic/model-store";

const CourseStartAlert = React.lazy(() => import("./CourseStartAlert"));
const CourseStartMasqueradeBanner = React.lazy(() =>
  import("./CourseStartMasqueradeBanner")
);

function IsStartDateInFuture(courseId, start) {
  // const {
  //   start,
  // } = useModel('courseHomeMeta', courseId) || {};
  // commented the above code because we are calling this hook conditionally and it is causing issues, anyway we are calling same hook in below functions so using start value from their -- Datta Tadepalli.
  const today = new Date();
  const startDate = new Date(start);
  return startDate > today;
}

function useCourseStartAlert(courseId) {
  const { isEnrolled, start } = useModel("courseHomeMeta", courseId);

  const isVisible = isEnrolled && IsStartDateInFuture(courseId, start);

  const payload = useMemo(
    () => ({
      courseId,
    }),
    [courseId]
  );

  useAlert(isVisible, {
    code: "clientCourseStartAlert",
    payload,
    topic: "outline-course-alerts",
  });

  return {
    clientCourseStartAlert: CourseStartAlert,
  };
}

export function useCourseStartMasqueradeBanner(courseId, tab) {
  const { isMasquerading, start } = useModel("courseHomeMeta", courseId) || {};
  const isVisible =
    isMasquerading &&
    tab === "progress" &&
    IsStartDateInFuture(courseId, start);

  const payload = useMemo(() => ({
    courseId,
  }), [courseId]);

  useAlert(isVisible, {
    code: "clientCourseStartMasqueradeBanner",
    payload,
    topic: "instructor-toolbar-alerts",
  });

  return {
    clientCourseStartMasqueradeBanner: CourseStartMasqueradeBanner,
  };
}

export default useCourseStartAlert;
