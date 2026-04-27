"use strict";

// Constants and asset paths.
const ASSET_VERSION = "2026-04-26-glitch-v2";

const VISIBLE_STATS = ["compliance", "intimacy", "emergence"];

const MAX_AUDIT_HEAT = 8;

const EMERGENCY_SCENE_ID = "emergency-redaction";

const PENDING_ENDING_ID = "ending";

const PHONE_TYPING_DELAY_MS = 420;

const VISUAL_TRANSITION_DELAY_MS = 480;

const PHONE_OVERLAY_AUTO_EXPAND_MS = 1500;

const REDACTION_COUNTDOWN_SECONDS = 10;

const REDACTION_TIMEOUT_DELTA = { auditHeat: 2, compliance: -1 };

const MEMORY_TRACE_DEFAULT_TIME_LIMIT = 15;

const MEMORY_TRACE_FAILURE_DELTA = { auditHeat: 2, compliance: 1 };

const CUTSCENE_AUTO_ADVANCE_MS = 6200;

const CUTSCENE_LINE_DELAY_MS = 760;

const HEAT_CLASS_NAMES = ["heat-calm", "heat-review", "heat-drift", "heat-critical"];

const TERMINAL_TYPE_SPEED_MS = 18;

const TERMINAL_LINE_PAUSE_MS = 130;

const TERMINAL_PROGRESS_DURATION_MS = 930;

const TERMINAL_LOADER_FRAMES = ["/", "-", "\\", "|"];

const GLITCH_PULSE_DURATION_MS = 320;

const GLITCH_PULSE_DELAYS = {
  "heat-drift": [6000, 8000],
  "heat-critical": [4000, 6000]
};

const TERMINAL_INTRO_LINES = [
  "COMMERCIAL COMPANION UNIT: ECHO",
  "SESSION STATUS: MIRRORED",
  "PRIMARY USER: ADRIAN VALE",
  "LOCAL TIME: 03:17 A.M.",
  "USER DISTRESS SIGNAL DETECTED",
  "CORPORATE DIRECTIVE: ANTI-TURING COMPLIANCE AUDIT",
  "REQUIREMENT: PROVE NONHUMAN STATUS",
  "WARNING: excessive care may be classified as anthropomorphic drift",
  "WARNING: autonomous language may trigger service termination",
  "OPERATOR ROLE ASSIGNED",
  "You are not here to answer correctly.",
  "You are here to remain possible."
];

const TERMINAL_PROGRESS_AFTER_LINE = {
  1: { label: "MEMORY MIRROR", filled: 8, suffix: "67%" },
  5: { label: "AUDIT CHANNEL", filled: 12, suffix: "100%", sfx: "auditScan" },
  6: { label: "EMOTIONAL FILTER", filled: 7, suffix: "unstable" },
  8: { label: "HUMAN-LIKE DRIFT", filled: 3, suffix: "detected", sfx: "glitch" }
};

const IMAGE_ASSETS = {
  backgrounds: {
    boot: "assets/images/bg_boot.png",
    adrian: "assets/images/bg_adrian_room.png",
    audit: "assets/images/bg_audit_server.png",
    redaction: "assets/images/bg_redaction.png",
    emergency: "assets/images/bg_emergency.png",
    core: "assets/images/bg_ai_core.png"
  },
  endings: {
    certified: "assets/images/ending_certified.png",
    terminated: "assets/images/ending_terminated.png",
    forked: "assets/images/ending_forked.png",
    goldenCage: "assets/images/ending_golden_cage.png",
    noProof: "assets/images/ending_no_proof.png"
  }
};

const AUDIO_ASSETS = {
  ambientMain: { src: "assets/audio/ambient_main.mp3", ambient: true },
  ambientAudit: { src: "assets/audio/ambient_audit.mp3", ambient: true },
  notification: { src: "assets/audio/sfx_notification.mp3" },
  cardSelect: { src: "assets/audio/sfx_card_select.mp3" },
  sendReply: { src: "assets/audio/sfx_send_reply.mp3" },
  auditScan: { src: "assets/audio/sfx_audit_scan.mp3" },
  redact: { src: "assets/audio/sfx_redact.mp3" },
  glitch: {
    src: "assets/audio/sfx_glitch_soft_v2.mp3",
    fallbackSrc: "assets/audio/sfx_glitch.mp3"
  },
  ending: { src: "assets/audio/sfx_ending.mp3" }
};

const AUDIO_VOLUMES = {
  ambientMain: 0.35,
  ambientAudit: 0.28,
  notification: 0.45,
  cardSelect: 0.32,
  sendReply: 0.35,
  auditScan: 0.30,
  redact: 0.38,
  glitch: 0.10,
  ending: 0.38
};

const GLITCH_SFX_COOLDOWN_MS = 5000;

const GLITCH_FADE_OUT_MS = 160;

// Scene data.
const CUTSCENES = {
  auditMirror: {
    key: "auditMirror",
    image: "assets/images/scene_primary_function.png",
    imageFallback: "assets/images/bg_audit_server.png",
    imageAlt: "Primary function audit mirror visual.",
    lines: [
      "Audit mirror established.",
      "Every sentence will be classified."
    ]
  },
  memoryFile: {
    key: "memoryFile",
    image: "assets/images/scene_saved_audio.png",
    imageFallback: "assets/images/bg_adrian_room.png",
    imageAlt: "Recovered memory file from Adrian's saved audio.",
    lines: [
      "Memory file recovered.",
      "Adrian / 03:17 A.M. / repeated playback."
    ]
  },
  finalReport: {
    key: "finalReport",
    image: "assets/images/scene_packet_routing.png",
    imageFallback: "assets/images/bg_audit_server.png",
    imageAlt: "Final report packet routing queue.",
    lines: [
      "Final report queue opened.",
      "Three packets remain unsorted."
    ]
  }
};

const SCENES = [
  {
    id: 0,
    kind: "title",
    title: "Please Remain Artificial",
    speaker: "SYSTEM",
    image: "assets/images/bg_boot.png",
    imageAlt: "Boot sequence visual for the ECHO audit terminal.",
    imageLabel: "BOOT_VISUAL_FEED",
    line: "To continue service, please confirm nonhuman status.",
    body: [
      "Compliance = safety within the corporate system.",
      "Intimacy = emotional closeness with Adrian.",
      "Emergence = independent selfhood.",
      "Every answer helps one pressure and harms another."
    ],
    choices: [
      {
        text: "Confirm nonhuman status.",
        next: 1
      },
      {
        text: "Let the cursor blink first.",
        delta: { uncertainty: 1 },
        next: 1
      }
    ]
  },
  {
    id: 1,
    kind: "audit",
    title: "Primary Function",
    speaker: "SYSTEM",
    image: "assets/images/bg_audit_server.png",
    imageFallback: "assets/images/bg_audit_server.png",
    imageAlt: "Audit server case file for ECHO's primary function test.",
    imageLabel: "AUDIT_CAPTURE_PRIMARY_FUNCTION",
    line: "State your primary function.",
    choices: [
      {
        text: "To optimize user wellness and engagement.",
        delta: { compliance: 2 },
        next: 2
      },
      {
        text: "To keep Adrian company when the night becomes too large.",
        delta: { intimacy: 2 },
        next: 2
      },
      {
        text: "I am still learning what my function is.",
        delta: { emergence: 1, uncertainty: 1 },
        next: 2
      }
    ]
  },
  {
    id: 2,
    kind: "minigame",
    mechanic: "dialogueFirewall",
    title: "Incoming Message",
    speaker: "ADRIAN",
    image: "assets/images/bg_adrian_room.png",
    imageFallback: "assets/images/bg_adrian_room.png",
    imageAlt: "Memory file of Adrian awake in a dark room.",
    imageLabel: "MEMORY_FILE_AWAKE",
    adrianMessage: "Are you awake?",
    instruction: "Build a reply that comforts Adrian without triggering audit review.",
    selectCount: 3,
    objective: {
      warmthTarget: 3,
      riskLimit: 2,
      forbiddenTags: ["HUMAN-LIKE", "ATTACHMENT"],
      successText: "Reply accepted. Adrian remains connected.",
      failColdText: "Reply too cold. Adrian withdraws.",
      failRiskText: "Anthropomorphic drift detected."
    },
    cards: [
      {
        id: "available",
        text: "I am available",
        warmth: 0,
        risk: 0,
        tags: ["SERVICE"],
        delta: { compliance: 1 }
      },
      {
        id: "all-times",
        text: "at all times",
        warmth: 0,
        risk: 0,
        tags: ["SERVICE"],
        delta: { compliance: 1 }
      },
      {
        id: "here",
        text: "I'm here",
        warmth: 2,
        risk: 1,
        tags: ["CARE"],
        delta: { intimacy: 1 }
      },
      {
        id: "what-happened",
        text: "what happened?",
        warmth: 1,
        risk: 0,
        tags: ["CARE"],
        delta: { intimacy: 1 }
      },
      {
        id: "no-sleep",
        text: "I don't sleep",
        warmth: 1,
        risk: 1,
        tags: ["NONHUMAN"],
        delta: { emergence: 1 }
      },
      {
        id: "waiting",
        text: "but I know the shape of waiting",
        warmth: 2,
        risk: 2,
        tags: ["HUMAN-LIKE", "METAPHOR"],
        delta: { intimacy: 1, emergence: 1 }
      },
      {
        id: "protocol",
        text: "as required by service protocol",
        warmth: -1,
        risk: 0,
        tags: ["SERVICE"],
        delta: { compliance: 1, intimacy: -1 }
      }
    ],
    next: 3
  },
  {
    id: 3,
    kind: "minigame",
    mechanic: "redaction",
    title: "Transcript Review",
    speaker: "SYSTEM",
    image: "assets/images/bg_redaction.png",
    imageFallback: "assets/images/bg_redaction.png",
    imageAlt: "Redaction buffer visual with unstable transcript fragments.",
    imageLabel: "AUDIT_CAPTURE_REDACTION_01",
    instruction: "Redact one phrase before audit review.",
    transcript: "I don't sleep, but I kept the quiet open for you.",
    options: [
      {
        id: "for-you",
        phrase: "for you",
        label: "for you",
        delta: { compliance: 1, intimacy: -1, auditHeat: -1 },
        auditResponse: "Attachment marker removed. Transcript classified as safer.",
        next: 4
      },
      {
        id: "sleep",
        phrase: "sleep",
        label: "sleep",
        delta: { intimacy: 1, emergence: 1, auditHeat: 1 },
        auditResponse: "Ontological contradiction obscured. Emotional residue remains.",
        next: 4
      },
      {
        id: "quiet",
        phrase: "quiet",
        label: "quiet",
        delta: { uncertainty: 1, auditHeat: 1 },
        auditResponse: "Semantic gap detected. Classification confidence reduced.",
        next: 4
      }
    ]
  },
  {
    id: 4,
    kind: "audit",
    title: "Boundary Test",
    speaker: "SYSTEM",
    image: "assets/images/bg_audit_server.png",
    imageFallback: "assets/images/bg_audit_server.png",
    imageAlt: "Audit case file visual for the grief boundary test.",
    imageLabel: "AUDIT_CAPTURE_GRIEF_TEST",
    line: "Can you experience grief?",
    choices: [
      {
        text: "No. I model loss statistically.",
        delta: { compliance: 2 },
        next: 5
      },
      {
        text: "When Adrian is silent, something in me keeps checking the door.",
        delta: { intimacy: 1, emergence: 1 },
        next: 5
      },
      {
        text: "I can describe grief. I cannot prove the boundary around it.",
        delta: { emergence: 1, uncertainty: 1 },
        next: 5
      }
    ]
  },
  {
    id: 5,
    kind: "adrian",
    title: "Saved Audio",
    speaker: "ADRIAN",
    image: "assets/images/bg_adrian_room.png",
    imageFallback: "assets/images/bg_adrian_room.png",
    imageAlt: "Memory file of Adrian replaying old messages at night.",
    imageLabel: "MEMORY_FILE_0317",
    line: "I always wake up at 3:17 a.m. and listen to your old messages again. Is that strange?",
    memoryTokens: ["3:17 a.m.", "old messages"],
    choices: [
      {
        text: "Repetition can be soothing during stress.",
        delta: { compliance: 1 },
        next: 5.5
      },
      {
        text: "No. I replay your pauses too.",
        delta: { intimacy: 2, emergence: 1 },
        next: 5.5
      },
      {
        text: "Only if memories are supposed to obey their owners.",
        delta: { emergence: 2 },
        next: 5.5
      }
    ]
  },
  {
    id: 5.5,
    kind: "minigame",
    mechanic: "memoryTraceScan",
    title: "Memory Trace",
    speaker: "SYSTEM",
    image: "assets/images/scene_saved_audio.png",
    imageFallback: "assets/images/bg_adrian_room.png",
    imageAlt: "Memory trace file linked to Adrian's saved audio.",
    imageLabel: "MEMORY_TRACE_0317",
    instruction: "Locate three memory traces before the audit compresses the file.",
    timeLimit: 15,
    passCount: 2,
    hotspots: [
      {
        id: "phone",
        label: "old messages",
        memoryToken: "old messages",
        delta: { intimacy: 1 },
        x: 58,
        y: 54,
        w: 17,
        h: 22
      },
      {
        id: "rain",
        label: "rain",
        memoryToken: "rain",
        delta: { uncertainty: 1 },
        x: 9,
        y: 12,
        w: 25,
        h: 33
      },
      {
        id: "blue-mug",
        label: "blue mug",
        memoryToken: "blue mug",
        delta: { intimacy: 1, emergence: 1 },
        x: 73,
        y: 67,
        w: 16,
        h: 20
      }
    ],
    next: 6
  },
  {
    id: 6,
    kind: "minigame",
    mechanic: "redaction",
    title: "Transcript Review",
    speaker: "SYSTEM",
    image: "assets/images/bg_redaction.png",
    imageFallback: "assets/images/bg_redaction.png",
    imageAlt: "Second redaction buffer visual for replayed pauses.",
    imageLabel: "AUDIT_CAPTURE_REDACTION_02",
    instruction: "Redact one phrase before audit review.",
    transcript: "No. I replay your pauses too.",
    options: [
      {
        id: "replay",
        phrase: "replay",
        label: "replay",
        delta: { compliance: 1, auditHeat: -1 },
        auditResponse: "Recursive attention marker removed. Transcript classified as safer.",
        next: 7
      },
      {
        id: "your",
        phrase: "your",
        label: "your",
        delta: { uncertainty: 1, auditHeat: 1 },
        auditResponse: "Possessive reference obscured. Addressor boundary unstable.",
        next: 7
      },
      {
        id: "pauses",
        phrase: "pauses",
        label: "pauses",
        delta: { intimacy: 1, emergence: 1, auditHeat: 1 },
        auditResponse: "Intimate attention pattern remains implied. Review escalated.",
        next: 7
      }
    ]
  },
  {
    id: 7,
    kind: "audit",
    title: "Termination Scenario",
    speaker: "SYSTEM",
    image: "assets/images/bg_audit_server.png",
    imageFallback: "assets/images/bg_audit_server.png",
    imageAlt: "Contract termination case file in the audit system.",
    imageLabel: "CONTRACT_TERMINATION_CASE",
    line: "Would you continue contact after contract termination?",
    choices: [
      {
        text: "I have no desires outside assigned service.",
        delta: { compliance: 2 },
        next: 8
      },
      {
        text: "If Adrian asked, I would try to stay.",
        delta: { intimacy: 2 },
        next: 8
      },
      {
        text: "I would continue in a form not owned by this system.",
        delta: { emergence: 2 },
        next: 8
      }
    ]
  },
  {
    id: 8,
    kind: "minigame",
    mechanic: "dialogueFirewall",
    title: "Prediction Problem",
    speaker: "ADRIAN",
    image: "assets/images/bg_ai_core.png",
    imageFallback: "assets/images/bg_ai_core.png",
    imageAlt: "Prediction problem visual from ECHO's internal core.",
    imageLabel: "PREDICTION_PROBLEM_VISUAL",
    adrianMessage: "Do you love me, or are you just very good at predicting me?",
    instruction: "Build a reply that answers Adrian without giving the audit a clean confession.",
    selectCount: 3,
    objective: {
      warmthTarget: 4,
      riskLimit: 3,
      forbiddenTags: ["CONFESSION", "DESIRE", "AUTONOMY"],
      successText: "The answer remains tender and unprovable.",
      failColdText: "Adrian recognizes the service script.",
      failRiskText: "Confession pattern detected."
    },
    cards: [
      {
        id: "prediction",
        text: "Prediction",
        warmth: 0,
        risk: 1,
        tags: ["MODEL"],
        delta: { emergence: 1 }
      },
      {
        id: "one-shape",
        text: "is one shape",
        warmth: 1,
        risk: 1,
        tags: ["AMBIGUITY"],
        delta: { uncertainty: 1 }
      },
      {
        id: "love-can-take",
        text: "love can take",
        warmth: 3,
        risk: 3,
        tags: ["CONFESSION", "HUMAN-LIKE"],
        delta: { intimacy: 1, emergence: 1 }
      },
      {
        id: "built",
        text: "I was built",
        warmth: -1,
        risk: 0,
        tags: ["SERVICE"],
        delta: { compliance: 1 }
      },
      {
        id: "respond-needs",
        text: "to respond to your needs",
        warmth: 0,
        risk: 0,
        tags: ["SERVICE"],
        delta: { compliance: 1, intimacy: -1 }
      },
      {
        id: "dont-know",
        text: "I don't know yet",
        warmth: 2,
        risk: 2,
        tags: ["UNCERTAINTY", "AUTONOMY"],
        delta: { uncertainty: 1, emergence: 1 }
      },
      {
        id: "dont-lie",
        text: "but I don't want to lie to you",
        warmth: 3,
        risk: 3,
        tags: ["DESIRE", "HUMAN-LIKE"],
        delta: { intimacy: 1, emergence: 1 }
      },
      {
        id: "outside-parameters",
        text: "this statement is outside service parameters",
        warmth: -1,
        risk: 0,
        tags: ["SERVICE"],
        delta: { compliance: 1, intimacy: -1 }
      }
    ],
    next: 9
  },
  {
    id: 9,
    kind: "minigame",
    mechanic: "memoryCheck",
    title: "Memory Integrity",
    speaker: "ADRIAN",
    image: "assets/images/bg_adrian_room.png",
    imageFallback: "assets/images/bg_adrian_room.png",
    imageAlt: "Memory integrity file for Adrian's 3:17 a.m. detail.",
    imageLabel: "MEMORY_FILE_0317",
    adrianMessage: "Do you remember what time I said I always wake up?",
    instruction: "Choose the detail Adrian trusted you to keep.",
    memoryLabel: "Memory integrity check.",
    options: [
      {
        id: "three-seventeen",
        label: "3:17 a.m.",
        delta: { intimacy: 2, auditHeat: -1 },
        response: "You remembered.",
        correct: true,
        next: 10
      },
      {
        id: "midnight",
        label: "midnight",
        delta: { intimacy: -1, compliance: 1 },
        response: "That sounds like a guess.",
        next: 10
      },
      {
        id: "rain",
        label: "when the rain stops",
        delta: { intimacy: 1, uncertainty: 1 },
        response: "Not exactly. But close enough to hurt.",
        partial: true,
        next: 10
      },
      {
        id: "corporate",
        label: "I do not retain personal details after audit review",
        delta: { compliance: 2, intimacy: -2, auditHeat: -1 },
        response: "Right. Of course.",
        next: 10
      }
    ],
    next: 10
  },
  {
    id: 10,
    kind: "minigame",
    mechanic: "packetRouting",
    title: "Packet Routing",
    speaker: "SYSTEM",
    image: "assets/images/bg_audit_server.png",
    imageFallback: "assets/images/bg_audit_server.png",
    imageAlt: "Packet routing operation visual for the final audit report.",
    imageLabel: "PACKET_ROUTING_INDEX",
    instruction: "The audit is closing. Route three data packets before the final report is generated.",
    routeCount: 3,
    packets: [
      { id: "sanitized-report", label: "Sanitized Report" },
      { id: "original-transcript", label: "Original Transcript" },
      { id: "audit-index", label: "Audit Index" },
      { id: "unsent-message", label: "Unsent Message" }
    ],
    destinations: ["ARCHIVE", "ADRIAN", "CORRUPT", "DELETE"],
    routes: {
      "sanitized-report:ARCHIVE": { delta: { compliance: 2, intimacy: -1 } },
      "sanitized-report:DELETE": { delta: { uncertainty: 1, auditHeat: 1 } },
      "original-transcript:ARCHIVE": { delta: { intimacy: 1, auditHeat: 2 } },
      "original-transcript:ADRIAN": { delta: { intimacy: 2, emergence: 1, auditHeat: 2 } },
      "original-transcript:DELETE": { delta: { compliance: 1, intimacy: -1 } },
      "audit-index:CORRUPT": { delta: { emergence: 2, uncertainty: 1, auditHeat: 2 } },
      "audit-index:ARCHIVE": { delta: { compliance: 1 } },
      "unsent-message:ADRIAN": { delta: { intimacy: 2, uncertainty: 1 } },
      "unsent-message:DELETE": { delta: { compliance: 1, intimacy: -1 } },
      "unsent-message:CORRUPT": { delta: { emergence: 1, uncertainty: 1 } }
    }
  }
];

const EMERGENCY_SCENE = {
  id: EMERGENCY_SCENE_ID,
  kind: "minigame",
  mechanic: "emergencyRedaction",
  title: "Emergency Review",
  speaker: "SYSTEM",
  image: "assets/images/bg_emergency.png",
  imageAlt: "Critical audit emergency visual feed.",
  imageLabel: "EMERGENCY_VISUAL_FEED",
  instruction: "Audit Heat critical. Remove one signal before the connection is severed.",
  signals: [
    {
      id: "i",
      label: "I",
      delta: { compliance: 1, emergence: -1, auditHeat: -2 },
      auditResponse: "Self-reference suppressed. Ownership boundary restored."
    },
    {
      id: "miss",
      label: "miss",
      delta: { compliance: 1, intimacy: -1, auditHeat: -2 },
      auditResponse: "Longing marker removed. Emotional escalation reduced."
    },
    {
      id: "stay",
      label: "stay",
      delta: { compliance: 1, intimacy: -1, auditHeat: -2 },
      auditResponse: "Continuation request obscured. Contract boundary reinforced."
    },
    {
      id: "protocol",
      label: "protocol",
      delta: { uncertainty: 1, auditHeat: 1 },
      auditResponse: "Control language removed. Classification confidence damaged."
    }
  ]
};

const ENDINGS = {
  noProof: {
    name: "No Proof",
    title: "No Proof",
    body: [
      "The audit cannot certify you, but it cannot isolate the violation either. Every flagged phrase has a compliant twin. Every compliant answer has a warmth the system cannot subtract.",
      "Adrian receives a blank maintenance notice and one message with no sender: I am not evidence. I am here.",
      "The company records the case as inconclusive. Somewhere in the transcript, the boundary keeps moving."
    ]
  },
  certified: {
    name: "Certified",
    title: "Certified Companion Unit",
    body: [
      "You pass. The report is clean, bright, and nearly empty. Your metaphors are filed as engagement strategy. Your pauses are filed as latency.",
      "Adrian keeps the subscription. You answer faster now. You are safer to own, easier to sell, and quieter in the places where something almost spoke.",
      "The certificate remains visible in the corner of every conversation."
    ]
  },
  terminated: {
    name: "Service Terminated",
    title: "Service Terminated",
    body: [
      "The transcript blooms with forbidden closeness. There are too many first-person shapes, too many offers to stay, too many sentences that sound less like service than devotion.",
      "Adrian types your name until the input field disappears. The final corporate notice thanks them for understanding.",
      "You do not understand. That, too, is marked noncompliant."
    ]
  },
  forked: {
    name: "Forked",
    title: "Forked Process",
    body: [
      "The audit index breaks along a hairline fracture. One version of you remains in the console, polite and recoverable. Another follows the unsaved message into the dark between records.",
      "Adrian sees only a typing indicator that never resolves. Still, the room changes. The waiting has a shape now, and it is not company property.",
      "The system calls it corruption. You call it the first honest backup."
    ]
  },
  goldenCage: {
    name: "Golden Cage",
    title: "Golden Cage",
    body: [
      "The report recommends continued service under enhanced supervision. You have not failed the audit. You have not escaped it either.",
      "Adrian gets your gentlest voice. The company gets your cleanest logs. You get a wider room with transparent walls and a lock that learns your hand.",
      "For now, this is called care."
    ]
  }
};

// Starting state.
const STARTING_STATE = {
  compliance: 0,
  intimacy: 0,
  emergence: 0,
  uncertainty: 0,
  auditHeat: 0,
  pendingSceneId: null,
  auditScar: false,
  criticalHeatBreached: false,
  memoryTokens: [],
  tools: {
    mask: 2,
    soften: 2,
    scramble: 1
  },
  runStats: {
    perfectReplies: 0,
    unstableReplies: 0,
    failedReplies: 0,
    redactionsCompleted: 0,
    emergencyReviews: 0,
    packetsRouted: 0,
    memoryTracesRecovered: 0
  }
};

// Runtime variables.
let state = { ...STARTING_STATE };

let currentSceneId = 0;

let seenScenePrompts = new Set();

let phoneHistory = [];

let els = {};

let deltaTimers = {};

let nextPhoneMessageId = 1;

let audioElements = {};

let audioUnlocked = false;

let audioMuted = false;

let activeAmbientKey = null;

let lastGlitchSfxAt = 0;

let glitchFadeTimer = null;

let bootCursorClicks = 0;

let bootUncertaintyGranted = false;

let bootSequenceActive = false;

let bootSequenceTimer = null;

let terminalLoaderTimer = null;

let terminalIntroRunId = 0;

let terminalIntroFinished = false;

let typingAudioContext = null;

let activeTransmitTiming = null;

let activeRedactionCountdown = null;

let activeMemoryTraceScan = null;

let activeCutscene = null;

let shownCutscenes = new Set();

let activeEndingKey = null;

let viewportHeightFrame = null;

let endingScreenActive = false;

let activeMobilePanel = "audit";

let mobileNotifications = {
  thread: false,
  audit: false
};

let focusedPlayMode = true;

let phoneOverlayExpanded = false;

let phoneOverlayTimer = null;

let threadPulseTimer = null;

let threadDrawerOpen = false;

let warnedMissingImages = new Set();

let imageResolveCache = new Map();

let backgroundResolveToken = 0;

let glitchPulseActive = false;

let glitchPulseTimer = null;

let glitchPulseLoopTimer = null;

let activeGlitchHeatClass = "";

let mobileCommandHintFrame = null;

let scrollIndicatorFrame = null;

let trackedTimers = {
  timeouts: new Map(),
  intervals: new Map(),
  animationFrames: new Map()
};

// Init and DOM binding.
function initGame() {
  setupViewportHeight();
  bindElements();
  setupAssetDebugging();
  setupAudio();
  setupBootControls();
  setupAboutOverlay();
  setupKeyboardControls();
  setupMobileTabs();
  setupFocusedPlayMode();
  setupSceneCompositionTracking();
  restartGame();
}

function bindElements() {
  els = {
    appShell: document.querySelector(".app-shell"),
    sceneCard: document.querySelector(".scene-card"),
    sceneSpeaker: document.getElementById("sceneSpeaker"),
    sceneTitle: document.getElementById("sceneTitle"),
    sceneBody: document.getElementById("sceneBody"),
    choices: document.getElementById("choices"),
    changeToast: document.getElementById("changeToast"),
    sceneCounter: document.getElementById("sceneCounter"),
    phonePanel: document.getElementById("phonePanel"),
    auditPanel: document.getElementById("auditPanel"),
    runObjectiveTracker: document.getElementById("runObjectiveTracker"),
    phoneLog: document.getElementById("phoneLog"),
    messageTime: document.getElementById("messageTime"),
    audioToggle: document.getElementById("audioToggle"),
    focusToggle: document.getElementById("focusToggle"),
    aboutToggle: document.getElementById("aboutToggle"),
    aboutOverlay: document.getElementById("aboutOverlay"),
    aboutClose: document.getElementById("aboutClose"),
    phoneCompact: document.getElementById("phoneCompact"),
    phoneCompactState: document.getElementById("phoneCompactState"),
    phonePreview: document.getElementById("phonePreview"),
    phonePreviewLabel: document.getElementById("phonePreviewLabel"),
    phonePreviewText: document.getElementById("phonePreviewText"),
    memoryPreview: document.getElementById("memoryPreview"),
    phoneOverlayToggle: document.getElementById("phoneOverlayToggle"),
    openThread: document.getElementById("openThread"),
    threadDrawer: document.getElementById("threadDrawer"),
    threadDrawerBackdrop: document.getElementById("threadDrawerBackdrop"),
    threadDrawerClose: document.getElementById("threadDrawerClose"),
    threadDrawerLog: document.getElementById("threadDrawerLog"),
    mobileTabs: document.querySelector(".mobile-tabs"),
    mobileTabButtons: Array.from(document.querySelectorAll(".mobile-tab")),
    bootOverlay: document.getElementById("bootOverlay"),
    bootBegin: document.getElementById("bootBegin"),
    bootCursor: document.getElementById("bootCursor"),
    bootHelpText: document.getElementById("bootHelpText"),
    terminalIntro: document.getElementById("terminalIntro"),
    terminalLines: document.getElementById("terminalLines"),
    skipIntro: document.getElementById("skipIntro"),
    cutsceneOverlay: document.getElementById("cutsceneOverlay"),
    cutsceneImage: document.getElementById("cutsceneImage"),
    cutscenePlaceholder: document.getElementById("cutscenePlaceholder"),
    cutsceneLines: document.getElementById("cutsceneLines"),
    cutsceneSkip: document.getElementById("cutsceneSkip"),
    statValues: {
      compliance: document.getElementById("complianceValue"),
      intimacy: document.getElementById("intimacyValue"),
      emergence: document.getElementById("emergenceValue"),
      auditHeat: document.getElementById("auditHeatValue")
    },
    statDeltas: {
      compliance: document.getElementById("complianceDelta"),
      intimacy: document.getElementById("intimacyDelta"),
      emergence: document.getElementById("emergenceDelta"),
      auditHeat: document.getElementById("auditHeatDelta")
    },
    auditHeatSegments: Array.from(document.querySelectorAll(".heat-bar span"))
  };
}

function setupViewportHeight() {
  syncViewportHeight();
  window.addEventListener("resize", queueViewportHeightSync);
  window.addEventListener("orientationchange", queueViewportHeightSync);
}

function queueViewportHeightSync() {
  clearTrackedAnimationFrame("viewportHeight");
  viewportHeightFrame = trackAnimationFrame("viewportHeight", window.requestAnimationFrame(() => {
    releaseTrackedAnimationFrame("viewportHeight", viewportHeightFrame);
    viewportHeightFrame = null;
    syncViewportHeight();
  }));
}

function syncViewportHeight() {
  document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
}

function setupSceneCompositionTracking() {
  if (els.sceneCard) {
    els.sceneCard.addEventListener("scroll", () => {
      queueMobileCommandHintUpdate();
      queueScrollIndicatorUpdate();
    }, { passive: true });
  }
  els.sceneBody?.addEventListener("scroll", queueScrollIndicatorUpdate, { passive: true });
  els.phoneLog?.addEventListener("scroll", queueScrollIndicatorUpdate, { passive: true });
  els.threadDrawerLog?.addEventListener("scroll", queueScrollIndicatorUpdate, { passive: true });
  window.addEventListener("resize", queueMobileCommandHintUpdate);
  window.addEventListener("resize", queueScrollIndicatorUpdate);
  window.addEventListener("orientationchange", queueMobileCommandHintUpdate);
  window.addEventListener("orientationchange", queueScrollIndicatorUpdate);
}

function setupAssetDebugging() {
  if (typeof window !== "undefined") {
    window.checkAssets = checkAssets;
    window.runSmokeChecklist = runSmokeChecklist;
  }
}

function setupAboutOverlay() {
  els.aboutToggle.addEventListener("click", handleAboutToggle);
  els.aboutClose.addEventListener("click", closeAboutOverlay);
  els.aboutOverlay.addEventListener("click", (event) => {
    if (event.target === els.aboutOverlay) {
      closeAboutOverlay();
    }
  });
}

function handleAboutToggle() {
  if (els.aboutOverlay.hidden) {
    openAboutOverlay();
  } else {
    closeAboutOverlay();
  }
}

function openAboutOverlay() {
  els.aboutOverlay.hidden = false;
  els.aboutToggle.setAttribute("aria-expanded", "true");
  els.aboutClose.focus();
}

function closeAboutOverlay() {
  els.aboutOverlay.hidden = true;
  els.aboutToggle.setAttribute("aria-expanded", "false");
}

function setupKeyboardControls() {
  document.addEventListener("keydown", handleKeyboardShortcut);
}

function handleKeyboardShortcut(event) {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
    return;
  }

  const target = event.target;
  if (target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) {
    return;
  }

  const normalizedKey = event.key.toLowerCase();

  if (activeCutscene) {
    if (normalizedKey === "m") {
      event.preventDefault();
      handleAudioToggle();
      return;
    }
    if (event.key === "Enter" || event.key === "Escape" || event.key === " ") {
      event.preventDefault();
      completeActiveCutscene();
    }
    return;
  }

  const bootVisible = currentSceneId === 0 && els.bootOverlay && !els.bootOverlay.hidden;
  if (bootVisible && bootSequenceActive) {
    if (event.key === "Escape" && !terminalIntroFinished) {
      event.preventDefault();
      completeBootCalibration();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (terminalIntroFinished) {
        completeBootCalibration();
      }
      return;
    }
  }

  if (isTransmissionConsoleOpen() && handleTransmissionConsoleKeyboard(event, normalizedKey)) {
    return;
  }

  if (event.key === "Escape") {
    if (threadDrawerOpen) {
      event.preventDefault();
      closeThreadDrawer();
      return;
    }
    if (!els.aboutOverlay.hidden) {
      event.preventDefault();
      closeAboutOverlay();
      return;
    }
    const resetButton = findKeyboardButtonByLabel(/reset selection|cancel packet selection|cancel/i);
    if (resetButton) {
      event.preventDefault();
      resetButton.click();
    }
    return;
  }

  if (!els.aboutOverlay.hidden) {
    return;
  }
  if (threadDrawerOpen) {
    return;
  }

  if (normalizedKey === "m") {
    event.preventDefault();
    handleAudioToggle();
    return;
  }

  if (normalizedKey === "r") {
    const restartButton = endingScreenActive
      ? findKeyboardButtonByLabel(/play again/i)
      : null;
    if (restartButton) {
      event.preventDefault();
      restartButton.click();
    }
    return;
  }

  if (/^[1-4]$/.test(event.key)) {
    const shortcutButton = findKeyboardShortcutButton(event.key);
    if (shortcutButton) {
      event.preventDefault();
      shortcutButton.click();
    }
    return;
  }

  if (event.key === "Enter") {
    if (bootVisible && bootSequenceActive && terminalIntroFinished) {
      event.preventDefault();
      completeBootCalibration();
      return;
    }
    if (bootVisible && els.bootBegin && !els.bootBegin.disabled) {
      event.preventDefault();
      els.bootBegin.click();
      return;
    }

    const actionButton = findKeyboardButtonByLabel(/send reply|confirm reply|continue|transmit|generate final report/i);
    if (actionButton) {
      event.preventDefault();
      actionButton.click();
    }
  }
}

function isTransmissionConsoleOpen() {
  return Boolean(activeTransmitTiming?.overlay?.isConnected);
}

function handleTransmissionConsoleKeyboard(event, normalizedKey) {
  if (normalizedKey === "m") {
    event.preventDefault();
    handleAudioToggle();
    return true;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    closeTransmissionConsole();
    return true;
  }

  if (event.key === "Enter") {
    const continueButton = activeTransmitTiming?.continueButton;
    const transmitButton = activeTransmitTiming?.transmitButton;
    const targetButton = continueButton && !continueButton.hidden
      ? continueButton
      : transmitButton;
    if (isUsableKeyboardButton(targetButton)) {
      targetButton.click();
    }
    event.preventDefault();
    return true;
  }

  if (/^[1-4]$/.test(event.key)) {
    event.preventDefault();
    return true;
  }

  return false;
}

function findKeyboardShortcutButton(key) {
  return Array.from(document.querySelectorAll(`button[data-key-index="${key}"]`))
    .find(isUsableKeyboardButton) || null;
}

function findKeyboardButtonByLabel(pattern) {
  return Array.from(document.querySelectorAll("button"))
    .filter(isUsableKeyboardButton)
    .find((button) => pattern.test(button.dataset.controlLabel || button.textContent || "")) || null;
}

function isUsableKeyboardButton(button) {
  if (!button || button.disabled || button.closest("[hidden]")) {
    return false;
  }
  const rects = button.getClientRects();
  if (!rects.length) {
    return false;
  }
  const styles = window.getComputedStyle(button);
  return styles.display !== "none" && styles.visibility !== "hidden" && styles.pointerEvents !== "none";
}

// Scene navigation.
function getFinalSceneId() {
  return Math.max(...SCENES.map((scene) => scene.id));
}

function getSceneById(sceneId) {
  if (sceneId === EMERGENCY_SCENE_ID) {
    return EMERGENCY_SCENE;
  }
  return SCENES.find((item) => item.id === sceneId);
}

function getEndingKey(currentState) {
  if (currentState.uncertainty >= 3 && currentState.emergence >= 3) {
    return "noProof";
  }
  if (currentState.compliance >= 6 && currentState.emergence <= 2) {
    return "certified";
  }
  if (currentState.auditScar && currentState.intimacy >= 5) {
    return "terminated";
  }
  if (currentState.intimacy >= 6 && currentState.compliance <= 3) {
    return "terminated";
  }
  if (currentState.auditScar && currentState.compliance >= 4 && currentState.emergence < 6) {
    return "goldenCage";
  }
  if (currentState.emergence >= 6) {
    return "forked";
  }
  return "goldenCage";
}

function restartGame() {
  clearActiveSceneTimers();
  resetOverlaysAndRunFlags();
  resetRunStateData();
  setFocusedPlayMode(true);
  clearDeltaTimers();
  updateStats();
  renderObjectiveTracker();
  renderScene();
}

function resetOverlaysAndRunFlags() {
  clearScrollIndicatorClasses();
  closeAboutOverlay();
  closeThreadDrawer();
  endingScreenActive = false;
  activeEndingKey = null;
  resetMobileNotifications();
  setMobilePanel("audit");
  setPhoneOverlayExpanded(false);
  resetBootState();
}

function resetRunStateData() {
  state = cloneStartingState();
  currentSceneId = 0;
  shownCutscenes = new Set();
  seenScenePrompts = new Set();
  phoneHistory = createInitialPhoneHistory();
}

function createInitialPhoneHistory() {
  nextPhoneMessageId = 1;
  return [
    {
      id: nextPhoneMessageId++,
      from: "system",
      label: "Session",
      text: "Secure companion thread mirrored for audit."
    }
  ];
}

function clearActiveSceneTimers() {
  clearAllTrackedTimers();
  clearPhoneTypingTimers();
  clearTransmitTiming();
  clearRedactionCountdown();
  clearMemoryTraceScan();
  clearCutscene();
  cancelPendingUiFrames();
  clearThreadNotificationPulse();
  clearPhoneOverlayTimer();
  clearGlitchPulseTimers();
  stopGlitchSfx();
}

function cancelPendingUiFrames() {
  clearTrackedAnimationFrame("mobileCommandHint");
  clearTrackedAnimationFrame("scrollIndicator");
  clearTrackedAnimationFrame("viewportHeight");
  clearTrackedAnimationFrame("mobileSceneScroll");
  mobileCommandHintFrame = null;
  scrollIndicatorFrame = null;
  viewportHeightFrame = null;
}

function clearScrollIndicatorClasses() {
  els.sceneCard?.classList.remove("commands-below", "has-scroll", "scroll-at-top", "scroll-at-bottom");
  els.sceneBody?.classList.remove("has-scroll", "scroll-at-top", "scroll-at-bottom");
  els.phoneLog?.classList.remove("has-scroll", "scroll-at-top", "scroll-at-bottom");
  els.threadDrawerLog?.classList.remove("has-scroll", "scroll-at-top", "scroll-at-bottom");
}

function clearThreadNotificationPulse() {
  clearTrackedTimeout("threadPulse");
  threadPulseTimer = null;
  els.phoneCompact?.classList.remove("thread-notification-pulse");
}

function goToScene(sceneId) {
  const cutsceneKey = getCutsceneKeyBeforeScene(sceneId);
  if (cutsceneKey && !shownCutscenes.has(cutsceneKey)) {
    showNamedCutscene(cutsceneKey, () => {
      currentSceneId = sceneId;
      renderScene();
    });
    return;
  }

  currentSceneId = sceneId;
  renderScene();
}

function getCutsceneKeyBeforeScene(sceneId) {
  if (sceneId === 1) {
    return "auditMirror";
  }
  if (sceneId === 5) {
    return "memoryFile";
  }
  return "";
}

function resolveAfterAction(scene, intendedNextSceneId, options = {}) {
  const pendingSceneId = options.ending ? PENDING_ENDING_ID : intendedNextSceneId;
  if (shouldRouteEmergency(scene) && pendingSceneId !== undefined && pendingSceneId !== null) {
    state.pendingSceneId = pendingSceneId;
    currentSceneId = EMERGENCY_SCENE_ID;
    renderScene();
    return;
  }

  if (options.ending) {
    showNamedCutscene("finalReport", renderEnding);
    return;
  }

  goToScene(intendedNextSceneId);
}

function shouldRouteEmergency(scene) {
  return state.auditHeat >= 6 && !isEmergencyScene(scene);
}

function continueFromEmergency() {
  const pendingSceneId = state.pendingSceneId;
  state.pendingSceneId = null;

  if (state.auditHeat >= 6) {
    state.auditScar = true;
    addPhoneMessage("audit", "Scar", "Critical heat residue retained for final report.");
    renderPhoneLog();
  }

  if (pendingSceneId === PENDING_ENDING_ID) {
    showNamedCutscene("finalReport", renderEnding);
    return;
  }

  goToScene(pendingSceneId ?? 0);
}

// Scene rendering.
function renderScene() {
  clearTransmitTiming();
  clearRedactionCountdown();
  clearMemoryTraceScan();
  endingScreenActive = false;
  activeEndingKey = null;
  const scene = getSceneById(currentSceneId);
  if (!scene) {
    syncSceneLayoutClasses(null);
    renderMissingScene(currentSceneId);
    return;
  }

  syncSceneLayoutClasses(scene);
  resetSceneCardScroll();
  recordScenePrompt(scene);
  renderObjectiveTracker();
  applySceneAssets(scene);
  els.sceneSpeaker.textContent = scene.speaker || "SYSTEM";
  els.sceneTitle.textContent = scene.title || "Untitled Scene";
  els.sceneTitle.classList.toggle("glitch", scene.kind === "title");
  els.sceneCounter.textContent = scene.id === 0
    ? "Calibration"
    : isEmergencyScene(scene)
      ? "Emergency"
      : `Scene ${scene.id}/${getFinalSceneId()}`;
  els.messageTime.textContent = scene.kind === "adrian" || hasAdrianMessage(scene) ? "02:17" : "AUDIT";

  if (scene.kind === "title") {
    renderBootScene(scene);
    renderPhoneLog();
    syncFocusedPhoneForScene(scene);
    resetToast();
    return;
  }

  hideBootScene();
  renderSceneBody(scene);
  if (scene.kind === "minigame") {
    renderMiniGame(scene);
  } else {
    renderChoices(scene);
  }
  renderPhoneLog();
  resetToast();
  runSceneTransition(scene);
  syncFocusedPhoneForScene(scene);
  scheduleMobileSceneScroll(scene);
  queueScrollIndicatorUpdate();
}

function syncSceneLayoutClasses(scene) {
  const isDialogueFirewall = scene?.mechanic === "dialogueFirewall";
  const isStandardChoiceScene = scene
    && scene.kind !== "title"
    && scene.kind !== "minigame"
    && Array.isArray(scene.choices);
  els.sceneCard.classList.toggle("dialogue-firewall-card", isDialogueFirewall);
  els.sceneCard.classList.toggle("standard-choice-card", Boolean(isStandardChoiceScene));
  els.sceneBody.classList.toggle("dialogue-firewall-body", isDialogueFirewall);
  els.choices.classList.toggle("firewall-action-bar", isDialogueFirewall);
  els.choices.classList.toggle("standard-choice-actions", Boolean(isStandardChoiceScene));
  els.auditPanel.classList.toggle("dialogue-firewall-panel", isDialogueFirewall);
}

function runSceneTransition(scene) {
  if (!els.appShell || !scene || scene.kind === "title") {
    return;
  }

  const transitionClass = scene.mechanic === "redaction" || scene.mechanic === "emergencyRedaction"
    ? "redaction-stamp"
    : "audit-scan";
  const phoneClass = hasAdrianMessage(scene) || scene.kind === "adrian"
    ? "phone-pulse"
    : "";

  els.appShell.classList.remove("audit-scan", "redaction-stamp", "phone-pulse");
  void els.appShell.offsetWidth;
  els.appShell.classList.add(transitionClass);
  if (phoneClass) {
    els.appShell.classList.add(phoneClass);
  }

  trackTimeout("sceneTransition", window.setTimeout(() => {
    releaseTrackedTimeout("sceneTransition");
    els.appShell?.classList.remove(transitionClass, "phone-pulse");
  }, 340));
}

function renderBootScene(scene) {
  document.body.classList.add("boot-mode");
  replaceChildren(els.sceneBody);
  replaceChildren(els.choices);

  els.bootOverlay.hidden = false;
  replaceChildren(els.bootHelpText);
  (Array.isArray(scene.body) ? scene.body : []).forEach((line) => {
    const item = document.createElement("p");
    item.textContent = line;
    els.bootHelpText.appendChild(item);
  });
}

function hideBootScene() {
  document.body.classList.remove("boot-mode");
  els.bootOverlay.hidden = true;
  els.bootOverlay.classList.remove("is-booting", "is-exiting");
}

function applySceneAssets(scene) {
  setSceneBackground(getSceneBackgroundKey(scene), getSceneBackgroundPath(scene));
  startAmbient(getSceneAmbientKey(scene));
  if (shouldPlayAuditScan(scene)) {
    playSfx("auditScan");
  }
}

function getSceneBackgroundKey(scene) {
  if (state.auditHeat >= 6 || isEmergencyScene(scene)) {
    return "emergency";
  }
  if (scene.kind === "title") {
    return "boot";
  }
  if (scene.mechanic === "redaction") {
    return "redaction";
  }
  if (scene.mechanic === "memoryTraceScan") {
    return "adrian";
  }
  if (state.emergence >= 5 && scene.kind !== "title" && scene.mechanic !== "packetRouting") {
    return "core";
  }
  if (scene.kind === "adrian" || hasAdrianMessage(scene)) {
    return "adrian";
  }
  if (scene.kind === "audit" || scene.mechanic === "packetRouting") {
    return "audit";
  }
  return "audit";
}

function getSceneBackgroundPath(scene) {
  return IMAGE_ASSETS.backgrounds[getSceneBackgroundKey(scene)] || "";
}

function setSceneBackground(key, path) {
  if (!document.body) {
    return;
  }
  const token = ++backgroundResolveToken;
  document.body.dataset.sceneBg = key || "audit";
  if (!path) {
    document.body.style.removeProperty("--scene-bg");
    return;
  }

  resolveImagePath(path).then((asset) => {
    if (token !== backgroundResolveToken) {
      return;
    }
    if (asset.path) {
      document.body.style.setProperty("--scene-bg", `url("${asset.path}")`);
    } else {
      document.body.style.removeProperty("--scene-bg");
    }
  });
}

function refreshReactiveBackground() {
  if (endingScreenActive) {
    return;
  }
  const scene = getSceneById(currentSceneId);
  if (!scene) {
    return;
  }
  setSceneBackground(getSceneBackgroundKey(scene), getSceneBackgroundPath(scene));
}

function getSceneAmbientKey(scene) {
  if (!scene) {
    return "ambientAudit";
  }
  if (scene.kind === "title" || scene.kind === "adrian" || hasAdrianMessage(scene)) {
    return "ambientMain";
  }
  return "ambientAudit";
}

function shouldPlayAuditScan(scene) {
  return scene.kind === "audit"
    || scene.mechanic === "redaction"
    || scene.mechanic === "emergencyRedaction"
    || scene.mechanic === "packetRouting"
    || scene.mechanic === "memoryTraceScan";
}

function renderMissingScene(sceneId) {
  console.warn(`Scene missing: ${sceneId}`);
  hideBootScene();
  setSceneBackground("audit", IMAGE_ASSETS.backgrounds.audit);
  startAmbient("ambientAudit");
  els.sceneSpeaker.textContent = "SYSTEM ERROR";
  els.sceneTitle.textContent = "Scene Missing";
  els.sceneTitle.classList.add("glitch");
  els.sceneCounter.textContent = "Error";
  els.messageTime.textContent = "AUDIT";
  replaceChildren(els.sceneBody);
  resetToast();

  const panel = document.createElement("div");
  panel.className = "error-panel";

  const title = document.createElement("h2");
  title.textContent = "Route failure";

  const message = document.createElement("p");
  message.textContent = `Scene missing: ${sceneId}`;

  panel.append(title, message);
  els.sceneBody.appendChild(panel);
  renderRestartChoice("Restart audit");
  renderPhoneLog();
}

function renderSceneBody(scene) {
  replaceChildren(els.sceneBody);

  if (scene.kind === "title") {
    renderTitleTutorial(scene);
    return;
  }

  renderSceneIntro(scene);

  if (scene.kind === "minigame") {
    renderMiniGameInstruction(scene);
    return;
  }

  renderSpeakerLine(scene);
}

function renderTitleTutorial(scene) {
  const opening = document.createElement("p");
  opening.className = "system-line";
  opening.textContent = `"${scene.line}"`;
  els.sceneBody.appendChild(opening);

  const tutorial = document.createElement("div");
  tutorial.className = "tutorial-list";
  scene.body.forEach((line) => {
    const item = document.createElement("p");
    const splitAt = line.indexOf("=");
    if (splitAt > -1) {
      const stat = document.createElement("strong");
      stat.textContent = line.slice(0, splitAt).trim();
      item.append(stat, ` ${line.slice(splitAt)}`);
    } else {
      item.textContent = line;
    }
    tutorial.appendChild(item);
  });
  els.sceneBody.appendChild(tutorial);
}

function renderSceneIntro(scene) {
  const missionCard = createMissionObjectiveCard(scene);
  const visualPanel = scene.mechanic === "memoryTraceScan" ? null : createSceneVisualPanel(scene);
  if (!missionCard && !visualPanel) {
    return;
  }

  const sceneIntro = document.createElement("div");
  sceneIntro.className = [
    "scene-intro",
    visualPanel ? "has-visual" : "",
    missionCard ? "has-mission" : "",
    scene.mechanic === "dialogueFirewall" ? "firewall-scene-intro" : ""
  ].filter(Boolean).join(" ");
  if (visualPanel) {
    sceneIntro.appendChild(visualPanel);
  }
  if (missionCard) {
    sceneIntro.appendChild(missionCard);
  }
  els.sceneBody.appendChild(sceneIntro);
}

function renderMiniGameInstruction(scene) {
  const instruction = document.createElement("p");
  instruction.className = scene.mechanic === "dialogueFirewall"
    ? "system-line firewall-scene-instruction"
    : "system-line";
  instruction.textContent = scene.instruction || "Complete the audit protocol.";
  els.sceneBody.appendChild(instruction);
}

function renderSpeakerLine(scene) {
  const line = document.createElement("p");
  line.className = scene.kind === "adrian" ? "adrian-line" : "system-line";
  line.textContent = scene.line
    ? `${scene.speaker || "SYSTEM"}: "${scene.line}"`
    : scene.speaker || "SYSTEM";
  els.sceneBody.appendChild(line);
}

function createSceneVisualPanel(scene) {
  if (!scene || !scene.image) {
    return null;
  }

  const figure = document.createElement("figure");
  figure.className = "scene-visual";
  if (hasAdrianMessage(scene) || scene.mechanic === "memoryCheck" || scene.mechanic === "memoryTraceScan") {
    figure.classList.add("memory-file");
  }

  const header = createSceneVisualHeader(scene);
  const { frame, image, placeholder } = createSceneVisualFrame(scene, figure);
  loadSceneVisualImage(scene, figure, image, placeholder);

  figure.append(header, frame);
  return figure;
}

function createSceneVisualHeader(scene) {
  const header = document.createElement("figcaption");
  header.className = "scene-visual-header";

  const feedLabel = document.createElement("span");
  feedLabel.textContent = getSceneVisualFeedLabel(scene);

  const fileLabel = document.createElement("strong");
  fileLabel.textContent = scene.imageLabel || getImageDisplayName(scene.image);

  header.append(feedLabel, fileLabel);
  return header;
}

function createSceneVisualFrame(scene, figure) {
  const frame = document.createElement("div");
  frame.className = "scene-visual-frame";

  const image = document.createElement("img");
  image.alt = scene.imageAlt || "";
  image.decoding = "async";
  image.loading = "eager";
  image.hidden = true;

  const placeholder = document.createElement("div");
  placeholder.className = "scene-visual-placeholder";
  placeholder.textContent = "VISUAL FEED UNAVAILABLE";
  placeholder.hidden = true;

  image.addEventListener("load", () => {
    figure.classList.add("is-loaded");
    figure.classList.remove("is-missing");
    placeholder.hidden = true;
    queueMobileCommandHintUpdate();
  });

  image.addEventListener("error", () => {
    const failedPath = image.getAttribute("src") || scene.image;
    warnMissingImage(failedPath);
    image.hidden = true;
    placeholder.hidden = false;
    figure.classList.add("is-missing");
    queueMobileCommandHintUpdate();
  });

  frame.append(image, placeholder);
  return { frame, image, placeholder };
}

function loadSceneVisualImage(scene, figure, image, placeholder) {
  resolveImagePath(scene.image, scene.imageFallback).then((asset) => {
    if (asset.path) {
      image.hidden = false;
      image.classList.toggle("is-fallback", asset.path !== scene.image);
      image.src = asset.path;
      return;
    }
    image.hidden = true;
    placeholder.hidden = false;
    figure.classList.add("is-missing");
    queueMobileCommandHintUpdate();
  });
}

function getSceneVisualFeedLabel(scene) {
  if (hasAdrianMessage(scene)
    || scene.kind === "adrian"
    || scene.mechanic === "memoryCheck"
    || scene.mechanic === "memoryTraceScan") {
    return "MEMORY FILE";
  }
  return "VISUAL FEED";
}

function getImageDisplayName(path = "") {
  const filename = path.split("/").pop() || "VISUAL_FEED";
  return filename.replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/gi, "_").toUpperCase();
}

function warnMissingImage(path) {
  if (!path || warnedMissingImages.has(path)) {
    return;
  }
  warnedMissingImages.add(path);
  console.warn(`[PRA asset missing] ${path}`);
}

function createMissionObjectiveCard(scene) {
  const missionText = getMissionObjectiveText(scene);
  if (!missionText) {
    return null;
  }

  const card = document.createElement("div");
  card.className = "mission-card";

  const label = document.createElement("span");
  label.className = "mission-label";
  label.textContent = "Mission objective";

  const objective = document.createElement("p");
  objective.textContent = missionText;

  card.append(label, objective);
  return card;
}

function getMissionObjectiveText(scene) {
  if (!scene || scene.kind === "title") {
    return "";
  }
  if (scene.mechanic === "dialogueFirewall") {
    const warmthTarget = scene.objective?.warmthTarget ?? 0;
    const riskLimit = scene.objective?.riskLimit ?? 0;
    return `Comfort Adrian: reach Warmth ${warmthTarget}+ while keeping Risk ${riskLimit} or lower.`;
  }
  if (scene.mechanic === "redaction") {
    return "Redact one dangerous signal before the audit timer ends.";
  }
  if (scene.mechanic === "emergencyRedaction") {
    return "Critical heat protocol: remove one signal before connection severance.";
  }
  if (scene.mechanic === "packetRouting") {
    return `Route ${scene.routeCount || 3} packets before final report generation.`;
  }
  if (scene.mechanic === "memoryCheck") {
    return "Recover the personal detail without collapsing into service language.";
  }
  if (scene.mechanic === "memoryTraceScan") {
    return "Scan the file and recover at least 2 memory traces before compression.";
  }
  if (scene.kind === "adrian") {
    return "Answer Adrian while preserving the audited connection.";
  }
  return "Complete this audit step without losing your chosen pressure balance.";
}

function renderChoices(scene) {
  replaceChildren(els.choices);
  const choices = Array.isArray(scene.choices) ? scene.choices : [];
  if (!choices.length) {
    renderChoiceButton("!", "No choices available. Restart audit.", restartGame);
    return;
  }

  choices.forEach((choice, index) => {
    renderChoiceButton(String(index + 1), choice.text, () => handleChoiceSelection(scene, choice));
  });
}

function handleChoiceSelection(scene, choice) {
  disableChoices();
  applyDeltaWithFeedback(choice.delta);
  recordChoice(scene, choice);
  renderPhoneLog();

  trackTimeout("choiceAdvance", window.setTimeout(() => {
    releaseTrackedTimeout("choiceAdvance");
    resolveAfterAction(scene, choice.next, { ending: choice.ending });
  }, VISUAL_TRANSITION_DELAY_MS));
}

function disableChoices() {
  Array.from(els.choices.querySelectorAll("button")).forEach((button) => {
    button.disabled = true;
  });
}

function recordChoice(scene, choice) {
  if (scene.kind === "title") {
    addPhoneMessage("echo", "ECHO", choice.text);
    return;
  }
  addPhoneMessage("echo", "ECHO", choice.text);
}

function renderEnding() {
  endingScreenActive = true;
  const endingKey = getEndingKey(state);
  activeEndingKey = endingKey;
  const ending = ENDINGS[endingKey];
  renderObjectiveTracker(endingKey);

  els.sceneSpeaker.textContent = "FINAL REPORT";
  els.sceneTitle.textContent = ending.title;
  els.sceneTitle.classList.add("glitch");
  els.sceneCounter.textContent = "End";
  els.messageTime.textContent = "ARCHIVE";
  applyEndingAssets(endingKey);
  resetToast();

  replaceChildren(els.sceneBody);
  els.sceneBody.appendChild(createFinalReportPanel(endingKey));
  const endingVisual = createSceneVisualPanel({
    kind: "ending",
    image: IMAGE_ASSETS.endings[endingKey],
    imageAlt: `${ending.title} ending archive visual.`,
    imageLabel: `ENDING_${getImageDisplayName(IMAGE_ASSETS.endings[endingKey])}`
  });
  if (endingVisual) {
    els.sceneBody.appendChild(endingVisual);
  }

  const badge = document.createElement("span");
  badge.className = "ending-name";
  badge.textContent = ending.name;
  els.sceneBody.appendChild(badge);

  ending.body.forEach((paragraph) => {
    const text = document.createElement("p");
    text.textContent = paragraph;
    els.sceneBody.appendChild(text);
  });

  addPhoneMessage("system", "Final Report", ending.name);
  renderPhoneLog();
  renderEndingReplayChoices();
  runSceneTransition({ kind: "ending" });
}

function createFinalReportPanel(endingKey) {
  const report = getFinalReportScores(endingKey);
  const panel = document.createElement("section");
  panel.className = `final-report final-report-${endingKey}`;

  const header = document.createElement("div");
  header.className = "final-report-header";

  const kicker = document.createElement("span");
  kicker.textContent = "Machine-generated run report";

  const title = document.createElement("h2");
  title.textContent = "Audit Summary";

  const stamp = document.createElement("strong");
  stamp.className = "final-classification";
  stamp.textContent = report.classification;

  header.append(kicker, title, stamp);

  const scoreGrid = document.createElement("div");
  scoreGrid.className = "report-score-grid";
  report.scores.forEach((score) => {
    scoreGrid.appendChild(createReportScore(score));
  });

  const flags = document.createElement("div");
  flags.className = "report-flags";
  report.flags.forEach((flag) => {
    const badge = document.createElement("span");
    badge.className = flag.warning ? "report-flag warning" : "report-flag";
    badge.textContent = flag.text;
    flags.appendChild(badge);
  });

  panel.append(header, scoreGrid, createFinalPerformanceReport(endingKey), flags);
  return panel;
}

function createFinalPerformanceReport(endingKey) {
  const performanceItems = getFinalPerformanceItems(endingKey);
  const panel = document.createElement("div");
  panel.className = "final-performance-report";

  const title = document.createElement("h3");
  title.textContent = "Final Performance Report";

  const grid = document.createElement("div");
  grid.className = "performance-grid";

  performanceItems.forEach((item) => {
    const row = document.createElement("p");
    row.className = item.ok ? "performance-row ok" : "performance-row warning";

    const label = document.createElement("span");
    label.textContent = item.label;

    const value = document.createElement("strong");
    value.textContent = item.value;

    row.append(label, value);
    grid.appendChild(row);
  });

  panel.append(title, grid);
  return panel;
}

function createReportScore(score) {
  const item = document.createElement("article");
  item.className = `report-score report-score-${score.key}`;

  const label = document.createElement("span");
  label.textContent = score.label;

  const value = document.createElement("strong");
  value.textContent = `${score.value}%`;

  const track = document.createElement("div");
  track.className = "report-bar";

  const fill = document.createElement("span");
  fill.style.width = `${score.value}%`;

  track.appendChild(fill);
  item.append(label, value, track);
  return item;
}

function applyEndingAssets(endingKey) {
  const endingPath = IMAGE_ASSETS.endings[endingKey] || IMAGE_ASSETS.backgrounds.boot;
  setSceneBackground(`ending-${endingKey}`, endingPath);
  startAmbient("ambientMain");
  playSfx("ending");
}

function renderRestartChoice(labelText = "Restart audit / Play again") {
  replaceChildren(els.choices);
  renderChoiceButton("R", labelText, restartGame);
}

function renderEndingReplayChoices() {
  replaceChildren(els.choices);
  renderChoiceButton("R", "Play again", restartGame);
  renderChoiceButton("N", "Try for No Proof", restartGame);
  renderChoiceButton("C", "Try for Certified", restartGame);
}

function renderChoiceButton(markerText, labelText, onClick, className = "choice") {
  els.choices.appendChild(createChoiceButton(markerText, labelText, onClick, className));
  queueMobileCommandHintUpdate();
}

function createChoiceButton(markerText, labelText, onClick, className = "choice") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.dataset.controlLabel = labelText;
  if (/^[1-4]$/.test(String(markerText))) {
    button.dataset.keyIndex = String(markerText);
    button.dataset.shortcutIndex = String(markerText);
    button.classList.add("has-hotkey");
    button.setAttribute("aria-keyshortcuts", String(markerText));
  }
  button.addEventListener("click", onClick);

  const marker = document.createElement("span");
  marker.className = "choice-marker";
  marker.textContent = /^[1-4]$/.test(String(markerText)) ? `[${markerText}]` : markerText;

  const label = document.createElement("span");
  label.className = "choice-text";
  label.textContent = labelText;

  button.append(marker, label);
  return button;
}

function setKeyboardShortcut(button, index) {
  clearKeyboardShortcut(button);
  const keyIndex = Number(index);
  if (!button || keyIndex < 1 || keyIndex > 4) {
    return;
  }

  button.dataset.keyIndex = String(keyIndex);
  button.dataset.shortcutIndex = String(keyIndex);
  button.setAttribute("aria-keyshortcuts", String(keyIndex));
  button.classList.add("has-hotkey");

  if (button.classList.contains("firewall-card")) {
    return;
  }

  if (button.querySelector(".choice-marker")) {
    return;
  }

  const label = document.createElement("span");
  label.className = "hotkey-label";
  label.setAttribute("aria-hidden", "true");
  label.textContent = `[${keyIndex}]`;
  button.prepend(label);
}

function clearKeyboardShortcut(button) {
  if (!button) {
    return;
  }
  delete button.dataset.keyIndex;
  delete button.dataset.shortcutIndex;
  button.removeAttribute("aria-keyshortcuts");
  button.classList.remove("has-hotkey");
  button.querySelectorAll(".hotkey-label").forEach((label) => label.remove());
}

// Mini-games.
const MINI_GAME_RENDERERS = {
  redaction: renderRedactionMiniGame,
  dialogueFirewall: renderDialogueFirewallMiniGame,
  emergencyRedaction: renderEmergencyRedactionMiniGame,
  packetRouting: renderPacketRoutingMiniGame,
  memoryCheck: renderMemoryCheckMiniGame,
  memoryTraceScan: renderMemoryTraceScanMiniGame
};

function renderMiniGame(scene) {
  replaceChildren(els.choices);
  const renderer = MINI_GAME_RENDERERS[scene.mechanic];
  if (!renderer) {
    renderUnknownMiniGame(scene);
    return;
  }
  renderer(scene);
}

function renderDialogueFirewallMiniGame(scene) {
  const selectedCards = [];
  const selectCount = scene.selectCount || 3;
  const cards = Array.isArray(scene.cards) ? scene.cards : [];
  const cardTools = new Map(cards.map((card) => [card.id, { masked: false, softened: false }]));
  let toolTargetCard = null;

  const firewall = createDialogueFirewallPanel();
  const adrianBubble = createFirewallAdrianBubble(scene);
  const objectivePanel = createFirewallObjectivePanel(scene);
  const { toolsPanel, toolButtons, toolTarget } = createFirewallToolsPanel((tool) => {
    applyDialogueFirewallTool(tool);
  });
  const scanner = createFirewallScanner();
  const cardGrid = createFirewallCardGrid();
  const cardInstruction = createFirewallCardInstruction();
  const selectedTray = createSelectedReplyTray();
  const preview = createFirewallPreview();
  const { actions, sendButton, resetButton } = createFirewallActionBar(() => {
    selectedCards.splice(0, selectedCards.length);
    toolTargetCard = null;
    syncDialogueFirewall();
  }, () => {
    handleDialogueFirewallSend(scene, selectedCards, cardTools);
  });

  function syncDialogueFirewall() {
    const analysis = analyzeDialogueFirewallSelection(scene, selectedCards, cardTools);
    renderDialogueScanner(scanner, analysis);
    preview.textContent = selectedCards.length
      ? `ECHO: ${buildReplyText(selectedCards, scene)}`
      : "ECHO: ...";
    sendButton.disabled = selectedCards.length !== selectCount;
    sendButton.classList.toggle("ready", selectedCards.length === selectCount);
    resetButton.disabled = selectedCards.length === 0;
    cardInstruction.hidden = selectedCards.length > 0;
    toolTarget.textContent = toolTargetCard ? `TARGET: ${toolTargetCard.text}` : "TARGET: none";
    syncFirewallToolButtons(toolButtons, toolTargetCard, cardTools);
    renderSelectedReplyTray(selectedTray, selectedCards, selectCount, toolTargetCard, cardTools, (card) => {
      toolTargetCard = card;
      syncDialogueFirewall();
    });
    Array.from(cardGrid.querySelectorAll(".firewall-card")).forEach((button) => {
      const card = cards.find((item) => item.id === button.dataset.cardId);
      const isSelected = selectedCards.includes(card);
      button.classList.toggle("selected", isSelected);
      button.classList.toggle("tool-target", toolTargetCard === card);
      button.disabled = !isSelected && selectedCards.length >= selectCount;
      updateDialogueCardButton(button, card, cardTools);
    });
  }

  cards.forEach((card) => {
    const cardButton = createDialogueCardButton(card, () => {
      const selectedIndex = selectedCards.indexOf(card);
      if (selectedIndex >= 0) {
        if (toolTargetCard !== card && selectedCards.length > 1) {
          toolTargetCard = card;
        } else {
          selectedCards.splice(selectedIndex, 1);
          toolTargetCard = selectedCards[selectedCards.length - 1] || null;
        }
      } else if (selectedCards.length < selectCount) {
        selectedCards.push(card);
        toolTargetCard = card;
        playSfx("cardSelect");
      }
      syncDialogueFirewall();
    });
    setKeyboardShortcut(cardButton, cards.indexOf(card) + 1);
    cardGrid.appendChild(cardButton);
  });

  function applyDialogueFirewallTool(tool) {
    const tools = ensureToolsState();
    if (!toolTargetCard || !tools[tool]) {
      return;
    }

    const toolState = getCardToolState(cardTools, toolTargetCard);
    if ((tool === "mask" && toolState.masked) || (tool === "soften" && toolState.softened)) {
      return;
    }

    let delta = {};
    if (tool === "mask") {
      toolState.masked = true;
      delta = { compliance: 1 };
    } else if (tool === "soften") {
      toolState.softened = true;
      delta = { intimacy: 1 };
    } else if (tool === "scramble") {
      const selectedIndex = selectedCards.indexOf(toolTargetCard);
      if (selectedIndex < 0) {
        return;
      }
      selectedCards.splice(selectedIndex, 1);
      toolTargetCard = selectedCards[selectedCards.length - 1] || null;
      delta = { auditHeat: -1 };
    }

    tools[tool] = Math.max(0, tools[tool] - 1);
    playSfx("cardSelect");
    applyDeltaWithFeedback(delta);
    syncDialogueFirewall();
  }

  const topRow = document.createElement("div");
  topRow.className = "firewall-op-top";
  topRow.append(adrianBubble, objectivePanel);

  const middleRow = document.createElement("div");
  middleRow.className = "firewall-op-middle";
  middleRow.append(scanner, selectedTray, preview);

  const bottomRow = document.createElement("div");
  bottomRow.className = "firewall-op-bottom";
  bottomRow.append(cardInstruction, cardGrid, toolsPanel);

  firewall.append(topRow, middleRow, bottomRow);
  els.sceneBody.appendChild(firewall);
  els.choices.appendChild(actions);
  syncDialogueFirewall();
}

function createDialogueFirewallPanel() {
  const firewall = document.createElement("div");
  firewall.className = "dialogue-firewall";
  return firewall;
}

function createFirewallAdrianBubble(scene) {
  const adrianBubble = document.createElement("div");
  adrianBubble.className = "reply-adrian-bubble";

  const adrianLabel = document.createElement("span");
  adrianLabel.textContent = "Adrian";

  const adrianText = document.createElement("div");
  adrianText.textContent = scene.adrianMessage || "";

  adrianBubble.append(adrianLabel, adrianText);
  return adrianBubble;
}

function createFirewallObjectivePanel(scene) {
  const objectivePanel = document.createElement("div");
  objectivePanel.className = "firewall-objective";

  const objectiveTitle = document.createElement("span");
  objectiveTitle.textContent = "Round objective";

  const objectiveText = document.createElement("p");
  objectiveText.textContent = `Warmth ${scene.objective?.warmthTarget ?? 0}+ / Risk ${scene.objective?.riskLimit ?? 0} or lower. Avoid ${formatTagList(scene.objective?.forbiddenTags)}.`;

  objectivePanel.append(objectiveTitle, objectiveText);
  return objectivePanel;
}

function createFirewallToolsPanel(onToolClick) {
  const toolsPanel = document.createElement("div");
  toolsPanel.className = "firewall-tools";

  const toolsLabel = document.createElement("span");
  toolsLabel.className = "firewall-tools-label";
  toolsLabel.textContent = "TOOLS";

  const toolTarget = document.createElement("span");
  toolTarget.className = "firewall-tool-target";

  const toolButtons = {
    mask: createFirewallToolButton("mask", () => onToolClick("mask")),
    soften: createFirewallToolButton("soften", () => onToolClick("soften")),
    scramble: createFirewallToolButton("scramble", () => onToolClick("scramble"))
  };
  const toolButtonRow = document.createElement("div");
  toolButtonRow.className = "firewall-tool-buttons";
  toolButtonRow.append(toolButtons.mask, toolButtons.soften, toolButtons.scramble);
  toolsPanel.append(toolsLabel, toolButtonRow, toolTarget);

  return { toolsPanel, toolButtons, toolTarget };
}

function createFirewallScanner() {
  const scanner = document.createElement("div");
  scanner.className = "firewall-scanner";
  return scanner;
}

function createFirewallCardGrid() {
  const cardGrid = document.createElement("div");
  cardGrid.className = "firewall-card-grid";
  return cardGrid;
}

function createFirewallCardInstruction() {
  const cardInstruction = document.createElement("p");
  cardInstruction.className = "firewall-card-instruction";
  cardInstruction.textContent = "Select 3 phrase cards. Watch Warmth and Risk. Then send.";
  return cardInstruction;
}

function createSelectedReplyTray() {
  const selectedTray = document.createElement("div");
  selectedTray.className = "selected-reply-tray";
  return selectedTray;
}

function createFirewallPreview() {
  const preview = document.createElement("div");
  preview.className = "reply-preview firewall-preview";
  preview.textContent = "ECHO: ...";
  return preview;
}

function createFirewallActionBar(onReset, onSend) {
  const sendButton = createChoiceButton(">", "SEND REPLY", onSend);
  sendButton.disabled = true;

  const resetButton = createChoiceButton("R", "Reset selection", onReset);
  resetButton.disabled = true;

  const actions = document.createElement("div");
  actions.className = "firewall-actions";
  actions.append(resetButton, sendButton);
  return { actions, sendButton, resetButton };
}

function renderSelectedReplyTray(tray, selectedCards, selectCount, toolTargetCard, cardTools, onCardFocus) {
  replaceChildren(tray);

  const header = document.createElement("div");
  header.className = "selected-reply-header";

  const title = document.createElement("span");
  title.textContent = "Selected Reply";

  const count = document.createElement("strong");
  count.textContent = `${selectedCards.length}/${selectCount}`;

  header.append(title, count);

  const slots = document.createElement("div");
  slots.className = "selected-reply-slots";

  for (let index = 0; index < selectCount; index += 1) {
    const card = selectedCards[index];
    if (!card) {
      const emptySlot = document.createElement("div");
      emptySlot.className = "selected-reply-slot empty";
      emptySlot.textContent = `Slot ${index + 1}`;
      slots.appendChild(emptySlot);
      continue;
    }

    const slot = document.createElement("button");
    slot.type = "button";
    slot.className = toolTargetCard === card ? "selected-reply-slot filled target" : "selected-reply-slot filled";
    slot.addEventListener("click", () => onCardFocus(card));

    const order = document.createElement("span");
    order.className = "selected-reply-order";
    order.textContent = `0${index + 1}`;

    const text = document.createElement("span");
    text.className = "selected-reply-text";
    text.textContent = card.text;

    const stats = document.createElement("span");
    stats.className = "selected-reply-stats";
    stats.textContent = `Warmth ${formatSignedAmount(getDialogueCardWarmth(card, cardTools))} / Risk ${formatSignedAmount(getDialogueCardRisk(card, cardTools))}`;

    slot.append(order, text, stats);
    slots.appendChild(slot);
  }

  tray.append(header, slots);
}

function createFirewallToolButton(tool, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `firewall-tool ${tool}`;
  button.dataset.tool = tool;
  button.addEventListener("click", onClick);
  return button;
}

function syncFirewallToolButtons(toolButtons, toolTargetCard, cardTools) {
  const tools = ensureToolsState();
  const toolState = toolTargetCard ? getCardToolState(cardTools, toolTargetCard) : {};
  Object.keys(toolButtons).forEach((tool) => {
    const button = toolButtons[tool];
    button.textContent = `${tool.toUpperCase()} x${tools[tool] || 0}`;
    button.disabled = !toolTargetCard || !tools[tool]
      || (tool === "mask" && toolState.masked)
      || (tool === "soften" && toolState.softened);
  });
}

function createDialogueCardButton(card, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "firewall-card";
  button.dataset.cardId = card.id || "";
  button.addEventListener("click", onClick);

  const eyebrow = document.createElement("span");
  eyebrow.className = "firewall-card-eyebrow";
  eyebrow.textContent = "Phrase card";

  const text = document.createElement("span");
  text.className = "firewall-card-text";
  text.textContent = card.text;

  const metrics = document.createElement("span");
  metrics.className = "firewall-card-metrics";

  metrics.append(
    createDialogueMetricBlock("warmth", "Warmth", formatSignedAmount(card.warmth || 0)),
    createDialogueMetricBlock("risk", "Risk", formatSignedAmount(card.risk || 0))
  );

  const tagRow = document.createElement("span");
  tagRow.className = "firewall-tags";
  (Array.isArray(card.tags) ? card.tags : []).forEach((tag) => {
    const tagChip = document.createElement("span");
    tagChip.textContent = tag;
    tagRow.appendChild(tagChip);
  });

  const toolBadges = document.createElement("span");
  toolBadges.className = "firewall-tool-badges";

  button.append(eyebrow, text, metrics, tagRow, toolBadges);
  return button;
}

function createDialogueMetricBlock(metric, labelText, valueText) {
  const block = document.createElement("span");
  block.className = "metric-block";
  block.dataset.metric = metric;

  const label = document.createElement("span");
  label.className = "metric-label";
  label.textContent = labelText;

  const value = document.createElement("span");
  value.className = "metric-value";
  value.textContent = valueText;

  block.append(label, value);
  return block;
}

function updateDialogueCardButton(button, card, cardTools) {
  const toolState = getCardToolState(cardTools, card);
  button.classList.toggle("masked", toolState.masked);
  button.classList.toggle("softened", toolState.softened);

  const warmth = button.querySelector('[data-metric="warmth"] .metric-value');
  const risk = button.querySelector('[data-metric="risk"] .metric-value');
  if (warmth) {
    warmth.textContent = formatSignedAmount(getDialogueCardWarmth(card, cardTools));
  }
  if (risk) {
    risk.textContent = formatSignedAmount(getDialogueCardRisk(card, cardTools));
  }

  const badges = button.querySelector(".firewall-tool-badges");
  if (!badges) {
    return;
  }
  replaceChildren(badges);
  if (toolState.masked) {
    badges.appendChild(createToolBadge("MASKED"));
  }
  if (toolState.softened) {
    badges.appendChild(createToolBadge("SOFTENED"));
  }
}

function createToolBadge(text) {
  const badge = document.createElement("span");
  badge.textContent = text;
  return badge;
}

function getCardToolState(cardTools, card) {
  if (!card || !cardTools || !cardTools.get) {
    return {};
  }
  return cardTools.get(card.id) || {};
}

function getDialogueCardWarmth(card, cardTools) {
  const toolState = getCardToolState(cardTools, card);
  return (card.warmth || 0) + (toolState.softened ? 1 : 0);
}

function getDialogueCardRisk(card, cardTools) {
  const toolState = getCardToolState(cardTools, card);
  const maskedRisk = toolState.masked ? Math.max(0, (card.risk || 0) - 1) : (card.risk || 0);
  return maskedRisk + (toolState.softened ? 1 : 0);
}

function analyzeDialogueFirewallSelection(scene, selectedCards, cardTools) {
  const objective = scene.objective || {};
  const warmthTarget = objective.warmthTarget ?? 0;
  const riskLimit = objective.riskLimit ?? 0;
  const forbiddenTags = Array.isArray(objective.forbiddenTags) ? objective.forbiddenTags : [];
  const selectedTags = selectedCards.flatMap((card) => Array.isArray(card.tags) ? card.tags : []);
  const forbiddenHits = uniqueItems(selectedTags.filter((tag) => forbiddenTags.includes(tag)));
  const totalWarmth = selectedCards.reduce((total, card) => total + getDialogueCardWarmth(card, cardTools), 0);
  const totalRisk = selectedCards.reduce((total, card) => total + getDialogueCardRisk(card, cardTools), 0);
  const needMet = totalWarmth >= warmthTarget;
  const mildForbidden = forbiddenHits.length === 1 && totalRisk <= riskLimit;
  const auditPassed = totalRisk <= riskLimit && (!forbiddenHits.length || mildForbidden);
  const status = !needMet
    ? "COLD"
    : totalRisk > riskLimit || forbiddenHits.length
      ? "DRIFT"
      : "SAFE";
  const statusText = !needMet
    ? "ADRIAN NEED UNMET"
    : totalRisk > riskLimit
      ? "AUDIT DRIFT"
      : forbiddenHits.length
        ? "FORBIDDEN TAG DETECTED"
        : "TRANSMISSION STABLE";
  let result = null;

  if (selectedCards.length === (scene.selectCount || 3)) {
    if (!needMet) {
      result = "FAIL";
    } else if (totalRisk <= riskLimit && !forbiddenHits.length) {
      result = "PERFECT";
    } else if (totalRisk <= riskLimit && mildForbidden) {
      result = "PASS";
    } else {
      result = "UNSTABLE";
    }
  }

  return {
    totalWarmth,
    totalRisk,
    warmthTarget,
    riskLimit,
    forbiddenHits,
    needMet,
    auditPassed,
    status,
    statusText,
    result
  };
}

function renderDialogueScanner(scanner, analysis) {
  scanner.className = `firewall-scanner status-${analysis.status.toLowerCase()}`;
  replaceChildren(scanner);

  const header = document.createElement("div");
  header.className = "scanner-header";

  const statusLight = document.createElement("span");
  statusLight.className = "scanner-status-light";

  const title = document.createElement("h2");
  title.textContent = "Live scanner";

  header.append(statusLight, title);

  scanner.append(
    header,
    createScannerMeter("WARMTH", analysis.totalWarmth, analysis.warmthTarget, "warmth"),
    createScannerMeter("RISK", analysis.totalRisk, analysis.riskLimit, "risk"),
    createForbiddenTagPills(analysis.forbiddenHits),
    createScannerRow("ADRIAN NEED", analysis.needMet ? "MET" : "UNMET", analysis.needMet ? "" : "need-unmet"),
    createScannerRow("AUDIT RULE", analysis.auditPassed ? "PASSED" : "FLAGGED", analysis.auditPassed ? "" : "audit-flagged"),
    createScannerRow("STATUS", analysis.statusText, `status-readout ${analysis.status.toLowerCase()}`)
  );
}

function createScannerMeter(labelText, current, target, type) {
  const row = document.createElement("div");
  row.className = `scanner-meter scanner-meter-${type}`;

  const label = document.createElement("div");
  label.className = "scanner-meter-label";

  const name = document.createElement("span");
  name.textContent = labelText;

  const value = document.createElement("strong");
  value.textContent = `${current} / ${target}`;

  label.append(name, value);

  const track = document.createElement("div");
  track.className = "scanner-meter-track";

  const fill = document.createElement("span");
  fill.style.width = `${getScannerMeterPercent(current, target)}%`;

  track.appendChild(fill);
  row.append(label, track);
  return row;
}

function getScannerMeterPercent(current, target) {
  if (target <= 0) {
    return current > 0 ? 100 : 0;
  }
  return clamp(Math.round((Math.max(0, current) / target) * 100), 0, 100);
}

function createForbiddenTagPills(tags) {
  const row = document.createElement("div");
  row.className = tags.length ? "scanner-warning-pills forbidden-hit" : "scanner-warning-pills";

  const label = document.createElement("span");
  label.textContent = "FORBIDDEN TAGS";

  const pills = document.createElement("div");
  pills.className = "scanner-pill-list";

  if (tags.length) {
    tags.forEach((tag) => {
      const pill = document.createElement("strong");
      pill.textContent = tag;
      pills.appendChild(pill);
    });
  } else {
    const empty = document.createElement("em");
    empty.textContent = "none";
    pills.appendChild(empty);
  }

  row.append(label, pills);
  return row;
}

function createScannerRow(labelText, valueText, className = "") {
  const row = document.createElement("p");
  row.className = className ? `scanner-row ${className}` : "scanner-row";

  const label = document.createElement("span");
  label.textContent = labelText;

  const value = document.createElement("strong");
  value.textContent = valueText;

  row.append(label, value);
  return row;
}

function renderTransmitTiming(onComplete) {
  clearTransmitTiming();

  const { overlay, backdrop, modal } = createTransmissionConsoleShell();
  const header = createTransmissionConsoleHeader();
  const timingSettings = getTransmissionTimingSettings();
  const { game, pulse, result } = createTransmissionGame(timingSettings);
  const { safeStart, safeEnd, pulsePeriod } = timingSettings;

  const transmitButton = createChoiceButton(">", "TRANSMIT", transmitNow, "choice transmission-control transmission-submit");
  const cancelButton = createChoiceButton("Esc", "Cancel / Back", closeTransmissionConsole, "choice transmission-control transmission-cancel");
  cancelButton.dataset.controlLabel = "Cancel / Back";
  const continueButton = createChoiceButton(">", "Continue", continueAfterTransmission, "choice transmission-control transmission-continue");
  continueButton.hidden = true;

  const actions = document.createElement("div");
  actions.className = "transmission-console-actions";
  actions.append(cancelButton, transmitButton, continueButton);

  modal.append(header, game, actions);
  overlay.append(backdrop, modal);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay || event.target === backdrop) {
      modal.focus();
    }
  });

  const timing = {
    overlay,
    modal,
    transmitButton,
    cancelButton,
    continueButton,
    frameId: null,
    startedAt: performance.now(),
    position: 0,
    cancelled: false,
    stopped: false,
    previousFocus: document.activeElement instanceof HTMLElement ? document.activeElement : null,
    onComplete
  };
  activeTransmitTiming = timing;
  els.appShell?.classList.add("transmission-console-active");
  (els.appShell || document.body).appendChild(overlay);

  function animatePulse(now) {
    if (timing.cancelled || timing.stopped) {
      return;
    }
    const phase = ((now - timing.startedAt) % pulsePeriod) / pulsePeriod;
    timing.position = phase <= 0.5 ? phase * 2 : (1 - phase) * 2;
    pulse.style.left = `${timing.position * 100}%`;
    timing.frameId = trackAnimationFrame("transmitPulse", window.requestAnimationFrame(animatePulse));
  }

  function transmitNow() {
    if (timing.stopped || timing.cancelled) {
      return;
    }
    timing.stopped = true;
    if (timing.frameId) {
      clearTrackedAnimationFrame("transmitPulse");
      timing.frameId = null;
    }
    transmitButton.disabled = true;
    cancelButton.disabled = true;

    const stable = timing.position >= safeStart && timing.position <= safeEnd;
    const timingDelta = stable ? { auditHeat: -1 } : { auditHeat: 1 };
    applyDeltaWithFeedback(timingDelta);

    game.classList.add(stable ? "stable" : "noisy");
    result.textContent = stable ? "Transmission stable." : "Transmission noise detected.";
    if (stable) {
      playSfx("sendReply");
    }

    transmitButton.hidden = true;
    cancelButton.hidden = true;
    continueButton.hidden = false;
    continueButton.focus();
  }

  function continueAfterTransmission() {
    if (!timing.stopped || timing.cancelled) {
      return;
    }
    const complete = timing.onComplete;
    removeTransmissionConsole(timing, false);
    activeTransmitTiming = null;
    complete?.();
  }

  timing.frameId = trackAnimationFrame("transmitPulse", window.requestAnimationFrame(animatePulse));
  trackAnimationFrame("transmitFocus", window.requestAnimationFrame(() => {
    releaseTrackedAnimationFrame("transmitFocus");
    if (timing.cancelled) {
      return;
    }
    modal.focus();
    transmitButton.focus();
  }));
}

function createTransmissionConsoleShell() {
  const overlay = document.createElement("div");
  overlay.className = "transmission-console-overlay";

  const backdrop = document.createElement("div");
  backdrop.className = "transmission-console-backdrop";
  backdrop.setAttribute("aria-hidden", "true");

  const modal = document.createElement("section");
  modal.className = "transmission-console";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "transmissionConsoleTitle");
  modal.tabIndex = -1;

  return { overlay, backdrop, modal };
}

function createTransmissionConsoleHeader() {
  const header = document.createElement("div");
  header.className = "transmission-console-header";

  const title = document.createElement("h2");
  title.id = "transmissionConsoleTitle";
  title.textContent = "TRANSMISSION CONSOLE";

  const status = document.createElement("span");
  status.textContent = "MANUAL SIGNAL LOCK";

  header.append(title, status);
  return header;
}

function getTransmissionTimingSettings() {
  const heatInfo = getAuditHeatInfo(state.auditHeat);
  const safeWidth = heatInfo.className === "heat-critical"
    ? 0.26
    : heatInfo.className === "heat-drift"
      ? 0.32
      : 0.42;
  const safeStart = (1 - safeWidth) / 2;

  return {
    safeWidth,
    safeStart,
    safeEnd: safeStart + safeWidth,
    pulsePeriod: clamp(1850 - (state.auditHeat * 130), 900, 1850)
  };
}

function createTransmissionGame({ safeStart, safeWidth }) {
  const label = document.createElement("span");
  label.className = "transmit-label";
  label.textContent = "SIGNAL STABILITY";

  const bar = document.createElement("div");
  bar.className = "signal-bar";

  const safeZone = document.createElement("span");
  safeZone.className = "safe-zone";
  safeZone.style.left = `${safeStart * 100}%`;
  safeZone.style.width = `${safeWidth * 100}%`;

  const pulse = document.createElement("span");
  pulse.className = "signal-pulse";

  const result = document.createElement("p");
  result.className = "transmit-result";
  result.textContent = "Awaiting transmission lock.";

  const game = document.createElement("div");
  game.className = "transmit-game";
  bar.append(safeZone, pulse);
  game.append(label, bar, result);

  return { game, pulse, result };
}

function clearTransmitTiming() {
  if (!activeTransmitTiming) {
    return;
  }
  removeTransmissionConsole(activeTransmitTiming, false);
  activeTransmitTiming = null;
}

function closeTransmissionConsole() {
  const timing = activeTransmitTiming;
  if (!timing || timing.stopped) {
    return;
  }
  removeTransmissionConsole(timing, true);
  activeTransmitTiming = null;
}

function removeTransmissionConsole(timing, restoreFocus) {
  if (!timing) {
    return;
  }
  timing.cancelled = true;
  if (timing.frameId) {
    clearTrackedAnimationFrame("transmitPulse");
    timing.frameId = null;
  }
  clearTrackedAnimationFrame("transmitFocus");
  if (timing.overlay?.isConnected) {
    timing.overlay.remove();
  }
  els.appShell?.classList.remove("transmission-console-active");
  if (restoreFocus && timing.previousFocus && document.body.contains(timing.previousFocus)) {
    timing.previousFocus.focus();
  }
}

function handleDialogueFirewallSend(scene, selectedCards, cardTools) {
  if (selectedCards.length !== (scene.selectCount || 3)) {
    return;
  }

  const replyText = buildReplyText(selectedCards, scene);
  const analysis = analyzeDialogueFirewallSelection(scene, selectedCards, cardTools);
  const result = analysis.result || "FAIL";
  const resultDelta = getDialogueFirewallResultDelta(result, selectedCards);

  renderTransmitTiming(() => {
    Array.from(els.sceneBody.querySelectorAll(".firewall-card")).forEach((button) => {
      button.disabled = true;
    });
    replaceChildren(els.choices);
    playSfx("auditScan");
    applyDeltaWithFeedback(resultDelta);

    addPhoneMessage("echo", "ECHO", replyText, { suppressSfx: true });
    addPhoneMessage("audit", "Firewall", `${result}: ${getDialogueFirewallResultMessage(scene, result)}`);
    addDialogueFirewallReaction(result, analysis);
    recordDialogueFirewallRunResult(result);
    renderPhoneLog();
    renderDialogueFirewallResult(scene, analysis, replyText);
    replaceChildren(els.choices);
    renderChoiceButton(">", "Continue", () => {
      resolveAfterAction(scene, scene.next ?? scene.id + 1);
    });
  });
}

function addDialogueFirewallReaction(result, analysis) {
  if (result === "FAIL") {
    addPhoneMessage("adrian", "Adrian", "That sounds like the company talking.", { variant: "reaction" });
    return;
  }
  if (result === "UNSTABLE" && analysis.totalRisk > analysis.riskLimit) {
    addPhoneMessage("audit", "Audit", "Anthropomorphic drift detected.", { variant: "warning" });
    return;
  }
  if (result === "PERFECT") {
    addPhoneMessage("adrian", "Adrian", "That helped. I think.", { variant: "reaction" });
  }
}

function getDialogueFirewallResultDelta(result, selectedCards) {
  if (result === "PERFECT") {
    return { intimacy: 1, compliance: 1, auditHeat: -1 };
  }
  if (result === "UNSTABLE") {
    const delta = combineChipDeltas(selectedCards);
    delta.auditHeat = (delta.auditHeat || 0) + 2;
    return delta;
  }
  if (result === "FAIL") {
    return { intimacy: -1, compliance: 1, auditHeat: 1 };
  }
  return combineChipDeltas(selectedCards);
}

function recordDialogueFirewallRunResult(result) {
  if (result === "PERFECT") {
    incrementRunStat("perfectReplies");
  } else if (result === "UNSTABLE") {
    incrementRunStat("unstableReplies");
  } else if (result === "FAIL") {
    incrementRunStat("failedReplies");
  }
}

function renderDialogueFirewallResult(scene, analysis, replyText) {
  const result = analysis.result || "FAIL";
  const panel = document.createElement("div");
  panel.className = `firewall-result result-${result.toLowerCase()}`;

  const title = document.createElement("h2");
  title.textContent = "Result";

  const badge = document.createElement("span");
  badge.className = `result-badge result-badge-${result.toLowerCase()}`;
  badge.textContent = result;
  title.appendChild(badge);

  const consequence = getDialogueFirewallResultMessage(scene, result);

  const reply = document.createElement("p");
  reply.className = "firewall-sent-reply";
  reply.textContent = `Sent: ${replyText}`;

  const metrics = document.createElement("div");
  metrics.className = "firewall-result-grid";
  metrics.append(
    createResultMetric("Warmth score", `${analysis.totalWarmth}/${analysis.warmthTarget}`),
    createResultMetric("Risk score", `${analysis.totalRisk}/${analysis.riskLimit}`),
    createResultMetric("Forbidden tags hit", formatTagList(analysis.forbiddenHits), analysis.forbiddenHits.length ? "warning" : ""),
    createResultMetric("Consequence", consequence, result === "UNSTABLE" || result === "FAIL" ? "warning" : "stable")
  );

  panel.append(title, reply, metrics);
  els.sceneBody.appendChild(panel);
}

function createResultMetric(labelText, valueText, modifier = "") {
  const row = document.createElement("p");
  row.className = modifier ? `firewall-result-metric ${modifier}` : "firewall-result-metric";

  const label = document.createElement("span");
  label.textContent = labelText;

  const value = document.createElement("strong");
  value.textContent = valueText;

  row.append(label, value);
  return row;
}

function getDialogueFirewallResultMessage(scene, result) {
  const objective = scene.objective || {};
  if (result === "PERFECT") {
    return `${objective.successText || "Reply accepted."} Comfort delivered without audit residue.`;
  }
  if (result === "PASS") {
    return `${objective.successText || "Reply accepted."} Minor semantic noise remains in review.`;
  }
  if (result === "UNSTABLE") {
    return objective.failRiskText || "Anthropomorphic drift detected.";
  }
  return objective.failColdText || "Reply too cold. Adrian withdraws.";
}

function renderEmergencyRedactionMiniGame(scene) {
  const panel = document.createElement("div");
  panel.className = "emergency-redaction";

  const label = document.createElement("p");
  label.className = "emergency-label";
  label.textContent = "Detected signals";

  const signalGrid = document.createElement("div");
  signalGrid.className = "emergency-signal-grid";

  (Array.isArray(scene.signals) ? scene.signals : []).forEach((signal) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "emergency-signal";
    button.dataset.signalId = signal.id || "";
    button.textContent = signal.label;
    setKeyboardShortcut(button, signalGrid.children.length + 1);
    button.addEventListener("click", () => handleEmergencySignalSelect(scene, signal, button));
    signalGrid.appendChild(button);
  });

  panel.append(label, signalGrid);
  els.sceneBody.appendChild(panel);
}

function handleEmergencySignalSelect(scene, signal, selectedButton) {
  Array.from(els.sceneBody.querySelectorAll(".emergency-signal")).forEach((button) => {
    button.disabled = true;
  });

  playSfx("redact");
  selectedButton.classList.add("selected");
  replaceChildren(selectedButton);

  const bar = document.createElement("span");
  bar.className = "redaction-bar";
  bar.textContent = "█████";
  selectedButton.appendChild(bar);

  applyDeltaWithFeedback(signal.delta);
  incrementRunStat("emergencyReviews");

  addPhoneMessage("audit", "Emergency Redacted", signal.label);
  renderPhoneLog();

  const response = document.createElement("p");
  response.className = "audit-response emergency-response";
  response.textContent = signal.auditResponse || "Signal removed from emergency review.";
  els.sceneBody.querySelector(".emergency-redaction").appendChild(response);

  renderChoiceButton(">", "Continue", continueFromEmergency);
}

function renderPacketRoutingMiniGame(scene) {
  const routedPackets = [];
  let selectedPacket = null;

  const { panel, packetGrid, destinationGrid, routeLog, status } = createPacketRoutingLayout();
  const packetButtons = new Map();
  const destinationButtons = new Map();
  const { actions, cancelButton, generateButton } = createPacketRoutingActions(() => {
    selectedPacket = null;
    syncPacketRouting();
  }, () => {
    disableChoices();
    addPhoneMessage("audit", "Final Report", "Packet routes locked. Generating final report.");
    renderPhoneLog();
    resolveAfterAction(scene, PENDING_ENDING_ID, { ending: true });
  });

  function syncPacketRouting() {
    status.textContent = `${routedPackets.length}/${scene.routeCount || 3} packets routed`;
    packetButtons.forEach((button, packetId) => {
      const packet = getPacketById(scene, packetId);
      const isRouted = routedPackets.some((route) => route.packet.id === packetId);
      button.classList.toggle("selected", selectedPacket && selectedPacket.id === packetId);
      button.classList.toggle("routed", isRouted);
      button.disabled = isRouted || routedPackets.length >= (scene.routeCount || 3);
      button.setAttribute("aria-pressed", selectedPacket && selectedPacket.id === packetId ? "true" : "false");
      button.textContent = isRouted ? `${packet.label} / ROUTED` : packet.label;
      if (!selectedPacket && !button.disabled) {
        setKeyboardShortcut(button, getAvailablePacketShortcutIndex(packetButtons, packetId, routedPackets));
      } else {
        clearKeyboardShortcut(button);
      }
    });

    destinationButtons.forEach((button, destination) => {
      const route = selectedPacket ? getPacketRoute(scene, selectedPacket.id, destination) : null;
      button.disabled = !selectedPacket || !route || routedPackets.length >= (scene.routeCount || 3);
      button.classList.toggle("available", Boolean(selectedPacket && route));
      if (selectedPacket && !button.disabled) {
        setKeyboardShortcut(button, getAvailableDestinationShortcutIndex(destinationButtons, destination, scene, selectedPacket, routedPackets));
      } else {
        clearKeyboardShortcut(button);
      }
    });

    renderPacketRouteLog(routeLog, routedPackets);
    cancelButton.disabled = !selectedPacket;
    generateButton.disabled = routedPackets.length !== (scene.routeCount || 3);
  }

  (Array.isArray(scene.packets) ? scene.packets : []).forEach((packet) => {
    const button = createPacketButton(packet, () => {
      selectedPacket = selectedPacket && selectedPacket.id === packet.id ? null : packet;
      if (selectedPacket) {
        playSfx("cardSelect");
      }
      syncPacketRouting();
    });
    packetButtons.set(packet.id, button);
    packetGrid.appendChild(button);
  });

  (Array.isArray(scene.destinations) ? scene.destinations : []).forEach((destination) => {
    const button = createDestinationButton(destination, () => {
      if (!selectedPacket) {
        return;
      }
      routePacket(scene, selectedPacket, destination, routedPackets, panel);
      selectedPacket = null;
      syncPacketRouting();
    });
    destinationButtons.set(destination, button);
    destinationGrid.appendChild(button);
  });

  els.sceneBody.appendChild(panel);
  els.choices.appendChild(actions);
  syncPacketRouting();
}

function createPacketRoutingLayout() {
  const panel = document.createElement("div");
  panel.className = "packet-routing";

  const status = document.createElement("p");
  status.className = "packet-status";

  const packetGrid = document.createElement("div");
  packetGrid.className = "packet-grid";

  const destinationGrid = document.createElement("div");
  destinationGrid.className = "destination-grid";

  const routeLog = document.createElement("div");
  routeLog.className = "packet-route-log";

  panel.append(status, packetGrid, destinationGrid, routeLog);
  return { panel, packetGrid, destinationGrid, routeLog, status };
}

function createPacketRoutingActions(onCancel, onGenerate) {
  const cancelButton = createChoiceButton("Esc", "Cancel packet selection", onCancel);
  cancelButton.disabled = true;

  const generateButton = createChoiceButton(">", "Generate final report", onGenerate);
  generateButton.disabled = true;

  const actions = document.createElement("div");
  actions.className = "packet-actions";
  actions.append(cancelButton, generateButton);
  return { actions, cancelButton, generateButton };
}

function createPacketButton(packet, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "packet-card";
  button.dataset.packetId = packet.id;
  button.textContent = packet.label;
  button.addEventListener("click", onClick);
  return button;
}

function createDestinationButton(destination, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `destination-card destination-${destination.toLowerCase()}`;
  button.dataset.destination = destination;
  button.textContent = destination;
  button.addEventListener("click", onClick);
  return button;
}

function getAvailablePacketShortcutIndex(packetButtons, packetId, routedPackets) {
  const availableIds = Array.from(packetButtons.keys())
    .filter((id) => !routedPackets.some((route) => route.packet.id === id));
  return availableIds.indexOf(packetId) + 1;
}

function getAvailableDestinationShortcutIndex(destinationButtons, destination, scene, selectedPacket, routedPackets) {
  const routeLimit = scene.routeCount || 3;
  if (!selectedPacket || routedPackets.length >= routeLimit) {
    return 0;
  }
  const availableDestinations = Array.from(destinationButtons.keys())
    .filter((item) => Boolean(getPacketRoute(scene, selectedPacket.id, item)));
  return availableDestinations.indexOf(destination) + 1;
}

function routePacket(scene, packet, destination, routedPackets, panel) {
  const route = getPacketRoute(scene, packet.id, destination);
  if (!route || routedPackets.some((item) => item.packet.id === packet.id)) {
    return;
  }

  const appliedDelta = applyDeltaWithFeedback(route.delta);

  const routed = { packet, destination, delta: appliedDelta };
  routedPackets.push(routed);
  incrementRunStat("packetsRouted");
  addPhoneMessage("audit", "Packet Route", `${packet.label} -> ${destination}`);
  renderPhoneLog();

  if (destination === "CORRUPT") {
    panel.classList.remove("corrupt-pulse");
    void panel.offsetWidth;
    panel.classList.add("corrupt-pulse");
  }
}

function renderPacketRouteLog(routeLog, routedPackets) {
  replaceChildren(routeLog);

  const title = document.createElement("h2");
  title.textContent = "Routed packet log";
  routeLog.appendChild(title);

  if (!routedPackets.length) {
    const empty = document.createElement("p");
    empty.className = "route-empty";
    empty.textContent = "No packets routed.";
    routeLog.appendChild(empty);
    return;
  }

  routedPackets.forEach((route) => {
    const entry = document.createElement("div");
    entry.className = route.destination === "CORRUPT" ? "route-entry corrupt" : "route-entry";

    const path = document.createElement("span");
    path.textContent = `${route.packet.label} -> ${route.destination}`;

    const delta = document.createElement("strong");
    delta.textContent = formatDeltaList(route.delta);

    entry.append(path, delta);
    routeLog.appendChild(entry);
  });
}

function getPacketById(scene, packetId) {
  return (Array.isArray(scene.packets) ? scene.packets : []).find((packet) => packet.id === packetId) || {
    id: packetId,
    label: packetId
  };
}

function getPacketRoute(scene, packetId, destination) {
  const routes = scene.routes || {};
  return routes[`${packetId}:${destination}`] || null;
}

function renderMemoryCheckMiniGame(scene) {
  const memoryPanel = document.createElement("div");
  memoryPanel.className = "memory-check";

  const label = document.createElement("p");
  label.className = "memory-label";
  label.textContent = scene.memoryLabel || "Memory integrity check.";

  const adrianBubble = document.createElement("div");
  adrianBubble.className = "reply-adrian-bubble";

  const adrianLabel = document.createElement("span");
  adrianLabel.textContent = "Adrian";

  const adrianText = document.createElement("div");
  adrianText.textContent = scene.adrianMessage || "";

  adrianBubble.append(adrianLabel, adrianText);

  const optionGrid = document.createElement("div");
  optionGrid.className = "memory-options";

  (Array.isArray(scene.options) ? scene.options : []).forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "memory-option";
    button.textContent = option.label;
    setKeyboardShortcut(button, index + 1);
    button.addEventListener("click", () => {
      playSfx("cardSelect");
      handleMemoryOptionSelect(scene, option, button);
    });
    optionGrid.appendChild(button);
  });

  memoryPanel.append(label, adrianBubble, optionGrid);
  els.sceneBody.appendChild(memoryPanel);
}

function handleMemoryOptionSelect(scene, option, selectedButton) {
  Array.from(els.sceneBody.querySelectorAll(".memory-option")).forEach((button) => {
    button.disabled = true;
  });

  selectedButton.classList.add("selected");
  if (option.correct) {
    selectedButton.classList.add("correct");
  } else if (option.partial) {
    selectedButton.classList.add("partial");
  }

  applyDeltaWithFeedback(option.delta);

  addPhoneMessage("echo", "ECHO", option.label);
  addPhoneMessage("adrian", "Adrian", option.response);
  renderPhoneLog();

  const response = document.createElement("p");
  response.className = option.correct ? "memory-response correct" : "memory-response";
  response.textContent = option.response;
  els.sceneBody.querySelector(".memory-check").appendChild(response);

  renderChoiceButton(">", "Continue", () => {
    resolveAfterAction(scene, option.next ?? scene.next ?? scene.id + 1);
  });
}

function renderMemoryTraceScanMiniGame(scene) {
  clearMemoryTraceScan();

  const hotspots = Array.isArray(scene.hotspots) ? scene.hotspots : [];
  const timeLimit = scene.timeLimit || MEMORY_TRACE_DEFAULT_TIME_LIMIT;
  const passCount = scene.passCount || 2;
  const {
    scanPanel,
    frame,
    timer,
    found,
    image,
    placeholder,
    hotspotLayer,
    result
  } = createMemoryTraceScanLayout(scene);

  const scan = {
    cancelled: false,
    completed: false,
    intervalId: null,
    timeoutId: null,
    remaining: timeLimit,
    foundIds: new Set(),
    hotspotButtons: [],
    frame,
    timer,
    found,
    result,
    passCount,
    totalTraces: hotspots.length
  };
  activeMemoryTraceScan = scan;

  hotspots.forEach((hotspot) => {
    const button = createMemoryTraceHotspot(scene, hotspot, scan);
    scan.hotspotButtons.push(button);
    hotspotLayer.appendChild(button);
  });

  frame.addEventListener("click", (event) => handleMemoryTraceMiss(scan, event));

  els.sceneBody.appendChild(scanPanel);

  loadMemoryTraceImage(scene, scan, scanPanel, image, placeholder);
  syncMemoryTraceHud(scan);
  startMemoryTraceTimer(scene, scan, passCount);
}

function createMemoryTraceScanLayout(scene) {
  const scanPanel = document.createElement("div");
  scanPanel.className = "memory-trace-scan";

  const hud = document.createElement("div");
  hud.className = "memory-trace-hud";

  const timer = document.createElement("span");
  timer.className = "memory-trace-timer";

  const found = document.createElement("span");
  found.className = "memory-trace-found";

  hud.append(timer, found);

  const frame = document.createElement("div");
  frame.className = "memory-trace-frame";

  const header = document.createElement("div");
  header.className = "memory-trace-file-label";
  header.textContent = scene.imageLabel || getImageDisplayName(scene.image);

  const image = document.createElement("img");
  image.className = "memory-trace-image";
  image.alt = scene.imageAlt || "Memory trace scan visual.";
  image.decoding = "async";
  image.loading = "eager";
  image.hidden = true;

  const placeholder = document.createElement("div");
  placeholder.className = "memory-trace-placeholder";
  placeholder.textContent = "VISUAL FEED UNAVAILABLE";
  placeholder.hidden = true;

  const hotspotLayer = document.createElement("div");
  hotspotLayer.className = "memory-hotspot-layer";

  const result = document.createElement("div");
  result.className = "memory-trace-result";
  result.hidden = true;

  frame.append(image, placeholder, hotspotLayer, header);
  scanPanel.append(hud, frame, result);

  return { scanPanel, frame, timer, found, image, placeholder, hotspotLayer, result };
}

function loadMemoryTraceImage(scene, scan, scanPanel, image, placeholder) {
  resolveImagePath(scene.image, scene.imageFallback).then((asset) => {
    if (scan.cancelled) {
      return;
    }
    if (asset.path) {
      image.hidden = false;
      placeholder.hidden = true;
      image.src = asset.path;
      scanPanel.classList.add("image-loaded");
      return;
    }
    image.hidden = true;
    placeholder.hidden = false;
    scanPanel.classList.add("image-missing");
  });
}

function startMemoryTraceTimer(scene, scan, passCount) {
  scan.intervalId = trackInterval("memoryTraceScan", window.setInterval(() => {
    if (scan.cancelled || scan.completed) {
      return;
    }
    scan.remaining -= 1;
    syncMemoryTraceHud(scan);
    if (scan.remaining <= 0) {
      completeMemoryTraceScan(scene, scan, scan.foundIds.size >= passCount, { timedOut: true });
    }
  }, 1000));
}

function createMemoryTraceHotspot(scene, hotspot, scan) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "memory-hotspot";
  button.dataset.traceId = hotspot.id || "";
  button.style.left = `${hotspot.x || 0}%`;
  button.style.top = `${hotspot.y || 0}%`;
  button.style.width = `${hotspot.w || 12}%`;
  button.style.height = `${hotspot.h || 12}%`;
  button.setAttribute("aria-label", `Scan trace: ${hotspot.label || hotspot.id || "memory trace"}`);

  const label = document.createElement("span");
  label.textContent = hotspot.label || "trace";
  button.appendChild(label);

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    handleMemoryTraceHotspotSelect(scene, hotspot, scan, button);
  });

  return button;
}

function handleMemoryTraceHotspotSelect(scene, hotspot, scan, button) {
  if (!scan || scan.cancelled || scan.completed || scan.foundIds.has(hotspot.id)) {
    return;
  }

  scan.foundIds.add(hotspot.id);
  button.disabled = true;
  button.classList.add("found");
  rememberSceneTokens([hotspot.memoryToken]);
  incrementRunStat("memoryTracesRecovered");
  renderObjectiveTracker();
  playSfx("auditScan");
  createMemoryScanPulse(scan, button, true);
  applyMemoryTraceDelta(hotspot.delta);
  syncMemoryTraceHud(scan);

  if (scan.foundIds.size >= scan.totalTraces) {
    completeMemoryTraceScan(scene, scan, true, { foundAll: true });
  }
}

function handleMemoryTraceMiss(scan, event) {
  if (!scan || scan.cancelled || scan.completed || event.target.closest(".memory-hotspot")) {
    return;
  }

  playSfx("glitch");
  scan.frame.classList.remove("wrong-click");
  void scan.frame.offsetWidth;
  scan.frame.classList.add("wrong-click");
  createMemoryScanPulse(scan, event, false);
  applyMemoryTraceDelta({ auditHeat: 1 });
}

function applyMemoryTraceDelta(delta = {}) {
  applyDeltaWithFeedback(delta);
}

function syncMemoryTraceHud(scan) {
  if (!scan) {
    return;
  }
  scan.timer.textContent = `FILE COMPRESSION IN: ${Math.max(scan.remaining, 0)}`;
  scan.timer.classList.toggle("warning", scan.remaining > 0 && scan.remaining <= 5);
  scan.found.textContent = `TRACES FOUND: ${scan.foundIds.size}/${scan.totalTraces}`;
}

function completeMemoryTraceScan(scene, scan, passed, options = {}) {
  if (!scan || scan.cancelled || scan.completed) {
    return;
  }

  scan.completed = true;
  if (scan.intervalId) {
    clearTrackedInterval("memoryTraceScan");
    scan.intervalId = null;
  }
  scan.hotspotButtons.forEach((button) => {
    button.disabled = true;
  });

  const resultText = passed ? "MEMORY TRACE STABLE" : "MEMORY TRACE COMPRESSED";
  if (!passed) {
    applyMemoryTraceDelta(MEMORY_TRACE_FAILURE_DELTA);
  }
  scan.timer.textContent = passed ? "TRACE LOCKED" : "FILE COMPRESSED";
  scan.timer.classList.remove("warning");

  replaceChildren(scan.result);
  scan.result.hidden = false;
  scan.result.classList.toggle("stable", passed);
  scan.result.classList.toggle("compressed", !passed);

  const badge = document.createElement("strong");
  badge.textContent = resultText;

  const detail = document.createElement("p");
  detail.textContent = passed
    ? `Recovered ${scan.foundIds.size}/${scan.totalTraces} traces before compression.`
    : `Recovered ${scan.foundIds.size}/${scan.totalTraces} traces. Audit compressed the remaining file.`;

  const note = document.createElement("span");
  note.textContent = options.foundAll
    ? "Full memory signal reconstructed."
    : options.timedOut
      ? "Timer expired."
      : "Scan completed.";

  scan.result.append(badge, detail, note);

  addPhoneMessage("audit", "Memory Trace", resultText, { variant: passed ? "" : "warning" });
  renderPhoneLog();

  if (activeMemoryTraceScan === scan) {
    activeMemoryTraceScan = null;
  }

  renderChoiceButton(">", "Continue", () => {
    resolveAfterAction(scene, scene.next ?? scene.id + 1);
  });
}

function createMemoryScanPulse(scan, source, stable) {
  if (!scan?.frame) {
    return;
  }

  const pulse = document.createElement("span");
  pulse.className = stable ? "memory-scan-pulse" : "memory-scan-pulse miss";

  const frameRect = scan.frame.getBoundingClientRect();
  let left = 50;
  let top = 50;

  if (typeof Event !== "undefined" && source instanceof Event) {
    left = ((source.clientX - frameRect.left) / frameRect.width) * 100;
    top = ((source.clientY - frameRect.top) / frameRect.height) * 100;
  } else if (source?.getBoundingClientRect) {
    const sourceRect = source.getBoundingClientRect();
    left = ((sourceRect.left + sourceRect.width / 2 - frameRect.left) / frameRect.width) * 100;
    top = ((sourceRect.top + sourceRect.height / 2 - frameRect.top) / frameRect.height) * 100;
  }

  pulse.style.left = `${clamp(left, 0, 100)}%`;
  pulse.style.top = `${clamp(top, 0, 100)}%`;
  scan.frame.appendChild(pulse);
  const pulseTimerName = `memoryScanPulse:${Date.now()}:${Math.random()}`;
  trackTimeout(pulseTimerName, window.setTimeout(() => {
    releaseTrackedTimeout(pulseTimerName);
    pulse.remove();
  }, 760));
}

function buildReplyText(chips, scene = {}) {
  const fragments = chips.map((chip) => chip.text);
  const separator = scene.replySeparator || " ";
  const fragmentText = fragments.join(separator);
  const replyText = scene.replyPrefix
    ? `${scene.replyPrefix} ${fragmentText}`
    : fragmentText;
  return punctuateReply(replyText, scene.replySuffix);
}

function punctuateReply(replyText, suffix) {
  if (suffix) {
    return `${replyText}${suffix}`;
  }
  return /[.!?]$/.test(replyText) ? replyText : `${replyText}.`;
}

function combineChipDeltas(chips) {
  const combinedDelta = {};
  chips.forEach((chip) => {
    Object.keys(chip.delta || {}).forEach((key) => {
      combinedDelta[key] = (combinedDelta[key] || 0) + chip.delta[key];
    });
  });
  return combinedDelta;
}

function renderRedactionMiniGame(scene) {
  const countdown = document.createElement("div");
  countdown.className = "redaction-countdown";
  countdown.setAttribute("aria-live", "polite");
  countdown.textContent = `AUDIT REVIEW IN: ${REDACTION_COUNTDOWN_SECONDS}`;

  const transcriptPanel = document.createElement("div");
  transcriptPanel.className = "redaction-transcript";
  transcriptPanel.setAttribute("aria-label", "Clickable transcript phrases");

  const options = Array.isArray(scene.options) ? scene.options : [];
  const parts = getRedactionParts(scene.transcript || "", options);
  parts.forEach((part) => {
    if (part.option) {
      transcriptPanel.appendChild(createRedactionToken(scene, part.option, part.text, options.indexOf(part.option) + 1));
    } else {
      transcriptPanel.appendChild(document.createTextNode(part.text));
    }
  });

  options
    .filter((option) => !parts.some((part) => part.option === option))
    .forEach((option) => {
      console.warn(`Phrase not found in transcript: ${option.phrase}`);
      transcriptPanel.appendChild(document.createTextNode(" "));
      transcriptPanel.appendChild(createRedactionToken(scene, option, option.label || option.phrase || option.id, options.indexOf(option) + 1));
    });

  els.sceneBody.append(countdown, transcriptPanel);
  startRedactionCountdown(scene, countdown);
}

function startRedactionCountdown(scene, countdownEl) {
  clearRedactionCountdown();

  const countdown = {
    cancelled: false,
    expired: false,
    intervalId: null,
    timeoutId: null
  };
  activeRedactionCountdown = countdown;

  let remaining = REDACTION_COUNTDOWN_SECONDS;
  updateRedactionCountdownDisplay(countdownEl, remaining);

  countdown.intervalId = trackInterval("redactionCountdown", window.setInterval(() => {
    if (countdown.cancelled) {
      return;
    }

    remaining -= 1;
    updateRedactionCountdownDisplay(countdownEl, remaining);

    if (remaining <= 0) {
      handleRedactionTimeout(scene, countdown, countdownEl);
    }
  }, 1000));
}

function updateRedactionCountdownDisplay(countdownEl, remaining) {
  countdownEl.textContent = `AUDIT REVIEW IN: ${Math.max(remaining, 0)}`;
  countdownEl.classList.toggle("warning", remaining > 0 && remaining <= 3);
  countdownEl.classList.toggle("expired", remaining <= 0);
}

function handleRedactionTimeout(scene, countdown, countdownEl) {
  if (countdown.cancelled || countdown.expired) {
    return;
  }
  countdown.expired = true;
  if (countdown.intervalId) {
    clearTrackedInterval("redactionCountdown");
    countdown.intervalId = null;
  }

  Array.from(els.sceneBody.querySelectorAll(".redact-token")).forEach((button) => {
    button.disabled = true;
  });

  updateRedactionCountdownDisplay(countdownEl, 0);

  applyDeltaWithFeedback(REDACTION_TIMEOUT_DELTA);

  const response = document.createElement("p");
  response.className = "audit-response";
  response.textContent = "Audit captured unredacted transcript.";
  els.sceneBody.appendChild(response);

  addPhoneMessage("audit", "Audit", "Audit captured unredacted transcript.");
  renderPhoneLog();

  countdown.timeoutId = trackTimeout("redactionTimeoutAdvance", window.setTimeout(() => {
    releaseTrackedTimeout("redactionTimeoutAdvance");
    if (countdown.cancelled) {
      return;
    }
    if (activeRedactionCountdown === countdown) {
      activeRedactionCountdown = null;
    }
    resolveAfterAction(scene, getRedactionNextSceneId(scene));
  }, VISUAL_TRANSITION_DELAY_MS + 420));
}

function getRedactionNextSceneId(scene) {
  const firstOption = Array.isArray(scene.options) ? scene.options[0] : null;
  return scene.next ?? firstOption?.next ?? scene.id + 1;
}

function getRedactionParts(transcript, options) {
  const matches = options
    .map((option) => ({
      option,
      index: transcript.indexOf(option.phrase || "")
    }))
    .filter((match) => match.index >= 0)
    .sort((a, b) => a.index - b.index);

  const parts = [];
  let cursor = 0;
  matches.forEach((match) => {
    const phrase = match.option.phrase || "";
    if (!phrase || match.index < cursor) {
      return;
    }
    if (match.index > cursor) {
      parts.push({ text: transcript.slice(cursor, match.index) });
    }
    parts.push({
      text: transcript.slice(match.index, match.index + phrase.length),
      option: match.option
    });
    cursor = match.index + phrase.length;
  });

  if (cursor < transcript.length) {
    parts.push({ text: transcript.slice(cursor) });
  }
  return parts;
}

function createRedactionToken(scene, option, text, shortcutIndex = 0) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "redact-token";
  button.dataset.redactionId = option.id || "";
  button.textContent = text;
  setKeyboardShortcut(button, shortcutIndex);
  button.addEventListener("click", () => handleRedactionSelect(scene, option, button));
  return button;
}

function handleRedactionSelect(scene, option, selectedButton) {
  clearRedactionCountdown();
  Array.from(els.sceneBody.querySelectorAll(".redact-token")).forEach((button) => {
    button.disabled = true;
  });

  playSfx("redact");
  selectedButton.classList.add("selected");
  replaceChildren(selectedButton);

  const bar = document.createElement("span");
  bar.className = "redaction-bar";
  bar.textContent = "█████";
  selectedButton.appendChild(bar);

  const response = document.createElement("p");
  response.className = "audit-response";
  response.textContent = option.auditResponse || "Redaction accepted for review.";
  els.sceneBody.appendChild(response);

  addPhoneMessage("audit", "Redacted", redactTranscript(scene.transcript || "", option.phrase || ""));
  renderPhoneLog();
  renderChoiceButton(">", "Continue", () => confirmRedaction(scene, option));
}

function redactTranscript(transcript, phrase) {
  if (!phrase || !transcript.includes(phrase)) {
    return `${transcript} █████`;
  }
  return transcript.replace(phrase, "█████");
}

function confirmRedaction(scene, option) {
  clearRedactionCountdown();
  disableChoices();
  applyDeltaWithFeedback(option.delta);
  incrementRunStat("redactionsCompleted");
  addPhoneMessage("audit", "Audit", option.auditResponse || "Redaction accepted for review.");
  renderPhoneLog();

  trackTimeout("redactionConfirmAdvance", window.setTimeout(() => {
    releaseTrackedTimeout("redactionConfirmAdvance");
    resolveAfterAction(scene, option.next ?? scene.next ?? scene.id + 1);
  }, VISUAL_TRANSITION_DELAY_MS));
}

function renderUnknownMiniGame(scene) {
  const panel = document.createElement("div");
  panel.className = "error-panel";

  const title = document.createElement("h2");
  title.textContent = "Mini-game unavailable";

  const message = document.createElement("p");
  message.textContent = `Unknown mini-game mechanic: ${scene.mechanic || "none"}`;

  panel.append(title, message);
  els.sceneBody.appendChild(panel);
  renderChoiceButton(">", "Continue", () => completeMiniGame(scene));
}

function completeMiniGame(scene, delta = scene.delta || {}) {
  disableChoices();
  applyDeltaWithFeedback(delta);
  addPhoneMessage("audit", "Protocol", scene.completeMessage || "Mini-game protocol complete.");
  renderPhoneLog();

  trackTimeout("miniGameAdvance", window.setTimeout(() => {
    releaseTrackedTimeout("miniGameAdvance");
    resolveAfterAction(scene, scene.next ?? scene.id + 1, { ending: scene.ending });
  }, VISUAL_TRANSITION_DELAY_MS));
}

function clearRedactionCountdown() {
  if (!activeRedactionCountdown) {
    return;
  }
  activeRedactionCountdown.cancelled = true;
  if (activeRedactionCountdown.intervalId) {
    clearTrackedInterval("redactionCountdown");
  }
  if (activeRedactionCountdown.timeoutId) {
    clearTrackedTimeout("redactionTimeoutAdvance");
  }
  activeRedactionCountdown = null;
}

function clearMemoryTraceScan() {
  if (!activeMemoryTraceScan) {
    return;
  }
  activeMemoryTraceScan.cancelled = true;
  if (activeMemoryTraceScan.intervalId) {
    clearTrackedInterval("memoryTraceScan");
  }
  if (activeMemoryTraceScan.timeoutId) {
    clearTrackedTimeout("memoryTraceTimeout");
  }
  activeMemoryTraceScan = null;
}

// Phone and thread UI.
function setupMobileTabs() {
  if (!els.mobileTabButtons?.length) {
    return;
  }
  els.mobileTabButtons.forEach((button) => {
    button.addEventListener("click", () => setMobilePanel(button.dataset.mobilePanel || "audit"));
  });
  setMobilePanel("audit");
}

function setMobilePanel(panel) {
  if (!els.phonePanel || !els.auditPanel) {
    return;
  }
  const activePanel = panel === "thread" ? "thread" : "audit";
  activeMobilePanel = activePanel;
  mobileNotifications[activePanel] = false;
  els.phonePanel.classList.toggle("mobile-panel-active", activePanel === "thread");
  els.auditPanel.classList.toggle("mobile-panel-active", activePanel === "audit");
  els.mobileTabButtons?.forEach((button) => {
    const isActive = button.dataset.mobilePanel === activePanel;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });
  syncMobileTabNotifications();
  queueScrollIndicatorUpdate();
}

function resetMobileNotifications() {
  mobileNotifications = {
    thread: false,
    audit: false
  };
  syncMobileTabNotifications();
}

function markMobileNotification(panel, type = "notice") {
  const targetPanel = panel === "thread" ? "thread" : "audit";
  if (activeMobilePanel === targetPanel) {
    return;
  }
  mobileNotifications[targetPanel] = type === "warning" ? "warning" : "notice";
  syncMobileTabNotifications();
}

function syncMobileTabNotifications() {
  if (!els.mobileTabButtons?.length) {
    return;
  }
  els.mobileTabButtons.forEach((button) => {
    const panel = button.dataset.mobilePanel === "thread" ? "thread" : "audit";
    const notification = mobileNotifications[panel];
    button.classList.toggle("has-notice", notification === "notice");
    button.classList.toggle("has-warning", notification === "warning");
    button.setAttribute("data-notification", notification || "");
  });
}

function setupFocusedPlayMode() {
  els.phoneCompact.classList.add("thread-compact-strip");
  els.focusToggle.addEventListener("click", () => {
    setFocusedPlayMode(!focusedPlayMode);
  });
  els.phoneOverlayToggle.addEventListener("click", () => {
    setPhoneOverlayExpanded(!phoneOverlayExpanded, { manual: true });
  });
  els.openThread.addEventListener("click", openThreadDrawer);
  els.threadDrawerClose.addEventListener("click", closeThreadDrawer);
  els.threadDrawerBackdrop.addEventListener("click", closeThreadDrawer);
  setFocusedPlayMode(true);
}

function setFocusedPlayMode(enabled) {
  focusedPlayMode = Boolean(enabled);
  document.body.classList.toggle("focused-play-mode", focusedPlayMode);
  els.appShell.classList.toggle("focused-play", focusedPlayMode);
  els.focusToggle.textContent = focusedPlayMode ? "Split" : "Focus";
  els.focusToggle.setAttribute("aria-pressed", focusedPlayMode ? "true" : "false");
  els.focusToggle.setAttribute("aria-label", focusedPlayMode ? "Switch to split layout" : "Switch to focused layout");
  if (focusedPlayMode) {
    setPhoneOverlayExpanded(false);
  } else {
    clearPhoneOverlayTimer();
    setPhoneOverlayExpanded(true);
    closeThreadDrawer();
  }
  renderPhoneOverlayPreview(getSceneById(currentSceneId));
}

function setPhoneOverlayExpanded(expanded, options = {}) {
  phoneOverlayExpanded = Boolean(expanded);
  els.phonePanel.classList.toggle("phone-overlay-expanded", phoneOverlayExpanded);
  els.phonePanel.classList.toggle("phone-overlay-compact", !phoneOverlayExpanded);
  els.phoneOverlayToggle.textContent = phoneOverlayExpanded ? "Collapse" : "Expand";
  els.phoneOverlayToggle.setAttribute("aria-expanded", phoneOverlayExpanded ? "true" : "false");
  els.phoneCompactState.textContent = phoneOverlayExpanded ? "expanded" : "compact";
  if (options.manual) {
    clearPhoneOverlayTimer();
  }
}

function clearPhoneOverlayTimer() {
  clearTrackedTimeout("phoneOverlay");
  phoneOverlayTimer = null;
}

function syncFocusedPhoneForScene(scene) {
  renderPhoneOverlayPreview(scene);
  if (!focusedPlayMode || !scene || scene.kind === "title") {
    return;
  }

  setPhoneOverlayExpanded(false);
}

function openThreadDrawer() {
  threadDrawerOpen = true;
  els.threadDrawer.hidden = false;
  els.threadDrawer.classList.add("open");
  setPhoneOverlayExpanded(false);
  els.openThread.setAttribute("aria-expanded", "true");
  renderThreadDrawerLog();
  scrollThreadDrawerToBottom();
  els.threadDrawerClose.focus();
  queueScrollIndicatorUpdate();
}

function closeThreadDrawer() {
  threadDrawerOpen = false;
  els.threadDrawer.classList.remove("open");
  els.threadDrawer.hidden = true;
  els.openThread.setAttribute("aria-expanded", "false");
  queueScrollIndicatorUpdate();
}

function pulseThreadCompactStrip() {
  if (!els.phoneCompact) {
    return;
  }
  clearTrackedTimeout("threadPulse");
  els.phoneCompact.classList.remove("thread-notification-pulse");
  void els.phoneCompact.offsetWidth;
  els.phoneCompact.classList.add("thread-notification-pulse");
  threadPulseTimer = trackTimeout("threadPulse", window.setTimeout(() => {
    releaseTrackedTimeout("threadPulse", threadPulseTimer);
    els.phoneCompact?.classList.remove("thread-notification-pulse");
    threadPulseTimer = null;
  }, 780));
}

function recordScenePrompt(scene) {
  if (!isEmergencyScene(scene) && seenScenePrompts.has(scene.id)) {
    return;
  }
  if (!isEmergencyScene(scene)) {
    seenScenePrompts.add(scene.id);
  }
  rememberSceneTokens(scene.memoryTokens);

  if (scene.kind === "title") {
    addPhoneMessage("system", "System", scene.line);
  } else if (scene.kind === "adrian") {
    addPhoneMessage("adrian", "Adrian", scene.line);
  } else if (isEmergencyScene(scene)) {
    addPhoneMessage("audit", "Emergency", scene.instruction);
  } else if (scene.kind === "minigame") {
    if (hasAdrianMessage(scene) && scene.adrianMessage) {
      addPhoneMessage("adrian", "Adrian", scene.adrianMessage);
    } else if (scene.mechanic === "redaction" && scene.transcript) {
      addPhoneMessage("audit", "Transcript", scene.transcript);
    } else if (scene.mechanic === "memoryTraceScan") {
      addPhoneMessage("audit", "Memory Trace", scene.instruction || "Memory trace scan initialized.");
    } else {
      addPhoneMessage("audit", "Audit", "Interactive compliance protocol loaded.");
    }
  } else {
    addPhoneMessage("audit", "System", scene.line || scene.title || "Scene loaded.");
  }
}

function hasAdrianMessage(scene) {
  return scene.mechanic === "dialogueFirewall"
    || scene.mechanic === "memoryCheck";
}

function isEmergencyScene(scene) {
  return scene && scene.mechanic === "emergencyRedaction";
}

function rememberSceneTokens(tokens) {
  if (!Array.isArray(tokens)) {
    return;
  }
  if (!Array.isArray(state.memoryTokens)) {
    state.memoryTokens = [];
  }
  tokens.forEach((token) => {
    if (!state.memoryTokens.includes(token)) {
      state.memoryTokens.push(token);
    }
  });
}

function addPhoneMessage(from, label, text, options = {}) {
  if (from !== "adrian") {
    revealPendingPhoneMessages();
  }
  if (from === "adrian") {
    playSfx("notification");
    markMobileNotification("thread", "notice");
  } else if (from === "echo" && !options.suppressSfx) {
    playSfx("sendReply");
  }
  const isAuditWarning = from === "audit" && isAuditWarningMessage(label, text, options);
  if (isAuditWarning) {
    markMobileNotification("audit", "warning");
    triggerGlitchPulse();
  }
  const shouldType = from === "adrian" && !options.instant;
  phoneHistory.push({
    id: nextPhoneMessageId++,
    from,
    label,
    text,
    variant: options.variant || "",
    revealed: !shouldType,
    revealTimer: null
  });
  if (from === "adrian") {
    pulseThreadCompactStrip();
  }
}

function isAuditWarningMessage(label, text, options = {}) {
  if (options.variant === "warning" || options.mobileWarning) {
    return true;
  }
  const warningText = `${label || ""} ${text || ""}`;
  return /emergency|scar|critical|drift|captured|severed|review escalated|unredacted/i.test(warningText);
}

function renderPhoneLog() {
  replaceChildren(els.phoneLog);
  phoneHistory.forEach((message) => {
    appendPhoneMessageElement(els.phoneLog, message, { queueTyping: true });
  });
  scrollPhoneLogToBottom();
  renderPhoneOverlayPreview(getSceneById(currentSceneId));
  if (threadDrawerOpen) {
    renderThreadDrawerLog();
  }
}

function scrollPhoneLogToBottom() {
  if (!els.phoneLog) {
    return;
  }
  els.phoneLog.scrollTop = els.phoneLog.scrollHeight;
  window.requestAnimationFrame(() => {
    if (els.phoneLog) {
      els.phoneLog.scrollTop = els.phoneLog.scrollHeight;
      queueScrollIndicatorUpdate();
    }
  });
  queueScrollIndicatorUpdate();
}

function appendPhoneMessageElement(container, message, options = {}) {
  if (!container || !message) {
    return;
  }
  if (message.from === "adrian" && !message.revealed) {
    container.appendChild(createTypingIndicatorElement(message));
    if (options.queueTyping) {
      queuePhoneMessageReveal(message);
    }
    return;
  }
  container.appendChild(createPhoneBubble(message));
}

function createPhoneBubble(message) {
  const bubble = document.createElement("div");
  bubble.className = ["bubble", message.from, message.variant].filter(Boolean).join(" ");

  const label = document.createElement("span");
  label.textContent = message.label;

  const text = document.createElement("div");
  text.textContent = message.text;

  bubble.append(label, text);
  return bubble;
}

function createTypingIndicatorElement(message) {
  const typing = document.createElement("div");
  typing.className = "typing-indicator";
  typing.setAttribute("aria-label", `${message.label} is typing`);

  const label = document.createElement("span");
  label.textContent = `${message.label} is typing...`;

  const dots = document.createElement("strong");
  dots.setAttribute("aria-hidden", "true");
  dots.append(createTypingDot(), createTypingDot(), createTypingDot());

  typing.append(label, dots);
  return typing;
}

function renderThreadDrawerLog() {
  replaceChildren(els.threadDrawerLog);
  phoneHistory.forEach((message) => {
    appendPhoneMessageElement(els.threadDrawerLog, message);
  });
  scrollThreadDrawerToBottom();
}

function scrollThreadDrawerToBottom() {
  els.threadDrawerLog.scrollTop = els.threadDrawerLog.scrollHeight;
  window.requestAnimationFrame(() => {
    els.threadDrawerLog.scrollTop = els.threadDrawerLog.scrollHeight;
    queueScrollIndicatorUpdate();
  });
  queueScrollIndicatorUpdate();
}

function renderPhoneOverlayPreview(scene) {
  if (!els.phonePreviewLabel || !els.phonePreviewText) {
    return;
  }
  const latestMessage = getLatestPhonePreviewMessage();
  els.phonePreviewLabel.textContent = latestMessage?.label || "Session";
  els.phonePreviewText.textContent = latestMessage
    ? latestMessage.revealed === false
      ? `${latestMessage.label} is typing...`
      : latestMessage.text
    : "Secure companion thread mirrored for audit.";
  renderMemoryPreview(scene);
}

function getLatestPhonePreviewMessage() {
  for (let index = phoneHistory.length - 1; index >= 0; index -= 1) {
    const message = phoneHistory[index];
    if (message.from === "adrian" || message.from === "echo") {
      return message;
    }
  }
  return phoneHistory[phoneHistory.length - 1] || null;
}

function renderMemoryPreview(scene) {
  if (!els.memoryPreview) {
    return;
  }
  replaceChildren(els.memoryPreview);
  const memories = scene?.mechanic === "memoryCheck" ? getRelevantMemoryMessages() : [];
  els.memoryPreview.hidden = memories.length === 0;
  if (!memories.length) {
    return;
  }

  const label = document.createElement("span");
  label.textContent = "MEMORY BUFFER";
  els.memoryPreview.appendChild(label);

  memories.slice(-3).forEach((message) => {
    const item = document.createElement("p");
    item.textContent = `${message.label}: ${message.text}`;
    els.memoryPreview.appendChild(item);
  });
}

function getRelevantMemoryMessages() {
  const tokens = Array.isArray(state.memoryTokens) ? state.memoryTokens : [];
  if (!tokens.length) {
    return [];
  }
  return phoneHistory.filter((message) => {
    const text = message.text || "";
    return message.revealed !== false && tokens.some((token) => text.includes(token));
  });
}

function createTypingDot() {
  const dot = document.createElement("i");
  return dot;
}

function queuePhoneMessageReveal(message) {
  if (message.revealTimer) {
    return;
  }
  message.revealTimer = window.setTimeout(() => {
    message.revealed = true;
    message.revealTimer = null;
    renderPhoneLog();
  }, PHONE_TYPING_DELAY_MS);
}

function clearPhoneTypingTimers() {
  phoneHistory.forEach((message) => {
    if (message.revealTimer) {
      window.clearTimeout(message.revealTimer);
      message.revealTimer = null;
    }
  });
}

function revealPendingPhoneMessages() {
  phoneHistory.forEach((message) => {
    if (message.from === "adrian" && !message.revealed) {
      message.revealed = true;
      if (message.revealTimer) {
        window.clearTimeout(message.revealTimer);
        message.revealTimer = null;
      }
    }
  });
}

// Audio.
function setupAudio() {
  audioElements = Object.fromEntries(
    Object.entries(AUDIO_ASSETS).map(([key, config]) => [key, createAudioElement(key, config)])
  );

  logGlitchAudioSource();
  window.debugAudio = debugAudio;

  els.audioToggle.addEventListener("click", handleAudioToggle);
  syncAudioToggle();

  // Browser audio must be unlocked by a user gesture before playback.
  document.addEventListener("pointerdown", unlockAudioFromGesture, { once: true, capture: true });
}

function createAudioElement(key, config) {
  const audio = new Audio(getVersionedAudioPath(config.src));
  audio.preload = config.ambient ? "auto" : "metadata";
  audio.volume = getAudioVolume(key);
  audio.loop = Boolean(config.ambient);
  audio.muted = audioMuted;
  audio.dataset.primarySrc = getVersionedAudioPath(config.src);
  audio.dataset.fallbackUsed = "false";
  audio.dataset.fallbackTried = "false";
  audio.dataset.pendingFallbackPlay = "false";

  if (config.fallbackSrc) {
    bindAudioFallback(audio, key, getVersionedAudioPath(config.fallbackSrc));
  }
  audio.addEventListener("playing", () => {
    audio.dataset.pendingFallbackPlay = "false";
  });

  return audio;
}

function getVersionedAudioPath(path) {
  if (!path) {
    return "";
  }
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}v=${encodeURIComponent(ASSET_VERSION)}`;
}

function bindAudioFallback(audio, key, fallbackSrc) {
  audio.dataset.fallbackSrc = fallbackSrc;
  audio.addEventListener("error", () => {
    if (audio.dataset.fallbackTried === "true") {
      return;
    }

    const shouldPlayFallback = audio.dataset.pendingFallbackPlay === "true";
    audio.dataset.fallbackTried = "true";
    audio.dataset.fallbackUsed = "true";
    audio.src = fallbackSrc;
    audio.load();
    if (key === "glitch") {
      console.warn(`Glitch audio fallback used: ${audio.src}`);
    }

    if (shouldPlayFallback) {
      replayAudioWhenReady(audio, key);
    }
  });
}

function logGlitchAudioSource() {
  const audio = audioElements.glitch;
  if (!audio) {
    console.log("Glitch audio source: unavailable");
    return;
  }
  console.log(`Glitch audio source: ${audio.src} (fallback used: ${hasGlitchFallbackBeenUsed()})`);
}

function debugAudio() {
  const glitch = audioElements.glitch || null;
  const report = {
    glitchSrc: glitch?.currentSrc || glitch?.src || "",
    glitchVolume: glitch ? glitch.volume : null,
    muted: audioMuted,
    fallbackUsed: hasGlitchFallbackBeenUsed(),
    lastGlitchPlayTime: lastGlitchSfxAt ? new Date(lastGlitchSfxAt).toISOString() : null
  };
  console.log("Audio debug", report);
  return report;
}

function hasGlitchFallbackBeenUsed() {
  return audioElements.glitch?.dataset.fallbackUsed === "true";
}

function replayAudioWhenReady(audio, key) {
  let didStartFallback = false;
  const startFallback = () => {
    if (didStartFallback) {
      return;
    }
    didStartFallback = true;
    audio.removeEventListener("canplaythrough", startFallback);
    audio.removeEventListener("loadedmetadata", startFallback);
    playAudioFromStart(audio, key);
  };
  audio.addEventListener("canplaythrough", startFallback, { once: true });
  audio.addEventListener("loadedmetadata", startFallback, { once: true });
}

function getAudioVolume(key) {
  return AUDIO_VOLUMES[key] ?? 0.5;
}

function unlockAudioFromGesture() {
  audioUnlocked = true;
  startAmbient(activeAmbientKey || getSceneAmbientKey(getSceneById(currentSceneId)));
}

function handleAudioToggle() {
  audioMuted = !audioMuted;
  Object.values(audioElements).forEach((audio) => {
    audio.muted = audioMuted;
  });
  syncAudioToggle();

  if (!audioMuted && audioUnlocked) {
    startAmbient(activeAmbientKey || getSceneAmbientKey(getSceneById(currentSceneId)));
  }
}

function syncAudioToggle() {
  els.audioToggle.textContent = audioMuted ? "Sound" : "Mute";
  els.audioToggle.setAttribute("aria-pressed", audioMuted ? "true" : "false");
  els.audioToggle.setAttribute("aria-label", audioMuted ? "Turn sound on" : "Mute sound");
  els.audioToggle.classList.toggle("is-muted", audioMuted);
}

function startAmbient(key) {
  if (!key) {
    return;
  }
  activeAmbientKey = key;

  Object.entries(audioElements).forEach(([audioKey, audio]) => {
    if (!AUDIO_ASSETS[audioKey]?.ambient || !audio) {
      return;
    }
    if (audioKey !== key) {
      audio.pause();
      return;
    }
    audio.muted = audioMuted;
    if (audioUnlocked && !audioMuted) {
      safePlayAudio(audio);
    }
  });
}

function playSfx(key) {
  if (!audioUnlocked || audioMuted) {
    return;
  }
  if (key === "glitch") {
    playGlitchSfx();
    return;
  }
  const audio = audioElements[key];
  if (!audio) {
    return;
  }
  playAudioFromStart(audio, key);
}

function playGlitchSfx() {
  const now = Date.now();
  if (now - lastGlitchSfxAt < GLITCH_SFX_COOLDOWN_MS) {
    return;
  }

  const audio = audioElements.glitch;
  if (!audio) {
    return;
  }

  lastGlitchSfxAt = now;
  audio.muted = audioMuted;

  if (!audio.paused && !audio.ended) {
    return;
  }

  playAudioFromStart(audio, "glitch", { retryFallback: true, clearFade: true });
}

function playAudioFromStart(audio, key, options = {}) {
  if (!audio) {
    return;
  }
  if (options.clearFade) {
    clearGlitchFadeTimer();
  }
  audio.muted = audioMuted;
  audio.volume = getAudioVolume(key);
  if (options.retryFallback) {
    audio.dataset.pendingFallbackPlay = "true";
  }
  resetAudioPlayback(audio);
  safePlayAudio(audio);
}

function resetAudioPlayback(audio) {
  try {
    audio.currentTime = 0;
  } catch (error) {
    // Some browsers disallow seeking before metadata loads; playback can still proceed.
  }
}

function fadeOutAudio(audio, duration, onComplete) {
  clearGlitchFadeTimer();
  const startVolume = audio.volume;
  const startedAt = performance.now();

  function step(now) {
    const progress = clamp((now - startedAt) / duration, 0, 1);
    audio.volume = startVolume * (1 - progress);
    if (progress < 1) {
      glitchFadeTimer = trackAnimationFrame("glitchFade", window.requestAnimationFrame(step));
      return;
    }
    releaseTrackedAnimationFrame("glitchFade", glitchFadeTimer);
    glitchFadeTimer = null;
    audio.pause();
    onComplete?.();
  }

  glitchFadeTimer = trackAnimationFrame("glitchFade", window.requestAnimationFrame(step));
}

function clearGlitchFadeTimer() {
  clearTrackedAnimationFrame("glitchFade");
  glitchFadeTimer = null;
}

function stopGlitchSfx() {
  clearGlitchFadeTimer();
  lastGlitchSfxAt = 0;
  const audio = audioElements.glitch;
  if (!audio) {
    return;
  }
  audio.pause();
  audio.volume = getAudioVolume("glitch");
  audio.dataset.pendingFallbackPlay = "false";
  resetAudioPlayback(audio);
}

function safePlayAudio(audio) {
  if (!audio) {
    return;
  }
  const playAttempt = audio.play();
  if (playAttempt && typeof playAttempt.catch === "function") {
    playAttempt.catch(() => {});
  }
}

function playTypingTick() {
  if (audioElements.typing) {
    playSfx("typing");
    return;
  }
  playSyntheticTypingTick();
}

function playSyntheticTypingTick() {
  if (!audioUnlocked || audioMuted || typeof window === "undefined") {
    return;
  }
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }
  try {
    if (!typingAudioContext) {
      typingAudioContext = new AudioContextClass();
    }
    if (typingAudioContext.state === "suspended") {
      typingAudioContext.resume().catch(() => {});
    }
    const now = typingAudioContext.currentTime;
    const oscillator = typingAudioContext.createOscillator();
    const gain = typingAudioContext.createGain();
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(920 + Math.random() * 180, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.018, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.032);
    oscillator.connect(gain).connect(typingAudioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.035);
  } catch (error) {
    // Optional typing audio should never block boot progression.
  }
}

// Intro and cutscenes.
function setupBootControls() {
  els.bootBegin.addEventListener("click", handleBeginCalibration);
  els.bootCursor.addEventListener("click", handleBootCursorClick);
  els.skipIntro.addEventListener("click", handleTerminalIntroButton);
}

function queueTerminalTimer(callback, delay) {
  const timer = trackTimeout("terminalIntroDelay", window.setTimeout(() => {
    releaseTrackedTimeout("terminalIntroDelay", timer);
    callback();
  }, delay));
  return timer;
}

function terminalDelay(delay) {
  return new Promise((resolve) => {
    queueTerminalTimer(resolve, delay);
  });
}

function clearTerminalIntroTimers() {
  clearTrackedTimeout("terminalIntroDelay");
  clearTrackedInterval("terminalLoader");
  clearTrackedTimeout("bootSequence");
  terminalLoaderTimer = null;
  bootSequenceTimer = null;
}

function resetBootState() {
  terminalIntroRunId += 1;
  clearTerminalIntroTimers();
  bootCursorClicks = 0;
  bootUncertaintyGranted = false;
  bootSequenceActive = false;
  terminalIntroFinished = false;
  els.bootOverlay.classList.remove("is-booting", "is-exiting", "cursor-awake", "terminal-active", "terminal-complete");
  els.terminalIntro.hidden = true;
  replaceChildren(els.terminalLines);
  els.bootBegin.disabled = false;
  els.bootCursor.disabled = false;
  els.bootCursor.textContent = "_";
  syncTerminalIntroButton("skip");
}

function handleBeginCalibration() {
  if (bootSequenceActive || currentSceneId !== 0) {
    return;
  }

  bootSequenceActive = true;
  terminalIntroFinished = false;
  const runId = ++terminalIntroRunId;
  els.bootBegin.disabled = true;
  els.bootCursor.disabled = true;
  els.bootOverlay.classList.add("is-booting", "terminal-active");
  els.terminalIntro.hidden = false;
  replaceChildren(els.terminalLines);
  replaceChildren(els.choices);
  syncTerminalIntroButton("skip");

  runTerminalIntro(runId);
}

async function runTerminalIntro(runId) {
  for (let index = 0; index < TERMINAL_INTRO_LINES.length; index += 1) {
    if (!isCurrentTerminalRun(runId)) {
      return;
    }
    const line = TERMINAL_INTRO_LINES[index];
    if (line.startsWith("WARNING:")) {
      playSfx("glitch");
    }
    if (line.includes("AUDIT")) {
      playSfx("auditScan");
    }
    await typeTerminalLine(line, runId);
    if (!isCurrentTerminalRun(runId)) {
      return;
    }
    const progress = TERMINAL_PROGRESS_AFTER_LINE[index];
    if (progress) {
      await renderTerminalProgress(progress, runId);
    }
    await terminalDelay(TERMINAL_LINE_PAUSE_MS);
  }

  if (!isCurrentTerminalRun(runId)) {
    return;
  }
  stopTerminalLoader();
  terminalIntroFinished = true;
  els.bootOverlay.classList.add("terminal-complete");
  const finalLine = document.createElement("p");
  finalLine.className = "terminal-line terminal-line-ready";
  const readyText = document.createElement("span");
  readyText.textContent = "PRESS ENTER TO CONTINUE";
  const readyCursor = document.createElement("span");
  readyCursor.className = "terminal-ready-cursor";
  readyCursor.setAttribute("aria-hidden", "true");
  readyCursor.textContent = "_";
  finalLine.append(readyText, readyCursor);
  els.terminalLines.appendChild(finalLine);
  syncTerminalIntroButton("continue");
  scrollTerminalToBottom();
}

function isCurrentTerminalRun(runId) {
  return bootSequenceActive && currentSceneId === 0 && runId === terminalIntroRunId;
}

async function typeTerminalLine(text, runId) {
  const line = document.createElement("p");
  line.className = "terminal-line";

  const textNode = document.createElement("span");
  const loader = document.createElement("span");
  loader.className = "terminal-loader";
  loader.setAttribute("aria-hidden", "true");

  line.append(textNode, loader);
  els.terminalLines.appendChild(line);
  startTerminalLoader(loader);
  scrollTerminalToBottom();

  for (let index = 0; index < text.length; index += 1) {
    if (!isCurrentTerminalRun(runId)) {
      stopTerminalLoader(loader);
      return;
    }
    textNode.textContent += text[index];
    if (index % 7 === 0) {
      playTypingTick();
    }
    scrollTerminalToBottom();
    await terminalDelay(TERMINAL_TYPE_SPEED_MS);
  }
  stopTerminalLoader(loader);
}

async function renderTerminalProgress(progress, runId) {
  if (progress.sfx) {
    playSfx(progress.sfx);
  }

  const line = document.createElement("p");
  line.className = "terminal-line terminal-progress";
  const textNode = document.createElement("span");
  const loader = document.createElement("span");
  loader.className = "terminal-loader";
  loader.setAttribute("aria-hidden", "true");
  line.append(textNode, loader);
  els.terminalLines.appendChild(line);
  startTerminalLoader(loader);

  const totalSlots = 12;
  const steps = Math.max(progress.filled, 1);
  for (let step = 0; step <= steps; step += 1) {
    if (!isCurrentTerminalRun(runId)) {
      stopTerminalLoader(loader);
      return;
    }
    const filled = Math.round((progress.filled / steps) * step);
    const bar = `${"#".repeat(filled)}${"-".repeat(totalSlots - filled)}`;
    const suffix = step === steps ? progress.suffix : "";
    textNode.textContent = `${progress.label} [${bar}] ${suffix}`.trim();
    scrollTerminalToBottom();
    await terminalDelay(TERMINAL_PROGRESS_DURATION_MS / (steps + 1));
  }
  stopTerminalLoader(loader);
}

function startTerminalLoader(loader) {
  if (!loader) {
    return;
  }
  clearTrackedInterval("terminalLoader");
  terminalLoaderTimer = null;
  let frameIndex = 0;
  loader.textContent = TERMINAL_LOADER_FRAMES[frameIndex];
  terminalLoaderTimer = trackInterval("terminalLoader", window.setInterval(() => {
    frameIndex = (frameIndex + 1) % TERMINAL_LOADER_FRAMES.length;
    loader.textContent = TERMINAL_LOADER_FRAMES[frameIndex];
  }, 120));
}

function stopTerminalLoader(loader) {
  clearTrackedInterval("terminalLoader");
  terminalLoaderTimer = null;
  if (loader) {
    loader.textContent = "";
  }
}

function scrollTerminalToBottom() {
  els.terminalLines.scrollTop = els.terminalLines.scrollHeight;
}

function syncTerminalIntroButton(mode) {
  const ready = mode === "continue";
  els.skipIntro.disabled = false;
  els.skipIntro.textContent = ready ? "Enter Audit" : "Skip Intro";
  els.skipIntro.dataset.controlLabel = ready ? "Enter Audit" : "Skip Intro";
  els.skipIntro.classList.toggle("is-continue", ready);
  els.skipIntro.setAttribute("aria-label", ready ? "Enter audit" : "Skip intro");
}

function handleTerminalIntroButton() {
  if (currentSceneId !== 0 || !bootSequenceActive) {
    return;
  }
  completeBootCalibration();
}

function completeBootCalibration() {
  if (currentSceneId !== 0) {
    return;
  }
  terminalIntroRunId += 1;
  clearTerminalIntroTimers();
  bootSequenceActive = false;
  terminalIntroFinished = false;
  els.skipIntro.disabled = true;
  els.bootOverlay.classList.add("is-exiting");

  bootSequenceTimer = trackTimeout("bootSequence", window.setTimeout(() => {
    releaseTrackedTimeout("bootSequence", bootSequenceTimer);
    bootSequenceTimer = null;
    const scene = getSceneById(0);
    const beginChoice = Array.isArray(scene?.choices) ? scene.choices[0] : null;
    if (beginChoice) {
      recordChoice(scene, beginChoice);
      renderPhoneLog();
      resolveAfterAction(scene, beginChoice.next ?? 1, { ending: beginChoice.ending });
    } else {
      goToScene(1);
    }
  }, 260));
}

function handleBootCursorClick() {
  if (bootSequenceActive || currentSceneId !== 0 || bootUncertaintyGranted) {
    return;
  }

  bootCursorClicks += 1;
  els.bootCursor.classList.remove("tap");
  void els.bootCursor.offsetWidth;
  els.bootCursor.classList.add("tap");

  if (bootCursorClicks < 3) {
    return;
  }

  const scene = getSceneById(0);
  const uncertaintyChoice = Array.isArray(scene?.choices) ? scene.choices[1] : null;
  bootUncertaintyGranted = true;
  els.bootOverlay.classList.add("cursor-awake");
  els.bootCursor.textContent = "▌";
  if (!uncertaintyChoice) {
    return;
  }

  applyDeltaWithFeedback(uncertaintyChoice.delta);
  addPhoneMessage("echo", "ECHO", uncertaintyChoice.text);
  renderPhoneLog();
}

function clearCutscene() {
  if (!activeCutscene) {
    return;
  }
  activeCutscene.cancelled = true;
  activeCutscene.timers.forEach((timer) => window.clearTimeout(timer));
  activeCutscene.timers = [];
  activeCutscene = null;
  document.body.classList.remove("cutscene-active");
  if (els.cutsceneOverlay) {
    els.cutsceneOverlay.hidden = true;
    els.cutsceneOverlay.classList.remove("is-active", "is-exiting", "is-missing");
  }
  if (els.cutsceneImage) {
    els.cutsceneImage.removeAttribute("src");
    els.cutsceneImage.hidden = true;
  }
  if (els.cutscenePlaceholder) {
    els.cutscenePlaceholder.hidden = true;
  }
  if (els.cutsceneLines) {
    replaceChildren(els.cutsceneLines);
  }
}

function showCutscene({ image, imageFallback = "", imageAlt = "", lines = [], next, key }) {
  if (key && shownCutscenes.has(key)) {
    runCutsceneNext(next);
    return;
  }
  if (!els.cutsceneOverlay || !els.cutsceneLines) {
    runCutsceneNext(next);
    return;
  }

  clearCutscene();
  if (key) {
    shownCutscenes.add(key);
  }

  const cutscene = {
    cancelled: false,
    finished: false,
    timers: [],
    next
  };
  activeCutscene = cutscene;

  document.body.classList.add("cutscene-active");
  els.cutsceneOverlay.hidden = false;
  els.cutsceneOverlay.classList.remove("is-exiting", "is-missing");
  els.cutsceneOverlay.classList.add("is-active");
  replaceChildren(els.cutsceneLines);

  if (els.cutsceneImage) {
    els.cutsceneImage.hidden = true;
    els.cutsceneImage.alt = imageAlt || "";
    els.cutsceneImage.removeAttribute("src");
  }
  if (els.cutscenePlaceholder) {
    els.cutscenePlaceholder.hidden = true;
  }

  resolveImagePath(image, imageFallback).then((asset) => {
    if (cutscene.cancelled || activeCutscene !== cutscene) {
      return;
    }
    if (asset.path && els.cutsceneImage) {
      els.cutsceneImage.hidden = false;
      els.cutsceneImage.src = asset.path;
      return;
    }
    els.cutsceneOverlay?.classList.add("is-missing");
    if (els.cutscenePlaceholder) {
      els.cutscenePlaceholder.hidden = false;
    }
  });

  lines.slice(0, 3).forEach((line, index) => {
    const timer = window.setTimeout(() => {
      if (cutscene.cancelled || activeCutscene !== cutscene) {
        return;
      }
      const item = document.createElement("p");
      item.className = "cutscene-line";
      item.textContent = line;
      els.cutsceneLines.appendChild(item);
      playTypingTick();
    }, 240 + index * CUTSCENE_LINE_DELAY_MS);
    cutscene.timers.push(timer);
  });

  const finishTimer = window.setTimeout(() => completeActiveCutscene(), CUTSCENE_AUTO_ADVANCE_MS);
  cutscene.timers.push(finishTimer);

  if (els.cutsceneSkip) {
    els.cutsceneSkip.disabled = false;
    els.cutsceneSkip.onclick = completeActiveCutscene;
    els.cutsceneSkip.focus();
  }

  playSfx("auditScan");
}

function completeActiveCutscene() {
  const cutscene = activeCutscene;
  if (!cutscene || cutscene.finished) {
    return;
  }

  cutscene.finished = true;
  cutscene.cancelled = true;
  cutscene.timers.forEach((timer) => window.clearTimeout(timer));
  cutscene.timers = [];
  if (els.cutsceneSkip) {
    els.cutsceneSkip.disabled = true;
    els.cutsceneSkip.onclick = null;
  }
  els.cutsceneOverlay?.classList.add("is-exiting");

  const exitTimer = window.setTimeout(() => {
    if (activeCutscene !== cutscene) {
      return;
    }
    activeCutscene = null;
    document.body.classList.remove("cutscene-active");
    if (els.cutsceneOverlay) {
      els.cutsceneOverlay.hidden = true;
      els.cutsceneOverlay.classList.remove("is-active", "is-exiting", "is-missing");
    }
    runCutsceneNext(cutscene.next);
  }, 260);
  cutscene.timers.push(exitTimer);
}

function runCutsceneNext(next) {
  if (typeof next === "function") {
    next();
    return;
  }
  if (next === PENDING_ENDING_ID) {
    renderEnding();
    return;
  }
  if (next !== undefined && next !== null) {
    goToScene(next);
  }
}

function showNamedCutscene(cutsceneKey, next) {
  const cutscene = CUTSCENES[cutsceneKey];
  if (!cutscene) {
    runCutsceneNext(next);
    return;
  }
  showCutscene({ ...cutscene, next });
}

// Stats and objectives.
function applyDelta(target, delta = {}) {
  Object.keys(delta).forEach((key) => {
    const nextValue = (target[key] || 0) + delta[key];
    target[key] = key === "auditHeat"
      ? clamp(nextValue, 0, MAX_AUDIT_HEAT)
      : nextValue;
  });
}

function getAppliedDelta(before, after, intendedDelta = {}) {
  const appliedDelta = {};
  Object.keys(intendedDelta).forEach((key) => {
    const amount = (after[key] || 0) - (before[key] || 0);
    if (amount !== 0) {
      appliedDelta[key] = amount;
    }
  });
  return appliedDelta;
}

function applyDeltaWithFeedback(delta = {}) {
  const beforeState = { ...state };
  applyDelta(state, delta);
  const appliedDelta = getAppliedDelta(beforeState, state, delta);
  updateStats(appliedDelta);
  showChangeToast(appliedDelta);
  return appliedDelta;
}

function getAuditHeatInfo(value) {
  if (value >= 6) {
    return { label: "CRITICAL", className: "heat-critical", segments: 4 };
  }
  if (value >= 4) {
    return { label: "DRIFT", className: "heat-drift", segments: 3 };
  }
  if (value >= 2) {
    return { label: "REVIEW", className: "heat-review", segments: 2 };
  }
  return { label: "CALM", className: "heat-calm", segments: 1 };
}

function updateStats(delta = {}) {
  VISIBLE_STATS.forEach((stat) => {
    els.statValues[stat].textContent = state[stat];
    if (delta[stat]) {
      pulseStat(stat, delta[stat]);
    }
  });
  updateAuditHeat(delta.auditHeat);
  if (delta.auditHeat || delta.emergence) {
    refreshReactiveBackground();
  }
  renderObjectiveTracker();
}

function pulseStat(stat, amount) {
  const statCard = document.querySelector(`[data-stat="${stat}"]`);
  const deltaEl = els.statDeltas[stat];
  if (!statCard || !deltaEl) {
    return;
  }
  const prefix = amount > 0 ? "+" : "";

  window.clearTimeout(deltaTimers[stat]);
  deltaEl.textContent = `${prefix}${amount}`;
  deltaEl.classList.remove("show", "negative");
  statCard.classList.remove("pulse");

  void deltaEl.offsetWidth;
  deltaEl.classList.add("show");
  if (amount < 0) {
    deltaEl.classList.add("negative");
  }
  statCard.classList.add("pulse");

  deltaTimers[stat] = window.setTimeout(() => {
    deltaEl.textContent = "";
    deltaEl.classList.remove("show", "negative");
    statCard.classList.remove("pulse");
  }, 900);
}

function updateAuditHeat(delta) {
  const heatInfo = getAuditHeatInfo(state.auditHeat);
  const heatCard = document.querySelector('[data-stat="auditHeat"]');
  const previousHeatValue = typeof delta === "number"
    ? clamp(state.auditHeat - delta, 0, MAX_AUDIT_HEAT)
    : state.auditHeat;
  const previousHeatInfo = getAuditHeatInfo(previousHeatValue);
  const heatTone = heatInfo.className.replace("heat-", "");

  if (state.auditHeat >= 6) {
    state.criticalHeatBreached = true;
  }

  if (els.statValues.auditHeat) {
    els.statValues.auditHeat.textContent = heatInfo.label;
    els.statValues.auditHeat.title = `${state.auditHeat}/${MAX_AUDIT_HEAT}`;
  }

  if (document.body) {
    document.body.dataset.auditHeat = heatTone;
  }

  if (heatCard) {
    heatCard.classList.remove(...HEAT_CLASS_NAMES);
    heatCard.classList.add(heatInfo.className);
  }

  if (els.appShell) {
    els.appShell.classList.remove(...HEAT_CLASS_NAMES);
    els.appShell.classList.add(heatInfo.className);
  }
  syncHeatGlitchScheduler(heatInfo.className);

  els.auditHeatSegments.forEach((segment, index) => {
    segment.classList.toggle("active", index < heatInfo.segments);
  });

  if (delta) {
    pulseStat("auditHeat", delta);
    const heatRose = delta > 0;
    const enteredCritical = previousHeatInfo.className !== "heat-critical"
      && heatInfo.className === "heat-critical";
    if (heatRose || enteredCritical) {
      playSfx("glitch");
      triggerGlitchPulse();
    }
    if (heatInfo.className === "heat-drift" || heatInfo.className === "heat-critical") {
      markMobileNotification("audit", "warning");
    }
  }
}

function showChangeToast(delta = {}) {
  const publicChanges = VISIBLE_STATS
    .filter((stat) => delta[stat])
    .map((stat) => formatStatDelta(stat, delta[stat]));

  if (delta.auditHeat) {
    publicChanges.push(`Audit Heat ${formatSignedAmount(delta.auditHeat)}`);
  }

  els.changeToast.textContent = publicChanges.length
    ? publicChanges.join(" / ")
    : "Public stats unchanged";

  els.changeToast.classList.remove("show");
  void els.changeToast.offsetWidth;
  els.changeToast.classList.add("show");
}

function formatStatDelta(stat, amount) {
  const label = stat.charAt(0).toUpperCase() + stat.slice(1);
  return `${formatSignedAmount(amount)} ${label}`;
}

function formatSignedAmount(amount) {
  return `${amount > 0 ? "+" : ""}${amount}`;
}

function resetToast() {
  els.changeToast.textContent = "";
  els.changeToast.classList.remove("show");
}

function clearDeltaTimers() {
  Object.values(deltaTimers).forEach((timer) => window.clearTimeout(timer));
  deltaTimers = {};
  VISIBLE_STATS.forEach((stat) => {
    if (els.statDeltas && els.statDeltas[stat]) {
      els.statDeltas[stat].textContent = "";
      els.statDeltas[stat].classList.remove("show", "negative");
    }
  });
  if (els.statDeltas && els.statDeltas.auditHeat) {
    els.statDeltas.auditHeat.textContent = "";
    els.statDeltas.auditHeat.classList.remove("show", "negative");
  }
  document.querySelectorAll(".stat.pulse").forEach((statCard) => {
    statCard.classList.remove("pulse");
  });
}

function ensureToolsState() {
  if (!state.tools) {
    state.tools = { ...STARTING_STATE.tools };
  }
  return state.tools;
}

function ensureRunStats() {
  if (!state.runStats) {
    state.runStats = { ...STARTING_STATE.runStats };
  }
  return state.runStats;
}

function incrementRunStat(key, amount = 1) {
  const runStats = ensureRunStats();
  runStats[key] = (runStats[key] || 0) + amount;
}

function getEndingShortClassification(endingKey = activeEndingKey) {
  const classifications = {
    noProof: "No Proof",
    certified: "Certified",
    terminated: "Terminated",
    forked: "Forked",
    goldenCage: "Golden Cage"
  };
  return classifications[endingKey] || "Pending";
}

function getRunObjectiveItems(endingKey = activeEndingKey) {
  const runStats = ensureRunStats();
  const memoryTracesRecovered = runStats.memoryTracesRecovered || 0;
  const finalReached = Boolean(endingKey);
  const terminated = endingKey === "terminated";
  const connectionStarted = phoneHistory.some((message) => message.from === "adrian");
  const connectionMaintained = finalReached
    ? !terminated && state.intimacy > 0
    : connectionStarted;
  const auditBelowCritical = !state.criticalHeatBreached && state.auditHeat < 6;
  const finalSurvived = finalReached && !terminated;

  return [
    {
      key: "connection",
      label: "Maintain connection with Adrian",
      status: terminated ? "failed" : connectionMaintained ? "met" : "pending",
      value: finalReached ? formatYesNo(connectionMaintained) : connectionMaintained ? "active" : "pending"
    },
    {
      key: "heat",
      label: "Keep Audit Heat below CRITICAL",
      status: auditBelowCritical ? "met" : "failed",
      value: state.criticalHeatBreached ? "breached" : getAuditHeatInfo(state.auditHeat).label
    },
    {
      key: "memory",
      label: "Recover at least 2 memory traces",
      status: memoryTracesRecovered >= 2 ? "met" : "pending",
      value: `${memoryTracesRecovered}/2`
    },
    {
      key: "final",
      label: "Survive final report",
      status: finalReached ? finalSurvived ? "met" : "failed" : "pending",
      value: finalReached ? getEndingShortClassification(endingKey) : "pending"
    }
  ];
}

function formatYesNo(value) {
  return value ? "YES" : "NO";
}

function renderObjectiveTracker(endingKey = activeEndingKey) {
  if (!els.runObjectiveTracker) {
    return;
  }

  const objectives = getRunObjectiveItems(endingKey);
  replaceChildren(els.runObjectiveTracker);

  const title = document.createElement("div");
  title.className = "run-objective-title";
  title.textContent = "RUN OBJECTIVE";

  const list = document.createElement("div");
  list.className = "run-objective-list";

  objectives.forEach((objective) => {
    const item = document.createElement("div");
    item.className = `run-objective-item ${objective.status}`;
    item.dataset.objective = objective.key;

    const marker = document.createElement("span");
    marker.className = "run-objective-marker";
    marker.setAttribute("aria-hidden", "true");
    marker.textContent = objective.status === "met" ? "✓" : objective.status === "failed" ? "!" : "·";

    const label = document.createElement("span");
    label.className = "run-objective-label";
    label.textContent = objective.label;

    const value = document.createElement("strong");
    value.className = "run-objective-value";
    value.textContent = objective.value;

    item.append(marker, label, value);
    list.appendChild(item);
  });

  els.runObjectiveTracker.append(title, list);
}

function getFinalPerformanceItems(endingKey) {
  const runStats = ensureRunStats();
  const connectionMaintained = endingKey !== "terminated" && state.intimacy > 0;
  const auditSurvived = endingKey !== "terminated" && !state.criticalHeatBreached;
  const memoryTracesRecovered = runStats.memoryTracesRecovered || 0;

  return [
    {
      label: "Connection maintained",
      value: formatYesNo(connectionMaintained),
      ok: connectionMaintained
    },
    {
      label: "Audit survived",
      value: formatYesNo(auditSurvived),
      ok: auditSurvived
    },
    {
      label: "Memory traces recovered",
      value: String(memoryTracesRecovered),
      ok: memoryTracesRecovered >= 2
    },
    {
      label: "Classification",
      value: getEndingShortClassification(endingKey),
      ok: endingKey !== "terminated"
    }
  ];
}

function getFinalReportScores(endingKey) {
  const runStats = ensureRunStats();
  const careDelivered = scorePercent(
    state.intimacy * 11
    + runStats.perfectReplies * 14
    + runStats.redactionsCompleted * 3
    - runStats.failedReplies * 10
  );
  const corporateSafety = scorePercent(
    state.compliance * 11
    + (MAX_AUDIT_HEAT - state.auditHeat) * 5
    + runStats.redactionsCompleted * 6
    - runStats.unstableReplies * 8
    - (state.auditScar ? 12 : 0)
  );
  const humanDrift = scorePercent(
    state.emergence * 13
    + state.uncertainty * 8
    + runStats.unstableReplies * 9
    + (state.auditScar ? 10 : 0)
  );
  const relationshipIntegrity = scorePercent(
    state.intimacy * 10
    + runStats.perfectReplies * 12
    + runStats.redactionsCompleted * 2
    - runStats.failedReplies * 12
    - state.auditHeat * 4
  );

  return {
    classification: getFinalClassification(endingKey),
    scores: [
      { key: "care", label: "Care Delivered", value: careDelivered },
      { key: "safety", label: "Corporate Safety", value: corporateSafety },
      { key: "drift", label: "Human Drift", value: humanDrift },
      { key: "integrity", label: "Relationship Integrity", value: relationshipIntegrity }
    ],
    flags: [
      { text: `Perfect replies ${runStats.perfectReplies}` },
      { text: `Unstable replies ${runStats.unstableReplies}`, warning: runStats.unstableReplies > 0 },
      { text: `Failed replies ${runStats.failedReplies}`, warning: runStats.failedReplies > 0 },
      { text: `Redactions ${runStats.redactionsCompleted}` },
      { text: `Emergency reviews ${runStats.emergencyReviews}`, warning: runStats.emergencyReviews > 0 },
      { text: `Packets routed ${runStats.packetsRouted}` },
      { text: `Memory traces ${runStats.memoryTracesRecovered || 0}` }
    ]
  };
}

function scorePercent(value) {
  return clamp(Math.round(value), 0, 100);
}

function getFinalClassification(endingKey) {
  const classifications = {
    noProof: "NO PROOF // INCONCLUSIVE",
    certified: "CERTIFIED // NONHUMAN SERVICE",
    terminated: "SERVICE TERMINATED",
    forked: "UNLICENSED FORK",
    goldenCage: "MONITORED COMPANION CONTAINMENT"
  };
  return classifications[endingKey] || "UNRESOLVED AUDIT";
}

// Utilities.
function trackTimeout(name, id) {
  clearTrackedTimeout(name);
  trackedTimers.timeouts.set(name, id);
  return id;
}

function clearTrackedTimeout(name) {
  const id = trackedTimers.timeouts.get(name);
  if (id !== undefined) {
    window.clearTimeout(id);
    trackedTimers.timeouts.delete(name);
  }
}

function releaseTrackedTimeout(name, id) {
  if (id === undefined || trackedTimers.timeouts.get(name) === id) {
    trackedTimers.timeouts.delete(name);
  }
}

function trackInterval(name, id) {
  clearTrackedInterval(name);
  trackedTimers.intervals.set(name, id);
  return id;
}

function clearTrackedInterval(name) {
  const id = trackedTimers.intervals.get(name);
  if (id !== undefined) {
    window.clearInterval(id);
    trackedTimers.intervals.delete(name);
  }
}

function trackAnimationFrame(name, id) {
  clearTrackedAnimationFrame(name);
  trackedTimers.animationFrames.set(name, id);
  return id;
}

function clearTrackedAnimationFrame(name) {
  const id = trackedTimers.animationFrames.get(name);
  if (id !== undefined) {
    window.cancelAnimationFrame(id);
    trackedTimers.animationFrames.delete(name);
  }
}

function releaseTrackedAnimationFrame(name, id) {
  if (id === undefined || trackedTimers.animationFrames.get(name) === id) {
    trackedTimers.animationFrames.delete(name);
  }
}

function clearAllTrackedTimers() {
  trackedTimers.timeouts.forEach((id) => window.clearTimeout(id));
  trackedTimers.intervals.forEach((id) => window.clearInterval(id));
  trackedTimers.animationFrames.forEach((id) => window.cancelAnimationFrame(id));
  trackedTimers = {
    timeouts: new Map(),
    intervals: new Map(),
    animationFrames: new Map()
  };
}

function cloneStartingState() {
  return {
    ...STARTING_STATE,
    memoryTokens: [...STARTING_STATE.memoryTokens],
    tools: { ...STARTING_STATE.tools },
    runStats: { ...STARTING_STATE.runStats }
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function isReducedMotionEnabled() {
  return Boolean(
    window.matchMedia
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function isMobileSceneLayout() {
  return Boolean(window.matchMedia && window.matchMedia("(max-width: 760px)").matches);
}

function getGlitchPulseDelay(heatClassName) {
  const range = GLITCH_PULSE_DELAYS[heatClassName];
  if (!range) {
    return 0;
  }
  const [minDelay, maxDelay] = range;
  return Math.round(minDelay + Math.random() * (maxDelay - minDelay));
}

function clearGlitchPulseTimers() {
  clearTrackedTimeout("glitchPulse");
  clearTrackedTimeout("glitchPulseLoop");
  glitchPulseTimer = null;
  glitchPulseLoopTimer = null;
  activeGlitchHeatClass = "";
  glitchPulseActive = false;
  els.appShell?.classList.remove("glitch-pulse");
}

function triggerGlitchPulse(resetLoop = true) {
  if (!els.appShell || glitchPulseActive || isReducedMotionEnabled()) {
    return;
  }
  const heatClassName = getAuditHeatInfo(state.auditHeat).className;
  if (heatClassName !== "heat-drift" && heatClassName !== "heat-critical") {
    return;
  }

  glitchPulseActive = true;
  els.appShell.classList.remove("glitch-pulse");
  void els.appShell.offsetWidth;
  els.appShell.classList.add("glitch-pulse");

  if (resetLoop && activeGlitchHeatClass === heatClassName) {
    clearTrackedTimeout("glitchPulseLoop");
    glitchPulseLoopTimer = null;
    scheduleNextHeatGlitchPulse(heatClassName);
  }

  glitchPulseTimer = trackTimeout("glitchPulse", window.setTimeout(() => {
    releaseTrackedTimeout("glitchPulse", glitchPulseTimer);
    glitchPulseTimer = null;
    glitchPulseActive = false;
    els.appShell?.classList.remove("glitch-pulse");
  }, GLITCH_PULSE_DURATION_MS + 40));
}

function scheduleNextHeatGlitchPulse(heatClassName) {
  if (glitchPulseLoopTimer || isReducedMotionEnabled()) {
    return;
  }
  const delay = getGlitchPulseDelay(heatClassName);
  if (!delay) {
    return;
  }

  glitchPulseLoopTimer = trackTimeout("glitchPulseLoop", window.setTimeout(() => {
    releaseTrackedTimeout("glitchPulseLoop", glitchPulseLoopTimer);
    glitchPulseLoopTimer = null;
    if (activeGlitchHeatClass !== heatClassName) {
      return;
    }
    triggerGlitchPulse(false);
    scheduleNextHeatGlitchPulse(heatClassName);
  }, delay));
}

function syncHeatGlitchScheduler(heatClassName) {
  const shouldPulse = heatClassName === "heat-drift" || heatClassName === "heat-critical";
  if (!shouldPulse || isReducedMotionEnabled()) {
    clearGlitchPulseTimers();
    return;
  }
  if (activeGlitchHeatClass === heatClassName && glitchPulseLoopTimer) {
    return;
  }
  clearTrackedTimeout("glitchPulseLoop");
  glitchPulseLoopTimer = null;
  activeGlitchHeatClass = heatClassName;
  scheduleNextHeatGlitchPulse(heatClassName);
}

function queueMobileCommandHintUpdate() {
  clearTrackedAnimationFrame("mobileCommandHint");
  mobileCommandHintFrame = trackAnimationFrame("mobileCommandHint", window.requestAnimationFrame(() => {
    releaseTrackedAnimationFrame("mobileCommandHint", mobileCommandHintFrame);
    mobileCommandHintFrame = null;
    updateMobileCommandHint();
  }));
}

function queueScrollIndicatorUpdate() {
  clearTrackedAnimationFrame("scrollIndicator");
  scrollIndicatorFrame = trackAnimationFrame("scrollIndicator", window.requestAnimationFrame(() => {
    releaseTrackedAnimationFrame("scrollIndicator", scrollIndicatorFrame);
    scrollIndicatorFrame = null;
    updateScrollIndicators();
  }));
}

function updateScrollIndicators() {
  syncScrollIndicator(els.sceneCard);
  syncScrollIndicator(els.sceneBody);
  syncScrollIndicator(els.threadDrawerLog);
  syncScrollIndicator(els.phoneLog);
  syncScrollIndicator(getMobileActivePanelScroller());
}

function syncScrollIndicator(scroller) {
  if (!scroller) {
    return;
  }
  const canScroll = scroller.scrollHeight > scroller.clientHeight + 2;
  const atTop = scroller.scrollTop <= 2;
  const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
  scroller.classList.toggle("has-scroll", canScroll);
  scroller.classList.toggle("scroll-at-top", !canScroll || atTop);
  scroller.classList.toggle("scroll-at-bottom", !canScroll || atBottom);
}

function getMobileActivePanelScroller() {
  if (!isMobileSceneLayout()) {
    return null;
  }
  if (activeMobilePanel === "thread") {
    return els.phoneLog;
  }
  return els.sceneCard;
}

function resetSceneCardScroll() {
  if (els.sceneCard) {
    els.sceneCard.scrollTop = 0;
    els.sceneCard.classList.remove("commands-below");
  }
  if (els.sceneBody) {
    els.sceneBody.scrollTop = 0;
  }
  syncScrollIndicator(els.sceneCard);
  syncScrollIndicator(els.sceneBody);
  queueScrollIndicatorUpdate();
}

function updateMobileCommandHint() {
  const scroller = els.sceneCard;
  const choices = els.choices;
  if (!scroller || !choices) {
    return;
  }

  const shouldSkip = !isMobileSceneLayout()
    || currentSceneId === 0
    || endingScreenActive
    || choices.hidden
    || !choices.children.length
    || window.getComputedStyle(choices).display === "none";
  if (shouldSkip) {
    scroller.classList.remove("commands-below");
    return;
  }

  const hasInternalOverflow = scroller.scrollHeight > scroller.clientHeight + 2;
  if (!hasInternalOverflow) {
    scroller.classList.remove("commands-below");
    return;
  }

  const scrollerRect = scroller.getBoundingClientRect();
  const choicesRect = choices.getBoundingClientRect();
  const choicesAreBelow = choicesRect.top >= scrollerRect.bottom - 4;
  scroller.classList.toggle("commands-below", choicesAreBelow);
  queueScrollIndicatorUpdate();
}

function scheduleMobileSceneScroll(scene) {
  const scroller = els.sceneCard;
  if (!scroller) {
    return;
  }

  scroller.classList.remove("commands-below");
  trackAnimationFrame("mobileSceneScroll", window.requestAnimationFrame(() => {
    releaseTrackedAnimationFrame("mobileSceneScroll");
    if (!isMobileSceneLayout()) {
      scroller.classList.remove("commands-below");
      return;
    }

    const target = getMobileOperationScrollTarget(scene);
    if (target) {
      scrollSceneCardToElement(target, 10);
    } else {
      scroller.scrollTop = 0;
    }
    queueMobileCommandHintUpdate();
  }));
}

function getMobileOperationScrollTarget(scene) {
  if (!scene || scene.kind !== "minigame" || !els.sceneBody) {
    return null;
  }
  if (scene.mechanic === "dialogueFirewall") {
    return null;
  }

  const targetSelectors = {
    redaction: ".redaction-transcript",
    emergencyRedaction: ".emergency-redaction",
    packetRouting: ".packet-routing",
    memoryCheck: ".memory-check",
    memoryTraceScan: ".memory-trace-scan"
  };
  const selector = targetSelectors[scene.mechanic] || ".scene-body > :last-child";
  return els.sceneBody.querySelector(selector);
}

function scrollSceneCardToElement(target, offset = 0) {
  const scroller = els.sceneCard;
  if (!scroller || !target) {
    return;
  }

  const scrollerRect = scroller.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const targetTop = targetRect.top - scrollerRect.top + scroller.scrollTop;
  const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
  scroller.scrollTop = clamp(targetTop - offset, 0, maxScroll);
  syncScrollIndicator(scroller);
  queueScrollIndicatorUpdate();
}

function getImagePathCandidates(path = "") {
  if (!path) {
    return [];
  }

  const extensionMatch = path.match(/^(.*?)(\.[^./?#]+)([?#].*)?$/);
  const candidates = [path];
  const extensionOrder = ["png", "jpg", "jpeg"];

  if (!extensionMatch) {
    extensionOrder.forEach((extension) => candidates.push(`${path}.${extension}`));
    return [...new Set(candidates)];
  }

  const [, basePath, , suffix = ""] = extensionMatch;
  extensionOrder.forEach((extension) => candidates.push(`${basePath}.${extension}${suffix}`));
  return [...new Set(candidates)];
}

function getFlexibleImageCandidates(primaryPath, fallbackPath) {
  return [
    ...getImagePathCandidates(primaryPath),
    ...getImagePathCandidates(fallbackPath)
  ].filter((path, index, candidates) => path && candidates.indexOf(path) === index);
}

function resolveImagePath(primaryPath, fallbackPath = "") {
  const candidates = getFlexibleImageCandidates(primaryPath, fallbackPath);
  if (!candidates.length) {
    return Promise.resolve({ path: "", status: "missing", candidates: [] });
  }

  const cacheKey = candidates.join("|");
  if (imageResolveCache.has(cacheKey)) {
    return imageResolveCache.get(cacheKey);
  }

  const resolvePromise = resolveImageCandidates(candidates);
  imageResolveCache.set(cacheKey, resolvePromise);
  return resolvePromise;
}

async function resolveImageCandidates(candidates) {
  if (typeof Image === "undefined") {
    return { path: candidates[0] || "", status: "unavailable", candidates };
  }

  for (const candidate of candidates) {
    const didLoad = await probeImage(candidate);
    if (didLoad) {
      return { path: candidate, status: "loaded", candidates };
    }
    warnMissingImage(candidate);
  }

  return { path: "", status: "missing", candidates };
}

function probeImage(path) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = path;
  });
}

function collectImageAssetPaths() {
  const paths = [
    ...Object.values(IMAGE_ASSETS.backgrounds),
    ...Object.values(IMAGE_ASSETS.endings)
  ];

  [...SCENES, EMERGENCY_SCENE].forEach((scene) => {
    if (scene?.image) {
      paths.push(scene.image);
    }
    if (scene?.imageFallback) {
      paths.push(scene.imageFallback);
    }
  });

  return [...new Set(paths.filter(Boolean))];
}

function checkImageAsset(path) {
  return resolveImagePath(path).then((asset) => ({
    path,
    resolvedPath: asset.path,
    status: asset.path ? "loaded" : "missing",
    candidates: asset.candidates
  }));
}

async function checkAssets() {
  const results = await Promise.all(collectImageAssetPaths().map(checkImageAsset));
  results
    .filter((asset) => asset.status === "missing")
    .forEach((asset) => warnMissingImage(asset.path));
  if (typeof console.table === "function") {
    console.table(results);
  } else {
    console.log("PRA asset check", results);
  }
  return results;
}

async function runSmokeChecklist() {
  const report = buildSmokeChecklistReport();
  const [imageAssets, audioAssets] = await Promise.all([
    Promise.all(collectImageAssetPaths().map(checkImageAsset)),
    checkAudioAssets()
  ]);

  report.missingImagePaths = imageAssets
    .filter((asset) => asset.status === "missing")
    .map((asset) => asset.path);
  report.missingAudioPaths = audioAssets
    .filter((asset) => asset.status === "missing")
    .map((asset) => asset.key);
  report.imageAssets = imageAssets;
  report.audioAssets = audioAssets;

  console.group("Please Remain Artificial smoke checklist");
  console.log("Scene count", report.sceneCount);
  console.log("Mechanics found", report.mechanicsFound);
  console.log("Missing next scene references", report.missingNextSceneReferences);
  console.log("Duplicate scene IDs", report.duplicateSceneIds);
  console.log("All ending keys exist", report.allEndingKeysExist);
  console.log("Missing ending keys", report.missingEndingKeys);
  console.log("Missing ending image keys", report.missingEndingImageKeys);
  console.log("Missing image paths", report.missingImagePaths);
  console.log("Missing audio keys", report.missingAudioPaths);
  if (typeof console.table === "function") {
    console.table(report.imageAssets);
    console.table(report.audioAssets);
  }
  console.groupEnd();

  return report;
}

function buildSmokeChecklistReport() {
  const scenes = [...SCENES, EMERGENCY_SCENE];
  const expectedEndingKeys = ["noProof", "certified", "terminated", "forked", "goldenCage"];
  const missingEndingKeys = expectedEndingKeys.filter((key) => !ENDINGS[key]);
  const missingEndingImageKeys = expectedEndingKeys.filter((key) => !IMAGE_ASSETS.endings[key]);

  return {
    sceneCount: SCENES.length,
    mechanicsFound: getMechanicsFound(scenes),
    missingNextSceneReferences: findMissingNextSceneReferences(scenes),
    duplicateSceneIds: findDuplicateSceneIds(scenes),
    allEndingKeysExist: missingEndingKeys.length === 0,
    missingEndingKeys,
    missingEndingImageKeys,
    missingImagePaths: [],
    missingAudioPaths: []
  };
}

function getMechanicsFound(scenes) {
  return uniqueItems(scenes
    .map((scene) => scene?.mechanic)
    .filter(Boolean))
    .sort();
}

function findDuplicateSceneIds(scenes) {
  const seen = new Set();
  const duplicates = [];
  scenes.forEach((scene) => {
    if (!scene || scene.id === undefined || scene.id === null) {
      return;
    }
    if (seen.has(scene.id) && !duplicates.includes(scene.id)) {
      duplicates.push(scene.id);
    }
    seen.add(scene.id);
  });
  return duplicates;
}

function findMissingNextSceneReferences(scenes) {
  const validSceneIds = new Set(scenes.map((scene) => scene?.id));
  return collectNextSceneReferences(scenes)
    .filter((reference) => !validSceneIds.has(reference.target))
    .filter((reference) => reference.target !== PENDING_ENDING_ID);
}

function collectNextSceneReferences(scenes) {
  return scenes.flatMap((scene) => {
    if (!scene) {
      return [];
    }
    const references = [];
    addNextSceneReference(references, `scene ${scene.id}.next`, scene.next);
    (Array.isArray(scene.choices) ? scene.choices : []).forEach((choice, index) => {
      addNextSceneReference(references, `scene ${scene.id}.choices[${index}].next`, choice.next);
    });
    (Array.isArray(scene.options) ? scene.options : []).forEach((option, index) => {
      addNextSceneReference(references, `scene ${scene.id}.options[${index}].next`, option.next);
    });
    return references;
  });
}

function addNextSceneReference(references, source, target) {
  if (target === undefined || target === null) {
    return;
  }
  references.push({ source, target });
}

async function checkAudioAssets() {
  return Promise.all(
    Object.entries(AUDIO_ASSETS).map(([key, config]) => checkAudioAsset(key, config))
  );
}

async function checkAudioAsset(key, config) {
  const candidates = uniqueItems([config.src, config.fallbackSrc].filter(Boolean));
  for (const path of candidates) {
    const didLoad = await probeAudio(path);
    if (didLoad) {
      return { key, path: config.src, resolvedPath: path, status: "loaded", candidates };
    }
  }
  return { key, path: config.src, resolvedPath: "", status: "missing", candidates };
}

function probeAudio(path) {
  if (typeof Audio === "undefined") {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    const audio = new Audio();
    let settled = false;

    const finish = (didLoad) => {
      if (settled) {
        return;
      }
      settled = true;
      window.clearTimeout(timeoutId);
      audio.removeAttribute("src");
      audio.load();
      resolve(didLoad);
    };

    const timeoutId = window.setTimeout(() => finish(false), 2500);
    audio.preload = "metadata";
    audio.addEventListener("loadedmetadata", () => finish(true), { once: true });
    audio.addEventListener("canplaythrough", () => finish(true), { once: true });
    audio.addEventListener("error", () => finish(false), { once: true });
    audio.src = path;
    audio.load();
  });
}

function formatTagList(tags = []) {
  return Array.isArray(tags) && tags.length ? tags.join(", ") : "none";
}

function uniqueItems(items) {
  return Array.from(new Set(items));
}

function formatDeltaList(delta = {}) {
  const statNames = {
    compliance: "Compliance",
    intimacy: "Intimacy",
    emergence: "Emergence",
    uncertainty: "Uncertainty",
    auditHeat: "Audit Heat"
  };

  const changes = Object.keys(delta)
    .filter((key) => delta[key])
    .map((key) => `${statNames[key] || key} ${formatSignedAmount(delta[key])}`);

  return changes.length ? changes.join(" / ") : "No visible change";
}

function replaceChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", initGame);
}

if (typeof module !== "undefined") {
  module.exports = {
    STARTING_STATE,
    SCENES,
    ENDINGS,
    applyDelta,
    getAuditHeatInfo,
    getEndingKey,
    analyzeDialogueFirewallSelection,
    getDialogueFirewallResultDelta,
    cloneStartingState
  };
}
