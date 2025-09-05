import { useState } from "react";
import { HomePage } from "./pages/HomePage";
import { DesignEditor } from "./pages/DesignEditor";

type AppPage = "home" | "editor";

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>("home");

  const navigateToEditor = () => {
    setCurrentPage("editor");
  };

  const navigateToHome = () => {
    setCurrentPage("home");
  };

  switch (currentPage) {
    case "home":
      return <HomePage onGetStarted={navigateToEditor} />;
    case "editor":
      return <DesignEditor onNavigateHome={navigateToHome} />;
    default:
      return <HomePage onGetStarted={navigateToEditor} />;
  }
}
