#!/usr/bin/env bash
set -euo pipefail
FF="/c/Users/12031/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/ffmpeg.exe"
SRC=/e/DEV/RocoDex/public/cstd-universe
HERE=$(pwd)
# leg|image|seconds|zoom-max
LEGS=(
"1|cstd-departure-city-v1.webp|5|1.16"
"2|cstd-neural-gate-v1.webp|5|1.16"
"3|cstd-method-bench-v3.webp|5|1.15"
"4|cstd-evidence-foundry-v2.webp|5|1.16"
"5|cstd-core-world-v4.webp|8|1.22"
"6|cstd-knowledge-loom-v3.webp|5|1.15"
"7|cstd-quiet-archive-v4.webp|5|1.15"
"8|cstd-observatory-core-v3.webp|5|1.16"
"9|cstd-night-workstation-v1.webp|5|1.14"
)
for spec in "${LEGS[@]}"; do
  IFS='|' read -r n img dur zmax <<< "$spec"
  frames=$(( dur * 30 ))
  inc=$(python -c "print(f'{(${zmax}-1)/${frames}:.6f}')" 2>/dev/null || awk "BEGIN{printf \"%.6f\", (${zmax}-1)/${frames}}")
  echo "== leg $n: $img ${dur}s zoom->${zmax} inc=$inc"
  "$FF" -y -hide_banner -loglevel error -i "$SRC/$img" \
    -vf "scale=3840:2160:force_original_aspect_ratio=increase:flags=lanczos,crop=3840:2160,zoompan=z='min(zoom+${inc},${zmax})':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1920x1080:fps=30" \
    -frames:v "$frames" -c:v libx264 -preset medium -crf 17 -pix_fmt yuv420p -an "out/leg${n}.mp4"
done
echo "ALL RENDERS DONE"
