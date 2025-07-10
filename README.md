# AricaApp

## Project Maintenance

### Troubleshooting Build Issues

If you encounter bundling errors, dependency conflicts, or caching issues:

#### Quick Fix (Cache Issues)
```bash
npm run clean:cache
```

#### Full Reset (Dependency Issues)
```bash
npm run reset
```

#### Manual Cleanup
```bash
npm run clean
```

#### Android-specific Issues
```bash
npm run clean:android
```

### Common Issues

1. **Metro bundler errors** - Usually cache related
   - Solution: `npm run clean:cache`

2. **Dependency conflicts** - Mixed package managers or corrupted node_modules
   - Solution: `npm run reset`

3. **Android build failures** - Stale build artifacts
   - Solution: `npm run clean:android`

4. **Hermes parser errors** - Corrupted dependencies
   - Solution: `npm run clean && npm install`

### Files to Never Commit

The `.gitignore` is configured to exclude:
- `node_modules/`
- `android/build/`, `android/.gradle/`
- `.expo/`, `metro-cache/`
- `*.jsbundle`, `*.bundle`
- `hs_err_pid*.log`, `replay_pid*.log`

If you see these files in git status, they should be ignored.

---

# AricaApp Shizuku Integration

This guide explains how to eject from Expo or set up a custom dev client and integrate Shizuku to force-stop other Android apps.

## 1. Eject from Expo / Create Custom Dev Client

### Option A: Eject to Bare Workflow
```powershell
cd c:/Users/lnszz/OneDrive/Escritorio/data/aricaApp
expo eject
```

### Option B: Custom Dev Client (no eject)
1. Install the dev client package:
   ```powershell
   cd c:/Users/lnszz/OneDrive/Escritorio/data/aricaApp
   npx expo install expo-dev-client
   ```
2. Enable the plugin in `app.json`:
   ```diff
   {
     "expo": {
       // ...existing config...
   +   "plugins": [
   +     "expo-dev-client"
   +   ],
       // ...existing config...
     }
   }
   ```
3. Start Metro for the dev client:
   ```powershell
   expo start --dev-client
   ```
4. Build & install the custom client on Android:
   ```powershell
   # Local build (may require prebuild internally)
   npx expo run:android --variant devClient

   # OR cloud build via EAS
   eas build --profile development --platform android
   ```

## 2. Install Shizuku Manager (Non-Rooted Devices)
1. Download Shizuku Manager from Play Store.
2. On first launch, tap **Start from ADB** and run:
   ```powershell
   adb shell shizuku server start
   ```
3. Grant permission when prompted.

## 3. Android Native Changes

### AIDL File
Path: `android/app/src/main/aidl/moe/shizuku/server/IShizukuService.aidl`
(Standard Shizuku AIDL file provided by Shizuku documentation)

### build.gradle (Module: app)
```diff
dependencies {
-   // ...existing dependencies...
+   implementation "com.github.rikka.tools:shizuku:latest.release"
}
```
Ensure `sourceSets` includes `aidl`:
```diff
android {
-   // ...existing config...
+   sourceSets {
+       main {
+           aidl.srcDirs += 'src/main/aidl'
+       }
+   }
}
```

### AndroidManifest.xml
```diff
<manifest ...>
+   <uses-permission android:name="moe.shizuku.manager.permission.SHIZUKU_BIND" />
</manifest>
```

### Java Native Module

- **ShizukuModule.java** (`android/app/src/main/java/com/aricapp/ShizukuModule.java`)
  - `initialize` method: auto-start on root, or request permission.
  - `forceStopApp` method: calls `pm.forceStopPackage(packageName, UserHandle.USER_ALL)`.

- **ShizukuPackage.java** (`android/app/src/main/java/com/aricapp/ShizukuPackage.java`)
  - Registers `ShizukuModule`.

- **MainApplication.java** (`android/app/src/main/java/com/aricapp/MainApplication.java`)
  - Add `new ShizukuPackage()` to `getPackages()`.

## 4. JS Bridge & Usage

- **src/ShizukuBridge.js**
  ```js
  import { NativeModules, Platform } from 'react-native';
  const { ShizukuModule } = NativeModules;
  export function initializeShizuku() { ... }
  export function forceStopApp(packageName) { ... }
  ```

- **Productivity Components** (Task creation, calendar events, productivity tracking)
  - Integrates with the core productivity features of the app.

## 5. Rooted Devices
- `initialize` checks `Shizuku.hasRootPermission()`, calls `Shizuku.startV2(context)`.
- No extra manifest entries needed.
- Listens for `Shizuku.onRequestPermissionResult` internally.

## 6. Error Handling
- Non-rooted & not running: rejects with `PERMISSION_REQUIRED`.
- User denies: `PERMISSION_DENIED`.
- Other exceptions: `SHIZUKU_ERROR`.

## 7. Testing & Validation
1. **Rooted**: install APK, open app, verify auto-start logs: `Log.d(TAG, ...)`, tap **Close App**, check target stopped.
2. **Non-rooted**: install Shizuku Manager, start server via ADB, open app, grant permission, tap **Close App**.

## 8. Logs
Example `Log.d` statements in `ShizukuModule` for:
- Starting Shizuku via root.
- Requesting permission.
- Binding service.
- Force-stopping package.

## 9. Build Config
- RN 0.71+, SDK 33+, Java 11.
- In `android/build.gradle`, set `compileOptions` to Java 11.
