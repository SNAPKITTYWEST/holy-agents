#!/usr/bin/env node

const WIKIPEDIA = [
  { title: 'Covenant (biblical)', summary: 'A covenant is a binding agreement or promise between parties.', keywords: ['covenant', 'agreement', 'promise'] },
  { title: 'Mercy', summary: 'Mercy is compassion or forgiveness shown toward someone.', keywords: ['mercy', 'compassion', 'forgiveness'] },
  { title: 'Truth', summary: 'Truth is the property of being in accord with fact or reality.', keywords: ['truth', 'fact', 'reality'] },
  { title: 'Justice', summary: 'Justice is the concept of moral rightness.', keywords: ['justice', 'moral', 'rightness'] },
  { title: 'Ethics', summary: 'Ethics is a branch of philosophy involving right conduct.', keywords: ['ethics', 'philosophy', 'conduct'] },
  { title: 'Repentance', summary: 'Repentance is the action of regretting past conduct.', keywords: ['repent', 'regret', 'sin'] },
  { title: 'Grace (theology)', summary: 'Grace is the unmerited favor of God toward humanity.', keywords: ['grace', 'favor', 'unmerited'] },
];

const query = process.argv.slice(2).join(' ').toLowerCase();
if (!query) {
  console.log(JSON.stringify({ error: 'usage: grep_wikipedia.js <query>' }));
  process.exit(1);
}

const keywords = query.split(/\s+/);
const results = WIKIPEDIA.filter(article => article.keywords.some(k => keywords.includes(k)));

if (results.length === 0) {
  console.log(JSON.stringify({ source: 'wikipedia', query, summary: null, confidence: 0.0, message: 'no articles found' }));
} else {
  const output = results.map(r => ({
    source: 'wikipedia',
    title: r.title,
    summary: r.summary,
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(r.title)}`,
    confidence: 0.82
  }));
  console.log(JSON.stringify(output.length === 1 ? output[0] : output));
}
