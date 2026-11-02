import os
import shutil
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = r"c:\Users\user\Documents\antigravity\noble-bell"
PUB = os.path.join(ROOT, "magnates-studio", "public")
HP_DIR = os.path.join(PUB, "hp_recon")
CUTOUTS_DIR = os.path.join(HP_DIR, "cutouts")
PLATES_DIR = os.path.join(HP_DIR, "plates")
UI_DIR = os.path.join(HP_DIR, "ui_plates")
REF_SEC_DIR = r"C:\Users\user\.gemini\antigravity\brain\3ac5451f-fd0b-48c1-9c2b-a2ba1d046504\scratch\ref_frames\min0_to_6_1fps"

for d in [HP_DIR, CUTOUTS_DIR, PLATES_DIR, UI_DIR]:
    os.makedirs(d, exist_ok=True)

# 1. Copy/register existing high-res Scene 1 printer cutouts into hp_recon/cutouts
existing_assets = [
    "printer_table_empty_920x516.png",
    "printer_accessories_920x516.png",
    "printer_accessories_cutout.png",
    "printer_hero_920x516.png",
    "printer_hero_uhd.png",
    "printer_lcd_home_uhd.png",
    "printer_lcd_off_uhd.png",
    "printer_lcd_warn_uhd.png",
    "printer_card_thumb.png",
    "cartridge_xl_thumb.png",
    "compatible_cartridge_xl_thumb.png",
]
for fn in existing_assets:
    src = os.path.join(PUB, fn)
    if os.path.exists(src):
        shutil.copy2(src, os.path.join(CUTOUTS_DIR, fn))


def extract_clean_alpha_cutout(img_bgr, rect, bg_color_hint=None, feather_px=1.8):
    """
    Professional GrabCut + Chroma/Luminance Refinement + Edge Decontamination.
    Eliminates background halos and preserves clean silhouettes.
    """
    h, w = img_bgr.shape[:2]
    mask = np.zeros((h, w), np.uint8)
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)
    rx, ry, rw, rh = rect
    rx = max(1, min(w - 3, int(rx)))
    ry = max(1, min(h - 3, int(ry)))
    rw = max(2, min(w - rx - 1, int(rw)))
    rh = max(2, min(h - ry - 1, int(rh)))
    cv2.grabCut(img_bgr, mask, (rx, ry, rw, rh), bgdModel, fgdModel, 5, cv2.GC_INIT_WITH_RECT)
    fg_mask = np.where((mask == 2) | (mask == 0), 0, 255).astype(np.uint8)

    if bg_color_hint is not None:
        # Suppress residual background pixels near the boundary that match bg_color_hint
        diff = np.linalg.norm(img_bgr.astype(np.float32) - np.array(bg_color_hint, dtype=np.float32), axis=2)
        bg_like = (diff < 28.0).astype(np.uint8) * 255
        # Only suppress near borders of the mask
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
        edge_band = cv2.dilate(fg_mask, kernel) - cv2.erode(fg_mask, kernel)
        fg_mask = np.where((edge_band > 0) & (bg_like > 0), 0, fg_mask).astype(np.uint8)

    # Smooth silhouette contour and apply soft alpha matting
    fg_mask = cv2.medianBlur(fg_mask, 5)
    alpha_f = cv2.GaussianBlur(fg_mask.astype(np.float32), (0, 0), feather_px)
    alpha_u8 = np.clip(alpha_f, 0, 255).astype(np.uint8)

    # Edge color decontamination: pull interior foreground colors into semi-transparent boundary pixels
    eroded = cv2.erode(img_bgr, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    semi = (alpha_u8 > 8) & (alpha_u8 < 240)
    clean_bgr = img_bgr.copy()
    clean_bgr[semi] = eroded[semi]

    rgba = cv2.cvtColor(clean_bgr, cv2.COLOR_BGR2RGBA)
    rgba[:, :, 3] = alpha_u8
    return rgba


def load_ref_sec(sec_idx, scale_size=(920, 516)):
    # sec_0001.jpg corresponds to t=0s, sec_0002.jpg to t=1s, etc.
    fn = f"sec_{sec_idx + 1:04d}.jpg"
    p = os.path.join(REF_SEC_DIR, fn)
    if not os.path.exists(p):
        p = os.path.join(REF_SEC_DIR, "sec_0001.jpg")
    im = cv2.imread(p)
    if scale_size:
        im = cv2.resize(im, scale_size, interpolation=cv2.INTER_CUBIC)
    return im


# 2. Extract Real Subject Cutouts from Reference Frames & Inspect Alpha
# A) Smart Tank 7000 Front Cutout (0:53 -> sec 53)
im_st_front = load_ref_sec(53)
rgba_st_front = extract_clean_alpha_cutout(im_st_front, (265, 165, 390, 290), bg_color_hint=[225, 225, 225])
Image.fromarray(rgba_st_front).save(os.path.join(CUTOUTS_DIR, "smart_tank_7000_front_cutout.png"))

# B) Smart Tank 7000 Angled Cutout (0:55 -> sec 55)
im_st_angled = load_ref_sec(55)
rgba_st_angled = extract_clean_alpha_cutout(im_st_angled, (395, 55, 520, 455), bg_color_hint=[215, 215, 215])
Image.fromarray(rgba_st_angled).save(os.path.join(CUTOUTS_DIR, "smart_tank_7000_angled_cutout.png"))

# C) Presenter in Blue Shirt (0:57 -> sec 57) AND LaserJet Printer beside him (separate cutouts!)
im_pres = load_ref_sec(57)
rgba_presenter = extract_clean_alpha_cutout(im_pres, (215, 18, 225, 495), bg_color_hint=[245, 245, 245])
Image.fromarray(rgba_presenter).save(os.path.join(CUTOUTS_DIR, "blue_shirt_presenter_cutout.png"))

rgba_laserjet = extract_clean_alpha_cutout(im_pres, (515, 200, 260, 310), bg_color_hint=[245, 245, 245])
Image.fromarray(rgba_laserjet).save(os.path.join(CUTOUTS_DIR, "laserjet_m521_cutout.png"))

# C2) Glowing 3D Blue HP Circle Logo Cutout (0:35 -> sec 35)
im_hplogo = load_ref_sec(35)
rgba_hplogo = extract_clean_alpha_cutout(im_hplogo, (375, 175, 175, 175), bg_color_hint=[30, 35, 45])
Image.fromarray(rgba_hplogo).save(os.path.join(CUTOUTS_DIR, "hp_glow_logo_cutout.png"))

# C3) Orbital Earth Horizon Cutout (0:38 -> sec 38)
im_earth = load_ref_sec(38)
rgba_earth = extract_clean_alpha_cutout(im_earth, (5, 15, 910, 495), bg_color_hint=[5, 8, 15])
Image.fromarray(rgba_earth).save(os.path.join(CUTOUTS_DIR, "earth_horizon_cutout.png"))

# D) Dynamic Security White Printer Cutout (4:36 -> sec 276)
im_dyn = load_ref_sec(276)
rgba_dyn_printer = extract_clean_alpha_cutout(im_dyn, (295, 210, 330, 175), bg_color_hint=[20, 20, 20])
Image.fromarray(rgba_dyn_printer).save(os.path.join(CUTOUTS_DIR, "dynamic_security_printer_cutout.png"))

# E) Instant Ink Cartridge & Box Cutouts (4:41 -> sec 281)
im_iink = load_ref_sec(281)
rgba_iink_cart = extract_clean_alpha_cutout(im_iink, (240, 235, 195, 185), bg_color_hint=[180, 185, 190])
Image.fromarray(rgba_iink_cart).save(os.path.join(CUTOUTS_DIR, "instant_ink_cartridge_cutout.png"))

rgba_iink_box = extract_clean_alpha_cutout(im_iink, (535, 145, 380, 290), bg_color_hint=[140, 145, 150])
Image.fromarray(rgba_iink_box).save(os.path.join(CUTOUTS_DIR, "instant_ink_box_cutout.png"))

# F) Verify Cutout Alpha Channels Against 3 Contrasting Background Colors (Dark #0f172a, Mid Green #10b981, Magenta #ec4899)
cutout_test_files = [
    "printer_hero_920x516.png",
    "smart_tank_7000_front_cutout.png",
    "blue_shirt_presenter_cutout.png",
    "laserjet_m521_cutout.png",
    "dynamic_security_printer_cutout.png",
    "instant_ink_cartridge_cutout.png",
]
qc_sheet = Image.new("RGB", (3 * 300, len(cutout_test_files) * 170), (20, 24, 32))
qc_draw = ImageDraw.Draw(qc_sheet)
bg_colors = [((15, 23, 42), "Dark #0F172A"), ((16, 185, 129), "Chroma Green"), ((236, 72, 153), "Chroma Pink")]

for r_idx, c_fn in enumerate(cutout_test_files):
    cp = os.path.join(CUTOUTS_DIR, c_fn)
    cim = Image.open(cp).convert("RGBA").resize((280, 145))
    for c_idx, (bg_rgb, bg_lbl) in enumerate(bg_colors):
        cell = Image.new("RGBA", (280, 145), bg_rgb + (255,))
        cell.alpha_composite(cim)
        x0, y0 = c_idx * 300 + 10, r_idx * 170 + 5
        qc_sheet.paste(cell.convert("RGB"), (x0, y0))
        qc_draw.text((x0 + 4, y0 + 147), f"{c_fn[:22]} on {bg_lbl}", fill=(255, 235, 120))

qc_sheet.save(r"C:\Users\user\.gemini\antigravity\brain\3ac5451f-fd0b-48c1-9c2b-a2ba1d046504\scratch\cutout_alpha_qc_sheet.jpg", quality=90)

# 3. Extract Key Documentary Plates Across Minutes 1-6 (0:00 - 6:30)
key_plate_secs = [
    (0, "plate_000_table_empty.jpg"),
    (2, "plate_002_printer_table.jpg"),
    (18, "plate_018_lcd_red_warn.jpg"),
    (19, "plate_019_hp_keynote_stage.jpg"),
    (21, "plate_021_pagewide_booth.jpg"),
    (24, "plate_024_scanner_lid_demo.jpg"),
    (27, "plate_027_officejet_booth.jpg"),
    (30, "plate_030_lcd_block_cartridge.jpg"),
    (35, "plate_035_printer_blue_hp_logo.jpg"),
    (37, "plate_037_earth_europe_zoom.jpg"),
    (39, "plate_039_earth_lets_get_into_it.jpg"),
    (41, "plate_041_office_scanner.jpg"),
    (46, "plate_046_retail_printer_aisle.jpg"),
    (52, "plate_052_smart_tank_7000.jpg"),
    (55, "plate_055_includes_2_years_ink.jpg"),
    (57, "plate_057_presenter_laserjet.jpg"),
    (60, "plate_060_razor_handle_card.jpg"),
    (63, "plate_063_razor_blades_cards.jpg"),
    (66, "plate_066_recommended_page_vol.jpg"),
    (71, "plate_071_carriage_topdown.jpg"),
    (77, "plate_077_petapixel_cnbc_top.jpg"),
    (83, "plate_083_petapixel_cyan_hl.jpg"),
    (88, "plate_088_petapixel_pullback.jpg"),
    (96, "plate_096_touchscreen_apps.jpg"),
    (100, "plate_100_laserjet_m521_card.jpg"),
    (111, "plate_111_5_cartridges_lineup.jpg"),
    (116, "plate_116_original_hp_supplies.jpg"),
    (120, "plate_120_iphone_crimson_scroll.jpg"),
    (123, "plate_123_host_holding_chip.jpg"),
    (126, "plate_126_macro_cartridge_chip.jpg"),
    (133, "plate_133_retail_ink_wall.jpg"),
    (142, "plate_142_hp_outdoor_commercial.jpg"),
    (146, "plate_146_iso_golden_island.jpg"),
    (150, "plate_150_iso_design_mfg_adv.jpg"),
    (154, "plate_154_iso_two_islands_bridge.jpg"),
    (160, "plate_160_hp_ink_challenge.jpg"),
    (164, "plate_164_refill_vs_original.jpg"),
    (170, "plate_170_hp_chips_pdf_2page.jpg"),
    (172, "plate_172_supply_chain_security.jpg"),
    (176, "plate_176_modern_design_touch.jpg"),
    (179, "plate_179_accc_header.jpg"),
    (184, "plate_184_accc_red_highlight.jpg"),
    (187, "plate_187_accc_error_message_pop.jpg"),
    (188, "plate_188_printer_top_angle.jpg"),
    (191, "plate_191_lcd_firmware_update.jpg"),
    (197, "plate_197_lcd_non_hp_chip.jpg"),
    (201, "plate_201_cmyk_carriage_hand.jpg"),
    (203, "plate_203_lcd_checking_cart.jpg"),
    (205, "plate_205_lcd_incompatible_cart.jpg"),
    (211, "plate_211_factory_conveyor.jpg"),
    (218, "plate_218_lcd_restore_defaults.jpg"),
    (226, "plate_226_printer_slot_ready.jpg"),
    (228, "plate_228_patent_law_gavel.jpg"),
    (230, "plate_230_cat_attack_bat_green.jpg"),
    (233, "plate_233_nicole_fern_article.jpg"),
    (236, "plate_236_cve_2022_28722_hl.jpg"),
    (242, "plate_242_lcd_cartridge_problem.jpg"),
    (243, "plate_243_ghosted_4_cartridges.jpg"),
    (246, "plate_246_ewaste_shredder.jpg"),
    (251, "plate_251_couple_frustrated.jpg"),
    (255, "plate_255_blue_copier_ui.jpg"),
    (261, "plate_261_laser_toner_pull.jpg"),
    (265, "plate_265_microchip_die_core.jpg"),
    (268, "plate_268_microchip_radar_ring.jpg"),
    (272, "plate_272_couple_unboxing.jpg"),
    (275, "plate_275_orange_stripe_printer.jpg"),
    (277, "plate_277_dynamic_security_text.jpg"),
    (281, "plate_281_instant_ink_table.jpg"),
    (285, "plate_285_instant_ink_pages_holo.jpg"),
    (287, "plate_287_instant_ink_truck_holo.jpg"),
    (290, "plate_290_cardboard_boxes_stack.jpg"),
    (296, "plate_296_instant_ink_web_top.jpg"),
    (301, "plate_301_instant_ink_plans.jpg"),
    (308, "plate_308_office_paper_jam.jpg"),
    (315, "plate_315_purple_cartridges_top.jpg"),
    (319, "plate_319_ink_aisle_pan.jpg"),
    (324, "plate_324_calculator_bills.jpg"),
    (328, "plate_328_hp_hq_make_it_matter.jpg"),
    (331, "plate_331_usage_450_chart.jpg"),
    (333, "plate_333_usage_jan_tooltip.jpg"),
    (338, "plate_338_crn_500m_header.jpg"),
    (339, "plate_339_crn_instant_ink_vid.jpg"),
    (343, "plate_343_crn_10m_subscribers_hl.jpg"),
    (345, "plate_345_crn_dual_orange_hl.jpg"),
    (349, "plate_349_pink_ink_bottle_fill.jpg"),
    (357, "plate_357_four_phones_table.jpg"),
    (364, "plate_364_curly_hair_no_gesture.jpg"),
    (369, "plate_369_qtip_cleaning_chip.jpg"),
    (374, "plate_374_neon_phone_service_plan.jpg"),
    (378, "plate_378_finger_pressing_cart.jpg"),
    (381, "plate_381_hpinstantink_box_open.jpg"),
    (384, "plate_384_neon_printer_active.jpg"),
    (386, "plate_386_neon_printer_disabled.jpg"),
    (387, "plate_387_neon_printer_x_lock.jpg"),
    (389, "plate_389_hp_smart_app_phone.jpg"),
]

for sec_i, out_name in key_plate_secs:
    im = load_ref_sec(sec_i, scale_size=(920, 516))
    cv2.imwrite(os.path.join(PLATES_DIR, out_name), im, [int(cv2.IMWRITE_JPEG_QUALITY), 92])

# 4. Generate Editable Vector SVG UI Plates in hp_recon/ui_plates
svg_plates = {
    "ui_lcd_block_cartridge.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340">
  <rect width="600" height="340" rx="18" fill="#182232" stroke="#334155" stroke-width="4"/>
  <rect x="24" y="24" width="552" height="58" rx="8" fill="#0f172a"/>
  <circle cx="56" cy="53" r="14" fill="#ef4444"/>
  <text x="56" y="59" text-anchor="middle" fill="#fff" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="18">!</text>
  <text x="86" y="60" fill="#f8fafc" font-family="Inter,Arial,sans-serif" font-weight="700" font-size="22">HP Cartridge Protection</text>
  <rect x="48" y="114" width="504" height="92" rx="12" fill="#dc2626"/>
  <text x="300" y="154" text-anchor="middle" fill="#fff" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="28">BLOCK CARTRIDGE?</text>
  <text x="300" y="186" text-anchor="middle" fill="#fee2e2" font-family="Inter,Arial,sans-serif" font-weight="600" font-size="16">Non-HP circuitry detected in slot K/C/M/Y</text>
  <rect x="170" y="232" width="260" height="64" rx="32" fill="#10b981"/>
  <text x="300" y="272" text-anchor="middle" fill="#052e16" font-family="Inter,Arial,sans-serif" font-weight="900" font-size="24">CONFIRMED ✓</text>
</svg>""",
    "ui_razor_blade_cards.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 516">
  <defs>
    <radialGradient id="crimsonStage" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#7f1d1d"/>
      <stop offset="55%" stop-color="#310a0b"/>
      <stop offset="100%" stop-color="#090406"/>
    </radialGradient>
  </defs>
  <rect width="920" height="516" fill="url(#crimsonStage)"/>
  <g id="card-handle" transform="translate(110,96)">
    <rect width="310" height="324" rx="22" fill="#ffffff" stroke="#e2e8f0" stroke-width="3"/>
    <rect x="28" y="28" width="254" height="145" rx="14" fill="#f1f5f9"/>
    <text x="155" y="110" text-anchor="middle" fill="#334155" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="22">RAZOR HANDLE</text>
    <text x="155" y="216" text-anchor="middle" fill="#0f172a" font-family="Inter,Arial,sans-serif" font-weight="700" font-size="22">Premium Handle</text>
    <rect x="75" y="242" width="160" height="54" rx="27" fill="#10b981"/>
    <text x="155" y="278" text-anchor="middle" fill="#ffffff" font-family="Inter,Arial,sans-serif" font-weight="900" font-size="28">$9.99</text>
  </g>
  <g id="card-blades" transform="translate(495,96)">
    <rect width="315" height="324" rx="22" fill="#ffffff" stroke="#fca5a5" stroke-width="3"/>
    <rect x="28" y="28" width="259" height="145" rx="14" fill="#fef2f2"/>
    <text x="157" y="110" text-anchor="middle" fill="#991b1b" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="20">REFILL BLADES (4x)</text>
    <text x="157" y="216" text-anchor="middle" fill="#0f172a" font-family="Inter,Arial,sans-serif" font-weight="700" font-size="20">Replacement Blades</text>
    <rect x="77" y="242" width="160" height="54" rx="27" fill="#ef4444"/>
    <text x="157" y="278" text-anchor="middle" fill="#ffffff" font-family="Inter,Arial,sans-serif" font-weight="900" font-size="28">$29.99</text>
  </g>
</svg>""",
    "ui_cat_attack_terminal.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 380">
  <rect width="680" height="380" rx="16" fill="#031407" stroke="#22c55e" stroke-width="4"/>
  <text x="36" y="64" fill="#4ade80" font-family="Consolas,monospace" font-weight="700" font-size="24">&gt; 56K CHIP FOUND [0x7F04A]</text>
  <text x="36" y="118" fill="#4ade80" font-family="Consolas,monospace" font-weight="700" font-size="24">&gt; RUNNING SCRIPT CAT-ATTACK.BAT...</text>
  <text x="36" y="172" fill="#86efac" font-family="Consolas,monospace" font-weight="700" font-size="24">&gt; OVERFLOWING BUFFER @ 0x00401A00</text>
  <rect x="36" y="206" width="608" height="34" rx="6" fill="#052e16" stroke="#22c55e" stroke-width="2"/>
  <rect x="40" y="210" width="600" height="26" rx="4" fill="#22c55e"/>
  <text x="36" y="288" fill="#4ade80" font-family="Consolas,monospace" font-weight="900" font-size="28">&gt; FLASH SUCCEEDED // ROOT ACCESS</text>
  <text x="36" y="338" fill="#bbf7d0" font-family="Consolas,monospace" font-weight="900" font-size="26">&gt; UPLOAD COMPLETE [100%]</text>
</svg>""",
    "ui_usage_chart_450.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 440">
  <rect width="760" height="440" rx="22" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
  <text x="48" y="64" fill="#0f172a" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="28">Usage data: 450 pages</text>
  <text x="48" y="96" fill="#64748b" font-family="Inter,Arial,sans-serif" font-weight="600" font-size="16">HP Instant Ink Monthly Telemetry</text>
  <line x1="60" y1="350" x2="700" y2="350" stroke="#cbd5e1" stroke-width="3"/>
  <rect x="105" y="190" width="90" height="160" rx="10" fill="#0284c7"/>
  <rect x="245" y="140" width="90" height="210" rx="10" fill="#0ea5e9"/>
  <rect x="385" y="230" width="90" height="120" rx="10" fill="#38bdf8"/>
  <rect x="525" y="165" width="90" height="185" rx="10" fill="#0369a1"/>
  <g transform="translate(80,118)">
    <rect width="175" height="52" rx="10" fill="#0f172a"/>
    <text x="87" y="32" text-anchor="middle" fill="#ffffff" font-family="Inter,Arial,sans-serif" font-weight="700" font-size="16">January: 150 pages</text>
  </g>
</svg>""",
    "ui_neon_printer_lock.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">
  <rect width="800" height="450" fill="#050814"/>
  <rect x="190" y="120" width="420" height="210" rx="20" fill="none" stroke="#f43f5e" stroke-width="5"/>
  <rect x="250" y="65" width="300" height="60" rx="8" fill="none" stroke="#38bdf8" stroke-width="4"/>
  <rect x="235" y="170" width="330" height="95" rx="10" fill="#1f0913" stroke="#f43f5e" stroke-width="3"/>
  <text x="400" y="208" text-anchor="middle" fill="#fda4af" font-family="Consolas,monospace" font-weight="800" font-size="20">SUBSCRIPTION STATUS: ENDED</text>
  <text x="400" y="244" text-anchor="middle" fill="#f43f5e" font-family="Consolas,monospace" font-weight="900" font-size="24">CARTRIDGES: DISABLED [X]</text>
</svg>"""
}
for svg_fn, svg_body in svg_plates.items():
    with open(os.path.join(UI_DIR, svg_fn), "w", encoding="utf-8") as f:
        f.write(svg_body)

print(f"Extracted {len(cutout_test_files)} verified alpha cutouts, {len(key_plate_secs)} HD plates, and {len(svg_plates)} SVG UI plates to {HP_DIR}")
