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
  return compareTitles(a, b);
}

function compareDates(a: Doc, b: Doc) {
  return a.CreatedAt.localeCompare(b.CreatedAt);
}

export class DocumentStore extends Store<Doc> {
  private lastSort: SortingCriteria | null = null;

  sortBy(criteria: SortingCriteria) {
    this.lastSort = criteria;
    this.update((docs) => {
      return [...docs].sort(this.getComparator(criteria));
    });
  }

  add(doc: Doc) {
    const docs = [...this.get(), doc];
    if (this.lastSort) {
      docs.sort(this.getComparator(this.lastSort));
    }
    this.set(docs);
  }

  private getComparator(criteria: SortingCriteria) {
    if (criteria === "title") return compareTitles;
    if (criteria === "version") return compareVersions;
    return compareDates;
  }
}
