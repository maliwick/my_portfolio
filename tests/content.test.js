import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  validateContent,
  publicItems,
  safeUrl,
  resolveRoute,
} from "../src/lib.js";
const content = JSON.parse(
  fs.readFileSync(new URL("../public/data/content.json", import.meta.url)),
);
test("public search excludes drafts and searches tools", () => {
  const data = structuredClone(content);
  data.projects.push({ ...data.projects[0], id: "hidden", status: "draft" });
  assert.equal(publicItems(data.projects).length, content.projects.length);
  assert.equal(publicItems(data.projects, "flutter")[0].id, "roam-ride");
  assert.equal(publicItems(data.projects, "no such topic").length, 0);
});
test("import validation rejects unsafe links and duplicate IDs", () => {
  const unsafe = structuredClone(content);
  unsafe.badges[0].url = "javascript:alert(1)";
  assert.throws(() => validateContent(unsafe), /http or https/);
  const duplicate = structuredClone(content);
  duplicate.projects.push({ ...duplicate.projects[0] });
  assert.throws(() => validateContent(duplicate), /duplicate/);
  assert.equal(
    safeUrl("https://github.com/maliwick"),
    "https://github.com/maliwick",
  );
  assert.equal(safeUrl("data:text/html,bad"), null);
  assert.equal(validateContent(content), content);
});
test("existing URLs and direct work-detail queries resolve", () => {
  for (const [path, page] of [
    ["/", "home"],
    ["/index.html", "home"],
    ["/projects.html", "projects"],
    ["/labs.html", "labs"],
    ["/editor.html", "editor"],
    ["/business/index.html", "business"],
    ["/blog.html", "blog"],
    ["/blog-zero-trust.html", "zero-trust"],
    ["/blog-password-security.html", "password-security"],
    ["/blog-ransomware.html", "ransomware"],
  ])
    assert.equal(resolveRoute(path).page, page);
  const detail = resolveRoute("/work.html", "?type=labs&id=sample-smb");
  assert.equal(detail.params.get("id"), "sample-smb");
  assert.equal(resolveRoute("/missing").page, "not-found");
});
