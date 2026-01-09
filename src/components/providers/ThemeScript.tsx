export function ThemeScript() {
  const code = `(function(){try{var theme=localStorage.getItem("theme");if(theme!=="dark"&&theme!=="light"){var prefersDark=window.matchMedia("(prefers-color-scheme: dark)").matches;theme=prefersDark?"dark":"light";}var root=document.documentElement;var body=document.body;var isDark=theme==="dark";root.classList.toggle("dark",isDark);root.classList.toggle("light",!isDark);root.dataset.theme=theme;if(body){body.dataset.theme=theme;body.classList.toggle("dark",isDark);body.classList.toggle("light",!isDark);}}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
