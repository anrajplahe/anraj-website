export const books = {
  subtleArt: {
    title: "The Subtle Art of Not Giving a F*ck",
    authors: "Mark Manson",
  },
  courage: {
    title: "The Courage to Be Disliked",
    authors: "Ichiro Kishimi and Fumitake Koga",
  },
};

export type Lesson = {
  number: number;
  title: string;
  book: keyof typeof books;
  reflection: string[];
};

type Branch = {
  id: string;
  title: string;
  lessons: Lesson[];
};

// Example reflections inspired by the books, not quotations or personal accounts.
export const branches: Branch[] = [
  {
    id: "values",
    title: "Values",
    lessons: [
      {
        number: 1,
        title: "Choose what matters",
        book: "subtleArt",
        reflection: [
          "Time and attention are limited. Choosing a few values worth caring about can make it easier to decide which problems deserve energy and which can be allowed to pass.",
          "A useful starting point is to ask whether a choice reflects something meaningful, or simply the pressure to keep up with other people.",
        ],
      },
      {
        number: 2,
        title: "Stop seeking everyone's approval",
        book: "courage",
        reflection: [
          "Being considerate does not require being liked by everyone. Other people can disagree with a decision without that disagreement becoming a verdict on its worth.",
          "Feedback can still be valuable. The distinction is between listening thoughtfully and handing over every decision to the hope of approval.",
        ],
      },
    ],
  },
  {
    id: "responsibility",
    title: "Responsibility",
    lessons: [
      {
        number: 3,
        title: "Responsibility isn't blame",
        book: "subtleArt",
        reflection: [
          "A difficult situation may not be someone's fault, yet there can still be choices about what happens next. Taking responsibility for a response is different from accepting blame for the original event.",
          "That perspective can make room for a practical next step, including asking for support, without pretending that the situation was fair.",
        ],
      },
      {
        number: 4,
        title: "Know what's yours to carry",
        book: "courage",
        reflection: [
          "It can help to distinguish between personal choices and outcomes that belong to other people. Effort, honesty and boundaries are more directly within reach than another person's reaction.",
          "Offering support does not mean taking control of someone else's decisions. Clearer boundaries can leave more room for cooperation and mutual respect.",
        ],
      },
    ],
  },
  {
    id: "growth",
    title: "Growth",
    lessons: [
      {
        number: 5,
        title: "Failure is part of progress",
        book: "subtleArt",
        reflection: [
          "Trying something unfamiliar often includes mistakes. An unsuccessful attempt can reveal a gap in understanding or an approach worth changing, rather than prove a fixed limit on ability.",
          "Progress can begin with a small experiment: try, notice what happened, adjust and try again. Learning does not require every attempt to look impressive.",
        ],
      },
      {
        number: 6,
        title: "Choose your next direction",
        book: "courage",
        reflection: [
          "Past experiences can shape the present without deciding every future choice. A next step can be guided by the kind of contribution or relationship someone wants to build now.",
          "A new direction does not have to start with a dramatic reinvention. One deliberate action can be enough to begin testing a different way forward.",
        ],
      },
    ],
  },
];
