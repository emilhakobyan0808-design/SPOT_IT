export function sourceFiles(root:string):string[];
export function applyPreparedUpdate(root:string,staged:string,sha:string):string;
export function updateProject(root:string,options?:{fetcher?:typeof fetch}):Promise<void>;
