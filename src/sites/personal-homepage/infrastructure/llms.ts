import { cstdCaseStudies, getCaseStudyPath } from "../content/case-studies";
import { cstdTechnicalNotes, getTechnicalNotePath } from "../content/technical-notes";
import { createCstdUrl } from "./origin";

export function serializeCstdLlms() {
  const cases = cstdCaseStudies
    .map((entry) => `- [${entry.title.en}](${createCstdUrl(getCaseStudyPath(entry, "en"))}): ${entry.summary.en}`)
    .join("\n");
  const notes = cstdTechnicalNotes
    .map((entry) => `- [${entry.title.en}](${createCstdUrl(getTechnicalNotePath(entry, "en"))}): ${entry.summary.en}`)
    .join("\n");

  return `# CSTD / Custard

> Personal engineering studio by Custard. Product systems, evidence-first AI, data engineering, quantitative research, and browser-native visual engineering.

## Canonical surfaces

- [Home](${createCstdUrl("/")})
- [English profile](${createCstdUrl("/en")})
- [Work archive](${createCstdUrl("/en/work")})
- [Technical notes](${createCstdUrl("/en/notes")})
- [Interactive labs](${createCstdUrl("/en/lab")})
- [Curated engineering topics](${createCstdUrl("/en/topics")})
- [Knowledge map](${createCstdUrl("/en/map")})

## Machine-readable evidence

- [Proof mesh](${createCstdUrl("/proof.json")})
- [Knowledge graph](${createCstdUrl("/graph.json")})
- [Studio status](${createCstdUrl("/status.json")})
- [Studio snapshot with provenance](${createCstdUrl("/studio.json")})
- [Engineering observatory](${createCstdUrl("/observatory.json")})
- [Content health](${createCstdUrl("/content-health.json")})
- [Release ledger](${createCstdUrl("/releases.json")})
- [Topic manifest](${createCstdUrl("/topics.json")})
- [JSON Feed](${createCstdUrl("/feed.json?lang=en")})

## Shipped cases

${cases}

## Technical notes

${notes}
`;
}
