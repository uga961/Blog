---
title: "How I Debloated My Android TV: A Step-by-Step Guide Using ADB"
slug: "debloat-android-tv-adb-guide"
date: "2026-10-22"
excerpt: "My practical guide to cleaning up a slow Android TV with ADB over Wi-Fi, a lighter home screen, careful package checks, reversible changes, and troubleshooting steps."
tags: ["Android TV", "ADB", "Windows", "Xiaomi Mi TV", "TV Detox", "Guides"]
coverImage: "https://i.imgur.com/yzHJr4d.jpeg"
author: "Ugandhar"
published: true
---

# How I Debloated My Android TV: A Step-by-Step Guide Using ADB

My Android TV had started to feel heavier than it needed to be. The home screen was full of recommendations, PatchWall had its own content, and I mainly wanted to open a handful of streaming apps or switch to an HDMI input.

I wanted a cleaner interface and fewer things running in the background, but I did not want to root the TV, flash custom firmware, or permanently delete system apps. I wanted changes I could understand and reverse.

I ended up using **ADB (Android Debug Bridge)** over my local network and installing [TV Detox](https://github.com/Ansub/tv-detox), a small open-source launcher. I also reviewed the installed packages, disabled a set of apps I did not use, turned off interface animations, and changed a few display settings.

This guide documents what I did on my Xiaomi Mi TV (`MiTv-AXSO0`) and explains how to approach the same process on another Android TV. Menu names and package names vary by model, region, and Android version, so do not copy every command blindly.

> **Important:** ADB can change how your TV starts and which built-in features work. Read each command before running it. Disable only packages you have identified on your own TV, keep a record of every change, and test after each group of changes. This guide is based on one device, not a universal safe-to-disable list.

## What you need

- A Windows 10 or Windows 11 computer.
- An Android TV or Google TV connected to the same home network as your computer.
- ADB from Google's official [SDK Platform-Tools for Windows](https://dl.google.com/android/repository/platform-tools-latest-windows.zip).
- [TV Detox](https://github.com/Ansub/tv-detox) if you want to replace the home screen.
- Your TV remote, so you can approve the debugging prompt on the TV.
- A little time to check the results and recover if something does not behave as expected.

You do not need root access. The commands below use ADB and Android's package manager.

## 1. Enable developer options on the TV

First, allow your TV to accept debugging commands from your computer.

1. Open **Settings** on the TV.
2. Go to **Device Preferences** or **System**.
3. Open **About**.
4. Find **Build** and press OK on it seven times.
5. Wait for the message confirming that developer options are enabled.
6. Return to the previous menu and open **Developer options**.
7. Enable **USB debugging**. Depending on the TV, the option may be called **ADB debugging** or **Network debugging**.

The labels differ between Android TV versions and manufacturers. If you cannot find the option, check the TV's About and Developer options screens before continuing.


## 2. Download and open Android Platform-Tools on Windows

Download the official ZIP:

[Download SDK Platform-Tools for Windows](https://dl.google.com/android/repository/platform-tools-latest-windows.zip)

1. Open the downloaded ZIP in File Explorer.
2. Extract the `platform-tools` folder somewhere easy to find, such as `Downloads`.
3. Open that folder. You should see files including `adb.exe`.
4. Click the File Explorer address bar, type `cmd`, and press Enter. This opens Command Prompt in that folder.

You should end up with a prompt similar to:

```text
C:\Users\YourName\Downloads\platform-tools>
```

Check that ADB runs:

```bat
adb version
```

It should print the installed Android Debug Bridge version. If Windows says `adb` is not recognised, Command Prompt is not open in the folder containing `adb.exe`, or the folder is not on your PATH. Open Command Prompt from the correct folder and try again.


## 3. Connect to the TV over Wi-Fi

Find the TV's IP address in its network settings. On my TV, it was `YOUR_OWN_IP`. **Use your own TV's IP address in every command if it is different.**

In Command Prompt, run:

```bat
adb connect YOUR_OWN_IP:5555
```

Look at the TV screen. If it asks whether to allow debugging from the computer, confirm the prompt. Only select **Always allow** if this is your own trusted computer and you want to avoid approving it again.

Now check the connection:

```bat
adb devices
```

A successful connection should look similar to:

```text
List of devices attached
YOUR_OWN_IP:5555    device
```

If the status says `unauthorized`, the TV has not approved this computer yet. See the troubleshooting section below.

**A note about newer Android versions:** Some devices use Wireless debugging with a pairing code and a separate port rather than the older `IP:5555` connection. In that case, use the pairing address and port shown on the TV's Wireless debugging screen. Do not assume port 5555 is available on every device.


## 4. Take a baseline before changing anything

Before disabling apps or changing settings, record the current state. This gives you something to compare against later and helps you notice if a change causes a problem.

### Check memory

Run:

```bat
adb shell cat /proc/meminfo | findstr /i "MemTotal MemFree MemAvailable"
```

On my Mi TV, the first recorded result was:

```text
MemTotal:        1014724 kB
MemFree:           50720 kB
MemAvailable:     287732 kB
```

That is approximately 1 GB of total RAM and 288 MB of available memory at that moment.

A quick explanation of the values:

- **MemTotal** is the memory visible to the Linux kernel.
- **MemFree** is memory currently unused.
- **MemAvailable** estimates how much memory can be used by apps without significant swapping.

Do not treat `MemFree` as the only performance measure. Android uses spare memory for caches, and memory readings change as apps open and close. A before-and-after comparison is useful, but it is not a controlled performance benchmark.

### Save the installed package list

Run:

```bat
adb shell pm list packages -f
```

This lists packages and their APK paths. Save the output somewhere on your computer before making changes. You can also create a simpler list:

```bat
adb shell pm list packages
```

To see packages that are already disabled:

```bat
adb shell pm list packages -d
```

Keep these outputs with your notes. A package name alone does not always tell you exactly what the app does, and a package that is safe to disable on one TV may be required by another.


## 5. Understand the package list before disabling anything

Android apps are identified by package names, such as `com.google.android.youtube.tv`. Those names are what ADB uses when you disable or re-enable an app.

I divided my list into three groups.

### Keep these system components enabled

Do not disable core services just because their names look unfamiliar. On my TV, I left these categories alone:

- Google Play services: `com.google.android.gms`
- Google Play Store: `com.android.vending`
- Android TV Settings: `com.android.tv.settings`
- System UI: `com.android.systemui`
- Android TV keyboard: `com.google.android.inputmethod.latin`
- Bluetooth: `com.android.bluetooth`
- TV input service: `com.droidlogic.tvinput`
- Live TV / input handling: `com.droidlogic.droidlivetv`, `com.droidlogic`, and `mitv.service`
- TV manager: `com.xiaomi.mitv.tvmanager`
- TV provider: `com.android.providers.tv`
- Setup and package installer components, unless there is a specific, verified reason to change them

This is not an exhaustive list of every essential package. It is a reminder to leave system, setup, input, remote-control, and hardware-related services alone unless you know exactly what a change will do.

### Keep the apps you actually use

My home screen needed these five apps:

| App | Package name |
|---|---|
| YouTube | `com.google.android.youtube.tv` |
| Netflix | `com.netflix.ninja` |
| FanCode | `com.fancode.tv` |
| Amazon Prime Video | `com.amazon.amazonvideo.livingroom` |
| Disney+ Hotstar | `in.startv.hotstar` |
| TV Detox launcher | `com.ansub.tvhome` |

Your package names may differ. Confirm them using your own package list instead of assuming these names apply to every TV.

### Review optional apps one by one

My package list also included apps for analytics, feedback, games, music, gallery, screensavers, recommendations, and Xiaomi features. Some were not useful to my setup, so I disabled selected packages.

Examples from my own TV included:

| Package | What I treated it as | Important limitation |
|---|---|---|
| `com.miui.tv.analytics` | Xiaomi TV analytics | Confirm the exact package exists first |
| `com.xiaomi.statistic` | Xiaomi statistics / telemetry | Confirm the exact package exists first |
| `com.google.android.feedback` | Google feedback | May affect feedback reporting |
| `com.google.android.tv.bugreportsender` | TV bug-reporting helper | May affect diagnostics |
| `com.google.android.youtube.tvmusic` | YouTube Music for TV | Keep it if you use it |
| `com.google.android.videos` | Preinstalled video app | Check whether any app depends on it |
| `com.google.android.play.games` | Google Play Games | Keep it if you use games or related features |
| `com.xiaomi.mimusic2` | Xiaomi music app | Keep it if you use local music playback |
| `com.mitv.gallery`, `com.android.gallery3d` | Gallery apps | Keep them if you view local photos or USB media |
| `com.xiaomi.mitv.handbook` | TV handbook | Optional if you do not use the manual |
| `com.xiaomi.mitv.smartshare` | Xiaomi sharing feature | Disabling it may affect casting or sharing |
| `com.xiaomi.wfdsinkhelperservice` | Wireless display helper | Disabling it may affect screen mirroring |
| `com.google.android.marvin.talkback` | Screen reader / accessibility | **Do not disable if anyone relies on TalkBack** |
| `com.android.camera2` | Camera app | May be relevant to USB camera features |
| `com.android.printspooler` | Printing service | Usually irrelevant on a TV, but check your use |
| `com.google.android.syncadapters.calendar` | Calendar sync adapter | Keep it if your TV uses calendar sync |
| `com.android.smspush` | Android SMS/WAP push component | Usually not needed for TV use, but do not assume across devices |

These descriptions are practical interpretations of package names and the behaviour I observed, not official package documentation. I am not labelling every package as adware. Some are ordinary optional apps or diagnostics components.

### Why I do not recommend copying a large disable list

I also found packages such as `com.xm.webcontent`, `com.xiaomo.tv.milegal`, `com.google.android.tvrecommendations`, `com.google.android.backdrop`, `com.mitv.dream`, and `com.xiaomi.floatingframe` on my TV. They may be related to web content, legal notices, recommendations, screensavers, or Xiaomi interface features. Their exact role can vary by firmware.

Before disabling one, search for that exact package on your TV, check whether you use the feature, and disable only one package at a time. Do not use a generic batch command from a random post. A command that returns `Unknown package` simply means that package is not installed under that name on your TV; it does not mean you should try a similar-looking package instead.

## 6. Disable an optional app — and know how to undo it

Android's package manager can disable a package for the current user without uninstalling its APK from the system partition.

For example, after confirming that the package exists and that you do not need its feature, the command format is:

```bat
adb shell pm disable-user --user 0 PACKAGE.NAME.HERE
```

Replace `PACKAGE.NAME.HERE` with one exact package name. Do not paste the placeholder literally.

For example, on my TV I disabled the analytics package:

```bat
adb shell pm disable-user --user 0 com.miui.tv.analytics
```

The output was:

```text
Package com.miui.tv.analytics new state: disabled-user
```

To undo that change:

```bat
adb shell pm enable com.miui.tv.analytics
```

Check the current disabled list at any time:

```bat
adb shell pm list packages -d
```

**My rule: disable one package, check the TV, then decide whether to continue.** Do not run a long batch of disable commands before testing. If a feature breaks, you want to know which change caused it.

### Keep a change log

I recommend keeping a plain text file with one entry for each change:

```text
Disabled: com.miui.tv.analytics
Reason: Not using the TV analytics feature
Undo: adb shell pm enable com.miui.tv.analytics
Tested: Home screen, streaming apps, HDMI, remote
```

If you later forget what you changed, the log is much more useful than trying to remember a long command history.

## 7. Install TV Detox as a lightweight home screen

I wanted a home screen with only the apps I use, plus access to HDMI inputs and a clock. I used [TV Detox](https://github.com/Ansub/tv-detox), an open-source launcher that can be installed without rooting the TV.

The project README explains that its installer can turn off a TV's existing launcher if that launcher keeps taking over the Home button. It does not uninstall the original launcher, and the project provides an undo script. Read the current README and `install.sh` before running them, because the script and supported options can change.

### Download the project

1. Open the [TV Detox GitHub repository](https://github.com/Ansub/tv-detox).
2. Download the repository as a ZIP and extract it.
3. Confirm that the extracted folder contains `install.sh` and `undo.sh`.
4. Install [Git for Windows](https://git-scm.com/download/win) if you do not already have Git Bash.
5. Make sure `adb` works in Git Bash. If `adb version` is not recognised there, add the extracted `platform-tools` directory to your PATH or open Git Bash from a setup where ADB is available.

The repository's instructions use a shell script, so **use Git Bash for the `sh install.sh` command**, not ordinary Command Prompt.

### Run the installer with your chosen apps

For my TV, the app list was YouTube, Netflix, FanCode, Prime Video, and Hotstar. The command format is:

```bash
sh install.sh YOUR_OWN_IP "com.google.android.youtube.tv,com.netflix.ninja,com.fancode.tv,com.amazon.amazonvideo.livingroom,in.startv.hotstar"
```

Use your own TV IP and verified package names. If you want the installer to choose apps automatically, follow the repository's current instructions instead of supplying the list.

Read each prompt from the installer. If it asks to disable the existing launcher, stop and make sure you understand the change before confirming it. Do not approve changes to setup apps or system components without checking why they are needed.

On my Mi TV, TV Detox installed as `com.ansub.tvhome`. The first attempt to set it as the default did not stick because Google's launcher still won when I pressed Home. The Home activity query showed:

```text
com.google.android.tvlauncher/.MainActivity
com.ansub.tvhome/.MainActivity
com.android.tv.settings/.system.FallbackHome
```

The TV Detox launcher was installed, but Google's launcher still had priority. I confirmed the package list and launcher details, then disabled Google's launcher:

```bat
adb shell pm disable-user --user 0 com.google.android.tvlauncher
```

After that, the Home button opened TV Detox and displayed the five apps I had selected.

**This step is device-specific.** Do not disable `com.google.android.tvlauncher` just because it appears on your TV. Confirm that TV Detox is installed and can open first, read the installer's prompt, and know how to re-enable the original launcher. Other devices may use different launcher packages or setup flows.

To restore Google's launcher on my TV:

```bat
adb shell pm enable com.google.android.tvlauncher
```

To remove TV Detox and restore the TV's original home screen, use the project's documented undo script from its directory:

```bash
sh undo.sh YOUR_OWN_IP
```

Check the current README before running undo commands, especially if you made additional package changes outside TV Detox.


## 8. Turn off interface animations

I set the three Android animation scales to zero. This removes transition animations; it does not upgrade the TV's processor or increase its physical RAM.

Run these commands in Command Prompt:

```bat
adb shell settings put global window_animation_scale 0
adb shell settings put global transition_animation_scale 0
adb shell settings put global animator_duration_scale 0
```

To restore the usual animation scale:

```bat
adb shell settings put global window_animation_scale 1
adb shell settings put global transition_animation_scale 1
adb shell settings put global animator_duration_scale 1
```

Some TV firmware may ignore or override individual settings. Check the interface after changing them.

## 9. Change the screensaver and sleep timeout carefully

On my TV, I used these commands:

```bat
adb shell settings put secure screensaver_enabled 0
adb shell settings put system screen_off_timeout 300000
```

`300000` milliseconds is five minutes.

These settings are not guaranteed to control every TV's screensaver or power behaviour. Some manufacturers use their own settings or ignore the generic Android keys. Verify the behaviour on your TV instead of assuming the command succeeded just because it printed no error.

To restore the values used in my earlier setup:

```bat
adb shell settings put secure screensaver_enabled 1
adb shell settings put system screen_off_timeout 1800000
```

This restores a 30-minute screen timeout and enables the generic screensaver flag. Your TV's original settings may have been different, so record the original values first if you want an exact rollback. You can read the current values with:

```bat
adb shell settings get secure screensaver_enabled
adb shell settings get system screen_off_timeout
adb shell settings get global window_animation_scale
adb shell settings get global transition_animation_scale
adb shell settings get global animator_duration_scale
```

For the sleep behaviour, the TV's own Settings menu is the better choice if it exposes a clear screen timeout or sleep timer option.

## 10. Disable PatchWall only if you want it gone

On my Mi TV, the PatchWall package was:

```text
com.mitv.tvhome.atv
```

If that exact package exists on your TV and you no longer use PatchWall, you can disable it:

```bat
adb shell pm disable-user --user 0 com.mitv.tvhome.atv
```

To restore it:

```bat
adb shell pm enable com.mitv.tvhome.atv
```

Disabling PatchWall may change what its dedicated remote button does. The button might do nothing, open another home screen, or behave differently depending on the remote and firmware. Test the button before and after the change.

Do not disable a package just because it has `home` in its name. On another model, a similar package may provide the only usable launcher or a required interface.

## 11. Make HDMI 3 the startup input

This part depends on Xiaomi's firmware and the available TV settings. It is separate from choosing TV Detox as the Home launcher.

First, check the TV interface:

1. Open **Settings**.
2. Look under **Inputs**, **Device Preferences**, **Power**, or **Startup**.
3. Look for a setting such as **Default input on boot**, **Startup input**, or **Stay on last used input**.
4. If HDMI 3 is offered, select it.
5. Restart the TV and check whether it opens HDMI 3.

Not every Xiaomi TV exposes a setting for a fixed startup input. Some models restore the last used input, while others open their home screen or Live TV. TV Detox cannot guarantee a fixed HDMI 3 startup if the firmware controls that behaviour.

I tested an ADB intent for the DroidLogic input service during my setup, but the exact HDMI identifiers can differ by hardware. I do **not** recommend copying an unverified `HW7`/`HW8` content URI from another device. First identify how your TV exposes its HDMI inputs, and use the built-in startup input setting whenever possible.

## 12. Reboot and check the result

After the last change, wait at least 30 seconds so background tasks and launcher changes can settle.

Then restart the TV:

```bat
adb reboot
```

Wait for the TV to finish starting. Reconnect if needed:

```bat
adb connect YOUR_OWN_IP:5555
adb devices
```

Check that the TV appears with status `device`, then measure memory again:

```bat
adb shell cat /proc/meminfo | findstr /i "MemTotal MemFree MemAvailable"
```

On my TV, the recorded readings were:

| Metric | Before cleanup | After cleanup |
|---|---:|---:|
| Total memory (`MemTotal`) | 1,014,724 kB | 1,014,724 kB |
| Free memory (`MemFree`) | 50,720 kB | 77,436 kB |
| Available memory (`MemAvailable`) | 287,732 kB | 416,592 kB |

The later reading showed about **128.9 MB more available memory**. That is an observation from my TV, not proof that every disabled package contributed to the difference. Android memory changes with uptime, cached apps, and workload, and the before-and-after readings were not taken under a controlled benchmark.

### Test the things that matter

Before calling the cleanup finished, check:

- The TV starts without a setup screen or restart loop.
- The Home button opens TV Detox.
- YouTube, Netflix, FanCode, Prime Video, and Hotstar launch.
- HDMI 1/2/3 inputs open correctly, including the input you use most.
- The remote, Bluetooth devices, Wi-Fi, volume, and picture settings still work.
- Casting or screen mirroring works if you use it.
- Sleep and screensaver behaviour matches your preference.
- The PatchWall button behaves as expected.
- The TV can restart and return to a usable screen.

If something fails, undo the last relevant change first. Avoid disabling more packages until the issue is understood.


## 13. Revoke ADB access when you are finished

ADB debugging gives a trusted computer considerable control over the TV. If you do not need to keep using it, turn it off when you finish.

On the TV:

1. Open **Settings → Developer options**.
2. Turn off **USB debugging**, **ADB debugging**, or **Network debugging**, depending on the label.
3. If the TV offers **Revoke USB debugging authorisations**, select it to remove previously trusted computers.
4. If you enabled a separate Wireless debugging option, turn that off too.

On Windows, you can also disconnect the current ADB session:

```bat
adb disconnect YOUR_OWN_IP:5555
adb kill-server
```

Disconnecting the computer is not the same as revoking its authorisation. For the stronger cleanup, disable debugging on the TV and use the revoke-authorisations option if it is available.

If you still have more changes to make, keep ADB enabled until those steps are complete, then revoke it. If you want to revoke access immediately after a particular step, do it after that step's verification and before continuing with any later ADB commands; you will need to authorise the computer again to continue.

## Troubleshooting

### `adb` is not recognised

**Cause:** Command Prompt cannot find `adb.exe`.

**Fix:**
1. Open the extracted `platform-tools` directory.
2. Click the address bar, type `cmd`, and press Enter.
3. Run `adb version` again.

If you use Git Bash for TV Detox, make sure ADB is available in Git Bash as well.

### `failed to authenticate` or device status is `unauthorized`

**Cause:** The TV has not accepted the computer's debugging key, or the ADB session has stale authentication state.

**Fix:**
1. Look at the TV for an authorisation dialog and approve it only if you trust the computer.
2. If no prompt appears, open Developer options and check debugging is still enabled.
3. In Command Prompt, run:

```bat
adb disconnect
adb kill-server
adb start-server
adb connect YOUR_OWN_IP:5555
adb devices
```

4. Check the TV again for the approval prompt.

In my session, the first connection attempt failed authentication. After disconnecting and restarting the ADB server, the device later appeared as `device`. If the problem persists, revoke old authorisations on the TV, reconnect, and approve the new prompt.

### `adb connect` times out

**Cause:** The computer cannot reach the TV at that address and port. The devices may be on different networks, network debugging may be off, or the TV may use a different wireless debugging port.

**Fix:**
- Confirm the IP address in the TV's network settings.
- Confirm both devices are on the same local network.
- Check that the TV has ADB/network debugging enabled.
- For Wireless debugging, use the exact IP and port shown on the TV rather than assuming port 5555.
- Avoid guest Wi-Fi or network isolation settings that block devices from communicating with each other.

### `Unknown package`

**Cause:** The package name is not installed on that TV under the name you supplied.

**Fix:** Run:

```bat
adb shell pm list packages
```

Search the output for the exact package name and do not retry with a guessed variant. Xiaomi firmware varies, so a package from another model may not exist on yours.

### TV Detox installs, but the old launcher still opens

First check which activities can handle the Home button:

```bat
adb shell cmd package query-activities --brief -a android.intent.action.MAIN -c android.intent.category.HOME
```

Check the currently resolved Home activity:

```bat
adb shell cmd package resolve-activity --brief -a android.intent.action.MAIN -c android.intent.category.HOME
```

On my TV, Google's launcher continued to win even after `set-home-activity` returned `Success`. The Home query showed Google TV's launcher before TV Detox. Disabling the old launcher fixed the behaviour on my model, but do not repeat that step until you have confirmed that the replacement launcher works and you know the re-enable command.

Some older Android versions do not support the `cmd role` service. An error such as `cmd: Can't find service: role` does not necessarily mean TV Detox failed to install.

### Home opens a setup screen or the TV becomes hard to navigate

Do not disable more packages. Re-enable the last launcher or setup package you changed.

For the Xiaomi Mi TV described here, Google's launcher can be restored with:

```bat
adb shell pm enable com.google.android.tvlauncher
```

For other devices, the package may be different. The TV Detox README documents its own undo command:

```bash
sh undo.sh YOUR_OWN_IP
```

Use the IP address of your own TV. If ADB still works, list disabled packages with:

```bat
adb shell pm list packages -d
```

Re-enable the package you most recently disabled:

```bat
adb shell pm enable PACKAGE.NAME.HERE
```

If the TV is stuck in a restart loop, try connecting while it is starting and re-enable the packages you disabled. If the computer can never connect, use the manufacturer's recovery instructions for the exact model; a factory reset may be necessary as a last resort.

### HDMI input or remote button stops working

A package you disabled may have handled the input picker, tuner, remote shortcut, casting, or manufacturer interface.

Re-enable the most recent related package and test again. Do not disable packages such as `com.droidlogic.tvinput`, `com.droidlogic.droidlivetv`, `mitv.service`, `com.android.bluetooth`, or `com.xiaomi.mitv.tvmanager` as part of a general cleanup.

### A setting command prints no error, but nothing changes

Some manufacturers ignore generic Android settings or use their own controls. Read the value back:

```bat
adb shell settings get secure screensaver_enabled
adb shell settings get system screen_off_timeout
```

Then check the actual TV behaviour. A successful command is not proof that every part of the user interface obeys the setting.

### Memory does not improve

That does not automatically mean the cleanup failed. Android uses available RAM for caching, and a reboot changes the memory picture. Check the launcher, app startup, navigation, and streaming performance as well as memory. Avoid disabling core services just to chase a larger `MemFree` number.

## My change log and rollback reference

These are the changes I recorded during my own Mi TV setup. They are not a recommendation to apply the entire list to every TV.

| Change | Undo |
|---|---|
| Disable Google TV launcher (`com.google.android.tvlauncher`) | `adb shell pm enable com.google.android.tvlauncher` |
| Disable PatchWall (`com.mitv.tvhome.atv`) | `adb shell pm enable com.mitv.tvhome.atv` |
| Disable an optional package | `adb shell pm enable PACKAGE.NAME.HERE` |
| Restore window animation scale | `adb shell settings put global window_animation_scale 1` |
| Restore transition animation scale | `adb shell settings put global transition_animation_scale 1` |
| Restore animator duration scale | `adb shell settings put global animator_duration_scale 1` |
| Re-enable generic screensaver flag | `adb shell settings put secure screensaver_enabled 1` |
| Restore 30-minute screen timeout | `adb shell settings put system screen_off_timeout 1800000` |
| Undo TV Detox launcher setup | `sh undo.sh YOUR_OWN_IP` from the TV Detox project directory |

Keep a copy of the exact commands you ran and the output returned by ADB. If you have disabled several packages, re-enable them from your own change log rather than relying only on this summary.

## Final thoughts

The biggest difference for me was not one magic command. It was getting a simpler home screen, turning off features I did not use, and being more deliberate about what was allowed to run on the TV.

The useful part of ADB is that it gives you visibility and control. The risky part is that it also lets you disable things whose purpose is not obvious from the package name. That is why I would rather make a small change, test it, and keep the undo command than run a long debloat script and hope for the best.

If you try this, start with the package list and memory baseline. Keep system services enabled, make a change log, and do the final reboot only after you have verified that the launcher and inputs still work.

### References

- [TV Detox on GitHub](https://github.com/Ansub/tv-detox)
- [TV Detox README and troubleshooting guide](https://github.com/Ansub/tv-detox/blob/main/README.md)
- [TV Detox releases](https://github.com/Ansub/tv-detox/releases)
- [Google SDK Platform-Tools for Windows](https://dl.google.com/android/repository/platform-tools-latest-windows.zip)
- [Android Debug Bridge documentation](https://developer.android.com/tools/adb)

*This is a record of a real setup on one Xiaomi Android TV, with general guidance added for readers. Package names, menus, and supported commands vary by device. Make changes at your own risk and verify each one on your own TV.*
