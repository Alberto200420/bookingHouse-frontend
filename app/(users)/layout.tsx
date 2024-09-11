import "@/styles/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={'antialiased px-8'} >
        {children}
        <footer className=" text-black p-4 text-center">
          <p className="text-gray-400 text-center">exchangep2p&copy; 2024 </p>
        </footer>
      </body>
    </html>
  );
}
