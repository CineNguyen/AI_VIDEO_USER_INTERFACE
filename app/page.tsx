'use client';

import { useState } from "react";
import { getSupabase } from "../lib/supabase";

type Msg={role:"user"|"agent";content:string};
type View="chat"|"projects"|"videos"|"analytics"|"api"|"settings";

export default function App(){
 const [authenticated,setAuthenticated]=useState(false);
 const [loginMode,setLoginMode]=useState<"login"|"register">("login");
 const [view,setView]=useState<View>("chat");
 const [phone,setPhone]=useState("");
 const [otp,setOtp]=useState("");
 const [otpSent,setOtpSent]=useState(false);
 const [authMsg,setAuthMsg]=useState("");
 const [name,setName]=useState("Creator");
 const [apiKey,setApiKey]=useState("");
 const [input,setInput]=useState("");
 const [busy,setBusy]=useState(false);
 const [job,setJob]=useState<any>(null);
 const [messages,setMessages]=useState<Msg[]>([
  {role:"agent",content:"Xin chào 👋 Tôi là AI Video Agent. Hãy nói cho tôi biết video YouTube bạn muốn tạo hôm nay!"}
 ]);

 async function googleLogin(){
  try{
   const s=getSupabase();
   await s.auth.signInWithOAuth({provider:"google",options:{redirectTo:location.origin}});
  }catch(e){setAuthMsg("Chưa cấu hình Supabase. Bạn có thể dùng Demo Login để xem giao diện.");}
 }
 async function sendOtp(){
  try{const s=getSupabase();const {error}=await s.auth.signInWithOtp({phone});if(error)throw error;setOtpSent(true);setAuthMsg("OTP đã được gửi.");}
  catch(e){setAuthMsg("Cần cấu hình Supabase + SMS provider để dùng số điện thoại thật.");}
 }
 async function verifyOtp(){
  try{const s=getSupabase();const {error}=await s.auth.verifyOtp({phone,token:otp,type:"sms"});if(error)throw error;setAuthenticated(true);}
  catch(e){setAuthMsg("Không thể xác thực OTP. Kiểm tra cấu hình Supabase.");}
 }
 async function createVideo(prompt:string){
  if(!apiKey){setView("api");setMessages(m=>[...m,{role:"agent",content:"🔑 Hãy kết nối Video API trước. Tôi đã mở API Connections cho bạn."}]);return;}
  setBusy(true);
  try{
   const r=await fetch("/api/video",{method:"POST",headers:{"Content-Type":"application/json","x-openai-key":apiKey},body:JSON.stringify({prompt,model:"sora-2",seconds:"4",size:"1280x720"})});
   const data=await r.json();
   if(!r.ok)throw new Error(data.error||"Video API error");
   setJob(data);
   setMessages(m=>[...m,{role:"agent",content:`🎬 Đã tạo Video Job!\nID: ${data.id}\nTrạng thái: ${data.status||"created"}\n\nAgent sẽ tiếp tục theo dõi quá trình tạo video.`}]);
  }catch(e){setMessages(m=>[...m,{role:"agent",content:`❌ Lỗi: ${e instanceof Error?e.message:"Unknown error"}`}]);}
  finally{setBusy(false);}
 }
 async function send(){
  const text=input.trim();if(!text||busy)return;
  setInput("");setMessages(m=>[...m,{role:"user",content:text},{role:"agent",content:"🧠 Tôi đang phân tích ý tưởng và chuẩn bị pipeline tạo video..."}]);
  await createVideo(text);
 }
 if(!authenticated)return <main className="authPage">
  <div className="authVisual">
   <div className="floating one">✦</div><div className="floating two">▶</div><div className="floating three">✺</div>
   <div className="brandBig"><span className="logoMark">✦</span> AI VIDEO<br/>AGENT</div>
   <p>Biến một ý tưởng đơn giản thành nội dung video.</p>
   <div className="featureList"><div>🧠 <span><b>AI Agent thông minh</b><small>Lên kế hoạch và tạo nội dung</small></span></div><div>🎬 <span><b>Tạo video tự động</b><small>Từ prompt đến video workflow</small></span></div><div>📺 <span><b>Xuất bản YouTube</b><small>Review trước khi publish</small></span></div></div>
  </div>
  <section className="authPanel">
   <div className="authCard">
    <div className="mobileBrand">✦ AI VIDEO AGENT</div>
    <div className="pill"><button className={loginMode==="login"?"on":""} onClick={()=>setLoginMode("login")}>Đăng nhập</button><button className={loginMode==="register"?"on":""} onClick={()=>setLoginMode("register")}>Đăng ký</button></div>
    <h1>{loginMode==="login"?"Chào mừng trở lại 👋":"Bắt đầu sáng tạo 🚀"}</h1>
    <p className="muted">{loginMode==="login"?"Đăng nhập để tiếp tục với AI Video Agent.":"Tạo tài khoản và bắt đầu biến ý tưởng thành video."}</p>
    <button className="google" onClick={googleLogin}><span>G</span> Tiếp tục với Google</button>
    <div className="or"><i/> hoặc <i/></div>
    <label>Số điện thoại</label><div className="phoneRow"><span>🇻🇳 +84</span><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Nhập số điện thoại"/></div>
    {!otpSent?<button className="primary full" onClick={sendOtp}>Gửi mã OTP →</button>:<><label>Mã OTP</label><input className="input" value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Nhập mã OTP"/><button className="primary full" onClick={verifyOtp}>Xác minh & đăng nhập →</button></>}
    <button className="demoBtn" onClick={()=>setAuthenticated(true)}>⚡ Vào Demo ngay</button>
    {authMsg&&<p className="authMsg">{authMsg}</p>}
    <p className="terms">Bằng việc tiếp tục, bạn đồng ý với Terms & Privacy Policy.</p>
   </div>
  </section>
 </main>;

 const nav=(k:View,i:string,t:string)=><button className={view===k?"active":""} onClick={()=>setView(k)}><span>{i}</span>{t}</button>;
 return <main className="dashboard">
  <aside className="sidebar">
   <div className="sideLogo"><span>✦</span> VIDEO AGENT</div>
   <div className="workspace"><div className="avatarSmall">{name.slice(0,1).toUpperCase()}</div><div><b>{name}</b><small>Free Workspace</small></div><span className="chev">⌄</span></div>
   <nav>{nav("chat","✦","AI Agent")}{nav("projects","▣","Projects")}{nav("videos","▶","My Videos")}{nav("analytics","↗","Analytics")}</nav>
   <div className="navTitle">WORKSPACE</div>
   <nav>{nav("api","🔑","API Connections")}{nav("settings","⚙","Settings")}</nav>
   <div className="upgrade"><span>🚀</span><b>Unlock more power</b><small>Connect more AI providers and scale your workflow.</small><button>Upgrade plan</button></div>
   <button className="profile" onClick={()=>setAuthenticated(false)}><div className="avatarSmall purple">{name.slice(0,1).toUpperCase()}</div><span><b>{name}</b><small>Sign out</small></span></button>
  </aside>

  <section className="mainContent">
   <header className="topbar"><div><h2>{view==="chat"?"AI Video Agent":view==="api"?"API Connections":view[0].toUpperCase()+view.slice(1)}</h2><p>{view==="chat"?"Your creative AI workspace":"Manage your video creation workspace"}</p></div><div className="topActions"><button className="bell">🔔</button><button className="primary" onClick={()=>{setView("chat");setInput("")}}>＋ New project</button></div></header>

   {view==="chat"&&<div className="chatScreen">
    <div className="welcome"><div className="agentOrb">✦</div><h1>What will we create today?</h1><p>Describe your idea. Your AI Agent will plan the workflow and help turn it into a video.</p></div>
    <div className="messages">{messages.map((m,i)=><div className={"message "+m.role} key={i}><div className="msgAvatar">{m.role==="agent"?"✦":"U"}</div><div className="bubble">{m.content}</div></div>)}</div>
    <div className="suggestions"><button onClick={()=>setInput("Tạo video YouTube về AI Agent trong 5 phút")}>🎬 Create a YouTube video</button><button onClick={()=>setInput("Viết kịch bản video công nghệ viral")}>✍️ Write a viral script</button><button onClick={()=>setInput("Tạo video cinematic về tương lai AI")}>✨ Create cinematic video</button></div>
    <div className="composer"><textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}} placeholder="Ask AI Agent to create something..." /><button className="sendBtn" onClick={send}>{busy?"◌":"↑"}</button></div>
    <p className="hint">Press Enter to send • Shift + Enter for new line</p>
   </div>}

   {view==="api"&&<div className="page">
    <div className="heroGradient"><div><span className="tag">YOUR AI POWER</span><h1>Connect your AI providers</h1><p>Use your own API keys and connect the tools that power your video workflow.</p></div><div className="heroIcon">⚡</div></div>
    <div className="providerGrid">
     <div className="provider featured"><div className="providerIcon openai">◉</div><div className="providerText"><b>OpenAI</b><small>AI + Video generation</small></div><span className={apiKey?"connected":"dot"}>{apiKey?"Connected":"Not connected"}</span><div className="keyBox"><input type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="Paste your API key..." /><button onClick={()=>setView("chat")}>Connect</button></div></div>
     <div className="provider"><div className="providerIcon purpleBg">AI</div><div className="providerText"><b>Claude</b><small>Script & creative intelligence</small></div><button className="connect">Connect</button></div>
     <div className="provider"><div className="providerIcon redBg">▶</div><div className="providerText"><b>YouTube</b><small>Upload & publishing</small></div><button className="connect">Connect OAuth</button></div>
     <div className="provider"><div className="providerIcon blueBg">♪</div><div className="providerText"><b>Voice Provider</b><small>AI voice & narration</small></div><button className="connect">Connect</button></div>
    </div>
    <div className="securityCard"><span>🔐</span><div><b>Your keys, your control</b><p>Do not commit keys to GitHub. This MVP keeps the API key only in current app memory. Production should use an encrypted server-side vault.</p></div></div>
   </div>}

   {view==="projects"&&<div className="page"><div className="statGrid"><Stat icon="🎬" title="Projects" value="0" text="Start your first project"/><Stat icon="⚡" title="Active jobs" value={job?"1":"0"} text={job?"Video job created":"No active jobs"}/><Stat icon="▶" title="Videos" value="0" text="Publish when ready"/></div><div className="empty"><div>🎬</div><h2>Your creative journey starts here</h2><p>Create a project, talk to your AI Agent, and build your first video.</p><button className="primary" onClick={()=>setView("chat")}>Create project →</button></div></div>}
   {view==="videos"&&<div className="page"><div className="empty"><div>▶</div><h2>No videos yet</h2><p>Your completed videos will appear here.</p><button className="primary" onClick={()=>setView("chat")}>Create your first video</button></div></div>}
   {view==="analytics"&&<div className="page"><div className="statGrid"><Stat icon="👁" title="Total views" value="0" text="Connect YouTube to sync"/><Stat icon="▶" title="Videos" value="0" text="Published videos"/><Stat icon="↗" title="Growth" value="—" text="Analytics coming soon"/></div></div>}
   {view==="settings"&&<div className="page"><div className="settingsCard"><h2>Profile settings</h2><label>Display name</label><input className="input" value={name} onChange={e=>setName(e.target.value)}/><button className="primary">Save changes</button></div></div>}
  </section>

  <aside className="activity">
   <div className="activityHead"><div><b>Agent activity</b><small>Live workspace status</small></div><span className="live">● LIVE</span></div>
   <div className="timeline"><div className="activityItem done"><i>✓</i><div><b>Ready to create</b><small>AI Agent is online</small></div></div><div className="activityItem"><i>✦</i><div><b>Waiting for your idea</b><small>Describe your next video</small></div></div><div className="activityItem"><i>🎬</i><div><b>{apiKey?"Video API connected":"Connect Video API"}</b><small>{apiKey?"Ready for generation":"Add your API key"}</small></div></div></div>
   <div className="activityBottom"><h3>Quick start</h3><button onClick={()=>setView("api")}>🔑 Connect API <span>→</span></button><button onClick={()=>setView("chat")}>✨ Ask AI Agent <span>→</span></button><button>📺 Connect YouTube <span>→</span></button></div>
  </aside>
 </main>;
}

function Stat({icon,title,value,text}:{icon:string,title:string,value:string,text:string}){return <div className="stat"><span>{icon}</span><div><small>{title}</small><b>{value}</b><p>{text}</p></div></div>}