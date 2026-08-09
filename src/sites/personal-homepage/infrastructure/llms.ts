import { cstdCaseStudies, getCaseStudyPath } from "../content/case-studies";
import { cstdTechnicalNotes, getTechnicalNotePath } from "../content/technical-notes";

export function serializeCstdLlms() {
  const cases = cstdCaseStudies
    .map((entry) => `- [${entry.title.en}](https://custard.top${getCaseStudyPath(entry, "en")}): ${entry.summary.en}`)
    .join("\n");
  const notes = cstdTechnicalNotes
    .map((entry) => `- [${entry.title.en}](https://custard.top${getTechnicalNotePath(entry, "en")}): ${entry.summary.en}`)
    .join("\n");

  return `# CSTD / Custard

> Personal engineering studio by Custard. Product systems, evidence-first AI, data engineering, quantitative research, and browser-native visual engineering.

## Canonical surfaces

- [Home](https://custard.top/)
- [English profile](https://custard.top/en)
- [Work archive](https://custard.top/en/work)
- [Technical notes](https://custard.top/en/notes)
- [Interactive labs](https://custard.top/en/lab)
- [Curated engineering topics](https://custard.top/en/topics)
- [Knowledge map](https://custard.top/en/map)

## Machine-readable evidence

- [Proof mesh](https://custard.top/proof.json)
- [Knowledge graph](https://custard.top/graph.json)
- [Studio status](https://custard.top/status.json)
- [Studio snapshot with provenance](https://custard.top/studio.json)
- [Release ledger](https://custard.top/releases.json)
- [Topic manifest](https://custard.top/topics.json)
- [JSON Feed](https://custard.top/feed.json?lang=en)

## Shipped cases

${cases}

## Technical notes

${notes}
`;
}
