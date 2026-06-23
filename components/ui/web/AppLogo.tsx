import Image from "next/image";

import Link from "next/link";

export default function AppLogo() {
  return (
    <Link href="/" className="flex items-center justify-center gap-3 mb-3 cursor-pointer hover:opacity-80 transition-opacity">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-fuchsia-100 dark:bg-fuchsia-900">
        <Image
          src="https://cdn-icons-png.flaticon.com/512/2103/2103658.png"
          alt="KhalNote image"
          width={16}
          height={16}
        />
      </div>
      <p className="text-xs text-purple-600 dark:text-purple-500">KhalNote</p>
    </Link>
  );
}
