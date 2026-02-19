import { StatusBar } from "expo-status-bar";
import { Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "./src/lib/supabase";

const DEFAULT_BRAND = {
  name: "OG Hustlers Smoke Shop",
  tagline: "THCA flowers, prerolls, kratom, and premium disposables",
  supportEmail: "support@oghustlers.com",
  supportPhone: "+1 (555) 010-2424",
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
  { id: "p-001", name: "Disposable Vape", price: "$19.99" },
  { id: "p-002", name: "Glass Water Pipe", price: "$49.99" },
  { id: "p-003", name: "Rolling Papers", price: "$2.99" },
  { id: "p-004", name: "Butane Refill", price: "$6.99" },
  { id: "p-005", name: "Premium Hookah Flavor", price: "$14.99" },
  { id: "p-006", name: "Cigar Wrap 2-Pack", price: "$3.49" },
];

const TABS = [
  { id: "contact", label: "Contact" },
  { id: "locator", label: "Store Locator" },
  { id: "prices", label: "Prices" },
];

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

function TabButton({ active, label, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.tabButton, active && styles.tabButtonActive]}>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function ContactTab({ brand }) {
  return (
    <View style={styles.sectionWrap}>
      <Text style={styles.sectionHeading}>Contact Us</Text>
      <Text style={styles.sectionSubheading}>Get in touch for product availability, wholesale, or pickup questions.</Text>
      <View style={styles.glassCard}>
        <Text style={styles.metaLabel}>Phone</Text>
        <Pressable onPress={() => openUrl(`tel:${brand.supportPhone}`)}>
          <Text style={styles.linkText}>{brand.supportPhone}</Text>
        </Pressable>
      </View>
      <View style={styles.glassCard}>
        <Text style={styles.metaLabel}>Email</Text>
        <Pressable onPress={() => openUrl(`mailto:${brand.supportEmail}`)}>
          <Text style={styles.linkText}>{brand.supportEmail}</Text>
        </Pressable>
      </View>
      <View style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>About OG Hustlers</Text>
        <Text style={styles.aboutCopy}>
          Our team is focused on quality, service, and a curated lineup of smoke and vape products built for daily customers and enthusiasts.
        </Text>
      </View>
    </View>
  );
}

function StoreLocatorTab({ stores }) {
  return (
    <View style={styles.sectionWrap}>
      <Text style={styles.sectionHeading}>Get Directions</Text>
      <Text style={styles.sectionSubheading}>Tap a location card to open maps.</Text>
      {stores.map((store) => (
        <Pressable key={store.id} onPress={() => openUrl(store.mapsUrl)} style={styles.locationCard}>
          <Text style={styles.locationTitle}>{store.name}</Text>
          <Text style={styles.locationCopy}>{store.address}</Text>
          <Text style={styles.locationCopy}>Phone: {store.phone}</Text>
          <Text style={styles.locationCopy}>Hours: {store.hours}</Text>
          <Text style={styles.locationCta}>Open In Maps</Text>
        </Pressable>
      ))}
    </View>
  );
}

function PricesTab({ products }) {
  return (
    <View style={styles.sectionWrap}>
      <Text style={styles.sectionHeading}>Top Product Prices</Text>
      <Text style={styles.sectionSubheading}>Current pricing for popular products.</Text>
      {products.map((item) => (
        <View key={item.id} style={styles.priceCard}>
          <Text style={styles.priceName}>{item.name}</Text>
          <Text style={styles.priceValue}>{item.price}</Text>
        </View>
      ))}
    </View>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("contact");
  const [brand, setBrand] = useState(DEFAULT_BRAND);
  const [stores, setStores] = useState(DEFAULT_STORES);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [status, setStatus] = useState("Using local fallback data");

  useEffect(() => {
    let mounted = true;

    async function loadSupabaseData() {
      if (!isSupabaseConfigured || !supabase) {
        setStatus("Using local fallback data. Add Supabase .env values to enable live data.");
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
        setBrand({
          name: contactResult.data.name || DEFAULT_BRAND.name,
          tagline: contactResult.data.tagline || DEFAULT_BRAND.tagline,
          supportEmail: contactResult.data.support_email || DEFAULT_BRAND.supportEmail,
          supportPhone: contactResult.data.support_phone || DEFAULT_BRAND.supportPhone,
        });
      }

      if (Array.isArray(storeResult.data) && storeResult.data.length > 0) {
        setStores(
          storeResult.data.map((store, index) => ({
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
            price: normalizePrice(product.price || "N/A"),
          }))
        );
      }

      setStatus("Live data loaded from Supabase");
    }

    loadSupabaseData().catch(() => {
      if (mounted) {
        setStatus("Supabase request failed. Using local fallback data.");
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const content = useMemo(() => {
    if (activeTab === "contact") return <ContactTab brand={brand} />;
    if (activeTab === "locator") return <StoreLocatorTab stores={stores} />;
    return <PricesTab products={products} />;
  }, [activeTab, brand, products, stores]);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.promoBar}>
          <Text style={styles.promoText}>Weekend Deal: Buy 3 Get 1 Free</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.logo}>OG HUSTLERS</Text>
          <View style={styles.headerNav}>
            <Text style={styles.navItem}>Home</Text>
            <Text style={styles.navItem}>Shop</Text>
            <Text style={styles.navItem}>Stores</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroOverline}>Vape and Smoke Shop</Text>
          <Text style={styles.heroTitle}>{brand.tagline}</Text>
          <Text style={styles.heroBody}>Shop the latest vaping products, THCA items, and essentials at OG Hustlers.</Text>
          <Pressable style={styles.heroButton} onPress={() => setActiveTab("locator")}>
            <Text style={styles.heroButtonText}>Pickup Order Here</Text>
          </Pressable>
        </View>

        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TabButton key={tab.id} label={tab.label} active={activeTab === tab.id} onPress={() => setActiveTab(tab.id)} />
          ))}
        </View>

        <Text style={styles.statusText}>{status}</Text>
        {content}

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Join Our Mailing List</Text>
          <Text style={styles.footerCopy}>Get first access to new flavors, hardware, and in-store promotions.</Text>
          <Text style={styles.footerTiny}>Copyright 2026 OG Hustlers. All Rights Reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f4f9ff",
  },
  page: {
    paddingBottom: 30,
    backgroundColor: "#f4f9ff",
  },
  promoBar: {
    backgroundColor: "#0f4fbf",
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  promoText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.4,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#d3e3ff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    color: "#0b2d73",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1,
  },
  headerNav: {
    flexDirection: "row",
    gap: 12,
  },
  navItem: {
    color: "#3f5f99",
    fontSize: 12,
    fontWeight: "600",
  },
  hero: {
    margin: 14,
    padding: 22,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#c8dbff",
    backgroundColor: "#ffffff",
  },
  heroOverline: {
    color: "#2c66d6",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: "#072258",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 8,
    lineHeight: 36,
  },
  heroBody: {
    color: "#4b679c",
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
  },
  heroButton: {
    marginTop: 18,
    backgroundColor: "#0f4fbf",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
  },
  heroButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  tabBar: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: "#c8dbff",
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#0f4fbf",
    borderColor: "#0f4fbf",
  },
  tabLabel: {
    color: "#244d97",
    fontWeight: "700",
    fontSize: 13,
  },
  tabLabelActive: {
    color: "#ffffff",
  },
  statusText: {
    color: "#5d77ad",
    fontSize: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  sectionWrap: {
    paddingHorizontal: 14,
    gap: 10,
  },
  sectionHeading: {
    color: "#082861",
    fontSize: 24,
    fontWeight: "900",
  },
  sectionSubheading: {
    color: "#5d77ad",
    fontSize: 14,
    marginBottom: 3,
  },
  glassCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#c8dbff",
    padding: 14,
  },
  metaLabel: {
    color: "#5d77ad",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  linkText: {
    color: "#0f4fbf",
    fontSize: 17,
    fontWeight: "700",
    marginTop: 5,
  },
  aboutCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#c8dbff",
    borderRadius: 10,
    padding: 14,
  },
  aboutTitle: {
    color: "#0b2d73",
    fontSize: 18,
    fontWeight: "800",
  },
  aboutCopy: {
    color: "#4b679c",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  locationCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#c8dbff",
    borderRadius: 10,
    padding: 14,
  },
  locationTitle: {
    color: "#0b2d73",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  locationCopy: {
    color: "#4b679c",
    fontSize: 14,
    lineHeight: 20,
  },
  locationCta: {
    color: "#0f4fbf",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 8,
    textTransform: "uppercase",
  },
  priceCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#c8dbff",
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceName: {
    color: "#0b2d73",
    fontSize: 16,
    fontWeight: "700",
  },
  priceValue: {
    color: "#0f4fbf",
    fontSize: 16,
    fontWeight: "900",
  },
  footer: {
    marginTop: 20,
    paddingHorizontal: 14,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#c8dbff",
  },
  footerTitle: {
    color: "#0b2d73",
    fontWeight: "800",
    fontSize: 19,
  },
  footerCopy: {
    color: "#5d77ad",
    marginTop: 6,
    fontSize: 14,
  },
  footerTiny: {
    color: "#6b84b8",
    fontSize: 12,
    marginTop: 16,
    marginBottom: 10,
  },
});
