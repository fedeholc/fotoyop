"use client";
import styles from "./page.module.css";
import { CanvasConfig } from "./types";
import { BottomToolbar } from "./components/BottomToolbar";
import { SideToolbar } from "./components/sideToolbar";
import { ImageContext } from "./providers/ImageProvider";
import { useContext } from "react";
import BorderProvider from "./providers/BorderProvider";
import ToolbarProvider from "./providers/ToolbarProvider";
import UploadForm from "./components/UploadForm";
import MainCanvas from "./components/MainCanvas";
import CollageCanvas from "./components/CollageCanvas";

export const mainCanvasConfig: CanvasConfig = {
  maxWidth: 600,
  maxHeight: 600,
  margin: 32,
};

export default function App() {
  const { displays } = useContext(ImageContext);

  return (
    <div className="app-wrapper">
      <main data-testid="main" id="app" className={styles.main}>
        <section id="section__image">
          {displays.canvas && <MainCanvas></MainCanvas>}
          {displays.form && <UploadForm></UploadForm>}
          {displays.collage && <CollageCanvas></CollageCanvas>}
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
