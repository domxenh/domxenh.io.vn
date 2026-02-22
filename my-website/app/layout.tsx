import "./globals.css";
import Header from "./components/Header";

export const metadata = {
  title: "DomXenh.io",
  description: "Nền tảng kết nối nguồn hàng và TMĐT",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}