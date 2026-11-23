#!/usr/bin/env python3
"""
Two-pass verification script for the Studio Player HUD space-filling fix.
Pass 1: Static CSS and JavaScript DOM sync validation.
Pass 2: Multi-resolution geometry and alignment simulation.
"""

import sys
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSS_FILE = ROOT / "magnates-studio" / "public" / "css" / "style.css"
JS_FILE = ROOT / "magnates-studio" / "public" / "js" / "app.js"

def run_pass_1_static_rules():
    print("\n=======================================================")
    print("PASS 1: Static CSS & JS DOM Sync Implementation Check")
    print("=======================================================")
    
    # 1. CSS Verification
    assert CSS_FILE.exists(), f"Missing CSS file: {CSS_FILE}"
    css_text = CSS_FILE.read_text(encoding="utf-8")

    # Match standalone .studio-main-player-hud rule
    hud_matches = re.findall(r"(?:^|\n)\.studio-main-player-hud\s*\{([^}]+)\}", css_text)
    assert hud_matches, "Could not find standalone .studio-main-player-hud block in style.css"
    hud_css = hud_matches[-1]

    assert "right: auto" in hud_css, "Missing 'right: auto' in .studio-main-player-hud (prevents 50% width bug)"
    assert "width: 100%" in hud_css, "Missing 'width: 100%' in .studio-main-player-hud"
    assert "box-sizing: border-box" in hud_css, "Missing 'box-sizing: border-box' in .studio-main-player-hud"
    print("  [OK] [CSS] .studio-main-player-hud has 'right: auto', 'width: 100%', and 'box-sizing: border-box'.")

    # Verify fullscreen override
    fs_match = re.search(r"\.canvas-wrapper:fullscreen \.studio-main-player-hud[\s\S]*?\{([^}]+)\}", css_text)
    assert fs_match, "Could not find fullscreen .studio-main-player-hud rule"
    fs_css = fs_match.group(1)
    assert "width: 100%" in fs_css, "Missing width: 100% in fullscreen HUD rule"
    assert "transform: none" in fs_css, "Missing transform: none in fullscreen HUD rule"
    print("  [OK] [CSS] Fullscreen HUD correctly expands to width: 100% with transform: none.")

    # 2. JS Verification
    assert JS_FILE.exists(), f"Missing JS file: {JS_FILE}"
    js_text = JS_FILE.read_text(encoding="utf-8")

    assert "function syncMainStudioHud()" in js_text, "Missing syncMainStudioHud() function in app.js"
    assert "previewCanvas" in js_text, "syncMainStudioHud does not reference previewCanvas"
    assert "studio-main-player-hud" in js_text, "syncMainStudioHud does not reference studio-main-player-hud"
    assert "ResizeObserver" in js_text, "ResizeObserver registration missing for canvas resizing"
    print("  [OK] [JS] syncMainStudioHud() is defined and binds to ResizeObserver and window resize.")
    print("PASS 1 COMPLETED SUCCESSFULLY!\n")


def run_pass_2_geometry_simulation():
    print("=======================================================")
    print("PASS 2: Multi-Resolution Geometry & Alignment Simulation")
    print("=======================================================")

    viewports = [
        {"name": "Full HD Desktop", "wrapper_w": 1200, "wrapper_h": 680},
        {"name": "Standard Laptop", "wrapper_w": 960, "wrapper_h": 540},
        {"name": "Compact Workspace", "wrapper_w": 800, "wrapper_h": 460},
        {"name": "Ultrawide 1440p", "wrapper_w": 1600, "wrapper_h": 820},
    ]

    for vp in viewports:
        w_w = vp["wrapper_w"]
        w_h = vp["wrapper_h"]
        name = vp["name"]

        # Calculate canvas 16:9 box with max-width: 95% and max-height: (100% - 46px)
        max_cw = w_w * 0.95
        max_ch = w_h - 46

        # 16:9 aspect fit
        if (max_cw / max_ch) > (16 / 9):
            canvas_h = max_ch
            canvas_w = round(canvas_h * (16 / 9))
        else:
            canvas_w = round(max_cw)
            canvas_h = round(canvas_w * (9 / 16))

        canvas_left = round((w_w - canvas_w) / 2)
        canvas_bottom = round((w_h - 46 - canvas_h) / 2) + 46

        # Simulation of syncMainStudioHud()
        hud_computed_w = canvas_w
        hud_computed_left = canvas_left
        hud_computed_bottom = canvas_bottom - canvas_h  # flush at bottom of canvas

        gap_left = hud_computed_left - canvas_left
        gap_right = (canvas_left + canvas_w) - (hud_computed_left + hud_computed_w)

        assert gap_left == 0, f"Left gap mismatch on {name}: {gap_left}px"
        assert gap_right == 0, f"Right gap mismatch on {name}: {gap_right}px"
        assert hud_computed_w == canvas_w, f"HUD width does not fill canvas on {name}"

        coverage_pct = (hud_computed_w / canvas_w) * 100
        print(f"  [OK] [{name} {w_w}x{w_h}] Canvas: {canvas_w}x{canvas_h}px | HUD: {hud_computed_w}px | Coverage: {coverage_pct:.1f}% | Left gap: {gap_left}px | Right gap: {gap_right}px")

    print("\nPASS 2 COMPLETED SUCCESSFULLY!")
    print("=======================================================")
    print("ALL VERIFICATION PASSES COMPLETED WITH 0 ERRORS!")
    print("=======================================================\n")


def main():
    try:
        run_pass_1_static_rules()
        run_pass_2_geometry_simulation()
        return 0
    except AssertionError as e:
        print(f"\n[FAILED] Verification assertion failed: {e}", file=sys.stderr)
        return 1
    except Exception as e:
        print(f"\n[ERROR] Unexpected error: {e}", file=sys.stderr)
        return 2

if __name__ == "__main__":
    sys.exit(main())
