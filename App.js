import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { ImageBackground, Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { isSupabaseConfigured, supabase } from "./src/lib/supabase";
import { isCmsConfigured, loadCmsContent } from "./src/lib/cms";

const DEFAULT_BRAND = {
  name: "OG Hustlers Vape & Smoke",
  tagline: "Premium vape hardware, lab-tested THCA, and curated smoke essentials",
  supportEmail: "support@oghustlers.com",
  supportPhone: "+1 (555) 010-2424",
  promoBarText: "Adult 21+ Retail | Curated Vape and Smoke Inventory | Daily Store Support",
  heroBody:
    "Retail-focused service, polished presentation, and fast support across every location. Built for customers who expect quality and consistency.",
};

const DEFAULT_STORES = [
  {
    id: "gso-01",
    name: "OG Hustlers - Spring Garden",
    address: "2500 Spring Garden St, Greensboro, NC 27403, United States",
    phone: "+1 (314) 555-0110",
    hours: "Mon-Sat 10:00 AM-10:00 PM, Sun 11:00 AM-8:00 PM",
    mapsUrl: "https://maps.google.com/?q=2500+Spring+Garden+St+Greensboro+NC+27403+United+States",
  },
  {
    id: "gso-02",
    name: "OG Hustlers - East Bessemer A",
    address: "1700 E Bessemer Ave suit B, Greensboro, NC 27405, United States",
    phone: "+1 (314) 555-0111",
    hours: "Daily 9:00 AM-11:00 PM",
    mapsUrl: "https://maps.google.com/?q=1700+E+Bessemer+Ave+suit+B+Greensboro+NC+27405+United+States",
  },
  {
    id: "gso-03",
    name: "OG Hustlers - East Bessemer B",
    address: "2400 E Bessemer Ave, Greensboro, NC 27405, USA",
    phone: "+1 (314) 555-0112",
    hours: "Daily 10:00 AM-10:00 PM",
    mapsUrl: "https://maps.google.com/?q=2400+E+Bessemer+Ave+Greensboro+NC+27405+USA",
  },
  {
    id: "gso-04",
    name: "OG Hustlers - East Market",
    address: "2204 E Market St, Greensboro, NC 27401, USA",
    phone: "+1 (314) 555-0113",
    hours: "Daily 10:00 AM-10:00 PM",
    mapsUrl: "https://maps.google.com/?q=2204+E+Market+St+Greensboro+NC+27401+USA",
  },
];

const DEFAULT_PRODUCTS = [
  { id: "p-001", name: "Apex Disposable 5G", category: "Vape", price: "$24.99" },
  { id: "p-002", name: "Ceramic Cartridge 1G", category: "Hardware", price: "$14.99" },
  { id: "p-003", name: "THCA Pre-Roll 2 Pack", category: "THCA", price: "$19.99" },
  { id: "p-004", name: "Premium Glass Rig", category: "Glass", price: "$69.99" },
  { id: "p-005", name: "Nicotine Salt 30mL", category: "E-Liquid", price: "$17.99" },
  { id: "p-006", name: "Concentrate Tool Kit", category: "Accessories", price: "$27.99" },
];

const DEFAULT_NEWS = [
  {
    id: "n-001",
    title: "Weekend Flavor Drop",
    excerpt: "New premium flavors are now available in all OG Hustlers locations while supplies last.",
    publishedAt: "2026-02-15T10:00:00.000Z",
  },
  {
    id: "n-002",
    title: "Expanded Device Selection",
    excerpt: "We expanded our premium disposable lineup with more battery life and better flavor consistency.",
    publishedAt: "2026-02-10T10:00:00.000Z",
  },
];

const FEATURED_COLLECTIONS = [
  {
    id: "c-01",
    title: "Signature Vape Wall",
    copy: "Top hardware and disposable systems selected for daily reliability and consistent flavor output.",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "c-02",
    title: "Lab-Tested THCA",
    copy: "Batch-forward products curated with verified sourcing and transparent shelf guidance.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "c-03",
    title: "Pro Accessories",
    copy: "Glass, wraps, butane, and cleaning tools organized for fast pickup and better basket value.",
    image: "https://images.unsplash.com/photo-1554435493-93422e8f2385?auto=format&fit=crop&w=1600&q=80",
  },
];

const SERVICE_STANDARDS = [
  {
    id: "s-01",
    title: "Merchandising Discipline",
    copy: "Our layout is built for fast product discovery by category, potency profile, and device compatibility.",
  },
  {
    id: "s-02",
    title: "Authenticity Checks",
    copy: "Every premium line is monitored for packaging integrity and trusted distributor sourcing.",
  },
  {
    id: "s-03",
    title: "Concierge Support",
    copy: "Staff are trained to recommend practical setups based on use case and preferred experience level.",
  },
];

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "locations", label: "Locations" },
  { id: "catalog", label: "Catalog" },
  { id: "news", label: "News" },
  { id: "contact", label: "Contact" },
];

const DEFAULT_HOME_PAGE = {
  summary:
    "OG Hustlers operates with a category-first floor plan, faster in-store support, and high-turn product lines for consistent availability.",
  heroHeadline: "",
  heroCopy: "",
};

const CONTACT_TABLE =
  process.env.EXPO_PUBLIC_SUPABASE_CONTACT_TABLE ||
  process.env.SUPABASE_CONTACT_TABLE ||
  "contact_info";
const STORES_TABLE =
  process.env.EXPO_PUBLIC_SUPABASE_STORES_TABLE ||
  process.env.SUPABASE_STORES_TABLE ||
  "stores";
const PRODUCTS_TABLE =
  process.env.EXPO_PUBLIC_SUPABASE_PRODUCTS_TABLE ||
  process.env.SUPABASE_PRODUCTS_TABLE ||
  "products";
const MAX_STORES = 3;

function openUrl(url) {
  Linking.openURL(url).catch(() => {
    // Keep UX stable if browser or dialer is unavailable.
  });
}

function normalizePrice(price) {
  if (typeof price === "number") {
    return `$${price.toFixed(2)}`;
  }
  return String(price ?? "");
}

function toTel(phone) {
  return `tel:${String(phone ?? "").replace(/[^\d+]/g, "")}`;
}

function inferCategory(name) {
  const safeName = String(name || "").toLowerCase();
  if (safeName.includes("thca")) return "THCA";
  if (safeName.includes("cartridge") || safeName.includes("disposable") || safeName.includes("pod")) return "Vape";
  if (safeName.includes("liquid") || safeName.includes("salt")) return "E-Liquid";
  if (safeName.includes("glass") || safeName.includes("rig") || safeName.includes("pipe")) return "Glass";
  if (safeName.includes("tool") || safeName.includes("paper") || safeName.includes("wrap")) return "Accessories";
  return "Featured";
}

function formatDateLabel(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Unscheduled";
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function TabButton({ active, label, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.tabButton, active && styles.tabButtonActive]}>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function OverviewTab({ stores, homePage }) {
  return (
    <View style={styles.sectionWrap}>
      <View style={styles.sectionIntroRow}>
        <View style={styles.sectionIntroCard}>
          <Text style={styles.sectionTag}>Retail Profile</Text>
          <Text style={styles.sectionHeading}>Built for professional vape retail</Text>
          <Text style={styles.sectionSubheading}>{homePage.summary || DEFAULT_HOME_PAGE.summary}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryEyebrow}>Coverage</Text>
          <Text style={styles.summaryBig}>{stores.length} Active Locations</Text>
          <Text style={styles.summaryCopy}>Serving Greensboro with daily operations and pickup-friendly service windows.</Text>
        </View>
      </View>

      <Text style={styles.sectionSubTitle}>Featured Collections</Text>
      <View style={styles.collectionGrid}>
        {FEATURED_COLLECTIONS.map((item) => (
          <ImageBackground key={item.id} source={{ uri: item.image }} style={styles.collectionCard} imageStyle={styles.collectionCardImage}>
            <View style={styles.collectionOverlay} />
            <View style={styles.collectionContent}>
              <Text style={styles.collectionTitle}>{item.title}</Text>
              <Text style={styles.collectionCopy}>{item.copy}</Text>
            </View>
          </ImageBackground>
        ))}
      </View>

      <Text style={styles.sectionSubTitle}>Service Standards</Text>
      <View style={styles.standardsGrid}>
        {SERVICE_STANDARDS.map((item) => (
          <View key={item.id} style={styles.standardCard}>
            <Text style={styles.standardTitle}>{item.title}</Text>
            <Text style={styles.standardCopy}>{item.copy}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function LocationsTab({ stores }) {
  return (
    <View style={styles.sectionWrap}>
      <Text style={styles.sectionHeading}>Store Locator</Text>
      <Text style={styles.sectionSubheading}>Open in maps or call each branch directly for live availability.</Text>
      {stores.map((store) => (
        <View key={store.id} style={styles.locationCard}>
          <Text style={styles.locationTitle}>{store.name}</Text>
          <Text style={styles.locationCopy}>{store.address}</Text>
          <Text style={styles.locationMeta}>Phone: {store.phone}</Text>
          <Text style={styles.locationMeta}>Hours: {store.hours}</Text>
          <View style={styles.locationActions}>
            <Pressable onPress={() => openUrl(store.mapsUrl)} style={[styles.locationBtn, styles.locationBtnOutline]}>
              <Text style={[styles.locationBtnText, styles.locationBtnTextOutline]}>Directions</Text>
            </Pressable>
            <Pressable onPress={() => openUrl(toTel(store.phone))} style={[styles.locationBtn, styles.locationBtnSolid]}>
              <Text style={[styles.locationBtnText, styles.locationBtnTextSolid]}>Call Store</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}

function CatalogTab({ products }) {
  return (
    <View style={styles.sectionWrap}>
      <Text style={styles.sectionHeading}>Featured Catalog</Text>
      <Text style={styles.sectionSubheading}>Core products and reference pricing for top-selling categories.</Text>
      {products.map((item) => (
        <View key={item.id} style={styles.productCard}>
          <View style={styles.productTopRow}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
          </View>
          <View style={styles.productBottomRow}>
            <Text style={styles.productCategory}>{item.category}</Text>
            <Text style={styles.productNote}>Inventory refreshed throughout the day.</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function NewsTab({ newsItems }) {
  return (
    <View style={styles.sectionWrap}>
      <Text style={styles.sectionHeading}>Store News</Text>
      <Text style={styles.sectionSubheading}>Owner-updated announcements from Payload CMS.</Text>
      {newsItems.map((item) => (
        <View key={item.id} style={styles.newsCard}>
          <Text style={styles.newsDate}>{formatDateLabel(item.publishedAt)}</Text>
          <Text style={styles.newsTitle}>{item.title}</Text>
          <Text style={styles.newsExcerpt}>{item.excerpt}</Text>
        </View>
      ))}
      {newsItems.length === 0 && <Text style={styles.emptyState}>No published news posts yet.</Text>}
    </View>
  );
}

function ContactTab({ brand }) {
  return (
    <View style={styles.sectionWrap}>
      <Text style={styles.sectionHeading}>Contact & Customer Care</Text>
      <Text style={styles.sectionSubheading}>Professional support for product questions, pickup prep, and vendor inquiries.</Text>

      <View style={styles.contactGrid}>
        <View style={styles.contactCard}>
          <Text style={styles.contactLabel}>Support Line</Text>
          <Pressable onPress={() => openUrl(toTel(brand.supportPhone))}>
            <Text style={styles.contactValue}>{brand.supportPhone}</Text>
          </Pressable>
          <Text style={styles.contactHint}>Live during store operating hours.</Text>
        </View>
        <View style={styles.contactCard}>
          <Text style={styles.contactLabel}>Email</Text>
          <Pressable onPress={() => openUrl(`mailto:${brand.supportEmail}`)}>
            <Text style={styles.contactValue}>{brand.supportEmail}</Text>
          </Pressable>
          <Text style={styles.contactHint}>For wholesale and partnerships.</Text>
        </View>
      </View>

      <View style={styles.complianceCard}>
        <Text style={styles.complianceTitle}>Compliance & Retail Policy</Text>
        <Text style={styles.complianceCopy}>Age-restricted products are sold only to adults 21+ with valid identification.</Text>
        <Text style={styles.complianceCopy}>All product claims are manufacturer-provided and not medical advice.</Text>
      </View>
    </View>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [brand, setBrand] = useState(DEFAULT_BRAND);
  const [stores, setStores] = useState(DEFAULT_STORES.slice(0, MAX_STORES));
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [newsItems, setNewsItems] = useState(DEFAULT_NEWS);
  const [homePage, setHomePage] = useState(DEFAULT_HOME_PAGE);
  const [status, setStatus] = useState("Using local fallback data");

  useEffect(() => {
    let mounted = true;

    async function loadSupabaseData() {
      if (!isSupabaseConfigured || !supabase) {
        setStatus("Using local fallback data. Add Payload CMS or Supabase .env values to enable live data.");
        return;
      }

      const [contactResult, storeResult, productResult] = await Promise.all([
        supabase.from(CONTACT_TABLE).select("name, tagline, support_email, support_phone").limit(1).maybeSingle(),
        supabase.from(STORES_TABLE).select("id, name, address, phone, hours, maps_url"),
        supabase.from(PRODUCTS_TABLE).select("id, name, price"),
      ]);

      if (!mounted) return;

      if (contactResult.error || storeResult.error || productResult.error) {
        setStatus("Supabase query failed. Using local fallback data.");
        return;
      }

      if (contactResult.data) {
        setBrand((current) => ({
          ...current,
          name: contactResult.data.name || DEFAULT_BRAND.name,
          tagline: contactResult.data.tagline || DEFAULT_BRAND.tagline,
          supportEmail: contactResult.data.support_email || DEFAULT_BRAND.supportEmail,
          supportPhone: contactResult.data.support_phone || DEFAULT_BRAND.supportPhone,
        }));
      }

      if (Array.isArray(storeResult.data) && storeResult.data.length > 0) {
        setStores(
          storeResult.data.slice(0, MAX_STORES).map((store, index) => ({
            id: String(store.id || `store-${index + 1}`),
            name: store.name || "OG Hustlers Store",
            address: store.address || "Address unavailable",
            phone: store.phone || "Phone unavailable",
            hours: store.hours || "Hours unavailable",
            mapsUrl: store.maps_url || "https://maps.google.com",
          }))
        );
      }

      if (Array.isArray(productResult.data) && productResult.data.length > 0) {
        setProducts(
          productResult.data.map((product, index) => ({
            id: String(product.id || `product-${index + 1}`),
            name: product.name || "Product",
            category: inferCategory(product.name),
            price: normalizePrice(product.price || "N/A"),
          }))
        );
      }

      setStatus("Live data loaded from Supabase");
    }

    async function loadData() {
      if (isCmsConfigured) {
        try {
          const cmsData = await loadCmsContent();
          if (!mounted) return;

          if (cmsData.siteSettings) {
            setBrand((current) => ({
              ...current,
              name: cmsData.siteSettings.brandName || current.name,
              tagline: cmsData.siteSettings.tagline || current.tagline,
              supportEmail: cmsData.siteSettings.supportEmail || current.supportEmail,
              supportPhone: cmsData.siteSettings.supportPhone || current.supportPhone,
              promoBarText: cmsData.siteSettings.promoBarText || current.promoBarText,
              heroBody: cmsData.siteSettings.heroBody || current.heroBody,
            }));
          }

          if (Array.isArray(cmsData.stores) && cmsData.stores.length > 0) {
            setStores(
              cmsData.stores.slice(0, MAX_STORES).map((store, index) => ({
                id: String(store.id || `store-${index + 1}`),
                name: store.name || "OG Hustlers Store",
                address: store.address || "Address unavailable",
                phone: store.phone || "Phone unavailable",
                hours: store.hours || "Hours unavailable",
                mapsUrl: store.mapsUrl || "https://maps.google.com",
              }))
            );
          }

          if (Array.isArray(cmsData.products) && cmsData.products.length > 0) {
            setProducts(
              cmsData.products.map((product, index) => ({
                id: String(product.id || `product-${index + 1}`),
                name: product.name || "Product",
                category: product.category || inferCategory(product.name),
                price: normalizePrice(product.price || "N/A"),
              }))
            );
          }

          if (Array.isArray(cmsData.news)) {
            setNewsItems(
              cmsData.news.map((post, index) => ({
                id: String(post.id || `news-${index + 1}`),
                title: post.title || "News Update",
                excerpt: post.excerpt || "No summary provided.",
                publishedAt: post.publishedAt || new Date().toISOString(),
              }))
            );
          }

          if (cmsData.homePage) {
            setHomePage({
              summary: cmsData.homePage.summary || DEFAULT_HOME_PAGE.summary,
              heroHeadline: cmsData.homePage.heroHeadline || "",
              heroCopy: cmsData.homePage.heroCopy || "",
            });
          }

          setStatus("Live data loaded from Payload CMS (Supabase-backed)");
          return;
        } catch {
          if (mounted) {
            setStatus("Payload CMS request failed. Falling back to Supabase/local data.");
          }
        }
      }

      await loadSupabaseData();
    }

    loadData().catch(() => {
      if (mounted) {
        setStatus("Data request failed. Using local fallback data.");
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const content = useMemo(() => {
    if (activeTab === "overview") return <OverviewTab stores={stores} homePage={homePage} />;
    if (activeTab === "locations") return <LocationsTab stores={stores} />;
    if (activeTab === "catalog") return <CatalogTab products={products} />;
    if (activeTab === "news") return <NewsTab newsItems={newsItems} />;
    return <ContactTab brand={brand} />;
  }, [activeTab, brand, homePage, newsItems, products, stores]);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={styles.backgroundEffects}>
        <View style={styles.ambientOrbTop} />
        <View style={styles.ambientOrbMid} />
        <View style={styles.ambientOrbBottom} />
      </View>

      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.pageShell}>
          <View style={styles.promoBar}>
            <Text style={styles.promoText}>{brand.promoBarText}</Text>
          </View>

          <ImageBackground
            source={{ uri: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=1800&q=80" }}
            style={styles.hero}
            imageStyle={styles.heroImage}
          >
            <View style={styles.heroOverlay}>
              <Text style={styles.heroOverline}>Professional Vape Shop Experience</Text>
              <Text style={styles.heroTitle}>{brand.name}</Text>
              <Text style={styles.heroTagline}>{homePage.heroHeadline || brand.tagline}</Text>
              <Text style={styles.heroBody}>{homePage.heroCopy || brand.heroBody}</Text>
              <View style={styles.heroActions}>
                <Pressable onPress={() => setActiveTab("locations")} style={[styles.heroBtn, styles.heroBtnSolid]}>
                  <Text style={[styles.heroBtnText, styles.heroBtnTextSolid]}>Find A Store</Text>
                </Pressable>
                <Pressable onPress={() => openUrl(toTel(brand.supportPhone))} style={[styles.heroBtn, styles.heroBtnOutline]}>
                  <Text style={[styles.heroBtnText, styles.heroBtnTextOutline]}>Call Concierge</Text>
                </Pressable>
              </View>
            </View>
          </ImageBackground>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{stores.length}</Text>
              <Text style={styles.metricLabel}>Store Locations</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>21+</Text>
              <Text style={styles.metricLabel}>Age Verification</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>Daily</Text>
              <Text style={styles.metricLabel}>Inventory Rotation</Text>
            </View>
          </View>

          <View style={styles.tabBar}>
            {TABS.map((tab) => (
              <TabButton key={tab.id} label={tab.label} active={activeTab === tab.id} onPress={() => setActiveTab(tab.id)} />
            ))}
          </View>

          <Text style={styles.statusText}>{status}</Text>
          {content}

          <View style={styles.footer}>
            <Text style={styles.footerTitle}>OG Hustlers Corporate Retail Standard</Text>
            <Text style={styles.footerCopy}>
              Professional vape retail with a strong focus on product quality, customer care, and clean in-store execution.
            </Text>
            <Text style={styles.footerTiny}>Copyright {new Date().getFullYear()} OG Hustlers. All rights reserved.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#eef2f4",
  },
  backgroundEffects: {
    ...StyleSheet.absoluteFillObject,
  },
  ambientOrbTop: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(19, 122, 127, 0.22)",
  },
  ambientOrbMid: {
    position: "absolute",
    top: 260,
    left: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(2, 64, 92, 0.14)",
  },
  ambientOrbBottom: {
    position: "absolute",
    bottom: -140,
    right: -70,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(180, 141, 77, 0.2)",
  },
  page: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    paddingBottom: 40,
  },
  pageShell: {
    width: "100%",
    maxWidth: 1120,
    alignSelf: "center",
    gap: 14,
  },
  promoBar: {
    backgroundColor: "#0c3c53",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  promoText: {
    color: "#d8edf2",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  hero: {
    minHeight: 320,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#183448",
  },
  heroImage: {
    borderRadius: 20,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(6, 23, 38, 0.66)",
    paddingVertical: 26,
    paddingHorizontal: 22,
    justifyContent: "center",
    gap: 10,
  },
  heroOverline: {
    color: "#c8d9dd",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 36,
    lineHeight: 41,
    fontWeight: "900",
    maxWidth: 740,
  },
  heroTagline: {
    color: "#d7e7eb",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    maxWidth: 760,
  },
  heroBody: {
    color: "#d7e7eb",
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 760,
  },
  heroActions: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  heroBtn: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  heroBtnSolid: {
    backgroundColor: "#c58c49",
    borderColor: "#c58c49",
  },
  heroBtnOutline: {
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderColor: "#d3e5ea",
  },
  heroBtnText: {
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: "800",
    letterSpacing: 0.7,
  },
  heroBtnTextSolid: {
    color: "#1c2833",
  },
  heroBtnTextOutline: {
    color: "#f4fbff",
  },
  metricsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricCard: {
    flexGrow: 1,
    minWidth: 130,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d2dde2",
    paddingVertical: 14,
    paddingHorizontal: 14,
    shadowColor: "#0f1b2b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  metricValue: {
    color: "#0d3448",
    fontSize: 24,
    fontWeight: "900",
  },
  metricLabel: {
    color: "#4f6672",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  tabBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tabButton: {
    flexGrow: 1,
    minWidth: 130,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#b7c8cf",
    backgroundColor: "rgba(255, 255, 255, 0.86)",
    paddingVertical: 11,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  tabButtonActive: {
    borderColor: "#0d526f",
    backgroundColor: "#0d526f",
  },
  tabLabel: {
    color: "#205169",
    fontSize: 13,
    fontWeight: "700",
  },
  tabLabelActive: {
    color: "#ffffff",
  },
  statusText: {
    color: "#4d6574",
    fontSize: 12,
    paddingHorizontal: 2,
    marginBottom: 2,
  },
  sectionWrap: {
    gap: 12,
  },
  sectionIntroRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  sectionIntroCard: {
    flex: 2,
    minWidth: 260,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d0dce2",
    padding: 16,
  },
  summaryCard: {
    flex: 1,
    minWidth: 220,
    backgroundColor: "#0f3f58",
    borderRadius: 12,
    padding: 16,
  },
  sectionTag: {
    color: "#2d647c",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  sectionHeading: {
    color: "#11364a",
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
  },
  sectionSubheading: {
    color: "#566f7d",
    fontSize: 14,
    lineHeight: 21,
  },
  sectionSubTitle: {
    color: "#0c3248",
    fontSize: 19,
    fontWeight: "800",
    marginTop: 6,
  },
  summaryEyebrow: {
    color: "#a9d4e0",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontWeight: "700",
  },
  summaryBig: {
    color: "#ffffff",
    fontSize: 25,
    lineHeight: 30,
    fontWeight: "900",
    marginTop: 7,
  },
  summaryCopy: {
    color: "#d5e9ee",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },
  collectionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  collectionCard: {
    flexGrow: 1,
    minHeight: 180,
    minWidth: 220,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#224459",
  },
  collectionCardImage: {
    borderRadius: 12,
  },
  collectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(7, 22, 34, 0.62)",
  },
  collectionContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 14,
    gap: 5,
  },
  collectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },
  collectionCopy: {
    color: "#dde9ee",
    fontSize: 13,
    lineHeight: 19,
  },
  standardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  standardCard: {
    flexGrow: 1,
    minWidth: 220,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d0dce2",
    borderRadius: 12,
    padding: 14,
  },
  standardTitle: {
    color: "#0d3349",
    fontSize: 16,
    fontWeight: "800",
  },
  standardCopy: {
    color: "#506875",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 5,
  },
  locationCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d0dce2",
    borderRadius: 12,
    padding: 14,
    gap: 5,
  },
  locationTitle: {
    color: "#0e354a",
    fontSize: 18,
    fontWeight: "800",
  },
  locationCopy: {
    color: "#4f6774",
    fontSize: 14,
    lineHeight: 20,
  },
  locationMeta: {
    color: "#3d5562",
    fontSize: 13,
  },
  locationActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 7,
  },
  locationBtn: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  locationBtnOutline: {
    borderColor: "#0f4f69",
    backgroundColor: "#ffffff",
  },
  locationBtnSolid: {
    borderColor: "#0f4f69",
    backgroundColor: "#0f4f69",
  },
  locationBtnText: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  locationBtnTextOutline: {
    color: "#0f4f69",
  },
  locationBtnTextSolid: {
    color: "#ffffff",
  },
  productCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d0dce2",
    padding: 14,
    gap: 7,
  },
  productTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  productName: {
    color: "#0f364c",
    fontSize: 16,
    fontWeight: "800",
    flex: 1,
  },
  productPrice: {
    color: "#0d526f",
    fontSize: 18,
    fontWeight: "900",
  },
  productBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  productCategory: {
    color: "#0d526f",
    backgroundColor: "#d8e8ef",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontWeight: "800",
  },
  productNote: {
    color: "#5e7582",
    fontSize: 12,
    flexShrink: 1,
    textAlign: "right",
  },
  newsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d0dce2",
    padding: 14,
    gap: 6,
  },
  newsDate: {
    color: "#587180",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "700",
  },
  newsTitle: {
    color: "#0f354b",
    fontSize: 18,
    fontWeight: "900",
  },
  newsExcerpt: {
    color: "#4f6674",
    fontSize: 14,
    lineHeight: 21,
  },
  emptyState: {
    color: "#617885",
    fontSize: 14,
  },
  contactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  contactCard: {
    flexGrow: 1,
    minWidth: 240,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d0dce2",
    borderRadius: 12,
    padding: 14,
  },
  contactLabel: {
    color: "#5b7481",
    textTransform: "uppercase",
    letterSpacing: 0.7,
    fontSize: 11,
    fontWeight: "700",
  },
  contactValue: {
    color: "#0d4f6c",
    fontSize: 21,
    fontWeight: "900",
    marginTop: 6,
  },
  contactHint: {
    color: "#5f7683",
    fontSize: 13,
    marginTop: 6,
  },
  complianceCard: {
    backgroundColor: "#0f3f58",
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  complianceTitle: {
    color: "#f2f8fa",
    fontSize: 18,
    fontWeight: "800",
  },
  complianceCopy: {
    color: "#d5e8ee",
    fontSize: 13,
    lineHeight: 20,
  },
  footer: {
    marginTop: 8,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d0dce2",
    padding: 16,
  },
  footerTitle: {
    color: "#0f3449",
    fontSize: 19,
    fontWeight: "900",
  },
  footerCopy: {
    color: "#556e7b",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 5,
  },
  footerTiny: {
    color: "#6f8793",
    fontSize: 12,
    marginTop: 12,
  },
});
