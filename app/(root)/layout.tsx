/*layout of the home page */
import { Metadata } from "next"
import {Footer}  from "@/modules/home/footer";
import {Header} from "@/modules/home/header";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: {
        template: "VibeTrace",
        default: "Code editors for VibeCoders-VibeTrace ",
    },
}

export default function HomeLayout({
    children
}: {
    children:React.ReactNode // this will be the content of page.tsx
    })
{
    return (
      <>
        <Header />
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
          )}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

        <main className="z-20 relative width-full pt-0">{children}</main>
        <Footer />
      </>
    );
}/*{children } this will render the content of page.tsx */