"use client";
import React, { useState } from "react";
import UsersQueryPage from "./UserQueryPage";
import CompanyQueryPage from "./CompanyQueryPage";

import { Button } from "@/components/ui/button";

interface FormValues {
  users: boolean;
  orgs: boolean;
}

function SearchLayout() {
  const [users, setUsers] = useState<boolean>(true);
  const [orgs, setOrgs] = useState<boolean>(false);

  const handleCheckboxChange = (name: keyof FormValues) => {
    if (name === "users" && !users) {
      setUsers(true);
      setOrgs(false);
    } else if (name === "orgs" && !orgs) {
      setUsers(false);
      setOrgs(true);
    }
  };
  return (
    <>
      <div className=" flex flex-row justify-center items-center gap-8">
        <Button
          className={`text-white ${users ? "bg-blue-500" : ""} `}
          onClick={() => handleCheckboxChange("users")}
        >
          User
        </Button>
        <Button
          className={`text-white ${orgs ? "bg-blue-500" : ""} `}
          onClick={() => handleCheckboxChange("orgs")}
        >
          Organisation
        </Button>
      </div>

      <div>
        {users && (
          <div>
            {" "}
            <UsersQueryPage />{" "}
          </div>
        )}
        {orgs && (
          <div>
            {" "}
            <CompanyQueryPage />
          </div>
        )}
      </div>
    </>
  );
}

export default SearchLayout;
