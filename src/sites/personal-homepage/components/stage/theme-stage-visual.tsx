export function ThemeStageVisual() {
  return (
    <div aria-hidden="true" data-cstd-stage-visual className="absolute inset-0 overflow-hidden">
      <div className="cstd-stage-visual-image absolute inset-0" />
      <div data-cstd-stage-visual-wash className="absolute inset-0" />
      <div data-cstd-stage-visual-focus className="absolute inset-0" />
    </div>
  );
}
