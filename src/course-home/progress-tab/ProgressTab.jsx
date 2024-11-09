import React from 'react';
import { useSelector } from 'react-redux';
import { breakpoints, useWindowSize } from '@edx/paragon';

import CertificateStatus from './certificate-status/CertificateStatus';
import CourseCompletion from './course-completion/CourseCompletion';
import CourseGrade from './grades/course-grade/CourseGrade';
import DetailedGrades from './grades/detailed-grades/DetailedGrades';
import GradeSummary from './grades/grade-summary/GradeSummary';
import ProgressHeader from './ProgressHeader';
import RelatedLinks from './related-links/RelatedLinks';

import { useModel } from '../../generic/model-store';

const ProgressTab = () => {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const {
    gradesFeatureIsFullyLocked, disableProgressGraph, sectionScores,
  } = useModel('progress', courseId);

  const applyLockedOverlay = gradesFeatureIsFullyLocked ? 'locked-overlay' : '';

  const windowWidth = useWindowSize().width;
  if (windowWidth === undefined) {
    // Bail because we don't want to load <CertificateStatus/> twice, emitting 'visited' events both times.
    // This is a hacky solution, since the user can resize the screen and still get two visited events.
    // But I'm leaving a larger refactor as an exercise to a future reader.
    return null;
  }

  let allLetterGrade = false;
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

    chapter.subsections.filter((subsection) => {
      console.log(subsection.letterGrade);
      if (subsection.letterGrade) {
        allLetterGrade = true;
      }
    });
  });

  console.log("allLetterGrade: ", allLetterGrade);

  const wideScreen = windowWidth >= breakpoints.large.minWidth;
  return (
    <>
      <ProgressHeader />
      <div className="row w-100 m-0">
        {/* Main body */}
        <div className="col-12 col-md-8 p-0">
          {!disableProgressGraph && <CourseCompletion />}
          {!wideScreen && <CertificateStatus />}
          {/* <CourseGrade /> */}
          <div className={`grades my-4 p-4 rounded raised-card ${applyLockedOverlay}`} aria-hidden={gradesFeatureIsFullyLocked}>
            { !allLetterGrade && <GradeSummary /> }
            <DetailedGrades />
          </div>
        </div>

        {/* Side panel */}
        <div className="col-12 col-md-4 p-0 px-md-4">
          {wideScreen && <CertificateStatus />}
          <RelatedLinks />
        </div>
      </div>
    </>
  );
};

export default ProgressTab;
