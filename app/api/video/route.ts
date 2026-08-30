import { NextRequest, NextResponse } from "next/server";
const API="https://api.openai.com/v1/videos";
export async function POST(req:NextRequest){
 const key=req.headers.get("x-openai-key")?.trim();
 if(!key)return NextResponse.json({error:"Missing API key"},{status:400});
 const body=await req.json();
 const form=new FormData();
 form.append("model",body.model||"sora-2");
 form.append("prompt",body.prompt||"");
 form.append("seconds",body.seconds||"4");
 form.append("size",body.size||"1280x720");
 const r=await fetch(API,{method:"POST",headers:{Authorization:`Bearer ${key}`},body:form});
 const data=await r.json().catch(()=>({}));
 return NextResponse.json(data,{status:r.status});
}
export async function GET(req:NextRequest){
 const key=req.headers.get("x-openai-key")?.trim();
 const id=req.nextUrl.searchParams.get("id");
 if(!key||!id)return NextResponse.json({error:"Missing key or id"},{status:400});
 const r=await fetch(`${API}/${encodeURIComponent(id)}`,{headers:{Authorization:`Bearer ${key}`}});
 const data=await r.json().catch(()=>({}));
 return NextResponse.json(data,{status:r.status});
}