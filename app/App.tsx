"use client";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import { CanvasConfig } from "./types";
import {
  getImageFromFile,
  drawImageB64OnCanvas,
  imageB64ToImageData,
} from "./imageProcessing";
import { BottomToolbar } from "./components/toolbar";
import { SideToolbar } from "./components/sideToolbar";
import { ImageContext } from "./providers/ImageProvider";
import { ProcessContext } from "./providers/ProcessProvider";
import { useContext } from "react";
import BorderProvider from "./providers/BorderProvider";
import ToolbarProvider from "./providers/ToolbarProvider";
import useWindowsSize from "./components/hooks/useWindowsSize";
import { Upload } from "lucide-react";
import UploadForm from "./components/UploadForm";
import SmallCanvas from "./components/SmallCanvas";

export const mainCanvasConfig: CanvasConfig = {
  maxWidth: 600,
  maxHeight: 600,
  margin: 32,
};

export default function App() {
  const { displays } = useContext(ImageContext);
  //console.log("inicio env:", process.env.BASE_URL);

  return (
    <div className="app-wrapper">
      <main data-testid="main" id="app" className={styles.main}>
        <section id="section__image">
          {displays.canvas && <SmallCanvas></SmallCanvas>}
          {displays.form && <UploadForm></UploadForm>}
        </section>

        <ToolbarProvider>
          <BorderProvider>
            <section id="section__toolbar">
              <SideToolbar></SideToolbar>
            </section>
            <section id="section__mobile">
              <BottomToolbar></BottomToolbar>
            </section>
          </BorderProvider>
        </ToolbarProvider>
      </main>
    </div>
  );
}
