import type { ScribeResult, Citation, Definition, SourceType } from '../types.js';

export async function searchScripture(query: string): Promise<ScribeResult> {
  const citations: Citation[] = [];
  const definitions: Definition[] = [];
  const keywords = query.toLowerCase().split(/\s+/);

  const scriptureCorpus: { text: string; location: string; keywords: string[] }[] = [
    { text: 'Blessed are the merciful, for they shall receive mercy.', location: 'Matthew 5:7', keywords: ['mercy', 'merciful', 'blessed'] },
    { text: 'You shall not bear false witness against your neighbor.', location: 'Exodus 20:16', keywords: ['false', 'witness', 'neighbor'] },
    { text: 'Love your neighbor as yourself.', location: 'Matthew 22:39', keywords: ['love', 'neighbor'] },
    { text: 'Do not exploit the poor because they are poor.', location: 'Proverbs 22:16', keywords: ['exploit', 'poor', 'poverty'] },
    { text: 'The truth will set you free.', location: 'John 8:32', keywords: ['truth', 'free'] },
    { text: 'Do unto others as you would have them do unto you.', location: 'Matthew 7:12', keywords: ['others', 'golden', 'rule'] },
    { text: 'Forgive us our debts, as we also have forgiven our debtors.', location: 'Matthew 6:12', keywords: ['forgive', 'debt', 'debts'] },
    { text: 'Let the one who has never sinned throw the first stone.', location: 'John 8:7', keywords: ['sin', 'stone', 'judgment'] },
    { text: 'Where there is no prophecy, the people cast off restraint.', location: 'Proverbs 29:18', keywords: ['prophecy', 'vision'] },
    { text: 'The Lord is my shepherd; I shall not want.', location: 'Psalm 23:1', keywords: ['shepherd', 'lord', 'want'] },
  ];

  for (const entry of scriptureCorpus) {
    const matchCount = entry.keywords.filter(k => keywords.some(kw => k.includes(kw) || kw.includes(k))).length;
    if (matchCount > 0) {
      citations.push({ source: 'scripture', text: entry.text, location: entry.location });
    }
  }

  if (query.toLowerCase().includes('covenant')) {
    definitions.push({ term: 'covenant', definition: 'A solemn agreement or promise between parties, often sealed with an oath.', part_of_speech: 'noun' });
  }
  if (query.toLowerCase().includes('mercy')) {
    definitions.push({ term: 'mercy', definition: 'Compassion or forgiveness shown toward someone whom it is within one\'s power to punish.', part_of_speech: 'noun' });
  }
  if (query.toLowerCase().includes('truth')) {
    definitions.push({ term: 'truth', definition: 'The quality or state of being true; that which is true or in accordance with fact.', part_of_speech: 'noun' });
  }

  const confidence = citations.length > 0 ? Math.min(0.5 + citations.length * 0.1, 0.95) : 0.3;
  const summary = citations.length > 0
    ? `Found ${citations.length} relevant passage(s) for "${query}".`
    : `No direct passages found for "${query}".`;

  return { citations, definitions, summary, confidence };
}

export async function searchDictionary(term: string): Promise<ScribeResult> {
  const definitions: Definition[] = [];
  const dictionary: Record<string, { definition: string; pos: string }> = {
    covenant: { definition: 'A solemn agreement or promise between parties.', pos: 'noun' },
    mercy: { definition: 'Compassion or forgiveness shown toward someone.', pos: 'noun' },
    truth: { definition: 'The quality or state of being true.', pos: 'noun' },
    justice: { definition: 'Just behavior or treatment.', pos: 'noun' },
    harmless: { definition: 'Not able or likely to cause harm.', pos: 'adjective' },
    exploit: { definition: 'Make full use of a resource; use selfishly for profit.', pos: 'verb' },
    witness: { definition: 'A person who sees an event take place.', pos: 'noun' },
    seal: { definition: 'A device or substance that is used to join two things together so as to prevent them from coming apart.', pos: 'noun' },
  };
  const key = term.toLowerCase();
  if (dictionary[key]) {
    definitions.push({ term: key, definition: dictionary[key].definition, part_of_speech: dictionary[key].pos });
  }
  const confidence = definitions.length > 0 ? 0.91 : 0.2;
  return { citations: [], definitions, summary: `Dictionary lookup for "${term}".`, confidence };
}

export async function searchWikipedia(query: string): Promise<ScribeResult> {
  const citations: Citation[] = [];
  const keywords = query.toLowerCase().split(/\s+/);
  const articles: { title: string; summary: string; keywords: string[] }[] = [
    { title: 'Covenant (biblical)', summary: 'A covenant is a binding agreement or promise.', keywords: ['covenant', 'agreement', 'promise'] },
    { title: 'Mercy', summary: 'Mercy is compassion or forgiveness shown toward someone.', keywords: ['mercy', 'compassion', 'forgiveness'] },
    { title: 'Truth', summary: 'Truth is the property of being in accord with fact or reality.', keywords: ['truth', 'fact', 'reality'] },
    { title: 'Justice', summary: 'Justice is the concept of moral rightness.', keywords: ['justice', 'moral', 'rightness'] },
    { title: 'Ethics', summary: 'Ethics is a branch of philosophy that involves systematizing, defending, and recommending concepts of right conduct.', keywords: ['ethics', 'philosophy', 'conduct'] },
  ];
  for (const article of articles) {
    if (article.keywords.some(k => keywords.includes(k))) {
      citations.push({ source: 'wikipedia', text: article.summary, location: article.title });
    }
  }
  const confidence = citations.length > 0 ? 0.82 : 0.2;
  return { citations, definitions: [], summary: `Wikipedia search for "${query}".`, confidence };
}

export async function querySource(query: string, sourceType: SourceType): Promise<ScribeResult> {
  switch (sourceType) {
    case 'scripture': return searchScripture(query);
    case 'dictionary': return searchDictionary(query);
    case 'wikipedia': return searchWikipedia(query);
    default: return searchScripture(query);
  }
}
