import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  getLocale, injectIntl, intlShape, isRtl,
} from '@edx/frontend-platform/i18n';
import { DataTable } from '@edx/paragon';

import { useModel } from '../../../../generic/model-store';
import messages from '../messages';
import SubsectionTitleCell from './SubsectionTitleCell';


const DetailedGradesTable = ({ intl }) => {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const {
    sectionScores,
  } = useModel('progress', courseId);

  const isLocaleRtl = isRtl(getLocale());
  const [expandedFeedback, setExpandedFeedback] = useState({});
  const toggleFeedback = (subsectionName) => {
    setExpandedFeedback((prev) => ({
      ...prev,
      [subsectionName]: !prev[subsectionName],
    }));
  };

  return (
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

      const detailedGradesData = subsectionScores.map((subsection) => {
        const isExpanded = expandedFeedback[subsection.displayName];
        const feedback_data = subsection?.comment || '-';
        const feedbackText = feedback_data.replace(/<[^>]*>/g, '');
        const shouldTruncate = feedbackText.length > 15 && !isExpanded;
        return {
          subsectionTitle: <SubsectionTitleCell subsection={subsection} />,
          score: <span className={subsection.learnerHasAccess ? 'score-column' : 'score-column greyed-out'}>{subsection.letterGrade ? subsection.letterGrade : subsection.numPointsEarned.toFixed(2)}{subsection.letterGrade ? '' : (isLocaleRtl ? '\\' : '/')}{subsection.letterGrade ? '' : subsection.numPointsPossible.toFixed(2)}</span>,
          feedback: (
            <div>
              <span id="feedback-column" className={subsection.learnerHasAccess ? (isExpanded ? 'feedback-expanded' : 'feedback-truncated') : 'greyed-out'}>
                {shouldTruncate ? feedbackText.slice(0,15) + '... ' : feedbackText}
              </span>    
              {subsection.learnerHasAccess && feedbackText !== '-' && feedbackText.length > 15 && (
                <span>
                  <a className="more-less-btn" href="#" onClick={(e) => { e.preventDefault(); toggleFeedback(subsection.displayName); }}>{isExpanded ? 'less' : 'more'}</a>
                </span>
              )}
            </div>
          ),
        }
      });

      return (
        <div className="my-3" key={`${chapter.displayName}-grades-table`}>
          <DataTable
            data={detailedGradesData}
            itemCount={detailedGradesData.length}
            columns={[
              {
                Header: chapter.displayName,
                accessor: 'subsectionTitle',
                headerClassName: 'h5 mb-0',
                cellClassName: 'mw-100',
              },
              {
                Header: `${intl.formatMessage(messages.score)}`,
                accessor: 'score',
                headerClassName: 'justify-content-start h5 mb-0',
                cellClassName: 'align-center text-left small',
              },
              {
                Header: `${intl.formatMessage(messages.feedback)}`,
                accessor: 'feedback',
                headerClassName: 'justify-content-start h5 mb-0',
                cellClassName: 'align-center text-left small',
              },
            ]}
          >
            <DataTable.Table />
          </DataTable>
        </div>
      );
    })
  );
};

DetailedGradesTable.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(DetailedGradesTable);
