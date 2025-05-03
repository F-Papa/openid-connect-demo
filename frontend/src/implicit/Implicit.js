import { useEffect } from "react";
import { BACKEND_URL } from "..";

export default function Implicit() {
  useEffect(() => {
    window.location.replace(`${BACKEND_URL}/auth/implicit`);
  }, []);

  return <div>Redirecting</div>;
}
