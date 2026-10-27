import { describe, expect, test } from "vitest";
import { cstdProfile } from "../content/profile";
import { cstdExperienceContract } from "../content/experience-contract";
import { getPersonalHomepageMetadata, getPersonalHomepageStructuredData } from "../metadata";
import { serializeCstdResume } from "./resume";

const schoolNames = /monash|莫纳什|university of sydney|悉尼大学|FIT\d{4}/i;
const doctoralStatements = /博士|博\s*0|\bph\.?\s*d\.?\b|doctoral|doctorate|year[\s-]*zero/i;

describe("public personal profile privacy", () => {
  test.each(["zh", "en"] as const)("keeps %s copy, search data, and resume free of school and residence details", (locale) => {
    const resume = serializeCstdResume(locale);
    const schema = getPersonalHomepageStructuredData(locale);
    const publicData = JSON.stringify([cstdProfile, resume, schema, cstdExperienceContract, getPersonalHomepageMetadata(locale)]);
    expect(publicData).not.toMatch(schoolNames);
    expect(publicData).not.toMatch(doctoralStatements);
    expect(resume.person).not.toHaveProperty("location");
    expect(resume.person).not.toHaveProperty("email");
    expect(resume.person).not.toHaveProperty("legalName");
    for (const entry of resume.education) {
      expect(entry).not.toHaveProperty("school");
      expect(entry).not.toHaveProperty("period");
    }
    const person = schema.find((entry) => entry["@type"] === "ProfilePage")?.mainEntity;
    expect(person).not.toHaveProperty("alumniOf");
    expect(person).not.toHaveProperty("homeLocation");
    expect(resume.person.title).toContain(locale === "zh" ? "数据科学" : "Data science");
    expect(resume.person.summary).toContain(locale === "zh" ? "数据科学" : "data science");
    expect(resume.education.map((entry) => entry.field)).toContain(locale === "zh" ? "数据科学" : "Data Science");
  });
});
