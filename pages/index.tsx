import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from 'next-intl'
import { Toaster, toast } from "react-hot-toast";
import DropDown, { FormType } from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";

import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";
import { marked } from "marked";

const Home: NextPage = () => {
  const t = useTranslations('Index')

  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState("");
  const [form, setForm] = useState<FormType>("paragraphForm");
  const [api_key, setAPIKey] = useState("")
  const [generatedChat, setGeneratedChat] = useState<String>("");

  console.log("Streamed response: ", generatedChat);

  const prompt =
    form === 'paragraphForm'?
      `${t('prompt')}${chat}`
      : `${t('prompt')}${chat}`;

  const useUserKey = process.env.NEXT_PUBLIC_USE_USER_KEY === "true" ? true : false;

  const generateChat = async (e: any) => {
    e.preventDefault();
    setGeneratedChat("");
    setLoading(true);

    const response = useUserKey ?
      await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          api_key,
        }),
      })
    :
      await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      })

    console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value).replace("<|im_end|>", "");
      setGeneratedChat((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>{t('title')}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        


      <a
          className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
          href="https://github.com/guaguaguaxia/weekly_report"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          <p>Star on GitHub</p>
        </a>



        <h1 className="sm:text-6xl text-4xl max-w-2xl font-bold text-slate-900">
          {t('description1')} <br></br><div               className=" px-4 py-2 sm:mt-3 mt-8 hover:bg-black/80 w-full"></div>{t('description2')}
        </h1>
        <p className="text-slate-500 mt-5">{t('slogan')}</p>

        <p className="text-slate-1000 mt-5 sm:text-2xl" >
          此功能于2023-02-15 00:00:00暂时下线<br></br>
        <br></br>
        </p>
        <p className="text-slate-1000 mt-5 " style={{textAlign: "left"}}>

        1.为什么这么匆忙下线？<br></br>
        ①.由于此网站的使用人数以不可思议的速度飙升，作者无力承担随之而来的运营成本。②.产品存在合规风险，个人开发者无力应对审查机制。<br></br>
        <br></br>
        2.为什么不做商业化？我可以给钱<br></br>
        如果我平时就抱着赚钱的心态、寻找着赚钱的方法，那这款产品也大概率不会诞生。我是纯粹以好玩的角度出发而产生的灵感，本来就是想着人不会太多随便玩玩。
        这个项目没有技术门槛，代码都是开源的，做商业化不仅麻烦且很快就会有同质产品，赚不了多少钱。<br></br>
        <br></br>
        3.既然是暂时下线，那什么时候回来？<br></br>
        什么时候国内有类ChatGPT能力的产品、且API价格可以接受就什么时候回来，不过那时候此产品可能也将失去意义。<br></br>
        <br></br>
        4.我迫切需要这个功能，你有什么办法能让我用上吗？<br></br>
        想办法搞个ChatGPT账号自己问。<br></br>
        <br></br>
        5.你这么好给我们免费用了这么多天，我要怎么回报你？ (我有一个朋友，他就是这么问我的，真的，不骗你！）<br></br>
        在GitHub上Star此项目、在GitHub上follow我就是对我最大的支持。<br></br>
        <br></br>
        还有什么想说想问的都可以通过邮箱guaguaguaxia@Gmail.com联系我。
        </p>

        <div className="max-w-xl w-full">
          { useUserKey &&(
            <>

              <input
                  value={api_key}
                  onChange={(e) => setAPIKey(e.target.value)}
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-black focus:ring-black p-2"
                  placeholder={
                    t('openaiApiKeyPlaceholder')
                  }
                />
            </>)
          }

          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              {t('step1')}{" "}
            </p>
          </div>

          <textarea
            value={chat}
            onChange={(e) => setChat(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-2"
            placeholder={
              t('placeholder')
            }
          />

          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-5 mt-8 hover:bg-black/80 w-full"
              
            >
              {t('simplifierButton')} &rarr;
            </button>
          )}
          
          <br></br>
          <br></br>
          <div className="mt-1 items-center space-x-3">
            <span className="text-slate-200">
                {t('privacyPolicy1')}
              <a
                className="text-blue-200 hover:text-blue-400"
                href="https://github.com/guaguaguaxia/weekly_report/blob/main/privacy.md"
                target="_blank"
                rel="noopener noreferrer"
              >{' '}{t('privacyPolicy2')}</a>
            </span>
          </div>
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-10">
              {generatedChat && (
                <>
                  <div>
                    <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                      {t('simplifiedContent')}
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                    <div
                      className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedChat.trim());
                        toast("Chat copied to clipboard", {
                          icon: "✂️",
                        });
                      }}
                    >
                      {/* <p className="sty1">{generatedChat}</p> */}
                      <p
                        className="sty1 markdown-body"
                        dangerouslySetInnerHTML={{
                          __html: marked(generatedChat.toString(), {
                            gfm: true,
                            breaks: true,
                            smartypants: true
                          }),
                        }}
                      ></p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      <Footer />
    </div>
  );
};

export default Home;

export function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      messages: {
        ...require(`../messages/${locale}.json`),
      },
    },
  }
}
