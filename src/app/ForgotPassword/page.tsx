import Forgot from "./Forgot";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function page() {
  return <Forgot />;
}
