---
"@lockin90/ui-native": patch
---

Absolute fills spread a plain internal style object: React Native 0.88 removed `absoluteFillObject`, so AuroraBackground, Modal, Sheet, Popover, Menu, Tooltip, TabBar, Toggle and 10 more lost their positioning there.
