import toolbar from "../BottomToolbar.module.css";

export default function ButtonBorderPc({ onClick }: { onClick: () => void }) {
  return (
    <button
      title="Edit border in percent"
      className={toolbar.buttonOnlyIcon}
      onClick={onClick}
    >
      %
    </button>
  );
}
