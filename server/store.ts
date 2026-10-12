import {DatabaseSync} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {randomUUID} from 'node:crypto';
import type {Profile} from '../shared/content.ts';
export class Store {
 db:DatabaseSync;
 constructor(path:string){mkdirSync(dirname(path),{recursive:true});this.db=new DatabaseSync(path);this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; CREATE TABLE IF NOT EXISTS profiles(id TEXT PRIMARY KEY,data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,profile TEXT NOT NULL REFERENCES profiles(id)); CREATE TABLE IF NOT EXISTS claims(profile TEXT NOT NULL,key TEXT NOT NULL,PRIMARY KEY(profile,key)); CREATE TABLE IF NOT EXISTS attempts(id TEXT PRIMARY KEY,profile TEXT NOT NULL,data TEXT NOT NULL);`);}
 get(id:string):Profile|undefined{const row=this.db.prepare('SELECT data FROM profiles WHERE id=?').get(id) as {data:string}|undefined;return row?JSON.parse(row.data):undefined;}
 all():Pick<Profile,'id'|'nickname'|'avatar'>[]{return (this.db.prepare('SELECT data FROM profiles ORDER BY rowid').all() as {data:string}[]).map(r=>{const p:Profile=JSON.parse(r.data);return {id:p.id,nickname:p.nickname,avatar:p.avatar};});}
 save(p:Profile){this.db.prepare('INSERT INTO profiles(id,data) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data').run(p.id,JSON.stringify(p));}
 create(nickname:string,avatar:string){const p:Profile={id:randomUUID(),nickname,avatar,xp:0,coins:0,completed:[],results:{},owned:[],equipped:{}};this.save(p);return p;}
 session(id:string){const token=randomUUID();this.db.prepare('INSERT INTO sessions VALUES(?,?)').run(token,id);return token;}
 identity(token:string){const r=this.db.prepare('SELECT profile FROM sessions WHERE token=?').get(token) as {profile:string}|undefined;return r?.profile;}
 transaction<T>(fn:()=>T):T{this.db.exec('BEGIN IMMEDIATE');try{const v=fn();this.db.exec('COMMIT');return v;}catch(e){this.db.exec('ROLLBACK');throw e;}}
 claim(id:string,key:string){return this.db.prepare('INSERT OR IGNORE INTO claims VALUES(?,?)').run(id,key).changes===1;}
 attempt(id:string){const r=this.db.prepare('SELECT data FROM attempts WHERE id=?').get(id) as {data:string}|undefined;return r?JSON.parse(r.data):undefined;}
 saveAttempt(a:{id:string;profile:string}){this.db.prepare('INSERT INTO attempts VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data').run(a.id,a.profile,JSON.stringify(a));}
 close(){this.db.close();}
}
