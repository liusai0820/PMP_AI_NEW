import localFont from 'next/font/local';

// 本地托管的Geist Sans字体
export const geistSans = localFont({
  src: [
    {
      path: '../public/fonts/Geist-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Geist-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Geist-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-geist-sans',
  display: 'swap',
});

// 本地托管的Geist Mono字体
export const geistMono = localFont({
  src: [
    {
      path: '../public/fonts/GeistMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/GeistMono-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/GeistMono-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-geist-mono',
  display: 'swap',
}); 