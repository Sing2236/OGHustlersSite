const rawCmsUrl = process.env.EXPO_PUBLIC_CMS_URL || process.env.CMS_URL || "";

export const cmsBaseUrl = rawCmsUrl.replace(/\/$/, "");
export const isCmsConfigured = cmsBaseUrl.length > 0 && /^https?:\/\//i.test(cmsBaseUrl);

function toQueryString(query) {
  if (!query || typeof query !== "object") return "";

  const pairs = [];
  Object.entries(query).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  });

  return pairs.length > 0 ? `?${pairs.join("&")}` : "";
}

async function fetchCmsJson(path, query) {
  if (!isCmsConfigured) {
    throw new Error("CMS URL is not configured");
  }

  const response = await fetch(`${cmsBaseUrl}${path}${toQueryString(query)}`);
  if (!response.ok) {
    throw new Error(`CMS request failed: ${response.status}`);
  }

  return response.json();
}

export async function loadCmsContent() {
  const [siteSettings, stores, products, news, pages] = await Promise.all([
    fetchCmsJson("/api/globals/site-settings"),
    fetchCmsJson("/api/stores", {
      "where[active][equals]": "true",
      sort: "displayOrder",
      limit: "100",
    }),
    fetchCmsJson("/api/products", {
      "where[active][equals]": "true",
      limit: "100",
      sort: "-updatedAt",
    }),
    fetchCmsJson("/api/news", {
      "where[_status][equals]": "published",
      limit: "6",
      sort: "-publishedAt",
    }),
    fetchCmsJson("/api/pages", {
      "where[slug][equals]": "home",
      "where[_status][equals]": "published",
      limit: "1",
    }),
  ]);

  return {
    siteSettings,
    stores: Array.isArray(stores?.docs) ? stores.docs : [],
    products: Array.isArray(products?.docs) ? products.docs : [],
    news: Array.isArray(news?.docs) ? news.docs : [],
    homePage: Array.isArray(pages?.docs) ? pages.docs[0] : null,
  };
}
