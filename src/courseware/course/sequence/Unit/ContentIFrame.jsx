import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

// import { ErrorPage } from '@edx/frontend-platform/react';
import { StrictDict } from "@edx/react-unit-test-utils";
import { Modal } from "@edx/paragon";

import PageLoading from "../../../../generic/PageLoading";
import * as hooks from "./hooks";

/**
 * Feature policy for iframe, allowing access to certain courseware-related media.
 *
 * We must use the wildcard (*) origin for each feature, as courseware content
 * may be embedded in external iframes. Notably, xblock-lti-consumer is a popular
 * block that iframes external course content.

 * This policy was selected in conference with the edX Security Working Group.
 * Changes to it should be vetted by them (security@edx.org).
 */
export const IFRAME_FEATURE_POLICY =
  "microphone *; camera *; midi *; geolocation *; encrypted-media *, clipboard-write *";

export const testIDs = StrictDict({
  contentIFrame: "content-iframe-test-id",
  modalIFrame: "modal-iframe-test-id",
});

const ContentIFrame = ({
  iframeUrl,
  shouldShowContent,
  loadingMessage,
  id,
  elementId,
  onLoaded,
  title,
}) => {
  const [iframeClass, setIframeClass] = useState("");

  const { handleIFrameLoad, hasLoaded, iframeHeight, showError } =
    hooks.useIFrameBehavior({
      elementId,
      id,
      iframeUrl,
      onLoaded,
    });

  const { modalOptions, handleModalClose } = hooks.useModalIFrameData();

  useEffect(() => {
    const checkIframeContent = () => {
      const iframeElement = document.getElementById(elementId);
      if (iframeElement && iframeElement.contentDocument) {
        const problemHeaderExists =
          iframeElement.contentDocument.querySelector(
            ".xblock-student_view-edx_sga"
          ) ||
          iframeElement.contentDocument.querySelector(
            ".xblock-student_view-freetextresponse"
          ) ||
          iframeElement.contentDocument.querySelector(
            ".xblock-student_view-openassessment"
          ) ||
          iframeElement.contentDocument.querySelector(
            ".xblock-student_view-problem"
          ) ||
          iframeElement.contentDocument.querySelector(
            ".xblock-student_view-lti_consumer"
          );
        const hasQuizTagClass = iframeElement.classList.contains("quiz-tag");
        if (problemHeaderExists && !hasQuizTagClass) {
          setIframeClass("quiz-tag");
        }
      }
    };
    const observer = new MutationObserver(() => {
      checkIframeContent();
    });
    const iframeElement = document.getElementById(elementId);
    if (iframeElement && iframeElement.contentDocument) {
      observer.observe(iframeElement.contentDocument, {
        childList: true,
        subtree: true,
      });
    }
    return () => observer.disconnect();
  }, [hasLoaded, iframeUrl, elementId]);

  const contentIFrameProps = {
    id: elementId,
    src: iframeUrl,
    allow: IFRAME_FEATURE_POLICY,
    allowFullScreen: true,
    height: iframeHeight,
    scrolling: "no",
    referrerPolicy: "origin",
    onLoad: handleIFrameLoad,
    className: iframeClass,
  };

  return (
    <>
      {shouldShowContent &&
        !hasLoaded &&
        // custom error message for iframe
        (showError ? (
          <div className="error_msg fade alert-content alert alert-danger show">
            <span>🛈 </span> There seems to be a network issue. Please check your
            connection and try again.
          </div>
        ) : (
          <PageLoading srMessage={loadingMessage} />
        ))}
      {shouldShowContent && (
        <div className="unit-iframe-wrapper">
          <iframe
            title={title}
            {...contentIFrameProps}
            data-testid={testIDs.contentIFrame}
          />
        </div>
      )}
      {modalOptions.isOpen && (
        <Modal
          body={
            modalOptions.body ? (
              <div className="unit-modal">{modalOptions.body}</div>
            ) : (
              <iframe
                title={modalOptions.title}
                allow={IFRAME_FEATURE_POLICY}
                frameBorder="0"
                src={modalOptions.url}
                style={{ width: "100%", height: modalOptions.height }}
              />
            )
          }
          dialogClassName="modal-lti"
          onClose={handleModalClose}
          open
        />
      )}
    </>
  );
};

ContentIFrame.propTypes = {
  iframeUrl: PropTypes.string,
  id: PropTypes.string.isRequired,
  shouldShowContent: PropTypes.bool.isRequired,
  loadingMessage: PropTypes.node.isRequired,
  elementId: PropTypes.string.isRequired,
  onLoaded: PropTypes.func,
  title: PropTypes.node.isRequired,
};

ContentIFrame.defaultProps = {
  iframeUrl: null,
  onLoaded: () => ({}),
};

export default ContentIFrame;
