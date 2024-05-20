import {
  ArrowLeftRight,
  PanelBottomClose,
  PanelBottomOpen,
  EyeOff,
} from "lucide-react";
import toolbar from "../BottomToolbar.module.css";
import { useContext } from "react";
import { ImageContext } from "@/app/providers/ImageProvider";

export default function ButtonArrangeImages({
  onClick,
}: {
  onClick: () => void;
}) {
  const { bottomToolbarDisplay } = useContext(ImageContext);

  return (
    <button
      title="Arange Images"
      className={toolbar.buttonArrange}
      onClick={onClick}
    >
      {bottomToolbarDisplay.arrange && <EyeOff>Hide</EyeOff>}
      {!bottomToolbarDisplay.arrange && <ArrowLeftRight>Show</ArrowLeftRight>}

      {/*   <ArrowLeftRight></ArrowLeftRight> */}
    </button>
  );
}
