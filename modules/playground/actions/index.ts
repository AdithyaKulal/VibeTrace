"use server";

import { db } from "@/lib/db";
import { TemplateFolder } from "../lib/path-to-json";
import { currentUser } from "@/modules/auth/actions";





export const getPlaygroundById = async (id: string) => {
    try {
        const playground = await db.playground.findUnique({
            where: { id },
            select: {
                templateFiles: {
                    select: {
                        content:true
                    }
                }
            }
        });
        return playground;
    } catch (error) {
        console.log(error)
    }
}


export const SaveUpdateCode = async (playgroundId: string, data: TemplateFolder) => {
    const user = await currentUser();
    if (!user) return null;

    try {
        const updatePlayground = await db.templateFile.upsert({
            where: {
                playgroundId
            },
            update: {
                content: JSON.stringify(data)
            },
            create: {
                playgroundId,
                content: JSON.stringify(data)
            }
            
        })


        return updatePlayground;
    } catch (error) {
        console.error("Error updating playground code:", error);
        return null;
    }
}