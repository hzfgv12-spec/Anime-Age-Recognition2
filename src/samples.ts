import { AnimeAnalysis } from "./types";

export interface SampleCharacter {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  analysis: AnimeAnalysis;
}

export const SAMPLE_CHARACTERS: SampleCharacter[] = [
  {
    id: "frieren",
    name: "芙莉蓮 (Frieren)",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80",
    description: "經典異世界魔法使，外表如童顏少女，實則為千歲精靈。",
    analysis: {
      characterName: "芙莉蓮 (Frieren)",
      estimatedAge: "1000+ 歲 (外表約 15 歲)",
      estimatedAgeGroup: "不詳/長生不老",
      visualEvidence: [
        "寬圓的大眼睛與極低的五官重心，符合幼齒少女或精靈童顏設定。",
        "長著標誌性的長尖精靈耳，顯示非人類的長壽種族特質。",
        "身著古樸精緻的白色法師半身斗篷與耳環配件，洋溢著歲月與旅人氣息。"
      ],
      features: {
        hairColor: "雪白色雙馬尾",
        hairStyle: "低雙馬尾，配上齊瀏海與兩側修長鬢髮",
        eyeStyle: "平靜、帶點慵懶氣質的深綠色半開眼眸",
        clothing: "白金鑲邊的魔法使短袍，內搭黑色貼身裙，外覆紅白條紋小披肩",
        accessory: "紅色寶石垂墜耳環，精緻的魔法杖"
      },
      personalityVibe: {
        primaryVibe: "無口 / 呆萌 (Kuudere / Dandere)",
        description: "平時神情慵懶冷淡，對時間流逝毫無概念，卻在心靈深處珍惜著過去與夥伴的點點滴滴。言行舉止散發著超脫世俗的長者智慧。"
      },
      confidenceScore: 98,
      animeArchetype: "異世界傳奇精靈法師",
      customCardQuote: "「雖然只有十分之一，但我們確實改變了世界。嗯……既然遇到了，就送你一瓶能讓衣服融化的魔法藥水吧！」"
    }
  },
  {
    id: "tsundere_student",
    name: "明日香風格 (Asuka Vibe)",
    imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80",
    description: "金橘髮、雙馬尾、高傲自信的經典學園傲嬌女主角。",
    analysis: {
      characterName: "颯香 (Saka) - 傲嬌雙馬尾會長",
      estimatedAge: "16 歲",
      estimatedAgeGroup: "青少年",
      visualEvidence: [
        "眼角上揚且瞳孔張力十足，反映典型的強氣或傲嬌系青春期少女神情。",
        "裝扮明顯是以日式高中生制服領結為底版，指示年齡落在高一至高二之間。",
        "臉頰帶有微微的日系漸層羞紅（紅暈效果），為角色增添了豐富的情感與傲嬌屬性。"
      ],
      features: {
        hairColor: "燦爛的楓橘紅色",
        hairStyle: "高挑、活力洋溢的雙馬尾，搭配微亂的碎瀏海",
        eyeStyle: "明朗耀眼、透露著不服輸光芒的碧藍色星瞳",
        clothing: "紅黑配色的日系水手服制服，領口點綴著俏皮的蝴蝶結",
        accessory: "頭頂佩戴著紅色科技風髮箍耳機，顯現滿滿的學園科幻風範"
      },
      personalityVibe: {
        primaryVibe: "傲嬌 (Tsundere)",
        description: "高傲好強、自尊心極高，其實內心極度渴望認同與陪伴。稍有不順心就會習慣性地雙手叉腰、口是心非，用強硬的外表掩飾羞怯。"
      },
      confidenceScore: 92,
      animeArchetype: "強氣學園美少女 / 傲嬌會長",
      customCardQuote: "「哼！笨蛋！我才沒有在等你呢，只是這條路剛好歸學生會管而已！少……少自作多情了！」"
    }
  },
  {
    id: "cyber_hero",
    name: "賽博朋克劍士 (Cyber Swordsman)",
    imageUrl: "https://images.unsplash.com/photo-1541562232579-512a21360020?w=500&auto=format&fit=crop&q=80",
    description: "冷酷幹練的科技風青年劍客，有著銳利眼眸與特殊機能面罩。",
    analysis: {
      characterName: "零 (Zero) - 科技浪人",
      estimatedAge: "21 歲",
      estimatedAgeGroup: "青年",
      visualEvidence: [
        "下顎線與面部輪廓銳利，五官重心較高，顯現成年或青年初期特徵。",
        "眼神微合而銳利，透露出戰鬥磨練出的沉著，明顯排除兒童期特性。",
        "身著多口袋工裝外衣與科技機能背心，帶有濃郁的街頭流浪與戰鬥色彩。"
      ],
      features: {
        hairColor: "暗灰至挑染冰藍色",
        hairStyle: "蓬鬆不羈的機能短髮，帶點剛硬的亂翹感",
        eyeStyle: "冰冷、深邃如灰色極夜的單鳳眼瞳，透著警惕的寒光",
        clothing: "機能口袋防風戰術夾克，內襯灰色戰術背心與電子掛頸",
        accessory: "具有語音濾波功能的電子戰術口罩，金屬鎖鏈掛飾"
      },
      personalityVibe: {
        primaryVibe: "中二 / 腹黑孤狼 (Lone Wolf)",
        description: "話少、行動果決。崇尚高效率與實力至上，不輕易流露私人情感。在團隊中往往擔任默默守護大家但嘴上吐槽的獨行刺客。"
      },
      confidenceScore: 95,
      animeArchetype: "孤傲暗殺者 / 科技浪人",
      customCardQuote: "「黑夜，是代碼運作最完美的底色。我的刀……比冷卻液的溫度還要低，最好別惹我。」"
    }
  }
];
