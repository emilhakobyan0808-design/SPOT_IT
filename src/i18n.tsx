import {createContext,useContext,useState,useEffect,type ReactNode} from 'react';
import en from './locales/en.json';
import es from './locales/es.json';
import ka from './locales/ka.json';
export type Language='ru'|'en'|'es'|'ka';
export const languages:{id:Language;label:string}[]=[{id:'ru',label:'Русский'},{id:'en',label:'English'},{id:'es',label:'Español'},{id:'ka',label:'ქართული'}];
const dictionaries:Record<Exclude<Language,'ru'>,Record<string,string>>={en,es,ka};
function initialLanguage():Language{try{const stored=localStorage.getItem('spot-language');return languages.some(l=>l.id===stored)?stored as Language:'ru';}catch{return 'ru';}}
let currentLanguage:Language=initialLanguage();
export function translate(key:string,language:Language,...values:unknown[]):string{const template=language==='ru'?key:dictionaries[language][key]||key;return template.replace(/\{(\d+)\}/g,(_,index)=>String(values[Number(index)]??''));}
export function t(key:string,...values:unknown[]):string{return translate(key,currentLanguage,...values);}
const LanguageContext=createContext<{lang:Language;setLanguage:(lang:Language)=>void}>({lang:currentLanguage,setLanguage:()=>{}});
export function LanguageProvider({children}:{children:ReactNode}){const [lang,setLang]=useState<Language>(currentLanguage);function setLanguage(next:Language){if(!languages.some(l=>l.id===next))return;currentLanguage=next;setLang(next);try{localStorage.setItem('spot-language',next);}catch{/* Storage can be disabled; the language still works for this session. */}}
useEffect(()=>{document.documentElement.lang=lang;},[lang]);return <LanguageContext.Provider value={{lang,setLanguage}}>{children}</LanguageContext.Provider>;}
export function useLanguage(){return useContext(LanguageContext);}
