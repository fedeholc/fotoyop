import { DisplaySections, WindowsDimensions } from "@/app/types";
import { useState, useEffect } from "react";

export default function useWindowsSize(displays: DisplaySections) {
  const [windowsSize, setWindowsSize] = useState<WindowsDimensions>({
    width: 0,
    height: 0,
    mobileToolbarHeight: 0,
    mobileToolbarWidth: 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowsSize({
        width: window.innerWidth,
        height: window.innerHeight,
        mobileToolbarHeight:
          document.querySelector("#section__mobile")?.clientHeight || 0,
        mobileToolbarWidth:
          document.querySelector("#section__mobile")?.clientWidth || 0,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setWindowsSize({
      width: window.innerWidth,
      height: window.innerHeight,
      mobileToolbarHeight:
        document.querySelector("#section__mobile")?.clientHeight || 0,
      mobileToolbarWidth:
        document.querySelector("#section__mobile")?.clientWidth || 0,
    });
  }, [displays]);

  return windowsSize;
}
