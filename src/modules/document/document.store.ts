import { Store } from "@/lib/store/store";
import type { Doc, SortingCriteria } from "./types";

function compareTitles(a: Doc, b: Doc) {
  return a.Title.localeCompare(b.Title);
}

function compareVersions(a: Doc, b: Doc) {
  const pa = a.Version.split(".").map(Number);
  const pb = b.Version.split(".").map(Number);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;
    if (na < nb) return -1;
    if (na > nb) return 1;
  }
  // If same Version, sort by Title
  return compareTitles(a, b);
}

function compareDates(a: Doc, b: Doc) {
  // simple (but not 100% precise) date comparison
  return a.CreatedAt.localeCompare(b.CreatedAt);
}

export class DocumentStore extends Store<Doc> {
  sortBy(criteria: SortingCriteria) {
    this.update((docs) => {
      return [...docs].sort((a, b) => {
        if (criteria === "title") {
          return compareTitles(a, b);
        } else if (criteria === "version") {
          return compareVersions(a, b);
        } else {
          return compareDates(a, b);
        }
      });
    });
  }
}
