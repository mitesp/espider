import React from "react";

export default function () {
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
              <li>
                <a className="has-text-link-dark" href="/splash">
                  Splash
                </a>
                <small className="pl-2 has-text-grey-dark">9–12</small>
              </li>
              <li>
                <a className="has-text-link-dark" href="/spark">
                  Spark
                </a>
                <small className="pl-2 has-text-grey-dark">7–8</small>
              </li>
              <li>
                <a className="has-text-link-dark" href="/hssp#spring">
                  Spring HSSP
                </a>
                <small className="pl-2 has-text-grey-dark">7–12</small>
              </li>
              <li>
                <a className="has-text-link-dark" href="/hssp#summer">
                  Summer HSSP
                </a>
                <small className="pl-2 has-text-grey-dark">7–12</small>
              </li>
              <li>
                <a className="has-text-link-dark" href="/cascade">
                  Cascade
                </a>
                <small className="pl-2 has-text-grey-dark">9–10</small>
              </li>
            </ul>
            <h2 className="is-size-6 pt-0 has-text-weight-bold">Programs for MIT</h2>
            <ul>
              <li>
                <a className="has-text-link-dark" href="/firehose">
                  Firehose
                </a>
              </li>
              <li>
                <a className="has-text-link-dark" href="/firestorm">
                  Firestorm
                </a>
              </li>
              <li>
                <a className="has-text-link-dark" href="/splashformit">
                  Splash for MIT
                </a>
              </li>
            </ul>
          </div>
          <div className="column" style={{ lineHeight: "2rem" }}>
            <h2 className="is-size-6 has-text-weight-bold">About Us</h2>
            <ul>
              <li>
                <a className="has-text-link-dark" href="/history">
                  History
                </a>
              </li>
              <li>
                <a className="has-text-link-dark" href="/team">
                  Team
                </a>
              </li>
              <li>
                <a className="has-text-link-dark" href="/values">
                  Values
                </a>
              </li>
            </ul>

            <h2 className="is-size-6 has-text-weight-bold">Get Involved</h2>
            <ul>
              <li>
                <a className="has-text-link-dark" href="/learn">
                  Learn
                </a>
              </li>
              <li>
                <a className="has-text-link-dark" href="/teach">
                  Teach
                </a>
              </li>
              <li>
                <a className="has-text-link-dark" href="/volunteer">
                  Volunteer
                </a>
              </li>
              <li>
                <a className="has-text-link-dark" href="/outreach">
                  Spread the word
                </a>
              </li>
              <li>
                <a className="has-text-link-dark" href="/join">
                  Join us
                </a>
              </li>
            </ul>
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
