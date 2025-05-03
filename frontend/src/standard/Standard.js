import { useEffect } from "react";
import { BACKEND_URL } from "..";

export default function Standard() {
  useEffect(() => {
    window.location.replace(`${BACKEND_URL}/auth/code`);
  }, []);

  return <div>Redirecting</div>;
}
