import React from "react";

export default function () {
  return (
    <section className="pt-5 pb-5">
      <div className="container content">
        <div className="has-text-centered pb-5">
          <h1 className="title mb-2">Join us!</h1>
          <p className="has-text-weight-bold">
            🕷️{" "}
            <a href="https://github.com/mitesp/espider">
              https://github.com/mitesp/espider
            </a>{" "}
            🕷️ <a href="mailto:espider-dev@mit.edu">espider-dev@mit.edu</a> 🕷️
            #teamwebdev (discord) 🕷️
          </p>
        </div>
        <div className="columns ">
          <div className="column ">
            <h1 className="is-size-3" style={{ color: "#ea4aaa" }}>
              Exciting coding work!
            </h1>
            <ul>
              <li>
                General coding skills
                <ul>
                  <li>Git good at git</li>
                  <li>
                    Learn Python AND Java(Type)Script / React / HTML / CSS
                  </li>
                  <li>Write code in a team with feedback</li>
                  <li>Make everyone's coding lives easier (devops)</li>
                  <li>Manage servers and infrastructure</li>
                  <li>Tests...</li>
                </ul>
              </li>
              <li>
                Mad tech skillz
                <ul>
                  <li>Design databases schemas</li>
                  <li>Design APIs</li>
                  <li>Do authentication correctly</li>
                  <li>Make everything secure</li>
                  <li>Write an auto-scheduler (ha)</li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="column">
            <h1 className="is-size-3" style={{ color: "#ea4aaa" }}>
              Exciting design work!
            </h1>
            <ul>
              <li>
                Interfaces
                <ul>
                  <li>Navigation layout</li>
                  <li>Homepage</li>
                  <li>Dashboards</li>
                  <li>Class selection</li>
                  <li>Class scheduler</li>
                  <li>Admin management page</li>
                </ul>
              </li>
              <li>UX experience (yes that's redundant)</li>
              <li>Rebranding and c o l o r s</li>
              <li>"Graphic design is my passion"</li>
              <li>Mascot art</li>
              <li>Accessibility</li>
            </ul>
          </div>
          <div className="column">
            <h1 className="is-size-3" style={{ color: "#ea4aaa" }}>
              Exciting ESP ideas!
            </h1>
            (AKA write the spec...)
            <ul>
              <li>How should deadlines work?</li>
              <li>How should class management work?</li>
              <li>How should registration work?</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
