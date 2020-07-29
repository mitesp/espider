import { Link } from "@reach/router";
import React, { useState, useEffect } from "react";

import { adminDashboardEndpoint } from "../apiEndpoints";
import axiosInstance from "../axiosAPI";
import { useAuth } from "../context/auth";
import { generalPage } from "../layout/Page";

type Program = {
  name: string;
  url: string;
};

export default function AdminDashboard(props: {}) {
  const { username } = useAuth();
  const [programs, setPrograms] = useState([] as Program[]);
  const [previousPrograms, setPreviousPrograms] = useState([] as Program[]);

  useEffect(() => {
    axiosInstance.get(adminDashboardEndpoint).then(res => {
      setPrograms(res.data.current);
      setPreviousPrograms(res.data.previous);
    });
  }, []);

  return generalPage(`Admin Dashboard | MIT ESP`)(
    <div className="container">
      <h1 className="has-text-centered is-size-2">Admin Dashboard for {username}</h1>
      <div className="columns">
        <div className="column is-6 is-offset-3">
          <h2 className="has-text-centered is-size-3">Active Programs</h2>
          {programs.map((program, index) => {
            return (
              <h3 className="is-size-5" key={index}>
                {program.name}: <Link to={`/${program.url}/dashboard`}>Go to Dashboard</Link>
              </h3>
            );
          })}
          <br />
          <h2 className="has-text-centered is-size-3">Previous Programs</h2>
          {previousPrograms.map((program, index) => {
            return (
              <h3 className="is-size-5" key={index}>
                {program.name}: <Link to={`/${program.url}/dashboard`}>View</Link>
              </h3>
            );
          })}
        </div>
      </div>
    </div>
  );
}
