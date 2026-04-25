import { newsKeywordMap, badWordsByTopic } from "./newsKeywordMap.js";

const TOPIC_MAX = 4;

const NSFW_TERMS = [
  "nsfw",
  "onlyfans",
  "porn",
  "pornography",
  "xxx",
  "sex tape",
  "sex-tape",
  "sex video",
  "adult film",
  "adult video",
  "camgirl",
  "cam site",
  "camsite",
  "escort",
  "escorting",
  "prostitute",
  "prostitution",
  "brothel",
  "strip club",
  "stripclub",
  "stripper",
  "lap dance",
  "boudoir",
  "nude",
  "naked",
  "nudity",
  "explicit",
  "erotic",
  "fetish",
  "kink",
  "bdsm",
  "leaked photos",
  "leaked video",
  "sex work",
  "sexwork",
  "sexualized",
  "graphic sexual",
  "sexual assault",
  "rape",
  "molestation",
  "child abuse",
  "pedophile",
  "incest",
  "grooming",
];

const NSFW_DOMAIN_DENY = [
  "pornhub.com",
  "xvideos.com",
  "xnxx.com",
  "onlyfans.com",
  "chaturbate.com",
  "stripchat.com",
  "cam4.com",
  "camsoda.com",
  "youporn.com",
  "redtube.com",
  "spankbang.com",
];

const NSFW_EXCEPTIONS = ["middlesex", "essex", "sussex"];

const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const hasWord = (txt = "", term = "") =>
  new RegExp(`\\b${escapeRegex(term)}\\b`, "i").test(txt);

const lc = (s = "") => String(s).toLowerCase();
const includesAny = (txt = "", terms = []) => terms.some((t) => txt.includes(lc(t)));

function hostFromUrl(u = "") {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function isStoryNSFW(story = {}) {
  const host = hostFromUrl(story.url || story.link || "");
  if (host && NSFW_DOMAIN_DENY.some((d) => host.endsWith(d))) return true;

  const raw = `${story.title || ""} ${story.description || ""} ${story.source || ""}`.toLowerCase();

  if (NSFW_EXCEPTIONS.some((ex) => raw.includes(ex))) {
    // still check other terms
  }

  const alwaysBlock = NSFW_TERMS;
  for (const term of alwaysBlock) {
    if (hasWord(raw, term)) return true;
  }
  if (/\b(explicit|racy)\s+(images?|photos?|videos?)\b/i.test(raw)) return true;
  return false;
}

const MLB_TEAM_KEYWORDS = [
  "MLB",
  "Major League Baseball",
  "Yankees",
  "Dodgers",
  "Mets",
  "Red Sox",
  "Cubs",
  "Giants",
  "Phillies",
  "Braves",
  "Cardinals",
  "Astros",
  "Rangers",
  "Padres",
  "Blue Jays",
  "Orioles",
  "Mariners",
  "Pirates",
  "Rays",
  "Twins",
  "Brewers",
  "Guardians",
  "Rockies",
  "Angels",
  "Athletics",
  "Diamondbacks",
  "Nationals",
  "Marlins",
  "Reds",
  "Tigers",
  "Royals",
  "White Sox",
];

const NFL_TEAM_KEYWORDS = [
  "NFL",
  "National Football League",
  "Cowboys",
  "49ers",
  "Chiefs",
  "Eagles",
  "Giants",
  "Jets",
  "Patriots",
  "Packers",
  "Steelers",
  "Bills",
  "Rams",
  "Raiders",
  "Seahawks",
  "Dolphins",
  "Vikings",
  "Lions",
  "Bears",
  "Commanders",
  "Ravens",
  "Texans",
  "Jaguars",
  "Buccaneers",
  "Titans",
  "Saints",
  "Panthers",
  "Colts",
  "Browns",
  "Broncos",
  "Falcons",
  "Cardinals",
  "Chargers",
  "Bengals",
];

const NBA_TEAM_KEYWORDS = [
  "NBA",
  "National Basketball Association",
  "Lakers",
  "Celtics",
  "Warriors",
  "Knicks",
  "Nets",
  "Bulls",
  "Heat",
  "76ers",
  "Bucks",
  "Mavericks",
  "Clippers",
  "Suns",
  "Nuggets",
  "Timberwolves",
  "Spurs",
  "Rockets",
  "Pelicans",
  "Hawks",
  "Cavaliers",
  "Pistons",
  "Pacers",
  "Magic",
  "Wizards",
  "Hornets",
  "Raptors",
  "Grizzlies",
  "Jazz",
  "Thunder",
  "Kings",
  "Trail Blazers",
];

const NHL_TEAM_KEYWORDS = [
  "NHL",
  "National Hockey League",
  "Rangers",
  "Islanders",
  "Devils",
  "Bruins",
  "Canadiens",
  "Maple Leafs",
  "Red Wings",
  "Blackhawks",
  "Penguins",
  "Flyers",
  "Lightning",
  "Panthers",
  "Sabres",
  "Senators",
  "Capitals",
  "Hurricanes",
  "Blue Jackets",
  "Predators",
  "Blues",
  "Stars",
  "Avalanche",
  "Wild",
  "Jets",
  "Coyotes",
  "Golden Knights",
  "Kraken",
  "Oilers",
  "Flames",
  "Canucks",
  "Sharks",
  "Kings",
  "Ducks",
];

const TEAM_ALIASES = {
  yanks: "new york yankees",
  nyy: "new york yankees",
  mets: "new york mets",
  "ny mets": "new york mets",
  "d-backs": "arizona diamondbacks",
  dbacks: "arizona diamondbacks",
  cards: "st. louis cardinals",
  bosox: "boston red sox",
  chisox: "chicago white sox",
  nats: "washington nationals",
  halos: "los angeles angels",
  "sf giants": "san francisco giants",
  "la dodgers": "los angeles dodgers",
  "a's": "oakland athletics",
  as: "oakland athletics",
  jays: "toronto blue jays",
  "brew crew": "milwaukee brewers",
  buccos: "pittsburgh pirates",
  phils: "philadelphia phillies",
  friars: "san diego padres",
  rox: "colorado rockies",
  cowboys: "dallas cowboys",
  pats: "new england patriots",
  niners: "san francisco 49ers",
  chiefs: "kansas city chiefs",
};

function normalizeSportsText(s = "") {
  let t = String(s).toLowerCase();
  for (const [alias, full] of Object.entries(TEAM_ALIASES)) {
    if (!full) continue;
    t = t.replace(new RegExp(`\\b${alias}\\b`, "g"), full);
  }
  t = t.replace(/\bgiants\b/g, " new york giants ");
  t = t.replace(/\brangers\b/g, " new york rangers ");
  return t;
}

function scoreStoryByTopic(story = {}, topic = "", cityLabel = "", cityTeams = null, teamsToWatchLower = []) {
  if (isStoryNSFW(story)) return -999;

  let s = 0;
  if (story.sourceType === "newsdata") s += 1;
  else if (story.sourceType === "rss") s += 0.5;
  else if (story.isFallback) s += 0.25;

  const txt = normalizeSportsText(
    `${story.title || ""} ${story.description || ""} ${story.source || ""}`
  );

  const cfg = newsKeywordMap[topic] || {};
  const bads = badWordsByTopic[topic] || [];
  if (bads.some((word) => txt.includes(word.toLowerCase()))) return -999;
  if ((cfg.mustIncludeAny || []).length && !includesAny(txt, cfg.mustIncludeAny)) return -999;

  const w = cfg.domainWeights?.[hostFromUrl(story.url || story.link || "")];
  if (typeof w === "number") s += w;

  const posW = cfg.positiveWeight ?? 1;
  const negW = cfg.negativeWeight ?? 1.5;
  (cfg.positive || []).forEach((k) => {
    if (txt.includes(k.toLowerCase())) s += posW;
  });
  (cfg.negative || []).forEach((k) => {
    if (txt.includes(k.toLowerCase())) s -= negW;
  });

  const userState = (cityLabel.split(",")[1] || "").trim().toUpperCase();
  const cityLower = cityLabel.toLowerCase();
  if (cityLower && txt.includes(cityLower)) s += 1;

  const REGIONAL_POSITIVE_BY_STATE = {
    FL: ["Florida", "South Florida", "Broward", "Palm Beach", "Miami", "Fort Lauderdale", "West Palm Beach", "Boca Raton"],
  };
  const BIG_MARKET_NEGATIVES = [
    "los angeles",
    "california",
    "new york",
    "nyc",
    "chicago",
    "san francisco",
    "seattle",
    "boston",
    "philadelphia",
    "houston",
    "dallas",
    "atlanta",
    "phoenix",
    "denver",
  ];
  const regional = REGIONAL_POSITIVE_BY_STATE[userState] || [];
  regional.forEach((term) => {
    if (txt.includes(term.toLowerCase())) s += 0.5;
  });
  if (!txt.includes(cityLower) && !regional.some((t) => txt.includes(t.toLowerCase()))) {
    BIG_MARKET_NEGATIVES.forEach((term) => {
      if (txt.includes(term)) s -= 0.8;
    });
  }

  if (topic === "Baseball" && includesAny(txt, MLB_TEAM_KEYWORDS)) s += 0.75;
  if (topic === "Football" && includesAny(txt, NFL_TEAM_KEYWORDS)) s += 0.5;
  if (topic === "Basketball" && includesAny(txt, NBA_TEAM_KEYWORDS)) s += 0.5;
  if (topic === "Hockey" && includesAny(txt, NHL_TEAM_KEYWORDS)) s += 0.5;

  const localTeams = (cityTeams?.[topic] || []).map(lc);
  if (localTeams.length && includesAny(txt, localTeams)) s += 1.0;

  if (teamsToWatchLower.length && includesAny(txt, teamsToWatchLower)) s += 1.0;

  const d = new Date(story.publishedAt || story.pubDate || Date.now());
  const days = (Date.now() - d.getTime()) / 86400000;
  if (days > 30) s -= 1;
  if (days > 90) s -= 2;

  if (topic === "Baseball") s += 0.2;

  return s;
}

function refineTopic(items = [], topic = "", cityLabel = "", cityTeams = null, max = TOPIC_MAX, teamsToWatchLower = []) {
  const cfg = newsKeywordMap[topic] || {};
  const minScore = Number.isFinite(cfg.minScore) ? cfg.minScore : -Infinity;

  let filtered = (items || [])
    .map((st) => ({ st, score: scoreStoryByTopic(st, topic, cityLabel, cityTeams, teamsToWatchLower) }))
    .filter((x) => x.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.st);

  if (filtered.length < max && !filtered.some((s) => s.isFallback) && items.some((s) => s.isFallback)) {
    const topCurated = items.find((s) => s.isFallback);
    if (topCurated) filtered.push(topCurated);
  }

  return filtered.slice(0, max);
}

function adaptHeadlineForLegacy(item = {}) {
  return {
    ...item,
    description: "",
    url: item.url || item.link || "",
    sourceType: item.sourceType === "api" ? "newsdata" : item.sourceType || "rss",
  };
}

function getTopLegacyFilteredHeadlines(items = [], topics = [], maxPerTopic = 2, maxResults = 12) {
  const adapted = items.map(adaptHeadlineForLegacy);
  const ranked = [];

  topics.forEach((topic) => {
    const refined = refineTopic(adapted, topic, "", null, maxPerTopic, []);
    refined.forEach((story) => {
      ranked.push({
        ...story,
        legacyTopic: topic,
        legacyScore: scoreStoryByTopic(story, topic, "", null, []),
      });
    });
  });

  const deduped = new Map();
  ranked.forEach((story) => {
    const key = `${story.link || story.url || ""}::${story.title || ""}`;
    const existing = deduped.get(key);
    if (!existing || story.legacyScore > existing.legacyScore) {
      deduped.set(key, story);
    }
  });

  return Array.from(deduped.values())
    .sort((a, b) => b.legacyScore - a.legacyScore)
    .slice(0, maxResults);
}

export { scoreStoryByTopic, refineTopic, getTopLegacyFilteredHeadlines };
