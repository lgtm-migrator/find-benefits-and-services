import React from "react";
import { FeedbackBar } from "../../components/feedbackBar";
import { mount } from "enzyme";

const { axe, toHaveNoViolations } = require("jest-axe");
expect.extend(toHaveNoViolations);

jest.mock("react-ga");

describe("Feedback bar", () => {
  // Setup

  let props;
  let _mountedFeedbackBar;
  const mountedFeedbackBar = () => {
    if (!_mountedFeedbackBar) {
      _mountedFeedbackBar = mount(<FeedbackBar {...props} />);
    }
    return _mountedFeedbackBar;
  };

  beforeEach(() => {
    props = {
      t: key => key
    };
    _mountedFeedbackBar = undefined;
  });

  // Tests
  it("passes axe tests", async () => {
    let html = mountedFeedbackBar().html();
    expect(await axe(html)).toHaveNoViolations();
  });

  it("shows the feedback prompt", () => {
    expect(mountedFeedbackBar().text()).toContain("feedback-prompt");
  });

  it("shows the comment prompt", () => {
    expect(mountedFeedbackBar().text()).toContain("comment-prompt");
  });

  describe("clicking the comment button", () => {
    it("shows the comment box", () => {
      mountedFeedbackBar()
        .find("#commentToggle")
        .at(0)
        .simulate("click");
      expect(mountedFeedbackBar().text()).toContain("comment-help-us-improve");
      expect(mountedFeedbackBar().text()).toContain(
        "comment-privacy-disclaimer"
      );
      expect(mountedFeedbackBar().text()).toContain(
        "comment-what-were-you-doing"
      );
      expect(mountedFeedbackBar().text()).toContain("comment-what-went-wrong");
    });
  });

  describe("clicking the comment submit button", () => {
    it("calls the sendComment function", () => {
      const spy = jest.spyOn(mountedFeedbackBar().instance(), "sendComment");
      mountedFeedbackBar()
        .find("#commentToggle")
        .at(0)
        .simulate("click");

      mountedFeedbackBar()
        .find("#sendComment")
        .at(0)
        .simulate("click");

      expect(spy).toBeCalled();
    });
  });

  it("editing the what were you doing text field updates the action state", () => {
    mountedFeedbackBar()
      .find("#commentToggle")
      .at(0)
      .simulate("click");

    mountedFeedbackBar()
      .find("#commentWhatWereYouDoing")
      .at(0)
      .props()
      .onChange({ target: { value: "bar" } });
    expect(mountedFeedbackBar().state().action).toEqual("bar");
  });

  it("editing the what went wrong text field updates the action state", () => {
    mountedFeedbackBar()
      .find("#commentToggle")
      .at(0)
      .simulate("click");

    mountedFeedbackBar()
      .find("#commentWhatWentWrong")
      .at(0)
      .props()
      .onChange({ target: { value: "bar" } });
    expect(mountedFeedbackBar().state().failure).toEqual("bar");
  });

  describe("clicking the yes button", () => {
    it("shows the feedback response", () => {
      mountedFeedbackBar()
        .find("#feedbackYes")
        .at(0)
        .simulate("click");
      expect(mountedFeedbackBar().text()).toContain("feedback-response");
    });
  });

  describe("clicking the no button", () => {
    it("shows the feedback response", () => {
      mountedFeedbackBar()
        .find("#feedbackNo")
        .at(0)
        .simulate("click");
      expect(mountedFeedbackBar().text()).toContain("feedback-response");
    });
  });

  it("Feedback logged with Google Analytics", () => {
    let analytics = require("../../utils/analytics");
    analytics.logEvent = jest.fn();
    mountedFeedbackBar()
      .find("#feedbackYes")
      .at(0)
      .simulate("click");
    expect(analytics.logEvent).toBeCalledWith(
      "Page Feedback (feedback-prompt)",
      "Yes"
    );
  });
});
