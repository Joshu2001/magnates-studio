"""
Audio Denoise Utility Script
Provides two noise-reduction modes:
  - natural: 80Hz rumble cut + dynamic spectral gating (prop_decrease=0.80) to preserve voice body.
  - aggressive: 80Hz rumble cut + stationary spectral suppression (prop_decrease=0.95) for heavy fan noise.
"""

import os
import sys
import argparse
import numpy as np
import librosa
import soundfile as sf
import noisereduce as nr
from scipy.signal import butter, sosfilt

def denoise_audio(input_file: str, mode: str = "both", output_dir: str = None) -> list:
    if not os.path.exists(input_file):
        raise FileNotFoundError(f"Input file not found: {input_file}")

    if output_dir is None:
        output_dir = os.path.dirname(input_file) or "."
    os.makedirs(output_dir, exist_ok=True)

    base_name = os.path.splitext(os.path.basename(input_file))[0]

    print(f"[denoise] Loading '{input_file}'...")
    audio, sr = librosa.load(input_file, sr=None, mono=False)
    is_stereo = (audio.ndim > 1 and audio.shape[0] > 1)
    print(f"[denoise] Sample rate: {sr} Hz, Stereo: {is_stereo}, Shape: {audio.shape}")

    # Step 1: 80Hz 4th-order Butterworth High-pass Filter for sub-bass rumble/wind buffet
    sos = butter(4, 80, btype='highpass', fs=sr, output='sos')
    if is_stereo:
        filtered = np.array([sosfilt(sos, ch) for ch in audio])
    else:
        filtered = sosfilt(sos, audio)

    generated_files = []

    # Step 2: Natural mode (preserve vocal warmth & dynamic ambient tracking)
    if mode in ("natural", "both"):
        print("[denoise] Applying natural reduction (prop_decrease=0.80, stationary=False)...")
        cleaned_natural = nr.reduce_noise(
            y=filtered,
            sr=sr,
            prop_decrease=0.80,
            stationary=False,
            n_fft=2048,
            win_length=2048,
            hop_length=512
        )
        out_natural = os.path.join(output_dir, f"{base_name}_cleaned_natural.wav")
        data_to_write = cleaned_natural.T if is_stereo else cleaned_natural
        sf.write(out_natural, data_to_write, sr)
        print(f"[denoise] Output saved -> {out_natural}")
        generated_files.append(out_natural)

    # Step 3: Aggressive mode (stationary noise removal for persistent loud fan/AC hum)
    if mode in ("aggressive", "both"):
        print("[denoise] Applying aggressive reduction (prop_decrease=0.95, stationary=True)...")
        cleaned_aggressive = nr.reduce_noise(
            y=filtered,
            sr=sr,
            prop_decrease=0.95,
            stationary=True,
            n_fft=2048,
            win_length=2048,
            hop_length=512
        )
        out_aggressive = os.path.join(output_dir, f"{base_name}_cleaned_aggressive.wav")
        data_to_write = cleaned_aggressive.T if is_stereo else cleaned_aggressive
        sf.write(out_aggressive, data_to_write, sr)
        print(f"[denoise] Output saved -> {out_aggressive}")
        generated_files.append(out_aggressive)

    return generated_files

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Clean background fan/wind noise from audio.")
    parser.add_argument("input_file", help="Path to input audio/video file (mp4, wav, mp3, etc.)")
    parser.add_argument("--mode", choices=["natural", "aggressive", "both"], default="both", help="Denoising mode")
    parser.add_argument("--output_dir", default=None, help="Directory to save cleaned audio")

    args = parser.parse_args()
    denoise_audio(args.input_file, mode=args.mode, output_dir=args.output_dir)
