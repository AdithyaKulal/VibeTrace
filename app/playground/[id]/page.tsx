"use client";
import React from 'react'
import { useParams } from 'next/navigation';
import { usePlayground } from '@/modules/playground/hooks/usePlayground';


const MainPlaygroundPage = () => {
    const {id} = useParams<{ id: string }>();

    const { playgroundData, templateData, isLoading, error, saveTemplateData } = usePlayground(id)
    
    console.log("template data:", templateData);
    console.log("playgrounddata",playgroundData)


    
  return (
      <div>
          Params:{id}
    </div>
  )
}

export default MainPlaygroundPage