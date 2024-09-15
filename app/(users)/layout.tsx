import "@/styles/globals.css";
import { HotelContextProvider } from "@/components/client/contexStore";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={'antialiased'} >
        <HotelContextProvider>
          {children}
        </HotelContextProvider>
      </body>
    </html>
  );
}
