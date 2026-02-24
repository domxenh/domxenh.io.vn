// Code 2

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://domxenh.io.vn/sitemap.xml",
  };
}

// End code 2