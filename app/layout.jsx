import "@/styles/global.scss";
import { Toaster } from "react-hot-toast";
import { nunito } from "@/app/fonts/font";
import AuthProvider from "@/components/common/Session/Provider";
import Footer from "@/components/layout/Footer/Main";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Toaster position="bottom-right" className={nunito.className} />
      <AuthProvider>
      <body>
        {children}
      </body>
      </AuthProvider>
      <Footer />
    </html>
  );
}
