import {t, useLanguage} from './i18n';
import type {Profile} from '../shared/content';
export function Mascot({mood='happy',equipped={},className=''}:{mood?:'happy'|'think'|'win';equipped?:Profile['equipped'];className?:string}){
 useLanguage();
 const a=equipped.accessory;
 return <span className={`mascot plush-mascot mood-${mood} ${className}`}><img src="/mascot/spot-plush.png" alt={t("Ваш SPOT IT — оранжевый плюшевый герой с жёлтым лицом")} draggable={false}/>{a&&<svg className="mascot-accessories" aria-hidden="true" viewBox="0 0 420 420">
 {a==='glasses'&&<g stroke="#544437" strokeWidth="6" fill="none"><rect x="184" y="156" width="35" height="34" rx="9"/><rect x="224" y="156" width="35" height="34" rx="9"/><path d="M219 168h5"/></g>}
 {a==='crown'&&<path d="M170 84l-10-42 32 19 24-40 24 40 31-19-9 42z" fill="#ffd54d" stroke="#d39d23" strokeWidth="4"/>}
 {a==='cap'&&<g><path d="M168 81q0-58 52-57q47 0 47 57z" fill="#6864cc"/><path d="M218 82h77q9 13-11 17h-66" fill="#4e4ba0"/></g>}
 {a==='viking'&&<g><path d="M150 96q0-70 66-71q63 0 63 71z" fill="#a4b4bd" stroke="#687e89" strokeWidth="4"/><path d="M150 65q-28-9-25-45q20 27 34 23M273 63q30-9 29-43q-20 27-34 23" fill="#ecf0ea" stroke="#687e89" strokeWidth="4"/><path d="M211 29v64M151 95h129" stroke="#617782" strokeWidth="8"/></g>}
 {a==='detective'&&<g stroke="#695344" strokeWidth="8"><path d="M338 286l28 39"/><circle cx="321" cy="263" r="30" fill="#d5f2ff" fillOpacity=".7"/><path d="M308 249l21-7" stroke="white" strokeWidth="5" strokeLinecap="round"/></g>}
 </svg>}</span>;
}
