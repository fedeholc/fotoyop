import React, { useState } from "react";
import sideToolbar from "./sideToolbar.module.css";

export function ToolbarGroup({
  className = "",
  groupTitle = "",
  closedRendering = true,
  children,
}: {
  className?: string;
  groupTitle?: string;
  closedRendering?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const classes = `${sideToolbar.bordersGroup} ${className}`;

  /* el closeRendering está principalmente por el componente Changes History que cada vez que se hacía un cambio volvía a renderizar toda la undolist y se hacía muy lento. De esta forma cuando el details está cerrado no hace ese renderizado. 
  FIXME: de todos modos sigue siendo lento cuando se lo quiere ver por lo que habria que buscar alguna forma de reducir ese tiempo */

  if (closedRendering === true) {
    return (
      <details>
        <summary onClick={handleToggle}>{groupTitle}</summary>

        <div className={classes}>{children}</div>
      </details>
    );
  }

  if (closedRendering === false) {
    return (
      <details>
        <summary onClick={handleToggle}>{groupTitle}</summary>

        {isOpen && <div className={classes}>{children}</div>}
      </details>
    );
  }
}
