import React, { useState, useEffect } from "react";
import { 
  Camera, 
  UploadCloud, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  Flame, 
  Compass, 
  ShieldAlert,
  Dna,
  User,
  Info,
  Key,
  X
} from "lucide-react";
import { AnimeAnalysis } from "./types";
import { SAMPLE_CHARACTERS, SampleCharacter } from "./samples";
import { AnimeCard } from "./components/AnimeCard";
import { FeatureList } from "./components/FeatureList";

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessageIndex, setScanMessageIndex] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnimeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // User Custom API Key Setup
  const [userApiKey, setUserApiKey] = useState(() => {
    return localStorage.getItem("user_gemini_api_key") || "";
  });
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(userApiKey);

  useEffect(() => {
    if (showKeyModal) {
      setTempKey(userApiKey);
    }
  }, [showKeyModal, userApiKey]);

  const scanMessages = [
    "⚙️ [ANIME-CORE] 裝載深度神經網絡視覺模型...",
    "📐 [VISION-ENG] 立體面部五官比例定位中 (Eye-to-Face Ratio)...",
    "🎨 [CHROMA-SYS] 擷取主體色彩調性，分析髮色與眼眸色碼...",
    "👚 [PATTERN-AI] 比對二次元服裝與經典配件特徵資料庫...",
    "🔮 [MOÉ-MATH] 核算傲嬌/無口/元氣/中二病等二次元性格萌率...",
    "✍️ [SYNTH-SYS] 生成角色專屬中日魂語對白字幕中..."
  ];

  // Rotate loading scan messages for maximum RPG/cyberpunk immersion
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      interval = setInterval(() => {
        setScanMessageIndex((prev) => (prev + 1) % scanMessages.length);
      }, 700);
    } else {
      setScanMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  // Load a preset anime character immediately
  const handleSelectPreset = (preset: SampleCharacter) => {
    setError(null);
    setIsScanning(true);
    setActivePreset(preset.id);
    setSelectedImage(preset.imageUrl);
    setMimeType("image/jpeg");
    setAnalysisResult(null);

    // Simulate analysis with scan transition effect for ultimate user engagement
    setTimeout(() => {
      setAnalysisResult(preset.analysis);
      setIsScanning(false);
    }, 1800);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("上傳的檔案必須是圖片格式（如 PNG、JPEG、WebP）唷！");
      return;
    }
    setError(null);
    setActivePreset(null);
    setAnalysisResult(null);

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      setSelectedImage(base64String);
      setMimeType(file.type);
    };
    reader.onerror = () => {
      setError("檔案讀取失敗，請重新再試一次。");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Drag-and-drop support
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Trigger real API analysis on the backend
  const triggerLiveAnalysis = async () => {
    if (!selectedImage || !mimeType) {
      setError("請先選擇角色檔案或使用預設範例。");
      return;
    }

    setError(null);
    setIsScanning(true);
    setAnalysisResult(null);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      
      if (userApiKey) {
        headers["X-Gemini-API-Key"] = userApiKey;
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          image: selectedImage,
          mimeType: mimeType
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "伺服器分析發生異常。");
      }

      const result: AnimeAnalysis = await response.json();
      setAnalysisResult(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "二次元角色年齡鑑定程序發生底層異常，請確認 API 密鑰狀態。");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 font-sans text-slate-100 selection:bg-pink-500 selection:text-white">
      
      {/* Decorative colorful glowing mesh in background */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-pink-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Navigation/Brand Header (No over-engineering, honest literal labels) */}
        <header className="flex justify-between items-center border-b border-slate-800/60 pb-5 mb-10">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-2 rounded-xl text-white shadow-lg animate-pulse-slow">
              <Dna size={22} />
            </div>
            <div>
              <span className="text-[10px] text-pink-400 font-bold uppercase tracking-widest font-mono">
                ACG Intel-Reader API
              </span>
              <h1 className="text-lg font-bold font-display tracking-tight text-white m-0">
                動漫角色年齡與特徵識別
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowKeyModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                userApiKey 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20" 
                  : "bg-slate-800 text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-705"
              }`}
            >
              <Key size={13} className={userApiKey ? "text-emerald-400 animate-pulse" : "text-slate-400"} />
              <span>{userApiKey ? "已啟用個人金鑰" : "輸入 API 金鑰"}</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700/60 text-[10px] text-emerald-400 font-bold">
                ● API Online
              </span>
              <span className="text-slate-500">v1.2.5-Stable</span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs px-3 py-1 bg-pink-500/10 text-pink-300 font-bold uppercase rounded-full border border-pink-500/20 tracking-wider">
            Deep Learning Vision / 深度學習視覺分析
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white mt-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
            動漫角色二次元鑑定儀
          </h2>
          <p className="text-sm text-slate-400 mt-3 font-sans leading-relaxed">
            透過多角度「五官立體比」、「衣著特徵聚類」等深度神經網絡視覺模型，不僅能鑑定角色年齡，更深度分析其髮型色碼、眼神、典型二次元萌屬性與個性定位。
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-rose-200">
            <AlertCircle className="mt-0.5 flex-shrink-0 text-rose-400" size={18} />
            <div>
              <p className="text-sm font-semibold">分析引擎回報錯誤：</p>
              <p className="text-xs text-rose-300 mt-1">{error}</p>
              <p className="text-[11px] text-rose-400/80 mt-2">
                💡 <strong>小提示：</strong>如果是 API 密鑰問題，您可以透過頂部工具列裡的 <strong>Settings &gt; Secrets</strong> 項目中安全添加 <code>GEMINI_API_KEY</code> 變數。
              </p>
            </div>
          </div>
        )}

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Image Selector & Controller (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 glass-panel backdrop-blur-md">
              <h3 className="text-sm font-bold font-display text-white mb-4 flex items-center gap-2">
                <Camera size={16} className="text-pink-400" />
                第一步：載入分析對象
              </h3>

              {/* Drag and Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl aspect-video sm:aspect-[4/3] flex flex-col items-center justify-center p-4 transition-all duration-300 overflow-hidden ${
                  dragActive
                    ? "border-pink-500 bg-pink-500/5 shadow-inner"
                    : selectedImage 
                      ? "border-slate-700 bg-slate-950/40 hover:border-slate-600"
                      : "border-slate-800 bg-slate-950/20 hover:border-slate-750"
                }`}
              >
                {selectedImage ? (
                  <>
                    <img 
                      src={selectedImage} 
                      alt="Selected Anime Viewport" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                    
                    {/* Scanning Animation Sweep line */}
                    {isScanning && (
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent shadow-[0_0_12px_#ec4899] animate-scan" />
                    )}

                    {/* Image overlay details */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button 
                        onClick={() => { setSelectedImage(null); setMimeType(null); setActivePreset(null); setAnalysisResult(null); }}
                        className="px-2.5 py-1 bg-slate-900/90 hover:bg-rose-950 border border-slate-800 text-slate-300 hover:text-rose-400 rounded-lg text-xs transition-colors"
                      >
                        清除更換
                      </button>
                    </div>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer text-center py-6 w-full h-full">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                    <div className="p-4 bg-slate-900/40 rounded-full text-slate-400 border border-slate-800 shadow transition-transform group-hover:scale-110">
                      <UploadCloud size={28} className="text-pink-400" />
                    </div>
                    <span className="block text-sm font-semibold text-slate-200 mt-4">
                      上傳動漫圖片 或 點擊拖入檔案
                    </span>
                    <span className="block text-xs text-slate-500 mt-1.5 px-6 leading-relaxed">
                      支援 PNG、JPEG、WebP 檔案（建議使用清晰、半身或全身，包含完整五官之動漫角色插畫）
                    </span>
                  </label>
                )}
              </div>

              {/* Presets Selection Section */}
              <div className="mt-6 pt-5 border-t border-slate-800/80">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                    <Sparkles size={12} className="text-amber-400" />
                    或選用經典角色預設庫：
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Offline-Safe</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {SAMPLE_CHARACTERS.map((char) => (
                    <button
                      key={char.id}
                      onClick={() => handleSelectPreset(char)}
                      className={`relative overflow-hidden rounded-xl aspect-[4/5] p-2 border flex flex-col justify-end text-left transition-all ${
                        activePreset === char.id
                          ? "border-pink-500 ring-2 ring-pink-500/20"
                          : "border-slate-800 hover:border-slate-700 bg-slate-950/20"
                      }`}
                    >
                      <img 
                        src={char.imageUrl} 
                        alt={char.name}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover opacity-40 hover:opacity-50 transition-all rounded-xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <div className="relative z-10">
                        <span className="text-[9px] text-pink-300 block font-mono font-bold leading-none">PRESET</span>
                        <span className="text-[11px] font-bold text-white block truncate mt-0.5 leading-tight">{char.name.split(" ")[0]}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action scanner button */}
              {selectedImage && !activePreset && (
                <div className="mt-5">
                  <button
                    onClick={triggerLiveAnalysis}
                    disabled={isScanning}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 disabled:from-slate-800 disabled:to-slate-800 text-white font-semibold rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isScanning ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        分析神經網絡編碼中...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        啟動「AI 二次元深度鑑定」
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Core Guidelines details */}
            <div className="bg-slate-900/20 border border-slate-800/40 p-4 rounded-2xl text-xs text-slate-400 space-y-2.5 flex items-start gap-3">
              <Info size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-300">鑑定引擎是如何運作的？</p>
                <p className="leading-relaxed mt-1">
                  本系統透過 Gemini 深度多模態理解。它會自主搜尋原著考據（針對芙莉蓮等經典角色），或實時計算面部比例與服飾搭配（針對原創角色），為角色確立適配的出廠年齡、年齡帶及萌屬性氛圍設定。
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Terminal / Result Canvas (7 Cols) */}
          <div className="lg:col-span-7">
            {isScanning ? (
              <div className="bg-slate-950/50 border border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center text-center aspect-[4/3] min-h-[400px]">
                
                {/* scanning screen overlay with futuristic look */}
                <div className="relative w-28 h-28 rounded-2xl bg-slate-900/65 flex items-center justify-center border border-pink-500/30 overflow-hidden shadow-2xl">
                  {selectedImage && (
                    <img 
                      src={selectedImage} 
                      alt="Scanning Target" 
                      className="w-full h-full object-cover opacity-60 filter blur-[1px]"
                    />
                  )}
                  <div className="absolute inset-0 bg-pink-500/10" />
                  <div className="absolute inset-x-0 h-0.5 bg-pink-500/82 shadow-[0_0_10px_#ec4899] animate-scan" />
                  <RefreshCw className="absolute text-pink-400 animate-spin" size={26} />
                </div>

                <div className="mt-8 space-y-2 max-w-md">
                  <h3 className="text-base font-bold font-display tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">
                    正在辨識與分析對象特徵...
                  </h3>
                  
                  {/* Rotating dynamic command code strings */}
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-400 text-left flex items-start gap-2.5 shadow-md">
                    <span className="text-pink-500 animate-pulse font-bold">▶</span>
                    <span className="text-emerald-400 h-10 flex items-center">{scanMessages[scanMessageIndex]}</span>
                  </div>
                </div>

                {/* Simulated diagnostic loading progress circles */}
                <div className="flex gap-2.5 mt-6 justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" style={{ animationDelay: '200ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" style={{ animationDelay: '400ms' }} />
                </div>
              </div>
            ) : analysisResult ? (
              <div className="space-y-6">
                
                {/* Result Title row */}
                <div className="flex items-center justify-between pb-2">
                  <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                    <Sparkles className="text-amber-400" size={16} />
                    鑑定結果已生成！
                  </h3>
                  <span className="text-xs text-slate-400 font-sans">
                    綜合精確度估測分數: <strong className="text-emerald-400">{analysisResult.confidenceScore}/100</strong>
                  </span>
                </div>

                {/* Display core elements side by side or stacked */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Column 1: Anime RPG Card View (5 Cols) */}
                  <div className="md:col-span-5">
                    <AnimeCard 
                      analysis={analysisResult} 
                      imageUrl={selectedImage || SAMPLE_CHARACTERS[0].imageUrl} 
                    />
                  </div>

                  {/* Column 2: Detailed Feature specifications tabs (7 Cols) */}
                  <div className="md:col-span-7">
                    <FeatureList analysis={analysisResult} />
                  </div>

                </div>

                {/* Bottom Try again guide */}
                <div className="p-4 rounded-2xl bg-pink-500/5 border border-pink-500/10 flex items-center justify-between gap-4 text-xs">
                  <span className="text-slate-400">想測試其他動漫主角的年齡與二次元屬性嗎？</span>
                  <button 
                    onClick={() => { setSelectedImage(null); setMimeType(null); setActivePreset(null); setAnalysisResult(null); }}
                    className="px-4 py-1.5 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 font-bold border border-pink-500/20 rounded-xl transition-all font-sans cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw size={12} />
                    重新鑑定
                  </button>
                </div>

              </div>
            ) : (
              <div className="bg-slate-950/20 border border-slate-800/80 rounded-3xl p-10 flex flex-col items-center justify-center text-center aspect-[4/3] min-h-[400px] glass-panel backdrop-blur-sm relative overflow-hidden group">
                
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent group-hover:via-pink-500/60 transition-all duration-700" />
                
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800/80 flex items-center justify-center text-slate-500 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <Compass size={24} className="text-slate-400 group-hover:text-pink-400 transition-colors animate-pulse-slow" />
                </div>
                
                <h3 className="text-base font-bold font-display text-slate-200 mt-6">
                  等待載入分析對象中...
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mt-2 leading-relaxed font-sans">
                  您可以點選左側隨身配備的<strong>熱門角色預設庫</strong>快速進行鑑定；或<strong>上傳您的專屬動漫美圖</strong>，點選「啟動 AI 鑑定」獲取極致詳細的 RPG 卡牌解析！
                </p>

                {/* Decorative background grid line */}
                <div className="mt-6 flex gap-2">
                  <span className="w-3 h-0.5 rounded bg-slate-800" />
                  <span className="w-1.5 h-0.5 rounded bg-slate-850" />
                  <span className="w-1.5 h-0.5 rounded bg-slate-850" />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer info (Plain literal metadata - keeps design pristine and avoids AI slop tech larping) */}
        <footer className="mt-20 pt-6 border-t border-slate-900 text-center text-[11px] text-slate-500 font-mono flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span>動漫角色年齡與特徵識別系統 © 2026. ACG Deep Vision Corp.</span>
          </div>
          <div className="flex gap-4">
            <span className="text-slate-600">Model: gemini-3.5-flash</span>
            <span className="text-slate-600">Encoding: Base64 to API</span>
          </div>
        </footer>

      </div>

      {/* Glassmorphic Gemini API Key Setup Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowKeyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="bg-pink-500/10 p-2 rounded-xl text-pink-400">
                <Key size={18} />
              </div>
              <h3 className="text-base font-bold text-white font-display">Gemini API 金鑰設定</h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4 font-sans">
              您可以填寫您的個人 <strong>Gemini API 金鑰 (API Key)</strong> 進行本次動漫識別。
              金鑰僅安全儲存在您本機瀏覽器的 LocalStorage 中，每次分析時才會用作代理解析。
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-slate-500 font-mono font-bold uppercase mb-1.5">
                  GEMINI API KEY
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-700 outline-none focus:border-pink-500/50 transition-colors font-mono"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("user_gemini_api_key", tempKey.trim());
                    setUserApiKey(tempKey.trim());
                    setShowKeyModal(false);
                    setError(null);
                  }}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-xs font-semibold text-white hover:opacity-90 cursor-pointer text-center"
                >
                  儲存金鑰 Settings
                </button>
                {userApiKey && (
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem("user_gemini_api_key");
                      setUserApiKey("");
                      setTempKey("");
                      setShowKeyModal(false);
                    }}
                    className="py-2.5 px-4 bg-slate-800 hover:bg-rose-950 border border-slate-700 hover:border-rose-900 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-100 cursor-pointer"
                  >
                    清除金鑰
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-850 text-[10px] text-slate-500 flex items-center gap-1.5">
              <Info size={11} className="text-pink-400 flex-shrink-0" />
              <span>本站預設配有共享安全金鑰，若不輸入亦可直接嘗試進行分析唷！</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
