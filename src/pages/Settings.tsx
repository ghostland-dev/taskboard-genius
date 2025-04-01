
import React, { useEffect } from "react";
import SettingsLayout from "./settings/SettingsLayout";
import { useSearchParams } from "react-router-dom";
import { Tabs } from "@/components/ui/tabs";

const Settings: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  
  useEffect(() => {
    // Si un onglet est spécifié dans l'URL, l'utiliser comme onglet par défaut
    if (tabParam) {
      const tabElement = document.querySelector(
        `[data-state][data-value="${tabParam}"]`
      ) as HTMLElement;
      
      if (tabElement) {
        tabElement.click();
      }
    }
  }, [tabParam]);

  return <SettingsLayout />;
};

export default Settings;
