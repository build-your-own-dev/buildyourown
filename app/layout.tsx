import type { Metadata } from "next";
import Link from "next/link";
import { DesktopNav, LiquidGlassRuntime, MobileNav, PageRevealRuntime, ThemeToggle } from "./ui";
import "./globals.css";

export const metadata:Metadata={metadataBase:new URL("https://www.build-your-own.ch"),title:{default:"BuildYourOwn — Webdesign Schweiz",template:"%s — BuildYourOwn"},description:"Moderne, schnelle und bezahlbare Websites für Unternehmen in der Schweiz und DACH.",openGraph:{title:"BuildYourOwn",description:"Deine Website. Schnell. Modern. Bezahlbar.",type:"website",locale:"de_CH"},other:{"codex-preview":"development"}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="de" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:'try{document.documentElement.dataset.theme=localStorage.getItem("byo-theme")==="dark"?"dark":"light"}catch{document.documentElement.dataset.theme="light"}'}}/></head><body>
<LiquidGlassRuntime/>
<PageRevealRuntime/>
<header><Link className="logo" href="/">BUILD<span>YOUR</span>OWN<i>.</i></Link><DesktopNav/><Link className="head-cta" href="/kontakt">Projekt starten ↗</Link><MobileNav/><aside className="site-notice" aria-label="Hinweis zum Stand der Website"><i/>Diese Website ist in Arbeit. Manche Inhalte stimmen möglicherweise nicht mit dem geplanten Endprodukt überein.</aside></header>{children}
<footer><div className="wrap foot"><div><h2>Lass uns etwas<br/><span>Eigenes bauen.</span></h2><a href="mailto:contact.buildyourown@gmail.com">contact.buildyourown@gmail.com</a></div><div><small>SEITEN</small><Link href="/leistungen">Leistungen</Link><Link href="/arbeiten">Arbeiten</Link><Link href="/preise">Preise</Link><Link href="/kontakt">Kontakt</Link></div><div><small>SOCIAL</small><a href="https://www.instagram.com/byo.ch">Instagram ↗</a></div></div><div className="big-logo">BUILDYOUR<span>OWN.</span></div><div className="legal wrap"><span>© 2026 BUILDYOUROWN</span><span>CHUR · SCHWEIZ</span><span>DESIGN & DEVELOPMENT</span><ThemeToggle/></div></footer>
</body></html>}
