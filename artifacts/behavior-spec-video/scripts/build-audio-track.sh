#!/bin/bash
set -e

AUDIO_DIR="$(dirname "$0")/../public/audio"
OUT_DIR="$(dirname "$0")/../public"
OUT_FILE="$OUT_DIR/combined-audio.wav"

# 19-scene layout matching VideoTemplate SCENE_DURATIONS:
# hook:17000 context:25000 intro:44000 compare:22500 inconsistency:38500
# routingTypeahead:4500 routingComparison:7000 routingDetail:41500
# insideSpec:40000 scale:25000
# orchPart1:40000 orchMemory:21800 orchTone:10000 orchRouting:8000
# agentC1:13700 agentC2:5000 agentC3:6000 agentC4:12000
# closing:20500
# Total: 404000ms = 404.0s (6:44)
#
# Scene start times in ms (cumulative):
#  0:      0   (hook)              → scene1.wav
#  1:  17000   (context)           → scene_transition.wav
#  2:  42000   (intro)             → scene2.wav
#  3:  86000   (compare)           → scene3.wav
#  4: 108500   (inconsistency)     → scene4.wav
#  5: 147000   (routingTypeahead)  → scene6a.wav
#  6: 151500   (routingComparison) → scene6b.wav
#  7: 158500   (routingDetail)     → sub-phases:
#      158000   why-bridge          → scene6b_bridge.wav
#      166000   why-grid            → scene6c.wav
#      177150   why-detail          → scene6d.wav
#  8: 200000   (insideSpec)        → scene_inside_spec.wav
#  9: 240000   (scale)             → scene_orchestration_scale.wav
# 10: 265000   (orchPart1)         → scene7b_p1.wav
# 11: 305000   (orchMemory)        → scene7b_p2.wav
# 12: 326800   (orchTone)          → scene_orch_tone.wav
# 13: 336800   (orchRouting)       → scene_orch_routing.wav
# 14: 344800   (agentC1)           → scene7b_c1.wav
# 15: 358500   (agentC2)           → scene7b_c2.wav
# 16: 363500   (agentC3)           → scene7b_c3.wav
# 17: 369500   (agentC4)           → scene7b_c4.wav
# 18: 381500   (closing)           → scene5.wav (+500ms pause → audio at 384000)

TOTAL_MS=400000

echo "Building combined audio track (19 scenes, ${TOTAL_MS}ms / 400.0s)..."

ffmpeg -y \
  -i "$AUDIO_DIR/scene1.wav" \
  -i "$AUDIO_DIR/scene_transition.wav" \
  -i "$AUDIO_DIR/scene2.wav" \
  -i "$AUDIO_DIR/scene3.wav" \
  -i "$AUDIO_DIR/scene4.wav" \
  -i "$AUDIO_DIR/scene6a.wav" \
  -i "$AUDIO_DIR/scene6b.wav" \
  -i "$AUDIO_DIR/scene6b_bridge.wav" \
  -i "$AUDIO_DIR/scene6c.wav" \
  -i "$AUDIO_DIR/scene6d.wav" \
  -i "$AUDIO_DIR/scene_inside_spec.wav" \
  -i "$AUDIO_DIR/scene_orchestration_scale.wav" \
  -i "$AUDIO_DIR/scene7b_p1.wav" \
  -i "$AUDIO_DIR/scene7b_p2.wav" \
  -i "$AUDIO_DIR/scene_orch_tone.wav" \
  -i "$AUDIO_DIR/scene_orch_routing.wav" \
  -i "$AUDIO_DIR/scene7b_c1.wav" \
  -i "$AUDIO_DIR/scene7b_c2.wav" \
  -i "$AUDIO_DIR/scene7b_c3.wav" \
  -i "$AUDIO_DIR/scene7b_c4.wav" \
  -i "$AUDIO_DIR/scene5.wav" \
  -filter_complex "\
[0]adelay=0|0[a0];\
[1]adelay=17000|17000[a1];\
[2]adelay=42000|42000[a2];\
[3]adelay=86000|86000[a3];\
[4]adelay=108500|108500[a4];\
[5]adelay=147500|147500[a5];\
[6]adelay=151500|151500[a6];\
[7]adelay=158000|158000[a7];\
[8]adelay=166000|166000[a8];\
[9]adelay=177150|177150[a9];\
[10]adelay=203050|203050[a10];\
[11]adelay=237000|237000[a11];\
[12]adelay=262000|262000[a12];\
[13]adelay=302000|302000[a13];\
[14]adelay=323800|323800[a14];\
[15]adelay=333800|333800[a15];\
[16]adelay=341800|341800[a16];\
[17]adelay=355500|355500[a17];\
[18]adelay=360500|360500[a18];\
[19]adelay=366500|366500[a19];\
[20]adelay=379000|379000[a20];\
[a0][a1][a2][a3][a4][a5][a6][a7][a8][a9][a10][a11][a12][a13][a14][a15][a16][a17][a18][a19][a20]amix=inputs=21:duration=longest:dropout_transition=0:normalize=0[out]" \
  -map "[out]" \
  -t 400.0 \
  -ar 44100 \
  "$OUT_FILE" 2>&1 | tail -5

cp "$OUT_FILE" "$OUT_DIR/combined-audio-v2.wav"
echo "Combined audio written to: $OUT_FILE (and v2 copy)"
ls -lh "$OUT_FILE" "$OUT_DIR/combined-audio-v2.wav"
