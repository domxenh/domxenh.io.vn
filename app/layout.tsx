// Import CSS toàn cục
import "./globals.css";

// Import Header và Footer
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Metadata mặc định toàn site (SEO global)
export const metadata = {
  title: "Đèn Hoàng Gia - Đèn LED Sân Vườn Chính Hãng",
  description: "Chuyên cung cấp đèn LED sân vườn, đèn trang trí, đèn nội thất cao cấp."
};

// 👇 Khai báo type cho props children
type RootLayoutProps = {
  children: React.ReactNode;
};

// Layout gốc toàn website
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="vi">
      <body>
        <Header />

        {/* Nội dung từng trang */}
        <main className="container mx-auto px-4">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}

// END CODE 1