import { useState } from "react";

const G = "#e8c87a";   // gold
const R = "#c9956a";   // rose gold
const M = "#c4bdd8";   // mist
const BG = "#0d0b14";  // void
const P = "#16112a";   // panel
const W = "#fdfcfb";   // white
const S = "#8aac8f";   // sage
const V = "#0d0b14";   // void (button text)

function lp(d) {
  if (!d) return "?";
  let s = d.replace(/-/g,"").split("").map(Number).reduce((a,b)=>a+b,0);
  while (s>9&&s!==11&&s!==22) s=String(s).split("").map(Number).reduce((a,b)=>a+b,0);
  return s;
}

const HEADINGS = [
  "Your Soul Archetype",
  "Your Neuroplasticity Profile",
  "Your Healing Color",
  "Your Space Message",
  "Wellness Tools For You",
  "Your Brain Reset Practice",
  "A Message For You",
];
const ICONS = ["✦","🧠","🎨","🏛","🌿","⚡","💛"];

function parseSections(raw) {
  const text = raw.replace(/\*\*/g,"").replace(/\*/g,"").replace(/^#+\s/gm,"").trim();
  const sections = [];
  for (let i=0; i<HEADINGS.length; i++) {
    const h = HEADINGS[i], nh = HEADINGS[i+1];
    const lo = text.toLowerCase();
    const start = lo.indexOf(h.toLowerCase());
    if (start===-1) continue;
    const end = nh ? lo.indexOf(nh.toLowerCase()) : text.length;
    const body = text.slice(start+h.length, end!==-1?end:text.length).replace(/^[\s:\n]+/,"").trim();
    if (body.length>15) sections.push({heading:h, body, icon:ICONS[i]});
  }
  // fallback
  if (sections.length < 3) {
    const chunks = text.split(/\n\n+/).filter(c=>c.trim().length>30);
    chunks.forEach((chunk,i)=>{
      if (i>=HEADINGS.length) return;
      const lines = chunk.trim().split("\n");
      const heading = lines[0].replace(/^[#*\-]+\s*/,"").trim();
      const body = lines.slice(1).join(" ").trim()||chunk.trim();
      if (body.length>15) sections.push({heading: heading||HEADINGS[i], body, icon:ICONS[i%ICONS.length]});
    });
  }
  return sections;
}

const LOADS = [
  "Reading your energetic signature…",
  "Mapping your neuroplasticity pathways…",
  "Consulting ancient wisdom traditions…",
  "Synthesizing your soul profile…",
  "Building your wellness blueprint…",
];

// ── Shared UI ──
function Label({children}) {
  return <div style={{fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:M,fontFamily:"sans-serif",marginBottom:10}}>{children}</div>;
}
function Pill({label, on, click}) {
  return (
    <button onClick={click} style={{padding:"8px 16px",borderRadius:100,border:`1px solid ${on?G:"rgba(201,149,106,0.28)"}`,background:on?"rgba(232,200,122,0.12)":"transparent",color:on?G:M,fontSize:13,cursor:"pointer",fontFamily:"sans-serif",margin:"3px",transition:"all 0.15s"}}>
      {label}
    </button>
  );
}
function MultiPill({label, on, click}) {
  return (
    <button onClick={click} style={{padding:"8px 16px",borderRadius:100,border:`1px solid ${on?S:"rgba(138,172,143,0.28)"}`,background:on?"rgba(138,172,143,0.12)":"transparent",color:on?S:M,fontSize:13,cursor:"pointer",fontFamily:"sans-serif",margin:"3px",transition:"all 0.15s"}}>
      {label}
    </button>
  );
}
function Inp({value, onChange, placeholder, type="text"}) {
  return <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(201,149,106,0.25)",borderRadius:8,padding:"12px 14px",color:W,fontFamily:"sans-serif",fontSize:14,outline:"none",boxSizing:"border-box",colorScheme:"dark"}}/>;
}

// ── Step indicator ──
function Steps({step, total}) {
  return (
    <div style={{marginBottom:28}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,marginBottom:10}}>
        {Array.from({length:total},(_,i)=>(
          <div key={i} style={{height:3,flex:1,maxWidth:52,borderRadius:2,background:i<step?"rgba(232,200,122,0.7)":i===step?"rgba(232,200,122,0.3)":"rgba(255,255,255,0.08)",transition:"all 0.3s"}}/>
        ))}
      </div>
      <div style={{textAlign:"center",fontSize:11,color:M,fontFamily:"sans-serif",letterSpacing:"0.1em"}}>
        Step {step+1} of {total}
      </div>
    </div>
  );
}

// ── Panel wrapper ──
function Panel({eyebrow, title, desc, children, step, total}) {
  return (
    <div style={{background:P,border:"1px solid rgba(232,200,122,0.13)",borderRadius:16,padding:"30px 26px"}}>
      <Steps step={step} total={total}/>
      <div style={{fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:G,fontFamily:"sans-serif",marginBottom:6}}>{eyebrow}</div>
      <h2 style={{fontSize:"clamp(1.3rem,4vw,1.8rem)",fontWeight:300,color:W,margin:"0 0 6px",fontFamily:"Georgia,serif"}}>{title}</h2>
      {desc && <p style={{color:M,fontSize:13,fontFamily:"sans-serif",margin:"0 0 24px",lineHeight:1.65}}>{desc}</p>}
      {children}
    </div>
  );
}

export default function App() {
  const TOTAL_STEPS = 5;
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState(LOADS[0]);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  // Step 0 — Identity
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  // Step 1 — Intention & feeling
  const [intention, setIntention] = useState("");
  const [feeling, setFeeling] = useState("");

  // Step 2 — Sensory world
  const [musicMoods, setMusicMoods] = useState([]);
  const [colorDraw, setColorDraw] = useState("");
  const [texture, setTexture] = useState("");

  // Step 3 — Space & habits
  const [spaceChallenge, setSpaceChallenge] = useState("");
  const [autopilot, setAutopilot] = useState([]);
  const [readyFor, setReadyFor] = useState("");

  // Step 4 — Blocks & growth
  const [block, setBlock] = useState("");
  const [strength, setStrength] = useState("");

  const nav = (n) => { setErr(""); setStep(n); window.scrollTo(0,0); };

  const lifeNum = lp(dob);

  const validate = () => {
    if (step===0 && (!name.trim()||!dob)) { setErr("Please enter your name and birth date."); return false; }
    if (step===1 && !intention) { setErr("Please select what you're seeking."); return false; }
    return true;
  };

  const generate = async () => {
    setErr(""); setLoading(true);
    let i=0;
    const iv = setInterval(()=>{ i=(i+1)%LOADS.length; setLoadMsg(LOADS[i]); },2000);

    const prompt = `You are a master wellness guide for Chaos Theory (chaostheoryyy.com), blending neuropsychology, numerology, Vastu Shastra, and holistic wellness.

You understand that the brain forms habits and patterns tied to environmental cues, sensory experiences, and repeated thought loops. Rearranging one's space and sensory environment activates neuroplasticity — the hippocampus builds new cognitive maps, the prefrontal cortex reactivates, and old autopilot patterns can be disrupted and replaced. The sensory preferences someone has (music, color, texture) are direct clues to their nervous system's needs and their current neurological state.

CLIENT PROFILE:
Name: ${name}
Date of Birth: ${dob}
Life Path Number: ${lifeNum}
Currently feeling: ${feeling||"unspecified"}
Seeking: ${intention||"general wellbeing"}
Music moods they're drawn to: ${musicMoods.join(", ")||"not specified"}
Color they're most drawn to right now: ${colorDraw||"not specified"}
Texture/material they crave: ${texture||"not specified"}
Biggest space challenge: ${spaceChallenge||"not specified"}
Autopilot habits they want to break: ${autopilot.join(", ")||"not specified"}
What they're ready to create: ${readyFor||"not specified"}
What's been blocking them: ${block||"not specified"}
Their emerging strength: ${strength||"not specified"}

Write a warm, personal wellness profile. Begin immediately with the first heading — no introduction. Use each heading exactly as written, on its own line, then 2-3 sentences. Plain text only — no asterisks, no bold, no bullets, no dashes, no markdown.

Your Soul Archetype
Your Neuroplasticity Profile
Your Healing Color
Your Space Message
Wellness Tools For You
Your Brain Reset Practice
A Message For You

Section guidance:
- "Your Soul Archetype": their unique energetic identity tied to Life Path ${lifeNum} and their sensory profile. Name an archetype (e.g. "The Intuitive Rebuilder", "The Sensory Visionary"). 2-3 sentences.
- "Your Neuroplasticity Profile": explain in warm, accessible language what is happening in their brain right now based on their current state and habits. Name the specific mechanism (hippocampal mapping, prefrontal cortex, default mode network, habit loops) and what it means for their capacity to change. Make it empowering.
- "Your Healing Color": one specific color tied to their sensory preferences and neurological needs. Name it specifically (not just "blue" — "deep teal" or "warm terracotta"). Explain why this color regulates their nervous system and one exact way to bring it in.
- "Your Space Message": based on their space challenge and sensory preferences, one specific insight about what their current environment is doing to their brain and what one physical change would create the biggest neurological shift.
- "Wellness Tools For You": 3 specific tools tied to their profile — one for the body, one for the space, one for the mind. Each in one sentence with the neurological or energetic reason why.
- "Your Brain Reset Practice": a specific, personalized daily practice (under 10 minutes) that works with their neuroplasticity window — designed to install the new pattern they want to create. Include the science of why it works in one sentence.
- "A Message For You": 2 warm, direct sentences speaking to exactly where they are, what they're breaking free from, and what is becoming possible.`;

    try {
      const res = await fetch("/api/claude", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1200,messages:[{role:"user",content:prompt}]}),
      });
      clearInterval(iv);
      if (!res.ok) throw new Error("API error "+res.status+": "+(await res.text()).slice(0,100));
      const data = await res.json();
      const raw = (data.content||[]).map(b=>b.text||"").join("").trim();
      if (!raw) throw new Error("Empty response — please try again.");
      setResult({name, lifeNum, sections:parseSections(raw), raw});
    } catch(e) {
      setErr("Error: "+e.message);
    } finally {
      setLoading(false);
    }
  };

  const btnNext = (label="Continue →", onClick) => (
    <button onClick={onClick} style={{width:"100%",padding:14,background:`linear-gradient(135deg,${R},${G})`,border:"none",borderRadius:100,color:V,fontFamily:"sans-serif",fontSize:15,fontWeight:600,cursor:"pointer",letterSpacing:"0.04em",marginTop:22}}>
      {label}
    </button>
  );
  const btnBack = () => (
    <button onClick={()=>nav(step-1)} style={{width:"100%",padding:13,background:"transparent",border:"1px solid rgba(196,189,216,0.2)",borderRadius:100,color:M,fontFamily:"sans-serif",fontSize:14,cursor:"pointer",marginTop:10}}>
      ← Back
    </button>
  );

  // ── Loading ──
  if (loading) return (
    <div style={{minHeight:"100vh",background:BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <div style={{position:"relative",width:72,height:72,marginBottom:28}}>
        <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"1px solid transparent",borderTopColor:G,borderRightColor:G,animation:"spin 1.3s linear infinite"}}/>
        <div style={{position:"absolute",inset:14,borderRadius:"50%",border:"1px solid transparent",borderTopColor:R,animation:"spin 0.85s linear infinite reverse"}}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
      <p style={{color:M,fontStyle:"italic",fontSize:15,fontFamily:"Georgia,serif"}}>{loadMsg}</p>
    </div>
  );

  // ── Results ──
  if (result) return (
    <div style={{minHeight:"100vh",background:BG,padding:"36px 16px 80px",fontFamily:"Georgia,serif"}}>
      <div style={{maxWidth:600,margin:"0 auto"}}>

        {/* Hero */}
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:11,letterSpacing:"0.22em",textTransform:"uppercase",color:R,fontFamily:"sans-serif",marginBottom:8}}>Chaos Theory</div>
          <div style={{width:58,height:58,borderRadius:"50%",background:`linear-gradient(135deg,${R},${G})`,color:V,fontSize:20,fontWeight:700,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:14,boxShadow:"0 0 28px rgba(232,200,122,0.28)"}}>{result.lifeNum}</div>
          <h2 style={{fontSize:"clamp(1.6rem,4vw,2.1rem)",fontWeight:300,color:W,margin:"0 0 6px"}}>{result.name}'s Wellness Profile</h2>
          <div style={{fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:G,fontFamily:"sans-serif"}}>Life Path {result.lifeNum} · Chaos Theory Method</div>
        </div>

        {/* Neuro callout banner */}
        <div style={{background:"rgba(138,172,143,0.08)",border:"1px solid rgba(138,172,143,0.2)",borderRadius:12,padding:"14px 18px",marginBottom:16,display:"flex",gap:12,alignItems:"flex-start"}}>
          <span style={{fontSize:18,flexShrink:0}}>🧠</span>
          <p style={{margin:0,fontSize:13,color:S,fontFamily:"sans-serif",lineHeight:1.7}}>Your profile is built on the science of neuroplasticity — how your brain physically changes in response to environment, sensation, and intentional practice. Every recommendation below has a reason rooted in how your nervous system works.</p>
        </div>

        {/* Sections */}
        {result.sections.length > 0
          ? result.sections.map((sec,i)=>(
            <div key={i} style={{background:P,border:"1px solid rgba(232,200,122,0.13)",borderRadius:14,padding:"20px 22px",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:9}}>
                <span style={{fontSize:17}}>{sec.icon}</span>
                <span style={{fontSize:10,letterSpacing:"0.16em",textTransform:"uppercase",color:G,fontFamily:"sans-serif"}}>{sec.heading}</span>
              </div>
              <p style={{margin:0,color:M,lineHeight:1.85,fontSize:14,fontFamily:"sans-serif",fontWeight:300}}>{sec.body}</p>
            </div>
          ))
          : (
            <div style={{background:P,border:"1px solid rgba(232,200,122,0.13)",borderRadius:14,padding:28}}>
              <p style={{margin:0,color:M,lineHeight:1.9,fontSize:14,fontFamily:"sans-serif",whiteSpace:"pre-wrap"}}>{result.raw}</p>
            </div>
          )
        }

        {/* CTA */}
        <div style={{background:"rgba(42,31,82,0.5)",border:"1px solid rgba(232,200,122,0.18)",borderRadius:14,padding:"26px 22px",marginTop:12,textAlign:"center"}}>
          <h3 style={{fontSize:18,fontWeight:300,color:W,margin:"0 0 8px",fontFamily:"Georgia,serif"}}>Ready to redesign your space around this?</h3>
          <p style={{color:M,fontSize:13,fontFamily:"sans-serif",margin:"0 0 18px",lineHeight:1.6}}>Your full Sanctuary Blueprint takes this profile deeper — a personalized healing space plan drawing from Vastu, feng shui, astrology, and neuropsychology.</p>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <button style={{padding:"12px 24px",background:`linear-gradient(135deg,${R},${G})`,border:"none",borderRadius:100,color:V,fontFamily:"sans-serif",fontSize:13,fontWeight:600,cursor:"pointer"}}>
              Get My Sanctuary Blueprint →
            </button>
            <button style={{padding:"12px 22px",border:`1px solid ${G}`,background:"transparent",color:G,borderRadius:100,fontFamily:"sans-serif",fontSize:13,cursor:"pointer"}}>
              Join Chaos Theory Method
            </button>
          </div>
          <div style={{fontSize:11,color:M,fontFamily:"sans-serif",marginTop:12,opacity:0.7}}>chaostheoryyy.com</div>
        </div>

        <div style={{textAlign:"center",marginTop:20}}>
          <button onClick={()=>{setResult(null);setStep(0);setName("");setDob("");setIntention("");setFeeling("");setMusicMoods([]);setColorDraw("");setTexture("");setSpaceChallenge("");setAutopilot([]);setReadyFor("");setBlock("");setStrength("");window.scrollTo(0,0);}} style={{padding:"9px 20px",border:"1px solid rgba(196,189,216,0.2)",background:"transparent",color:M,borderRadius:100,fontFamily:"sans-serif",fontSize:12,cursor:"pointer"}}>
            New Reading
          </button>
        </div>
      </div>
    </div>
  );

  // ── Form ──
  return (
    <div style={{minHeight:"100vh",background:BG,padding:"36px 16px 80px",fontFamily:"Georgia,serif"}}>
      <div style={{maxWidth:560,margin:"0 auto"}}>

        {/* Header */}
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:11,letterSpacing:"0.22em",textTransform:"uppercase",color:R,fontFamily:"sans-serif",marginBottom:8}}>Chaos Theory</div>
          <div style={{fontSize:26,color:G,marginBottom:10}}>✦</div>
          <h1 style={{fontSize:"clamp(1.7rem,5vw,2.4rem)",fontWeight:300,color:W,margin:"0 0 10px",letterSpacing:"0.03em"}}>
            Wellness <em style={{color:G}}>Profile Quiz</em>
          </h1>
          <p style={{color:M,fontSize:13,lineHeight:1.7,fontFamily:"sans-serif",fontWeight:300,margin:0}}>
            Discover your soul archetype, neuroplasticity profile, healing color, and personalized brain reset practice — drawn from numerology, ancient wisdom, and the science of how your brain changes.
          </p>
        </div>

        {/* ── STEP 0 — Identity ── */}
        {step===0 && (
          <Panel eyebrow="Step 1 of 5" title="Who Are You?" desc="Your birth details unlock your life path number — the foundation of your energetic profile." step={0} total={TOTAL_STEPS}>
            <div style={{marginBottom:16}}>
              <Label>Your Name</Label>
              <Inp value={name} onChange={setName} placeholder="First and last name"/>
            </div>
            <div style={{marginBottom:8}}>
              <Label>Date of Birth</Label>
              <Inp type="date" value={dob} onChange={setDob}/>
            </div>
            {err && <p style={{color:"#e88a8a",fontSize:13,fontFamily:"sans-serif",margin:"10px 0 0"}}>{err}</p>}
            {btnNext("Continue →", ()=>{ if(validate()) nav(1); })}
          </Panel>
        )}

        {/* ── STEP 1 — Intention & State ── */}
        {step===1 && (
          <Panel eyebrow="Step 2 of 5" title="Where Are You Right Now?" desc="What you're seeking and how you're feeling are clues to your current neurological state." step={1} total={TOTAL_STEPS}>
            <div style={{marginBottom:18}}>
              <Label>What are you most seeking?</Label>
              <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
                {["Deep rest & sleep","Mental clarity & focus","Emotional healing","More energy & vitality","Creative flow","Abundance & prosperity","Love & connection","Grounding & stability","Spiritual awakening","Identity & purpose"].map(o=>(
                  <Pill key={o} label={o} on={intention===o} click={()=>setIntention(intention===o?"":o)}/>
                ))}
              </div>
            </div>
            <div style={{marginBottom:8}}>
              <Label>How are you feeling in life lately?</Label>
              <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
                {["Anxious & overwhelmed","Tired & depleted","Stuck & unmotivated","Emotionally disconnected","Scattered & unfocused","Numb & going through motions","Restless & seeking something","On the edge of a breakthrough"].map(o=>(
                  <Pill key={o} label={o} on={feeling===o} click={()=>setFeeling(feeling===o?"":o)}/>
                ))}
              </div>
            </div>
            {err && <p style={{color:"#e88a8a",fontSize:13,fontFamily:"sans-serif",margin:"10px 0 0"}}>{err}</p>}
            {btnNext("Continue →", ()=>{ if(validate()) nav(2); })}
            {btnBack()}
          </Panel>
        )}

        {/* ── STEP 2 — Sensory World ── */}
        {step===2 && (
          <Panel eyebrow="Step 3 of 5" title="Your Sensory World" desc="What you're drawn to sensorially reveals your nervous system's needs and your current neurological state." step={2} total={TOTAL_STEPS}>
            <div style={{marginBottom:18}}>
              <Label>What music moods do you gravitate toward? (select all that feel true)</Label>
              <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
                {["Ambient & meditative","Deep bass & rhythm","Melancholic & emotional","Uplifting & energizing","Lo-fi & focused","Nature sounds & silence","Classical & orchestral","Raw & soulful"].map(o=>(
                  <MultiPill key={o} label={o} on={musicMoods.includes(o)} click={()=>setMusicMoods(p=>p.includes(o)?p.filter(x=>x!==o):[...p,o])}/>
                ))}
              </div>
            </div>
            <div style={{marginBottom:18}}>
              <Label>What color are you most drawn to right now?</Label>
              <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
                {["Deep greens & forests","Warm terracottas & clay","Blues & ocean tones","Soft neutrals & linen","Deep indigos & night sky","Warm golds & amber","Dusty roses & blush","Charcoal & near-black"].map(o=>(
                  <Pill key={o} label={o} on={colorDraw===o} click={()=>setColorDraw(colorDraw===o?"":o)}/>
                ))}
              </div>
            </div>
            <div style={{marginBottom:8}}>
              <Label>What texture or material do you crave in your environment?</Label>
              <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
                {["Soft linen & cotton","Raw wood & stone","Smooth & minimal","Layered & cozy textiles","Cool ceramics & glass","Woven & natural fibers","Velvet & richness","Bare & unadorned"].map(o=>(
                  <Pill key={o} label={o} on={texture===o} click={()=>setTexture(texture===o?"":o)}/>
                ))}
              </div>
            </div>
            {btnNext("Continue →", ()=>nav(3))}
            {btnBack()}
          </Panel>
        )}

        {/* ── STEP 3 — Space & Habits ── */}
        {step===3 && (
          <Panel eyebrow="Step 4 of 5" title="Your Space & Your Patterns" desc="Your environment and your autopilot habits are deeply linked. What happens in your space shapes what happens in your mind." step={3} total={TOTAL_STEPS}>
            <div style={{marginBottom:18}}>
              <Label>What's the biggest challenge in your current space?</Label>
              <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
                {["It feels heavy and stuck","Constant clutter and chaos","No dedicated space for rest","No space for creativity or ritual","Poor lighting and energy","I never feel at home in it","Too much technology everywhere","It reflects who I was, not who I'm becoming"].map(o=>(
                  <Pill key={o} label={o} on={spaceChallenge===o} click={()=>setSpaceChallenge(spaceChallenge===o?"":o)}/>
                ))}
              </div>
            </div>
            <div style={{marginBottom:18}}>
              <Label>Which autopilot habits are you most wanting to break? (select any)</Label>
              <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
                {["Reaching for my phone first thing","Staying up too late","Procrastinating on what matters","Numbing out with screens","Skipping my morning routine","Staying in reactive mode all day","Avoiding stillness","Negative self-talk loops"].map(o=>(
                  <MultiPill key={o} label={o} on={autopilot.includes(o)} click={()=>setAutopilot(p=>p.includes(o)?p.filter(x=>x!==o):[...p,o])}/>
                ))}
              </div>
            </div>
            <div style={{marginBottom:8}}>
              <Label>What are you most ready to create or step into?</Label>
              <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
                {["A calmer, more focused mind","A creative life that feels alive","Financial freedom and flow","Deeper relationships and love","A body that feels strong and healthy","A spiritual practice that grounds me","A new identity and sense of self","A business or work that lights me up"].map(o=>(
                  <Pill key={o} label={o} on={readyFor===o} click={()=>setReadyFor(readyFor===o?"":o)}/>
                ))}
              </div>
            </div>
            {btnNext("Continue →", ()=>nav(4))}
            {btnBack()}
          </Panel>
        )}

        {/* ── STEP 4 — Blocks & Strength ── */}
        {step===4 && (
          <Panel eyebrow="Step 5 of 5" title="Blocks & Becoming" desc="The final piece. Be honest — this is where your profile becomes truly personal." step={4} total={TOTAL_STEPS}>
            <div style={{marginBottom:18}}>
              <Label>What pattern or belief has been holding you back?</Label>
              <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
                {["I'm not enough","I don't know where to start","I sabotage good things","Fear of being seen","I keep repeating old patterns","Waiting for permission","I don't trust myself","I put everyone else first"].map(o=>(
                  <Pill key={o} label={o} on={block===o} click={()=>setBlock(block===o?"":o)}/>
                ))}
              </div>
            </div>
            <div style={{marginBottom:8}}>
              <Label>What strength in you is ready to emerge?</Label>
              <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
                {["Deep intuition","Quiet resilience","Creative vision","Fierce clarity","Emotional intelligence","Grounded leadership","Spiritual depth","Abundant generosity"].map(o=>(
                  <Pill key={o} label={o} on={strength===o} click={()=>setStrength(strength===o?"":o)}/>
                ))}
              </div>
            </div>
            {err && <p style={{color:"#e88a8a",fontSize:13,fontFamily:"sans-serif",margin:"10px 0 0"}}>{err}</p>}
            {btnNext("Reveal My Profile ✦", generate)}
            {btnBack()}
          </Panel>
        )}

      </div>
    </div>
  );
}
