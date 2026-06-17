#!/usr/bin/env node

const DICTIONARY = {
  covenant: { definition: 'A solemn agreement or promise between parties.', pos: 'noun' },
  mercy: { definition: 'Compassion or forgiveness shown toward someone.', pos: 'noun' },
  truth: { definition: 'The quality or state of being true.', pos: 'noun' },
  justice: { definition: 'Just behavior or treatment.', pos: 'noun' },
  grace: { definition: 'Simple elegance or courteous goodwill.', pos: 'noun' },
  sin: { definition: 'An immoral act considered to be a transgression against divine law.', pos: 'noun' },
  repent: { definition: 'To feel or express sincere regret or remorse.', pos: 'verb' },
  prophecy: { definition: 'A prediction of what will happen in the future.', pos: 'noun' },
  seal: { definition: 'A device used to join two things together.', pos: 'noun' },
  witness: { definition: 'A person who sees an event take place.', pos: 'noun' },
};

const query = process.argv.slice(2).join(' ').toLowerCase();
if (!query) {
  console.log(JSON.stringify({ error: 'usage: grep_dictionary.js <term>' }));
  process.exit(1);
}

const results = [];
for (const [term, data] of Object.entries(DICTIONARY)) {
  if (term.includes(query) || query.includes(term)) {
    results.push({ source: 'dictionary', term, definition: data.definition, part_of_speech: data.pos, confidence: 0.91 });
  }
}

if (results.length === 0) {
  console.log(JSON.stringify({ source: 'dictionary', term: query, definition: null, confidence: 0.0, message: 'term not found' }));
} else {
  console.log(JSON.stringify(results.length === 1 ? results[0] : results));
}
