"use client";
import styles from "./page.module.css";
import { AppConfig } from "./types";
import { BottomToolbar } from "./components/BottomToolbar";
import { SideToolbar } from "./components/sideToolbar/sideToolbar";
import { ImageContext } from "./providers/ImageProvider";
import { useContext } from "react";
import BorderProvider from "./providers/BorderProvider";
import ToolbarProvider from "./providers/ToolbarProvider";
import UploadForm from "./components/UploadForm";
import MainCanvas from "./components/MainCanvas";
import CollageCanvas from "./components/CollageCanvas";
import CollageProvider from "./providers/CollageProvider";

export const appConfig: AppConfig = {
  canvasMaxWidth: 600,
  canvasMaxHeight: 600,
  canvasMargin: 32,
  collagePreviewSize: 200,
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
        <CollageProvider>
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
        </CollageProvider>
      </main>
    </div>
  );
}
