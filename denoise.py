import os
import numpy as np
import librosa
import soundfile as sf
import noisereduce as nr
from scipy.signal import butter, sosfilt

def clean_audio():
    downloads = os.path.expanduser(r"~\Downloads")
    input_file = os.path.join(downloads, "WhatsApp Audio 2026-09-29 at 15.32.45 microoft.mp4")
    
    print(f"Loading: {input_file}")
    # Load audio, keeping original sample rate
    audio, sr = librosa.load(input_file, sr=None, mono=False)
    
    is_stereo = (audio.ndim > 1 and audio.shape[0] > 1)
    print(f"Sample rate: {sr} Hz, Shape: {audio.shape}, Stereo: {is_stereo}")

    # Highpass filter at 80Hz to eliminate sub-bass rumble/wind buffet
    sos = butter(4, 80, btype='highpass', fs=sr, output='sos')
    if is_stereo:
        filtered = np.array([sosfilt(sos, ch) for ch in audio])
    else:
        filtered = sosfilt(sos, audio)

    # 1. Cleaned version with gentle reduction (natural voice, minimal artifacts)
    # stationary=False lets it track fluctuating windy noise dynamically
    print("Running stationary & non-stationary noise reduction...")
    cleaned_gentle = nr.reduce_noise(
        y=filtered,
        sr=sr,
        prop_decrease=0.80,
        stationary=False,
        n_fft=2048,
        win_length=2048,
        hop_length=512
    )

    # 2. Stronger reduction version (for very loud fan/wind noise)
    cleaned_strong = nr.reduce_noise(
        y=filtered,
        sr=sr,
        prop_decrease=0.95,
        stationary=True,
        n_fft=2048,
        win_length=2048,
        hop_length=512
    )

    out_gentle_wav = os.path.join(downloads, "WhatsApp_Audio_Cleaned_Natural.wav")
    out_strong_wav = os.path.join(downloads, "WhatsApp_Audio_Cleaned_Aggressive.wav")

    # Transpose for soundfile if multi-channel (samples, channels)
    if is_stereo:
        sf.write(out_gentle_wav, cleaned_gentle.T, sr)
        sf.write(out_strong_wav, cleaned_strong.T, sr)
    else:
        sf.write(out_gentle_wav, cleaned_gentle, sr)
        sf.write(out_strong_wav, cleaned_strong, sr)

    print(f"Saved natural cleaned audio to: {out_gentle_wav}")
    print(f"Saved aggressive cleaned audio to: {out_strong_wav}")

if __name__ == "__main__":
    clean_audio()
