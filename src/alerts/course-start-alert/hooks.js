import React, { useMemo, useEffect } from 'react';
import { useAlert } from '../../generic/user-messages';
import { useModel } from '../../generic/model-store';

const CourseStartAlert = React.lazy(() => import('./CourseStartAlert'));
const CourseStartMasqueradeBanner = React.lazy(() => import('./CourseStartMasqueradeBanner'));

function IsStartDateInFuture(courseId, start) {
  // const {
  //   start,
  // } = useModel('courseHomeMeta', courseId) || {};
  // if(start){
    const today = new Date();
  const startDate = new Date(start);
  return startDate > today;
  // }
  
}

function useCourseStartAlert(courseId) {
  const {
    isEnrolled,
  } = useModel('courseHomeMeta', courseId);

  const isVisible = isEnrolled && IsStartDateInFuture(courseId);

  const payload = useMemo(() => ({
    courseId,
  }), [courseId]);

  useAlert(isVisible, {
    code: 'clientCourseStartAlert',
    payload,
    topic: 'outline-course-alerts',
  });

  return {
    clientCourseStartAlert: CourseStartAlert,
  };
}

export function useCourseStartMasqueradeBanner(courseId, tab) {
  const {
    isMasquerading,
    start
  } = useModel('courseHomeMeta', courseId) || {};
  console.log(IsStartDateInFuture(courseId), useModel('courseHomeMeta', courseId), "courseHomeMeta")
  const isVisible = isMasquerading && tab === 'progress' ? IsStartDateInFuture(courseId, start) : false;

  // const payload = useMemo(() => ({
  //   courseId,
  // }), [courseId]);

  useAlert(isVisible, {
    code: 'clientCourseStartMasqueradeBanner',
    payload: {courseId},
    topic: 'instructor-toolbar-alerts',
  });

  return {
    clientCourseStartMasqueradeBanner: CourseStartMasqueradeBanner,
  };
}

export default useCourseStartAlert;
