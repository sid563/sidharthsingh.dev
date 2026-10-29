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
    url: "https://drive.google.com/file/d/1lxYVZ_XmUn-r1ShGrwizdrWudRtMcJ9N/view",
    title: "Original resume (PDF)",
  },
  certificates: [
    {
      id: "google-cloud-foundations",
      path: "/certificates/google-cloud-foundations",
      url: "https://drive.google.com/file/d/1e48TIMJJ5ZNuT1Ch9JlHiu7L613b8OST/view",
      title: "Google Cloud Computing Foundations",
    },
    {
      id: "vmware-spring-boot",
      path: "/certificates/vmware-spring-boot",
      url: "https://drive.google.com/file/d/1PN8_cFmjAe3tXmYCb6J8CJr8Oi7snLRf/view",
      title: "Modern Application Development with Java Spring Boot",
    },
    {
      id: "vmware-it-academy",
      path: "/certificates/vmware-it-academy",
      url: "https://drive.google.com/file/d/1hE49fFzCrFzfG56hlFso2IGpr5gspo2c/view",
      title: "Core Technical Skills (Docker, Kubernetes, MongoDB)",
    },
    {
      id: "rapidshyp-hackathon-2025",
      path: "/certificates/rapidshyp-hackathon-2025",
      url: "https://drive.google.com/file/d/1xPMoOoSUebS4uNe6Y7NgWg20hYTcISa8/view",
      title: "RapidShyp Hackathon 2025, first place",
    },
    {
      id: "customer-obsession-award",
      path: "/certificates/customer-obsession-award",
      url: "https://drive.google.com/file/d/1dhPnkJhw36f6NXnTLRTbDllcaM4ThVXf/view",
      title: "Customer Obsession Award",
    },
  ],
  education: [
    {
      id: "btech-degree",
      path: "/documents/btech-degree",
      url: "https://drive.google.com/file/d/1LScuTqjR7rOxmLPlHTAWZ3vJTYc1CKqo/view",
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
