import React, { useState, useEffect } from 'react';
import { 
  Upload, Settings, Image as ImageIcon, Layout, Languages, Zap, Copy, 
  Check, Loader2, Plus, Trash2, FileText, Palette, ChevronRight, 
  Maximize2, Smartphone, Layers, Sparkles, FileUp, Monitor, AlertCircle,
  Type, ClipboardCheck, Globe, Link2, FileSearch, Pencil, Info, Download, X,
  RefreshCw
} from 'lucide-react';

// --- 核心模型配置 (严格锁定) ---
const MODEL_TEXT = "gemini-3-pro-preview";
const MODEL_IMAGE = "gemini-3-pro-image-preview"; 
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// --- 数据常量 (已添加国际化支持) ---
const VISUAL_STYLES = [
  { id: 'mag', name: '杂志编辑风格', en: 'Magazine Editorial', desc: '高级、专业、大片感、粗衬线标题、极简留白' },
  { id: 'surreal', name: '超现实主义风格', en: 'Surrealism', desc: '梦幻离奇、扭曲时空、符号化构图、强烈视觉冲击力、达利/马格利特风格感' },
  { id: 'watercolor', name: '水彩艺术风格', en: 'Watercolor Art', desc: '温暖、柔和、晕染效果、手绘质感' },
  { id: 'tech', name: '科技未来风格', en: 'Future Tech', desc: '冷色调、几何图形、数据可视化、蓝光效果' },
  { id: 'retro', name: '复古胶片风格', en: 'Retro Film', desc: '颗粒质感、暖色调、怀旧氛围、宝丽来边框、情绪、光影、生活方式' },
  { id: 'nordic', name: '极简北欧风格', en: 'Minimalist Nordic', desc: '性冷淡、大留白、几何线条、黑白灰' },
  { id: 'deconstructed', name: '解构主义拼贴风格', en: 'Deconstructed collage', desc: '解构拼贴风、碎片重组、非对称、冲突感、留白张力、层叠重组、视觉张力、David Carson/Neville Brody风格感' },
  { id: 'cyber', name: '霓虹赛博风格', en: 'Cyberpunk', desc: '荧光色、描边发光、未来都市、暗色背景' },
  { id: 'organic', name: '自然有机风格', en: 'Natural Organic', desc: '植物元素、大地色系、手工质感、环保理念' },
  { id: 'trendy', name: '潮流扁平插画风格', en: 'Trendy Flat', desc: '扁平化、不规则形状、撞色、拼贴感、Malika Favre/Olimpia Zagnoli风格感' }
  
];

const TYPO_EFFECTS = [
  { id: 'mag_typo', name: '杂志风 (粗衬线大标题)', en: 'Magazine (Serif Big Title)', style: '杂志风' },
  { id: 'glass_typo', name: '现代风 (玻璃拟态卡片)', en: 'Modern (Glassmorphism)', style: '现代风' },
  { id: 'luxury_typo', name: '奢华风 (3D金属质感)', en: 'Luxury (3D Metal)', style: '奢华风' },
  { id: 'art_typo', name: '艺术风 (手写体标注)', en: 'Artistic (Handwritten)', style: '艺术风' },
  { id: 'neon_typo', name: '赛博风 (霓虹发光)', en: 'Cyberpunk (Neon Glow)', style: '赛博风' },
  { id: 'minimal_typo', name: '极简风 (极细线条)', en: 'Minimalist (Thin Lines)', style: '极简风' }
];

const POSTER_THEMES = [
  { id: '01', name: '海报01 - 主KV视觉', en: 'Poster 01 - Hero KV', desc: 'Hero Shot，根据上传的产品图，可根据所选场景风格做对应的风格转绘' },
  { id: '02', name: '海报02 - 生活/使用场景', en: 'Poster 02 - Lifestyle Usage', desc: 'Lifestyle，展示产品实际使用' },
  { id: '03', name: '海报03 - 工艺/技术/概念可视化', en: 'Poster 03 - Tech/Concept', desc: 'Process/Concept，基于识别的卖点' },
  { id: '04', name: '细节特写01 - 放大产品细节', en: 'Detail 01 - Zoom In', desc: 'Detail 01，放大产品细节' },
  { id: '05', name: '细节特写02 - 材质/质感特写', en: 'Detail 02 - Texture/Material', desc: 'Detail 02，材质/质感特写' },
  { id: '06', name: '细节特写03 - 功能细节', en: 'Detail 03 - Function Detail', desc: 'Detail 03，功能细节' },
  { id: '07', name: '海报07 - 细节特写04/评价', en: 'Poster 07 - Detail/Review', desc: 'Detail 04 / Review' },
  { id: '08', name: '海报08 - 品牌故事/配色灵感', en: 'Poster 08 - Brand Story', desc: 'Brand Story / Moodboard' },
  { id: '09', name: '海报09 - 产品参数/规格表', en: 'Poster 09 - Specs', desc: 'Specifications，使用识别的参数' },
  { id: '10', name: '海报10 - 使用指南/注意事项', en: 'Poster 10 - User Guide', desc: 'Usage Guide，基于产品类型' }
];

const OUTPUT_LANGS = [
  { id: 'bilingual', name: '中英双语 (CN/EN)', en: 'Bilingual (CN/EN)' },
  { id: 'mandarin', name: '纯中文 (CN)', en: 'Mandarin (CN)' },
  { id: 'pure_en', name: '纯英文 (English)', en: 'English Only' },
  { id: 'japanese', name: '日语 (Japanese)', en: 'Japanese' },
  { id: 'german', name: '德语 (German)', en: 'German' },
  { id: 'spanish', name: '西班牙语 (Spanish)', en: 'Spanish' },
  { id: 'french', name: '法语 (French)', en: 'French' },
  { id: 'korean', name: '韩语 (Korean)', en: 'Korean' }
];

const RATIOS = [
  { label: '9:16 (竖版)', en: '9:16 (Portrait)', value: '9:16' },
  { label: '3:4 (社交)', en: '3:4 (Social)', value: '3:4' },
  { label: '1:1 (方版)', en: '1:1 (Square)', value: '1:1' },
  { label: '16:9 (横版)', en: '16:9 (Landscape)', value: '16:9' }
];

const RESOLUTIONS = [
  { label: '标准 (Standard)', en: 'Standard', value: 'standard' },
  { label: '2K 高清 (2048px)', en: '2K HD (2048px)', value: '2K' },
  { label: '4K 超清 (UHD)', en: '4K UHD', value: '4K' }
];

// --- 辅助函数 ---
const fetchWithExponentialBackoff = async (url, options, retryCount = 0) => {
  const MAX_RETRIES = 5;
  const DELAYS = [1000, 2000, 4000, 8000, 16000];
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 429 && retryCount < MAX_RETRIES) {
        await new Promise(res => setTimeout(res, DELAYS[retryCount]));
        return fetchWithExponentialBackoff(url, options, retryCount + 1);
      }
      throw new Error(data.error?.message || `HTTP ${response.status}`);
    }
    return data;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      await new Promise(res => setTimeout(res, DELAYS[retryCount]));
      return fetchWithExponentialBackoff(url, options, retryCount + 1);
    }
    throw error;
  }
};

const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result.split(',')[1]);
  reader.onerror = reject;
});

export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [uiLang, setUiLang] = useState("zh");
  const [files, setFiles] = useState([]);
  const [customInfo, setCustomInfo] = useState(""); 
  const [analysisReport, setAnalysisReport] = useState(null);
  const [posters, setPosters] = useState([]);
  const [errorInfo, setErrorInfo] = useState(null);
  const [selectedPosterIds, setSelectedPosterIds] = useState(['01', '02', '03']); 
  const [zoomedImage, setZoomedImage] = useState(null); 
  
  const [config, setConfig] = useState({
    style: 'mag',
    typoEffect: 'mag_typo',
    ratio: '9:16',
    outputMode: 'bilingual',
    resolution: 'standard'
  });

  // UX Optimization: Track the config used for the last generation
  const [lastGenConfig, setLastGenConfig] = useState(null);

  const t = (zh, en) => uiLang === 'zh' ? zh : en;

  // Determine if current config is different from the one used for generation
  // 修正逻辑：排除 resolution 字段的干扰，画质调整不应触发 Prompt 重新生成警告
  const isConfigDirty = lastGenConfig && (() => {
    const { resolution: r1, ...c1 } = config;
    const { resolution: r2, ...c2 } = lastGenConfig;
    return JSON.stringify(c1) !== JSON.stringify(c2);
  })();

  const copyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try { document.execCommand('copy'); } catch (err) { console.error(err); }
    document.body.removeChild(textArea);
  };

  const renderSafeText = (data) => {
    if (data === null || data === undefined) return "";
    if (typeof data === 'string') return data;
    if (Array.isArray(data)) {
      return (
        <ul className="list-disc ml-4 space-y-1 mt-1">
          {data.map((item, idx) => <li key={idx} className="text-[13px]">{renderSafeText(item)}</li>)}
        </ul>
      );
    }
    // Handle localized objects {zh, en} automatically if passed directly
    if (typeof data === 'object' && data.zh && data.en) {
      return t(data.zh, data.en);
    }
    if (typeof data === 'object') {
      return (
        <div className="text-[12px] leading-relaxed border-l-2 border-indigo-100 pl-3 py-1 bg-slate-50 dark:bg-slate-900/50 rounded mt-1">
          {Object.entries(data).map(([key, val]) => (
            <div key={key} className="flex gap-2">
              <span className="font-semibold text-slate-400 uppercase text-[9px] shrink-0">{key}:</span>
              <span className="opacity-70 text-[11px]">{typeof val === 'object' ? JSON.stringify(val) : String(val)}</span>
            </div>
          ))}
        </div>
      );
    }
    return String(data);
  };

  const handleAnalysis = async () => {
    if (!apiKey || (files.length === 0 && !customInfo)) return;
    setLoading(true);
    setErrorInfo(null);
    setStatusMsg(t("正在进行产品多模态识别...", "Analyzing visual assets..."));
    
    try {
      const heroImage = files[0];
      let inlineData = null;
      if (heroImage) {
        const base64 = await fileToBase64(heroImage.file);
        inlineData = { mimeType: heroImage.file.type, data: base64 };
      }

      // 优化 Prompt，让 AI 返回 bilingual 字段，方便前端切换
      const prompt = `你是一个顶级的电商多模态视觉分析师。请分析素材输出识别报告。
      任务：
      1. 如果提供描述文字或链接，请结合分析。如果包含网址，使用 google_search 抓取信息。
      2. 提取品牌名(CN/EN)。
      3. 提取 5 个具备高度吸引力的核心卖点(USP)，包含中英文。
      4. 识别材质感与整体调性。
      
      返回严格 JSON 格式，字段结构如下 (Schema):
      {
        "brand": { "zh": "中文品牌名", "en": "英文品牌名" },
        "productType": { "zh": "产品品类(中文)", "en": "Product Category (English)" },
        "sellingPoints": [{ "zh": "卖点中文", "en": "卖点英文" }],
        "material": { "zh": "材质描述(中文)", "en": "Material (English)" },
        "tonality": { "zh": "调性关键词(中文)", "en": "Tonality (English)" },
        "targetAudience": { "zh": "目标受众(中文)", "en": "Target Audience (English)" }
      }`;

      const response = await fetchWithExponentialBackoff(`${API_BASE}/${MODEL_TEXT}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `额外信息: ${customInfo}\n\n指令: ${prompt}` }, ...(inlineData ? [{ inlineData }] : [])] }],
          tools: [{ "google_search": {} }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
        })
      });

      const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text;
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("无法解析识别引擎返回的数据。");
      setAnalysisReport(JSON.parse(jsonMatch[0]));
      setStep(2);
    } catch (error) {
      setErrorInfo("识别系统异常: " + error.message);
    } finally { setLoading(false); }
  };

  const generatePosterSystem = async () => {
    if (selectedPosterIds.length === 0) return;
    setLoading(true);
    setErrorInfo(null);
    setStatusMsg(t("执行导演逻辑并进行多语种视觉规划...", "Executing Director Logic & Planning..."));
    
    try {
      const selectedStyle = VISUAL_STYLES.find(s => s.id === config.style);
      const selectedTypo = TYPO_EFFECTS.find(t => t.id === config.typoEffect);
      const selectedThemes = POSTER_THEMES.filter(t => selectedPosterIds.includes(t.id));
      const langObj = OUTPUT_LANGS.find(l => l.id === config.outputMode);

      const metaPrompt = `
        你现在是顶级视觉导演。请针对选定的海报主题生成完整策划方案：
        ${selectedThemes.map(t => `- ${t.name}`).join('\n')}

        【核心强制要求 - 多语种渲染逻辑】：
        1. 当前目标语种是：${langObj.name}。
        2. **在 prompt_en (生图提示词) 中，你必须显式包含该语种的实际翻译字符**。
           - 例如如果是日语，提示词必须写：Render the Japanese text "新発売" clearly...
           - 严禁只在描述里写“日文”，必须把翻译后的【实际字符】写进 prompt_en。
        3. 确保所有 UI 文字（标题、按钮等）在该语种下地道且专业。

        【视觉规格】：
        1. 风格：${selectedStyle.name} (${selectedStyle.en})。
        2. 排版效果：${selectedTypo.name}。
        
        【核心策划准则】：
        1. 海报01必须是 KV 主视觉图。每张必须包含强力约束："根据上传的产品图，可根据所选场景风格做对应的风格转绘，必须 1:1"。
        2. 提示词逻辑：严格遵循元提示词逻辑，包含 600-1000 字的 description_zh 说明。
        
        输出 JSON 数组，必须包含以下中英文双语字段以便UI切换：
        id, 
        title_zh, title_en, 
        description_zh, description_en, 
        layout_guide_zh, layout_guide_en, 
        prompt_en (含实际语种字符), 
        negative_prompt, 
        display_restore_req.
        
        **IMPORTANT: Output ONLY the raw JSON array. Do not include any markdown formatting or explanation text.**`;

      const response = await fetchWithExponentialBackoff(`${API_BASE}/${MODEL_TEXT}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `识别报告：${JSON.stringify(analysisReport)}. 指令：${metaPrompt}` }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      const rawText = response.candidates[0].content.parts[0].text;
      
      let data = null;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        const markdownMatch = rawText.match(/```json\s*(\[[\s\S]*?\])\s*```/);
        if (markdownMatch) {
          try {
            data = JSON.parse(markdownMatch[1]);
          } catch (e2) { /* continue */ }
        }
      }

      if (!data) {
        const start = rawText.indexOf('[');
        if (start !== -1) {
          let end = rawText.lastIndexOf(']');
          while (end > start) {
            try {
              const potentialJson = rawText.substring(start, end + 1);
              data = JSON.parse(potentialJson);
              break; 
            } catch (e) {
              end = rawText.lastIndexOf(']', end - 1);
            }
          }
        }
      }

      if (!data) throw new Error("方案策划解析失败，模型返回了非标准 JSON 格式。");
      
      setPosters(data.map(p => ({ ...p, isEditing: false })));
      // Update the last generated config to the current config
      setLastGenConfig({ ...config });
      setStep(3);
    } catch (error) {
      setErrorInfo("策划系统异常: " + error.message);
    } finally { setLoading(false); }
  };

  const handleRethink = async (index) => {
    const updated = [...posters];
    const targetPoster = updated[index];
    updated[index].isRethinking = true;
    setPosters([...updated]);
    
    try {
      const selectedStyle = VISUAL_STYLES.find(s => s.id === config.style);
      const selectedTypo = TYPO_EFFECTS.find(t => t.id === config.typoEffect);
      const themeDef = POSTER_THEMES.find(t => t.id === targetPoster.id);
      const langObj = OUTPUT_LANGS.find(l => l.id === config.outputMode);
      
      const prompt = `
        你现在是顶级视觉导演。请重新构思这张海报的视觉策划方案 (Re-think / Variant Generation)。
        目标是保留主题核心，但提供完全不同的创意角度、构图或文案切入点。
        
        【目标海报主题】：${themeDef ? themeDef.name : targetPoster.title_zh}
        【原始定义】：${themeDef ? themeDef.desc : '保持当前主题核心，但尝试不同的创意角度'}
        
        【核心强制要求】：
        1. 语种：${langObj.name} (Prompt中必须包含翻译后的实际字符)。
        2. 风格：${selectedStyle.name}。
        3. 创新性：必须尝试与之前不同的切入点或构图，提供新鲜感。
        
        输出单个 JSON 对象 (严格的单对象格式，非数组)，包含：
        id (保持 "${targetPoster.id}"), 
        title_zh, title_en, 
        description_zh, description_en, 
        layout_guide_zh, layout_guide_en, 
        prompt_en, 
        negative_prompt, 
        display_restore_req.
        
        **IMPORTANT: Output ONLY the raw JSON object.**`;

      const response = await fetchWithExponentialBackoff(`${API_BASE}/${MODEL_TEXT}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `识别报告：${JSON.stringify(analysisReport)}. 指令：${prompt}` }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      const rawText = response.candidates[0].content.parts[0].text;
      let newData = null;
      try {
          newData = JSON.parse(rawText);
      } catch(e) {
          const match = rawText.match(/\{[\s\S]*\}/);
          if(match) newData = JSON.parse(match[0]);
      }

      if (!newData) throw new Error("Re-think 数据解析失败");

      updated[index] = { ...updated[index], ...newData, imageUrl: null, isRethinking: false, isEditing: false }; 
      setPosters([...updated]);

    } catch (error) {
       setErrorInfo("Re-think 失败: " + error.message);
       updated[index].isRethinking = false;
       setPosters([...updated]);
    }
  };

  const renderPoster = async (index) => {
    // 1. 设置 Loading 状态 (使用安全的更新方式)
    setPosters(prev => {
        const newPosters = [...prev];
        newPosters[index] = { ...newPosters[index], isGenerating: true };
        return newPosters;
    });

    const poster = posters[index]; // 注意：这里闭包获取的是旧的 poster，但下面的逻辑不依赖 isGenerating 状态本身，所以没问题
    const styleObj = VISUAL_STYLES.find(s => s.id === config.style);
    const langObj = OUTPUT_LANGS.find(l => l.id === config.outputMode);

    console.log(`[Tracking] Starting render for poster ${index}. Resolution Mode: ${config.resolution}`);

    try {
      // Use English layout guide for generation if available, fallback to regular
      const layoutGuideForGen = poster.layout_guide_en || poster.layout_guide || "";

      const finalSuperPrompt = `
      [TARGET LANGUAGE]: ${langObj.name}
      [SPEC]: Commercial Poster, Ratio ${config.ratio}, Style ${styleObj.en}, 8k, High Resolution. 
      [SCENE & TEXT]: ${poster.prompt_en} 
      [LAYOUT LOGIC]: ${layoutGuideForGen} 
      [NEGATIVE]: ${poster.negative_prompt} 
      [MANDATORY]: Strictly restore product packaging 1:1. Texture: ${analysisReport.material?.en || analysisReport.material || "High Quality"}.`;
      
      let parts = [{ text: finalSuperPrompt }];
      if (files[0]) {
        const base64 = await fileToBase64(files[0].file);
        parts.push({ inlineData: { mimeType: files[0].file.type, data: base64 } });
      }

      const generationConfig = {
        responseModalities: ['IMAGE'],
        imageConfig: {
          aspectRatio: config.ratio
        }
      };

      if (config.resolution === '2K' || config.resolution === '4K') {
        generationConfig.imageConfig.imageSize = config.resolution;
      }

      console.log(`[Tracking] Payload Config:`, JSON.stringify(generationConfig));
      
      const response = await fetchWithExponentialBackoff(`${API_BASE}/${MODEL_IMAGE}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contents: [{ parts }], 
          generationConfig: generationConfig
        })
      });
      
      console.log(`[Tracking] API Response Status:`, response);

      if (response.error) {
        console.error(`[Tracking] API Error Detail:`, response.error);
        throw new Error(`API Error: ${response.error.message} (Code: ${response.error.code})`);
      }

      let b64 = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data || response.predictions?.[0]?.bytesBase64Encoded;
      
      if (!b64) {
         console.error(`[Tracking] Missing base64 data. Full Candidate:`, response.candidates);
         throw new Error("渲染引擎返回了成功状态，但未包含图像数据。请检查控制台 Log。");
      }

      if (b64) {
          // 成功获取图片，更新状态 (解除 loading, 设置 imageUrl)
          setPosters(prev => {
            const newPosters = [...prev];
            newPosters[index] = { 
                ...newPosters[index], 
                imageUrl: `data:image/png;base64,${b64}`,
                isGenerating: false
            };
            return newPosters;
          });
          console.log(`[Tracking] Image successfully rendered for poster ${index}`);
      }
    } catch (error) {
      console.error(`[Tracking] Critical Render Error:`, error);
      alert("渲染失败 (详细错误已记录在 Console): " + error.message);
      // 发生错误，仅解除 loading 状态
      setPosters(prev => {
        const newPosters = [...prev];
        newPosters[index] = { ...newPosters[index], isGenerating: false };
        return newPosters;
      });
    }
  };

  const handleDownload = (base64, filename) => {
    const link = document.createElement("a");
    link.href = base64;
    link.download = `${filename || 'KV-Master-Poster'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const togglePosterSelection = (id) => {
    setSelectedPosterIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleEdit = (index) => {
    const updated = [...posters];
    updated[index].isEditing = !updated[index].isEditing;
    setPosters(updated);
  };

  const handlePromptChange = (index, value) => {
    const updated = [...posters];
    updated[index].prompt_en = value;
    setPosters(updated);
  };

  // Helper to extract descriptive part of the poster theme name
  const getPosterLabel = (poster) => {
      const theme = POSTER_THEMES.find(t => t.id === poster.id);
      if (!theme) return `#${poster.id}`;

      // Function to extract text after " - "
      const extractName = (fullName) => {
          const parts = fullName.split(' - ');
          return parts.length > 1 ? parts[1] : fullName;
      };

      const zhName = extractName(theme.name);
      const enName = extractName(theme.en);

      return t(zhName, enName);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-700 dark:text-slate-300 font-sans pb-32 text-[14px]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20"><Sparkles className="text-white" size={18} fill="white" /></div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white uppercase">KV Master <span className="text-indigo-600 font-bold italic">Pro</span></h1>
          </div>
          <button onClick={() => setUiLang(uiLang === 'zh' ? 'en' : 'zh')} className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-white transition-all uppercase tracking-widest">{uiLang === 'zh' ? 'ENGLISH' : '中文'}</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10">
        {errorInfo && (
          <div className="max-w-4xl mx-auto mb-8 animate-in slide-in-from-top-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-600 shadow-sm">
              <AlertCircle size={18} />
              <p className="text-xs font-medium flex-1">{errorInfo}</p>
              <button onClick={() => setErrorInfo(null)} className="text-[10px] font-bold px-3 py-1 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-red-100">忽略</button>
            </div>
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{t("产品特征多模态识别", "Asset Recognition")}</h2>
              <p className="text-slate-500 font-medium text-base">{t("上传核心原型图、网页链接或品牌文案，构建视觉策划报告。", "Build high-level vision plans via AI analysis.")}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-xl shadow-slate-200/30 dark:shadow-none space-y-8">
                <div className="space-y-3">
                   <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest ml-1">AI Studio API Key</label>
                   <input type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-sm transition-all" placeholder="Enter key..." />
                </div>
                <div className="group relative border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center cursor-pointer hover:border-indigo-500 transition-all duration-300" onClick={()=>document.getElementById('fileIn').click()}>
                  <input id="fileIn" type="file" multiple className="hidden" onChange={e=>{
                    const newFiles = Array.from(e.target.files).map(f => ({ id: Math.random(), file: f, preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null }));
                    setFiles([...files, ...newFiles]);
                  }} />
                  <FileUp size={32} className="mx-auto text-indigo-600 mb-4 opacity-80" />
                  <h4 className="font-semibold text-base text-slate-800 dark:text-slate-100">{t("上传视觉原型图", "Hero Shot")}</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 ml-1 text-slate-500"><Globe size={14} /><label className="text-[11px] font-semibold uppercase tracking-widest">{t("链接或文本说明", "Context / URLs")}</label></div>
                  <textarea value={customInfo} onChange={e => setCustomInfo(e.target.value)} className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none text-[13px] leading-relaxed resize-none font-medium focus:border-indigo-400" placeholder={t("粘贴详情页链接或品牌手册文案...", "Paste URL or text context...")} />
                </div>
              </div>
              <div className="space-y-6 flex flex-col">
                <div className="grid grid-cols-1 gap-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar flex-1">
                  {files.length === 0 && <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem] text-slate-300 italic"><ImageIcon size={36} strokeWidth={1} /><p className="text-xs mt-2">暂无图像素材</p></div>}
                  {files.map(f => (
                    <div key={f.id} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 shadow-sm animate-in zoom-in-95">
                      {f.preview ? <img src={f.preview} className="w-14 h-14 rounded-xl object-cover shadow-sm" /> : <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400"><FileText size={20} /></div>}
                      <div className="flex-1 min-w-0"><div className="text-[13px] font-semibold truncate text-slate-800 dark:text-slate-100">{f.file.name}</div></div>
                      <button onClick={()=>setFiles(files.filter(x=>x.id!==f.id))} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
                {(files.length > 0 || customInfo) && (
                  <button onClick={handleAnalysis} className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-base font-semibold rounded-2xl shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 active:scale-95">{t("启动智能识别", "Start Analysis")}</button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && analysisReport && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-700">
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 border border-slate-200 shadow-xl space-y-12">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">【{t("分析识别报告", "Analysis Report")}】</h2>
              <div className="grid grid-cols-2 gap-10 border-b pb-10 border-slate-100 dark:border-slate-800 text-[15px]">
                <div><label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">{t("品牌", "Brand")}</label><div className="font-bold text-indigo-600 text-2xl">{t(analysisReport?.brand?.zh, analysisReport?.brand?.en) || analysisReport?.brand?.zh}</div></div>
                <div><label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">{t("品类", "Category")}</label><div className="font-semibold text-slate-800 dark:text-slate-200 text-xl">{t(analysisReport?.productType?.zh, analysisReport?.productType?.en) || renderSafeText(analysisReport?.productType)}</div></div>
              </div>
              <div className="space-y-6">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">{t("5 核心卖点方案", "5 Core Selling Points")}</label>
                <div className="grid grid-cols-1 gap-4">
                  {analysisReport?.sellingPoints?.map((sp, i) => (
                    <div key={i} className="flex items-center gap-5 bg-[#F8FAFC] dark:bg-slate-950/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 transition-all">
                      <span className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 text-indigo-600 flex items-center justify-center text-lg font-bold border border-slate-100 shadow-sm">{i+1}</span>
                      <div className="flex-1"><div className="font-semibold text-base text-slate-900 dark:text-slate-100">{t(sp?.zh, sp?.en)}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6 sticky top-24 h-fit">
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8">
                <h3 className="text-xl font-bold flex items-center gap-3 text-slate-900 dark:text-white"><Settings size={18} className="text-indigo-500" /> {t("全链路参数配置", "KV Planning")}</h3>
                
                <div className="space-y-4">
                   <div className="space-y-3">
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">{t("视觉场景风格", "Visual Style")}</label>
                      <select className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl font-bold text-indigo-600 outline-none text-xs" value={config.style} onChange={e=>setConfig({...config, style:e.target.value})}>{VISUAL_STYLES.map(s=><option key={s.id} value={s.id}>{t(s.name, s.en)}</option>)}</select>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">{t("文字排版效果", "Typography Effect")}</label>
                      <select className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl font-bold text-indigo-600 outline-none text-xs" value={config.typoEffect} onChange={e=>setConfig({...config, typoEffect:e.target.value})}>{TYPO_EFFECTS.map(e=><option key={e.id} value={e.id}>{t(e.name, e.en)}</option>)}</select>
                   </div>
                   <div className="grid grid-cols-2 gap-4 text-[11px]">
                      <div className="space-y-2"><label className="font-semibold text-slate-400 uppercase tracking-wider">{t("画面比例", "Aspect Ratio")}</label><select className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl font-bold text-indigo-600 outline-none text-xs" value={config.ratio} onChange={e=>setConfig({...config, ratio:e.target.value})}>{RATIOS.map(r=><option key={r.value} value={r.value}>{t(r.label, r.en)}</option>)}</select></div>
                      <div className="space-y-2"><label className="font-semibold text-slate-400 uppercase tracking-wider">{t("内容语种", "Target Language")}</label><select className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl font-bold text-indigo-600 outline-none text-xs" value={config.outputMode} onChange={e=>setConfig({...config, outputMode:e.target.value})}>{OUTPUT_LANGS.map(l=><option key={l.id} value={l.id}>{t(l.name, l.en)}</option>)}</select></div>
                   </div>
                   {/* 新增分辨率选择 - 已默认标准 */}
                   <div className="space-y-2 pt-2">
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Monitor size={12}/> {t("渲染画质", "Render Quality")}</label>
                      <select className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl font-bold text-indigo-600 outline-none text-xs" value={config.resolution} onChange={e=>setConfig({...config, resolution:e.target.value})}>
                        {RESOLUTIONS.map(r=><option key={r.value} value={r.value}>{t(r.label, r.en)}</option>)}
                      </select>
                   </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-100">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">{t("海报主题选择 (多选系统)", "Poster Theme Selection")}</label>
                  <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {POSTER_THEMES.map(theme => (
                      <button key={theme.id} onClick={() => togglePosterSelection(theme.id)} className={`flex flex-col p-3 rounded-2xl border text-left transition-all ${selectedPosterIds.includes(theme.id) ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}>
                        <div className="flex items-center gap-2">
                           <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedPosterIds.includes(theme.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'}`}>{selectedPosterIds.includes(theme.id) && <Check size={10} strokeWidth={4}/>}</div>
                           <div className="text-[12px] font-bold">{t(theme.name, theme.en)}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 智能生成的按钮文案变化 */}
                <button 
                  onClick={generatePosterSystem} 
                  className={`w-full py-6 text-white text-base font-bold rounded-2xl shadow-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 tracking-widest uppercase ${isConfigDirty ? "bg-amber-600 animate-pulse" : "bg-indigo-600"}`}
                >
                  {isConfigDirty ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} fill="white" />}
                  {isConfigDirty ? t("配置已变更，刷新方案", "Config Changed, Refresh Plan") : t("生成方案全集", "Generate Masterboard")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-24 animate-in fade-in duration-1000 max-w-[1200px] mx-auto">
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white italic">Director's <span className="text-indigo-600 font-extrabold">Masterboard</span></h2>
              {/* 去掉模型名提示 */}
              <p className="text-slate-500 font-semibold uppercase tracking-[0.5em] text-[11px] opacity-60">Powered by KV Master Pro AI</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              {posters.map((p, i) => (
                <div key={i} className="group bg-white dark:bg-slate-900 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col hover:border-indigo-500/20 transition-all duration-500">
                  <div className={`relative bg-slate-50 dark:bg-slate-950 aspect-[${config.ratio.replace(':','/')}] overflow-hidden flex items-center justify-center border-b border-slate-100 dark:border-slate-800`}>
                    {p.imageUrl && !p.isGenerating ? (
                      <>
                        <img src={p.imageUrl} className="w-full h-full object-cover animate-in fade-in" />
                        
                        {/* 优化后的中心悬停交互区域 */}
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                           <button onClick={() => setZoomedImage(p.imageUrl)} className="p-3 bg-white/20 backdrop-blur-md border border-white/40 text-white rounded-2xl hover:bg-white hover:text-indigo-600 transition-all shadow-xl hover:scale-110">
                              <Maximize2 size={24} strokeWidth={2}/>
                           </button>
                           <button onClick={() => handleDownload(p.imageUrl, p.title)} className="p-3 bg-white/20 backdrop-blur-md border border-white/40 text-white rounded-2xl hover:bg-white hover:text-indigo-600 transition-all shadow-xl hover:scale-110">
                              <Download size={24} strokeWidth={2}/>
                           </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-20 text-center text-slate-200">
                        {p.isGenerating ? <div className="flex flex-col items-center gap-6"><Loader2 className="animate-spin text-indigo-500" size={56} strokeWidth={2} /><p className="text-[11px] font-bold text-indigo-500 tracking-[0.4em] uppercase animate-pulse">Rendering...</p></div> : <ImageIcon size={100} className="opacity-10 mx-auto" />}
                      </div>
                    )}
                    
                    {/* Render/Re-render Button Logic */}
                    {!p.isGenerating && (
                       // 如果没有图片（首次），则常驻显示。如果有图片（Re-render），则默认隐藏，hover显示
                       <button 
                         onClick={()=>renderPoster(i)} 
                         className={`absolute bottom-6 px-6 py-2.5 bg-indigo-600/90 hover:bg-indigo-600 text-white font-bold rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-2 text-[12px] tracking-widest uppercase border border-white/20 hover:scale-105 active:scale-95 ${p.imageUrl ? "opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0" : "opacity-100"}`}
                       >
                         {p.imageUrl ? <RefreshCw size={14} /> : <Zap size={14} fill="white" />}
                         {p.imageUrl ? t("重新渲染", "Re-Render") : t("执行场景渲染", "Render Scene")}
                       </button>
                    )}
                  </div>
                  <div className="p-12 space-y-12 flex-1 flex flex-col">
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        {/* 优化后的 SCENE 标签 */}
                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest border leading-none h-6 flex items-center ${i === 0 ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'}`}>
                          {getPosterLabel(p)}
                        </div>
                        {/* 简化 Re-think 按钮 (只保留图标) */}
                        <button 
                          onClick={() => handleRethink(i)}
                          disabled={p.isRethinking || p.isGenerating}
                          title={t("重新构思", "Re-think")}
                          className="flex items-center justify-center w-8 h-8 rounded-full text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors disabled:opacity-50"
                        >
                          <RefreshCw size={14} className={p.isRethinking ? "animate-spin" : ""} />
                        </button>
                      </div>
                      {/* 标题中英文切换 */}
                      <h3 className="text-3xl font-bold tracking-tight leading-tight text-slate-900 dark:text-white">{t(p.title_zh, p.title_en) || p.title_zh || p.title}</h3>
                      {/* 隐藏中文描述 */}
                      {/* <div className="text-[14px] text-slate-500 leading-relaxed font-medium">{renderSafeText(p.description_zh)}</div> */}
                    </div>
                    {/* 隐藏产品还原逻辑 */}
                    {/* <div className="bg-indigo-50/40 dark:bg-indigo-950/20 p-7 rounded-[2rem] border border-indigo-100/50 space-y-3">
                       <h5 className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2"><Check size={14} /> 产品还原逻辑</h5>
                       <div className="text-[12px] text-slate-500 leading-relaxed italic font-medium">{renderSafeText(p.display_restore_req)}</div>
                    </div> */}
                    <div className="space-y-6 mt-auto">
                      <div className="p-8 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] space-y-5 relative">
                        <div className="flex justify-between items-center px-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Super Prompt</label>
                          <div className="flex gap-4">
                             <button onClick={()=>toggleEdit(i)} className={`p-2 transition-all rounded-lg ${p.isEditing ? 'bg-green-50 text-green-600' : 'text-slate-300 hover:text-indigo-600 hover:bg-white shadow-sm'}`}>{p.isEditing ? <Check size={18} strokeWidth={3} /> : <Pencil size={18} />}</button>
                             <button onClick={()=>copyToClipboard(String(p.prompt_en))} className="p-2 text-slate-300 hover:text-indigo-600 transition-all hover:bg-white rounded-lg shadow-sm"><Copy size={18}/></button>
                          </div>
                        </div>
                        {p.isEditing ? <textarea value={p.prompt_en} onChange={(e)=>handlePromptChange(i, e.target.value)} className="w-full h-40 bg-white dark:bg-slate-900 border-2 border-indigo-100 rounded-2xl p-5 text-[12px] font-mono leading-relaxed outline-none transition-all focus:ring-4 focus:ring-indigo-500/10" /> : <div className="text-[12px] font-mono text-slate-500 dark:text-slate-400 leading-relaxed max-h-48 overflow-y-auto scrollbar-hide px-1">{renderSafeText(p.prompt_en)}</div>}
                      </div>
                    </div>
                    <div className="pt-10 border-t border-slate-100 dark:border-slate-800 mt-6">
                      <h5 className="text-[11px] font-bold flex items-center gap-3 mb-4 text-indigo-600 uppercase tracking-widest"><Layers size={18}/> {t("排版布局细节", "Layout Details")}</h5>
                      {/* 布局细节中英文切换 */}
                      <div className="text-[12px] text-slate-500 leading-relaxed bg-white dark:bg-slate-950/50 p-6 rounded-3xl italic border border-slate-100 shadow-inner">{t(p.layout_guide_zh, p.layout_guide_en) || p.layout_guide_zh || p.layout_guide}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="py-24 text-center border-t border-slate-200 dark:border-slate-800">
               <button onClick={()=>{setStep(1); setPosters([]); setAnalysisReport(null);}} className="px-16 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xl font-bold rounded-[3rem] shadow-2xl transition-all hover:scale-105">{t("重启设计工作流", "Restart Workflow")}</button>
            </div>
          </div>
        )}
      </main>

      {zoomedImage && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300" onClick={() => setZoomedImage(null)}>
          <button className="absolute top-6 right-6 p-4 text-white hover:text-indigo-400 bg-white/10 rounded-full"><X size={32} strokeWidth={2.5}/></button>
          <img src={zoomedImage} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95" alt="Original KV Preview" />
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 z-[100] bg-white/90 dark:bg-[#020617]/95 backdrop-blur-3xl flex flex-col items-center justify-center p-10 text-center animate-in fade-in">
          <div className="relative mb-12 scale-[1.3]">
            <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full animate-pulse" />
            <Loader2 className="animate-spin text-indigo-600 relative z-10" size={100} strokeWidth={2.5} />
            <Zap className="absolute inset-0 m-auto text-indigo-600" size={32} fill="currentColor" />
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 italic tracking-tighter uppercase">{statusMsg}</h3>
        </div>
      )}

      {/* Floating Bottom Nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-6 py-3 bg-slate-900/95 dark:bg-white/95 backdrop-blur-2xl rounded-full border border-white/20 dark:border-slate-800 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] flex items-center gap-10 text-white dark:text-slate-900 transition-all duration-300">
        <button onClick={()=>setStep(1)} className="flex flex-col items-center gap-0.5 hover:scale-110 transition-transform opacity-70 hover:opacity-100">
          <FileUp size={18}/><span className="text-[9px] font-bold uppercase">{t("素材", "Asset")}</span>
        </button>
        <div className="w-px h-5 bg-white/10 dark:bg-slate-200" />
        <button onClick={()=>setStep(2)} disabled={!analysisReport} className="disabled:opacity-20 flex flex-col items-center gap-0.5 hover:scale-110 transition-transform opacity-70 hover:opacity-100">
          <Layout size={18}/><span className="text-[9px] font-bold uppercase">{t("策划", "Plan")}</span>
        </button>
        <div className="w-px h-5 bg-white/10 dark:bg-slate-200" />
        <button onClick={()=>setStep(3)} disabled={posters.length === 0} className="disabled:opacity-20 flex flex-col items-center gap-0.5 hover:scale-110 transition-transform opacity-70 hover:opacity-100">
          <Sparkles size={18}/><span className="text-[9px] font-bold uppercase">{t("视觉板", "Board")}</span>
        </button>
      </div>
    </div>
  );
}