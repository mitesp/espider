import React from "react";

function renderTextInSection(displayedText: string, centered = false) {
  return <h3 className={"is-size-5" + (centered ? " has-text-centered" : "")}>{displayedText}</h3>;
}

function renderLinkedText(displayedText: string, url: string) {
  return (
    <h3 className="is-size-5 has-text-centered">
      <a href={url}>{displayedText}</a>
    </h3>
  );
}

export { renderLinkedText, renderTextInSection };
