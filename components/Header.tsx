import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/router'
import { useTranslations } from "next-intl";
import Github from "./GitHub";

export default function Header() {
  const t = useTranslations('Index')
  const { locale, locales, route } = useRouter()
  const otherLocale = locales?.find((cur) => cur !== locale)

  return (
    <header className="flex justify-between items-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2">
      <Link href="/" className="flex space-x-3">
        <Image
          alt="header text"
          src="/icon.svg"
          className="sm:w-12 sm:h-12 w-8 h-8"
          width={32}
          height={32}
        />
        <h1 className="sm:text-4xl text-2xl font-bold ml-2 tracking-tight">
          {t('title')}
        </h1>
      </Link>




    </header>
  );
}
