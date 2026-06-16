import { useEffect } from "react";

// Best-effort screenshot / screen-capture deterrents for paid content.
//
// IMPORTANT: No website can 100% block screenshots (the OS/hardware can always
// capture the screen). This makes casual screenshots much harder by:
//  - blurring the protected content when the window loses focus / tab hides
//  - clearing the clipboard on PrintScreen
//  - blocking right-click, copy, cut, and common save/print/devtools shortcuts
//  - disabling text selection & dragging on the protected area
//
// Apply it by wrapping protected content and calling useScreenshotGuard(true).
export default function useScreenshotGuard(active = true) {
  useEffect(() => {
    if (!active) return;

    const addBlur = () => document.body.classList.add("sg-blur");
    const removeBlur = () => document.body.classList.remove("sg-blur");

    // Blur when the user switches tabs / minimizes (common before a screenshot).
    const onVisibility = () =>
      document.hidden ? addBlur() : removeBlur();
    const onBlurWin = () => addBlur();
    const onFocusWin = () => removeBlur();

    // Block context menu (right-click "Save image", "Inspect", etc.).
    const onContextMenu = (e) => e.preventDefault();

    // Block copy / cut / drag of protected content.
    const onCopy = (e) => e.preventDefault();
    const onCut = (e) => e.preventDefault();
    const onDragStart = (e) => e.preventDefault();

    // Block PrintScreen + common shortcuts; try to wipe the clipboard.
    const onKeyDown = (e) => {
      const key = (e.key || "").toLowerCase();

      // PrintScreen
      if (key === "printscreen") {
        wipeClipboard();
        addBlur();
        setTimeout(removeBlur, 1500);
        e.preventDefault();
        return;
      }

      // Ctrl/Cmd + S (save), P (print), C (copy), U (view source)
      if (
        (e.ctrlKey || e.metaKey) &&
        ["s", "p", "c", "u"].includes(key)
      ) {
        e.preventDefault();
        return;
      }

      // DevTools: F12, Ctrl+Shift+I/J/C
      if (
        key === "f12" ||
        ((e.ctrlKey || e.metaKey) &&
          e.shiftKey &&
          ["i", "j", "c"].includes(key))
      ) {
        e.preventDefault();
        return;
      }

      // macOS screenshot: Cmd+Shift+3 / 4 / 5
      if (e.metaKey && e.shiftKey && ["3", "4", "5"].includes(key)) {
        addBlur();
        setTimeout(removeBlur, 1500);
        e.preventDefault();
      }
    };

    const wipeClipboard = () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText("");
        }
      } catch (_) {
        /* ignore */
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlurWin);
    window.addEventListener("focus", onFocusWin);
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("copy", onCopy);
    document.addEventListener("cut", onCut);
    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      removeBlur();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlurWin);
      window.removeEventListener("focus", onFocusWin);
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("cut", onCut);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);
}
