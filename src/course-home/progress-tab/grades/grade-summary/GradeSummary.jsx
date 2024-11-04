import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useModel } from '../../../../generic/model-store';

import GradeSummaryHeader from './GradeSummaryHeader';
import GradeSummaryTable from './GradeSummaryTable';

const GradeSummary = () => {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const {
    gradingPolicy: {
      assignmentPolicies,
    },
    sectionScores,
  } = useModel('progress', courseId);

  const [allOfSomeAssignmentTypeIsLocked, setAllOfSomeAssignmentTypeIsLocked] = useState(false);

  if (assignmentPolicies.length === 0) {
    return null;
  }

  let letter_grade_exists = false;
  sectionScores.map((chapter) => {
    const subsectionScores = chapter.subsections.filter(
      (subsection) => !!(
        subsection.hasGradedAssignment
        && subsection.showGrades
        && (subsection.numPointsPossible > 0 || subsection.numPointsEarned > 0)),
    );

    if (subsectionScores.length === 0) {
      return null;
    }

    subsectionScores.map((subsection) => ({
      letter_grade_exists: letter_grade_exists || false
    }));
  });

  console.log("letter_grade_exists: ", letter_grade_exists);

  return (
    <section className="text-dark-700 mb-4">
      <GradeSummaryHeader allOfSomeAssignmentTypeIsLocked={allOfSomeAssignmentTypeIsLocked} />
      <GradeSummaryTable setAllOfSomeAssignmentTypeIsLocked={setAllOfSomeAssignmentTypeIsLocked} />
    </section>
  );
};

export default GradeSummary;
