const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, '..', 'android', 'README-APK.md');
fs.writeFileSync(out, `# Yunus AI Android APK\n\nFail ini menerangkan cara bungkus Yunus AI sebagai APK.\n\n## Cara paling mudah\n\n1. Run Yunus AI dan deploy ke hosting HTTPS.\n2. Pergi ke PWABuilder.\n3. Masukkan URL.\n4. Download Android package/APK.\n\n## Kenapa APK belum dikompil di sandbox ini?\n\nAndroid SDK, Gradle dan build-tools tidak tersedia dalam environment ini.\n`);
console.log('APK preparation note created:', out);
