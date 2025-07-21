import React from "react";
import { TailChase } from "ldrs/react";
import "ldrs/react/TailChase.css";

function loading() {
  return (
    <div className="flex min-h-screen justify-center items-center">
      <TailChase size="40" speed="1.75" color="black" />;
    </div>
  );
}

export default loading;
