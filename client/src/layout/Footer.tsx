import React from "react";

const generateLink = (href: string, text: string) => (
  <a className="has-text-link-dark" href={href}>
    {text}
  </a>
);

const generateLinksList = (linksInfo: string[][]) => (
  <ul>
    {linksInfo.map(x => (
      <li>{generateLink(x[0], x[1])}</li>
    ))}
  </ul>
);

export default function () {
  const programs = [
    ["/splash", "Splash", "9–12"],
    ["/spark", "Spark", "7–8"],
    ["/hssp#spring", "Spring HSSP", "7–12"],
    ["/hssp#summer", "Summer HSSP", "7–12"],
    ["/cascade", "Cascade", "9–10"],
  ];
  const mitPrograms = [
    ["/firehose", "Firehose"],
    ["/firestorm", "Firestorm"],
    ["/splashformit", "Splash for MIT"],
  ];
  const about = [
    ["/history", "History"],
    ["/team", "Team"],
    ["/values", "Values"],
  ];
  const involved = [
    ["/learn", "Learn"],
    ["/teach", "Teach"],
    ["/volunteer", "Volunteer"],
    ["/outreach", "Spread the word"],
    ["/join", "Join us"],
  ];

  return (
    <footer className="footer has-background-success-light">
      <div className="container">
        <div className="columns">
          <div className="column is-5">
            <p>
              We are the{" "}
              <span style={{ fontWeight: "bold", color: "#88cf00" }}>
                MIT Educational Studies Program
              </span>
              .
            </p>
            <br />
            <p>
              We host educational events for local middle and high school students and for the MIT
              community. Our mission is to spread the joy of learning and teaching, and to help
              people share their knowledge, passions, and hobbies with others.
            </p>
            <br />
            <p className="has-text-weight-bold">Learn anything, teach anything, do anything!</p>
          </div>
          <div className="column is-1"></div>
          <div className="column" style={{ lineHeight: "2rem" }}>
            <h2 className="is-size-6 pt-0 has-text-weight-bold">Programs</h2>
            <ul>
              {programs.map((x, i) => (
                <li key={i}>
                  {generateLink(x[0], x[1])}
                  <small className="pl-2 has-text-grey-dark">{x[2]}</small>
                </li>
              ))}
            </ul>
            <h2 className="is-size-6 pt-0 has-text-weight-bold">Programs for MIT</h2>
            {generateLinksList(mitPrograms)}
          </div>
          <div className="column" style={{ lineHeight: "2rem" }}>
            <h2 className="is-size-6 has-text-weight-bold">About Us</h2>
            {generateLinksList(about)}
            <h2 className="is-size-6 has-text-weight-bold">Get Involved</h2>{" "}
            {generateLinksList(involved)}
          </div>
        </div>
        <hr />
        <p className="has-text-centered">
          <strong>ESPIDER</strong> by{" "}
          <a className="has-text-link-dark" href="mailto:espider-dev@mit.edu">
            espider-dev@mit.edu
          </a>
          . The source code is licensed{" "}
          <a className="has-text-link-dark" href="http://opensource.org/licenses/mit-license.php">
            MIT
          </a>
          . The website content is licensed {/* TODO: What is this, actually? */}
          <a
            className="has-text-link-dark"
            href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
          >
            CC BY NC SA 4.0
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
