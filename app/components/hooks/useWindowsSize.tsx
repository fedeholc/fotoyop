"use client";
import { DisplaySections, WindowsDimensions } from "@/app/types";
import { useState, useEffect } from "react";

export default function useWindowsSize(
  displays: DisplaySections,
  mobileToolbarRef: React.RefObject<HTMLDivElement>
) {
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
        mobileToolbarHeight: mobileToolbarRef.current?.clientHeight || 0,
        mobileToolbarWidth: mobileToolbarRef.current?.clientWidth || 0,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setWindowsSize({
      width: window.innerWidth,
      height: window.innerHeight,
      mobileToolbarHeight: mobileToolbarRef.current?.clientHeight || 0,
      mobileToolbarWidth: mobileToolbarRef.current?.clientWidth || 0,
    });
  }, [displays]);

  let windowWidth = 0;
  let windowHeight = 0;

  if (typeof window !== "undefined") {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
  }

  return {
    width: windowWidth,
    height: windowHeight,
    mobileToolbarHeight: mobileToolbarRef.current?.clientHeight || 0,
    mobileToolbarWidth: mobileToolbarRef.current?.clientWidth || 0,
  };
}
