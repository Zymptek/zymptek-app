import { sanityFetch } from "@/lib/sanity.config";
import { TermsData } from "@/lib/types/sanity/terms";

export async function getTermsOfServiceData(): Promise<TermsData> {
    const query = `*[_type == "termsOfService"][0] {
    _id,
    _updatedAt,
    sections[] {
      _key,
      title,
      content,
      subsections[] {
        _key,
        title,
        content
      },
      items
    }
  }`;

  const data = await sanityFetch<TermsData>({
    query,
    tags: ["termsOfService"],
  });
  return data;
}