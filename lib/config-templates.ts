import yaml from "js-yaml";

import type { AccessibilityAssessment, GeneratedConfigFile, GenerationResult } from "@/types/accessibility";
import { buildAccessibilityNotes, getScreenReaderExtension, recommendedSpeechRate } from "@/lib/screen-reader-utils";

function buildSettingsJson(assessment: AccessibilityAssessment) {
  const highContrastTerminalTheme = {
    "terminal.ansiBlack": "#0b1014",
    "terminal.ansiBlue": "#4fa8ff",
    "terminal.ansiBrightBlack": "#6e7681",
    "terminal.ansiBrightBlue": "#79c0ff",
    "terminal.ansiBrightCyan": "#39d0d8",
    "terminal.ansiBrightGreen": "#7ee787",
    "terminal.ansiBrightMagenta": "#d2a8ff",
    "terminal.ansiBrightRed": "#ffa198",
    "terminal.ansiBrightWhite": "#f0f6fc",
    "terminal.ansiBrightYellow": "#f2cc60",
    "terminal.ansiCyan": "#39c5cf",
    "terminal.ansiGreen": "#56d364",
    "terminal.ansiMagenta": "#bc8cff",
    "terminal.ansiRed": "#ff7b72",
    "terminal.ansiWhite": "#c9d1d9",
    "terminal.ansiYellow": "#d29922"
  };

  return {
    "workbench.colorTheme": "Default Dark Modern",
    "workbench.preferredDarkColorTheme": "Default Dark Modern",
    "editor.cursorBlinking": "phase",
    "editor.minimap.enabled": false,
    "editor.stickyScroll.enabled": false,
    "editor.accessibilitySupport": "on",
    "editor.accessibilityPageSize": 18,
    "editor.lineNumbers": "relative",
    "editor.fontSize": 16,
    "editor.renderWhitespace": "boundary",
    "terminal.integrated.cursorStyle": "line",
    "terminal.integrated.cursorWidth": assessment.needsHighContrastTerminal ? 3 : 2,
    "terminal.integrated.fontSize": 18,
    "terminal.integrated.gpuAcceleration": "off",
    "audioCues.enabled": assessment.enableAudioDebugCues ? "on" : "auto",
    "audioCues.lineHasError": "on",
    "audioCues.taskCompleted": assessment.enableAudioDebugCues ? "on" : "auto",
    "audioCues.taskFailed": "on",
    "accessibility.voice.speechRate": recommendedSpeechRate(assessment.screenReader),
    "debug.console.wordWrap": true,
    "files.autoSave": "onFocusChange",
    ...(assessment.reduceAuditoryNoise
      ? {
          "workbench.startupEditor": "none",
          "workbench.editor.enablePreview": false,
          "accessibility.signals.terminalCommandFailed": {
            sound: "off",
            announcement: "auto"
          }
        }
      : {}),
    ...(assessment.needsHighContrastTerminal ? highContrastTerminalTheme : {})
  };
}

function buildKeybindingsJson(assessment: AccessibilityAssessment) {
  const keybindings = [
    {
      key: "alt+f2",
      command: "editor.action.marker.next",
      when: "editorTextFocus"
    },
    {
      key: "alt+shift+f2",
      command: "editor.action.marker.prev",
      when: "editorTextFocus"
    },
    {
      key: "ctrl+alt+r",
      command: "workbench.action.terminal.focus"
    },
    {
      key: "ctrl+alt+d",
      command: "workbench.debug.action.toggleRepl"
    },
    {
      key: "ctrl+alt+g",
      command: "workbench.action.gotoSymbol"
    },
    {
      key: "ctrl+alt+e",
      command: "editor.action.nextMatchFindAction",
      when: "editorFocus"
    }
  ];

  if (assessment.prefersVimBindings) {
    keybindings.push({
      key: "ctrl+alt+v",
      command: "extension.vim_escape"
    });
  }

  return keybindings;
}

function buildExtensionsYaml(assessment: AccessibilityAssessment) {
  const extensions = getScreenReaderExtension(assessment);
  const extensionManifest = {
    version: 1,
    profile: `${assessment.screenReader}-${assessment.operatingSystem}`,
    extensions
  };

  return yaml.dump(extensionManifest, { noRefs: true, lineWidth: 120 });
}

function buildSetupScript(assessment: AccessibilityAssessment) {
  const extensionLines = getScreenReaderExtension(assessment)
    .map((extension) => `code --install-extension ${extension}`)
    .join("\n");

  const copyCmd =
    assessment.operatingSystem === "windows"
      ? "Copy-Item .\\.vscode\\* $env:APPDATA\\Code\\User\\ -Force"
      : "cp -R ./.vscode/* \"$HOME/.config/Code/User/\"";

  if (assessment.operatingSystem === "windows") {
    return [
      "$ErrorActionPreference = 'Stop'",
      "Write-Host 'Installing accessible VS Code extension profile...'",
      extensionLines,
      "Write-Host 'Applying screen reader focused user settings...'",
      copyCmd,
      "Write-Host 'Done. Restart VS Code and confirm your screen reader announces line and symbol navigation correctly.'"
    ].join("\n");
  }

  return [
    "#!/usr/bin/env bash",
    "set -euo pipefail",
    "echo 'Installing accessible VS Code extension profile...'",
    extensionLines,
    "echo 'Applying screen reader focused user settings...'",
    copyCmd,
    "echo 'Done. Restart VS Code and validate keyboard-only navigation with your screen reader.'"
  ].join("\n");
}

function buildReadme(assessment: AccessibilityAssessment) {
  const notes = buildAccessibilityNotes(assessment);

  return [
    "# Blind Dev Assistant Config Bundle",
    "",
    `Generated for ${assessment.fullName}`,
    "",
    "## Installation",
    "",
    "1. Open this folder in a terminal.",
    `2. Run ${assessment.operatingSystem === "windows" ? "`./setup.ps1`" : "`./setup.sh`"}.`,
    "3. Restart VS Code.",
    "4. Open Command Palette and run `Preferences: Open Keyboard Shortcuts (JSON)` to confirm keybindings loaded.",
    "",
    "## Accessibility Priorities Included",
    "",
    ...notes.map((note) => `- ${note}`),
    "",
    "## Your Main Workflow Improvement",
    "",
    assessment.biggestPainPoint,
    "",
    "## Support",
    "",
    "If one command conflicts with your enterprise policy, remove it from setup script and keep the rest."
  ].join("\n");
}

export function generateConfigBundle(assessment: AccessibilityAssessment): GenerationResult {
  const settings = JSON.stringify(buildSettingsJson(assessment), null, 2);
  const keybindings = JSON.stringify(buildKeybindingsJson(assessment), null, 2);
  const extensionsYaml = buildExtensionsYaml(assessment);
  const setupScript = buildSetupScript(assessment);
  const readme = buildReadme(assessment);

  const files: GeneratedConfigFile[] = [
    { path: ".vscode/settings.json", content: settings },
    { path: ".vscode/keybindings.json", content: keybindings },
    { path: "extensions.yml", content: extensionsYaml },
    {
      path: assessment.operatingSystem === "windows" ? "setup.ps1" : "setup.sh",
      content: setupScript
    },
    { path: "README.md", content: readme }
  ];

  const setupChecklist = [
    "Confirm your screen reader is running before starting VS Code.",
    "Install command line `code` tool from VS Code command palette if missing.",
    "Run the setup script with administrative permissions if your org restricts extension installs.",
    "Restart VS Code and test symbol navigation with the included keybindings.",
    "Open Terminal and run a sample build to hear configured debug audio cues."
  ];

  return {
    filename: `blind-dev-assistant-${assessment.operatingSystem}-${assessment.screenReader}.zip`,
    files,
    setupChecklist,
    preview: {
      extensions: getScreenReaderExtension(assessment),
      keybindings: buildKeybindingsJson(assessment).map((item) => `${item.key} -> ${item.command}`),
      notes: buildAccessibilityNotes(assessment)
    }
  };
}
