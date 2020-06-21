import React from "react";
import { render } from "react-dom";
import { Router, Link } from "@reach/router";
// import { Button } from "react-bulma-components";

import "react-bulma-components/dist/react-bulma-components.min.css";

import Nav from "./Nav.js";

let Home = () => (
  // TODO: why doesn't this bulma class work?
  <section className="pt-6" style={{ paddingTop: "3rem" }}>
    <div className="container">
      <div className="columns">
        <div className="column">
          <img
            className="level-item"
            src="https://qph.fs.quoracdn.net/main-qimg-338d75dbb172519677a52c5d7db1192d"
          />{" "}
        </div>
        <div className="column">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel
          nunc ut enim sagittis interdum. Vestibulum dapibus urna eu neque
          luctus maximus. Sed eu cursus nunc, id imperdiet lorem. Praesent arcu
          felis, varius sed nibh eu, vehicula molestie nunc. Morbi ac arcu id
          ante porttitor tempor. Suspendisse mollis tellus ipsum. Morbi pretium
          mi sit amet eros consequat, ac ornare tortor lobortis. Morbi
          scelerisque sit amet dolor ac ullamcorper. Curabitur eget ullamcorper
          ligula. Fusce bibendum bibendum massa. Nunc non luctus est. Phasellus
          ante massa, condimentum vitae suscipit eget, cursus at nunc. Cras
          porta, lorem et condimentum dapibus, velit ex laoreet purus, sit amet
          blandit mi urna eu arcu. Aliquam porta felis et felis porta, et
          fermentum purus laoreet. Pellentesque faucibus odio sit amet lectus
          finibus luctus. Pellentesque nec felis blandit, vulputate nisi ac,
          porttitor justo. Cras at urna sit amet metus efficitur varius ac sit
          amet libero. Mauris dictum lacus quis velit finibus, eget tincidunt
          erat feugiat.
        </div>
        <div className="column">Fish! Learn! Teach!</div>
      </div>
    </div>
  </section>
);
let Dash = () => <div>Dash</div>;

function App() {
  return (
    <React.Fragment>
      <Nav />
      <main>
        <Router>
          <Home path="/" />
          <Dash path="dashboard" />
        </Router>
      </main>
      <footer className="footer">
        <div className="content has-text-centered">
          <p>
            <strong>ESPIDER</strong> by espider-dev@mit.edu. The source code is
            licensed{" "}
            <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
            The website content is licensed{" "}
            {/* TODO: What is this, actually? */}
            <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
              CC BY NC SA 4.0
            </a>
            .
          </p>
        </div>
      </footer>
    </React.Fragment>
  );
}

export default App;
