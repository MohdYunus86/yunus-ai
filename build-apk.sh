#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SDK="${ANDROID_HOME:-/home/user/android-sdk}"
JAVA_HOME="${JAVA_HOME:-/home/user/jdk-17}"
export JAVA_HOME PATH="$JAVA_HOME/bin:$SDK/build-tools/35.0.0:$PATH"
ANDROID_JAR="$SDK/platforms/android-35/android.jar"
BUILD_TOOLS="$SDK/build-tools/35.0.0"
APP="$ROOT/android/app/src/main"
OUT="$ROOT/android/build/out"
OBJ="$ROOT/android/build/obj"
DEX="$ROOT/android/build/dex"
rm -rf "$OBJ" "$DEX" "$OUT"
mkdir -p "$OBJ" "$DEX" "$OUT"
"$BUILD_TOOLS/aapt2" compile --dir "$APP/res" -o "$OUT/res.zip"
"$BUILD_TOOLS/aapt2" link -o "$OUT/base-unsigned.apk" -I "$ANDROID_JAR" --manifest "$APP/AndroidManifest.xml" -R "$OUT/res.zip" -A "$APP/assets" --auto-add-overlay --min-sdk-version 23 --target-sdk-version 35
javac -source 8 -target 8 -bootclasspath "$ANDROID_JAR" -d "$OBJ" $(find "$APP/java" -name '*.java')
"$BUILD_TOOLS/d8" --lib "$ANDROID_JAR" --output "$DEX" $(find "$OBJ" -name '*.class')
cp "$OUT/base-unsigned.apk" "$OUT/with-dex.apk"
(cd "$DEX" && zip -q "$OUT/with-dex.apk" classes.dex)
# Assets are packaged by aapt2 with -A above.
"$BUILD_TOOLS/zipalign" -f 4 "$OUT/with-dex.apk" "$OUT/yunus-ai-unsigned-aligned.apk"
if [ ! -f "$ROOT/android/debug.keystore" ]; then
  keytool -genkeypair -v -keystore "$ROOT/android/debug.keystore" -storepass android -keypass android -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Yunus AI Debug,O=Yunus AI,C=MY"
fi
"$BUILD_TOOLS/apksigner" sign --ks "$ROOT/android/debug.keystore" --ks-pass pass:android --key-pass pass:android --out "$ROOT/yunus-ai.apk" "$OUT/yunus-ai-unsigned-aligned.apk"
"$BUILD_TOOLS/apksigner" verify "$ROOT/yunus-ai.apk"
echo "APK siap: $ROOT/yunus-ai.apk"
