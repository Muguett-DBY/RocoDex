import { cstdCaseStudies, getCaseStudyPath } from "../content/case-studies";
import { cstdTechnicalNotes, getTechnicalNotePath } from "../content/technical-notes";

export function serializeCstdLlms() {
  const cases = cstdCaseStudies.map((entry) => `- [${entry.title.en}](https://custard.top${getCaseStudyPath(entry, "en")}): ${entry.summary.en}`).join("\n");
  const notes = cstdTechnicalNotes.map((entry) => `- [${entry.title.en}](https://custard.top${getTechnicalNotePath(entry, "en")}): ${entry.summary.en}`).join("\n");
  return `# CSTD / Custard\n\n> Personal engineering studio by Custard. Product systems, evidence-first AI, data engineering, quantitative research, and browser-native visual engineering.\n\n## Canonical surfaces\n\n- [Home](https://custard.top/)\n- [English profile](https://custard.top/en)\n- [Work archive](https://custard.top/en/work)\n- [Technical notes](https://custard.top/en/notes)\n- [Interactive labs](https://custard.top/en/lab)\n- [Knowledge map](https://custard.top/en/map)\n\n## Machine-readable evidence\n\n- [Proof mesh](https://custard.top/proof.json)\n- [Knowledge graph](https://custard.top/graph.json)\n- [Studio status](https://custard.top/status.json)\n- [JSON Feed](https://custard.top/feed.json?lang=en)\n\n## Shipped cases\n\n${cases}\n\n## Technical notes\n\n${notes}\n`;
}
