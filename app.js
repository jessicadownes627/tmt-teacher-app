import { getTopLegacyFilteredHeadlines } from "./legacy/tmtHeadlineFilter.js";

const rssFeeds = [
  {
    name: "NASA",
    url: "https://www.nasa.gov/rss/dyn/breaking_news.rss",
    tier: "core",
  },
  {
    name: "ScienceDaily",
    url: "https://www.sciencedaily.com/rss/top/science.xml",
    tier: "core",
  },
  {
    name: "BBC Science & Environment",
    url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
    tier: "core",
  },
  {
    name: "Science News for Students",
    url: "https://www.snexplores.org/feed",
    tier: "secondary",
  },
  {
    name: "KidsNews",
    url: "https://www.kidsnews.com.au/feed",
    tier: "secondary",
  },
  {
    name: "Science Journal for Kids",
    url: "https://www.sciencejournalforkids.org/feed",
    tier: "secondary",
  },
  {
    name: "Google News Science",
    url: "https://news.google.com/rss/headlines/section/topic/SCIENCE?hl=en-US&gl=US&ceid=US:en",
    tier: "discovery",
  },
  {
    name: "Google News World",
    url: "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en",
    tier: "discovery",
  },
];

const writingPrompts = [
  "Write one sentence explaining your opinion.",
  "Give one reason to support your idea.",
];

const legacyTopicsByMode = {
  "3-5": [
    "Environment & Climate 🌍",
    "Tech & Gadgets 💻",
    "AI & Future Tech 🤖",
    "Film 🎬",
    "TV Shows 📺",
    "Music 🎶",
    "Gaming 🎮",
    "Baseball ⚾",
    "Football 🏈",
    "Basketball 🏀",
    "Hockey 🏒",
    "Olympics 🏅",
    "Concert Tours 🎤",
    "Festivals 🎪",
    "Trending Events 🎉",
    "Wildcard 🃏",
    "Space & UFOs 🛸",
  ],
  "6-8": [
    "Environment & Climate 🌍",
    "Tech & Gadgets 💻",
    "AI & Future Tech 🤖",
    "Film 🎬",
    "TV Shows 📺",
    "Music 🎶",
    "Gaming 🎮",
    "Viral & Memes 📱",
    "Book Buzz 📚",
    "Art & Museums 🖼️",
    "Baseball ⚾",
    "Football 🏈",
    "Basketball 🏀",
    "Hockey 🏒",
    "Olympics 🏅",
    "Concert Tours 🎤",
    "Festivals 🎪",
    "Trending Events 🎉",
    "Wildcard 🃏",
    "Space & UFOs 🛸",
  ],
  esl: [
    "Environment & Climate 🌍",
    "Tech & Gadgets 💻",
    "AI & Future Tech 🤖",
    "Film 🎬",
    "TV Shows 📺",
    "Music 🎶",
    "Gaming 🎮",
    "Baseball ⚾",
    "Football 🏈",
    "Basketball 🏀",
    "Hockey 🏒",
    "Olympics 🏅",
    "Concert Tours 🎤",
    "Festivals 🎪",
    "Trending Events 🎉",
    "Wildcard 🃏",
    "Space & UFOs 🛸",
  ],
};

const fallbackHeadlines = [
  {
    source: "First Five",
    title: "Short brain breaks can help students refocus",
    link: "",
    isFallback: true,
  },
  {
    source: "First Five",
    title: "New tools are helping clean plastic from water",
    link: "",
    isFallback: true,
  },
  {
    source: "First Five",
    title: "AI tools are changing how people write",
    link: "",
    isFallback: true,
  },
  {
    source: "First Five",
    title: "Teams are using replay to practice in new ways",
    link: "",
    isFallback: true,
  },
  {
    source: "First Five",
    title: "Popular shows can shape what people wear and share",
    link: "",
    isFallback: true,
  },
];

const preferredConcepts = [
  {
    label: "space discovery",
    keywords: ["space", "planet", "moon", "mars", "nasa", "rocket", "astronaut", "telescope"],
  },
  {
    label: "animal behavior",
    keywords: ["animal", "bird", "dog", "cat", "ocean", "species", "wildlife", "zoo"],
  },
  {
    label: "environmental change",
    keywords: ["climate", "earth", "forest", "recycle", "plastic", "river", "ocean", "weather"],
  },
  {
    label: "new technology",
    keywords: ["ai", "robot", "technology", "device", "computer", "tool", "app"],
  },
  {
    label: "science discovery",
    keywords: ["science", "research", "study", "scientist", "discovery", "energy", "health", "camera", "physics", "light", "second"],
  },
  {
    label: "creative invention",
    keywords: ["invent", "design", "build", "create", "innovation", "engineering"],
  },
  {
    label: "sports moment",
    keywords: ["sports", "game", "team", "player", "players", "coach", "match", "score", "season", "athlete", "athletes"],
  },
  {
    label: "pop culture trend",
    keywords: ["movie", "show", "music", "song", "video", "fans", "trend", "viral", "celebrity", "character", "fashion"],
  },
  {
    label: "human behavior",
    keywords: ["habit", "habits", "helping", "friends", "friend", "focus", "behavior", "choices", "community", "kindness"],
  },
];

const blockedTerms = [
  "war",
  "weapon",
  "missile",
  "attack",
  "killed",
  "death",
  "dead",
  "murder",
  "shooting",
  "bomb",
  "conflict",
  "election",
  "senate",
  "parliament",
  "president",
  "prime minister",
  "protest",
  "military",
  "army",
  "hostage",
];

const elementaryBlockedTerms = [
  "obesity",
  "drug",
  "drugs",
  "insurance",
  "hospital",
  "disease",
  "virus",
  "debt",
  "tax",
  "policy",
  "policies",
  "economy",
  "economic",
  "market",
  "inflation",
  "bank",
  "lawsuit",
  "court",
  "crime",
  "prison",
  "border",
  "refugee",
  "refugees",
  "migrant",
  "migrants",
  "immigration",
  "immigrant",
  "crisis",
  "disaster",
  "famine",
  "sanction",
  "sanctions",
  "government",
  "minister",
  "leader",
  "leaders",
  "vote",
  "voting",
  "rights",
  "protest",
  "strike",
  "poverty",
  "homeless",
  "racism",
  "racist",
  "gender",
  "abortion",
  "police",
  "jail",
  "trauma",
  "mental health",
  "depression",
  "anxiety",
];

const middleBlockedTerms = [
  "suicide",
  "overdose",
  "abuse",
  "trafficking",
  "terror",
  "graphic",
  "tariff",
  "tariffs",
  "institution",
  "institutions",
];

const elementaryAllowedConcepts = new Set([
  "animal behavior",
  "space discovery",
  "environmental change",
  "new technology",
  "creative invention",
  "sports moment",
  "pop culture trend",
  "human behavior",
]);

const middleAllowedConcepts = new Set([
  "animal behavior",
  "space discovery",
  "environmental change",
  "new technology",
  "science discovery",
  "creative invention",
  "sports moment",
  "pop culture trend",
  "human behavior",
]);

const blockedCountryTerms = [
  "afghanistan",
  "africa",
  "argentina",
  "asia",
  "australia",
  "brazil",
  "canada",
  "china",
  "europe",
  "france",
  "gaza",
  "germany",
  "haiti",
  "india",
  "iran",
  "iraq",
  "israel",
  "italy",
  "japan",
  "korea",
  "mexico",
  "palestine",
  "russia",
  "sudan",
  "syria",
  "taiwan",
  "uk",
  "ukraine",
  "united kingdom",
  "united states",
  "us ",
  "u.s.",
];

const adultSystemTerms = [
  "policy",
  "policies",
  "government",
  "department",
  "agency",
  "tariff",
  "tariffs",
  "economy",
  "economic",
  "insurance",
  "institution",
  "institutions",
  "federal",
  "state",
  "law",
  "laws",
  "regulation",
  "regulations",
  "budget",
  "trade",
  "market",
];

const lowValueAnnouncementTerms = [
  "replaces",
  "replacement",
  "appointed",
  "appoints",
  "appoint",
  "named",
  "promotion",
  "promoted",
  "ceo",
  "executive",
  "president",
  "chair",
  "chief",
  "launches new lineup",
  "quarterly results",
  "earnings",
  "merger",
  "acquisition",
  "deal",
  "partnership",
  "announces",
  "announcement",
  "debuts",
  "unveils",
  "rebrand",
  "streaming service",
  "box office",
];

const state = {
  mode: "",
  esl: false,
  feedItems: [],
  currentIndex: -1,
  cardCount: 0,
  recentCategories: [],
  recentFollowUps: [],
  debug: null,
};

const entryScreen = document.querySelector("#entryScreen");
const cardScreen = document.querySelector("#cardScreen");
const feedStatus = document.querySelector("#feedStatus");
const modeBadge = document.querySelector("#modeBadge");
const curationBadge = document.querySelector("#curationBadge");
const discussionCard = document.querySelector("#discussionCard");
const cardTitle = document.querySelector("#cardTitle");
const whyItMatters = document.querySelector("#whyItMatters");
const sourceLine = document.querySelector("#sourceLine");
const realHeadline = document.querySelector("#realHeadline");
const sourceMeta = document.querySelector("#sourceMeta");
const sourceLink = document.querySelector("#sourceLink");
const mainQuestion = document.querySelector("#mainQuestion");
const followUpsList = document.querySelector("#followUps");
const quickWrite = document.querySelector("#quickWrite");
const paywallNote = document.querySelector("#paywallNote");
const curriculumLabel = document.querySelector("#curriculumLabel");
const eslButton = document.querySelector("#eslButton");
const followUpTemplate = document.querySelector("#followUpTemplate");
const teacherMove = document.querySelector("#teacherMove");
const debugOutput = document.querySelector("#debugOutput");

const modeLabels = {
  "3-5": "Grades 3–5",
  "6-8": "Grades 6–8",
  esl: "Sentence starters",
};

const textRules = {
  "3-5": {
    maxWords: 5,
  },
  "6-8": {
    maxWords: 7,
  },
  esl: {
    maxWords: 4,
  },
};

const teacherMoves = [
  "If answers are short, ask: 'Can you give an example?'",
  "If students agree, ask: 'Does anyone disagree?'",
  "If discussion slows, ask: 'Would you do this?'",
  "If one student shares, ask: 'Who sees it differently?'",
];

const recentHeadlineStorageKey = "first-five-recent-headlines";
const recentHeadlineWindowMs = 48 * 60 * 60 * 1000;

const sourcePriority = {
  NASA: 5,
  ScienceDaily: 5,
  "Science News for Students": 5,
  "BBC Science & Environment": 5,
  "Science Journal for Kids": 5,
  KidsNews: 4,
  "Google News Science": 1,
  "Google News World": 1,
  "First Five": 3,
};

const approvedClassroomSources = new Set([
  "NASA",
  "ScienceDaily",
  "Science News for Students",
  "BBC Science & Environment",
  "Science Journal for Kids",
  "KidsNews",
  "First Five",
]);

const highValueSources = new Set([
  "NASA",
  "ScienceDaily",
  "Science News for Students",
  "BBC Science & Environment",
  "Science Journal for Kids",
  "KidsNews",
]);

const lowValueSourceTerms = [
  "celebrity",
  "music business",
  "album rollout",
  "label",
  "promo",
  "promotional",
  "box office",
  "tour struggles",
  "viral moment",
  "streaming",
  "industry gossip",
];

function sample(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function sentenceCase(text) {
  if (!text) {
    return "";
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
}

function hashHeadlineTitle(title) {
  return normalizeHeadline(title || "").toLowerCase();
}

function getRecentHeadlineMap() {
  try {
    const raw = localStorage.getItem(recentHeadlineStorageKey);
    const parsed = raw ? JSON.parse(raw) : {};
    const cutoff = Date.now() - recentHeadlineWindowMs;
    const cleaned = Object.fromEntries(
      Object.entries(parsed).filter(([, timestamp]) => typeof timestamp === "number" && timestamp >= cutoff)
    );

    if (JSON.stringify(cleaned) !== JSON.stringify(parsed)) {
      localStorage.setItem(recentHeadlineStorageKey, JSON.stringify(cleaned));
    }

    return cleaned;
  } catch {
    return {};
  }
}

function rememberHeadline(title) {
  const headlineKey = hashHeadlineTitle(title);
  if (!headlineKey) {
    return;
  }

  const recentMap = getRecentHeadlineMap();
  recentMap[headlineKey] = Date.now();

  try {
    localStorage.setItem(recentHeadlineStorageKey, JSON.stringify(recentMap));
  } catch {}
}

function removeRecentlySeenHeadlines(items, minCount = 4) {
  const recentMap = getRecentHeadlineMap();
  const freshItems = items.filter((item) => !recentMap[hashHeadlineTitle(item.item?.title || item.title)]);

  if (freshItems.length >= minCount) {
    return freshItems;
  }

  const repeats = items.filter((item) => recentMap[hashHeadlineTitle(item.item?.title || item.title)]);
  if (repeats.length && freshItems.length < minCount) {
    return [...freshItems, repeats[0]];
  }

  return freshItems;
}

function stripHtml(text) {
  return text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeHeadline(text) {
  return stripHtml(text)
    .replace(/\s+-\s+.+$/, "")
    .replace(/\s+\|\s+.+$/, "")
    .replace(/["“”]/g, "")
    .trim();
}

function includesBlockedTopic(text) {
  const lowered = text.toLowerCase();
  return blockedTerms.some((term) => lowered.includes(term));
}

function includesAnyTerm(text, terms) {
  const lowered = text.toLowerCase();
  return terms.some((term) => lowered.includes(term));
}

function detectConcept(text) {
  const lowered = text.toLowerCase();
  const match = preferredConcepts.find((concept) =>
    concept.keywords.some((keyword) => lowered.includes(keyword))
  );

  return match ? match.label : null;
}

function cleanHeadlineSignal(rawTitle) {
  return normalizeHeadline(rawTitle)
    .replace(/^new\s+/i, "")
    .replace(/^breaking:\s*/i, "")
    .replace(/^watch:\s*/i, "")
    .replace(/^listen:\s*/i, "")
    .replace(/^here(?:'s| is)\s+/i, "")
    .replace(/^why\s+/i, "")
    .replace(/^how\s+/i, "")
    .replace(/^scientists?\s+/i, "")
    .replace(/^researchers?\s+/i, "")
    .replace(/^students?\s+/i, "")
    .replace(/^teachers?\s+/i, "")
    .replace(/\bmay\b/gi, "")
    .replace(/\bcould\b/gi, "")
    .replace(/\bhelps?\b/gi, "")
    .replace(/\bhelping\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function shortenWords(text, maxWords) {
  const words = text.split(/\s+/).filter(Boolean);
  let shortened = words.slice(0, maxWords).join(" ");

  shortened = shortened.replace(/[,:;.!?]+$/g, "").trim();

  return sentenceCase(shortened);
}

function pickKeyword(text, keywords, fallback) {
  const lowered = text.toLowerCase();
  const match = keywords.find((keyword) => lowered.includes(keyword));

  return match || fallback;
}

function getConceptKey(topicSource) {
  return detectConcept(topicSource);
}

function getTopicType(item) {
  const sourceText = item.title.toLowerCase();
  const conceptKey = getConceptKey(sourceText);

  if (!conceptKey) {
    return null;
  }

  if (includesAnyTerm(sourceText, ["rule", "rules", "fair", "fairness", "ban", "allowed", "choice", "choices"])) {
    return "decisions";
  }

  if (
    includesAnyTerm(sourceText, [
      "student",
      "students",
      "teacher",
      "teachers",
      "school",
      "class",
      "habit",
      "habits",
      "helping",
      "helper",
      "kindness",
      "friend",
      "friends",
      "brain break",
      "focus",
      "community",
      "volunteer",
      "behavior",
      "actions",
    ])
  ) {
    return "human behavior";
  }

  if (conceptKey === "sports moment" || includesAnyTerm(sourceText, ["sports", "game", "team", "player", "coach", "athlete"])) {
    return "decisions";
  }

  if (conceptKey === "pop culture trend" || includesAnyTerm(sourceText, ["movie", "show", "music", "fans", "trend", "viral"])) {
    return "human behavior";
  }

  if (conceptKey === "new technology" || includesAnyTerm(sourceText, ["ai", "robot", "tool", "app", "device", "innovation"])) {
    return "technology";
  }

  if (
    conceptKey === "space discovery" ||
    conceptKey === "animal behavior" ||
    conceptKey === "environmental change" ||
    conceptKey === "science discovery"
  ) {
    return "discovery";
  }

  return "human behavior";
}

function getScenarioVariant(mode, eslEnabled) {
  if (eslEnabled || mode === "esl") {
    return "support";
  }
  if (mode === "3-5") {
    return "younger";
  }

  return "default";
}

function isHeadlineAllowedForMode(item, mode) {
  const sourceText = item.title.toLowerCase();
  const conceptKey = getConceptKey(sourceText);

  if (!conceptKey) {
    return false;
  }

  if (mode === "3-5" || mode === "esl") {
    if (!elementaryAllowedConcepts.has(conceptKey)) {
      return false;
    }

    if (includesAnyTerm(sourceText, elementaryBlockedTerms)) {
      return false;
    }

    if (includesAnyTerm(sourceText, blockedCountryTerms)) {
      return false;
    }

    return true;
  }

  if (mode === "6-8") {
    if (!middleAllowedConcepts.has(conceptKey)) {
      return false;
    }

    if (includesAnyTerm(sourceText, middleBlockedTerms)) {
      return false;
    }

    return true;
  }

  return true;
}

function isKidImaginableHeadline(item) {
  const sourceText = item.title.toLowerCase();
  const conceptKey = getConceptKey(sourceText);

  if (!conceptKey) {
    return false;
  }

  if (includesAnyTerm(sourceText, adultSystemTerms)) {
    return false;
  }

  if (conceptKey === "creative invention") {
    return includesAnyTerm(sourceText, ["invent", "build", "design", "tool", "device", "robot"]);
  }

  if (conceptKey === "sports moment") {
    return includesAnyTerm(sourceText, ["game", "team", "player", "coach", "score", "practice", "athlete"]);
  }

  if (conceptKey === "pop culture trend") {
    return includesAnyTerm(sourceText, ["movie", "show", "music", "fans", "character", "trend", "viral"]);
  }

  if (conceptKey === "human behavior") {
    return includesAnyTerm(sourceText, ["habit", "helping", "friends", "focus", "behavior", "kindness", "community"]);
  }

  return true;
}

function headlinePassesSimplicityTest(item) {
  const sourceText = item.title.toLowerCase();
  const conceptKey = getConceptKey(sourceText);

  if (!conceptKey) {
    return false;
  }

  if (includesAnyTerm(sourceText, adultSystemTerms)) {
    return false;
  }

  const cleaned = cleanHeadlineSignal(item.title);

  if (!cleaned || countWords(cleaned) > 14) {
    return false;
  }

  return true;
}

function headlineHasStrongIdea(item) {
  const sourceText = item.title.toLowerCase();
  const conceptKey = getConceptKey(sourceText);

  if (!conceptKey) {
    return false;
  }

  if (conceptKey === "new technology") {
    return includesAnyTerm(sourceText, ["ai", "robot", "camera", "tool", "device", "app"]);
  }

  if (conceptKey === "space discovery") {
    return includesAnyTerm(sourceText, ["mars", "moon", "planet", "space", "rocket", "telescope"]);
  }

  if (conceptKey === "animal behavior") {
    return includesAnyTerm(sourceText, ["animal", "bird", "dog", "cat", "wildlife", "fish", "whale"]);
  }

  if (conceptKey === "environmental change") {
    return includesAnyTerm(sourceText, ["plastic", "water", "climate", "weather", "forest", "ocean", "river"]);
  }

  if (conceptKey === "science discovery") {
    return includesAnyTerm(sourceText, ["camera", "light", "physics", "energy", "study", "science", "discovery"]);
  }

  if (conceptKey === "sports moment") {
    return includesAnyTerm(sourceText, ["team", "player", "coach", "practice", "game", "athlete", "score"]);
  }

  if (conceptKey === "pop culture trend") {
    return includesAnyTerm(sourceText, ["movie", "show", "music", "fans", "trend", "video", "viral", "character"]);
  }

  if (conceptKey === "human behavior") {
    return includesAnyTerm(sourceText, ["habit", "helping", "friends", "focus", "behavior", "choices", "kindness"]);
  }

  return false;
}

function headlineHasDiscussionValue(item) {
  const sourceText = item.title.toLowerCase();
  const conceptKey = getConceptKey(sourceText);

  if (!conceptKey) {
    return false;
  }

  if (includesAnyTerm(sourceText, lowValueAnnouncementTerms)) {
    return false;
  }

  if (
    includesAnyTerm(sourceText, [
      "replaces",
      "named",
      "joins",
      "steps down",
      "resigns",
      "hired",
      "fired",
      "promoted",
      "takes over",
    ])
  ) {
    return false;
  }

  if (conceptKey === "new technology") {
    return includesAnyTerm(sourceText, ["ai", "robot", "camera", "tool", "device", "app"]);
  }

  if (conceptKey === "space discovery") {
    return includesAnyTerm(sourceText, ["mars", "moon", "planet", "space", "rocket", "telescope"]);
  }

  if (conceptKey === "animal behavior") {
    return includesAnyTerm(sourceText, ["animal", "bird", "dog", "cat", "wildlife", "fish", "whale"]);
  }

  if (conceptKey === "environmental change") {
    return includesAnyTerm(sourceText, ["plastic", "water", "climate", "weather", "forest", "ocean", "river"]);
  }

  if (conceptKey === "science discovery") {
    return includesAnyTerm(sourceText, ["camera", "light", "physics", "energy", "science", "discovery"]);
  }

  if (conceptKey === "sports moment") {
    return includesAnyTerm(sourceText, ["game", "team", "player", "coach", "practice", "replay", "athlete"]);
  }

  if (conceptKey === "pop culture trend") {
    return includesAnyTerm(sourceText, ["movie", "show", "music", "fans", "trend", "viral", "style"]);
  }

  if (conceptKey === "human behavior") {
    return includesAnyTerm(sourceText, ["habit", "helping", "friends", "focus", "kindness", "choice", "choices"]);
  }

  return false;
}

function headlineFeelsStudentRelevant(item) {
  const sourceText = item.title.toLowerCase();
  const conceptKey = getConceptKey(sourceText);

  if (!conceptKey) {
    return false;
  }

  if (
    includesAnyTerm(sourceText, [
      "executive",
      "studio chief",
      "network chief",
      "industry",
      "platform",
      "corporate",
      "workplace",
      "shareholder",
      "media company",
      "institution",
      "department",
      "agency",
    ])
  ) {
    return false;
  }

  if (conceptKey === "pop culture trend") {
    return includesAnyTerm(sourceText, ["movie", "show", "music", "fans", "trend", "viral", "style", "character"]);
  }

  if (conceptKey === "sports moment") {
    return includesAnyTerm(sourceText, ["game", "team", "player", "coach", "replay", "practice", "athlete"]);
  }

  if (conceptKey === "human behavior") {
    return includesAnyTerm(sourceText, ["habit", "helping", "friends", "focus", "kindness", "choice", "choices"]);
  }

  if (conceptKey === "new technology") {
    return includesAnyTerm(sourceText, ["ai", "robot", "camera", "tool", "device", "app", "phone", "video"]);
  }

  if (conceptKey === "environmental change") {
    return includesAnyTerm(sourceText, ["plastic", "water", "weather", "climate", "ocean", "forest", "earth"]);
  }

  if (conceptKey === "space discovery") {
    return includesAnyTerm(sourceText, ["space", "mars", "moon", "planet", "rocket", "telescope"]);
  }

  if (conceptKey === "science discovery") {
    return includesAnyTerm(sourceText, [
      "camera",
      "light",
      "see",
      "science",
      "discovery",
      "research",
      "scientist",
      "nature",
      "wildlife",
      "planet",
      "nasa",
      "weather",
    ]);
  }

  return false;
}

function isHeadlineValidForCard(item, mode) {
  if (!isHeadlineAllowedForMode(item, mode)) {
    return false;
  }

  const sourceText = item.title.trim();
  const conceptKey = getConceptKey(sourceText);

  if (!conceptKey) {
    return false;
  }

  const fullHeadline = cleanHeadlineSignal(item.title);

  if (!fullHeadline || fullHeadline.split(/\s+/).length < 3) {
    return false;
  }

  if (!isKidImaginableHeadline(item)) {
    return false;
  }

  if (!headlinePassesSimplicityTest(item)) {
    return false;
  }

  if (!headlineHasStrongIdea(item)) {
    return false;
  }

  if (!headlineHasDiscussionValue(item)) {
    return false;
  }

  if (!headlineFeelsStudentRelevant(item)) {
    return false;
  }

  return true;
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function simplifyIdeaText(text) {
  return text
    .replace(/fatty acid/gi, "things that help the body work")
    .replace(/sycophantic/gi, "telling people what they want to hear")
    .replace(/ultra-fast/gi, "super fast")
    .replace(/restore failing/gi, "helping something work again")
    .replace(/artificial intelligence/gi, "AI")
    .replace(/innovation/gi, "new way to do things")
    .replace(/technology/gi, "tech")
    .replace(/events/gi, "things")
    .replace(/\s+/g, " ")
    .trim();
}

function buildSimpleTopic(item, conceptKey, eslEnabled) {
  const sourceText = item.title.toLowerCase();
  const fullHeadline = simplifyIdeaText(cleanHeadlineSignal(item.title));

  if (conceptKey === "new technology") {
    if (sourceText.includes("ai") && (sourceText.includes("write") || sourceText.includes("writing") || sourceText.includes("essay"))) {
      return "AI helping with writing";
    }
    if (sourceText.includes("camera") && (sourceText.includes("fast") || sourceText.includes("second"))) {
      return "Seeing super fast things";
    }
    if (sourceText.includes("robot")) {
      return "Robots at work";
    }
    if (includesAnyTerm(sourceText, ["phone", "video", "app", "tool", "device"])) {
      return "New tech tools";
    }
    return "New tech ideas";
  }

  if (conceptKey === "space discovery") {
    if (sourceText.includes("mars")) {
      return "Exploring Mars";
    }
    if (sourceText.includes("moon") || sourceText.includes("planet")) {
      return "Exploring other worlds";
    }
    if (sourceText.includes("telescope")) {
      return "Seeing farther into space";
    }
    return "New space discovery";
  }

  if (conceptKey === "animal behavior") {
    const animal = sentenceCase(
      pickKeyword(sourceText, ["birds", "bird", "dogs", "dog", "cats", "cat", "whales", "fish", "wildlife", "animals"], "animals")
    );
    return `${animal.replace(/s$/, "")}s near people`;
  }

  if (conceptKey === "environmental change") {
    if (sourceText.includes("plastic")) {
      return "Cleaning plastic from water";
    }
    if (sourceText.includes("weather") || sourceText.includes("climate")) {
      return "Big weather changes";
    }
    if (includesAnyTerm(sourceText, ["forest", "ocean", "river", "earth"])) {
      return "Changes affecting the planet";
    }
    return "Changes in nature";
  }

  if (conceptKey === "science discovery") {
    if (sourceText.includes("fast") || sourceText.includes("second")) {
      return "Seeing super fast things";
    }
    if (sourceText.includes("light")) {
      return "New ways to see better";
    }
    return "New science discovery";
  }

  if (conceptKey === "sports moment") {
    if (sourceText.includes("video") || sourceText.includes("replay")) {
      return "Replay in sports";
    }
    if (includesAnyTerm(sourceText, ["practice", "coach", "team", "player", "game"])) {
      return "Competition and strategy";
    }
    return "Competition and strategy";
  }

  if (conceptKey === "pop culture trend") {
    if (sourceText.includes("movie") || sourceText.includes("show")) {
      return "Trends in shows and movies";
    }
    if (sourceText.includes("music") || sourceText.includes("song")) {
      return "Changes in music or media";
    }
    if (includesAnyTerm(sourceText, ["trend", "viral", "fans", "style"])) {
      return "Trends people follow";
    }
    if (includesAnyTerm(sourceText, ["business", "industry", "label", "streaming", "media"])) {
      return "How industries work";
    }
    return "New ideas and changes";
  }

  if (conceptKey === "human behavior") {
    if (sourceText.includes("brain break") || sourceText.includes("focus")) {
      return "Short breaks to focus better";
    }
    if (sourceText.includes("helping") || sourceText.includes("kindness")) {
      return "Helping and community";
    }
    if (includesAnyTerm(sourceText, ["habit", "habits", "behavior", "choices", "choice"])) {
      return "Choices people make every day";
    }
    return "Choices people make";
  }

  if (conceptKey === "creative invention" && includesAnyTerm(sourceText, ["invent", "build", "design", "tool", "device"])) {
    return shortenWords(fullHeadline, eslEnabled ? 5 : 7);
  }

  return shortenWords(fullHeadline, eslEnabled ? 4 : 6) || "Big changes";
}

function getFallbackTheme(item, conceptKey) {
  const sourceText = item.title.toLowerCase();

  if (includesAnyTerm(sourceText, ["fair", "fairness", "allowed", "rule", "rules"])) {
    return "fairness";
  }

  if (
    (conceptKey === "animal behavior" || conceptKey === "human behavior") &&
    includesAnyTerm(sourceText, ["help", "helping", "kindness", "community", "friend", "friends"])
  ) {
    return "helping others";
  }

  if (conceptKey === "pop culture trend") {
    if (includesAnyTerm(sourceText, ["trend", "viral", "fans", "style", "popular", "popularity"])) {
      return "trends";
    }
    if (includesAnyTerm(sourceText, ["business", "industry", "label", "streaming", "media", "money"])) {
      return "industry";
    }
    if (includesAnyTerm(sourceText, ["movie", "show", "music", "song", "artist", "culture"])) {
      return "popularity";
    }
    return "change";
  }

  if (conceptKey === "sports moment") {
    return "choices";
  }

  if (includesAnyTerm(sourceText, ["new", "change", "changes", "different", "future"])) {
    return "change";
  }

  if (conceptKey === "space discovery" || conceptKey === "science discovery" || conceptKey === "animal behavior") {
    return "discovery";
  }

  if (conceptKey === "new technology") {
    return "decision making";
  }

  return "change";
}

function buildFallbackCardFrame(item, conceptKey, variant, topicType, eslEnabled) {
  const theme = getFallbackTheme(item, conceptKey);
  const conceptLabel = {
    "new technology": "tech",
    "space discovery": "space",
    "animal behavior": "animals",
    "environmental change": "nature",
    "science discovery": "science",
    "sports moment": "sports",
    "pop culture trend": "trends",
    "human behavior": "everyday choices",
    "creative invention": "new ideas",
  }[conceptKey] || "this topic";

  const topicByTheme = {
    "decision making": sentenceCase(`${conceptLabel} choices`),
    choices: "Choices people make",
    fairness: sentenceCase(`fair ${conceptLabel} choices`),
    change: sentenceCase(`${conceptLabel} changes`),
    "helping others": conceptKey === "animal behavior" ? "Helping animals" : "Helping others",
    discovery: sentenceCase(`new ${conceptLabel} discoveries`),
    trends: "Trends people follow",
    popularity: `${sentenceCase(conceptLabel)} people notice`,
    industry: includesAnyTerm((item.title || "").toLowerCase(), ["money", "business"])
      ? "Money and decisions"
      : "How industries work",
  };

  const whyByTheme = {
    "decision making": `People make choices about ${conceptLabel} every day.`,
    choices: `People make choices about ${conceptLabel} every day.`,
    fairness: `People often disagree about what feels fair with ${conceptLabel}.`,
    change: `${sentenceCase(conceptLabel)} changes can affect what people choose next.`,
    "helping others": conceptKey === "animal behavior"
      ? "People make choices about how to help animals."
      : "Helping choices can affect other people.",
    discovery: `New ${conceptLabel} discoveries can change what people learn next.`,
    trends: `Trends can shape what people notice, copy, and talk about.`,
    popularity: `${sentenceCase(conceptLabel)} can become popular for different reasons.`,
    industry: includesAnyTerm((item.title || "").toLowerCase(), ["music", "song", "artist", "label", "streaming"])
      ? "Changes in music or media can affect what people notice."
      : "Industries make choices that affect what people see and use.",
  };

  const questionSets = {
    "decision making": variant === "support"
      ? [
          `Should people try new ${conceptLabel} ideas or not?`,
          `Is this ${conceptLabel} choice good or not?`,
          `Would you choose this ${conceptLabel} idea or not?`,
        ]
      : [
          `Should people try new ${conceptLabel} ideas, or keep the usual way?`,
          `Would you choose this ${conceptLabel} idea, or something simpler?`,
          `If this changed ${conceptLabel}, would you still choose it?`,
        ],
    choices: variant === "support"
      ? [
          `Should people make different ${conceptLabel} choices or not?`,
          `Is this ${conceptLabel} choice good or bad?`,
          `Would you choose this or not?`,
        ]
      : [
          `Should people change these ${conceptLabel} choices, or keep them the same?`,
          `Would you choose this, or a different way?`,
          `If this changed ${conceptLabel}, would that matter?`,
        ],
    fairness: variant === "support"
      ? [
          `Is this ${conceptLabel} idea fair or unfair?`,
          `Should this ${conceptLabel} idea be allowed or not?`,
          `Would this ${conceptLabel} choice feel fair to you?`,
        ]
      : [
          `Is this ${conceptLabel} idea fair, or does it help some people more?`,
          `Should people allow this ${conceptLabel} idea, or set limits first?`,
          `If this ${conceptLabel} idea helped some people more, would it still feel fair?`,
        ],
    change: variant === "support"
      ? [
          `Is this ${conceptLabel} change good or bad?`,
          `Should people try this ${conceptLabel} change or not?`,
          `Would you choose this ${conceptLabel} change or not?`,
        ]
      : [
          `Should people try this ${conceptLabel} change, or keep things the same?`,
          `If this changed ${conceptLabel} in daily life, would it be worth it?`,
          `Would you choose this ${conceptLabel} change now, or wait longer?`,
        ],
    trends: variant === "support"
      ? [
          `Do you think people should follow ${conceptLabel} trends?`,
          `Is this ${conceptLabel} trend worth following?`,
          `Would you join this trend or not?`,
        ]
      : [
          `Do you think people should follow this ${conceptLabel} trend? Why or why not?`,
          `Would you join this ${conceptLabel} trend, or ignore it?`,
          `What might happen if more people follow this trend?`,
        ],
    popularity: variant === "support"
      ? [
          `Why do you think this ${conceptLabel} got popular?`,
          `Do you think this ${conceptLabel} matters to people?`,
          `Would you pay attention to this or not?`,
        ]
      : [
          `Why do you think this ${conceptLabel} became popular?`,
          `Do you think this popularity will last? Why or why not?`,
          `What might make people lose interest?`,
        ],
    industry: variant === "support"
      ? [
          "How do you think this industry works?",
          "Do money and decisions affect this?",
          "Would this change what people notice?",
        ]
      : [
          "How do money and decisions shape this industry?",
          "Do you think these industry changes affect people outside it?",
          "What might change next in music or media?",
        ],
    "helping others": variant === "support"
      ? [
          conceptKey === "animal behavior" ? "Should people help animals or not?" : "Should people help or not?",
          conceptKey === "animal behavior" ? "Is helping animals here a good idea?" : "Is helping here a good idea?",
          "Would you help in this situation?",
        ]
      : [
          conceptKey === "animal behavior"
            ? "Should people help animals, even if it takes extra effort?"
            : "Should people help, even if it takes extra effort?",
          "Would you help, or focus on your own needs first?",
          "If helping took more time, would you still do it?",
        ],
    discovery: variant === "support"
      ? [
          `Is this ${conceptLabel} discovery important or not?`,
          `Should people learn more about this ${conceptLabel} idea?`,
          "Would you want to know more?",
        ]
      : [
          `Should people spend time learning more about this ${conceptLabel} discovery?`,
          `Would you study this ${conceptLabel} discovery, or something more familiar?`,
          `If this ${conceptLabel} discovery changed what we know, would it matter to you?`,
        ],
  };

  const followUps = variant === "support"
    ? ["What is one good thing?", "What is one problem?", "Do you agree or disagree?"]
    : [
        "Why might someone choose one side?",
        "Why might someone choose another side instead?",
        "What would you do?",
      ];

  return {
    topic: topicByTheme[theme],
    whyItMatters: whyByTheme[theme],
    questions: questionSets[theme],
    followUps,
    conceptKey,
    topicType,
  };
}

function getHeadlineFocus(item, conceptKey, topic) {
  const sourceText = item.title.toLowerCase();

  if (conceptKey === "new technology") {
    if (sourceText.includes("ai") && includesAnyTerm(sourceText, ["write", "writing", "essay"])) {
      return "AI helping with writing";
    }
    if (sourceText.includes("robot")) {
      return "robots helping people";
    }
    if (includesAnyTerm(sourceText, ["camera", "fast", "second"])) {
      return "seeing hidden moments";
    }
    return topic.toLowerCase();
  }

  if (conceptKey === "space discovery") {
    if (sourceText.includes("mars")) return "exploring Mars";
    if (includesAnyTerm(sourceText, ["moon", "planet"])) return "exploring other worlds";
    return "space discoveries";
  }

  if (conceptKey === "animal behavior") {
    const animal = pickKeyword(sourceText, ["birds", "bird", "dogs", "dog", "cats", "cat", "whales", "fish", "wildlife", "animals"], "animals");
    return `${animal.replace(/s$/, "")}s near people`;
  }

  if (conceptKey === "environmental change") {
    if (sourceText.includes("plastic")) return "cleaning plastic from water";
    if (includesAnyTerm(sourceText, ["weather", "climate"])) return "big weather changes";
    return "changes in nature";
  }

  if (conceptKey === "science discovery") {
    if (includesAnyTerm(sourceText, ["fast", "second", "camera"])) return "seeing super fast events";
    return "a new science discovery";
  }

  if (conceptKey === "sports moment") {
    if (includesAnyTerm(sourceText, ["replay", "video"])) return "using replay in sports";
    return "sports choices";
  }

  if (conceptKey === "pop culture trend") {
    if (includesAnyTerm(sourceText, ["music", "song", "artist"])) return "music people keep talking about";
    if (includesAnyTerm(sourceText, ["movie", "show", "series"])) return "shows people keep watching";
    if (includesAnyTerm(sourceText, ["trend", "viral", "fans", "style", "popular"])) return "trends people follow";
    if (includesAnyTerm(sourceText, ["label", "streaming", "industry", "business", "media"])) {
      return includesAnyTerm(sourceText, ["music", "song", "artist", "label"])
        ? "changes in music or media"
        : "how industries work";
    }
    return "new ideas and changes";
  }

  if (conceptKey === "human behavior") {
    if (includesAnyTerm(sourceText, ["help", "kindness"])) return "helping other people";
    if (includesAnyTerm(sourceText, ["focus", "break"])) return "short breaks to focus";
    return "everyday choices";
  }

  return topic.toLowerCase();
}

function framingFitsHeadline(item, card) {
  const sourceText = item.title.toLowerCase();
  const cardText = `${card.topic} ${card.question} ${card.whyItMatters}`.toLowerCase();

  if (
    includesAnyTerm(cardText, ["habit", "habits"]) &&
    !includesAnyTerm(sourceText, ["habit", "habits", "focus", "break", "routine", "behavior"])
  ) {
    return false;
  }

  if (
    includesAnyTerm(cardText, ["helping others", "help people", "helping people"]) &&
    !includesAnyTerm(sourceText, ["help", "helping", "kindness", "community", "friend", "friends", "animal"])
  ) {
    return false;
  }

  if (
    includesAnyTerm(cardText, ["decision making", "choices people make"]) &&
    !includesAnyTerm(sourceText, ["choice", "choices", "choose", "decide", "decision", "use", "follow", "change", "try"])
  ) {
    return false;
  }

  return true;
}

function getAccurateFallbackTopic(item, conceptKey) {
  const sourceText = item.title.toLowerCase();

  if (conceptKey === "pop culture trend") {
    if (includesAnyTerm(sourceText, ["trend", "viral", "fans", "style", "popular"])) {
      return "Trends people follow";
    }
    if (includesAnyTerm(sourceText, ["label", "streaming", "industry", "business", "media"])) {
      return includesAnyTerm(sourceText, ["music", "song", "artist", "label"])
        ? "Changes in music or media"
        : "How industries work";
    }
    return "New ideas and changes";
  }

  if (conceptKey === "sports moment" || conceptKey === "new technology" || conceptKey === "human behavior") {
    return "Choices people make";
  }

  if (conceptKey === "science discovery") {
    return "New ideas and changes";
  }

  return "New ideas and changes";
}

function getQuestionStyle(item, conceptKey, topicType, mode, eslEnabled) {
  const sourceText = item.title.toLowerCase();

  if (eslEnabled || mode === "esl") {
    return "opinion";
  }

  if (mode === "3-5") {
    if (conceptKey === "animal behavior" || conceptKey === "human behavior") {
      return "personal";
    }
    if (includesAnyTerm(sourceText, ["change", "future", "next"])) {
      return "future";
    }
    if (topicType === "decisions" || includesAnyTerm(sourceText, ["should", "fair", "allowed", "choice", "choices"])) {
      return "decision";
    }
    return "opinion";
  }

  if (topicType === "decisions" || includesAnyTerm(sourceText, ["should", "fair", "allowed", "choice", "choices"])) {
    return "decision";
  }
  if (includesAnyTerm(sourceText, ["future", "next", "could", "might", "change", "discovery"])) {
    return "future";
  }
  if (conceptKey === "human behavior" || conceptKey === "animal behavior") {
    return "personal";
  }
  return "opinion";
}

function buildQuestionSet(focus, style, mode, eslEnabled) {
  if (eslEnabled || mode === "esl") {
    return {
      questions: [
        `Do you think ${focus} is good or bad?`,
        `Would you choose ${focus} or not?`,
        `Is ${focus} helpful or not?`,
      ],
      followUps: ["What is one good thing?", "What is one problem?", "Do you agree or disagree?"],
      quickWrite: sample([
        "Explain your choice in one sentence.",
        "Write one reason for your opinion.",
        "Tell what you think and why.",
      ]),
    };
  }

  if (style === "decision") {
    return {
      questions: mode === "3-5"
        ? [
            `Would you choose ${focus} or not?`,
            `Should people choose ${focus} or something else?`,
            `Would you try ${focus} or stay with the usual way?`,
          ]
        : [
            `Would you choose ${focus} or a different option?`,
            `Should people choose ${focus}, or be more careful first?`,
            `If you had to choose, would you pick ${focus} or something safer?`,
          ],
      followUps: [
        "Can you give an example?",
        "What might change your mind?",
        "Which choice sounds stronger to you?",
      ],
      quickWrite: sample([
        "Explain your choice.",
        "Write which option you would choose and why.",
        "Tell which side sounds better to you.",
      ]),
    };
  }

  if (style === "future") {
    return {
      questions: mode === "3-5"
        ? [
            `What might happen if ${focus} keeps growing?`,
            `What might happen next with ${focus}?`,
            `If ${focus} keeps changing, what could happen?`,
          ]
        : [
            `What might happen if ${focus} changes even more?`,
            `If ${focus} keeps growing, what could change next?`,
            `What future problem or benefit could come from ${focus}?`,
          ],
      followUps: [
        "What do you notice first?",
        "Who could be affected?",
        "What might change your mind?",
      ],
      quickWrite: sample([
        "What might happen next?",
        "Predict one change that could happen.",
        "Write one possible future result.",
      ]),
    };
  }

  if (style === "personal") {
    return {
      questions: mode === "3-5"
        ? [
            `Have you ever seen something like ${focus}?`,
            `What would you do if ${focus} happened near you?`,
            `Would ${focus} matter in your daily life?`,
          ]
        : [
            `Have you ever seen something like ${focus}, and what did you notice?`,
            `What would you do if ${focus} affected your day?`,
            `How would you react if ${focus} happened around you?`,
          ],
      followUps: [
        "How does this connect to your life?",
        "Can you give an example?",
        "Do you agree or disagree?",
      ],
      quickWrite: sample([
        "How does this relate to your life?",
        "Write about a time this felt familiar.",
        "Imagine this happened near you. What would you do?",
      ]),
    };
  }

  return {
    questions: mode === "3-5"
      ? [
          `Do you think ${focus} is a good idea?`,
          `Do you think ${focus} matters?`,
          `What do you think about ${focus}?`,
        ]
      : [
          `Do you think ${focus} is a good idea? Why or why not?`,
          `Do you think ${focus} matters right now? Why or why not?`,
          `What is your opinion about ${focus}, and why?`,
        ],
    followUps: [
      "Can you give an example?",
      "Do you agree or disagree?",
      "What might change your mind?",
    ],
    quickWrite: sample([
      "Explain your opinion.",
      "Write what you think and why.",
      "Share your view in two sentences.",
    ]),
  };
}

const followUpPools = {
  reasoning: [
    "Why do you think that?",
    "What makes you say that?",
    "What is your reason?",
  ],
  example: [
    "Can you give an example?",
    "What is one example?",
    "Can you think of a real example?",
  ],
  comparison: [
    "How is this different from something else?",
    "Which option seems stronger?",
    "What makes one choice better?",
  ],
  perspective: [
    "Would everyone agree? Why or why not?",
    "Do you agree or disagree?",
    "Could someone see this differently?",
  ],
  change: [
    "What might change your mind?",
    "What could make you think differently?",
    "What new detail could change your view?",
  ],
  application: [
    "Where might you see this in real life?",
    "How could this show up in daily life?",
    "Where could this matter outside school?",
  ],
  prediction: [
    "What might happen next?",
    "What could happen later?",
    "What do you think comes next?",
  ],
};

function getFollowUpStylesForQuestion(style) {
  if (style === "decision") {
    return ["comparison", "reasoning", "change"];
  }

  if (style === "future") {
    return ["prediction", "application", "change"];
  }

  if (style === "personal") {
    return ["application", "example", "perspective"];
  }

  return ["perspective", "example", "reasoning"];
}

function pickRotatingFollowUp(style, usedPrompts, blockedPrompts) {
  const candidates = followUpPools[style] || [];
  const freshCandidate = candidates.find(
    (prompt) => !usedPrompts.has(prompt) && !blockedPrompts.has(prompt)
  );

  if (freshCandidate) {
    return freshCandidate;
  }

  const unusedCandidate = candidates.find((prompt) => !usedPrompts.has(prompt));
  if (unusedCandidate) {
    return unusedCandidate;
  }

  return candidates[0] || "Can you give an example?";
}

function buildRotatingFollowUps(questionStyle, mode, eslEnabled) {
  if (eslEnabled || mode === "esl") {
    return ["What is one good thing?", "What is one problem?", "Do you agree or disagree?"];
  }

  const styles = getFollowUpStylesForQuestion(questionStyle);
  const usedPrompts = new Set();
  const blockedPrompts = new Set(state.recentFollowUps);

  return styles.map((style) => {
    const prompt = pickRotatingFollowUp(style, usedPrompts, blockedPrompts);
    usedPrompts.add(prompt);
    return prompt;
  });
}

function buildTopicAlignedSet(topic, focus, mode, eslEnabled) {
  const loweredTopic = (topic || "").toLowerCase();

  if (loweredTopic === "changes in music or media") {
    return {
      questions: eslEnabled || mode === "esl"
        ? [
            "Why do people follow music or media trends?",
            "Do trends in music or media matter?",
            "Would you follow a trend like this?",
          ]
        : [
            "Why do people follow trends in music or media?",
            "Do you think popularity changes what people notice in music or media?",
            "What makes some music or media trends spread faster than others?",
          ],
      followUps: [
        "What makes people pay attention?",
        "Do you agree or disagree?",
        "What might change your mind?",
      ],
      quickWrite: sample([
        "Explain why people follow some trends.",
        "Write what makes a trend popular.",
        "Tell whether popularity should matter here.",
      ]),
    };
  }

  if (loweredTopic === "how industries work" || loweredTopic === "money and decisions") {
    return {
      questions: eslEnabled || mode === "esl"
        ? [
            "How do money and decisions affect this industry?",
            "Do business choices change what people see?",
            "Is this fair to the people involved?",
          ]
        : [
            "How do money and decisions shape how this industry works?",
            "Do you think industry challenges affect what people finally see or hear?",
            "Is it fair when business decisions change what reaches the public?",
          ],
      followUps: [
        "Who makes the biggest decisions?",
        "What seems fair or unfair?",
        "What challenge matters most here?",
      ],
      quickWrite: sample([
        "Explain how money and decisions affect this topic.",
        "Write about one challenge in this industry.",
        "Tell whether these choices seem fair.",
      ]),
    };
  }

  if (loweredTopic === "competition and strategy" || loweredTopic === "replay in sports") {
    return {
      questions: eslEnabled || mode === "esl"
        ? [
            "What helps a team win here?",
            "Is strategy or teamwork more important?",
            "Would you use this strategy?",
          ]
        : [
            "What matters more here: strategy, teamwork, or talent?",
            "How can one decision change a competition?",
            "Do you think good strategy matters more than raw skill here?",
          ],
      followUps: [
        "Can you give an example?",
        "What would help a team most?",
        "What might change your mind?",
      ],
      quickWrite: sample([
        "Explain what helps people win here.",
        "Write about one smart strategy.",
        "Tell whether teamwork or strategy matters more.",
      ]),
    };
  }

  if (loweredTopic === "new tech tools" || loweredTopic === "new tech ideas" || loweredTopic === "robots at work") {
    return {
      questions: eslEnabled || mode === "esl"
        ? [
            "How useful do you think this tech could be?",
            "Would people use this tool in the future?",
            "Could this tech change daily life?",
          ]
        : [
            "How useful do you think this tech tool could be in real life?",
            "Do you think people will use tools like this more in the future?",
            "What impact could this kind of tech have on daily life?",
          ],
      followUps: [
        "Who would use it most?",
        "What might change in the future?",
        "What problem could it solve?",
      ],
      quickWrite: sample([
        "Explain how this tech might be useful.",
        "Write what future use you can imagine.",
        "Tell one way this tool could change daily life.",
      ]),
    };
  }

  if (loweredTopic === "trends people follow" || loweredTopic === "trends in shows and movies") {
    return {
      questions: eslEnabled || mode === "esl"
        ? [
            "Why do people follow trends like this?",
            "Would you join a trend like this?",
            "Do trends change what people like?",
          ]
        : [
            "Why do you think people follow trends like this?",
            "What makes some trends spread faster than others?",
            "Do trends change what people watch, wear, or talk about?",
          ],
      followUps: [
        "What makes a trend strong?",
        "Can you give an example?",
        "Do you agree or disagree?",
      ],
      quickWrite: sample([
        "Explain why people follow trends.",
        "Write about one trend people copy.",
        "Tell what makes a trend last.",
      ]),
    };
  }

  return null;
}

function getAlignmentAnchors(conceptKey, sourceText) {
  const lowered = sourceText.toLowerCase();

  if (conceptKey === "new technology") {
    if (lowered.includes("ai") && (lowered.includes("write") || lowered.includes("writing") || lowered.includes("essay"))) {
      return ["ai", "writing"];
    }
    if (lowered.includes("camera") && (lowered.includes("fast") || lowered.includes("second"))) {
      return ["camera", "fast"];
    }
    if (lowered.includes("robot")) {
      return ["robot"];
    }
    return ["technology"];
  }

  if (conceptKey === "space discovery") {
    if (lowered.includes("mars")) {
      return ["mars", "space"];
    }
    if (lowered.includes("moon") || lowered.includes("planet")) {
      return ["space", "planet"];
    }
    if (lowered.includes("telescope")) {
      return ["space", "telescope"];
    }
    return ["space"];
  }

  if (conceptKey === "animal behavior") {
    const animal = pickKeyword(
      lowered,
      ["birds", "bird", "dogs", "dog", "cats", "cat", "whales", "fish", "wildlife", "animals"],
      "animals"
    );
    return [animal.replace(/s$/, ""), "animal"];
  }

  if (conceptKey === "environmental change") {
    if (lowered.includes("plastic")) {
      return ["plastic", "water"];
    }
    if (lowered.includes("weather") || lowered.includes("climate")) {
      return ["weather", "earth"];
    }
    return ["planet", "earth"];
  }

  if (conceptKey === "science discovery") {
    if (lowered.includes("fast") || lowered.includes("second")) {
      return ["fast", "see"];
    }
    return ["science", "discovery"];
  }

  if (conceptKey === "sports moment") {
    if (lowered.includes("video") || lowered.includes("replay")) {
      return ["replay", "video"];
    }
    return ["team", "sports"];
  }

  if (conceptKey === "pop culture trend") {
    if (lowered.includes("movie") || lowered.includes("show")) {
      return ["movie", "show", "trend"];
    }
    if (lowered.includes("music") || lowered.includes("song")) {
      return ["music", "song", "trend"];
    }
    return ["trend", "fans"];
  }

  if (conceptKey === "human behavior") {
    if (lowered.includes("brain break") || lowered.includes("focus")) {
      return ["break", "focus"];
    }
    return ["habit", "help", "choice"];
  }

  return ["idea"];
}

function cardMatchesHeadline(item, card) {
  const sourceText = item.title.toLowerCase();
  const anchors = getAlignmentAnchors(card.conceptKey, sourceText);
  const cardText = `${card.topic} ${card.question} ${card.whyItMatters}`.toLowerCase();

  return anchors.some((anchor) => cardText.includes(anchor));
}

function cardHasValidFollowUps(card, eslEnabled) {
  if (!Array.isArray(card.followUps) || card.followUps.length < 2 || card.followUps.length > 3) {
    return false;
  }

  if (eslEnabled) {
    return (
      card.followUps[0] === "What is one good thing?" &&
      card.followUps[1] === "What is one problem?" &&
      card.followUps[2] === "Do you agree or disagree?"
    );
  }

  return card.followUps.every((prompt) => typeof prompt === "string" && countWords(prompt) >= 2 && countWords(prompt) <= 8);
}

function isCardUsable(item, card, mode, eslEnabled) {
  if (!card || !card.topic || !card.question || !card.whyItMatters) {
    return false;
  }

  if (countWords(card.question) > 14) {
    return false;
  }

  if (countWords(card.whyItMatters) > 14) {
    return false;
  }

  if (countWords(card.topic) > 7) {
    return false;
  }

  if (!cardMatchesHeadline(item, card)) {
    return false;
  }

  if (!cardHasValidFollowUps(card, eslEnabled)) {
    return false;
  }

  if ((mode === "3-5" || mode === "esl") && includesAnyTerm(card.question.toLowerCase(), ["policy", "insurance", "government", "economy"])) {
    return false;
  }

  if (countWords(`${card.topic} ${card.whyItMatters}`) > 20) {
    return false;
  }

  return true;
}

function buildCardContent(item, mode, eslEnabled) {
  const topicSource = item.title.trim();
  const conceptKey = getConceptKey(topicSource);
  if (!conceptKey) {
    return null;
  }
  const topicType = getTopicType(item);
  const variant = getScenarioVariant(mode, eslEnabled);
  const fullHeadline = cleanHeadlineSignal(item.title);
  const lowered = fullHeadline.toLowerCase();

  let topic = buildSimpleTopic(item, conceptKey, eslEnabled);
  let whyItMatters = "New discoveries can change what people notice and do.";
  let questions = [
    "Would you want to know more about this?",
    "Is this something people should pay attention to?",
    "What would you want to understand first?",
  ];
  let followUps = [
    "Why might someone choose yes?",
    "Why might someone choose no instead?",
    "What would you do?",
  ];

  if (conceptKey === "new technology") {
    if (lowered.includes("ai") && (lowered.includes("write") || lowered.includes("essay") || lowered.includes("writing"))) {
      topic = "AI helping with writing";
      whyItMatters = "People are deciding when AI should help with writing.";
      questions = variant === "support"
        ? [
            "Is AI writing help fair or unfair?",
            "Should AI help with writing or not?",
            "Would you use AI help or write alone?",
          ]
        : [
            "If AI made writing easier, would it still feel fair?",
            "If AI saved time, should students still do all the writing?",
            "If AI helps you write faster, what do you lose?",
          ];
      followUps = variant === "support"
        ? ["What is one good thing?", "What is one problem?", "Do you agree or disagree?"]
        : [
            "Why might someone choose AI help?",
            "Why might someone choose to write alone instead?",
            "What would you do?",
          ];
    } else if (lowered.includes("camera") && (lowered.includes("second") || lowered.includes("fast"))) {
      topic = "Seeing extremely fast events";
      whyItMatters = "New tools can show events people usually miss.";
      questions = variant === "support"
        ? [
            "Would seeing fast events help people or not?",
            "Is this tool useful or not useful?",
            "What would you look at first?",
          ]
        : [
            "If we studied split-second events, what should matter most?",
            "If a camera showed hidden moments, what would you look at first?",
            "If this took time and money, would it still be worth it?",
          ];
      followUps = variant === "support"
        ? ["What is one good thing?", "What is one problem?", "Do you agree or disagree?"]
        : [
            "Why might someone want to see fast events?",
            "Why might someone study something else instead?",
            "What would you look at?",
          ];
    } else if (lowered.includes("robot")) {
      topic = "Robots doing new jobs";
      whyItMatters = "People are deciding where robots should help.";
      questions = variant === "support"
        ? [
            "Should robots help more or less?",
            "Is robot help good or bad?",
            "Would you choose robot help or human help?",
          ]
        : [
            "If robots made life easier, what jobs should stay human?",
            "If robots helped more, what might people give up?",
            "Would you trade human help for faster robot help?",
          ];
      followUps = variant === "support"
        ? ["What is one good thing?", "What is one problem?", "Do you agree or disagree?"]
        : [
            "Why might someone choose more robot help?",
            "Why might someone choose less robot help instead?",
            "What would you do?",
          ];
    } else {
      const fallback = buildFallbackCardFrame(item, conceptKey, variant, topicType, eslEnabled);
      topic = fallback.topic;
      whyItMatters = fallback.whyItMatters;
      questions = fallback.questions;
      followUps = fallback.followUps;
    }
  } else if (conceptKey === "space discovery") {
    if (lowered.includes("mars") || lowered.includes("planet") || lowered.includes("moon")) {
      topic = lowered.includes("mars") ? "Exploring Mars" : "Exploring other worlds";
      whyItMatters = "New space discoveries can change what people explore next.";
      questions = variant === "support"
        ? [
            "Should people explore space or focus on Earth?",
            "Is space exploration worth the cost or not?",
            "Would you choose space or Earth first?",
          ]
        : [
            "If space trips cost a lot, should we still explore Mars?",
            "If you had to choose, explore space or fix Earth first?",
            "If space missions grow, what should get less money?",
          ];
      followUps = variant === "support"
        ? ["What is one good thing?", "What is one problem?", "Do you agree or disagree?"]
        : [
            "Why might someone choose more space exploration?",
            "Why might someone choose other priorities instead?",
            "What would you do?",
          ];
    } else if (lowered.includes("telescope")) {
      topic = "Seeing farther into space";
      whyItMatters = "Better space tools can reveal things people have never seen.";
      questions = variant === "support"
        ? [
            "Should people build better space tools or not?",
            "Would you choose space tools or Earth projects?",
            "Is seeing farther worth the cost or not?",
          ]
        : [
            "If better space tools cost more, should we still build them?",
            "If you had to choose, study space or help Earth first?",
            "If we looked deeper into space, what should wait instead?",
          ];
      followUps = variant === "support"
        ? ["What is one good thing?", "What is one problem?", "Do you agree or disagree?"]
        : [
            "Why might someone choose better space tools?",
            "Why might someone choose to focus on Earth instead?",
            "What would you do?",
          ];
    } else {
      const fallback = buildFallbackCardFrame(item, conceptKey, variant, topicType, eslEnabled);
      topic = fallback.topic;
      whyItMatters = fallback.whyItMatters;
      questions = fallback.questions;
      followUps = fallback.followUps;
    }
  } else if (conceptKey === "animal behavior") {
    const animal = sentenceCase(pickKeyword(lowered, ["birds", "bird", "dogs", "dog", "cats", "cat", "whales", "fish", "wildlife", "animals"], "animals"));
    topic = `${animal} near people`;
    whyItMatters = "This affects how people and animals share the same spaces.";
    questions = variant === "support"
      ? [
          `Should people protect ${animal.toLowerCase()} or move them?`,
          `Is sharing space with ${animal.toLowerCase()} good or bad?`,
          `Would you protect ${animal.toLowerCase()} or not?`,
        ]
      : [
          `If animals need space, should people give up some space too?`,
          `If animals stay nearby, what should people change first?`,
          `Would you protect ${animal.toLowerCase()} if it changed your routine?`,
        ];
    followUps = variant === "support"
      ? ["What is one good thing?", "What is one problem?", "Do you agree or disagree?"]
      : [
          `Why might someone choose to protect ${animal.toLowerCase()}?`,
          "Why might someone choose more people space instead?",
          "What would you do?",
        ];
  } else if (conceptKey === "environmental change") {
    if (lowered.includes("plastic")) {
      topic = "Cleaning plastic from water";
      whyItMatters = "People are looking for better ways to protect water.";
      questions = variant === "support"
        ? [
            "Should people clean plastic now or wait?",
            "Is cleaner water worth the effort or not?",
            "Would you help clean it or not?",
          ]
        : [
            "If cleaning water costs more, should people still do it?",
            "If you had to choose, cheaper goods or cleaner water?",
            "What matters more: saving money or cleaner water?",
          ];
      followUps = variant === "support"
        ? ["What is one good thing?", "What is one problem?", "Do you agree or disagree?"]
        : [
            "Why might someone choose to clean it now?",
            "Why might someone choose another solution instead?",
            "What would you do?",
          ];
    } else if (lowered.includes("weather") || lowered.includes("climate")) {
      topic = "Big weather changes";
      whyItMatters = "Weather changes can affect the choices people make every day.";
      questions = variant === "support"
        ? [
            "Should people change habits or stay the same?",
            "Is that important or not?",
            "Would you change your habits or not?",
          ]
        : [
            "If greener habits feel harder, should people still change?",
            "If helping Earth takes more effort, is it still worth it?",
            "What matters more: comfort now or helping later?",
          ];
      followUps = variant === "support"
        ? ["What is one good thing?", "What is one problem?", "Do you agree or disagree?"]
        : [
            "Why might someone choose to act now?",
            "Why might someone choose easier habits instead?",
            "What would you do?",
          ];
    } else {
      const fallback = buildFallbackCardFrame(item, conceptKey, variant, topicType, eslEnabled);
      topic = fallback.topic;
      whyItMatters = fallback.whyItMatters;
      questions = fallback.questions;
      followUps = fallback.followUps;
    }
  } else if (conceptKey === "science discovery") {
    if (lowered.includes("fast") || lowered.includes("second")) {
      topic = "Seeing extremely fast events";
      whyItMatters = "New science tools can reveal events people cannot normally see.";
      questions = variant === "support"
        ? [
            "Would seeing fast events help people or not?",
            "Is that useful or not?",
            "What would you watch first?",
          ]
        : [
            "If you could see things too fast to notice, what would you watch?",
            "Should people build tools to see extremely fast events?",
            "Would you want more discoveries like this?",
          ];
      followUps = variant === "support"
        ? ["What is one good thing?", "What is one problem?", "Do you agree or disagree?"]
        : [
            "Why might someone choose to study fast events?",
            "Why might someone choose a different mystery instead?",
            "What would you do?",
          ];
    } else {
      return null;
    }
  } else if (conceptKey === "sports moment") {
    topic = buildSimpleTopic(item, conceptKey, eslEnabled);
    whyItMatters = "Sports choices can change how people practice and play.";
    questions = variant === "support"
      ? [
          "Should teams use replay more or less?",
          "Is sports tech help good or bad?",
          "Would you use replay to improve?",
        ]
      : [
          "If replay helps teams improve, should everyone use it?",
          "Would you use replay, or trust your own memory?",
          "If tech helps in sports, what still matters most?",
        ];
    followUps = variant === "support"
      ? ["What is one good thing?", "What is one problem?", "Do you agree or disagree?"]
      : [
          "Why might someone choose replay help?",
          "Why might someone choose the old way instead?",
          "What would you do?",
        ];
  } else if (conceptKey === "pop culture trend") {
    topic = buildSimpleTopic(item, conceptKey, eslEnabled);
    whyItMatters = "Trends can shape what people wear, watch, and talk about.";
    questions = variant === "support"
      ? [
          "Should people follow big trends or not?",
          "Is copying a trend good or bad?",
          "Would you join this trend or not?",
        ]
      : [
          "If everyone follows a trend, should you join too?",
          "Would you copy a big trend or do your own thing?",
          "If a trend gets attention, does that make it worth copying?",
        ];
    followUps = variant === "support"
      ? ["What is one good thing?", "What is one problem?", "Do you agree or disagree?"]
      : [
          "Why might someone choose to follow the trend?",
          "Why might someone choose their own style instead?",
          "What would you do?",
        ];
  } else if (conceptKey === "human behavior") {
    topic = buildSimpleTopic(item, conceptKey, eslEnabled);
    whyItMatters = "Small choices can change how people feel and act each day.";
    questions = variant === "support"
      ? [
          "Should people take short breaks or keep going?",
          "Is that a good habit or not?",
          "Would you try it or not?",
        ]
      : [
          "If short breaks help people focus, should schools use them more?",
          "Would you take a break now, or finish the work first?",
          "If a habit helps people focus, is it worth the time?",
        ];
    followUps = variant === "support"
      ? ["What is one good thing?", "What is one problem?", "Do you agree or disagree?"]
      : [
          "Why might someone choose the new habit?",
        "Why might someone choose the old habit instead?",
        "What would you do?",
      ];
  } else {
    const fallback = buildFallbackCardFrame(item, conceptKey, variant, topicType, eslEnabled);
    topic = fallback.topic;
    whyItMatters = fallback.whyItMatters;
    questions = fallback.questions;
    followUps = fallback.followUps;
  }

  const focus = getHeadlineFocus(item, conceptKey, topic);
  const questionStyle = getQuestionStyle(item, conceptKey, topicType, mode, eslEnabled);
  const dynamicSet =
    buildTopicAlignedSet(topic, focus, mode, eslEnabled) ||
    buildQuestionSet(focus, questionStyle, mode, eslEnabled);
  questions = dynamicSet.questions;
  followUps = dynamicSet.followUps;

  let card = {
    topic,
    question: sample(questions),
    followUps,
    whyItMatters,
    quickWrite: dynamicSet.quickWrite,
    questionStyle,
    sourceContext: fullHeadline,
    fullHeadline,
    conceptKey,
    topicType,
  };

  if (!framingFitsHeadline(item, card)) {
    const honestTopic = getAccurateFallbackTopic(item, conceptKey);
    const honestFocus = honestTopic.toLowerCase();
    const honestStyle = conceptKey === "pop culture trend" ? "opinion" : "decision";
    const honestSet = buildQuestionSet(honestFocus, honestStyle, mode, eslEnabled);

    card = {
      ...card,
      topic: honestTopic,
      question: sample(honestSet.questions),
      followUps: honestSet.followUps,
      whyItMatters: conceptKey === "pop culture trend"
        ? "This shows how trends and popularity can shape choices."
        : "This shows how people respond to new ideas and changes.",
      quickWrite: honestSet.quickWrite,
      questionStyle: honestStyle,
    };
  }

  return card;
}

function buildValidatedCard(item, mode, eslEnabled) {
  const card = buildCardContent(item, mode, eslEnabled);

  if (!isCardUsable(item, card, mode, eslEnabled)) {
    return null;
  }

  return card;
}

function buildWritingPrompt(mode, eslEnabled, card) {
  if (card?.quickWrite) {
    return card.quickWrite;
  }

  if (eslEnabled || mode === "esl") {
    return "I think ___ because ___. One reason is ___.";
  }

  if (mode === "3-5") {
    return "Write one sentence explaining your opinion.";
  }

  return sample(writingPrompts);
}

function buildTeacherMove(mode, eslEnabled) {
  if (eslEnabled || mode === "esl") {
    const supportiveMoves = [
      "If students pause, ask: 'Can you say one good thing?'",
      "If answers are short, ask: 'Can you tell me more?'",
      "If students need help, ask: 'Do you agree or disagree?'",
    ];

    return sample(supportiveMoves);
  }

  return sample(teacherMoves);
}

function splitFollowUpPrompt(prompt) {
  const punctuationMatch = prompt.match(/^(.{1,32}?[?:])\s+(.*)$/);
  if (punctuationMatch) {
    return {
      lead: punctuationMatch[1],
      rest: punctuationMatch[2],
    };
  }

  const words = prompt.trim().split(/\s+/);
  const leadCount = Math.min(3, words.length);

  return {
    lead: words.slice(0, leadCount).join(" "),
    rest: words.slice(leadCount).join(" "),
  };
}

function buildSourceLine(item, sourceContext, eslEnabled) {
  if (item.isFallback) {
    return "FIRST FIVE TOPIC";
  }

  return "LIVE HEADLINE";
}

function formatHeadlineDate(displayDate) {
  if (!displayDate) {
    return "";
  }

  const parsed = new Date(displayDate);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatHeadlineFreshness(displayDate) {
  if (!displayDate) {
    return "";
  }

  const parsed = new Date(displayDate);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const now = new Date();
  const diffMs = now.getTime() - parsed.getTime();

  if (diffMs < 0) {
    return "";
  }

  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) {
    return "Today";
  }

  if (diffDays === 1) {
    return "Yesterday";
  }

  if (diffMs <= 72 * 60 * 60 * 1000) {
    return `${diffDays}d ago`;
  }

  return "";
}

function buildSourceMeta(item) {
  const source = item.source || "Live feed";
  const formattedDate = formatHeadlineDate(item.displayDate);
  const freshness = formatHeadlineFreshness(item.displayDate);

  if (item.isFallback) {
    return source;
  }

  if (formattedDate && freshness) {
    return `${source} • ${formattedDate} • ${freshness}`;
  }

  if (formattedDate) {
    return `${source} • ${formattedDate}`;
  }

  return source;
}

function getLegacyTopicsForMode(mode) {
  return legacyTopicsByMode[mode] || legacyTopicsByMode["6-8"];
}

function getLegacyApprovedHeadlines(items, mode) {
  return getTopLegacyFilteredHeadlines(items, getLegacyTopicsForMode(mode));
}

const classroomSafetyTerms = [
  "murder",
  "killing",
  "killed",
  "kill",
  "homicide",
  "sexual",
  "sex ",
  "sex-",
  "sexually",
  "porn",
  "rape",
  "molestation",
  "drugs",
  "drug",
  "cocaine",
  "heroin",
  "fentanyl",
  "meth",
  "overdose",
  "shooting",
  "gun violence",
  "stabbing",
  "explicit violence",
  "assault",
];

const classroomSafetyPhrases = [
  ["victim", "found"],
  ["charged", "with"],
  ["arrested", "for"],
  ["investigation", "into"],
];

const curriculumMap = {
  "3-5": {
    science: [
      "weather",
      "cloud",
      "clouds",
      "magnet",
      "magnets",
      "plant",
      "plants",
      "animal",
      "animals",
      "habitat",
      "habitats",
      "pollination",
      "pollinator",
      "pollinators",
      "magnetism",
      "moon",
      "planet",
      "nasa",
    ],
    socialStudies: [
      "native american",
      "explorer",
      "explorers",
      "sacajawea",
      "early humans",
      "ancient",
      "community",
      "map",
      "tradition",
      "culture",
    ],
    technology: [
      "robot",
      "robots",
      "ai",
      "computer",
      "computers",
      "space",
      "nasa",
      "machine",
      "device",
      "tool",
    ],
    generalKnowledge: [
      "animal",
      "animals",
      "nature",
      "forest",
      "ocean",
      "river",
      "bird",
      "birds",
      "habitat",
      "habitats",
      "people",
      "community",
      "human",
      "helping",
      "kindness",
    ],
  },
  "6-8": {
    science: [
      "weather",
      "climate",
      "energy",
      "ecosystem",
      "ecosystems",
      "species",
      "habitat",
      "habitats",
      "planet",
      "space",
      "nasa",
      "astronaut",
      "science",
      "research",
      "discovery",
    ],
    socialStudies: [
      "history",
      "ancient",
      "civilization",
      "culture",
      "society",
      "community",
      "government",
      "election",
      "rights",
      "citizen",
      "citizens",
      "migration",
      "explorer",
      "explorers",
    ],
    technology: [
      "robot",
      "robots",
      "ai",
      "computer",
      "computers",
      "software",
      "app",
      "apps",
      "digital",
      "device",
      "devices",
      "internet",
      "cyber",
      "nasa",
      "space",
    ],
    generalKnowledge: [
      "animal",
      "animals",
      "nature",
      "human",
      "people",
      "world",
      "trend",
      "music",
      "movie",
      "show",
      "sports",
      "team",
      "health",
      "friend",
      "friends",
    ],
  },
};

function filterForClassroomSafety(items) {
  return items.filter((item) => {
    const sourceText = `${item.title || ""} ${item.description || ""}`.toLowerCase();
    const hasBlockedTerm = classroomSafetyTerms.some((term) => sourceText.includes(term));
    const hasBlockedPhrase = classroomSafetyPhrases.some((parts) =>
      parts.every((part) => sourceText.includes(part))
    );

    return !hasBlockedTerm && !hasBlockedPhrase;
  });
}

const classroomRelevanceTerms = [
  "label",
  "dropped",
  "album rollout",
  "tour struggles",
  "celebrity",
  "influencer",
  "viral moment",
  "paparazzi",
  "red carpet",
  "box office",
  "premiere",
  "back-to-back series",
  "physical transformation",
  "hot take",
  "living nightmare",
  "streaming sites",
  "song collabs",
  "music industry",
  "industry gossip",
  "promo",
  "promotional",
];

const classroomRelevanceNames = [
  "michael jackson",
  "richard gadd",
  "d4vd",
];

const classroomRelevanceExceptions = [
  "ai",
  "technology",
  "tech",
  "robot",
  "science",
  "space",
  "nasa",
  "animal",
  "animals",
  "wildlife",
  "environment",
  "climate",
  "weather",
  "water",
  "planet",
  "system",
  "systems",
  "change",
  "decision",
  "decisions",
  "choice",
  "choices",
  "culture change",
];

function filterForClassroomRelevance(items) {
  return items.filter((item) => {
    const sourceText = `${item.title || ""} ${item.description || ""}`.toLowerCase();
    const conceptKey = getConceptKey(item.title || "");
    const blockedByGossip =
      classroomRelevanceTerms.some((term) => sourceText.includes(term)) ||
      classroomRelevanceNames.some((term) => sourceText.includes(term));
    const hasBroadException =
      classroomRelevanceExceptions.some((term) => sourceText.includes(term)) ||
      includesAnyTerm(sourceText, ["science", "space", "animal", "animals", "environment", "technology", "system", "change"]);

    if (
      conceptKey === "space discovery" ||
      conceptKey === "animal behavior" ||
      conceptKey === "environmental change" ||
      conceptKey === "science discovery"
    ) {
      return true;
    }

    if (conceptKey === "new technology" && hasBroadException) {
      return true;
    }

    if (blockedByGossip && !hasBroadException) {
      return false;
    }

    return true;
  });
}

function passesDiscoveryHeadlineCheck(item, mode) {
  if (item.sourceType !== "discovery") {
    return true;
  }

  const conceptKey = getConceptKey(item.title || "");

  if (!moderateClassroomConcepts.includes(conceptKey)) {
    return false;
  }

  return (
    isHeadlineAllowedForMode(item, mode) &&
    isKidImaginableHeadline(item) &&
    headlinePassesSimplicityTest(item) &&
    headlineHasStrongIdea(item) &&
    headlineHasDiscussionValue(item) &&
    headlineFeelsStudentRelevant(item)
  );
}

const strongSensitiveTerms = [
  "murder",
  "homicide",
  "rape",
  "molestation",
  "porn",
  "sexual assault",
  "child abuse",
  "overdose",
  "fentanyl",
  "heroin",
  "cocaine",
  "meth",
  "shooting",
  "stabbing",
];

const classroomFallbackConcepts = [
  "science discovery",
  "space discovery",
  "animal behavior",
  "new technology",
];

const moderateClassroomConcepts = [
  "science discovery",
  "space discovery",
  "animal behavior",
  "environmental change",
  "new technology",
];

const moderateBackfillBlockedTerms = [
  "celebrity",
  "music business",
  "album rollout",
  "label",
  "promo",
  "promotional",
  "box office",
  "tour struggles",
  "viral moment",
  "streaming",
  "industry gossip",
  "red carpet",
  "paparazzi",
];

function allowNeutralLegacyFallbacks(items, max = 2) {
  const neutralItems = items.filter((item) => {
    const sourceText = `${item.title || ""} ${item.description || ""}`.toLowerCase();
    const conceptKey = getConceptKey(item.title || "");
    return (
      classroomFallbackConcepts.includes(conceptKey) &&
      !strongSensitiveTerms.some((term) => sourceText.includes(term))
    );
  });

  return neutralItems.slice(0, max);
}

function getModeratelyRelevantHeadlines(items, existingItems, mode, max = 3) {
  const existingTitles = new Set(existingItems.map((item) => item.title));

  const moderateItems = items.filter((item) => {
    if (existingTitles.has(item.title)) {
      return false;
    }

    if (!approvedClassroomSources.has(item.source || "")) {
      return false;
    }

    if (!isHeadlineAllowedForMode(item, mode)) {
      return false;
    }

    const conceptKey = getConceptKey(item.title || "");
    if (!moderateClassroomConcepts.includes(conceptKey)) {
      return false;
    }

    const sourceText = `${item.source || ""} ${item.title || ""} ${item.description || ""}`.toLowerCase();
    if (moderateBackfillBlockedTerms.some((term) => sourceText.includes(term))) {
      return false;
    }

    if (!isKidImaginableHeadline(item)) {
      return false;
    }

    if (!headlinePassesSimplicityTest(item)) {
      return false;
    }

    if (!headlineHasStrongIdea(item)) {
      return false;
    }

    if (!headlineHasDiscussionValue(item)) {
      return false;
    }

    return true;
  });

  return moderateItems
    .sort((a, b) => {
      const scoreA = (a.finalScore || a.classroomScore || a.legacyScore || 0) + getSourceQualityScore(a);
      const scoreB = (b.finalScore || b.classroomScore || b.legacyScore || 0) + getSourceQualityScore(b);
      return scoreB - scoreA;
    })
    .slice(0, max);
}

function getClassroomRankingBoost(item) {
  const topic = item.legacyTopic || "";

  if (
    topic.includes("Space") ||
    topic.includes("Environment") ||
    topic.includes("Tech") ||
    topic.includes("AI") ||
    topic.includes("Animal") ||
    topic.includes("Science")
  ) {
    return 1.5;
  }

  if (
    topic.includes("Baseball") ||
    topic.includes("Football") ||
    topic.includes("Basketball") ||
    topic.includes("Hockey") ||
    topic.includes("Olympics") ||
    topic.includes("Golf") ||
    topic.includes("College Sports")
  ) {
    return 0.5;
  }

  return 0;
}

function getCurriculumMatch(item, mode) {
  const map = curriculumMap[mode];
  if (!map) {
    return { curriculumCategory: "", curriculumBoost: 0, curriculumMatches: 0 };
  }

  const sourceText = `${item.title || ""} ${item.description || ""}`.toLowerCase();
  let bestCategory = "";
  let bestBoost = 0;
  let bestMatches = 0;

  Object.entries(map).forEach(([category, keywords]) => {
    const matches = keywords.filter((keyword) => sourceText.includes(keyword)).length;

    if (matches >= 2 && bestBoost < 2) {
      bestCategory = category;
      bestBoost = 2;
      bestMatches = matches;
      return;
    }

    if (matches >= 1 && bestBoost < 1) {
      bestCategory = category;
      bestBoost = 1;
      bestMatches = matches;
    }
  });

  return {
    curriculumCategory: bestCategory,
    curriculumBoost: bestBoost,
    curriculumMatches: bestMatches,
  };
}

function getModeCurriculumModifier(item, mode, curriculumCategory) {
  const sourceText = `${item.title || ""} ${item.description || ""}`.toLowerCase();

  if (mode === "3-5") {
    if (
      includesAnyTerm(sourceText, [
        "animal",
        "animals",
        "bird",
        "birds",
        "space",
        "moon",
        "mars",
        "planet",
        "nature",
        "ocean",
        "forest",
        "weather",
        "plant",
        "plants",
        "habitat",
        "science",
      ])
    ) {
      return 1.15;
    }

    if (
      includesAnyTerm(sourceText, [
        "policy",
        "business",
        "market",
        "economy",
        "economic",
        "pricing",
        "government",
        "institution",
        "abstract",
      ])
    ) {
      return 0.35;
    }

    if (curriculumCategory === "socialStudies") {
      return 0.85;
    }

    return 1;
  }

  if (mode === "6-8") {
    if (
      curriculumCategory === "technology" ||
      curriculumCategory === "socialStudies" ||
      includesAnyTerm(sourceText, [
        "technology",
        "tech",
        "ai",
        "robot",
        "world",
        "global",
        "fair",
        "fairness",
        "ethic",
        "ethics",
        "decision",
        "decisions",
        "choice",
        "choices",
        "rights",
      ])
    ) {
      return 1.15;
    }

    return 1;
  }

  return 1;
}

function applyCurriculumBoost(items, mode) {
  return items
    .map((item) => {
      const { curriculumCategory, curriculumBoost, curriculumMatches } = getCurriculumMatch(item, mode);
      const baseScore = item.legacyScore || 0;
      let adjustedBoost = 0;

      if (baseScore > 0) {
        const requestedBoost = curriculumBoost >= 2 ? 1.5 : curriculumBoost >= 1 ? 0.75 : 0;
        const modeAdjustedBoost = requestedBoost * getModeCurriculumModifier(item, mode, curriculumCategory);
        adjustedBoost = Math.min(modeAdjustedBoost, baseScore * 0.4);
      }

      return {
        ...item,
        curriculumCategory,
        curriculumMatches,
        curriculumBoost: adjustedBoost,
        finalScore: baseScore + adjustedBoost,
      };
    })
    .sort((a, b) => b.finalScore - a.finalScore);
}

function headlineHasConcreteSubject(item) {
  const sourceText = `${item.title || ""} ${item.description || ""}`.toLowerCase();
  return includesAnyTerm(sourceText, [
    "animal",
    "animals",
    "bird",
    "birds",
    "dog",
    "cat",
    "space",
    "moon",
    "mars",
    "planet",
    "robot",
    "robots",
    "weather",
    "cloud",
    "clouds",
    "plant",
    "plants",
    "water",
    "ocean",
    "forest",
    "team",
    "player",
    "game",
  ]);
}

function headlineFeelsDiscussionHeavy(item) {
  const sourceText = `${item.title || ""} ${item.description || ""}`.toLowerCase();
  return includesAnyTerm(sourceText, [
    "fair",
    "fairness",
    "decision",
    "decisions",
    "choice",
    "choices",
    "rights",
    "ethic",
    "ethics",
    "change",
    "impact",
    "world",
    "global",
  ]);
}

function getSelectionScore(item, mode) {
  const base = item.finalScore || item.classroomScore || item.legacyScore || 0;

  if (mode === "3-5") {
    return base + (headlineHasConcreteSubject(item) ? 0.5 : 0);
  }

  if (mode === "6-8") {
    return base + (headlineFeelsDiscussionHeavy(item) ? 0.5 : 0);
  }

  return base;
}

function diversifyCurriculumSelection(items, mode, max = items.length) {
  const remaining = [...items];
  const selected = [];
  const usedCategories = new Set();
  const priorityOrder =
    mode === "3-5"
      ? ["science", "generalKnowledge", "technology", "socialStudies"]
      : ["technology", "socialStudies", "science", "generalKnowledge"];

  const sortedRemaining = [...remaining].sort((a, b) => getSelectionScore(b, mode) - getSelectionScore(a, mode));

  priorityOrder.forEach((category) => {
    if (selected.length >= max) {
      return;
    }

    const bestInCategory = sortedRemaining.find((item) => item.curriculumCategory === category);
    if (bestInCategory) {
      selected.push(bestInCategory);
      usedCategories.add(category);
    }
  });

  sortedRemaining.forEach((item) => {
    const category = item.curriculumCategory || "";
    if (selected.length >= max) {
      return;
    }

    if (category && !usedCategories.has(category) && !selected.includes(item)) {
      selected.push(item);
      usedCategories.add(category);
    }
  });

  sortedRemaining.forEach((item) => {
    if (selected.length >= max) {
      return;
    }

    if (!selected.includes(item)) {
      selected.push(item);
    }
  });

  return selected;
}

function applyClassroomRankingBoost(items) {
  return items
    .map((item) => ({
      ...item,
      classroomBoost: getClassroomRankingBoost(item),
      classroomScore: (item.legacyScore || 0) + getClassroomRankingBoost(item),
    }))
    .sort((a, b) => b.classroomScore - a.classroomScore);
}

function updateDebugView(data) {
  state.debug = data;

  if (!debugOutput) {
    return;
  }

  const lines = [
    `Mode: ${data.mode || "none"}`,
    `Feed items loaded: ${data.feedCount ?? 0}`,
    `Legacy-approved headlines: ${data.legacyCount ?? 0}`,
    `Classroom-safe after legacy: ${data.classroomSafeCount ?? 0}`,
    `Discovery items allowed: ${data.discoveryCount ?? 0}`,
    `Moderately relevant added: ${data.moderateRelevantCount ?? 0}`,
    `Neutral fallback after safety: ${data.neutralFallbackCount ?? 0}`,
    `Teacher-card candidates: ${data.teacherCandidateCount ?? 0}`,
    `Current source: ${data.currentSource || "none"}`,
    "",
    "Legacy-approved titles:",
    ...((data.legacyTitles || []).length ? data.legacyTitles.map((title) => `- ${title}`) : ["- none"]),
    "",
    "Removed by classroom safety:",
    ...((data.removedTitles || []).length ? data.removedTitles.map((title) => `- ${title}`) : ["- none"]),
    "",
    "Current card headline:",
    data.currentHeadline || "none",
  ];

  debugOutput.textContent = lines.join("\n");
}

function buildCandidateCards(items) {
  return items
    .map((item) => ({
      item,
      card: buildValidatedCard(item, state.mode, state.esl),
    }))
    .filter((entry) => entry.card);
}

function getSourceQualityScore(item) {
  const source = item.source || "";
  const sourceText = `${item.source || ""} ${item.title || ""}`.toLowerCase();

  if (highValueSources.has(source)) {
    return 1.5;
  }

  if (lowValueSourceTerms.some((term) => sourceText.includes(term))) {
    return -1;
  }

  if (item.sourceType === "discovery") {
    const conceptKey = getConceptKey(item.title || "");

    if (!moderateClassroomConcepts.includes(conceptKey)) {
      return -1;
    }

    if (
      includesAnyTerm(sourceText, [
        "update",
        "announced",
        "meeting",
        "talks",
        "plan",
        "plans",
        "process",
        "officials",
        "latest",
        "new report",
      ])
    ) {
      return -1;
    }
  }

  return 0;
}

function cardTopicIsConcrete(card) {
  const text = `${card.topic || ""} ${card.question || ""}`.toLowerCase();
  return includesAnyTerm(text, [
    "animal",
    "animals",
    "bird",
    "birds",
    "space",
    "moon",
    "mars",
    "planet",
    "weather",
    "water",
    "forest",
    "ocean",
    "robot",
    "robots",
    "plants",
    "nature",
    "sports",
  ]);
}

function cardFeelsAbstract(card) {
  const text = `${card.topic || ""} ${card.question || ""} ${card.whyItMatters || ""}`.toLowerCase();
  return includesAnyTerm(text, [
    "fair",
    "fairness",
    "decision",
    "decisions",
    "change",
    "changes",
    "choice",
    "choices",
    "policy",
    "business",
    "system",
    "systems",
  ]);
}

function cardFeelsDebateReady(card) {
  const text = `${card.topic || ""} ${card.question || ""} ${card.whyItMatters || ""}`.toLowerCase();
  return includesAnyTerm(text, [
    "should",
    "fair",
    "fairness",
    "change",
    "decision",
    "choice",
    "worth",
    "trade",
    "help",
    "protect",
  ]);
}

function getModeCardSelectionScore(entry, mode) {
  const base = entry.item.finalScore || entry.item.classroomScore || entry.item.legacyScore || 0;
  const titleWords = countWords(entry.item.title || "");
  const sourceQualityScore = getSourceQualityScore(entry.item);
  let score = base;

  score += sourceQualityScore;

  if (mode === "3-5") {
    if (entry.item.curriculumCategory === "science" || entry.item.curriculumCategory === "generalKnowledge") {
      score += 1.5;
    }
    if (cardTopicIsConcrete(entry.card)) {
      score += 1;
    }
    if (titleWords <= 10) {
      score += 0.5;
    }
    if (cardFeelsAbstract(entry.card)) {
      score -= 1;
    }
  } else if (mode === "6-8") {
    if (entry.item.curriculumCategory === "technology" || entry.item.curriculumCategory === "socialStudies") {
      score += 1.5;
    }
    if (cardFeelsDebateReady(entry.card)) {
      score += 1;
    }
  }

  return score;
}

function selectCardsByMode(cards, mode) {
  const max = 5;
  const sorted = [...cards].sort((a, b) => getModeCardSelectionScore(b, mode) - getModeCardSelectionScore(a, mode));
  const selected = [];
  const usedCategories = new Set();

  sorted.forEach((entry) => {
    if (selected.length >= max) {
      return;
    }

    const category = entry.item.curriculumCategory || "";
    if (category && !usedCategories.has(category)) {
      selected.push(entry);
      usedCategories.add(category);
    }
  });

  sorted.forEach((entry) => {
    if (selected.length >= max) {
      return;
    }

    if (!selected.includes(entry)) {
      selected.push(entry);
    }
  });

  return selected;
}

function getTopMomentScore(entry, mode) {
  let score = getModeCardSelectionScore(entry, mode);

  if (mode === "3-5") {
    if (cardTopicIsConcrete(entry.card)) {
      score += 1.5;
    }
    if (entry.item.curriculumCategory === "science" || entry.item.curriculumCategory === "generalKnowledge") {
      score += 1;
    }
  } else {
    if (cardFeelsDebateReady(entry.card)) {
      score += 1.5;
    }
    if (entry.item.curriculumCategory === "technology" || entry.item.curriculumCategory === "socialStudies") {
      score += 1;
    }
  }

  return score;
}

function isAccessibleTopPick(entry, mode) {
  if (mode === "3-5") {
    return (
      cardTopicIsConcrete(entry.card) &&
      (entry.item.curriculumCategory === "science" || entry.item.curriculumCategory === "generalKnowledge")
    );
  }

  return cardFeelsDebateReady(entry.card);
}

function curateTopMoments(cards, mode) {
  if (!cards.length) {
    return cards;
  }

  const sorted = [...cards].sort((a, b) => getTopMomentScore(b, mode) - getTopMomentScore(a, mode));
  const topPick = sorted.find((entry) => isAccessibleTopPick(entry, mode)) || sorted[0];
  const curated = [
    {
      ...topPick,
      curationTag: mode === "3-5" ? "Start Here" : "Top Pick",
    },
  ];

  cards.forEach((entry) => {
    if (entry.item.title !== topPick.item.title) {
      curated.push(entry);
    }
  });

  return curated;
}

function getSafeHeadlinePool() {
  const legacyApproved = state.feedItems.length ? getLegacyApprovedHeadlines(state.feedItems, state.mode) : [];
  const classroomSafe = filterForClassroomSafety(legacyApproved);
  const classroomRelevant = filterForClassroomRelevance(classroomSafe).filter((item) =>
    passesDiscoveryHeadlineCheck(item, state.mode)
  );
  const primaryRelevant = classroomRelevant.filter((item) => item.sourceType !== "discovery");
  const discoveryRelevant = classroomRelevant.filter((item) => item.sourceType === "discovery");
  const moderateRelevant = primaryRelevant.length >= 4
    ? []
    : getModeratelyRelevantHeadlines(classroomSafe, primaryRelevant, state.mode, 3);
  const boostedPrimaryRelevant = diversifyCurriculumSelection(
    applyCurriculumBoost(applyClassroomRankingBoost(primaryRelevant), state.mode)
  , state.mode);
  const boostedDiscoveryRelevant = diversifyCurriculumSelection(
    applyCurriculumBoost(applyClassroomRankingBoost(discoveryRelevant), state.mode)
  , state.mode).slice(0, 2);
  const boostedModerateRelevant = diversifyCurriculumSelection(
    applyCurriculumBoost(applyClassroomRankingBoost(moderateRelevant), state.mode)
  , state.mode);
  const fallbackNeutral = primaryRelevant.length ? [] : allowNeutralLegacyFallbacks(classroomSafe, 2);
  const boostedNeutralFallback = diversifyCurriculumSelection(
    applyCurriculumBoost(applyClassroomRankingBoost(fallbackNeutral), state.mode)
  , state.mode);
  const removedTitles = legacyApproved
    .filter((item) =>
      !primaryRelevant.includes(item) &&
      !discoveryRelevant.includes(item) &&
      !moderateRelevant.includes(item) &&
      !fallbackNeutral.includes(item)
    )
    .map((item) => item.title);
  const combinedBoosted = [...boostedPrimaryRelevant];
  boostedDiscoveryRelevant.forEach((item) => {
    if (!combinedBoosted.some((existing) => existing.title === item.title)) {
      combinedBoosted.push(item);
    }
  });
  boostedModerateRelevant.forEach((item) => {
    if (!combinedBoosted.some((existing) => existing.title === item.title)) {
      combinedBoosted.push(item);
    }
  });
  const list = combinedBoosted.length ? combinedBoosted : boostedNeutralFallback.length ? boostedNeutralFallback : fallbackHeadlines;
  const globallySafeItems = list.filter((item) => !includesBlockedTopic(item.title));
  const candidateCards = buildCandidateCards(globallySafeItems);
  const gradeSafeItems = curateTopMoments(
    removeRecentlySeenHeadlines(selectCardsByMode(candidateCards, state.mode), 4),
    state.mode
  );

  updateDebugView({
    mode: state.mode,
    feedCount: state.feedItems.length,
    legacyCount: legacyApproved.length,
    classroomSafeCount: primaryRelevant.length,
    discoveryCount: discoveryRelevant.length,
    moderateRelevantCount: moderateRelevant.length,
    neutralFallbackCount: fallbackNeutral.length,
    teacherCandidateCount: gradeSafeItems.length,
    legacyTitles: legacyApproved.map((item) => item.title).slice(0, 8),
    removedTitles: removedTitles.slice(0, 8),
    currentHeadline: state.debug?.currentHeadline || "",
    currentSource: state.debug?.currentSource || "",
  });

  if (gradeSafeItems.length) {
    return gradeSafeItems;
  }

  const fallbackSafeItems = curateTopMoments(
    removeRecentlySeenHeadlines(selectCardsByMode(buildCandidateCards(fallbackHeadlines), state.mode), 4),
    state.mode
  );

  return fallbackSafeItems;
}

function getSourceWeight(item) {
  return sourcePriority[item.source] || 1;
}

function getTopicWeight(item) {
  const topicType = getTopicType(item);

  if (topicType === "discovery") {
    return 5;
  }

  if (topicType === "technology") {
    return 4;
  }

  if (topicType === "decisions" || topicType === "human behavior") {
    return 3;
  }

  return 1;
}

function chooseWeightedHeadline(items) {
  const weighted = items.flatMap((item) => {
    const weight = Math.max(1, getSourceWeight(item) + getTopicWeight(item) - 1);
    return Array.from({ length: weight }, () => item);
  });

  return sample(weighted.length ? weighted : items);
}

function getNextHeadline() {
  const list = getSafeHeadlinePool();

  if (!list.length) {
    return null;
  }

  if (state.currentIndex === -1) {
    state.currentIndex = 0;
    return list[0];
  }

  if (list.length === 1) {
    state.currentIndex = 0;
    return list[0];
  }

  const recentCategories = state.recentCategories.slice(-2);
  let candidatePool = list.filter((item, index) => {
    if (index === state.currentIndex) {
      return false;
    }

    return !recentCategories.includes(item.card.topicType);
  });

  if (!candidatePool.length) {
    candidatePool = list.filter((_, index) => index !== state.currentIndex);
  }

  const weightedPool = candidatePool.length ? candidatePool : list;
  const pickedItem = sample(weightedPool);
  const nextIndex = list.findIndex((item) => item === pickedItem);

  state.currentIndex = nextIndex;
  return pickedItem;
}

function animateCard() {
  discussionCard.classList.remove("is-visible");
  void discussionCard.offsetWidth;
  discussionCard.classList.add("is-visible");
}

function renderCard() {
  const selected = getNextHeadline();
  if (!selected) {
    setFeedStatus("Using built-in headlines");
    return;
  }
  const { item, card } = selected;
  const writing = buildWritingPrompt(state.mode, state.esl, card);
  const move = buildTeacherMove(state.mode, state.esl);
  const renderedFollowUps = buildRotatingFollowUps(card.questionStyle, state.mode, state.esl);
  const curriculumLabels = {
    science: "Science Spotlight",
    technology: "Tech Talk",
    socialStudies: "Big Question",
    generalKnowledge: "In Our World",
  };
  const curriculumCardClasses = {
    science: "card-science",
    technology: "card-tech",
    socialStudies: "card-social",
    generalKnowledge: "card-general",
  };

  modeBadge.textContent = state.esl ? "Sentence starters on" : modeLabels[state.mode];
  curationBadge.textContent = selected.curationTag || "";
  curationBadge.classList.toggle("is-hidden", !selected.curationTag);
  curriculumLabel.textContent = curriculumLabels[item.curriculumCategory] || "In Our World";
  discussionCard.classList.remove("card-science", "card-tech", "card-general", "card-social", "is-curated");
  discussionCard.classList.toggle("is-curated", Boolean(selected.curationTag));
  if (curriculumCardClasses[item.curriculumCategory]) {
    discussionCard.classList.add(curriculumCardClasses[item.curriculumCategory]);
  }
  cardTitle.textContent = card.topic;
  cardTitle.title = item.title || card.fullHeadline;
  whyItMatters.textContent = card.whyItMatters;
  sourceLine.textContent = buildSourceLine(item, card.sourceContext, state.esl);
  realHeadline.textContent = item.title || card.fullHeadline || "Finding a live headline for you.";
  realHeadline.title = item.title || card.fullHeadline || "";
  sourceMeta.textContent = buildSourceMeta(item);
  sourceLink.href = item.link || "#";
  sourceLink.classList.toggle("is-hidden", !item.link);
  mainQuestion.textContent = card.question;
  quickWrite.textContent = writing;
  teacherMove.textContent = move;
  followUpsList.innerHTML = "";

  renderedFollowUps.forEach((prompt) => {
    const node = followUpTemplate.content.firstElementChild.cloneNode(true);
    const parts = splitFollowUpPrompt(prompt);
    const lead = document.createElement("strong");
    lead.className = "followup-lead";
    lead.textContent = parts.lead;
    node.appendChild(lead);

    if (parts.rest) {
      node.append(` ${parts.rest}`);
    }

    followUpsList.appendChild(node);
  });

  state.cardCount += 1;

  if (state.cardCount >= 4) {
    paywallNote.textContent = "Want unlimited prompts when your class needs it most?";
  } else {
    paywallNote.textContent = "";
  }

  state.recentCategories = [...state.recentCategories.slice(-1), card.topicType];
  state.recentFollowUps = renderedFollowUps;
  rememberHeadline(item.title || card.fullHeadline || "");
  updateDebugView({
    ...(state.debug || {}),
    currentHeadline: item.title,
    currentSource: item.source || "First Five",
  });

  animateCard();
}

function setActiveScreen(activeScreen) {
  [entryScreen, cardScreen].forEach((screen) => {
    screen.classList.toggle("active", screen === activeScreen);
  });
}

function setFeedStatus(message) {
  feedStatus.textContent = message;
}

function mapFeedItems(json, feed) {
  const items = json.items || json.channel?.item || [];

  return items
    .map((item) => ({
      source: feed.name,
      title: item.title || "",
      link: item.link || item.guid || "",
      displayDate: item.pubDate || item.published || "",
      sourceType: feed.tier === "discovery" ? "discovery" : "rss",
    }))
    .filter((item) => item.title);
}

async function fetchFeed(feed) {
  const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
  const response = await fetch(proxyUrl);

  if (!response.ok) {
    throw new Error(`Feed failed: ${feed.name}`);
  }

  const data = await response.json();
  return mapFeedItems(data, feed);
}

async function loadFeeds() {
  setFeedStatus("Ready for today’s discussion");

  try {
    const results = await Promise.allSettled(rssFeeds.map(fetchFeed));
    const successfulFeeds = results
      .map((result, index) => ({ result, feed: rssFeeds[index] }))
      .filter(({ result }) => result.status === "fulfilled");

    const coreItems = successfulFeeds
      .filter(({ feed }) => feed.tier === "core")
      .flatMap(({ result }) => result.value);
    const secondaryItems = successfulFeeds
      .filter(({ feed }) => feed.tier === "secondary")
      .flatMap(({ result }) => result.value);
    const prioritizedItems = [...coreItems, ...secondaryItems];

    state.feedItems = prioritizedItems.length ? prioritizedItems : fallbackHeadlines;
    setFeedStatus("Ready for today’s discussion");
  } catch (error) {
    state.feedItems = fallbackHeadlines;
    setFeedStatus("Ready for today’s discussion");
  }
}

function startSession(mode) {
  state.mode = mode;
  state.esl = mode === "esl";
  state.cardCount = 0;
  state.recentCategories = [];
  state.recentFollowUps = [];

  eslButton.classList.toggle("is-active", state.esl);
  eslButton.setAttribute("aria-pressed", String(state.esl));

  setActiveScreen(cardScreen);
  renderCard();
}

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    startSession(button.dataset.mode);
  });
});

document.querySelector("#shuffleButton").addEventListener("click", () => {
  renderCard();
});

document.querySelector("#backButton").addEventListener("click", () => {
  setActiveScreen(entryScreen);
});

document.querySelector("#unlockButton").addEventListener("click", () => {
  paywallNote.textContent = "Want unlimited prompts when your class needs it most?";
});

eslButton.addEventListener("click", () => {
  state.esl = !state.esl;
  eslButton.classList.toggle("is-active", state.esl);
  eslButton.setAttribute("aria-pressed", String(state.esl));
  renderCard();
});

loadFeeds();
