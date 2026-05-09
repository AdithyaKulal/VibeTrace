import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/modules/dashboard/components/dashboard-sidebar";
import { getAllPlaygroundForUser } from "@/modules/dashboard/actions";
import { TooltipProvider } from "@/components/ui/tooltip";

/*need to display the playground functionalities in dashboard layout*/ 

export default async function DashboardLayout({
    children
}: {
    children:React.ReactNode
    }) {
    
    const playgroundData = await getAllPlaygroundForUser(); 
    
    const technologyIconmap: Record<string, string> = {
        REACT: "Zap",
        NEXTJS: "Lightbulb",
        EXPRESS: "Server",
        VUE: "Vue",
        HONO: "Hono",
        ANGULAR: "Angular"
    }

    const formattedPlaygroundData = playgroundData?.map((item) => ({
        id: item.id,
        name: item.title,
        /*cancel afterwords */
        starred: item.Starmark?.[0]?.isMarked || false,
        icon: technologyIconmap[item.template] || "Code2",
    }))


    return (
      <TooltipProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full overflow-x-hidden">
            {/*Dashboard sidebar from module comp dashboard sidebar*/}
            {/*@ts-ignore*/}
            <DashboardSidebar initialPlaygroundData={formattedPlaygroundData} />
            <main className="flex-1">{children}</main>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    );
}