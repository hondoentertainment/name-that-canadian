const QUESTIONS_PER_ROUND = 5;
const FINAL_ROUND_NUM = 3;
const TIMER_OPTIONS = [30, 40, 60];

const WIKI_IMAGE_OVERRIDES = {
  'The Maple Leaf': 'Flag of Canada',
  'The Beaver': 'North American beaver',
  'Caesar (cocktail)': 'Caesar (cocktail)',
  "Hudson's Bay Point Blanket": 'Hudson\'s Bay point blanket',
  'Loonie': 'Canadian loonie',
  'Poutine': 'Poutine',
  'Tim Hortons': 'Tim Hortons',
  'RCMP': 'Royal Canadian Mounted Police',
  '2010 Vancouver Olympics': '2010 Winter Olympics',
  'CANADARM': 'Canadarm',
  'Canadarm2': 'Canadarm2',
  'BlackBerry': 'BlackBerry Limited',
  'DeepMind Toronto': 'DeepMind'
};

const ROUND_OVERLAY_COPY = {
  round1_end: { title: '🍁 Round 1 Complete!', subtitle: 'Great job — Round 2 starts next.' },
  round2_start: { title: 'Round 2', subtitle: 'The stakes are rising!' },
  round2_end: { title: 'Round 2 Complete!', subtitle: 'One final question remains…' },
  final_intro: { title: '🏆 Final Round', subtitle: 'The Showstopper — double points!' }
};

const KEYBOARD_SHORTCUTS = [
  { key: 'Space', action: 'Start / pause timer' },
  { key: 'N', action: 'Next hint' },
  { key: 'R', action: 'Reveal answer' },
  { key: '← / →', action: 'Previous / next question' },
  { key: '1–4', action: 'Soundboard (correct, wrong, hint, fanfare)' }
];
