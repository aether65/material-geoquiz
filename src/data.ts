// ============================================================
// GeoQuiz - Dados: Questões, Traduções, Ícones, Cores
// ============================================================

// ---- TIPOS ----
export interface Question {
  id: string;
  topic: 'tales' | 'metrics';
  difficulty: 'easy' | 'medium' | 'hard';
  statement: string;
  figureDesc: string;
  figureParams: Record<string, any>;
  options: string[];
  correctIndex: number;
  explanation: {
    mainIdea: string;
    formula: string;
    formulaSpoken: string;
    steps: string[];
    verification: string;
    whyWrong: string[];
    tip: string;
  };
  glossaryTerms?: string[];
}

export interface PlayerConfig {
  name: string;
  colorIndex: number;
  shapeIndex: number;
  keys: string[];
}

export interface GameState {
  screen: 'home' | 'game' | 'explanation' | 'final' | 'analysis';
  players: PlayerConfig[];
  questions: Question[];
  currentQuestion: number;
  scores: number[];
  answers: (number | null)[][];
  answerTimes: (number | null)[][];
  lockedPlayers: boolean[];
  questionStartTime: number;
  timePerQuestion: number; // seconds, 0 = no limit
  gameMode: 'classic' | 'ai';
  lang: string;
  settings: AppSettings;
}

export interface AppSettings {
  timePerQuestion: number;
  showElapsedTime: boolean;
  theme: 'auto' | 'light' | 'dark';
  seedColor: string;
  contrast: 'default' | 'medium' | 'high';
  motionScheme: 'expressive' | 'standard';
  decorativeShapes: boolean;
  animationsEnabled: boolean;
  lang: string;
  fontSize: number;
  letterSpacing: number;
  wordSpacing: number;
  lineHeight: number;
  paragraphSpacing: number;
  maxLineWidth: number;
  textAlign: 'left' | 'justify';
  bgColor: string;
  readingRuler: boolean;
  focusMode: boolean;
  fontFamily: string;
  soundEnabled: boolean;
  soundVolume: number;
  autoRead: boolean;
  largeTouchTargets: boolean;
  confirmBeforeSubmit: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  aiEnabled: boolean;
  aiApiKey: string;
  aiModel: string;
  easyLanguage: boolean;
  formulaSheet: boolean;
  hintsEnabled: boolean;
  accessibilityProfile: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  timePerQuestion: 180,
  showElapsedTime: false,
  theme: 'auto',
  seedColor: '#6750A4',
  contrast: 'default',
  motionScheme: 'expressive',
  decorativeShapes: true,
  animationsEnabled: true,
  lang: 'pt',
  fontSize: 100,
  letterSpacing: 0,
  wordSpacing: 0,
  lineHeight: 1.5,
  paragraphSpacing: 1,
  maxLineWidth: 65,
  textAlign: 'left',
  bgColor: 'white',
  readingRuler: false,
  focusMode: false,
  fontFamily: 'system',
  soundEnabled: false,
  soundVolume: 0.5,
  autoRead: false,
  largeTouchTargets: false,
  confirmBeforeSubmit: false,
  colorBlindMode: 'none',
  aiEnabled: false,
  aiApiKey: '',
  aiModel: 'gemini-flash-latest',
  easyLanguage: false,
  formulaSheet: false,
  hintsEnabled: false,
  accessibilityProfile: 'custom',
};

// ---- CORES DO JOGADOR ----
export const PLAYER_COLORS = [
  { light: '#6750A4', dark: '#D0BCFF', name: 'Violeta' },
  { light: '#006A6A', dark: '#4DD0E1', name: 'Turquesa' },
  { light: '#B3261E', dark: '#F2B8B5', name: 'Vermelho' },
  { light: '#386A20', dark: '#A8D5A2', name: 'Verde' },
];

export const PLAYER_KEYS = [
  ['1', '2', '3', '4', '5'],
  ['q', 'w', 'e', 'r', 't'],
  ['a', 's', 'd', 'f', 'g'],
  ['z', 'x', 'c', 'v', 'b'],
];

export const PLAYER_SHAPES = ['circle', 'roundedSquare', 'blob', 'flower'] as const;

// ---- ÍCONES SVG ----
export const ICONS: Record<string, string> = {
  gear: 'M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65z',
  accessibility: 'M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z',
  play: 'M8 5.14v14l11-7-11-7z',
  restart: 'M17.65 6.35A7.96 7.96 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z',
  timer: 'M15.07 1.01L9 1v3H3v2h2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5h2V3h-5.93zM13 19H7v-2h6v2zm2-4H5V5h10v10zm-3-8H8v2h4V7z',
  check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z',
  close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z',
  arrowLeft: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
  arrowRight: 'M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z',
  chevronDown: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z',
  chevronUp: 'M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z',
  home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
  speakerOn: 'M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z',
  speakerOff: 'M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z',
  lightbulb: 'M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z',
  book: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z',
  formula: 'M7 2h10v2H7V2zm0 4h10v2H7V6zm-4 8h6v2H3v-2zm0 4h6v2H3v-2zm14-4h4v2h-4v-2zm0 4h4v2h-4v-2zM7 10h10v2H7v-2z',
  ruler: 'M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H3V8h2v4h2V8h2v4h2V8h2v4h2V8h2v4h2V8h2v8z',
  eye: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
  contrast: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18V4c4.41 0 8 3.59 8 8s-3.59 8-8 8z',
  textAa: 'M5 4v3h5.5v12h3V7H19V4H5z',
  palette: 'M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.2-.64-1.67-.08-.1-.13-.21-.13-.33 0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
  sun: 'M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z',
  moon: 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z',
  globe: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z',
  person: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  keyboard: 'M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z',
  touch: 'M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z',
  trophy: 'M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z',
  sparkle: 'M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z',
  key: 'M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z',
  chart: 'M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z',
  download: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',
  printer: 'M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z',
  image: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',
  document: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
  trash: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
  flag: 'M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z',
  triangle: 'M12 4L3 20h18L12 4zm0 3.84L17.24 18H6.76L12 7.84z',
  parallel: 'M2 6h20v2H2V6zm0 5h20v2H2v-2zm0 5h20v2H2v-2z',
  info: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
  alert: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
  x: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z',
  menu: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
  expand: 'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z',
};

// ---- TRADUÇÕES ----
export const TRANSLATIONS: Record<string, Record<string, string>> = {
  pt: {
    title: 'GeoQuiz',
    subtitle: 'Quiz de Geometria',
    players: 'Jogadores',
    player: 'Jogador',
    start: 'Começar',
    next: 'Próxima questão',
    settings: 'Configurações',
    accessibility: 'Acessibilidade',
    question: 'Questão',
    of: 'de',
    time: 'Tempo',
    score: 'Pontuação',
    correct: 'Correto',
    wrong: 'Errado',
    noAnswer: 'Não respondida',
    explanation: 'Explicação',
    mainIdea: 'Ideia principal',
    formula: 'Fórmula',
    steps: 'Resolução',
    verification: 'Verificação',
    whyWrong: 'Por que as outras estão erradas',
    tip: 'Dica',
    finalScore: 'Placar Final',
    winner: 'Vencedor',
    tie: 'Empate',
    yourScore: 'Sua pontuação',
    playAgain: 'Jogar novamente',
    saveReport: 'Salvar relatório',
    analyzeErrors: 'Analisar meus erros',
    skip: 'Pular',
    tales: 'Teorema de Tales',
    metrics: 'Relações Métricas',
    easy: 'Fácil',
    medium: 'Média',
    hard: 'Difícil',
    classic: 'Clássico',
    aiMode: 'Modo IA',
    timePerQuestion: 'Tempo por questão',
    seconds: 'segundos',
    minutes: 'minutos',
    noTimeLimit: 'Sem tempo',
    custom: 'Personalizado',
    theme: 'Tema',
    auto: 'Automático',
    light: 'Claro',
    dark: 'Escuro',
    language: 'Idioma',
    animations: 'Animações',
    on: 'Ligado',
    off: 'Desligado',
    sound: 'Som',
    volume: 'Volume',
    fontSize: 'Tamanho do texto',
    contrast: 'Contraste',
    defaultC: 'Padrão',
    mediumC: 'Médio',
    highC: 'Alto',
    endQuestion: 'Encerrar questão',
    confirmEnd: 'Tem certeza que deseja encerrar esta questão?',
    yes: 'Sim',
    no: 'Não',
    locked: 'Bloqueado',
    waiting: 'Aguardando...',
    generating: 'Gerando questões únicas...',
    cancel: 'Cancelar',
    apiKey: 'Chave de API',
    testConnection: 'Testar conexão',
    deleteKey: 'Apagar chave',
    report: 'Relatório',
    summary: 'Resumo',
    performance: 'Desemprenho',
    details: 'Detalhes',
    review: 'Pontos a revisar',
    studyPlan: 'Plano de estudo',
    html: 'HTML',
    pdf: 'PDF (impressão)',
    png: 'PNG (resumo)',
    txt: 'Texto (.txt)',
    accuracy: 'Precisão',
    avgTime: 'Tempo médio',
    fastest: 'Resposta mais rápida',
    hardest: 'Questão mais difícil',
    streak: 'Maior sequência de acertos',
    close: 'Fechar',
    restore: 'Restaurar padrões',
    saved: 'Salvo com sucesso',
    error: 'Erro',
    noInternet: 'Sem conexão com a internet',
    invalidKey: 'Chave de API inválida',
    rateLimit: 'Limite de uso atingido. Aguarde e tente novamente.',
    fallbackClassic: 'Usando modo Clássico como alternativa.',
    keys: 'Teclas',
    shape: 'Forma',
    color: 'Cor',
    name: 'Nome',
    totalQuestions: 'Total de questões',
    matchSummary: 'Resumo da partida',
    difficulty: 'Dificuldade',
    topic: 'Assunto',
    listen: 'Ouvir',
    describeFigure: 'Descrever figura',
    showNextStep: 'Mostrar próximo passo',
    glossary: 'Glossário',
    formulaSheet: 'Folha de fórmulas',
    hint: 'Dica',
    confirm: 'Confirmar',
    profile: 'Perfil',
    dyslexia: 'Dislexia / Leitura facilitada',
    lowVision: 'Baixa visão',
    colorblind: 'Daltonismo',
    adhd: 'Foco e atenção (TDAH)',
    motor: 'Motricidade',
    screenReader: 'Leitor de tela',
    customProfile: 'Personalizado',
    skipToContent: 'Pular para o conteúdo',
    timeRemaining: 'Qual é o tempo restante?',
    elapsed: 'Tempo decorrido',
    showElapsedTime: 'Mostrar tempo decorrido',
    decorativeShapes: 'Formas decorativas',
    motionScheme: 'Esquema de movimento',
    expressive: 'Expressivo',
    standard: 'Padrão',
    seedColor: 'Cor-semente',
    palette: 'Paleta',
    ocean: 'Oceano',
    forest: 'Floresta',
    sunset: 'Pôr do sol',
    violet: 'Violeta',
    graphite: 'Grafite',
    rose: 'Rosa',
    textAlign: 'Alinhamento',
    left: 'Esquerda',
    justify: 'Justificado',
    readingBg: 'Fundo de leitura',
    white: 'Branco',
    cream: 'Creme',
    softYellow: 'Amarelo suave',
    blueGray: 'Azul-acinzentado',
    softGreen: 'Verde suave',
    softDark: 'Escuro suave',
    readingRuler: 'Régua de leitura',
    focusMode: 'Modo foco',
    largeTargets: 'Alvos de toque grandes',
    confirmSubmit: 'Confirmar antes de enviar',
    autoRead: 'Ler automaticamente',
    easyLang: 'Linguagem simplificada',
    aiQuestions: 'Questões da IA',
    ia: 'IA',
    preGenerate: 'Pré-gerar questões',
    analysisTitle: 'Análise de Erros',
    selfDiagnosis: 'Autodiagnóstico',
    detectedCause: 'Causa detectada',
    guidedCorrection: 'Correção guiada',
    reinforcement: 'Exercício de reforço',
    conclusion: 'Conclusão',
    recoveryRate: 'Taxa de recuperação',
    errorPatterns: 'Padrões de erro',
    noErrors: 'Parabéns! Você não cometeu erros!',
    didntKnowFormula: 'Não lembrava a fórmula',
    confusedElements: 'Confundi elementos da figura',
    calcError: 'Errei a conta',
    misreadStatement: 'Li o enunciado errado',
    rushedGuess: 'Chutei por pressa',
    ranOutOfTime: 'Faltou tempo',
    other: 'Outro',
    swappedProportion: 'Trocou a proporção',
    confusedProjection: 'Confundiu projeção com cateto',
    forgotSqrt: 'Esqueceu a raiz quadrada',
    arithmeticError: 'Erro de conta',
    timeOut: 'Sem resposta por tempo',
    tooFast: 'Resposta muito rápida',
    reportTheme: 'Tema do relatório',
    reportLang: 'Idioma do relatório',
    density: 'Densidade',
    compact: 'Compacto',
    comfortable: 'Confortável',
    sections: 'Seções',
    charts: 'Gráficos',
    preview: 'Pré-visualização',
    welcome: 'Bem-vindo ao GeoQuiz!',
    welcomeMsg: 'Quer ajustar leitura, cores ou som? Escolha um perfil.',
    fontNotFound: 'Fonte não encontrada. Veja as instruções para instalar.',
    fontInstructions: 'Baixe as fontes gratuitas e coloque-as na pasta fonts/',
    hypotenuse: 'Hipotenusa',
    leg: 'Cateto',
    projection: 'Projeção',
    height: 'Altura',
    parallelBundle: 'Feixe de paralelas',
    transversal: 'Transversal',
    ratio: 'Razão',
    proportion: 'Proporção',
  },
  en: {
    title: 'GeoQuiz',
    subtitle: 'Geometry Quiz',
    players: 'Players',
    player: 'Player',
    start: 'Start',
    next: 'Next question',
    settings: 'Settings',
    accessibility: 'Accessibility',
    question: 'Question',
    of: 'of',
    time: 'Time',
    score: 'Score',
    correct: 'Correct',
    wrong: 'Wrong',
    noAnswer: 'Not answered',
    explanation: 'Explanation',
    mainIdea: 'Main idea',
    formula: 'Formula',
    steps: 'Solution',
    verification: 'Verification',
    whyWrong: 'Why the others are wrong',
    tip: 'Tip',
    finalScore: 'Final Score',
    winner: 'Winner',
    tie: 'Tie',
    yourScore: 'Your score',
    playAgain: 'Play again',
    saveReport: 'Save report',
    analyzeErrors: 'Analyze my errors',
    skip: 'Skip',
    tales: "Thales' Theorem",
    metrics: 'Metric Relations',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    classic: 'Classic',
    aiMode: 'AI Mode',
    timePerQuestion: 'Time per question',
    seconds: 'seconds',
    minutes: 'minutes',
    noTimeLimit: 'No time limit',
    custom: 'Custom',
    theme: 'Theme',
    auto: 'Automatic',
    light: 'Light',
    dark: 'Dark',
    language: 'Language',
    animations: 'Animations',
    on: 'On',
    off: 'Off',
    sound: 'Sound',
    volume: 'Volume',
    fontSize: 'Font size',
    contrast: 'Contrast',
    defaultC: 'Default',
    mediumC: 'Medium',
    highC: 'High',
    endQuestion: 'End question',
    confirmEnd: 'Are you sure you want to end this question?',
    yes: 'Yes',
    no: 'No',
    locked: 'Locked',
    waiting: 'Waiting...',
    generating: 'Generating unique questions...',
    cancel: 'Cancel',
    apiKey: 'API Key',
    testConnection: 'Test connection',
    deleteKey: 'Delete key',
    report: 'Report',
    summary: 'Summary',
    performance: 'Performance',
    details: 'Details',
    review: 'Points to review',
    studyPlan: 'Study plan',
    html: 'HTML',
    pdf: 'PDF (print)',
    png: 'PNG (summary)',
    txt: 'Text (.txt)',
    accuracy: 'Accuracy',
    avgTime: 'Average time',
    fastest: 'Fastest answer',
    hardest: 'Hardest question',
    streak: 'Longest streak',
    close: 'Close',
    restore: 'Restore defaults',
    saved: 'Saved successfully',
    error: 'Error',
    noInternet: 'No internet connection',
    invalidKey: 'Invalid API key',
    rateLimit: 'Usage limit reached. Please wait and try again.',
    fallbackClassic: 'Using Classic mode as fallback.',
    keys: 'Keys',
    shape: 'Shape',
    color: 'Color',
    name: 'Name',
    totalQuestions: 'Total questions',
    matchSummary: 'Match summary',
    difficulty: 'Difficulty',
    topic: 'Topic',
    listen: 'Listen',
    describeFigure: 'Describe figure',
    showNextStep: 'Show next step',
    glossary: 'Glossary',
    formulaSheet: 'Formula sheet',
    hint: 'Hint',
    confirm: 'Confirm',
    profile: 'Profile',
    dyslexia: 'Dyslexia / Easy reading',
    lowVision: 'Low vision',
    colorblind: 'Colorblind',
    adhd: 'Focus & attention (ADHD)',
    motor: 'Motor skills',
    screenReader: 'Screen reader',
    customProfile: 'Custom',
    skipToContent: 'Skip to content',
    timeRemaining: 'What is the remaining time?',
    elapsed: 'Elapsed time',
    showElapsedTime: 'Show elapsed time',
    decorativeShapes: 'Decorative shapes',
    motionScheme: 'Motion scheme',
    expressive: 'Expressive',
    standard: 'Standard',
    seedColor: 'Seed color',
    palette: 'Palette',
    ocean: 'Ocean',
    forest: 'Forest',
    sunset: 'Sunset',
    violet: 'Violet',
    graphite: 'Graphite',
    rose: 'Rose',
    textAlign: 'Text align',
    left: 'Left',
    justify: 'Justify',
    readingBg: 'Reading background',
    white: 'White',
    cream: 'Cream',
    softYellow: 'Soft yellow',
    blueGray: 'Blue-gray',
    softGreen: 'Soft green',
    softDark: 'Soft dark',
    readingRuler: 'Reading ruler',
    focusMode: 'Focus mode',
    largeTargets: 'Large touch targets',
    confirmSubmit: 'Confirm before submit',
    autoRead: 'Auto read',
    easyLang: 'Simple language',
    aiQuestions: 'AI Questions',
    ia: 'AI',
    preGenerate: 'Pre-generate questions',
    analysisTitle: 'Error Analysis',
    selfDiagnosis: 'Self-diagnosis',
    detectedCause: 'Detected cause',
    guidedCorrection: 'Guided correction',
    reinforcement: 'Reinforcement exercise',
    conclusion: 'Conclusion',
    recoveryRate: 'Recovery rate',
    errorPatterns: 'Error patterns',
    noErrors: 'Congratulations! You made no errors!',
    didntKnowFormula: "Didn't remember the formula",
    confusedElements: 'Confused figure elements',
    calcError: 'Calculation error',
    misreadStatement: 'Misread the statement',
    rushedGuess: 'Rushed guess',
    ranOutOfTime: 'Ran out of time',
    other: 'Other',
    swappedProportion: 'Swapped the proportion',
    confusedProjection: 'Confused projection with leg',
    forgotSqrt: 'Forgot the square root',
    arithmeticError: 'Arithmetic error',
    timeOut: 'No answer (time out)',
    tooFast: 'Answer too fast',
    reportTheme: 'Report theme',
    reportLang: 'Report language',
    density: 'Density',
    compact: 'Compact',
    comfortable: 'Comfortable',
    sections: 'Sections',
    charts: 'Charts',
    preview: 'Preview',
    welcome: 'Welcome to GeoQuiz!',
    welcomeMsg: 'Want to adjust reading, colors or sound? Choose a profile.',
    fontNotFound: 'Font not found. See instructions to install.',
    fontInstructions: 'Download free fonts and place them in the fonts/ folder',
    hypotenuse: 'Hypotenuse',
    leg: 'Leg',
    projection: 'Projection',
    height: 'Height',
    parallelBundle: 'Bundle of parallels',
    transversal: 'Transversal',
    ratio: 'Ratio',
    proportion: 'Proportion',
  },
  es: {
    title: 'GeoQuiz',
    subtitle: 'Quiz de Geometría',
    players: 'Jugadores',
    player: 'Jugador',
    start: 'Comenzar',
    next: 'Siguiente',
    settings: 'Configuración',
    accessibility: 'Accesibilidad',
    question: 'Pregunta',
    of: 'de',
    time: 'Tiempo',
    score: 'Puntuación',
    correct: 'Correcto',
    wrong: 'Incorrecto',
    noAnswer: 'No respondida',
    explanation: 'Explicación',
    mainIdea: 'Idea principal',
    formula: 'Fórmula',
    steps: 'Resolución',
    verification: 'Verificación',
    whyWrong: 'Por qué las otras están mal',
    tip: 'Consejo',
    finalScore: 'Puntuación Final',
    winner: 'Ganador',
    tie: 'Empate',
    yourScore: 'Tu puntuación',
    playAgain: 'Jugar de nuevo',
    saveReport: 'Guardar informe',
    analyzeErrors: 'Analizar errores',
    skip: 'Saltar',
    tales: 'Teorema de Tales',
    metrics: 'Relaciones Métricas',
    easy: 'Fácil',
    medium: 'Media',
    hard: 'Difícil',
    classic: 'Clásico',
    aiMode: 'Modo IA',
    timePerQuestion: 'Tiempo por pregunta',
    seconds: 'segundos',
    minutes: 'minutos',
    noTimeLimit: 'Sin tiempo',
    custom: 'Personalizado',
    theme: 'Tema',
    auto: 'Automático',
    light: 'Claro',
    dark: 'Oscuro',
    language: 'Idioma',
    close: 'Cerrar',
    restore: 'Restaurar valores',
    keys: 'Teclas',
    endQuestion: 'Terminar pregunta',
    confirmEnd: '¿Seguro que deseas terminar esta pregunta?',
    yes: 'Sí',
    no: 'No',
    locked: 'Bloqueado',
    waiting: 'Esperando...',
    generating: 'Generando preguntas únicas...',
    cancel: 'Cancelar',
  },
};

// Fallback for missing translations
export function t(key: string, lang: string): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS['pt'];
  return dict[key] || TRANSLATIONS['pt'][key] || key;
}

// ---- BANCO DE QUESTÕES ----
export const QUESTION_BANK: Question[] = [
  // TEOREMA DE TALES - FÁCIL
  {
    id: 't1',
    topic: 'tales',
    difficulty: 'easy',
    statement: 'Duas retas paralelas são cortadas por duas transversais. Na primeira transversal, os segmentos medem 4 cm e 6 cm. Na segunda transversal, o primeiro segmento mede 8 cm. Qual é a medida do segundo segmento?',
    figureDesc: 'Duas retas paralelas cortadas por duas transversais, com segmentos de 4 e 6 cm na primeira e 8 e x cm na segunda.',
    figureParams: { type: 'tales', segments1: [4, 6], segments2: [8, null], unit: 'cm' },
    options: ['10 cm', '12 cm', '14 cm', '9 cm', '16 cm'],
    correctIndex: 1,
    explanation: {
      mainIdea: 'O Teorema de Tales diz que retas paralelas determinam segmentos proporcionais nas transversais.',
      formula: 'a/b = c/d, onde a e b são segmentos de uma transversal e c e d da outra.',
      formulaSpoken: 'a sobre b é igual a c sobre d',
      steps: [
        'Identificar os segmentos: 4 e 6 na primeira, 8 e x na segunda.',
        'Montar a proporção: 4/6 = 8/x',
        'Aplicar a propriedade fundamental: 4·x = 6·8',
        '4x = 48',
        'x = 48/4 = 12 cm'
      ],
      verification: 'Verificando: 4/6 = 8/12 → 2/3 = 2/3 ✓',
      whyWrong: [
        '10 cm: somou 4+6=10, sem usar proporção.',
        '14 cm: somou 6+8=14, confundiu operações.',
        '9 cm: dividiu 48/6 em vez de 48/4.',
        '16 cm: multiplicou 4×8/2 sem montar a proporção.'
      ],
      tip: 'Sempre monte a proporção antes de calcular. Segmentos correspondentes ficam na mesma posição da fração.'
    },
    glossaryTerms: ['proportion', 'transversal', 'parallelBundle'],
  },
  {
    id: 't2',
    topic: 'tales',
    difficulty: 'easy',
    statement: 'Uma rua tem 3 postes equidistantes. A distância do primeiro ao segundo poste é de 15 m. Qual é a distância do primeiro ao terceiro poste?',
    figureDesc: 'Três postes alinhados com distâncias iguais de 15 m entre cada par consecutivo.',
    figureParams: { type: 'tales-linear', segments: [15, 15], unit: 'm' },
    options: ['20 m', '25 m', '30 m', '35 m', '45 m'],
    correctIndex: 2,
    explanation: {
      mainIdea: 'Postes equidistantes formam segmentos iguais. A distância total é a soma dos segmentos.',
      formula: 'D = d₁ + d₂',
      formulaSpoken: 'D é igual a d₁ mais d₂',
      steps: [
        'Identificar: 3 postes, 2 segmentos iguais de 15 m cada.',
        'Distância total = 15 + 15 = 30 m.'
      ],
      verification: '15 + 15 = 30 ✓',
      whyWrong: [
        '20 m: estimativa sem cálculo.',
        '25 m: média aritmética sem sentido aqui.',
        '35 m: somou 15+15+5, erro de conta.',
        '45 m: multiplicou 15×3 em vez de considerar 2 intervalos.'
      ],
      tip: 'Com n postes equidistantes, há (n-1) intervalos. Conte os intervalos, não os postes!'
    },
  },
  // TEOREMA DE TALES - MÉDIO
  {
    id: 't3',
    topic: 'tales',
    difficulty: 'medium',
    statement: 'Um prédio projeta uma sombra de 12 m. No mesmo instante, uma pessoa de 1,80 m projeta uma sombra de 2,4 m. Qual é a altura do prédio?',
    figureDesc: 'Triângulo formado pelo prédio (altura h), sombra de 12 m e raio solar. Ao lado, pessoa de 1,80 m com sombra de 2,4 m.',
    figureParams: { type: 'tales-shadow', building: null, shadow1: 12, person: 1.8, shadow2: 2.4, unit: 'm' },
    options: ['7 m', '8 m', '9 m', '10 m', '12 m'],
    correctIndex: 2,
    explanation: {
      mainIdea: 'Os raios solares formam triângulos semelhantes. A razão altura/sombra é a mesma.',
      formula: 'H/S = h/s → H = h·S/s',
      formulaSpoken: 'H sobre S é igual a h sobre s. H é a altura do prédio, S a sombra do prédio, h a altura da pessoa, s a sombra da pessoa.',
      steps: [
        'Montar proporção: H/12 = 1,80/2,4',
        'H = 12 × 1,80/2,4',
        'H = 12 × 0,75',
        'H = 9 m'
      ],
      verification: '9/12 = 1,80/2,4 → 0,75 = 0,75 ✓',
      whyWrong: [
        '7 m: subtraiu 12-2,4-1,8 sem proporção.',
        '8 m: dividiu 12/1,5 sem base.',
        '10 m: arredondou 1,80 para 2 e calculou 12×2/2,4.',
        '12 m: igualou sombra à altura sem calcular.'
      ],
      tip: 'Na sombra, a razão é sempre a mesma no mesmo instante. Monte a proporção com cuidado: altura do objeto grande / sombra grande = altura pequena / sombra pequena.'
    },
    glossaryTerms: ['proportion', 'ratio'],
  },
  {
    id: 't4',
    topic: 'tales',
    difficulty: 'medium',
    statement: 'Em um triângulo ABC, um segmento DE paralelo a BC divide AB em AD = 5 cm e DB = 3 cm. Se BC = 12 cm, qual é a medida de DE?',
    figureDesc: 'Triângulo ABC com DE paralelo a BC. AD = 5, DB = 3, BC = 12, DE = ?',
    figureParams: { type: 'tales-triangle', AD: 5, DB: 3, BC: 12, DE: null, unit: 'cm' },
    options: ['6 cm', '7 cm', '7,5 cm', '8 cm', '9 cm'],
    correctIndex: 2,
    explanation: {
      mainIdea: 'O segmento paralelo a um lado do triângulo cria triângulos semelhantes (caso básico de Tales).',
      formula: 'DE/BC = AD/AB',
      formulaSpoken: 'DE sobre BC é igual a AD sobre AB',
      steps: [
        'Calcular AB = AD + DB = 5 + 3 = 8 cm.',
        'Montar proporção: DE/12 = 5/8',
        'DE = 12 × 5/8',
        'DE = 60/8 = 7,5 cm'
      ],
      verification: '7,5/12 = 5/8 → 0,625 = 0,625 ✓',
      whyWrong: [
        '6 cm: usou DE/12 = 3/6 (segmentos errados).',
        '7 cm: aproximou sem calcular a fração.',
        '8 cm: usou DE/12 = 8/12 = AB/BC.',
        '9 cm: usou DE/12 = 3/4 (DB/BC).'
      ],
      tip: 'No triângulo com paralelo, a razão é sempre: segmento pequeno do triângulo menor / lado correspondente do triângulo maior. Use o lado completo (AB), não apenas uma parte.'
    },
    glossaryTerms: ['proportion', 'parallelBundle'],
  },
  // TEOREMA DE TALES - DIFÍCIL
  {
    id: 't5',
    topic: 'tales',
    difficulty: 'hard',
    statement: 'Uma rampa de 10 m de comprimento liga o chão ao topo de um edifício. A 4 m do início da rampa, a altura é de 2,4 m. Qual é a altura total do edifício?',
    figureDesc: 'Rampa inclinada de 10 m. A 4 m da base, altura de 2,4 m. Altura total do edifício = h.',
    figureParams: { type: 'tales-ramp', rampLength: 10, distance: 4, heightAt: 2.4, totalHeight: null, unit: 'm' },
    options: ['5 m', '5,5 m', '6 m', '6,5 m', '7 m'],
    correctIndex: 2,
    explanation: {
      mainIdea: 'A rampa forma triângulos semelhantes com o chão. A razão entre altura e distância ao longo da rampa é constante.',
      formula: 'h_total/L = h_parcial/d → h_total = L × h_parcial/d',
      formulaSpoken: 'h total sobre L é igual a h parcial sobre d',
      steps: [
        'Identificar: rampa total = 10 m, a 4 m a altura é 2,4 m.',
        'Proporção: h/10 = 2,4/4',
        'h = 10 × 2,4/4',
        'h = 10 × 0,6 = 6 m'
      ],
      verification: '6/10 = 2,4/4 → 0,6 = 0,6 ✓',
      whyWrong: [
        '5 m: usou 2,4 × 10/4 sem verificar.',
        '5,5 m: média entre valores sem proporção.',
        '6,5 m: somou 4+2,4/10 de forma incorreta.',
        '7 m: usou 2,4 + 4 + 0,6 sem lógica.'
      ],
      tip: 'Em rampas e inclinações, os triângulos formados são semelhantes. A razão altura/distância é constante ao longo de toda a rampa.'
    },
  },
  {
    id: 't6',
    topic: 'tales',
    difficulty: 'hard',
    statement: 'Três terrenos frentam para três ruas paralelas. As testadas (frentes) na primeira rua medem 20 m, 30 m e 50 m. A segunda rua tem comprimento total de 240 m. Qual é a testada do segundo terreno na segunda rua?',
    figureDesc: 'Três ruas paralelas cortadas por duas transversais. Testadas: 20, 30, 50 na primeira. Total na segunda = 240 m.',
    figureParams: { type: 'tales-parallel', fronts: [20, 30, 50], totalSecond: 240, unit: 'm' },
    options: ['60 m', '72 m', '80 m', '90 m', '100 m'],
    correctIndex: 1,
    explanation: {
      mainIdea: 'Com três paralelas, as testadas são proporcionais entre as duas transversais.',
      formula: 'f₁/F₁ = f₂/F₂ = f₃/F₃',
      formulaSpoken: 'f₁ sobre F₁ é igual a f₂ sobre F₂ é igual a f₃ sobre F₃',
      steps: [
        'Soma das testadas na 1ª rua: 20 + 30 + 50 = 100 m.',
        'Razão: 240/100 = 2,4.',
        'Testada do 2º terreno: 30 × 2,4 = 72 m.'
      ],
      verification: '20×2,4 = 48; 30×2,4 = 72; 50×2,4 = 120. Total: 48+72+120 = 240 ✓',
      whyWrong: [
        '60 m: usou 30×2 (razão errada).',
        '80 m: usou 30×240/100 com erro de conta.',
        '90 m: usou 30×3 (multiplicou pelo número de terrenos).',
        '100 m: igualou à soma da primeira rua.'
      ],
      tip: 'Com várias paralelas, a razão de proporcionalidade é o total da segunda transversal dividido pelo total da primeira.'
    },
  },
  // RELAÇÕES MÉTRICAS - FÁCIL
  {
    id: 'm1',
    topic: 'metrics',
    difficulty: 'easy',
    statement: 'Um triângulo retângulo tem catetos medindo 6 cm e 8 cm. Qual é a medida da hipotenusa?',
    figureDesc: 'Triângulo retângulo com catetos b = 6 cm e c = 8 cm, hipotenusa a = ?',
    figureParams: { type: 'right-triangle', b: 6, c: 8, a: null, unit: 'cm' },
    options: ['9 cm', '10 cm', '11 cm', '12 cm', '14 cm'],
    correctIndex: 1,
    explanation: {
      mainIdea: 'O Teorema de Pitágoras: a hipotenusa ao quadrado é igual à soma dos quadrados dos catetos.',
      formula: 'a² = b² + c²',
      formulaSpoken: 'a ao quadrado é igual a b ao quadrado mais c ao quadrado',
      steps: [
        'a² = 6² + 8²',
        'a² = 36 + 64',
        'a² = 100',
        'a = √100 = 10 cm'
      ],
      verification: '10² = 6² + 8² → 100 = 36 + 64 ✓',
      whyWrong: [
        '9 cm: calculou √(36+64) mas errou a raiz.',
        '11 cm: somou 6+8-3 sem usar Pitágoras.',
        '12 cm: somou os catetos diretamente (6+8=14, depois ajustou).',
        '14 cm: somou 6+8 = 14, confundiu soma com hipotenusa.'
      ],
      tip: 'Pitágoras: SEMPRE eleve ao quadrado antes de somar, e tire a raiz no final. O trio 6-8-10 é um múltiplo do famoso 3-4-5.'
    },
    glossaryTerms: ['hypotenuse', 'leg'],
  },
  {
    id: 'm2',
    topic: 'metrics',
    difficulty: 'easy',
    statement: 'Uma escada de 5 m está apoiada em uma parede. O pé da escada está a 3 m da base da parede. A que altura a escada toca a parede?',
    figureDesc: 'Escada (hipotenusa = 5 m) apoiada na parede. Distância do pé à parede = 3 m. Altura = h.',
    figureParams: { type: 'ladder', hypotenuse: 5, base: 3, height: null, unit: 'm' },
    options: ['2 m', '3 m', '4 m', '4,5 m', '5 m'],
    correctIndex: 2,
    explanation: {
      mainIdea: 'A escada, a parede e o chão formam um triângulo retângulo. Use Pitágoras.',
      formula: 'a² = b² + c² → h² = a² - d²',
      formulaSpoken: 'a ao quadrado é igual a b ao quadrado mais c ao quadrado. h ao quadrado é igual a a ao quadrado menos d ao quadrado.',
      steps: [
        'a = 5 (escada), d = 3 (distância ao pé), h = ?',
        '5² = h² + 3²',
        '25 = h² + 9',
        'h² = 16',
        'h = 4 m'
      ],
      verification: '4² + 3² = 16 + 9 = 25 = 5² ✓',
      whyWrong: [
        '2 m: subtraiu 5-3 = 2.',
        '3 m: igualou à distância do pé.',
        '4,5 m: calculou (5+3)/2.',
        '5 m: igualou à escada.'
      ],
      tip: 'Escada + parede + chão = triângulo retângulo. A escada é SEMPRE a hipotenusa (o maior lado, oposto ao ângulo reto).'
    },
    glossaryTerms: ['hypotenuse', 'leg'],
  },
  // RELAÇÕES MÉTRICAS - MÉDIO
  {
    id: 'm3',
    topic: 'metrics',
    difficulty: 'medium',
    statement: 'Em um triângulo retângulo, a hipotenusa mede 10 cm e a projeção de um cateto sobre a hipotenusa mede 6 cm. Calcule a altura relativa à hipotenusa.',
    figureDesc: 'Triângulo retângulo com hipotenusa a = 10, projeção m = 6, altura h = ?',
    figureParams: { type: 'right-triangle-height', a: 10, m: 6, n: null, h: null, unit: 'cm' },
    options: ['3,6 cm', '4 cm', '4,8 cm', '5 cm', '6 cm'],
    correctIndex: 2,
    explanation: {
      mainIdea: 'Na relação métrica: h² = m × n, onde m e n são as projeções dos catetos sobre a hipotenusa.',
      formula: 'h² = m · n e a = m + n',
      formulaSpoken: 'h ao quadrado é igual a m vezes n. a é igual a m mais n.',
      steps: [
        'a = 10, m = 6, então n = 10 - 6 = 4.',
        'h² = m × n = 6 × 4 = 24',
        'h = √24 = √(4×6) = 2√6 ≈ 4,8 cm'
      ],
      verification: 'h² = 6 × 4 = 24. h = √24 ≈ 4,899 ≈ 4,8 ✓',
      whyWrong: [
        '3,6 cm: multiplicou 6×0,6 sem lógica.',
        '4 cm: confundiu h com n.',
        '5 cm: usou h = a/2.',
        '6 cm: confundiu h com m.'
      ],
      tip: 'Lembre: n = a - m. Depois h² = m × n. A altura é a média geométrica das projeções.'
    },
    glossaryTerms: ['hypotenuse', 'projection', 'height'],
  },
  {
    id: 'm4',
    topic: 'metrics',
    difficulty: 'medium',
    statement: 'Em um triângulo retângulo, a hipotenusa mede 13 cm e um cateto mede 5 cm. Calcule a projeção desse cateto sobre a hipotenusa.',
    figureDesc: 'Triângulo retângulo com a = 13, c = 5, b = ?, m = ?',
    figureParams: { type: 'right-triangle-proj', a: 13, c: 5, b: null, m: null, n: null, unit: 'cm' },
    options: ['1,92 cm', '2,5 cm', '3,25 cm', '5 cm', '6,5 cm'],
    correctIndex: 0,
    explanation: {
      mainIdea: 'Use a relação c² = a × m para encontrar a projeção do cateto c.',
      formula: 'c² = a · m',
      formulaSpoken: 'c ao quadrado é igual a a vezes m',
      steps: [
        'Primeiro, encontre o outro cateto: b² = a² - c² = 169 - 25 = 144, b = 12.',
        'Use c² = a × m: 25 = 13 × m',
        'm = 25/13 ≈ 1,92 cm'
      ],
      verification: '13 × 1,92 ≈ 25 = 5² ✓. E n = 13 - 1,92 = 11,08. b² = 13 × 11,08 ≈ 144 = 12² ✓',
      whyWrong: [
        '2,5 cm: usou m = c/2.',
        '3,25 cm: usou m = c²/(a+c) sem lógica.',
        '5 cm: confundiu projeção com cateto.',
        '6,5 cm: usou m = a/2.'
      ],
      tip: 'A projeção de um cateto é sempre menor que o cateto. Use c² = a × m e isole m.'
    },
    glossaryTerms: ['hypotenuse', 'leg', 'projection'],
  },
  // RELAÇÕES MÉTRICAS - DIFÍCIL
  {
    id: 'm5',
    topic: 'metrics',
    difficulty: 'hard',
    statement: 'Um poste de 8 m é sustentado por um cabo de aço que vai do topo do poste a um ponto no chão, formando um triângulo retângulo. Se a distância do ponto de ancoragem à base do poste é de 6 m, qual é o comprimento do cabo?',
    figureDesc: 'Poste vertical de 8 m, cabo do topo ao chão a 6 m da base. Comprimento do cabo = ?',
    figureParams: { type: 'cable', height: 8, base: 6, cable: null, unit: 'm' },
    options: ['9 m', '10 m', '11 m', '12 m', '14 m'],
    correctIndex: 1,
    explanation: {
      mainIdea: 'Poste, cabo e chão formam um triângulo retângulo. O cabo é a hipotenusa.',
      formula: 'cabo² = altura² + base²',
      formulaSpoken: 'cabo ao quadrado é igual a altura ao quadrado mais base ao quadrado',
      steps: [
        'cabo² = 8² + 6²',
        'cabo² = 64 + 36',
        'cabo² = 100',
        'cabo = 10 m'
      ],
      verification: '10² = 8² + 6² → 100 = 64 + 36 ✓',
      whyWrong: [
        '9 m: estimou sem calcular.',
        '11 m: somou 8+6-3.',
        '12 m: somou parcialmente.',
        '14 m: somou 8+6 = 14.'
      ],
      tip: 'O trio 6-8-10 é o dobro do famoso 3-4-5. Reconhecer triplas pitagóricas acelera muito a resolução!'
    },
    glossaryTerms: ['hypotenuse', 'leg'],
  },
  {
    id: 'm6',
    topic: 'metrics',
    difficulty: 'hard',
    statement: 'Em um triângulo retângulo, a altura relativa à hipotenusa mede 4,8 cm e a hipotenusa mede 10 cm. Calcule as projeções dos catetos sobre a hipotenusa.',
    figureDesc: 'Triângulo retângulo com a = 10, h = 4,8, m = ?, n = ?',
    figureParams: { type: 'right-triangle-both-proj', a: 10, h: 4.8, m: null, n: null, unit: 'cm' },
    options: ['m = 5 e n = 5', 'm = 6 e n = 4', 'm = 6,4 e n = 3,6', 'm = 7 e n = 3', 'm = 8 e n = 2'],
    correctIndex: 2,
    explanation: {
      mainIdea: 'Usamos h² = m × n e m + n = a para encontrar as projeções.',
      formula: 'h² = m · n e m + n = a',
      formulaSpoken: 'h ao quadrado é igual a m vezes n. m mais n é igual a a.',
      steps: [
        'h² = 4,8² = 23,04',
        'm + n = 10, então n = 10 - m',
        'm × (10 - m) = 23,04',
        '10m - m² = 23,04',
        'm² - 10m + 23,04 = 0',
        'Δ = 100 - 92,16 = 7,84',
        'm = (10 + √7,84)/2 = (10 + 2,8)/2 = 6,4',
        'n = 10 - 6,4 = 3,6'
      ],
      verification: '6,4 × 3,6 = 23,04 = 4,8² ✓ e 6,4 + 3,6 = 10 ✓',
      whyWrong: [
        'm=5, n=5: h² = 25, mas 4,8² = 23,04 ≠ 25.',
        'm=6, n=4: h² = 24, mas 4,8² = 23,04 ≠ 24.',
        'm=7, n=3: h² = 21 ≠ 23,04.',
        'm=8, n=2: h² = 16 ≠ 23,04.'
      ],
      tip: 'Quando tem h e a, use o sistema: m + n = a e m × n = h². Resolva como equação do 2º grau.'
    },
    glossaryTerms: ['hypotenuse', 'height', 'projection'],
  },
  // Mais questões para completar o banco
  {
    id: 't7',
    topic: 'tales',
    difficulty: 'easy',
    statement: 'Em um mapa, a escala é 1:500. Duas cidades estão separadas por 6 cm no mapa. Qual a distância real entre elas?',
    figureDesc: 'Segmento de 6 cm no mapa com escala 1:500.',
    figureParams: { type: 'tales-scale', mapDist: 6, scale: 500, unit: 'cm' },
    options: ['20 m', '25 m', '30 m', '35 m', '50 m'],
    correctIndex: 2,
    explanation: {
      mainIdea: 'A escala indica a razão entre medida no mapa e medida real.',
      formula: 'E = d_mapa/d_real → d_real = d_mapa × escala',
      formulaSpoken: 'E é igual a d mapa sobre d real',
      steps: [
        'd_real = 6 × 500 = 3000 cm',
        '3000 cm = 30 m'
      ],
      verification: '30 m = 3000 cm. 3000/6 = 500 ✓',
      whyWrong: [
        '20 m: dividiu 6×500/150 sem lógica.',
        '25 m: usou escala 1:400.',
        '35 m: somou 6+500/25.',
        '50 m: multiplicou 6×500/60.'
      ],
      tip: 'Escala 1:n significa que 1 unidade no mapa vale n unidades na realidade. Multiplique e converta as unidades!'
    },
  },
  {
    id: 't8',
    topic: 'tales',
    difficulty: 'medium',
    statement: 'Um feixe de 4 retas paralelas determina em uma transversal segmentos de 3, 5 e 7 cm. Em outra transversal, o segmento total mede 45 cm. Quais são os segmentos na segunda transversal?',
    figureDesc: '4 retas paralelas cortadas por 2 transversais. Na 1ª: 3, 5, 7 cm. Na 2ª: total 45 cm.',
    figureParams: { type: 'tales-4parallel', segs1: [3, 5, 7], total2: 45, unit: 'cm' },
    options: ['9, 12 e 24', '9, 15 e 21', '10, 15 e 20', '12, 15 e 18', '9, 16 e 20'],
    correctIndex: 1,
    explanation: {
      mainIdea: 'A razão de proporcionalidade é total2/total1.',
      formula: 'razão = total₂/total₁',
      formulaSpoken: 'razão é igual a total 2 sobre total 1',
      steps: [
        'Total na 1ª: 3 + 5 + 7 = 15 cm.',
        'Razão: 45/15 = 3.',
        'Segmentos na 2ª: 3×3=9, 5×3=15, 7×3=21.'
      ],
      verification: '9 + 15 + 21 = 45 ✓ e 9/3 = 15/5 = 21/7 = 3 ✓',
      whyWrong: [
        '9, 12, 24: não mantém proporção 3:5:7.',
        '10, 15, 20: razão aproximada mas não exata.',
        '12, 15, 18: não mantém proporção.',
        '9, 16, 20: soma 45 mas não proporcional.'
      ],
      tip: 'A razão é sempre o total da segunda dividido pelo total da primeira. Multiplique cada segmento por essa razão.'
    },
  },
  {
    id: 'm7',
    topic: 'metrics',
    difficulty: 'easy',
    statement: 'Qual é a diagonal de um quadrado de lado 7 cm?',
    figureDesc: 'Quadrado de lado 7 cm com diagonal d tracejada.',
    figureParams: { type: 'square-diagonal', side: 7, diagonal: null, unit: 'cm' },
    options: ['7 cm', '7√2 ≈ 9,9 cm', '10 cm', '14 cm', '49 cm'],
    correctIndex: 1,
    explanation: {
      mainIdea: 'A diagonal de um quadrado divide-o em dois triângulos retângulos isósceles.',
      formula: 'd² = l² + l² = 2l² → d = l√2',
      formulaSpoken: 'd ao quadrado é igual a l ao quadrado mais l ao quadrado, que é 2 l ao quadrado. d é igual a l vezes raiz de 2.',
      steps: [
        'd² = 7² + 7² = 49 + 49 = 98',
        'd = √98 = 7√2 ≈ 9,9 cm'
      ],
      verification: '(7√2)² = 49×2 = 98 = 7² + 7² ✓',
      whyWrong: [
        '7 cm: confundiu diagonal com lado.',
        '10 cm: aproximou √98 ≈ 10 sem precisão.',
        '14 cm: dobrou o lado (7×2).',
        '49 cm: calculou 7² em vez de √98.'
      ],
      tip: 'A diagonal de qualquer quadrado de lado l é sempre l√2. Memorize: d = l√2.'
    },
    glossaryTerms: ['hypotenuse', 'leg'],
  },
  {
    id: 'm8',
    topic: 'metrics',
    difficulty: 'medium',
    statement: 'Em um triângulo retângulo, um cateto mede 12 cm e sua projeção sobre a hipotenusa mede 7,2 cm. Calcule a hipotenusa.',
    figureDesc: 'Triângulo retângulo com cateto b = 12, projeção m = 7,2, hipotenusa a = ?',
    figureParams: { type: 'right-triangle-find-a', b: 12, m: 7.2, a: null, unit: 'cm' },
    options: ['15 cm', '18 cm', '20 cm', '22 cm', '24 cm'],
    correctIndex: 2,
    explanation: {
      mainIdea: 'Use b² = a × m para encontrar a hipotenusa.',
      formula: 'b² = a · m → a = b²/m',
      formulaSpoken: 'b ao quadrado é igual a a vezes m. a é igual a b ao quadrado sobre m.',
      steps: [
        '12² = a × 7,2',
        '144 = 7,2a',
        'a = 144/7,2 = 20 cm'
      ],
      verification: '20 × 7,2 = 144 = 12² ✓',
      whyWrong: [
        '15 cm: usou a = b + m = 12 + 7,2 ≈ 19 e arredondou.',
        '18 cm: usou a = b × m/8 sem lógica.',
        '22 cm: somou 12 + 7,2 + 2,8.',
        '24 cm: dobrou o cateto.'
      ],
      tip: 'Na relação b² = a × m, se você tem b e m, basta isolar a = b²/m.'
    },
    glossaryTerms: ['hypotenuse', 'leg', 'projection'],
  },
  {
    id: 't9',
    topic: 'tales',
    difficulty: 'hard',
    statement: 'Um terreno triangular tem frente de 40 m para uma rua. Uma cerca paralela à frente, a 12 m dela, divide o terreno. Se a altura do triângulo é de 30 m, qual é o comprimento da cerca?',
    figureDesc: 'Triângulo com base 40 m e altura 30 m. Linha paralela à base a 12 m da base. Comprimento da cerca = ?',
    figureParams: { type: 'tales-triangle-parallel', base: 40, height: 30, distFromBase: 12, parallelSeg: null, unit: 'm' },
    options: ['20 m', '22 m', '24 m', '26 m', '28 m'],
    correctIndex: 2,
    explanation: {
      mainIdea: 'A linha paralela à base cria um triângulo menor semelhante ao maior.',
      formula: 'segmento/base = (altura - distância)/altura',
      formulaSpoken: 'segmento sobre base é igual a altura menos distância sobre altura',
      steps: [
        'A distância do vértice à cerca = 30 - 12 = 18 m.',
        'Razão de semelhança: 18/30 = 3/5.',
        'Comprimento da cerca: 40 × 3/5 = 24 m.'
      ],
      verification: '24/40 = 18/30 = 3/5 = 0,6 ✓',
      whyWrong: [
        '20 m: usou razão 12/30 = 2/5.',
        '22 m: média sem base.',
        '26 m: usou razão 26/40 sem lógica.',
        '28 m: usou razão (30-12+8)/30.'
      ],
      tip: 'A razão de semelhança é a distância do VÉRTICE à paralela, dividida pela altura total. Cuidado: a distância dada é a partir da BASE.'
    },
  },
  {
    id: 'm9',
    topic: 'metrics',
    difficulty: 'hard',
    statement: 'Um triângulo retângulo tem hipotenusa 25 cm e a relação entre os catetos é b/c = 4/3. Calcule a altura relativa à hipotenusa.',
    figureDesc: 'Triângulo retângulo com a = 25, b/c = 4/3, h = ?',
    figureParams: { type: 'right-triangle-ratio', a: 25, ratio: '4/3', h: null, unit: 'cm' },
    options: ['10 cm', '12 cm', '15 cm', '18 cm', '20 cm'],
    correctIndex: 1,
    explanation: {
      mainIdea: 'Com a razão entre catetos e a hipotenusa, encontramos os catetos e depois a altura.',
      formula: 'b = 4k, c = 3k, a² = b² + c²',
      formulaSpoken: 'b é igual a 4k, c é igual a 3k, a ao quadrado é igual a b ao quadrado mais c ao quadrado',
      steps: [
        'b = 4k, c = 3k',
        '25² = (4k)² + (3k)² = 16k² + 9k² = 25k²',
        '625 = 25k² → k² = 25 → k = 5',
        'b = 20, c = 15',
        'h = b×c/a = 20×15/25 = 300/25 = 12 cm'
      ],
      verification: '20² + 15² = 400 + 225 = 625 = 25² ✓. h = 20×15/25 = 12 ✓',
      whyWrong: [
        '10 cm: usou h = a/2,5.',
        '15 cm: confundiu h com c.',
        '18 cm: calculou (20+15)/2.',
        '20 cm: confundiu h com b.'
      ],
      tip: 'A razão 4:3 com hipotenusa 25 é a tripla 15-20-25 (múltipla de 3-4-5). A altura usa a·h = b·c.'
    },
    glossaryTerms: ['hypotenuse', 'leg', 'height'],
  },
  {
    id: 'm10',
    topic: 'metrics',
    difficulty: 'hard',
    statement: 'A projeção de um cateto sobre a hipotenusa mede 3,6 cm e a hipotenusa mede 10 cm. Calcule o produto dos catetos.',
    figureDesc: 'Triângulo retângulo com a = 10, m = 3,6, b×c = ?',
    figureParams: { type: 'right-triangle-product', a: 10, m: 3.6, product: null, unit: 'cm' },
    options: ['36 cm²', '40 cm²', '42 cm²', '48 cm²', '50 cm²'],
    correctIndex: 3,
    explanation: {
      mainIdea: 'Usamos as relações métricas para encontrar os catetos e depois o produto.',
      formula: 'b² = a·m, c² = a·n, produto = b·c = a·h',
      formulaSpoken: 'b ao quadrado é igual a a vezes m. c ao quadrado é igual a a vezes n. O produto é igual a a vezes h.',
      steps: [
        'n = 10 - 3,6 = 6,4',
        'b² = 10 × 3,6 = 36 → b = 6',
        'c² = 10 × 6,4 = 64 → c = 8',
        'b × c = 6 × 8 = 48 cm²'
      ],
      verification: '6² + 8² = 36 + 64 = 100 = 10² ✓. Produto = 48 ✓',
      whyWrong: [
        '36 cm²: confundiu com b².',
        '40 cm²: usou a × m + a × n sem raiz.',
        '42 cm²: calculou (b+c)×algo.',
        '50 cm²: usou a²/2.'
      ],
      tip: 'Encontre cada cateto separadamente usando b² = a·m e c² = a·n, depois multiplique.'
    },
    glossaryTerms: ['hypotenuse', 'leg', 'projection'],
  },
];

// ---- GERADORES PARAMÉTRICOS ----
export function generateTalesQuestion(seed: number): Question {
  const rng = mulberry32(seed);
  const variants = [
    () => {
      const a = Math.floor(rng() * 8) + 3;
      const b = Math.floor(rng() * 8) + 3;
      const c = a * (Math.floor(rng() * 4) + 2);
      const d = b * (c / a);
      return {
        statement: `Duas retas paralelas são cortadas por transversais. Os segmentos na primeira medem ${a} cm e ${b} cm. Na segunda, o primeiro segmento mede ${c} cm. Qual é o segundo?`,
        figureParams: { type: 'tales', segments1: [a, b], segments2: [c, null], unit: 'cm' },
        options: generateOptions(d, [a + b, c + a, d + 1, d - 1], 'cm'),
        correctIndex: 0,
        answer: d,
        explanation: {
          mainIdea: 'Teorema de Tales: segmentos proporcionais.',
          formula: `${a}/${b} = ${c}/x`,
          formulaSpoken: `${a} sobre ${b} é igual a ${c} sobre x`,
          steps: [`${a}/${b} = ${c}/x`, `${a}·x = ${b}·${c} = ${b * c}`, `x = ${b * c}/${a} = ${d} cm`],
          verification: `${a}/${b} = ${c}/${d} → ${a / b} = ${c / d} ✓`,
          whyWrong: ['Soma sem proporção', 'Multiplicou errado', 'Inverteu a razão', 'Usou segmento errado'],
          tip: 'Monte a proporção com segmentos correspondentes.'
        }
      };
    },
    () => {
      const shadow1 = Math.floor(rng() * 10) + 5;
      const personH = 1.5 + Math.floor(rng() * 5) / 10;
      const shadow2 = Math.floor(rng() * 3) + 1;
      const buildingH = shadow1 * personH / shadow2;
      const roundedH = Math.round(buildingH * 10) / 10;
      return {
        statement: `Uma pessoa de ${personH} m projeta sombra de ${shadow2} m. Um prédio projeta sombra de ${shadow1} m. Qual a altura do prédio?`,
        figureParams: { type: 'tales-shadow', building: null, shadow1, person: personH, shadow2, unit: 'm' },
        options: generateOptions(roundedH, [shadow1 - shadow2, personH + shadow1, roundedH + 2, roundedH - 1], 'm'),
        correctIndex: 0,
        answer: roundedH,
        explanation: {
          mainIdea: 'Raios solares formam triângulos semelhantes.',
          formula: `H/${shadow1} = ${personH}/${shadow2}`,
          formulaSpoken: `H sobre ${shadow1} é igual a ${personH} sobre ${shadow2}`,
          steps: [`H = ${shadow1} × ${personH}/${shadow2}`, `H = ${roundedH} m`],
          verification: `${roundedH}/${shadow1} = ${personH}/${shadow2} ✓`,
          whyWrong: ['Subtraiu valores', 'Usou média', 'Confundiu sombra com altura', 'Errou a proporção'],
          tip: 'A razão altura/sombra é constante.'
        }
      };
    }
  ];
  const variant = variants[Math.floor(rng() * variants.length)]();
  return {
    id: `gen-t-${seed}`,
    topic: 'tales',
    difficulty: 'medium',
    statement: variant.statement,
    figureDesc: 'Figura gerada parametricamente.',
    figureParams: variant.figureParams,
    options: variant.options,
    correctIndex: variant.correctIndex,
    explanation: variant.explanation,
  };
}

export function generateMetricsQuestion(seed: number): Question {
  const rng = mulberry32(seed);
  const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15]];
  const mult = Math.floor(rng() * 3) + 1;
  const triple = triples[Math.floor(rng() * triples.length)];
  const b = triple[0] * mult;
  const c = triple[1] * mult;
  const a = triple[2] * mult;
  const m = (b * b) / a;
  const n = (c * c) / a;
  const h = (b * c) / a;

  return {
    id: `gen-m-${seed}`,
    topic: 'metrics',
    difficulty: 'medium',
    statement: `Um triângulo retângulo tem catetos de ${b} cm e ${c} cm. Calcule a hipotenusa.`,
    figureDesc: `Triângulo retângulo com catetos ${b} e ${c}, hipotenusa = ?`,
    figureParams: { type: 'right-triangle', b, c, a: null, unit: 'cm' },
    options: generateOptions(a, [b + c, a + 1, a - 1, b * 2], 'cm'),
    correctIndex: 0,
    explanation: {
      mainIdea: 'Teorema de Pitágoras: a² = b² + c².',
      formula: `${a}² = ${b}² + ${c}²`,
      formulaSpoken: `${a} ao quadrado é igual a ${b} ao quadrado mais ${c} ao quadrado`,
      steps: [`a² = ${b}² + ${c}² = ${b * b} + ${c * c} = ${a * a}`, `a = √${a * a} = ${a} cm`],
      verification: `${a}² = ${a * a} = ${b * b} + ${c * c} ✓`,
      whyWrong: ['Somou catetos', 'Errou a raiz', 'Usou outra fórmula', 'Confundiu lados'],
      tip: 'Eleve ao quadrado, some, tire a raiz.'
    },
  };
}

function mulberry32(a: number): () => number {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function generateOptions(correct: number, wrongs: number[], unit: string): string[] {
  const options = [`${correct} ${unit}`];
  const used = new Set([correct]);
  for (const w of wrongs) {
    const rounded = Math.round(w * 10) / 10;
    if (!used.has(rounded) && rounded > 0) {
      options.push(`${rounded} ${unit}`);
      used.add(rounded);
    }
    if (options.length >= 5) break;
  }
  while (options.length < 5) {
    const fake = Math.round((correct + (Math.random() - 0.5) * correct) * 10) / 10;
    if (!used.has(fake) && fake > 0) {
      options.push(`${fake} ${unit}`);
      used.add(fake);
    }
  }
  // Shuffle
  const indices = options.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const shuffled = indices.map(i => options[i]);
  return shuffled;
}

// ---- PALETAS DE COR SEED ----
export const SEED_PALETTES: Record<string, string> = {
  ocean: '#006A6A',
  forest: '#386A20',
  sunset: '#B3261E',
  violet: '#6750A4',
  graphite: '#49454F',
  rose: '#9A406C',
};
