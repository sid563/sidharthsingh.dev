/**
 * Documents hosted elsewhere (Google Drive). Each one gets a clean path on
 * this site that redirects to the external file, so links in the resume and
 * elsewhere never change when a file is re-uploaded or moved.
 *
 * Fill in `url` with the Drive share link. An empty `url` hides the link and
 * creates no redirect.
 */
export type ExternalDocument = {
  id: string;
  /** Path on this site, e.g. /cv or /certificates/google-cloud-foundations */
  path: string;
  /** External URL the path redirects to. Empty string = not available yet. */
  url: string;
  title: string;
};

export const documents = {
  resume: {
    id: "resume",
    path: "/cv",
    url: "",
    title: "Original resume (PDF)",
  },
  certificates: [
    {
      id: "google-cloud-foundations",
      path: "/certificates/google-cloud-foundations",
      url: "",
      title: "Google Cloud Computing Foundations",
    },
    {
      id: "vmware-it-academy",
      path: "/certificates/vmware-it-academy",
      url: "",
      title: "VMware IT Academy",
    },
    {
      id: "rapidshyp-hackathon-2025",
      path: "/certificates/rapidshyp-hackathon-2025",
      url: "",
      title: "RapidShyp Hackathon 2025, first place",
    },
    {
      id: "customer-obsession-award",
      path: "/certificates/customer-obsession-award",
      url: "",
      title: "Customer Obsession Award",
    },
  ],
  education: [
    {
      id: "btech-degree",
      path: "/documents/btech-degree",
      url: "",
      title: "B.Tech degree certificate, VIT Vellore",
    },
  ],
} satisfies { resume: ExternalDocument; certificates: ExternalDocument[]; education: ExternalDocument[] };

const all: ExternalDocument[] = [documents.resume, ...documents.certificates, ...documents.education];

/** A document by id, or null when it has no URL yet. */
export function getDocument(id: string): ExternalDocument | null {
  const doc = all.find((d) => d.id === id);
  return doc && doc.url ? doc : null;
}

/** Consumed by next.config.ts. Only documents with a URL become redirects. */
export function documentRedirects() {
  return all
    .filter((d) => d.url)
    .map((d) => ({ source: d.path, destination: d.url, permanent: false }));
}
