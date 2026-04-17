export type AssessmentData = {
  fullName: string;
  workEmail: string;
  screenReader: "nvda" | "jaws" | "voiceover" | "orca" | "other";
  operatingSystem: "windows" | "macos" | "linux";
  experienceLevel: "beginner" | "intermediate" | "advanced";
  codingFocus: string;
  audioCues: boolean;
  highVerbosity: boolean;
  customNeeds: string;
};

type GeneratedConfig = {
  vscodeSettings: Record<string, unknown>;
  keybindings: Array<Record<string, string>>;
  recommendedExtensions: string[];
  terminalProfile: string;
  installScript: string;
  readme: string;
};

const commonExtensions = [
  "ms-vscode.powershell",
  "streetsidesoftware.code-spell-checker",
  "ms-vscode.live-server",
  "eamodio.gitlens"
];

const screenReaderExtensions: Record<string, string[]> = {
  nvda: ["ms-vscode.vscode-speech", "usernamehw.errorlens"],
  jaws: ["ms-vscode.vscode-speech", "gruntfuggly.todo-tree"],
  voiceover: ["ms-python.python", "ms-toolsai.jupyter"],
  orca: ["redhat.vscode-yaml", "esbenp.prettier-vscode"],
  other: ["ms-vscode.vscode-speech"]
};

export function createConfigBundle(input: AssessmentData): GeneratedConfig {
  const audioVolume = input.highVerbosity ? 90 : 70;

  const vscodeSettings: Record<string, unknown> = {
    "editor.accessibilitySupport": "on",
    "editor.tabSize": 2,
    "editor.minimap.enabled": false,
    "editor.wordWrap": "bounded",
    "editor.wordWrapColumn": 100,
    "terminal.integrated.enableVisualBell": false,
    "terminal.integrated.bellStyle": "audible",
    "workbench.list.smoothScrolling": false,
    "audioCues.enabled": input.audioCues ? "on" : "auto",
    "audioCues.volume": audioVolume,
    "accessibility.voice.speechTimeout": input.highVerbosity ? 2500 : 1200,
    "breadcrumbs.enabled": false,
    "debug.console.wordWrap": true,
    "editor.quickSuggestions": {
      comments: false,
      strings: true,
      other: true
    }
  };

  const keybindings = [
    {
      key: "ctrl+alt+r",
      command: "workbench.action.chat.startVoiceChat",
      when: "editorTextFocus"
    },
    {
      key: "ctrl+alt+d",
      command: "editor.action.marker.next",
      when: "editorTextFocus"
    },
    {
      key: "ctrl+alt+b",
      command: "workbench.action.navigateBack",
      when: "editorTextFocus"
    },
    {
      key: "ctrl+alt+f",
      command: "workbench.action.navigateForward",
      when: "editorTextFocus"
    }
  ];

  const terminalProfile = createTerminalProfile(input);

  const recommendedExtensions = [
    ...new Set([...commonExtensions, ...screenReaderExtensions[input.screenReader]])
  ];

  const installScript = createInstallScript(input, recommendedExtensions);
  const readme = createReadme(input, recommendedExtensions);

  return {
    vscodeSettings,
    keybindings,
    recommendedExtensions,
    terminalProfile,
    installScript,
    readme
  };
}

function createTerminalProfile(input: AssessmentData) {
  if (input.operatingSystem === "windows") {
    return [
      "# PowerShell profile for accessible coding workflow",
      "$Host.UI.RawUI.WindowTitle = 'Blind Dev Assistant Shell'",
      "Set-PSReadLineOption -BellStyle Audible",
      "Set-PSReadLineOption -PredictionViewStyle ListView",
      "Set-PSReadLineOption -EditMode Windows",
      "function Say-Status { param([string]$Text) Add-Type -AssemblyName System.Speech;",
      "  $speak = New-Object System.Speech.Synthesis.SpeechSynthesizer; $speak.Speak($Text) }"
    ].join("\n");
  }

  if (input.operatingSystem === "macos") {
    return [
      "# zsh profile tuned for VoiceOver-friendly CLI output",
      "export TERM=xterm-256color",
      "setopt NO_BEEP",
      "autoload -Uz compinit && compinit",
      "alias ll='ls -lah'",
      "say_status() { say \"$1\"; }"
    ].join("\n");
  }

  return [
    "# bash profile tuned for Orca-friendly feedback",
    "export TERM=xterm-256color",
    "set bell-style audible",
    "alias ll='ls -lah --group-directories-first'",
    "say_status() { spd-say \"$1\"; }"
  ].join("\n");
}

function createInstallScript(input: AssessmentData, extensions: string[]) {
  const extensionCommands = extensions.map((ext) => `code --install-extension ${ext}`).join("\n");

  return [
    "#!/usr/bin/env bash",
    "set -euo pipefail",
    "echo 'Blind Dev Assistant installer started.'",
    "mkdir -p ~/.config/Code/User",
    "cp ./settings.json ~/.config/Code/User/settings.json",
    "cp ./keybindings.json ~/.config/Code/User/keybindings.json",
    "echo 'Installing recommended VS Code extensions...'",
    extensionCommands,
    `echo 'Setup complete for ${input.fullName}. Focus: ${input.codingFocus}.'`,
    "echo 'Open VS Code and run the command: Accessibility: Signal Sound.'"
  ].join("\n");
}

function createReadme(input: AssessmentData, extensions: string[]) {
  return [
    "# Blind Dev Assistant Configuration Package",
    "",
    `Prepared for: ${input.fullName} (${input.workEmail})`,
    `Primary screen reader: ${input.screenReader.toUpperCase()}`,
    `Primary OS: ${input.operatingSystem}`,
    `Experience level: ${input.experienceLevel}`,
    "",
    "## What is included",
    "- VS Code settings tuned for keyboard-first navigation",
    "- Custom keybindings for fast diagnostics and back/forward context movement",
    "- Terminal profile with audible confirmation helpers",
    "- Install script for extension and config rollout",
    "",
    "## Recommended extensions",
    ...extensions.map((ext) => `- ${ext}`),
    "",
    "## Install steps",
    "1. Unzip the package.",
    "2. Run `chmod +x install.sh && ./install.sh`.",
    "3. Restart VS Code.",
    "4. Open a project and verify `Ctrl+Alt+D` jumps to the next error.",
    "",
    "## Personalized notes",
    input.customNeeds ||
      "No extra constraints were provided. Use dashboard regeneration if your workflow changes."
  ].join("\n");
}
