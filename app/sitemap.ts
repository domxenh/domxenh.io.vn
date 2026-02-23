// Code 1

// Import type MetadataRoute của NextJS
import { MetadataRoute } from "next";

// Tạo sitemap tự động
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://domxenh.io.vn",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://domxenh.io.vn/san-pham/den-led-am-nuoc-12w",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}

// End code 1