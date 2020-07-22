import React, { useEffect } from "react";

type PageStyle = "general" | "content" | "fullWidth";

// NOTE: For now, the page functions take only an optional page parameter. This
// could be extended to include other page-specific parameters.
type GeneralProps = string;

type PageProps = {
  style: PageStyle;
  title?: string;
};

function Page(props: PageProps) {
  // NOTE: Current Page component only sets document title and returns a simple
  // layout. This could be extended with more useful functions in the future.
  if (props.title) {
    document.title = props.title;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (renderChildren: React.ReactNode) => {
    switch (props.style) {
      case "general":
        return <div className="container">{renderChildren}</div>;
      case "content":
        return <div className="container content">{renderChildren}</div>;
      case "fullWidth":
        return renderChildren;
    }
  };
}

/**
 * Use for content pages meant to convey information.
 */
function contentPage(title?: GeneralProps) {
  return Page({ style: "content", title });
}

/**
 * Use for general interaction pages, such as registration, class selection,
 * dashboards, etc. Width will be constrained by viewport size.
 */
function generalPage(title?: GeneralProps) {
  return Page({ style: "general", title });
}

/**
 * Use for pages where we want as much information in view as possible and
 * don't care about external usability.
 */
function fullWidthPage(title?: GeneralProps) {
  return Page({ style: "fullWidth", title });
}

export { generalPage, contentPage, fullWidthPage };
