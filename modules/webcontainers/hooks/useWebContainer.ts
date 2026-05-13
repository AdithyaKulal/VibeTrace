import { useState, useEffect, useCallback } from "react";
import { WebContainer } from "@webcontainer/api";
import { TemplateFolder } from "@/modules/playground/lib/path-to-json";

// Global WebContainer instance to prevent multiple boots
let globalWebContainerInstance: WebContainer | null = null;
let globalWebContainerPromise: Promise<WebContainer> | null = null;

interface UseWebContainerProps {
  templateData: TemplateFolder;
}

interface UseWebContainerReturn {
  serverUrl: string | null;
  isLoading: boolean;
  error: string | null;
  instance: WebContainer | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
  destroy: () => void;
}

export const useWebContainer = ({
  templateData,
}: UseWebContainerProps): UseWebContainerReturn => {
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [instance, setInstance] = useState<WebContainer | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initializeWebContainer() {
      try {
        if (globalWebContainerInstance) {
          // Reuse existing instance
          if (mounted) {
            setInstance(globalWebContainerInstance);
            setIsLoading(false);
          }
          return;
        }

        if (globalWebContainerPromise) {
          // Wait for ongoing boot
          const webContainerInstance = await globalWebContainerPromise;
          if (mounted) {
            setInstance(webContainerInstance);
            setIsLoading(false);
          }
          return;
        }

        // Start booting
        globalWebContainerPromise = WebContainer.boot();
        const webContainerInstance = await globalWebContainerPromise;
        globalWebContainerInstance = webContainerInstance;
        globalWebContainerPromise = null;

        if (!mounted) return;
          
        setInstance(webContainerInstance);
        setIsLoading(false);

      } catch (error) {
          console.error('failed to initialize WebContainer:', error);
          if (mounted) {
              setError(error instanceof Error ? error.message : 'failed to initialize WebContainer');
              setIsLoading(false);
          }
      }
      }
      
      initializeWebContainer();

      return () => {
          mounted = false;
          // Don't teardown global instance here, as other components might be using it
      }

  }, []);
    
    
    const writeFileSync = useCallback(async (path: string, content: string): Promise<void> => {
        if (!instance) {
            throw new Error("Web container instance is not available");

        }
        
        try {
            const pathParts = path.split("/");
            const folderPath = pathParts.slice(0, -1).join("/");

            if (folderPath) {
                await instance.fs.mkdir(folderPath, { recursive: true });


                
            }
            await instance.fs.writeFile(path, content);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to write file";
            console.error(`Failed to write file at ${path}:`, error);
            throw new Error(`Failed to write file at ${path}:${errorMessage}`);

        }
    }, [instance]);


    const destroy = useCallback(() => {
        // Don't teardown global instance, as it might be used by other components
        setInstance(null);
        setServerUrl(null);
    }, []);

    
  return { serverUrl, isLoading, error, instance, writeFileSync, destroy };
};
