import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {authService,clearSession,readUser,type AuthUser} from '../services/auth';

type Ctx={user:AuthUser|null;loading:boolean;setUser:(u:AuthUser|null)=>void;logout:()=>Promise<void>;refresh:()=>Promise<void>};
const C=createContext<Ctx>({user:null,loading:true,setUser:()=>{},logout:async()=>{},refresh:async()=>{}});

export function AuthProvider({children}:{children:ReactNode}){
  const [user,setUser]=useState<AuthUser|null>(readUser());
  const [loading,setLoading]=useState(true);
  const refresh=async()=>{
    if(!localStorage.getItem('qic.auth.token')&&!sessionStorage.getItem('qic.auth.token')){setLoading(false);return;}
    try{
      const u=await authService.me();
      localStorage.setItem('qic.auth.user',JSON.stringify(u));
      setUser(u);
    }catch{
      clearSession();
      setUser(null);
    }finally{setLoading(false);}
  };
  useEffect(()=>{refresh()},[]);
  const logout=async()=>{try{await authService.logout()}finally{setUser(null)}};
  return <C.Provider value={{user,loading,setUser,logout,refresh}}>{children}</C.Provider>;
}
export const useAuth=()=>useContext(C);
