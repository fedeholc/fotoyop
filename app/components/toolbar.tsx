import { useState } from "react";
import toolbar from "./toolbar.module.css";
import { ArrowLeft } from "lucide-react";

export function ToolbarRow({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const classes = `${toolbar.row} ${className}`;
  return <div className={classes}>{children}</div>;
}

export function BottomToolbar() {
  const [toolbarDisplay, setToolbarDisplay] = useState({
    mainMenu: true,
    transform: false,
    border: false,
    borderPx: false,
  });

  const [inputBorderColor, setInputBorderColor] = useState<string>("#ffffff");
  const handleInputBorderColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputBorderColor(e.target.value);
  };

  return (
    <>
      {toolbarDisplay.borderPx && (
        <ToolbarRow className={toolbar.border__row}>
          <button
            onClick={() =>
              setToolbarDisplay({
                mainMenu: true,
                border: true,
                transform: false,
                borderPx: false,
              })
            }
            className={toolbar.buttonWithIcon}
          >
            <ArrowLeft size={20} color="rgb(0, 183, 255)"></ArrowLeft>
          </button>

          <div className={toolbar.borderRanges}>
            <input type="range" min="0"></input>
            <input type="number" min="0"></input>
            <div className="toolbar_row__units">px</div>
          </div>
        </ToolbarRow>
      )}

      {toolbarDisplay.border && (
        <ToolbarRow className={toolbar.border__row}>
          <button
            onClick={() =>
              setToolbarDisplay({
                mainMenu: true,
                border: false,
                transform: true,
                borderPx: false,
              })
            }
            className={toolbar.buttonWithIcon}
          >
            <ArrowLeft size={20} color="rgb(0, 183, 255)"></ArrowLeft>
          </button>
          <input
            id="inputBorderColorText"
            type="Text"
            min="0"
            value={inputBorderColor}
            onChange={handleInputBorderColor}
          />
          <input
            id="inputBorderColor"
            type="color"
            list="true"
            value={
              inputBorderColor
            } /* FIXME: ojo, cambiar el color via texto no afecta al selector de color, viceversa si */
            onChange={handleInputBorderColor}
          />
          <button>%</button>
          <button
            onClick={() =>
              setToolbarDisplay({
                mainMenu: true,
                border: false,
                transform: false,
                borderPx: true,
              })
            }
          >
            px
          </button>
        </ToolbarRow>
      )}
      {toolbarDisplay.transform && (
        <ToolbarRow>
          <button
            onClick={() =>
              setToolbarDisplay({
                mainMenu: true,
                border: true,
                transform: false,
                borderPx: false,
              })
            }
          >
            Border
          </button>
          <button>GrayScale</button>
        </ToolbarRow>
      )}
      {toolbarDisplay.mainMenu && (
        <ToolbarRow>
          <button>Download</button>
          <button>New Image</button>
          <button>Undo</button>
          <button
            onClick={() =>
              setToolbarDisplay({
                border: false,
                mainMenu: true,
                transform: true,
                borderPx: false,
              })
            }
          >
            Transform
          </button>
        </ToolbarRow>
      )}
    </>
  );
}
