import { Square } from "lucide-react";
import toolbar from "../toolbar.module.css";

export default function ButtonGrayscale({ onClick }: { onClick: () => void }) {
  return (
    <button
      title="Edit borders"
      className={toolbar.buttonWithIcon}
      onClick={onClick}
    >
      <svg className={toolbar.svgBW}
        xmlns="http://www.w3.org/2000/svg"
        fill="#eeeeee"
        height="16px"
        width="16"
        version="1.1"
        id="Layer_1"
        viewBox="0 0 512 512"
        enable-background="new 0 0 512 512"
      >
        <path d="M256,0C114.6,0,0,114.6,0,256s114.6,256,256,256s256-114.6,256-256S397.4,0,256,0z M256,469.3V42.7  c117.8,0,213.3,95.5,213.3,213.3C469.3,373.8,373.8,469.3,256,469.3z" />
      </svg>
      <span>B&W</span>
    </button>
  );
}
