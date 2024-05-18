import React, { useContext, useState, useId } from "react";
import { BorderContext } from "@/app/providers/BorderProvider";

export default function BtBorderColorInputs() {
  const id = useId();
  const { inputBorderColor, handleInputBorderColor } =  useContext(BorderContext);
  return (
    <>
      <input
        id={`${id}inputBorderColorT`}
        type="Text"
        min="0"
        value={inputBorderColor}
        onChange={handleInputBorderColor}
      />
      <input
        id={`${id}inputBorderColor`}
        type="color"
        list="true"
        value={inputBorderColor}
        onChange={handleInputBorderColor}
      />
    </>
  );
}
