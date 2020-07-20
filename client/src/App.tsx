// @ts-nocheck TODO: fix
import "./App.sass";

import axiosInstance from "./axiosAPI";
import { userDataEndpoint } from "./apiEndpoints";
import { AuthContext } from "./context/auth";
import Dashboard from "./dashboard/Dashboard";
import RegDashboard from "./registration/RegDashboard";

import AboutUs from "./info/AboutUs";
import Home from "./info/Home";
import Learn from "./info/Learn";
import Nextup from "./info/Nextup";
import Program, { programList } from "./info/Program";
import Teach from "./info/Teach";
import Footer from "./layout/Footer";
import Nav from "./layout/Nav";
import ChangeClassesDashboard from "./registration/ChangeClassesDashboard";
import DummyForm from "./registration/DummyForm";
import EmergencyInfoForm from "./registration/EmergencyInfoForm";
import RegDashboard from "./registration/RegDashboard";
import UpdateProfileForm from "./registration/UpdateProfileForm";

const NotFound = () => (
  <section className="pt-5 pb-5 container has-text-centered">
    <p>Invalid URL. Sorry, nothing here!</p>
    <p>
      Return to the <a href="/">homepage</a>.
    </p>
  </section>
);

function App(props: {}) {
  const [userInfo, setUserInfo] = useState({
    username: "",
    isStudent: false,
    isTeacher: false,
  });

  const existingToken = localStorage.getItem("token") || "";
  const [authToken, setAuthToken] = useState(existingToken);

  useEffect(() => {
    if (authToken) {
      axiosInstance.get(userDataEndpoint).then(result => {
        setUserInfo({
          username: result.data.username,
          isStudent: result.data.is_student,
          isTeacher: result.data.is_teacher,
        });
      });
    }
  }, [authToken]);

  function setToken(accessToken: string) {
    setAuthToken(accessToken);
  }

  // TODO (important): refactor login and logout logic out of the UI components
  // where they currently live

  return (
    <AuthContext.Provider value={{ token: authToken, ...userInfo }}>
      <Nav setToken={setToken} />
      <main className="px-3 py-5">
        <Router>
          {/* TODO: nest routes */}
          <Home path="/" />
          {/* TODO: better page than homepage? Notification of logout success? */}
          <Home path="logout" />
          <LoginPage path="login" username={userInfo.username} setToken={setToken} />
          <SignupPage path="signup" username={userInfo.username} setToken={setToken} />

          <Dashboard path="dashboard" />
          <AboutUs path="aboutus" />
          <Teach path="teach" />
          <Learn path="learn" />
          <Nextup path="next" />

          {/*TODO figure out how to move these routes elsewhere for better organization*/}

          <RegDashboard path="/:program/:edition/*" />
          {programList.map(program => (
            <Program key={program} path={program} program={program} />
          ))}
          <NotFound default />
        </Router>
      </main>
      <Footer />
    </AuthContext.Provider>
  );
}

export default App;
