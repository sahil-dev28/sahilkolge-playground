import { PROJECTS, type Project, type ProjectId } from "@/data";

export interface ProjectEntry {
  name: string;
  description: string;
  year: string;
  group: "app" | "practice";
  liveUrl: string;
  repoUrl: string;
  caseStudyUrl?: string;
  stack: string[];
  demoId?: ProjectId;
}

// Featured projects reuse the home page data so the two pages can't drift.
function featured(p: Project): ProjectEntry {
  return {
    name: p.title,
    description: p.oneLine,
    year: p.year,
    group: "app",
    liveUrl: p.liveUrl,
    repoUrl: p.repoUrl,
    caseStudyUrl: p.caseStudyUrl,
    stack: p.stack,
  };
}

const JS_CSS = ["JavaScript", "CSS"];
const GH = "https://github.com/sahil-dev28/";

function practice(name: string, description: string, liveUrl: string, repo: string): ProjectEntry {
  return { name, description, year: "2025", group: "practice", liveUrl, repoUrl: GH + repo, stack: JS_CSS };
}

export const ALL_PROJECTS: ProjectEntry[] = [
  ...PROJECTS.map(featured),
  {
    name: "Nova AI Productivity",
    description:
      "Thirteen-section marketing site for a fictional AI productivity platform, with light and dark themes and a hand-written motion layer.",
    year: "2026",
    group: "app",
    liveUrl: "https://nova-ai-productivity-sahildev.vercel.app",
    repoUrl: GH + "nova-ai-productivity-",
    caseStudyUrl:
      "https://app.notion.com/p/Nova-AI-Productivity-Assignment-Submission-3d731c4f75a080a2b6b0f09e40fe60ae",
    stack: ["Next.js", "React", "TypeScript", "Zod", "Tailwind CSS"],
  },
  {
    name: "Elementum Figma Clone",
    description: "Pixel-perfect Figma-to-code build with a responsive UI and a clear component structure.",
    year: "2026",
    group: "app",
    liveUrl: "https://elementum-figma-clone-web-one.vercel.app",
    repoUrl: GH + "elementum-figma-clone",
    stack: ["CSS", "Tailwind CSS"],
  },
  practice("Movie Seat Booking", "Visual seat map with real-time seat selection and price calculation.", "https://movie-seat-booking-snowy.vercel.app", "Movie-Seat-Booking-"),
  practice("Meal Finder", "Search meals by name or ingredient using a public food API.", "https://meal-finder-ya95.vercel.app", "Meal_finder"),
  practice("Typing Game", "Typing speed test that tracks WPM and accuracy as you type.", "https://typing-game-jade-seven.vercel.app", "Typing_game"),
  practice("Speech Text Reader", "Converts speech to text in real time.", "https://speech-text-reader-silk.vercel.app", "Speech_text_reader"),
  practice("Lyrics Search", "Finds song lyrics by artist and title using a public lyrics API.", "https://lyrics-search-eight.vercel.app", "Lyrics_search"),
  practice("Infinite Scroll", "Loads more content as you scroll.", "https://infinite-scroll-sigma-one.vercel.app", "Infinite_scroll"),
  practice("Hangman Game", "Classic word-guessing game with win and lose states.", "https://hangman-game-rust-two.vercel.app", "Hangman_game"),
  practice("Expense Tracker", "Tracks income and expenses.", "https://expense-tracker-zeta-liard-84.vercel.app", "Expense_tracker"),
  practice("Currency Rate", "Shows live currency exchange rates.", "https://currency-rate-tau.vercel.app", "Currency-rate"),
  practice("Breakout Game", "Breakout arcade game on HTML5 Canvas with paddle physics and brick collision.", "https://breakout-game-nine-beta.vercel.app", "Breakout-game"),
  practice("Calculate Wealth", "Calculates and tracks personal wealth.", "https://calculate-wealth.vercel.app", "Calculate-wealth-"),
  practice("Redux Cart", "Shopping cart with Redux state management.", "https://redux-cart-kappa-hazel.vercel.app", "Redux-cart"),
  practice("Place Picker", "Browse places and save favourites.", "https://place-picker-ashen.vercel.app", "Place-picker"),
  practice("Tic Tac Toe Game", "Two-player game with win detection and turn tracking.", "https://tic-tac-toe-ten-eta-31.vercel.app", "Tic-tac-toe"),
  practice("Final Countdown Game", "Stop the countdown timer at the perfect moment.", "https://final-countdown-ten.vercel.app", "Final-countdown"),
  practice("React Form Validation", "Real-time input validation and error handling with controlled components.", "https://react-form-two-alpha.vercel.app", "React-form"),
];
