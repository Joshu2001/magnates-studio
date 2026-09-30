---
name: audio-denoise
description: >-
  Use this skill whenever the user wants to remove background noise (fan hum, wind rumble,
  air conditioning, or ambient hiss) from speech recordings, voice notes, or video/audio clips.
  Provides two reusable cleaning profiles: natural vocal preservation and aggressive noise suppression.
---

# Audio Denoise Skill

This skill automates removing stationary fan hum, low-frequency wind buffet, and HVAC noise from voice recordings using dual-stage filtering (Butterworth sub-bass rumble cutoff + spectral gating).

## When to Use
- User has voice notes, mic recordings, or video audio with background fan/wind noise.
- Audio needs voice isolation and clarity enhancements.

## Denoising Profiles

1. **Natural (`--mode natural`)**:
   - **Filter**: 80Hz 4th-order Butterworth high-pass filter.
   - **Gating**: Dynamic non-stationary spectral gating (`prop_decrease=0.80`, `stationary=False`).
   - **Best for**: Light-to-moderate fan noise, conversational audio where speech warmth and natural timbre must be preserved without robotic/tinny artifacts.

2. **Aggressive (`--mode aggressive`)**:
   - **Filter**: 80Hz 4th-order Butterworth high-pass filter.
   - **Gating**: Stationary spectral profiling (`prop_decrease=0.95`, `stationary=True`).
   - **Best for**: Loud fan hum directly behind the microphone, intense AC noise, or audio intended for automated transcription/whisper models.

3. **Both (`--mode both`)**:
   - Generates both versions so the user can compare side-by-side.

---

## Prerequisites

The following Python packages must be available:
```bash
pip install noisereduce librosa soundfile scipy
```

---

## Execution Guide

Run the bundled Python script:

```bash
# Clean both natural and aggressive versions
python .agents/skills/audio-denoise/scripts/denoise.py "<path_to_audio_or_video>"

# Produce only natural version
python .agents/skills/audio-denoise/scripts/denoise.py "<path_to_audio_or_video>" --mode natural

# Produce only aggressive version
python .agents/skills/audio-denoise/scripts/denoise.py "<path_to_audio_or_video>" --mode aggressive

# Specify a custom output directory
python .agents/skills/audio-denoise/scripts/denoise.py "<path_to_audio_or_video>" --output_dir "<output_directory>"
```

### Supported Formats
Supports `.mp4`, `.mp3`, `.wav`, `.m4a`, `.aac`, `.flac`, and any standard audio/video container supported by `librosa`/`audioread`.
Output is exported as uncompressed high-fidelity `.wav`.
