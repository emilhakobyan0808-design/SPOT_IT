export const projectRoot:string;
export function compatibleVersion(version:string):boolean;
export function digestFiles(root:string,paths:string[]):string;
export function dependenciesReady(root:string):boolean;
export function findNpmCli():string;
export function selectPort(preferred:number):Promise<{port:number;existing:boolean}>;
