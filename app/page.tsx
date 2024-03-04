"use client";
import App from "./App";
import ImageProvider from "./providers/ImageProvider";
import ProcessProvider from "./providers/ProcessProvider";
import BorderProvider from "./providers/BorderProvider";

export default function Home() {
  return (
    <ImageProvider>
      <ProcessProvider>
        <App />
      </ProcessProvider>
    </ImageProvider>
  );
}
