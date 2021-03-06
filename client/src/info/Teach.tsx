import { Link } from "@reach/router";
import React from "react";

import { contentPage } from "../layout/Page";

export default function Teach() {
  return contentPage("Teach | MIT ESP")(
    <div className="columns">
      <div className="column">
        <img
          className="level-item"
          src="https://compote.slate.com/images/1368eb56-12c0-4d83-a9fe-599ce8207023.jpg"
          alt="teach teach teach"
        />
      </div>
      <div className="column">
        Teaching for ESP can be an extremely rewarding and educational experience. It can also be as
        much or as little commitment as you like. If you would like to teach a one-time class,{" "}
        <Link to="/splash">Splash</Link> (in November) and <Link to="/spark">Spark</Link> (in early
        March) are great opportunities to teach about anything you want!
        <Link to="/hssp"> HSSP</Link> (spring and summer) is a 6–10 week program that gives you the
        opportunity to go more in-depth.
        <br /> <br />
        Moreover, we believe that teaching should be fun for you, as well as the students taking
        your classes. Our motto is{" "}
        <Link to="/aboutus">“teach anything, learn anything, do anything”</Link>
        , and we hope our programs allow you to teach the subjects (academic or non-academic) that
        you’re passionate about.
        <br /> <br />
        Teaching is also easier than you think! We can help you with advice, resources and helpful
        hints. You can teach a lecture class about programming algorithms, an interactive
        electronics class or maybe even teach yoga or martial arts. If you need resources for your
        class, you can either buy them (check with directors to determine your budget) or we can
        help you procure them. If you’d like advice or tips, check out our advice for teachers
        section, or simply contact us with any questions or thoughts.
      </div>
      <div className="column">Fish! Teach!</div>
    </div>
  );
}
