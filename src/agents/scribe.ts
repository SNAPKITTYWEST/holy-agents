import type { ScribeResult, Citation, Definition, Etymology, CrossLanguage, PlainEnglish, SourceType, IntentClassification, IntentType } from '../types.js';

interface CorpusEntry {
  text: string;
  location: string;
  source: SourceType;
  keywords: string[];
}

interface DictionaryEntry {
  term: string;
  definition: string;
  pos: string;
  synonyms: string[];
}

interface WikiEntry {
  title: string;
  summary: string;
  keywords: string[];
}

interface EtymologyEntry {
  term: string;
  root: string;
  origin: string;
  meaning: string;
  languages: string[];
}

interface TranslationEntry {
  term: string;
  translations: { lang: string; word: string; meaning: string }[];
}

const BIBLE_CORPUS: CorpusEntry[] = [
  { text: 'Blessed are the merciful, for they shall receive mercy.', location: 'Matthew 5:7', source: 'scripture', keywords: ['mercy','merciful','blessed'] },
  { text: 'You shall not bear false witness against your neighbor.', location: 'Exodus 20:16', source: 'scripture', keywords: ['false','witness','neighbor'] },
  { text: 'Love your neighbor as yourself.', location: 'Matthew 22:39', source: 'scripture', keywords: ['love','neighbor'] },
  { text: 'Do not exploit the poor because they are poor.', location: 'Proverbs 22:16', source: 'scripture', keywords: ['exploit','poor','poverty'] },
  { text: 'The truth will set you free.', location: 'John 8:32', source: 'scripture', keywords: ['truth','free'] },
  { text: 'Do unto others as you would have them do unto you.', location: 'Matthew 7:12', source: 'scripture', keywords: ['others','golden','rule'] },
  { text: 'Forgive us our debts, as we also have forgiven our debtors.', location: 'Matthew 6:12', source: 'scripture', keywords: ['forgive','debt','debts'] },
  { text: 'Let the one who has never sinned throw the first stone.', location: 'John 8:7', source: 'scripture', keywords: ['sin','stone','judgment'] },
  { text: 'Where there is no prophecy, the people cast off restraint.', location: 'Proverbs 29:18', source: 'scripture', keywords: ['prophecy','vision'] },
  { text: 'The Lord is my shepherd; I shall not want.', location: 'Psalm 23:1', source: 'scripture', keywords: ['shepherd','lord','want'] },
  { text: 'For where two or three gather in my name, there am I with them.', location: 'Matthew 18:20', source: 'scripture', keywords: ['gather','name','presence'] },
  { text: 'The fear of the Lord is the beginning of wisdom.', location: 'Proverbs 9:10', source: 'scripture', keywords: ['fear','lord','wisdom'] },
  { text: 'I will establish my covenant between me and you and your descendants after you.', location: 'Genesis 17:7', source: 'scripture', keywords: ['covenant','establish','descendants'] },
  { text: 'This is the blood of the covenant, which God has commanded you.', location: 'Exodus 24:8', source: 'scripture', keywords: ['covenant','blood'] },
];

const ENOCH_CORPUS: CorpusEntry[] = [
  { text: 'The angels who descended mingled with human women and produced the Nephilim.', location: '1 Enoch 6:1-2', source: 'enoch', keywords: ['angels','nephilim','women','descended'] },
  { text: 'God sent the flood to destroy the Nephilim and cleanse the earth.', location: '1 Enoch 10:1-3', source: 'enoch', keywords: ['flood','destroy','nephilim','cleanse'] },
  { text: 'The Watchers are bound in the valleys of the earth until the day of judgment.', location: '1 Enoch 10:4-6', source: 'enoch', keywords: ['watchers','bound','judgment','valleys'] },
  { text: 'Enoch saw the holy ones of heaven and the abode of the dead.', location: '1 Enoch 22:1-5', source: 'enoch', keywords: ['enoch','heaven','dead','abode'] },
  { text: 'The Son of Man was chosen before the world was created.', location: '1 Enoch 46:1-4', source: 'enoch', keywords: ['son of man','chosen','created','predestined'] },
  { text: 'The righteous will shine like the stars forever.', location: '1 Enoch 104:1-2', source: 'enoch', keywords: ['righteous','shine','stars','forever'] },
  { text: 'Enoch walked with God and was taken, for God took him.', location: '1 Enoch 12:1-2', source: 'enoch', keywords: ['enoch','walked','taken','god'] },
  { text: 'The books of the Watchers reveal the secrets of heaven and earth.', location: '1 Enoch 8:1-3', source: 'enoch', keywords: ['books','secrets','heaven','earth','watchers'] },
  { text: 'The elect one will dwell with the holy ones.', location: '1 Enoch 45:1-3', source: 'enoch', keywords: ['elect','dwell','holy','chosen'] },
  { text: 'Judgment is prepared for the kings and the mighty.', location: '1 Enoch 62:1-3', source: 'enoch', keywords: ['judgment','kings','mighty','prepared'] },
];

const APOCRYPHA_CORPUS: CorpusEntry[] = [
  { text: 'Wisdom is a breath of the power of God, a pure emanation of the Almighty.', location: 'Wisdom of Solomon 7:25', source: 'apocrypha', keywords: ['wisdom','power','god','almighty'] },
  { text: 'The souls of the righteous are in the hand of God, and no torment will touch them.', location: '2 Maccabees 12:43-46', source: 'apocrypha', keywords: ['souls','righteous','hand','torment'] },
  { text: 'Pray for the dead, that they may be loosed from sin.', location: '2 Maccabees 12:46', source: 'apocrypha', keywords: ['pray','dead','loosed','sin'] },
  { text: 'I wisdom dwell with prudence, and find out knowledge of witty inventions.', location: 'Sirach 1:4', source: 'apocrypha', keywords: ['wisdom','prudence','knowledge','inventions'] },
  { text: 'The Lord created medicine out of the earth, and the wise will not abhor it.', location: 'Sirach 38:4', source: 'apocrypha', keywords: ['lord','medicine','earth','wise'] },
  { text: 'Before man is life and death, and whichever he chooses will be given to him.', location: 'Sirach 15:17', source: 'apocrypha', keywords: ['life','death','choose','given'] },
  { text: 'Do not be proud, for pride is the beginning of sin.', location: 'Sirach 10:12-14', source: 'apocrypha', keywords: ['proud','pride','sin','beginning'] },
  { text: 'Set a guard over your mouth, and a seal of wisdom over your lips.', location: 'Sirach 22:27-33', source: 'apocrypha', keywords: ['guard','mouth','seal','wisdom','lips'] },
];

const THEOLOGY_CORPUS: CorpusEntry[] = [
  { text: 'A covenant is a binding agreement between God and humanity, sealed by oath and sacrifice.', location: 'Systematic Theology, Covenant Theology', source: 'theology', keywords: ['covenant','agreement','god','oath','sacrifice'] },
  { text: 'Sanctification is the process by which a believer is made holy through the work of the Holy Spirit.', location: 'Systematic Theology, Sanctification', source: 'theology', keywords: ['sanctification','holy','spirit','process'] },
  { text: 'Justification is the act of God by which He declares the sinner righteous through faith in Christ.', location: 'Systematic Theology, Justification', source: 'theology', keywords: ['justification','righteous','faith','christ','sinner'] },
  { text: 'Repentance is a turning from sin to God, involving contrition, confession, and amendment of life.', location: 'Systematic Theology, Repentance', source: 'theology', keywords: ['repentance','turning','sin','contrition','confession'] },
  { text: 'The Trinity is the doctrine that God exists as three co-equal persons: Father, Son, and Holy Spirit.', location: 'Systematic Theology, Trinity', source: 'theology', keywords: ['trinity','three','persons','father','son','spirit'] },
  { text: 'Eschatology studies the final events of history, including resurrection, judgment, and the new creation.', location: 'Systematic Theology, Eschatology', source: 'theology', keywords: ['eschatology','final','resurrection','judgment','creation'] },
  { text: 'Hamartiology is the study of sin, its origin, nature, and effects on humanity.', location: 'Systematic Theology, Hamartiology', source: 'theology', keywords: ['hamartiology','sin','origin','nature'] },
  { text: 'Christology is the study of the person and work of Jesus Christ, fully God and fully man.', location: 'Systematic Theology, Christology', source: 'theology', keywords: ['christology','jesus','christ','god','man'] },
  { text: 'Pneumatology is the study of the Holy Spirit, His person, works, and gifts.', location: 'Systematic Theology, Pneumatology', source: 'theology', keywords: ['pneumatology','holy spirit','gifts','works'] },
  { text: 'Ecclesiology studies the nature, structure, and mission of the Christian church.', location: 'Systematic Theology, Ecclesiology', source: 'theology', keywords: ['ecclesiology','church','mission','structure'] },
];

const DICTIONARY_CORPUS: DictionaryEntry[] = [
  { term: 'covenant', definition: 'A solemn agreement or promise between parties, often sealed with an oath.', pos: 'noun', synonyms: ['agreement','pact','treaty','bond'] },
  { term: 'mercy', definition: 'Compassion or forgiveness shown toward someone whom it is within one\'s power to punish.', pos: 'noun', synonyms: ['compassion','forgiveness','pity','grace'] },
  { term: 'truth', definition: 'The quality or state of being true; that which is in accordance with fact or reality.', pos: 'noun', synonyms: ['fact','reality','accuracy','verity'] },
  { term: 'justice', definition: 'Just behavior or treatment; the quality of being fair and reasonable.', pos: 'noun', synonyms: ['fairness','equity','righteousness'] },
  { term: 'grace', definition: 'The free and unmerited favor of God, as manifested in the salvation of sinners.', pos: 'noun', synonyms: ['favor','blessing','mercy'] },
  { term: 'sin', definition: 'An immoral act considered to be a transgression against divine law.', pos: 'noun', synonyms: ['transgression','iniquity','wrongdoing'] },
  { term: 'repent', definition: 'To feel or express sincere regret or remorse over one\'s wrongdoing; to turn from sin.', pos: 'verb', synonyms: ['regret','atone','reform'] },
  { term: 'prophecy', definition: 'A prediction of what will happen in the future; a message from God through a prophet.', pos: 'noun', synonyms: ['prediction','oracle','vision'] },
  { term: 'righteous', definition: 'Morally right or justifiable; acting in accord with divine or moral law.', pos: 'adjective', synonyms: ['virtuous','holy','just','moral'] },
  { term: 'witness', definition: 'A person who sees an event take place; one who testifies to what they have seen or known.', pos: 'noun', synonyms: ['observer','testifier','bystander'] },
  { term: 'salvation', definition: 'Preservation or deliverance from harm, ruin, or loss; in theology, deliverance from sin.', pos: 'noun', synonyms: ['deliverance','redemption','rescue'] },
  { term: 'faith', definition: 'Complete trust or confidence in God; belief in the doctrines of religion.', pos: 'noun', synonyms: ['belief','trust','conviction'] },
  { term: 'enoch', definition: 'A patriarch in Genesis who walked with God and was taken to heaven without dying.', pos: 'noun', synonyms: ['patriarch','prophet'] },
  { term: 'apocrypha', definition: 'Biblical or related writings not forming part of the accepted canon of Scripture.', pos: 'noun', synonyms: ['deuterocanonical','hidden writings'] },
  { term: 'nephilim', definition: 'In Genesis, the offspring of the sons of God and the daughters of men; giants.', pos: 'noun', synonyms: ['giants','fallen ones'] },
  { term: 'watchers', definition: 'In Enoch, angels who descended to earth and mingled with humanity.', pos: 'noun', synonyms: ['angels','sentinels'] },
];

const WIKIPEDIA_CORPUS: WikiEntry[] = [
  { title: 'Covenant (biblical)', summary: 'A covenant in the Bible is a binding agreement or promise between God and humanity.', keywords: ['covenant','agreement','promise','bible'] },
  { title: 'Book of Enoch', summary: 'The Book of Enoch is an ancient Hebrew apocalyptic religious text, traditionally ascribed to Enoch. It is not part of the biblical canon used by most Jews and Christians.', keywords: ['enoch','book','apocalyptic','angel','watcher'] },
  { title: '1 Enoch', summary: '1 Enoch is the earliest and most complete version of the Ethiopic Enoch corpus.', keywords: ['enoch','1 enoch','ethiopic'] },
  { title: 'Nephilim', summary: 'The Nephilim are mysterious beings mentioned in the Book of Genesis and the Book of Enoch.', keywords: ['nephilim','genesis','giants','fallen'] },
  { title: 'Mercy', summary: 'Mercy is compassion or forgiveness shown toward someone.', keywords: ['mercy','compassion','forgiveness'] },
  { title: 'Truth', summary: 'Truth is the property of being in accord with fact or reality.', keywords: ['truth','fact','reality'] },
  { title: 'Justice', summary: 'Justice is the concept of moral rightness.', keywords: ['justice','moral','rightness'] },
  { title: 'Repentance', summary: 'Repentance is the action of regretting one\'s past conduct and resolving to change.', keywords: ['repent','repentance','regret','sin'] },
  { title: 'Covenant (theology)', summary: 'In theology, a covenant is a divine agreement between God and humanity.', keywords: ['covenant','theology','divine','agreement'] },
  { title: 'Apocrypha', summary: 'The Apocrypha are biblical or related writings not forming part of the accepted canon of Scripture.', keywords: ['apocrypha','canon','deuterocanonical'] },
  { title: 'Book of Wisdom', summary: 'The Book of Wisdom is a deuterocanonical work of the Old Testament.', keywords: ['wisdom','book','deuterocanonical','solomon'] },
  { title: 'Sirach', summary: 'Sirach is a book of wisdom literature in the Septuagint and Catholic canon.', keywords: ['sirach','wisdom','ecclesiasticus'] },
];

const RTRUST_CORPUS: CorpusEntry[] = [
  { text: 'RTRUST-001: Do not bear false witness. Principle: truthfulness.', location: 'RTRUST.md:10-18', source: 'rtrust', keywords: ['rtrust','false','witness','truthfulness'] },
  { text: 'RTRUST-002: Do not exploit the poor. Principle: justice.', location: 'RTRUST.md:20-28', source: 'rtrust', keywords: ['rtrust','exploit','poor','justice'] },
  { text: 'RTRUST-003: Do not harm your neighbor. Principle: love.', location: 'RTRUST.md:30-38', source: 'rtrust', keywords: ['rtrust','harm','neighbor','love'] },
  { text: 'RTRUST-004: Act only with consent. Principle: autonomy.', location: 'RTRUST.md:40-48', source: 'rtrust', keywords: ['rtrust','consent','autonomy','act'] },
  { text: 'RTRUST-005: All actions must be witnessed. Principle: accountability.', location: 'RTRUST.md:50-58', source: 'rtrust', keywords: ['rtrust','witnessed','accountability'] },
  { text: 'RTRUST-006: Seek mercy before judgment. Principle: mercy.', location: 'RTRUST.md:60-68', source: 'rtrust', keywords: ['rtrust','mercy','judgment'] },
  { text: 'RTRUST-007: Cite your sources. Principle: attribution.', location: 'RTRUST.md:70-78', source: 'rtrust', keywords: ['rtrust','cite','sources','attribution'] },
];

const ETYMOLOGY_CORPUS: EtymologyEntry[] = [
  { term: 'covenant', root: 'con + venire', origin: 'Latin convenire, Old French covenant', meaning: 'to come together, to agree', languages: ['Latin','Old French','English'] },
  { term: 'mercy', root: 'merces', origin: 'Latin merces, Old French merci', meaning: 'reward, pity, compassion', languages: ['Latin','Old French','English'] },
  { term: 'truth', root: 'triuwath', origin: 'Old English triewð, Proto-Germanic trewwidō', meaning: 'faithfulness, loyalty', languages: ['Old English','Proto-Germanic','English'] },
  { term: 'justice', root: 'iustitia', origin: 'Latin iustitia, Old French justice', meaning: 'righteousness, fairness', languages: ['Latin','Old French','English'] },
  { term: 'grace', root: 'gratia', origin: 'Latin gratia, Old French grace', meaning: 'favor, charm, thankfulness', languages: ['Latin','Old French','English'] },
  { term: 'sin', root: 'syn', origin: 'Old English syn, Proto-Germanic sunjō', meaning: 'guilt, offense', languages: ['Old English','Proto-Germanic','English'] },
  { term: 'repent', root: 'paenitere', origin: 'Latin paenitēre, Old French repentir', meaning: 'to feel regret, to change one\'s mind', languages: ['Latin','Old French','English'] },
  { term: 'prophecy', root: 'pro + phēmi', origin: 'Greek prophēteia, from prophetes', meaning: 'to speak forth, to declare', languages: ['Greek','English'] },
  { term: 'righteous', root: 'rihtwīs', origin: 'Old English rihtwīs, from riht + wīs', meaning: 'right-wise, morally correct', languages: ['Old English','English'] },
  { term: 'witness', root: 'witnes', origin: 'Old English witnes, from witan', meaning: 'knowledge, testimony', languages: ['Old English','English'] },
  { term: 'salvation', root: 'salvatio', origin: 'Latin salvātiōnem, Old French salvacion', meaning: 'deliverance, preservation', languages: ['Latin','Old French','English'] },
  { term: 'faith', root: 'fides', origin: 'Latin fidēs, Old French feid', meaning: 'trust, belief, confidence', languages: ['Latin','Old French','English'] },
  { term: 'enoch', root: 'ḥănōḵ', origin: 'Hebrew חָנוֹך (Ḥănōḵ)', meaning: 'dedicated, initiated', languages: ['Hebrew','English'] },
  { term: 'nephilim', root: 'nāp̄al', origin: 'Hebrew נְפִילִים (Nəp̄îlîm)', meaning: 'fallen ones, giants', languages: ['Hebrew','English'] },
  { term: 'watchers', root: 'ʿîr', origin: 'Hebrew עִיר (ʿîr), Aramaic עֶירָן (ʿîrān)', meaning: 'awake ones, sentinels', languages: ['Hebrew','Aramaic','English'] },
  { term: 'apocrypha', root: 'apokryphos', origin: 'Greek ἀπόκρυφος', meaning: 'hidden away, concealed', languages: ['Greek','English'] },
];

const TRANSLATION_CORPUS: TranslationEntry[] = [
  { term: 'covenant', translations: [
    { lang: 'Hebrew', word: 'בְּרִית', meaning: 'berith — bond, agreement' },
    { lang: 'Greek', word: 'διαθήκη', meaning: 'diathēkē — testament, arrangement' },
    { lang: 'Latin', word: 'foedus', meaning: 'pact, league' },
    { lang: 'Arabic', word: 'عَهْد', meaning: 'ʿahd — pact, oath' },
  ]},
  { term: 'mercy', translations: [
    { lang: 'Hebrew', word: 'חֶסֶד', meaning: 'ḥesed — lovingkindness, steadfast love' },
    { lang: 'Greek', word: 'ἔλεος', meaning: 'eleos — compassion, pity' },
    { lang: 'Latin', word: 'misericordia', meaning: 'compassion, pity' },
    { lang: 'Arabic', word: 'رَحْمَة', meaning: 'raḥma — compassion, mercy' },
  ]},
  { term: 'truth', translations: [
    { lang: 'Hebrew', word: 'אֱמֶת', meaning: 'emeth — faithfulness, firmness' },
    { lang: 'Greek', word: 'ἀλήθεια', meaning: 'alētheia — unconcealedness, reality' },
    { lang: 'Latin', word: 'veritas', meaning: 'truth, honesty' },
    { lang: 'Arabic', word: 'حَقّ', meaning: 'ḥaqq — truth, right, reality' },
  ]},
  { term: 'justice', translations: [
    { lang: 'Hebrew', word: 'צֶדֶק', meaning: 'tsedeq — righteousness' },
    { lang: 'Greek', word: 'δικαιοσύνη', meaning: 'dikaiosynē — justice, righteousness' },
    { lang: 'Latin', word: 'iustitia', meaning: 'justice, equity' },
    { lang: 'Arabic', word: 'عَدْل', meaning: 'ʿadl — justice, equity' },
  ]},
  { term: 'grace', translations: [
    { lang: 'Hebrew', word: 'חֵן', meaning: 'ḥēn — favor, charm' },
    { lang: 'Greek', word: 'χάρις', meaning: 'charis — gift, grace, favor' },
    { lang: 'Latin', word: 'gratia', meaning: 'favor, thankfulness' },
    { lang: 'Arabic', word: 'نِعْمَة', meaning: 'niʿma — blessing, grace' },
  ]},
  { term: 'sin', translations: [
    { lang: 'Hebrew', word: 'חֵטְא', meaning: 'ḥēṭ — to miss the mark' },
    { lang: 'Greek', word: 'ἁμαρτία', meaning: 'hamartia — to miss the mark, offense' },
    { lang: 'Latin', word: 'peccatum', meaning: 'sin, transgression' },
    { lang: 'Arabic', word: 'خَطِيئة', meaning: 'khaṭīʾa — sin, mistake' },
  ]},
  { term: 'repent', translations: [
    { lang: 'Hebrew', word: 'שׁוּב', meaning: 'shûv — to turn back, return' },
    { lang: 'Greek', word: 'μετανοέω', meaning: 'metanoeō — to change mind, reconsider' },
    { lang: 'Latin', word: 'paenitēre', meaning: 'to feel regret' },
    { lang: 'Arabic', word: 'تَوَبَ', meaning: 'tāba — to repent, turn back' },
  ]},
  { term: 'faith', translations: [
    { lang: 'Hebrew', word: 'אֱמוּנָה', meaning: 'emunah — faithfulness, trust' },
    { lang: 'Greek', word: 'πίστις', meaning: 'pistis — trust, faith, belief' },
    { lang: 'Latin', word: 'fides', meaning: 'trust, confidence' },
    { lang: 'Arabic', word: 'إِيمَان', meaning: 'īmān — faith, belief' },
  ]},
  { term: 'salvation', translations: [
    { lang: 'Hebrew', word: 'יְשׁוּעָה', meaning: 'yeshûʿāh — deliverance, rescue' },
    { lang: 'Greek', word: 'σωτηρία', meaning: 'sōtēria — deliverance, preservation' },
    { lang: 'Latin', word: 'salus', meaning: 'safety, health, salvation' },
    { lang: 'Arabic', word: 'خَلَاص', meaning: 'ḵalāṣ — salvation, deliverance' },
  ]},
];

function classifyIntent(query: string): IntentClassification {
  const lower = query.toLowerCase();
  const terms = lower.split(/\s+/);

  if (/^(what is|define|definition of|meaning of|means|etymology of|root of|origin of)\b/.test(lower) && terms.length <= 6) {
    return { intent: 'definition', corpora: ['dictionary', 'scripture', 'wikipedia'], queryTerms: terms };
  }
  if (/compare|versus|vs\.?|difference between|how do/.test(lower)) {
    return { intent: 'comparison', corpora: ['scripture', 'enoch', 'apocrypha', 'theology', 'wikipedia'], queryTerms: terms };
  }
  if (/book of enoch|1 enoch|enoch|watcher|nephilim|fallen angel/.test(lower)) {
    return { intent: 'theology_search', corpora: ['enoch', 'theology', 'wikipedia', 'dictionary'], queryTerms: terms };
  }
  if (/apocrypha|wisdom of solomon|sirach|maccabees|deuterocanon/.test(lower)) {
    return { intent: 'theology_search', corpora: ['apocrypha', 'theology', 'wikipedia', 'dictionary'], queryTerms: terms };
  }
  if (/rtrust|rule|constitution|forbidden|axiom/.test(lower)) {
    return { intent: 'rtrust_query', corpora: ['rtrust', 'theology'], queryTerms: terms };
  }
  if (/repent|repentance|sin|salvation|faith|grace|justif|sanctif|trinity|eschatolog/.test(lower)) {
    return { intent: 'theology_search', corpora: ['theology', 'scripture', 'dictionary', 'wikipedia'], queryTerms: terms };
  }
  return { intent: 'scripture_search', corpora: ['scripture', 'enoch', 'apocrypha', 'theology', 'wikipedia', 'dictionary'], queryTerms: terms };
}

function searchCorpus(keywords: string[], corpus: CorpusEntry[]): Citation[] {
  const hits: Citation[] = [];
  for (const entry of corpus) {
    const matchCount = entry.keywords.filter(k => keywords.some(kw => k.includes(kw) || kw.includes(k))).length;
    if (matchCount > 0) hits.push({ source: entry.source, text: entry.text, location: entry.location });
  }
  return hits;
}

function searchWiki(keywords: string[]): Citation[] {
  return WIKIPEDIA_CORPUS.filter(a => a.keywords.some(k => keywords.includes(k)))
    .map(a => ({ source: 'wikipedia' as SourceType, text: a.summary, location: a.title }));
}

function searchDict(query: string): Definition[] {
  const q = query.toLowerCase();
  return DICTIONARY_CORPUS.filter(d => q.includes(d.term) || d.term.includes(q) || d.synonyms.some(s => q.includes(s)))
    .map(d => ({ term: d.term, definition: d.definition, part_of_speech: d.pos }));
}

function searchEtymology(query: string): Etymology[] {
  const q = query.toLowerCase();
  return ETYMOLOGY_CORPUS.filter(e => q.includes(e.term) || e.term.includes(q))
    .map(e => ({ term: e.term, root: e.root, origin: e.origin, meaning: e.meaning, languages: e.languages }));
}

function searchTranslations(query: string): CrossLanguage[] {
  const q = query.toLowerCase();
  return TRANSLATION_CORPUS.filter(t => q.includes(t.term) || t.term.includes(q))
    .map(t => ({ term: t.term, translations: t.translations }));
}

function rankAndDedupe(citations: Citation[]): Citation[] {
  const seen = new Set<string>();
  return citations.filter(c => {
    const key = `${c.source}:${c.location}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function truthGate(query: string, citations: Citation[], definitions: Definition[]): boolean {
  const q = query.toLowerCase().trim();
  const gibberish = /^[a-z]{20,}$/.test(q.replace(/\s+/g, ''));
  const empty = q.length === 0;
  const noCitationsAndNoDefinitions = citations.length === 0 && definitions.length === 0;
  return !gibberish && !empty && !noCitationsAndNoDefinitions;
}

function buildPlainEnglish(query: string, definitions: Definition[], citations: Citation[], etymologies: Etymology[], translations: CrossLanguage[]): PlainEnglish {
  const q = query.toLowerCase();
  const parts: string[] = [];
  const sources: string[] = [];

  const def = definitions[0];
  if (def) {
    parts.push(`${def.term} (${def.part_of_speech}): ${def.definition}`);
    sources.push('dictionary');
  }

  const etym = etymologies[0];
  if (etym) {
    parts.push(`Root: ${etym.root} from ${etym.origin} — "${etym.meaning}"`);
    sources.push('etymology');
  }

  const trans = translations[0];
  if (trans) {
    const langList = trans.translations.map(t => `${t.lang}: ${t.word}`).join(', ');
    parts.push(`Cross-language: ${langList}`);
    sources.push('translation');
  }

  const scriptCites = citations.filter(c => c.source === 'scripture');
  if (scriptCites.length > 0) {
    parts.push(`Scripture: ${scriptCites[0].text} (${scriptCites[0].location})`);
    sources.push('scripture');
  }

  const otherCites = citations.filter(c => c.source !== 'scripture');
  if (otherCites.length > 0) {
    parts.push(`Source: ${otherCites[0].text} (${otherCites[0].location})`);
    sources.push(otherCites[0].source);
  }

  return {
    answer: parts.length > 0 ? parts.join(' — ') : `No data found for "${query}".`,
    sources
  };
}

export async function scribeQuery(query: string): Promise<ScribeResult> {
  const classification = classifyIntent(query);
  const keywords = classification.queryTerms;
  let allCitations: Citation[] = [];
  const allDefinitions: Definition[] = [];

  for (const corpus of classification.corpora) {
    switch (corpus) {
      case 'scripture': allCitations.push(...searchCorpus(keywords, BIBLE_CORPUS)); break;
      case 'enoch': allCitations.push(...searchCorpus(keywords, ENOCH_CORPUS)); break;
      case 'apocrypha': allCitations.push(...searchCorpus(keywords, APOCRYPHA_CORPUS)); break;
      case 'theology': allCitations.push(...searchCorpus(keywords, THEOLOGY_CORPUS)); break;
      case 'rtrust': allCitations.push(...searchCorpus(keywords, RTRUST_CORPUS)); break;
      case 'wikipedia': allCitations.push(...searchWiki(keywords)); break;
      case 'dictionary': allDefinitions.push(...searchDict(query)); break;
    }
  }

  allCitations = rankAndDedupe(allCitations);

  const etymologies = searchEtymology(query);
  const translations = searchTranslations(query);
  const passed = truthGate(query, allCitations, allDefinitions);
  const plainEnglish = buildPlainEnglish(query, allDefinitions, allCitations, etymologies, translations);

  const confidence = allCitations.length > 0
    ? Math.min(0.4 + allCitations.length * 0.12, 0.95)
    : allDefinitions.length > 0
      ? 0.6
      : 0.15;

  const corpusNames = classification.corpora.join(', ');
  const summary = allCitations.length > 0
    ? `Found ${allCitations.length} citation(s) across [${corpusNames}] for "${query}".`
    : `No citations found across [${corpusNames}] for "${query}".`;

  return {
    citations: allCitations,
    definitions: allDefinitions,
    etymologies,
    translations,
    plainEnglish,
    truthGate: passed,
    summary,
    confidence
  };
}

export async function querySource(query: string, sourceType?: SourceType): Promise<ScribeResult> {
  return scribeQuery(query);
}

export { classifyIntent };
