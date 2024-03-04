"use client";
import App from "./App";
import ImageProvider from "./ImageProvider";
import ProcessProvider from "./ProcessProvider";
import BorderProvider from "./BorderProvider";

export default function Home() {
  return (
    <ImageProvider>
      <ProcessProvider>
        <BorderProvider>
          <App /> 
        </BorderProvider>
      </ProcessProvider>
    </ImageProvider>
  );
}
