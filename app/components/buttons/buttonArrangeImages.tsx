import { ArrowLeftRight } from "lucide-react";
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
      title="Discard changes"
      className={toolbar.buttonArrange}
      onClick={onClick}
    >
      {bottomToolbarDisplay.arrange && <span>Hide</span>}
      {!bottomToolbarDisplay.arrange && <span>Show</span>}

      <ArrowLeftRight></ArrowLeftRight>
    </button>
  );
}
