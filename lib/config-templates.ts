import type { AssessmentInput } from "@/lib/assessment-schema";

export type ConfigArtifact = {
  path: string;
  content: string;
};

const extensionMap: Record<AssessmentInput["developmentFocus"][number], string[]> = {
  "Frontend web apps": [
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dbaeumer.vscode-eslint"
  ],
  "Backend services": [
    "humao.rest-client",
    "ms-azuretools.vscode-docker",
    "timonwong.shellcheck"
  ],
  "Data engineering": [
    "mechatroner.rainbow-csv",
    "ms-toolsai.jupyter",
    "ms-python.python"
  ],
  "DevOps and infrastructure": [
    "redhat.vscode-yaml",
    "ms-kubernetes-tools.vscode-kubernetes-tools",
    "hashicorp.terraform"
  ],
  "Mobile apps": [
    "dart-code.flutter",
    "msjsdiag.vscode-react-native",
    "esbenp.prettier-vscode"
  ],
  "Open source maintenance": [
    "eamodio.gitlens",
    "streetsidesoftware.code-spell-checker",
    "usernamehw.errorlens"
  ]
};

function getTheme(highContrast: boolean): string {
  return highContrast ? "Default High Contrast" : "Default Dark+";
}

function getShellExecutable(
  operatingSystem: AssessmentInput["operatingSystem"],
  terminalShell: AssessmentInput["terminalShell"]
): string {
  if (operatingSystem === "windows") {
    if (terminalShell === "powershell") {
      return "C:/Program Files/PowerShell/7/pwsh.exe";
    }
    return "C:/Windows/System32/WindowsPowerShell/v1.0/powershell.exe";
  }

  if (terminalShell === "zsh") {
    return "/bin/zsh";
  }

  if (terminalShell === "fish") {
    return "/usr/bin/fish";
  }

  return "/bin/bash";
}

function getAccessibleSettings(input: AssessmentInput): Record<string, unknown> {
  return {
    "editor.accessibilitySupport": "on",
    "accessibility.voice.speechTimeout": 1200,
    "editor.tabSize": 2,
    "editor.wordWrap": "on",
    "editor.minimap.enabled": false,
    "editor.renderWhitespace": "boundary",
    "editor.stickyScroll.enabled": false,
    "editor.formatOnSave": true,
    "editor.fontSize": input.fontSize,
    "editor.cursorBlinking": "phase",
    "workbench.colorTheme": getTheme(input.highContrast),
    "window.titleBarStyle": "custom",
    "workbench.startupEditor": "none",
    "workbench.tips.enabled": false,
    "breadcrumbs.enabled": false,
    "problems.showCurrentInStatus": true,
    "terminal.integrated.defaultProfile.windows":
      input.operatingSystem === "windows" ? "Accessible Profile" : undefined,
    "terminal.integrated.defaultProfile.linux":
      input.operatingSystem === "linux" ? "Accessible Profile" : undefined,
    "terminal.integrated.defaultProfile.osx":
      input.operatingSystem === "macos" ? "Accessible Profile" : undefined,
    "terminal.integrated.profiles.windows":
      input.operatingSystem === "windows"
        ? {
            "Accessible Profile": {
              path: getShellExecutable(input.operatingSystem, input.terminalShell)
            }
          }
        : undefined,
    "terminal.integrated.profiles.linux":
      input.operatingSystem === "linux"
        ? {
            "Accessible Profile": {
              path: getShellExecutable(input.operatingSystem, input.terminalShell)
            }
          }
        : undefined,
    "terminal.integrated.profiles.osx":
      input.operatingSystem === "macos"
        ? {
            "Accessible Profile": {
              path: getShellExecutable(input.operatingSystem, input.terminalShell)
            }
          }
        : undefined,
    "terminal.integrated.minimumContrastRatio": input.highContrast ? 7 : 4.5,
    "terminal.integrated.enableVisualBell": false,
    "terminal.integrated.scrollback": 20000,
    "debug.console.wordWrap": true,
    "debug.onTaskErrors": "showErrors",
    "audioCues.enabled": input.prefersAudioCues ? "on" : "off",
    "audioCues.taskCompleted": input.prefersAudioCues ? "on" : "off",
    "audioCues.taskFailed": "on",
    "audioCues.lineHasError": input.debugFeedback !== "speech" ? "on" : "off",
    "workbench.reduceMotion": input.reducedMotion ? "on" : "off",
    "vim.useSystemClipboard": input.wantsVimBindings,
    "vim.hlsearch": input.wantsVimBindings,
    "accessibility.verbosity.terminal": true,
    "accessibility.verbosity.diffEditor": true,
    "accessibility.verbosity.panelChat": false
  };
}

function sanitizeSettings(settings: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(settings).filter(([, value]) => value !== undefined)
  );
}

function getExtensions(input: AssessmentInput): string[] {
  const base = [
    "ms-vscode.vscode-typescript-next",
    "eamodio.gitlens",
    "streetsidesoftware.code-spell-checker"
  ];

  const byFocus = input.developmentFocus.flatMap((area) => extensionMap[area]);

  const screenReaderSpecific =
    input.screenReader === "nvda" || input.screenReader === "jaws"
      ? ["ms-vscode.powershell"]
      : ["timonwong.shellcheck"];

  return Array.from(new Set([...base, ...byFocus, ...screenReaderSpecific])).sort();
}

function getKeybindings(input: AssessmentInput): Array<Record<string, unknown>> {
  const bindings: Array<Record<string, unknown>> = [
    {
      key: "alt+shift+a",
      command: "editor.action.accessibleView",
      when: "editorTextFocus"
    },
    {
      key: "alt+shift+e",
      command: "workbench.actions.view.problems"
    },
    {
      key: "alt+shift+t",
      command: "workbench.action.terminal.focus"
    },
    {
      key: "alt+shift+n",
      command: "editor.action.marker.next"
    },
    {
      key: "alt+shift+p",
      command: "editor.action.marker.prev"
    },
    {
      key: "alt+shift+d",
      command: "workbench.action.debug.start"
    }
  ];

  if (input.wantsVimBindings) {
    bindings.push(
      {
        key: "ctrl+j",
        command: "workbench.action.focusBelowGroup"
      },
      {
        key: "ctrl+k",
        command: "workbench.action.focusAboveGroup"
      }
    );
  }

  return bindings;
}

function getTerminalBootstrapScript(input: AssessmentInput): string {
  if (input.operatingSystem === "windows") {
    return [
      "# Accessible PowerShell profile",
      "$host.ui.RawUI.WindowTitle = 'Accessible Dev Terminal'",
      "$env:CLICOLOR='1'",
      "$env:TERM='xterm-256color'",
      "$env:PYTHONUTF8='1'",
      "$PSDefaultParameterValues['Out-File:Encoding'] = 'utf8'",
      "Write-Host 'Blind Dev Assistant profile loaded.' -ForegroundColor Cyan"
    ].join("\n");
  }

  return [
    "# Accessible shell profile",
    "export TERM=xterm-256color",
    "export CLICOLOR=1",
    "export PYTHONUTF8=1",
    "export LESS='-R'",
    "echo 'Blind Dev Assistant profile loaded.'"
  ].join("\n");
}

function getSetupGuide(input: AssessmentInput, extensions: string[]): string {
  return [
    "# Blind Dev Assistant Setup Guide",
    "",
    `Prepared for ${input.fullName} (${input.email})`,
    "",
    "## 1) Install VS Code and sync baseline settings",
    "1. Open VS Code and press Ctrl/Cmd+Shift+P.",
    "2. Run \"Preferences: Open User Settings (JSON)\".",
    "3. Replace the existing content with files/vscode/settings.json from this package.",
    "",
    "## 2) Apply keyboard workflow",
    "1. Run \"Preferences: Open Keyboard Shortcuts (JSON)\".",
    "2. Merge files/vscode/keybindings.json into your keybindings.",
    "3. Restart VS Code so assistive announcements refresh correctly.",
    "",
    "## 3) Install recommended extensions",
    "Install these extensions from files/vscode/extensions.txt:",
    ...extensions.map((extension) => `- ${extension}`),
    "",
    "## 4) Configure your terminal",
    input.operatingSystem === "windows"
      ? "Copy files/terminal/Microsoft.PowerShell_profile.ps1 into your PowerShell profile path."
      : "Append files/terminal/shell-profile.sh to ~/.bashrc, ~/.zshrc, or your shell startup file.",
    "",
    "## 5) Enable audio-first debugging",
    `Your preference is ${input.debugFeedback}. Start debugging with Alt+Shift+D and navigate errors with Alt+Shift+N / Alt+Shift+P.`,
    "",
    "## 6) Team workflow improvements",
    input.needsPairProgrammingHints
      ? "Use files/team/pairing-checklist.md before remote pairing sessions."
      : "Share files/team/manager-onboarding.md with your engineering manager for team-wide setup.",
    "",
    "## 7) Verify success",
    "Open a project with a linter error and confirm:",
    "- Screen reader announces line diagnostics",
    "- Terminal output is readable and stable",
    "- Audio cues are understandable during debug runs"
  ].join("\n");
}

function getAudioWalkthrough(input: AssessmentInput): string {
  return [
    "Blind Dev Assistant audio walkthrough",
    "",
    `Hello ${input.fullName}. This guide applies to ${input.operatingSystem} with ${input.screenReader}.`,
    "Step one: open VS Code settings JSON and paste your generated settings file.",
    "Step two: open keyboard shortcuts JSON and paste your keybindings.",
    "Step three: install every extension listed in extensions.txt.",
    "Step four: load the terminal profile and restart your shell.",
    "Step five: run your project tests and use Alt Shift N to move through problems.",
    "Step six: start debugging with Alt Shift D and confirm your preferred feedback mode.",
    "If anything is unclear, return to the dashboard and regenerate your package with updated preferences."
  ].join("\n");
}

function getTeamGuide(input: AssessmentInput): string {
  return [
    "# Manager Onboarding Guide for Accessible Engineering",
    "",
    "1. Standardize this package as part of developer onboarding.",
    "2. Provide every developer with keyboard-first documentation.",
    "3. Keep pair-programming sessions verbal-first and command-palette-driven.",
    "4. Audit CI logs for readable output and actionable error messages.",
    "5. Ensure standups include blockers related to assistive tooling.",
    "",
    `Remote-first mode: ${input.remoteFirst ? "enabled" : "disabled"}.`,
    "When remote-first is enabled, prioritize terminal sessions over shared visual IDE sessions."
  ].join("\n");
}

function getPairingChecklist(): string {
  return [
    "# Pair Programming Checklist",
    "",
    "- Confirm both developers know the active file and line before edits.",
    "- Narrate cursor movement and command palette actions out loud.",
    "- Pause after each command execution to announce the result.",
    "- Use terminal-based test output instead of visual-only tooling panels.",
    "- Summarize changes verbally before committing."
  ].join("\n");
}

export function buildConfigArtifacts(input: AssessmentInput): ConfigArtifact[] {
  const settings = sanitizeSettings(getAccessibleSettings(input));
  const extensions = getExtensions(input);
  const keybindings = getKeybindings(input);

  const extensionRecommendations = {
    recommendations: extensions
  };

  return [
    {
      path: "files/vscode/settings.json",
      content: JSON.stringify(settings, null, 2)
    },
    {
      path: "files/vscode/keybindings.json",
      content: JSON.stringify(keybindings, null, 2)
    },
    {
      path: "files/vscode/extensions.json",
      content: JSON.stringify(extensionRecommendations, null, 2)
    },
    {
      path: "files/vscode/extensions.txt",
      content: extensions.join("\n")
    },
    {
      path:
        input.operatingSystem === "windows"
          ? "files/terminal/Microsoft.PowerShell_profile.ps1"
          : "files/terminal/shell-profile.sh",
      content: getTerminalBootstrapScript(input)
    },
    {
      path: "files/audio/audio-walkthrough.txt",
      content: getAudioWalkthrough(input)
    },
    {
      path: "files/team/manager-onboarding.md",
      content: getTeamGuide(input)
    },
    {
      path: "files/team/pairing-checklist.md",
      content: getPairingChecklist()
    },
    {
      path: "README_SETUP.md",
      content: getSetupGuide(input, extensions)
    }
  ];
}
