/* ==========================================================================
   REGAARDER MOTION / MAGNATES STUDIO — HP DOCUMENTARY RECONSTRUCTION ENGINE
   Reference: "La merecida muerte de las impresoras HP" — Mundo Startup
   Scope: 10 Editable Chapters (0:00.0 - 6:30.0 / 390.0s @ 29.97fps)
   Scene Graph Hierarchy:
     Scene -> Camera -> Background -> Environment -> Subjects -> Props
           -> Foreground -> Lighting -> Effects -> Typography -> Audio
   ========================================================================== */
(function () {
  'use strict';

  const HP_CHAPTER_DEFS = [
    {
      id: 'printer_glitch_card',
      chapterIndex: 1,
      code: 'CH01',
      title: 'Ch 1 (0:00–0:19): Studio Printer, 0:05 Light-Slit Unfold & LCD Warning',
      shortTitle: 'Ch 1 · 0:05 Unfold & LCD',
      startSec: 0.0,
      endSec: 18.8,
      duration: 18.8,
      hudPreset: 'HP CH 1 (0:00–0:18.8) // 0:05 SLIT UNFOLD & 4x LCD WARNING',
      thumb: '/hp_recon/plates/plate_s006.jpg',
      audioCueSummary: '0.08s Luma Glitch Snap · 4.90s Slit Whoosh · 5.00s Card Unfold · 6.00s Strike Tick · 8.55s Beam Flash · 13.80s Cursor Click · 15.80s 4x Red Alarm Beep'
    },
    {
      id: 'hp_ch2_block_earth',
      chapterIndex: 2,
      code: 'CH02',
      title: 'Ch 2 (0:19–0:40): Block Cartridge UI, Glowing HP Logo & Orbital Earth',
      shortTitle: 'Ch 2 · Block UI & Earth',
      startSec: 18.8,
      endSec: 39.9,
      duration: 21.1,
      hudPreset: 'HP CH 2 (0:18.8–0:39.9) // BLOCK CARTRIDGE UI -> HP GLOW -> ORBITAL EARTH',
      thumb: '/hp_recon/plates/plate_s035.jpg',
      audioCueSummary: '28.8s UI Pop · 30.8s Confirm Chime · 32.0s Deep Bass Boom · 37.0s Space Whoosh · 38.0s Kinetic Type Riser',
      cameraKeyframes: [
        { t: 0.0, scale: 1.0, x: 0, y: 0, rot: 0, ease: 'easeOutCubic' },
        { t: 10.0, scale: 1.32, x: -4, y: -3, rot: 0, ease: 'easeInOutQuad' },
        { t: 13.0, scale: 1.0, x: 0, y: 0, rot: 0, ease: 'easeOutCubic' },
        { t: 18.0, scale: 0.92, x: 0, y: 4, rot: 0, ease: 'easeInOutCubic' }
      ],
      layers: [
        {
          id: 'ch2_bg_montage',
          category: 'Background',
          label: 'Keynote & Trade-Show Plate Sequence',
          type: 'plate_sequence',
          inTime: 0.0,
          outTime: 10.0,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 2,
          plates: [
            { t: 0.0, url: '/hp_recon/plates/plate_s020.jpg' },
            { t: 2.5, url: '/hp_recon/plates/plate_s022.jpg' },
            { t: 5.5, url: '/hp_recon/plates/plate_s025.jpg' },
            { t: 8.0, url: '/hp_recon/plates/plate_s027.jpg' }
          ]
        },
        {
          id: 'ch2_env_lcd_macro',
          category: 'Environment',
          label: 'Macro Printer LCD Plate (0:29–0:32)',
          type: 'plate_sequence',
          inTime: 10.0,
          outTime: 13.0,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 4,
          plates: [
            { t: 10.0, url: '/hp_recon/plates/plate_s029.jpg' },
            { t: 11.2, url: '/hp_recon/plates/plate_s030.jpg' },
            { t: 12.0, url: '/hp_recon/plates/plate_s031.jpg' }
          ]
        },
        {
          id: 'ch2_prop_block_ui',
          category: 'Props',
          label: 'Interactive LCD "Block Cartridge -> Confirmed" Card',
          type: 'lcd_block_ui',
          inTime: 10.0,
          outTime: 13.0,
          x: 52,
          y: 48,
          scale: 100,
          rotation: -2,
          opacity: 100,
          zIndex: 12,
          text: 'Block Cartridge',
          subtext: 'Confirmed',
          accentColor: '#10b981',
          bgColor: '#0f172a',
          confirmAt: 11.8
        },
        {
          id: 'ch2_subj_hp_glow',
          category: 'Subjects',
          label: 'Studio Printer & 3D Glowing HP Circle Logo',
          type: 'cutout_composite',
          inTime: 13.0,
          outTime: 18.0,
          x: 50,
          y: 48,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 14,
          bgPlate: '/hp_recon/plates/plate_s035.jpg',
          cutoutUrl: '/hp_recon/cutouts/hp_glow_logo_cutout.png',
          glowColor: '#38bdf8',
          glowIntensity: 85
        },
        {
          id: 'ch2_env_orbital_earth',
          category: 'Environment',
          label: 'Orbital Earth Horizon Pull-Back (0:37–0:40)',
          type: 'cutout_composite',
          inTime: 18.0,
          outTime: 21.1,
          x: 50,
          y: 56,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 16,
          bgPlate: '/hp_recon/plates/plate_s038.jpg',
          cutoutUrl: '/hp_recon/cutouts/earth_horizon_cutout.png',
          glowColor: '#60a5fa',
          glowIntensity: 70
        },
        {
          id: 'ch2_type_hook',
          category: 'Typography',
          label: 'Orbital Kinetic Hook ("Let\'s get right into it")',
          type: 'kinetic_title',
          inTime: 18.2,
          outTime: 21.1,
          x: 50,
          y: 42,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 24,
          text: "Let's get right into it",
          subtext: 'MUNDO STARTUP // FORENSIC INVESTIGATION',
          color: '#ffffff',
          accentColor: '#38bdf8'
        }
      ]
    },
    {
      id: 'hp_ch3_smart_tank_razor',
      chapterIndex: 3,
      code: 'CH03',
      title: 'Ch 3 (0:40–1:04): Smart Tank 7000 Split & Razor-and-Blades Pricing Cards',
      shortTitle: 'Ch 3 · Smart Tank & Razor',
      startSec: 40.0,
      endSec: 63.8,
      duration: 23.8,
      hudPreset: 'HP CH 3 (0:40.0–1:03.8) // SMART TANK 7000 -> RAZOR ($9.99) & BLADES ($29.99)',
      thumb: '/hp_recon/plates/plate_s061.jpg',
      audioCueSummary: '51.5s Split Card Swipe · 54.5s Ink Badge Pop · 58.8s Crimson Stage Bass Drop · 60.5s $9.99 & $29.99 Price Tag Unfurl',
      cameraKeyframes: [
        { t: 0.0, scale: 1.0, x: 0, y: 0, rot: 0, ease: 'linear' },
        { t: 11.5, scale: 1.08, x: -2, y: 0, rot: 0, ease: 'easeOutCubic' },
        { t: 18.8, scale: 1.0, x: 0, y: 0, rot: 0, ease: 'easeInOutCubic' }
      ],
      layers: [
        {
          id: 'ch3_bg_aisle',
          category: 'Background',
          label: 'Office & Retail Printer Aisle B-Roll (0:40–0:51)',
          type: 'plate_sequence',
          inTime: 0.0,
          outTime: 11.5,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 2,
          plates: [
            { t: 0.0, url: '/hp_recon/plates/plate_s042.jpg' },
            { t: 4.0, url: '/hp_recon/plates/plate_s046.jpg' },
            { t: 8.0, url: '/hp_recon/plates/plate_s050.jpg' }
          ]
        },
        {
          id: 'ch3_subj_smart_tank',
          category: 'Subjects',
          label: 'HP Smart Tank 7000 Split Showcase & Cutouts (0:51.5–0:58.8)',
          type: 'smart_tank_split',
          inTime: 11.5,
          outTime: 18.8,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 10,
          bgPlate: '/hp_recon/plates/plate_s055.jpg',
          frontCutout: '/hp_recon/cutouts/smart_tank_7000_front_cutout.png',
          angledCutout: '/hp_recon/cutouts/smart_tank_7000_angled_cutout.png',
          presenterCutout: '/hp_recon/cutouts/blue_shirt_presenter_cutout.png',
          m521Cutout: '/hp_recon/cutouts/laserjet_m521_cutout.png',
          text: 'HP Smart Tank 7000 series',
          subtext: 'Includes up to 2 years of ink',
          accentColor: '#0284c7'
        },
        {
          id: 'ch3_props_razor_blades',
          category: 'Props',
          label: 'Razor ($9.99) & Replacement Blades ($29.99) Cards (0:59–1:04)',
          type: 'razor_blades_cards',
          inTime: 18.8,
          outTime: 23.8,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 18,
          bgPlate: '/hp_recon/plates/plate_s061.jpg',
          leftTitle: 'Premium Handle',
          leftPrice: '$9.99',
          rightTitle: 'Replacement Blades (4-Pack)',
          rightPrice: '$29.99',
          glowColor: '#ef4444',
          glowIntensity: 80
        }
      ]
    },
    {
      id: 'hp_ch4_petapixel_ceo',
      chapterIndex: 4,
      code: 'CH04',
      title: 'Ch 4 (1:04–1:30): PetaPixel CEO "Bad Investment" Article & CNBC HPQ Chart',
      shortTitle: 'Ch 4 · PetaPixel & CEO',
      startSec: 64.0,
      endSec: 89.8,
      duration: 25.8,
      hudPreset: 'HP CH 4 (1:04.0–1:29.8) // PETAPIXEL CEO ARTICLE + CNBC HPQ 28.65 + CYAN HIGHLIGHTER',
      thumb: '/hp_recon/plates/plate_s078.jpg',
      audioCueSummary: '64.5s Volume Spec Callout · 76.0s Paper Unfold · 78.0s Stock Ticker Ping · 81.0s Cyan Highlighter Marker Sweep · 85.0s Camera Pull-Back',
      cameraKeyframes: [
        { t: 0.0, scale: 1.0, x: 0, y: 0, rot: 0, ease: 'linear' },
        { t: 12.0, scale: 1.05, x: 0, y: 0, rot: 0, ease: 'easeOutCubic' },
        { t: 17.0, scale: 1.18, x: -2, y: -4, rot: 0, ease: 'easeInOutQuad' },
        { t: 22.0, scale: 0.94, x: 0, y: 2, rot: 0, ease: 'easeOutCubic' }
      ],
      layers: [
        {
          id: 'ch4_bg_volume',
          category: 'Background',
          label: 'Monthly Page Volume Callout ("2,000 to 6,000 pages")',
          type: 'volume_callout_plate',
          inTime: 0.0,
          outTime: 11.8,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 4,
          bgPlate: '/hp_recon/plates/plate_s064.jpg',
          midPlate: '/hp_recon/plates/plate_s070.jpg',
          latePlate: '/hp_recon/plates/plate_s074.jpg',
          text: 'Recommended monthly page volume:',
          subtext: '2,000 to 6,000 pages',
          accentColor: '#38bdf8'
        },
        {
          id: 'ch4_prop_petapixel',
          category: 'Props',
          label: 'PetaPixel Editorial Card + CNBC HPQ 28.65 + Cyan Sweep',
          type: 'petapixel_article_rig',
          inTime: 11.8,
          outTime: 25.8,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 15,
          svgUrl: '/hp_recon/ui_plates/petapixel_ceo_article.svg',
          cnbcPlate: '/hp_recon/plates/plate_s078.jpg',
          highlightPlate: '/hp_recon/plates/plate_s082.jpg',
          pullbackPlate: '/hp_recon/plates/plate_s085.jpg',
          text: "HP's CEO Says If You Don't Use Their Printer Ink, You're a 'Bad Investment'",
          subtext: 'since HP loses money on the hardware (the actual printer) but makes that money back on the supplies',
          tickerText: 'HP INC. (HPQ) 28.65 +0.34 (+1.20%)',
          accentColor: '#38bdf8'
        }
      ]
    },
    {
      id: 'hp_ch5_supplies_phone',
      chapterIndex: 5,
      code: 'CH05',
      title: 'Ch 5 (1:30–2:02): Original HP Supplies 5-Cartridge Lineup & Mobile Store Scroll',
      shortTitle: 'Ch 5 · 5-Cartridge & Phone',
      startSec: 90.0,
      endSec: 121.8,
      duration: 31.8,
      hudPreset: 'HP CH 5 (1:30.0–2:01.8) // LASERJET M521 -> 5 CARTRIDGE LINEUP -> MOBILE INK SCROLL',
      thumb: '/hp_recon/plates/plate_s115.jpg',
      audioCueSummary: '98.0s M521 Split Whoosh · 109.0s 5x Staggered Cartridge Pops · 118.0s Phone Bezel Tilted Scroll',
      cameraKeyframes: [
        { t: 0.0, scale: 1.0, x: 0, y: 0, rot: 0, ease: 'linear' },
        { t: 18.5, scale: 1.06, x: 0, y: -2, rot: 0, ease: 'easeOutCubic' },
        { t: 27.8, scale: 1.12, x: 2, y: 0, rot: -1.5, ease: 'easeInOutCubic' }
      ],
      layers: [
        {
          id: 'ch5_bg_office',
          category: 'Background',
          label: 'Office Touchscreen & LaserJet Pro MFP M521 Split',
          type: 'plate_sequence',
          inTime: 0.0,
          outTime: 18.5,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 4,
          plates: [
            { t: 0.0, url: '/hp_recon/plates/plate_s091.jpg' },
            { t: 6.5, url: '/hp_recon/plates/plate_s098.jpg' },
            { t: 13.0, url: '/hp_recon/plates/plate_s105.jpg' }
          ]
        },
        {
          id: 'ch5_props_cartridges',
          category: 'Props',
          label: 'Original HP Supplies 5-Cartridge Lineup (950/951/932/933/901)',
          type: 'cartridge_lineup_5',
          inTime: 18.5,
          outTime: 27.8,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 14,
          earlyPlate: '/hp_recon/plates/plate_s112.jpg',
          fullPlate: '/hp_recon/plates/plate_s115.jpg',
          text: 'Original HP Supplies',
          subtext: 'HP 950 XL · HP 951 XL · HP 932 · HP 933 · HP 901',
          accentColor: '#0284c7'
        },
        {
          id: 'ch5_props_phone_scroll',
          category: 'Props',
          label: '3D Tilted Smartphone Ink Store Scroll (1:58–2:02)',
          type: 'phone_store_scroll',
          inTime: 27.8,
          outTime: 31.8,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 20,
          bgPlate: '/hp_recon/plates/plate_s119.jpg',
          text: 'HP 67XL Black / Tri-color Ink',
          subtext: '$64.99 · $48.99 · $89.99',
          accentColor: '#ef4444'
        }
      ]
    },
    {
      id: 'hp_ch6_isometric_chips',
      chapterIndex: 6,
      code: 'CH06',
      title: 'Ch 6 (2:02–2:58): 3D Isometric Skyscraper/Factory Islands & Cartridge Chips',
      shortTitle: 'Ch 6 · Isometric & Chips',
      startSec: 122.0,
      endSec: 177.8,
      duration: 55.8,
      hudPreset: 'HP CH 6 (2:02.0–2:57.8) // ISOMETRIC DESIGN/MANUFACTURE/ADVERTISE -> CHIP WHITEPAPER',
      thumb: '/hp_recon/plates/plate_s155.jpg',
      audioCueSummary: '145.5s DESIGN Card Pop · 147.0s MANUFACTURE Pop · 148.5s ADVERTISE Pop · 151.0s Pink Ink Sphere Bridge Synth · 159.0s Chip Whitepaper Zoom',
      cameraKeyframes: [
        { t: 0.0, scale: 1.0, x: 0, y: 0, rot: 0, ease: 'linear' },
        { t: 23.0, scale: 1.08, x: -3, y: 2, rot: 0, ease: 'easeOutCubic' },
        { t: 31.0, scale: 0.96, x: 3, y: -2, rot: 0, ease: 'easeInOutQuad' },
        { t: 42.0, scale: 1.15, x: 0, y: 0, rot: 0, ease: 'easeOutCubic' }
      ],
      layers: [
        {
          id: 'ch6_bg_probe',
          category: 'Background',
          label: 'Microchip Oscilloscope Probe & Commercial B-Roll (2:02–2:24)',
          type: 'plate_sequence',
          inTime: 0.0,
          outTime: 22.8,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 3,
          plates: [
            { t: 0.0, url: '/hp_recon/plates/plate_s123.jpg' },
            { t: 7.0, url: '/hp_recon/plates/plate_s132.jpg' },
            { t: 14.0, url: '/hp_recon/plates/plate_s137.jpg' },
            { t: 19.0, url: '/hp_recon/plates/plate_s141.jpg' }
          ]
        },
        {
          id: 'ch6_env_isometric',
          category: 'Environment',
          label: '3D Isometric Golden Skyscraper -> Pink Ink Bridge -> Blue Factory',
          type: 'isometric_islands_rig',
          inTime: 22.8,
          outTime: 34.8,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 14,
          plateDesign: '/hp_recon/plates/plate_s146.jpg',
          plateAdv: '/hp_recon/plates/plate_s149.jpg',
          plateBridge: '/hp_recon/plates/plate_s152.jpg',
          plateFactory: '/hp_recon/plates/plate_s155.jpg',
          text: 'DESIGN · MANUFACTURE · ADVERTISE',
          subtext: '3D Isometric Supply-Chain & Ink Sphere Bridge',
          accentColor: '#ec4899'
        },
        {
          id: 'ch6_prop_chip_whitepaper',
          category: 'Props',
          label: 'Original HP Cartridge Chips & Supply-Chain Security Whitepaper',
          type: 'chip_whitepaper_rig',
          inTime: 34.8,
          outTime: 55.8,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 18,
          plateChips: '/hp_recon/plates/plate_s159.jpg',
          plateSec: '/hp_recon/plates/plate_s164.jpg',
          plateConst: '/hp_recon/plates/plate_s167.jpg',
          plateDoc: '/hp_recon/plates/plate_s171.jpg',
          plateBar: '/hp_recon/plates/plate_s175.jpg',
          text: 'Original HP Cartridge chips',
          subtext: 'CERTIFIED SUPPLY-CHAIN SECURITY // CONSTANT PROTECTION',
          accentColor: '#ef4444'
        }
      ]
    },
    {
      id: 'hp_ch7_accc_firmware',
      chapterIndex: 7,
      code: 'CH07',
      title: 'Ch 7 (2:58–3:27): ACCC Press Release & Firmware Update "Non-HP Chip" Lockout',
      shortTitle: 'Ch 7 · ACCC & Firmware Lock',
      startSec: 178.0,
      endSec: 206.8,
      duration: 28.8,
      hudPreset: 'HP CH 7 (2:58.0–3:26.8) // ACCC COMPENSATION -> FIRMWARE UPDATE -> NON-HP CHIP DETECTED',
      thumb: '/hp_recon/plates/plate_s202.jpg',
      audioCueSummary: '178.5s ACCC Dark Dossier Slam · 182.0s Red Highlighter Sweep · 185.0s "error message" Macro Pop · 198.0s Firmware Update Chime · 202.0s Non-HP Chip Alarm',
      cameraKeyframes: [
        { t: 0.0, scale: 1.0, x: 0, y: 0, rot: 0, ease: 'linear' },
        { t: 7.0, scale: 1.35, x: -6, y: -4, rot: 0, ease: 'easeOutCubic' },
        { t: 10.0, scale: 1.0, x: 0, y: 0, rot: 0, ease: 'easeInOutQuad' },
        { t: 24.0, scale: 1.28, x: 0, y: -3, rot: 0, ease: 'easeOutCubic' }
      ],
      layers: [
        {
          id: 'ch7_prop_accc',
          category: 'Props',
          label: 'ACCC Dark-Mode Press Release ("HP to compensate printer customers")',
          type: 'accc_dossier_rig',
          inTime: 0.0,
          outTime: 9.8,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 12,
          svgUrl: '/hp_recon/ui_plates/accc_press_release.svg',
          plateFull: '/hp_recon/plates/plate_s182.jpg',
          plateMacro: '/hp_recon/plates/plate_s185.jpg',
          text: 'HP to compensate printer customers',
          subtext: 'a technology used by HP called Dynamic Security ... error message',
          accentColor: '#ef4444'
        },
        {
          id: 'ch7_env_firmware_lcd',
          category: 'Environment',
          label: 'Studio Printer Orbit & LCD "Firmware Update -> Non-HP Chip Detected"',
          type: 'firmware_lcd_sequence',
          inTime: 9.8,
          outTime: 28.8,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 18,
          plateOrbit1: '/hp_recon/plates/plate_s190.jpg',
          plateOrbit2: '/hp_recon/plates/plate_s194.jpg',
          plateFw: '/hp_recon/plates/plate_s198.jpg',
          plateCfg: '/hp_recon/plates/plate_s201.jpg',
          plateChip: '/hp_recon/plates/plate_s202.jpg',
          plateCheck: '/hp_recon/plates/plate_s204.jpg',
          plateIncomp: '/hp_recon/plates/plate_s206.jpg',
          text: 'Non-HP Chip Detected',
          subtext: 'Firmware Update -> Settings Configuration -> Incompatible Cartridges',
          accentColor: '#ef4444'
        }
      ]
    },
    {
      id: 'hp_ch8_cat_attack_cve',
      chapterIndex: 8,
      code: 'CH08',
      title: 'Ch 8 (3:27–4:00): CAT-ATTACK.BAT Green CRT Terminal & CVE-2022-28722 Article',
      shortTitle: 'Ch 8 · CAT-ATTACK & CVE',
      startSec: 207.0,
      endSec: 239.8,
      duration: 32.8,
      hudPreset: 'HP CH 8 (3:27.0–3:59.8) // RESTORE DEFAULTS -> CAT-ATTACK.BAT CRT -> CVE-2022-28722',
      thumb: '/hp_recon/plates/plate_s225.jpg',
      audioCueSummary: '216.0s Restore Factory Defaults Beep · 224.0s CRT Matrix Data Bleeps · 229.0s UPLOAD COMPLETE Synth · 232.0s CVE-2022-28722 Marker Sweep',
      cameraKeyframes: [
        { t: 0.0, scale: 1.0, x: 0, y: 0, rot: 0, ease: 'linear' },
        { t: 17.0, scale: 1.22, x: 0, y: 0, rot: 0, ease: 'easeOutCubic' },
        { t: 24.0, scale: 1.05, x: 0, y: 0, rot: 0, ease: 'easeInOutQuad' },
        { t: 30.0, scale: 1.18, x: -3, y: 4, rot: 0, ease: 'easeOutCubic' }
      ],
      layers: [
        {
          id: 'ch8_bg_restore',
          category: 'Background',
          label: 'Warehouse & LCD Blue Dialog ("Restore Factory Defaults")',
          type: 'plate_sequence',
          inTime: 0.0,
          outTime: 16.8,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 4,
          plates: [
            { t: 0.0, url: '/hp_recon/plates/plate_s212.jpg' },
            { t: 8.5, url: '/hp_recon/plates/plate_s216.jpg' },
            { t: 11.0, url: '/hp_recon/plates/plate_s218.jpg' },
            { t: 14.0, url: '/hp_recon/plates/plate_s222.jpg' }
          ]
        },
        {
          id: 'ch8_fx_cat_attack',
          category: 'Effects',
          label: 'Green Matrix CRT Terminal ("RUNNING SCRIPT CAT-ATTACK.BAT")',
          type: 'cat_attack_crt_rig',
          inTime: 16.8,
          outTime: 23.8,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 16,
          svgUrl: '/hp_recon/ui_plates/cat_attack_terminal.svg',
          plateRun: '/hp_recon/plates/plate_s225.jpg',
          plateDone: '/hp_recon/plates/plate_s229.jpg',
          text: '56K CHIP FOUND // RUNNING SCRIPT CAT-ATTACK.BAT',
          subtext: 'FLASH SUCCEEDED // UPLOAD COMPLETE',
          accentColor: '#22c55e'
        },
        {
          id: 'ch8_prop_cve_article',
          category: 'Props',
          label: 'Nicole Fern Security Highlight & CVE-2022-28722 Red Sweep',
          type: 'cve_article_rig',
          inTime: 23.8,
          outTime: 32.8,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 20,
          plateHead: '/hp_recon/plates/plate_s232.jpg',
          plateBody: '/hp_recon/plates/plate_s236.jpg',
          plateCve: '/hp_recon/plates/plate_s239.jpg',
          text: 'Security Highlight: Compromising Printers via Malicious Third-Party Cartridges',
          subtext: 'CVE-2022-28722 · Buffer Overflow in Cartridge Serial Number Parsing',
          accentColor: '#ef4444'
        }
      ]
    },
    {
      id: 'hp_ch9_microchip_instant_ink',
      chapterIndex: 9,
      code: 'CH09',
      title: 'Ch 9 (4:00–4:49): Glowing Silicon Microchip, Dynamic Security & Instant Ink Holograms',
      shortTitle: 'Ch 9 · Microchip & Holograms',
      startSec: 240.0,
      endSec: 288.8,
      duration: 48.8,
      hudPreset: 'HP CH 9 (4:00.0–4:48.8) // SILICON WAFER RADAR -> DYNAMIC SECURITY -> INSTANT INK HOLOGRAMS',
      thumb: '/hp_recon/plates/plate_s288.jpg',
      audioCueSummary: '242.0s Ghosted Cartridge Overlay · 265.0s Silicon Core Hum & Wafer Radar Pulse · 275.0s Dynamic Security Ribbon Swipe · 286.0s Cyan Pages & Pink Truck Hologram Chime',
      cameraKeyframes: [
        { t: 0.0, scale: 1.0, x: 0, y: 0, rot: 0, ease: 'linear' },
        { t: 25.0, scale: 1.18, x: 0, y: 0, rot: 0, ease: 'easeInOutQuad' },
        { t: 35.0, scale: 1.04, x: 0, y: 0, rot: 0, ease: 'easeOutCubic' },
        { t: 44.0, scale: 1.12, x: 0, y: -3, rot: 0, ease: 'easeInOutCubic' }
      ],
      layers: [
        {
          id: 'ch9_bg_ewaste',
          category: 'Background',
          label: 'LCD "Cartridge Problem" Double-Exposure & E-Waste B-Roll (4:00–4:24)',
          type: 'plate_sequence',
          inTime: 0.0,
          outTime: 24.0,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 4,
          plates: [
            { t: 0.0, url: '/hp_recon/plates/plate_s242.jpg' },
            { t: 5.0, url: '/hp_recon/plates/plate_s245.jpg' },
            { t: 10.0, url: '/hp_recon/plates/plate_s250.jpg' },
            { t: 16.0, url: '/hp_recon/plates/plate_s256.jpg' },
            { t: 21.0, url: '/hp_recon/plates/plate_s261.jpg' }
          ]
        },
        {
          id: 'ch9_fx_silicon_wafer',
          category: 'Effects',
          label: 'Glowing Silicon Microchip Die & Dynamic Security Printer Reveal',
          type: 'silicon_dynamic_sec_rig',
          inTime: 24.0,
          outTime: 37.8,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 14,
          plateDie: '/hp_recon/plates/plate_s265.jpg',
          plateRadar: '/hp_recon/plates/plate_s268.jpg',
          plateRibbon: '/hp_recon/plates/plate_s275.jpg',
          printerCutout: '/hp_recon/cutouts/dynamic_security_printer_cutout.png',
          text: 'Dynamic Security',
          subtext: 'Authenticated Silicon Telemetry & Periodic Firmware Locks',
          accentColor: '#f97316'
        },
        {
          id: 'ch9_subj_instant_ink_holo',
          category: 'Subjects',
          label: 'HP Instant Ink Box, Cartridge & Cyan Pages / Pink Truck Holograms',
          type: 'instant_ink_hologram_rig',
          inTime: 37.8,
          outTime: 48.8,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 20,
          plateCart: '/hp_recon/plates/plate_s278.jpg',
          plateBox: '/hp_recon/plates/plate_s283.jpg',
          platePages: '/hp_recon/plates/plate_s286.jpg',
          plateTruck: '/hp_recon/plates/plate_s288.jpg',
          cartCutout: '/hp_recon/cutouts/instant_ink_cartridge_cutout.png',
          boxCutout: '/hp_recon/cutouts/instant_ink_box_cutout.png',
          text: 'hp instant ink',
          subtext: 'Monthly Page Quota + Automated Cartridge Telemetry',
          accentColor: '#38bdf8'
        }
      ]
    },
    {
      id: 'hp_ch10_500m_neon_lock',
      chapterIndex: 10,
      code: 'CH10',
      title: 'Ch 10 (4:49–6:30): Usage Bar Chart, CRN $500M Article & Neon Remote Cartridge Lock',
      shortTitle: 'Ch 10 · $500M & Neon Lock',
      startSec: 289.0,
      endSec: 390.0,
      duration: 101.0,
      hudPreset: 'HP CH 10 (4:49.0–6:30.0) // 450 PAGES CHART -> CRN $500M ARTICLE -> NEON WIREFRAME LOCK',
      thumb: '/hp_recon/plates/plate_s387.jpg',
      audioCueSummary: '296.0s Instant Ink Pricing Scroll · 331.0s 450 Pages Bar Chart Ticks · 341.0s CRN $500M Dual Highlighter · 375.0s Service Plan CANCELLED Alarm · 386.0s Remote Cartridge Lock Shutdown',
      cameraKeyframes: [
        { t: 0.0, scale: 1.0, x: 0, y: 0, rot: 0, ease: 'linear' },
        { t: 42.0, scale: 1.08, x: 0, y: -2, rot: 0, ease: 'easeOutCubic' },
        { t: 54.0, scale: 1.15, x: -2, y: 0, rot: 0, ease: 'easeInOutQuad' },
        { t: 96.0, scale: 1.24, x: 0, y: 0, rot: 0, ease: 'easeOutCubic' }
      ],
      layers: [
        {
          id: 'ch10_bg_pricing',
          category: 'Background',
          label: 'HP Instant Ink Pricing Webpage Scroll & B-Roll (4:49–5:26)',
          type: 'plate_sequence',
          inTime: 0.0,
          outTime: 37.0,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 4,
          plates: [
            { t: 0.0, url: '/hp_recon/plates/plate_s296.jpg' },
            { t: 10.0, url: '/hp_recon/plates/plate_s301.jpg' },
            { t: 15.0, url: '/hp_recon/plates/plate_s304.jpg' },
            { t: 22.0, url: '/hp_recon/plates/plate_s310.jpg' },
            { t: 30.0, url: '/hp_recon/plates/plate_s318.jpg' }
          ]
        },
        {
          id: 'ch10_prop_usage_chart',
          category: 'Props',
          label: 'HP HQ & "Usage data: 450 pages" Bar Chart (January: 150 pages)',
          type: 'usage_chart_rig',
          inTime: 37.0,
          outTime: 49.0,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 12,
          plateHq: '/hp_recon/plates/plate_s328.jpg',
          plateJan: '/hp_recon/plates/plate_s331.jpg',
          plateFeb: '/hp_recon/plates/plate_s333.jpg',
          text: 'Usage data: 450 pages',
          subtext: 'January: 150 pages · February: 150 pages · Rollover Cap',
          accentColor: '#38bdf8'
        },
        {
          id: 'ch10_prop_crn_500m',
          category: 'Props',
          label: 'CRN Dark Article ("HP Says Instant Ink Is A $500M Business")',
          type: 'crn_article_rig',
          inTime: 49.0,
          outTime: 83.0,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 16,
          svgUrl: '/hp_recon/ui_plates/crn_500m_article.svg',
          plateArt: '/hp_recon/plates/plate_s341.jpg',
          plateDual: '/hp_recon/plates/plate_s344.jpg',
          plateBroll1: '/hp_recon/plates/plate_s352.jpg',
          plateBroll2: '/hp_recon/plates/plate_s360.jpg',
          plateBroll3: '/hp_recon/plates/plate_s368.jpg',
          text: 'HP Says Instant Ink Is A $500M Business, Now Offers Managed Print Subscriptions',
          subtext: '$500 million in annual revenue ... more than 10 million subscribers',
          accentColor: '#f97316'
        },
        {
          id: 'ch10_fx_neon_lock',
          category: 'Effects',
          label: 'Neon Wireframe Phone ("CANCELLED") & Printer ("CARTRIDGES: DISABLED")',
          type: 'neon_wireframe_lock_rig',
          inTime: 83.0,
          outTime: 101.0,
          x: 50,
          y: 50,
          scale: 100,
          rotation: 0,
          opacity: 100,
          zIndex: 22,
          svgUrl: '/hp_recon/ui_plates/neon_wireframe_printer_lock.svg',
          platePhoneActive: '/hp_recon/plates/plate_s373.jpg',
          platePhoneCancel: '/hp_recon/plates/plate_s375.jpg',
          platePrinter1: '/hp_recon/plates/plate_s385.jpg',
          platePrinter2: '/hp_recon/plates/plate_s387.jpg',
          text: 'SUBSCRIPTION STATUS: ENDED // CARTRIDGES: DISABLED',
          subtext: 'Service Plan: ACTIVE -> CANCELLED [X]',
          accentColor: '#ef4444'
        }
      ]
    },
    {
      id: 'hp_full_6m30s_doc',
      chapterIndex: 0,
      code: 'FULL',
      title: 'Full 6:30 HP Documentary Master Reconstruction (Chapters 1–10)',
      shortTitle: 'Full 6:30 HP Master',
      startSec: 0.0,
      endSec: 390.0,
      duration: 390.0,
      hudPreset: 'HP MASTER RECONSTRUCTION (0:00.0–6:30.0) // ALL 10 CHAPTERS CONTINUOUS',
      thumb: '/hp_recon/plates/plate_s035.jpg',
      audioCueSummary: 'Full 6m30s Synchronized Documentary Audio Map (833 Onsets · Voiceover Ducking · Glitch/UI/Alarm SFX)',
      layers: []
    }
  ];

  const HP_CHAPTER_MAP = {};
  HP_CHAPTER_DEFS.forEach((ch) => {
    HP_CHAPTER_MAP[ch.id] = ch;
  });

  // Expose global state for live editing in the 4-Tab Contextual Inspector & Stage
  const hpDocState = {
    activeChapterId: 'printer_glitch_card',
    selectedLayerId: null,
    audioMuted: false,
    showRefComparisonSplit: false,
    refSplitPosition: 50, // 0..100% wipe when side-by-side/split comparison is toggled
    chapters: HP_CHAPTER_MAP,
    chapterOrder: HP_CHAPTER_DEFS.filter((c) => c.id !== 'hp_full_6m30s_doc').map((c) => c.id)
  };
  window.hpDocState = hpDocState;
  window.HP_CHAPTER_DEFS = HP_CHAPTER_DEFS;

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function formatTimeMMSS(sec) {
    const s = Math.max(0, Number(sec) || 0);
    const m = Math.floor(s / 60);
    const rem = (s % 60).toFixed(1).padStart(4, '0');
    return `${m}:${rem}`;
  }

  function resolvePlateForTime(plates, localT) {
    if (!Array.isArray(plates) || plates.length === 0) return '';
    let chosen = plates[0].url;
    for (let i = 0; i < plates.length; i++) {
      if (localT >= plates[i].t) chosen = plates[i].url;
    }
    return chosen;
  }

  function interpolateCamera(keyframes, localT) {
    if (!Array.isArray(keyframes) || keyframes.length === 0) {
      return { scale: 1, x: 0, y: 0, rot: 0 };
    }
    if (localT <= keyframes[0].t) return keyframes[0];
    for (let i = 0; i < keyframes.length - 1; i++) {
      const a = keyframes[i];
      const b = keyframes[i + 1];
      if (localT >= a.t && localT <= b.t) {
        const span = Math.max(0.001, b.t - a.t);
        const raw = clamp((localT - a.t) / span, 0, 1);
        const p = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
        return {
          scale: a.scale + (b.scale - a.scale) * p,
          x: a.x + (b.x - a.x) * p,
          y: a.y + (b.y - a.y) * p,
          rot: (a.rot || 0) + ((b.rot || 0) - (a.rot || 0)) * p
        };
      }
    }
    return keyframes[keyframes.length - 1];
  }

  function getBpState() {
    if (typeof window.magnatesBPState === 'object' && window.magnatesBPState) return window.magnatesBPState;
    if (typeof magnatesBPState === 'object' && magnatesBPState) return magnatesBPState;
    return null;
  }

  function getBpPresets() {
    if (typeof window.MAGNATES_BP_PRESETS === 'object' && window.MAGNATES_BP_PRESETS) return window.MAGNATES_BP_PRESETS;
    if (typeof MAGNATES_BP_PRESETS === 'object' && MAGNATES_BP_PRESETS) return MAGNATES_BP_PRESETS;
    return null;
  }

  // Register HP chapters into MAGNATES_BP_PRESETS and EFFECT_TEMPLATES_DATA
  function registerHpChaptersIntoStudio() {
    const bpPresets = getBpPresets();
    if (bpPresets) {
      HP_CHAPTER_DEFS.forEach((ch) => {
        if (ch.id === 'printer_glitch_card') return; // Already registered as calibrated Ch 1
        bpPresets[ch.id] = {
          duration: ch.duration,
          hudPreset: ch.hudPreset,
          z0Label: `${ch.code} Backdrop & Camera Rig`,
          l1Label: (ch.layers[0] && ch.layers[0].label) || 'Primary Documentary Layer',
          l2Label: (ch.layers[1] && ch.layers[1].label) || 'Secondary Motion Layer'
        };
      });
    }

    if (typeof EFFECT_TEMPLATES_DATA !== 'undefined' && Array.isArray(EFFECT_TEMPLATES_DATA)) {
      if (!EFFECT_TEMPLATES_DATA.some((t) => t.id === 'hp-full-6m30s-documentary')) {
        EFFECT_TEMPLATES_DATA.unshift({
          id: 'hp-full-6m30s-documentary',
          title: 'Mundo Startup: The Deserved Death of HP Printers (Full 6:30 Reconstruction)',
          category: 'Documentary',
          badge: '10 CHAPTERS · 6:30',
          description: 'Complete frame-accurate 10-chapter documentary reconstruction (0:00–6:30) with editable cutouts, vector UI rigs, 3D isometric islands, and synchronized audio.',
          defaultImage: '/hp_recon/plates/plate_s035.jpg',
          timeToApply: '390s',
          tags: ['hp', 'printer', 'mundo startup', 'documentary', 'reconstruction']
        });
      }
    }

    // Add <option> entries to #magnates-bp-select-preset if not present
    const presetSel = document.getElementById('magnates-bp-select-preset');
    if (presetSel) {
      HP_CHAPTER_DEFS.forEach((ch) => {
        if (!presetSel.querySelector(`option[value="${ch.id}"]`)) {
          const opt = document.createElement('option');
          opt.value = ch.id;
          opt.textContent = ch.title;
          presetSel.appendChild(opt);
        }
      });
    }
  }

  // Build or return the dedicated multi-layer DOM overlay inside #magnates-bp-stage for Chapters 2..10
  function ensureHpStageContainer() {
    const stage = document.getElementById('magnates-bp-stage');
    if (!stage) return null;
    let container = document.getElementById('hp-doc-stage-root');
    if (!container) {
      container = document.createElement('div');
      container.id = 'hp-doc-stage-root';
      container.style.cssText = [
        'position:absolute',
        'inset:0',
        'z-index:26',
        'overflow:hidden',
        'display:none',
        'pointer-events:auto',
        'background:#070a12',
        'font-family:Inter,system-ui,-apple-system,sans-serif'
      ].join(';');
      stage.appendChild(container);
    }
    return container;
  }

  // Build the persistent 10-Chapter Quick Switcher Bar inside the preview column so users can jump between Ch 1..10 or Full 6:30
  function ensureHpChapterRibbon() {
    const previewCol = document.getElementById('magnates-bp-preview-col');
    if (!previewCol) return;
    if (document.getElementById('hp-doc-chapter-ribbon')) return;

    const ribbon = document.createElement('div');
    ribbon.id = 'hp-doc-chapter-ribbon';
    ribbon.style.cssText = [
      'display:flex',
      'align-items:center',
      'gap:5px',
      'padding:6px 10px',
      'background:rgba(12,14,22,0.92)',
      'border:1px solid rgba(255,255,255,0.08)',
      'border-radius:10px',
      'margin-bottom:6px',
      'overflow-x:auto',
      'max-width:100%',
      'flex-shrink:0'
    ].join(';');

    const label = document.createElement('span');
    label.textContent = 'HP 6:30 CHAPTERS:';
    label.style.cssText = 'font-size:10px;font-weight:800;letter-spacing:0.06em;color:#38bdf8;white-space:nowrap;margin-right:4px;';
    ribbon.appendChild(label);

    HP_CHAPTER_DEFS.forEach((ch) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hp-chapter-pill-btn';
      btn.setAttribute('data-hp-chapter', ch.id);
      btn.title = `${ch.title} (${formatTimeMMSS(ch.startSec)} – ${formatTimeMMSS(ch.endSec)})`;
      btn.textContent = ch.shortTitle;
      btn.style.cssText = [
        'padding:4px 8px',
        'border-radius:6px',
        'font-size:10.5px',
        'font-weight:700',
        'white-space:nowrap',
        'cursor:pointer',
        'border:1px solid rgba(255,255,255,0.12)',
        'background:rgba(255,255,255,0.04)',
        'color:#cbd5e1',
        'transition:all 0.15s ease'
      ].join(';');
      btn.addEventListener('click', () => {
        selectHpChapter(ch.id);
      });
      ribbon.appendChild(btn);
    });

    previewCol.insertBefore(ribbon, previewCol.firstChild);
  }

  function syncHpChapterRibbonActive(presetKey) {
    document.querySelectorAll('.hp-chapter-pill-btn').forEach((btn) => {
      const isAct = btn.getAttribute('data-hp-chapter') === presetKey;
      btn.style.background = isAct ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'rgba(255,255,255,0.04)';
      btn.style.color = isAct ? '#ffffff' : '#cbd5e1';
      btn.style.borderColor = isAct ? '#38bdf8' : 'rgba(255,255,255,0.12)';
    });
  }

  // Render an individual layer inside #hp-doc-stage-root at chapter-local time `localT`
  function buildLayerHtml(layer, localT, ch) {
    if (localT < layer.inTime || localT > layer.outTime) return '';
    const relT = localT - layer.inTime;
    const dur = Math.max(0.1, layer.outTime - layer.inTime);
    const enterP = clamp(relT / 0.38, 0, 1);
    const op = ((layer.opacity ?? 100) / 100) * enterP;
    const tx = (layer.x ?? 50) - 50;
    const ty = (layer.y ?? 50) - 50;
    const sc = (layer.scale ?? 100) / 100;
    const rot = layer.rotation ?? 0;
    const isSel = hpDocState.selectedLayerId === layer.id;
    const selOutline = isSel ? 'outline:2px solid #38bdf8;outline-offset:-2px;' : '';
    const commonWrapStyle = `position:absolute;inset:0;z-index:${layer.zIndex || 10};opacity:${op.toFixed(3)};transform:translate(${tx.toFixed(1)}%, ${ty.toFixed(1)}%) scale(${sc.toFixed(3)}) rotate(${rot.toFixed(1)}deg);transform-origin:center center;${selOutline}`;

    if (layer.type === 'plate_sequence') {
      const url = resolvePlateForTime(layer.plates, localT);
      return `
        <div class="hp-stage-layer" data-hp-layer-id="${layer.id}" style="${commonWrapStyle}">
          <img src="${url}" alt="${layer.label}" style="width:100%;height:100%;object-fit:cover;display:block;" />
        </div>
      `;
    }

    if (layer.type === 'lcd_block_ui') {
      const isConfirmed = localT >= (layer.confirmAt || 11.8);
      const badgeColor = isConfirmed ? (layer.accentColor || '#10b981') : '#f59e0b';
      const statusTxt = isConfirmed ? `✓ ${layer.subtext || 'Confirmed'}` : `${layer.text || 'Block Cartridge'}?`;
      const cursorX = isConfirmed ? 58 : 44 + Math.min(14, relT * 8);
      const cursorY = isConfirmed ? 54 : 68 - Math.min(14, relT * 8);
      return `
        <div class="hp-stage-layer" data-hp-layer-id="${layer.id}" style="${commonWrapStyle};pointer-events:auto;cursor:move;">
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:48%;padding:16px 20px;border-radius:14px;background:rgba(15,23,42,0.92);border:2px solid ${badgeColor};box-shadow:0 18px 45px rgba(0,0,0,0.65),0 0 28px ${badgeColor}55;color:#fff;text-align:center;">
            <div style="font-size:10px;font-weight:700;letter-spacing:0.12em;color:#94a3b8;text-transform:uppercase;margin-bottom:6px;">HP DYNAMIC SECURITY FIRMWARE</div>
            <div style="font-size:19px;font-weight:800;color:#f8fafc;margin-bottom:10px;">${layer.text || 'Block Cartridge'}</div>
            <div style="display:inline-flex;align-items:center;gap:6px;padding:6px 16px;border-radius:999px;background:${badgeColor};color:#05101a;font-size:13px;font-weight:900;">
              <span>${statusTxt}</span>
            </div>
          </div>
          <div style="position:absolute;left:${cursorX}%;top:${cursorY}%;width:22px;height:22px;pointer-events:none;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.65));">
            <svg viewBox="0 0 24 24" fill="#ffffff" stroke="#0f172a" stroke-width="2"><path d="M4 2l16 10-7 2 4 7-3 1-4-7-6 5z"/></svg>
          </div>
        </div>
      `;
    }

    if (layer.type === 'cutout_composite') {
      const glowCol = layer.glowColor || '#38bdf8';
      const glowInt = (layer.glowIntensity ?? 80) / 100;
      const floatScale = 0.92 + 0.08 * Math.sin(relT * 1.6);
      return `
        <div class="hp-stage-layer" data-hp-layer-id="${layer.id}" style="${commonWrapStyle};cursor:move;">
          <img src="${layer.bgPlate}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;filter:brightness(0.88);" />
          <div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 50%, ${glowCol}44 0%, transparent 68%);opacity:${glowInt};pointer-events:none;"></div>
          <img src="${layer.cutoutUrl}" alt="${layer.label}" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(${floatScale.toFixed(3)});max-width:78%;max-height:78%;object-fit:contain;filter:drop-shadow(0 16px 36px ${glowCol}88);" />
        </div>
      `;
    }

    if (layer.type === 'kinetic_title') {
      const slideY = (1 - enterP) * 18;
      return `
        <div class="hp-stage-layer" data-hp-layer-id="${layer.id}" style="${commonWrapStyle};pointer-events:auto;cursor:move;">
          <div style="position:absolute;left:50%;top:48%;transform:translate(-50%, calc(-50% + ${slideY.toFixed(1)}px));text-align:center;width:86%;">
            <div style="font-size:10px;font-weight:800;letter-spacing:0.18em;color:${layer.accentColor || '#38bdf8'};text-transform:uppercase;margin-bottom:6px;text-shadow:0 2px 10px rgba(0,0,0,0.8);">${layer.subtext || ''}</div>
            <div style="font-size:32px;font-weight:900;letter-spacing:-0.02em;color:${layer.color || '#ffffff'};text-shadow:0 8px 28px rgba(0,0,0,0.85);">${layer.text || ''}</div>
          </div>
        </div>
      `;
    }

    if (layer.type === 'smart_tank_split') {
      const showSplit = relT >= 2.2;
      return `
        <div class="hp-stage-layer" data-hp-layer-id="${layer.id}" style="${commonWrapStyle};cursor:move;">
          <img src="${layer.bgPlate}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;left:6%;top:10%;padding:8px 14px;border-radius:10px;background:rgba(255,255,255,0.92);box-shadow:0 10px 25px rgba(0,0,0,0.35);color:#0f172a;">
            <div style="font-size:14px;font-weight:900;">${layer.text || 'HP Smart Tank 7000 series'}</div>
            <div style="font-size:11px;font-weight:700;color:${layer.accentColor || '#0284c7'};">${layer.subtext || 'Includes up to 2 years of ink'}</div>
          </div>
          ${showSplit ? `
            <img src="${layer.presenterCutout}" alt="Presenter" style="position:absolute;left:18%;bottom:4%;height:68%;object-fit:contain;filter:drop-shadow(0 12px 24px rgba(0,0,0,0.5));" />
            <img src="${layer.m521Cutout}" alt="LaserJet M521" style="position:absolute;right:12%;bottom:10%;height:56%;object-fit:contain;filter:drop-shadow(0 12px 24px rgba(0,0,0,0.5));" />
          ` : `
            <img src="${layer.frontCutout}" alt="Smart Tank Front" style="position:absolute;left:22%;bottom:10%;height:58%;object-fit:contain;filter:drop-shadow(0 12px 24px rgba(0,0,0,0.45));" />
            <img src="${layer.angledCutout}" alt="Smart Tank Angled" style="position:absolute;right:14%;bottom:12%;height:54%;object-fit:contain;filter:drop-shadow(0 12px 24px rgba(0,0,0,0.45));" />
          `}
        </div>
      `;
    }

    if (layer.type === 'razor_blades_cards') {
      const cardUnfurl = clamp((relT - 0.3) / 0.55, 0, 1);
      return `
        <div class="hp-stage-layer" data-hp-layer-id="${layer.id}" style="${commonWrapStyle};cursor:move;">
          <img src="${layer.bgPlate}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 50%, rgba(220,38,38,0.28), rgba(9,5,8,0.65));pointer-events:none;"></div>
          <div style="position:absolute;left:27%;bottom:12%;transform:translateX(-50%) scale(${(0.85 + 0.15 * cardUnfurl).toFixed(3)});background:#ffffff;color:#0f172a;padding:8px 18px;border-radius:10px;box-shadow:0 12px 30px rgba(0,0,0,0.6);text-align:center;min-width:160px;">
            <div style="font-size:10px;font-weight:700;color:#64748b;">${layer.leftTitle || 'Premium Handle'}</div>
            <div style="font-size:20px;font-weight:900;color:#0f172a;">${layer.leftPrice || '$9.99'}</div>
          </div>
          <div style="position:absolute;left:73%;bottom:12%;transform:translateX(-50%) scale(${(0.85 + 0.15 * cardUnfurl).toFixed(3)});background:#ffffff;color:#0f172a;padding:8px 18px;border-radius:10px;box-shadow:0 12px 30px rgba(0,0,0,0.6);text-align:center;min-width:190px;border:2px solid #ef4444;">
            <div style="font-size:10px;font-weight:700;color:#64748b;">${layer.rightTitle || 'Replacement Blades (4-Pack)'}</div>
            <div style="font-size:20px;font-weight:900;color:#dc2626;">${layer.rightPrice || '$29.99'}</div>
          </div>
        </div>
      `;
    }

    if (layer.type === 'volume_callout_plate') {
      const plateUrl = relT < 4.5 ? layer.bgPlate : (relT < 8.5 ? layer.midPlate : layer.latePlate);
      return `
        <div class="hp-stage-layer" data-hp-layer-id="${layer.id}" style="${commonWrapStyle};cursor:move;">
          <img src="${plateUrl}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;left:50%;bottom:14%;transform:translateX(-50%);background:rgba(15,23,42,0.92);border:1px solid ${layer.accentColor || '#38bdf8'};border-radius:10px;padding:8px 18px;color:#fff;box-shadow:0 14px 32px rgba(0,0,0,0.65);text-align:center;">
            <div style="font-size:10.5px;color:#94a3b8;font-weight:600;">${layer.text || 'Recommended monthly page volume:'}</div>
            <div style="font-size:16px;color:${layer.accentColor || '#38bdf8'};font-weight:900;">${layer.subtext || '2,000 to 6,000 pages'}</div>
          </div>
        </div>
      `;
    }

    if (layer.type === 'petapixel_article_rig') {
      const highlightW = clamp((relT - 4.0) / 2.2, 0, 1) * 100;
      const showPullback = relT >= 9.0;
      const bgImg = showPullback ? layer.pullbackPlate : (relT >= 5.0 ? layer.highlightPlate : layer.cnbcPlate);
      return `
        <div class="hp-stage-layer" data-hp-layer-id="${layer.id}" style="${commonWrapStyle};cursor:move;">
          <img src="${bgImg}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;left:6%;top:8%;width:48%;background:rgba(255,255,255,0.96);color:#0f172a;padding:12px 14px;border-radius:10px;box-shadow:0 16px 36px rgba(0,0,0,0.55);">
            <div style="font-size:10px;font-weight:900;color:#0284c7;letter-spacing:0.08em;margin-bottom:4px;">PETAPIXEL // EDITORIAL</div>
            <div style="font-size:13px;font-weight:800;line-height:1.25;margin-bottom:8px;">${layer.text}</div>
            <div style="position:relative;font-size:10.5px;line-height:1.35;color:#1e293b;padding:3px 4px;border-radius:4px;overflow:hidden;">
              <div style="position:absolute;left:0;top:0;bottom:0;width:${highlightW.toFixed(1)}%;background:rgba(56,189,248,0.38);pointer-events:none;"></div>
              <span style="position:relative;z-index:1;font-weight:700;">${layer.subtext}</span>
            </div>
          </div>
          <div style="position:absolute;right:6%;bottom:10%;background:rgba(15,23,42,0.92);border-left:3px solid #22c55e;padding:7px 12px;border-radius:6px;color:#fff;font-size:11px;font-weight:800;box-shadow:0 10px 24px rgba(0,0,0,0.5);">
            ${layer.tickerText || 'HP INC. (HPQ) 28.65 +0.34 (+1.20%)'}
          </div>
        </div>
      `;
    }

    if (layer.type === 'cartridge_lineup_5') {
      const imgUrl = relT < 3.0 ? layer.earlyPlate : layer.fullPlate;
      return `
        <div class="hp-stage-layer" data-hp-layer-id="${layer.id}" style="${commonWrapStyle};cursor:move;">
          <img src="${imgUrl}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;left:50%;top:10%;transform:translateX(-50%);background:rgba(15,23,42,0.88);border:1px solid #38bdf8;border-radius:999px;padding:5px 16px;color:#fff;font-size:12px;font-weight:800;">
            ${layer.text} · <span style="color:#38bdf8;">${layer.subtext}</span>
          </div>
        </div>
      `;
    }

    if (layer.type === 'phone_store_scroll') {
      return `
        <div class="hp-stage-layer" data-hp-layer-id="${layer.id}" style="${commonWrapStyle};cursor:move;">
          <img src="${layer.bgPlate}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;right:8%;bottom:10%;background:rgba(15,23,42,0.9);border:1px solid #ef4444;border-radius:10px;padding:8px 14px;color:#fff;">
            <div style="font-size:11px;font-weight:800;">${layer.text}</div>
            <div style="font-size:13px;font-weight:900;color:#f87171;">${layer.subtext}</div>
          </div>
        </div>
      `;
    }

    if (layer.type === 'isometric_islands_rig') {
      const plateUrl = relT < 3.0 ? layer.plateDesign : (relT < 6.0 ? layer.plateAdv : (relT < 9.0 ? layer.plateBridge : layer.plateFactory));
      const sphereProgress = clamp((relT - 5.5) / 5.0, 0, 1);
      const sphereX = 34 + sphereProgress * 32;
      const sphereY = 48 + sphereProgress * 14;
      return `
        <div class="hp-stage-layer" data-hp-layer-id="${layer.id}" style="${commonWrapStyle};cursor:move;">
          <img src="${plateUrl}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;left:${sphereX.toFixed(1)}%;top:${sphereY.toFixed(1)}%;width:16px;height:16px;border-radius:50%;background:#ec4899;box-shadow:0 0 18px #ec4899,0 0 32px #f472b6;pointer-events:none;"></div>
          <div style="position:absolute;left:50%;bottom:8%;transform:translateX(-50%);background:rgba(15,23,42,0.88);border:1px solid #ec4899;border-radius:8px;padding:5px 14px;color:#fff;font-size:11px;font-weight:800;">
            ${layer.text}
          </div>
        </div>
      `;
    }

    if (layer.type === 'chip_whitepaper_rig') {
      const plateUrl = relT < 4.5 ? layer.plateChips : (relT < 8.5 ? layer.plateSec : (relT < 12.5 ? layer.plateConst : (relT < 16.5 ? layer.plateDoc : layer.plateBar)));
      return `
        <div class="hp-stage-layer" data-hp-layer-id="${layer.id}" style="${commonWrapStyle};cursor:move;">
          <img src="${plateUrl}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;left:6%;bottom:8%;background:rgba(15,23,42,0.88);border-left:3px solid #ef4444;padding:6px 12px;border-radius:6px;color:#fff;">
            <div style="font-size:12px;font-weight:800;">${layer.text}</div>
            <div style="font-size:10px;color:#fca5a5;font-weight:700;">${layer.subtext}</div>
          </div>
        </div>
      `;
    }

    if (layer.type === 'accc_dossier_rig') {
      const isMacro = relT >= 6.2;
      const plateUrl = isMacro ? layer.plateMacro : layer.plateFull;
      const sweepW = clamp((relT - 1.2) / 2.4, 0, 1) * 100;
      return `
        <div class="hp-stage-layer" data-hp-layer-id="${layer.id}" style="${commonWrapStyle};cursor:move;">
          <img src="${plateUrl}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;left:8%;top:10%;right:8%;background:rgba(9,13,22,0.9);border:1px solid rgba(239,68,68,0.5);border-radius:10px;padding:10px 14px;color:#fff;">
            <div style="font-size:9.5px;font-weight:800;color:#f87171;letter-spacing:0.1em;">AUSTRALIAN COMPETITION & CONSUMER COMMISSION (ACCC)</div>
            <div style="font-size:16px;font-weight:900;margin:3px 0 6px;">${layer.text}</div>
            <div style="position:relative;display:inline-block;padding:2px 6px;border-radius:4px;overflow:hidden;">
              <div style="position:absolute;left:0;top:0;bottom:0;width:${sweepW.toFixed(1)}%;background:rgba(220,38,38,0.55);"></div>
              <span style="position:relative;z-index:1;font-size:11.5px;font-weight:700;color:#fef2f2;">${layer.subtext}</span>
            </div>
          </div>
        </div>
      `;
    }

    if (layer.type === 'firmware_lcd_sequence') {
      let plateUrl = layer.plateOrbit1;
      let statusLabel = 'Studio Printer Top-Angle Orbit';
      if (relT >= 4.0 && relT < 8.0) { plateUrl = layer.plateOrbit2; statusLabel = 'Camera Push-In to LCD'; }
      else if (relT >= 8.0 && relT < 11.0) { plateUrl = layer.plateFw; statusLabel = 'LCD: Firmware Update'; }
      else if (relT >= 11.0 && relT < 12.2) { plateUrl = layer.plateCfg; statusLabel = 'LCD: Settings Configuration'; }
      else if (relT >= 12.2 && relT < 14.0) { plateUrl = layer.plateChip; statusLabel = 'LCD: Non-HP Chip Detected'; }
      else if (relT >= 14.0 && relT < 16.2) { plateUrl = layer.plateCheck; statusLabel = 'LCD: Checking Cartridges...'; }
      else if (relT >= 16.2) { plateUrl = layer.plateIncomp; statusLabel = 'LCD: Incompatible Cartridges'; }

      return `
        <div class="hp-stage-layer" data-hp-layer-id="${layer.id}" style="${commonWrapStyle};cursor:move;">
          <img src="${plateUrl}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;right:6%;top:8%;background:rgba(15,23,42,0.9);border:1px solid #ef4444;border-radius:8px;padding:6px 12px;color:#fff;font-size:11px;font-weight:800;">
            ${statusLabel}
          </div>
        </div>
      `;
    }

    if (layer.type === 'cat_attack_crt_rig') {
      const plateUrl = relT < 3.5 ? layer.plateRun : layer.plateDone;
      const chars = Math.floor(clamp(relT / 3.0, 0, 1) * (layer.text || '').length);
      const typed = (layer.text || '').slice(0, Math.max(8, chars));
      return `
        <div class="hp-stage-layer" data-hp-layer-id="${layer.id}" style="${commonWrapStyle};cursor:move;">
          <img src="${plateUrl}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;left:50%;bottom:10%;transform:translateX(-50%);background:rgba(2,18,8,0.92);border:1.5px solid #22c55e;border-radius:8px;padding:8px 16px;color:#4ade80;font-family:monospace;font-size:12px;font-weight:700;box-shadow:0 0 24px rgba(34,197,94,0.4);">
            <div>&gt; ${typed}_</div>
            ${relT >= 3.2 ? `<div style="color:#86efac;margin-top:3px;">&gt; ${layer.subtext}</div>` : ''}
          </div>
        </div>
      `;
    }

    if (layer.type === 'cve_article_rig') {
      const plateUrl = relT < 3.0 ? layer.plateHead : (relT < 6.0 ? layer.plateBody : layer.plateCve);
      return `
        <div class="hp-stage-layer" data-hp-layer-id="${layer.id}" style="${commonWrapStyle};cursor:move;">
          <img src="${plateUrl}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;left:6%;bottom:8%;background:rgba(15,23,42,0.92);border-left:3px solid #ef4444;padding:7px 14px;border-radius:6px;color:#fff;">
            <div style="font-size:11.5px;font-weight:800;">${layer.text}</div>
            <div style="font-size:11px;font-weight:900;color:#f87171;">${layer.subtext}</div>
          </div>
        </div>
      `;
    }

    if (layer.type === 'silicon_dynamic_sec_rig') {
      const plateUrl = relT < 3.5 ? layer.plateDie : (relT < 8.5 ? layer.plateRadar : layer.plateRibbon);
      return `
        <div class="hp-stage-layer" data-hp-layer-id="${layer.id}" style="${commonWrapStyle};cursor:move;">
          <img src="${plateUrl}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
          ${relT >= 8.5 ? `<img src="${layer.printerCutout}" alt="Dynamic Security Printer" style="position:absolute;left:50%;bottom:8%;transform:translateX(-50%);height:58%;object-fit:contain;filter:drop-shadow(0 14px 28px rgba(0,0,0,0.55));" />` : ''}
          <div style="position:absolute;left:50%;top:10%;transform:translateX(-50%);background:linear-gradient(135deg,#ea580c,#f97316);color:#fff;padding:5px 18px;border-radius:999px;font-size:12px;font-weight:900;box-shadow:0 8px 24px rgba(249,115,22,0.5);">
            ${layer.text} — ${layer.subtext}
          </div>
        </div>
      `;
    }

    if (layer.type === 'instant_ink_hologram_rig') {
      const plateUrl = relT < 3.0 ? layer.plateCart : (relT < 6.0 ? layer.plateBox : (relT < 8.8 ? layer.platePages : layer.plateTruck));
      return `
        <div class="hp-stage-layer" data-hp-layer-id="${layer.id}" style="${commonWrapStyle};cursor:move;">
          <img src="${plateUrl}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;left:6%;top:8%;background:rgba(15,23,42,0.9);border:1px solid #38bdf8;border-radius:8px;padding:6px 12px;color:#fff;">
            <div style="font-size:12px;font-weight:900;color:#38bdf8;">${layer.text}</div>
            <div style="font-size:10px;color:#cbd5e1;">${layer.subtext}</div>
          </div>
        </div>
      `;
    }

    if (layer.type === 'usage_chart_rig') {
      const plateUrl = relT < 3.5 ? layer.plateHq : (relT < 7.5 ? layer.plateJan : layer.plateFeb);
      return `
        <div class="hp-stage-layer" data-hp-layer-id="${layer.id}" style="${commonWrapStyle};cursor:move;">
          <img src="${plateUrl}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;right:6%;top:8%;background:rgba(15,23,42,0.92);border:1px solid #38bdf8;border-radius:8px;padding:6px 12px;color:#fff;">
            <div style="font-size:12px;font-weight:900;color:#38bdf8;">${layer.text}</div>
            <div style="font-size:10px;color:#cbd5e1;">${layer.subtext}</div>
          </div>
        </div>
      `;
    }

    if (layer.type === 'crn_article_rig') {
      let plateUrl = layer.plateArt;
      if (relT >= 4.0 && relT < 10.0) plateUrl = layer.plateDual;
      else if (relT >= 10.0 && relT < 18.0) plateUrl = layer.plateBroll1;
      else if (relT >= 18.0 && relT < 26.0) plateUrl = layer.plateBroll2;
      else if (relT >= 26.0) plateUrl = layer.plateBroll3;
      return `
        <div class="hp-stage-layer" data-hp-layer-id="${layer.id}" style="${commonWrapStyle};cursor:move;">
          <img src="${plateUrl}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;left:6%;bottom:8%;background:rgba(15,23,42,0.92);border-left:3px solid #f97316;padding:6px 12px;border-radius:6px;color:#fff;">
            <div style="font-size:11.5px;font-weight:800;">${layer.text}</div>
            <div style="font-size:10.5px;font-weight:800;color:#fb923c;">${layer.subtext}</div>
          </div>
        </div>
      `;
    }

    if (layer.type === 'neon_wireframe_lock_rig') {
      let plateUrl = layer.platePhoneActive;
      if (relT >= 2.2 && relT < 9.0) plateUrl = layer.platePhoneCancel;
      else if (relT >= 9.0 && relT < 13.5) plateUrl = layer.platePrinter1;
      else if (relT >= 13.5) plateUrl = layer.platePrinter2;
      return `
        <div class="hp-stage-layer" data-hp-layer-id="${layer.id}" style="${commonWrapStyle};cursor:move;">
          <img src="${plateUrl}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;left:50%;top:8%;transform:translateX(-50%);background:rgba(15,10,20,0.92);border:1.5px solid #ef4444;border-radius:8px;padding:6px 14px;color:#f87171;font-family:monospace;font-size:11.5px;font-weight:800;box-shadow:0 0 22px rgba(239,68,68,0.45);">
            ${layer.text}
          </div>
        </div>
      `;
    }

    return '';
  }

  // Render the active HP chapter (Chapters 2..10 or Full 6:30 Master) onto #magnates-bp-stage
  function renderHpDocumentaryFrame() {
    const bpState = getBpState();
    if (!bpState) return;
    const presetKey = bpState.preset;
    syncHpChapterRibbonActive(presetKey);

    const root = ensureHpStageContainer();
    if (!root) return;

    const ch = HP_CHAPTER_MAP[presetKey];
    if (!ch || presetKey === 'printer_glitch_card') {
      // Chapter 1 uses the native calibrated Scene 6 DOM inside #magnates-bp-stage
      root.style.display = 'none';
      return;
    }

    let activeCh = ch;
    let localT = clamp(bpState.playhead || 0, 0, ch.duration);

    if (presetKey === 'hp_full_6m30s_doc') {
      const globalSec = clamp(bpState.playhead || 0, 0, 390.0);
      if (globalSec < 18.8) {
        // Delegate first 18.8s of Full 6:30 mode to native calibrated Chapter 1!
        root.style.display = 'none';
        return;
      }
      const found = HP_CHAPTER_DEFS.find((c) => c.id !== 'hp_full_6m30s_doc' && globalSec >= c.startSec && globalSec <= c.endSec);
      activeCh = found || HP_CHAPTER_MAP.hp_ch10_500m_neon_lock;
      localT = clamp(globalSec - activeCh.startSec, 0, activeCh.duration);
    }

    root.style.display = 'block';
    const cam = interpolateCamera(activeCh.cameraKeyframes, localT);
    const globalTimestamp = activeCh.startSec + localT;
    const layersHtml = (activeCh.layers || []).map((layer) => buildLayerHtml(layer, localT, activeCh)).join('');

    root.innerHTML = `
      <div class="hp-camera-rig" style="position:absolute;inset:0;transform:translate(${cam.x.toFixed(2)}%, ${cam.y.toFixed(2)}%) scale(${cam.scale.toFixed(3)}) rotate(${(cam.rot || 0).toFixed(2)}deg);transform-origin:center center;">
        ${layersHtml}
      </div>
      <div style="position:absolute;left:12px;bottom:48px;z-index:45;display:flex;align-items:center;gap:8px;padding:4px 10px;border-radius:999px;background:rgba(9,13,22,0.85);border:1px solid rgba(56,189,248,0.35);color:#e2e8f0;font-size:10.5px;font-weight:700;pointer-events:none;">
        <span style="color:#38bdf8;font-weight:900;">${activeCh.code}</span>
        <span>Ref ${formatTimeMMSS(globalTimestamp)} / 6:30.0</span>
        <span style="color:#94a3b8;">·</span>
        <span style="color:#cbd5e1;">Cam ${cam.scale.toFixed(2)}x</span>
      </div>
    `;

    // Bind click selection & RegaarderContextualToolbar on every rendered stage layer
    root.querySelectorAll('.hp-stage-layer[data-hp-layer-id]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const lid = el.getAttribute('data-hp-layer-id');
        hpDocState.selectedLayerId = lid;
        const layerObj = (activeCh.layers || []).find((l) => l.id === lid);
        if (layerObj && window.RegaarderContextualToolbar && typeof window.RegaarderContextualToolbar.show === 'function') {
          window.RegaarderContextualToolbar.show(el, {
            id: layerObj.id,
            label: layerObj.label,
            type: layerObj.category ? layerObj.category.toLowerCase() : 'image',
            opacity: layerObj.opacity ?? 100,
            scale: layerObj.scale ?? 100,
            onChange: (patch) => {
              if (typeof patch.opacity === 'number') layerObj.opacity = patch.opacity;
              if (typeof patch.scale === 'number') layerObj.scale = patch.scale;
              renderHpDocumentaryFrame();
            }
          });
        }
        renderHpDocumentaryFrame();
      });
    });

    const hudPreset = document.getElementById('magnates-bp-hud-preset');
    if (hudPreset) hudPreset.textContent = activeCh.hudPreset;
    const hudAnim = document.getElementById('magnates-bp-hud-anim');
    if (hudAnim) {
      const activeLayerNames = (activeCh.layers || [])
        .filter((l) => localT >= l.inTime && localT <= l.outTime)
        .map((l) => l.label)
        .join(' + ');
      hudAnim.textContent = `${activeCh.code} // ${activeLayerNames || activeCh.shortTitle}`;
    }
  }

  // Build the 4-Tab Contextual Inspector (Content, Motion, Look, Effects + Advanced Controls) for Chapters 2..10
  function buildHpChapterInspector(sceneKey, panes, advSubEl, advDrawer) {
    const ch = HP_CHAPTER_MAP[sceneKey];
    if (!ch || !panes || !panes.content) return false;
    if (sceneKey === 'printer_glitch_card') return false; // Handled by native Ch 1 inspector

    panes.content.innerHTML = '';
    panes.motion.innerHTML = '';
    panes.look.innerHTML = '';
    panes.effects.innerHTML = '';
    if (advDrawer) advDrawer.innerHTML = '';
    if (advSubEl) advSubEl.textContent = `${ch.code} (${formatTimeMMSS(ch.startSec)}–${formatTimeMMSS(ch.endSec)}) · Camera keyframes & audio sync.`;

    const layers = ch.id === 'hp_full_6m30s_doc'
      ? HP_CHAPTER_DEFS.filter((c) => c.id !== 'hp_full_6m30s_doc').flatMap((c) => c.layers || [])
      : (ch.layers || []);

    // 1. CONTENT TAB: Editable Scene Hierarchy Layers & Text/Asset Controls
    const contentHtml = `
      <div class="rg-inspector-section" style="padding:12px;border-radius:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="font-size:11px;font-weight:800;color:#38bdf8;text-transform:uppercase;letter-spacing:0.06em;">${ch.code} · Scene Object Hierarchy</span>
          <span style="font-size:10px;color:#94a3b8;">${formatTimeMMSS(ch.startSec)} – ${formatTimeMMSS(ch.endSec)}</span>
        </div>
        <div style="font-size:11.5px;font-weight:700;color:#f8fafc;margin-bottom:10px;">${ch.title}</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${layers.slice(0, 8).map((layer) => `
            <div class="hp-insp-layer-card" data-layer-id="${layer.id}" style="padding:9px 10px;border-radius:8px;background:rgba(15,23,42,0.75);border:1px solid ${hpDocState.selectedLayerId === layer.id ? '#38bdf8' : 'rgba(255,255,255,0.08)'};">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <span style="font-size:10px;font-weight:800;color:#38bdf8;text-transform:uppercase;">${layer.category}</span>
                <span style="font-size:10px;color:#94a3b8;">${layer.inTime.toFixed(1)}s – ${layer.outTime.toFixed(1)}s</span>
              </div>
              <div style="font-size:11px;font-weight:700;color:#e2e8f0;margin-bottom:6px;">${layer.label}</div>
              ${typeof layer.text === 'string' ? `
                <input type="text" class="hp-layer-text-input" data-layer-id="${layer.id}" data-field="text" value="${layer.text.replace(/"/g, '&quot;')}" style="width:100%;padding:5px 8px;border-radius:6px;background:#090d16;border:1px solid rgba(255,255,255,0.12);color:#fff;font-size:11px;margin-bottom:4px;" />
              ` : ''}
              ${typeof layer.subtext === 'string' ? `
                <input type="text" class="hp-layer-text-input" data-layer-id="${layer.id}" data-field="subtext" value="${layer.subtext.replace(/"/g, '&quot;')}" style="width:100%;padding:5px 8px;border-radius:6px;background:#090d16;border:1px solid rgba(255,255,255,0.12);color:#94a3b8;font-size:10.5px;" />
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
    panes.content.innerHTML = contentHtml;

    // 2. MOTION TAB: Position (X/Y), Scale, Rotation, In/Out Timing & Camera Keyframes
    const motionHtml = `
      <div class="rg-inspector-section" style="padding:12px;border-radius:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);margin-bottom:10px;">
        <div style="font-size:11px;font-weight:800;color:#38bdf8;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;">Object Spatial & Timing Controls</div>
        ${layers.slice(0, 6).map((layer) => `
          <div style="padding:8px 10px;border-radius:8px;background:rgba(15,23,42,0.7);border:1px solid rgba(255,255,255,0.07);margin-bottom:8px;">
            <div style="font-size:11px;font-weight:700;color:#f8fafc;margin-bottom:6px;">${layer.label}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
              <label style="font-size:10px;color:#94a3b8;">X Pos (${layer.x ?? 50}%)
                <input type="range" class="hp-layer-num-input" data-layer-id="${layer.id}" data-field="x" min="0" max="100" step="1" value="${layer.x ?? 50}" style="width:100%;" />
              </label>
              <label style="font-size:10px;color:#94a3b8;">Y Pos (${layer.y ?? 50}%)
                <input type="range" class="hp-layer-num-input" data-layer-id="${layer.id}" data-field="y" min="0" max="100" step="1" value="${layer.y ?? 50}" style="width:100%;" />
              </label>
              <label style="font-size:10px;color:#94a3b8;">Scale (${layer.scale ?? 100}%)
                <input type="range" class="hp-layer-num-input" data-layer-id="${layer.id}" data-field="scale" min="30" max="200" step="1" value="${layer.scale ?? 100}" style="width:100%;" />
              </label>
              <label style="font-size:10px;color:#94a3b8;">Rotation (${layer.rotation ?? 0}°)
                <input type="range" class="hp-layer-num-input" data-layer-id="${layer.id}" data-field="rotation" min="-45" max="45" step="0.5" value="${layer.rotation ?? 0}" style="width:100%;" />
              </label>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    panes.motion.innerHTML = motionHtml;

    // 3. LOOK TAB: Opacity, Accent Color, Glow Color & Material Styling
    const lookHtml = `
      <div class="rg-inspector-section" style="padding:12px;border-radius:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);margin-bottom:10px;">
        <div style="font-size:11px;font-weight:800;color:#38bdf8;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;">Lighting, Color & Opacity</div>
        ${layers.slice(0, 6).map((layer) => `
          <div style="padding:8px 10px;border-radius:8px;background:rgba(15,23,42,0.7);border:1px solid rgba(255,255,255,0.07);margin-bottom:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <span style="font-size:11px;font-weight:700;color:#f8fafc;">${layer.label}</span>
              <input type="color" class="hp-layer-color-input" data-layer-id="${layer.id}" data-field="accentColor" value="${layer.accentColor || layer.glowColor || '#38bdf8'}" style="width:28px;height:22px;border:none;background:transparent;cursor:pointer;" />
            </div>
            <label style="font-size:10px;color:#94a3b8;">Opacity (${layer.opacity ?? 100}%)
              <input type="range" class="hp-layer-num-input" data-layer-id="${layer.id}" data-field="opacity" min="0" max="100" step="1" value="${layer.opacity ?? 100}" style="width:100%;" />
            </label>
          </div>
        `).join('')}
      </div>
    `;
    panes.look.innerHTML = lookHtml;

    // 4. EFFECTS TAB: Audio Cue Synchronization & VFX Controls
    const effectsHtml = `
      <div class="rg-inspector-section" style="padding:12px;border-radius:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);margin-bottom:10px;">
        <div style="font-size:11px;font-weight:800;color:#38bdf8;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Synchronized Audio & VFX Cues</div>
        <div style="font-size:11px;line-height:1.45;color:#cbd5e1;padding:8px 10px;border-radius:8px;background:rgba(15,23,42,0.8);border:1px solid rgba(56,189,248,0.25);">
          ${ch.audioCueSummary}
        </div>
      </div>
    `;
    panes.effects.innerHTML = effectsHtml;

    // Wire live input listeners inside the inspector
    [panes.content, panes.motion, panes.look, panes.effects].forEach((pane) => {
      pane.querySelectorAll('.hp-layer-text-input').forEach((inp) => {
        inp.addEventListener('input', () => {
          const lid = inp.getAttribute('data-layer-id');
          const field = inp.getAttribute('data-field');
          const target = layers.find((l) => l.id === lid);
          if (target && field) {
            target[field] = inp.value;
            renderHpDocumentaryFrame();
          }
        });
      });
      pane.querySelectorAll('.hp-layer-num-input').forEach((inp) => {
        inp.addEventListener('input', () => {
          const lid = inp.getAttribute('data-layer-id');
          const field = inp.getAttribute('data-field');
          const target = layers.find((l) => l.id === lid);
          if (target && field) {
            target[field] = parseFloat(inp.value);
            renderHpDocumentaryFrame();
          }
        });
      });
      pane.querySelectorAll('.hp-layer-color-input').forEach((inp) => {
        inp.addEventListener('input', () => {
          const lid = inp.getAttribute('data-layer-id');
          const field = inp.getAttribute('data-field');
          const target = layers.find((l) => l.id === lid);
          if (target && field) {
            target[field] = inp.value;
            if (target.glowColor) target.glowColor = inp.value;
            renderHpDocumentaryFrame();
          }
        });
      });
    });

    return true;
  }

  function selectHpChapter(chapterId) {
    const ch = HP_CHAPTER_MAP[chapterId];
    const bpState = getBpState();
    if (!ch || !bpState) return;
    hpDocState.activeChapterId = chapterId;

    if (typeof window.applyMagnatesBPPresetToState === 'function') {
      window.applyMagnatesBPPresetToState(chapterId);
    } else {
      bpState.preset = chapterId;
      bpState.duration = ch.duration;
    }
    bpState.playhead = 0;

    // Update top scene toolbar title & counter if mounted
    const titleEl = document.querySelector('#modal-magnates-paper-blueprint-suite .rg-scene-title');
    const counterEl = document.querySelector('#modal-magnates-paper-blueprint-suite .rg-scene-counter-text');
    if (titleEl) titleEl.textContent = ch.title;
    if (counterEl) {
      counterEl.textContent = ch.chapterIndex > 0 ? `Chapter ${ch.chapterIndex} of 10` : 'Master 10-Chapter Flow';
    }

    // Populate the 4-Tab Contextual Inspector for Chapters 2..10
    const shell = document.querySelector('#magnates-bp-inspector-col .rg-inspector-shell');
    if (shell && chapterId !== 'printer_glitch_card') {
      const panes = {
        content: shell.querySelector('[data-pane="content"]'),
        motion: shell.querySelector('[data-pane="motion"]'),
        look: shell.querySelector('[data-pane="look"]'),
        effects: shell.querySelector('[data-pane="effects"]')
      };
      const advSubEl = shell.querySelector('[data-role="adv-sub"]');
      const advDrawer = shell.querySelector('[data-role="advanced-drawer"]');
      buildHpChapterInspector(chapterId, panes, advSubEl, advDrawer);
    }

    if (typeof updateMagnatesBPVisualStyles === 'function') {
      updateMagnatesBPVisualStyles();
    }
    renderHpDocumentaryFrame();
  }

  // Build the full 6m30s (390.0s) multi-track timeline clips array when user clicks "Apply to Timeline"
  function buildFull6m30sTimelineTracks() {
    const now = Date.now();
    const imageClips = [];
    const textClips = [];
    const chartClips = [];
    const voiceoverClips = [];
    const musicClips = [];

    HP_CHAPTER_DEFS.filter((c) => c.id !== 'hp_full_6m30s_doc').forEach((ch, idx) => {
      imageClips.push({
        id: `hp-ch${ch.chapterIndex}-plate-${now + idx}`,
        name: ch.title,
        url: ch.thumb,
        start: ch.startSec,
        duration: ch.duration,
        scale: 1.0,
        transition: idx === 0 ? 'glitch' : 'fade',
        transitionDuration: 0.35
      });

      textClips.push({
        id: `hp-ch${ch.chapterIndex}-title-${now + idx}`,
        text: ch.title,
        highlight: ch.code,
        highlightColor: '#38bdf8',
        anim: 'slide',
        fontSize: 28,
        fontFamily: 'Inter, sans-serif',
        start: ch.startSec + 0.4,
        duration: Math.max(2.0, Math.min(8.0, ch.duration - 0.8))
      });

      voiceoverClips.push({
        id: `hp-ch${ch.chapterIndex}-vo-${now + idx}`,
        name: `VO · ${ch.shortTitle}`,
        url: '/hp_recon/hp_ref_audio_6m30s.mp3',
        start: ch.startSec,
        duration: ch.duration,
        volume: 100
      });
    });

    chartClips.push(
      {
        id: `hp-chart-hpq-${now}`,
        name: 'CNBC HP INC (HPQ) 28.65 Stock Chart',
        type: 'line',
        start: 77.5,
        duration: 8.5
      },
      {
        id: `hp-chart-usage-${now + 1}`,
        name: 'HP Instant Ink Usage Data: 450 Pages (Jan/Feb)',
        type: 'bar',
        start: 330.0,
        duration: 6.5
      }
    );

    musicClips.push({
      id: `hp-bgm-doc-${now}`,
      name: 'Mundo Startup Investigative Documentary Score & SFX Bus (0:00–6:30)',
      url: '/hp_recon/hp_ref_audio_6m30s.mp3',
      start: 0,
      duration: 390.0,
      volume: 85
    });

    return {
      image: imageClips,
      text: textClips,
      chart: chartClips,
      voiceover: voiceoverClips,
      music: musicClips
    };
  }

  function initHpDocumentaryEngine() {
    registerHpChaptersIntoStudio();
    ensureHpStageContainer();
    ensureHpChapterRibbon();

    // Hook into updateMagnatesBPVisualStyles so every playhead tick or scrub updates #hp-doc-stage-root
    const origUpdate = window.updateMagnatesBPVisualStyles;
    if (typeof origUpdate === 'function' && !origUpdate._hpWrapped) {
      const wrapped = function () {
        const res = origUpdate.apply(this, arguments);
        renderHpDocumentaryFrame();
        return res;
      };
      wrapped._hpWrapped = true;
      window.updateMagnatesBPVisualStyles = wrapped;
    }

    // Hook into applyMagnatesBPPresetToState so selecting any HP chapter updates duration & inspector
    const origApplyPreset = window.applyMagnatesBPPresetToState;
    if (typeof origApplyPreset === 'function' && !origApplyPreset._hpWrapped) {
      const wrappedPreset = function (pKey) {
        const res = origApplyPreset.apply(this, arguments);
        const bpState = getBpState();
        if (bpState && HP_CHAPTER_MAP[pKey]) {
          bpState.duration = HP_CHAPTER_MAP[pKey].duration;
        }
        renderHpDocumentaryFrame();
        return res;
      };
      wrappedPreset._hpWrapped = true;
      window.applyMagnatesBPPresetToState = wrappedPreset;
    }

    // Enhance #btn-apply-magnates-bp-suite so applying any HP chapter or Full 6:30 populates the Studio Timeline
    const applyBtn = document.getElementById('btn-apply-magnates-bp-suite');
    if (applyBtn && !applyBtn._hpBound) {
      applyBtn._hpBound = true;
      applyBtn.addEventListener('click', () => {
        const bpState = getBpState();
        if (bpState && HP_CHAPTER_MAP[bpState.preset] && bpState.preset !== 'printer_glitch_card') {
          const tracks = buildFull6m30sTimelineTracks();
          if (typeof timelineClips === 'object' && timelineClips) {
            timelineClips.image = tracks.image;
            timelineClips.text = tracks.text;
            if (Array.isArray(timelineClips.chart)) timelineClips.chart = tracks.chart;
            if (Array.isArray(timelineClips.voiceover)) timelineClips.voiceover = tracks.voiceover;
            if (Array.isArray(timelineClips.music)) timelineClips.music = tracks.music;
            if (typeof renderAllTimelineTracks === 'function') renderAllTimelineTracks();
          }
        }
      });
    }

    renderHpDocumentaryFrame();
  }

  window.HPDocEngine = {
    chapters: HP_CHAPTER_DEFS,
    chapterMap: HP_CHAPTER_MAP,
    state: hpDocState,
    selectChapter: selectHpChapter,
    renderFrame: renderHpDocumentaryFrame,
    buildInspector: buildHpChapterInspector,
    buildFullTimelineTracks: buildFull6m30sTimelineTracks,
    init: initHpDocumentaryEngine
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initHpDocumentaryEngine, 60));
  } else {
    setTimeout(initHpDocumentaryEngine, 60);
  }
})();
