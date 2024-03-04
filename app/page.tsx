"use client";
import App from "./App";
import ImageProvider from "./ImageProvider";
import ProcessProvider from "./ProcessProvider";

export default function Home() {
  return (
    <ImageProvider>
      <ProcessProvider>
        <App />
      </ProcessProvider>
    </ImageProvider>
  );
}
