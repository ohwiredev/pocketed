import { useEffect } from "react";

const BASE_URL = "https://pocketed.app";

function getMeta(name: string, isProperty = false): string {
  const attr = isProperty ? "property" : "name";
  return (
    document
      .querySelector(`meta[${attr}="${name}"]`)
      ?.getAttribute("content") || ""
  );
}

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (el) {
    el.setAttribute("content", content);
  } else {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    el.setAttribute("content", content);
    document.head.appendChild(el);
  }
}

function getCanonical(): string {
  return (
    document.querySelector('link[rel="canonical"]')?.getAttribute("href") ||
    BASE_URL
  );
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]');
  if (el) {
    el.setAttribute("href", href);
  } else {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    el.setAttribute("href", href);
    document.head.appendChild(el);
  }
}

export function useMeta(config: {
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}) {
  useEffect(() => {
    const prev = {
      desc: getMeta("description"),
      ogDesc: getMeta("og:description", true),
      ogUrl: getMeta("og:url", true),
      ogImage: getMeta("og:image", true),
      twitterDesc: getMeta("twitter:description", true),
      twitterUrl: getMeta("twitter:url", true),
      twitterImage: getMeta("twitter:image", true),
      canonical: getCanonical(),
    };

    if (config.description) {
      setMeta("description", config.description);
      setMeta("og:description", config.description, true);
      setMeta("twitter:description", config.description, true);
    }
    if (config.keywords) {
      setMeta("keywords", config.keywords);
    }
    if (config.ogImage) {
      setMeta("og:image", config.ogImage, true);
      setMeta("twitter:image", config.ogImage, true);
    }
    if (config.canonical) {
      setMeta("og:url", config.canonical, true);
      setMeta("twitter:url", config.canonical, true);
      setCanonical(config.canonical);
    }

    return () => {
      setMeta("description", prev.desc);
      setMeta("og:description", prev.ogDesc, true);
      setMeta("og:url", prev.ogUrl, true);
      setMeta("og:image", prev.ogImage, true);
      setMeta("twitter:description", prev.twitterDesc, true);
      setMeta("twitter:url", prev.twitterUrl, true);
      setMeta("twitter:image", prev.twitterImage, true);
      setCanonical(prev.canonical);
    };
  }, [config.description, config.keywords, config.ogImage, config.canonical]);
}
