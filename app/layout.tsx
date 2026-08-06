import type { Metadata } from "next";
import { Manrope, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import { LiquidGlassRuntime, MobileNav } from "./ui";
import "./globals.css";

const sans=Manrope({variable:"--sans",subsets:["latin"]});
const mono=IBM_Plex_Mono({variable:"--mono",subsets:["latin"],weight:["400","500"]});
export const metadata:Metadata={metadataBase:new URL("https://www.build-your-own.ch"),title:{default:"BuildYourOwn — Webdesign Schweiz",template:"%s — BuildYourOwn"},description:"Moderne, schnelle und bezahlbare Websites für Unternehmen in der Schweiz und DACH.",openGraph:{title:"BuildYourOwn",description:"Deine Website. Schnell. Modern. Bezahlbar.",type:"website",locale:"de_CH"},other:{"codex-preview":"development"}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="de"><body className={`${sans.variable} ${mono.variable}`}>
<LiquidGlassRuntime/>
<header><Link className="logo" href="/">BUILD<span>YOUR</span>OWN<i>.</i></Link><nav><Link href="/leistungen">Leistungen</Link><Link href="/arbeiten">Arbeiten</Link><Link href="/ablauf">Ablauf</Link><Link href="/preise">Preise</Link></nav><Link className="head-cta" href="/kontakt">Projekt starten ↗</Link><MobileNav/></header>{children}
<footer><div className="wrap foot"><div><h2>Lass uns etwas<br/><span>Eigenes bauen.</span></h2><a href="mailto:contact.buildyourown@gmail.com">contact.buildyourown@gmail.com</a></div><div><small>SEITEN</small><Link href="/leistungen">Leistungen</Link><Link href="/arbeiten">Arbeiten</Link><Link href="/preise">Preise</Link><Link href="/kontakt">Kontakt</Link></div><div><small>SOCIAL</small><a href="https://www.instagram.com/byo.ch">Instagram ↗</a></div></div><div className="big-logo">BUILDYOUR<span>OWN.</span></div><div className="legal wrap"><span>© 2026 BUILDYOUROWN</span><span>CHUR · SCHWEIZ</span><span>DESIGN & DEVELOPMENT</span></div></footer>
</body></html>}
