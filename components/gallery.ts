// Event photo strips, one per honour. Generated from the owner's event folders:
// every image is 720px tall, metadata-stripped; live = the Live Photo's motion
// (muted mp4, same frame as its still).
// alt: what the photo shows, [English, 中文]
export type Shot = { src: string; w: number; h: number; live?: string; alt: [string, string] };

export const GALLERY = {
  informs: [
    { src: "/photos/informs/05.jpg", w: 958, h: 720, alt: ["Adeline walking through her poster", "Adeline 在海报前讲解"] },
    { src: "/photos/informs/02.jpg", w: 540, h: 720, live: "/photos/informs/02.mp4", alt: ["The INFORMS sign in the convention hall", "会场里的 INFORMS 标志"] },
    { src: "/photos/informs/03.jpg", w: 540, h: 720, alt: ["Adeline’s student badge and the Annual Meeting programme", "Adeline 的学生胸牌和年会手册"] },
    { src: "/photos/informs/04.jpg", w: 529, h: 720, alt: ["Adeline in front of the giant INFORMS letters", "Adeline 站在巨大的 INFORMS 字母前"] },
    { src: "/photos/informs/01.jpg", w: 960, h: 720, alt: ["Adeline beside her poster, “When AI Learns to Hide”, at board 5", "Adeline 站在 5 号展板旁，身边是她的海报《When AI Learns to Hide》"] },
    { src: "/photos/informs/06.jpg", w: 560, h: 720, alt: ["The INFORMS letter inviting Adeline to present at the 2026 Annual Meeting", "INFORMS 发来的 2026 年会邀请函"] },
  ],
  smc: [
    { src: "/photos/smc/01.jpg", w: 960, h: 720, live: "/photos/smc/01.mp4", alt: ["Adeline presenting; the slide reads “Requiring two indicators keeps 10%”", "Adeline 在做报告，幻灯片标题是 “Requiring two indicators keeps 10%”"] },
    { src: "/photos/smc/02.jpg", w: 440, h: 720, live: "/photos/smc/02.mp4", alt: ["Adeline beside the IEEE SMC 2026 banner", "Adeline 站在 IEEE SMC 2026 展架旁"] },
    { src: "/photos/smc/03.jpg", w: 540, h: 720, live: "/photos/smc/03.mp4", alt: ["Adeline speaking from the lectern", "Adeline 在讲台后发言"] },
    { src: "/photos/smc/04.jpg", w: 540, h: 720, live: "/photos/smc/04.mp4", alt: ["Adeline gesturing to the audience mid-talk", "报告中，Adeline 向听众示意"] },
    { src: "/photos/smc/05.jpg", w: 540, h: 720, live: "/photos/smc/05.mp4", alt: ["Adeline answering the room", "Adeline 回应台下听众"] },
  ],
  nbc: [
    { src: "/photos/nbc/03.jpg", w: 1080, h: 720, alt: ["Adeline at the NTU lectern", "Adeline 在南洋理工的讲台上"] },
    { src: "/photos/nbc/02.jpg", w: 540, h: 720, alt: ["The conference programme and Adeline’s “Paper Author” badge", "会议议程和 Adeline 的 “Paper Author” 胸牌"] },
    { src: "/photos/nbc/01.jpg", w: 1080, h: 720, alt: ["Adeline presenting HasciDB at Nanyang Technological University", "Adeline 在南洋理工大学报告 HasciDB"] },
    { src: "/photos/nbc/04.jpg", w: 1080, h: 720, alt: ["A full room during a conference session", "座无虚席的会场"] },
    { src: "/photos/nbc/05.jpg", w: 1080, h: 720, alt: ["Adeline at the lectern, smiling", "讲台旁微笑的 Adeline"] },
    { src: "/photos/nbc/06.jpg", w: 1080, h: 720, alt: ["Adeline asking a question from the audience", "Adeline 在观众席提问"] },
    { src: "/photos/nbc/07.jpg", w: 1080, h: 720, alt: ["Adeline talking with attendees at the break", "茶歇时，Adeline 和参会者交谈"] },
    { src: "/photos/nbc/08.jpg", w: 1080, h: 720, alt: ["Adeline with a fellow attendee at NTU Graduate College", "Adeline 和一位参会者在南洋理工研究生院前"] },
    { src: "/photos/nbc/09.jpg", w: 1080, h: 720, alt: ["Adeline at the NTU Graduate College sign", "Adeline 在南洋理工研究生院标志前"] },
    { src: "/photos/nbc/10.jpg", w: 1080, h: 720, alt: ["Singapore’s skyline at night across Marina Bay", "夜晚滨海湾对岸的新加坡天际线"] },
    { src: "/photos/nbc/11.jpg", w: 1080, h: 720, alt: ["Conference attendees on an evening river boat", "参会者夜游新加坡河"] },
    { src: "/photos/nbc/12.jpg", w: 532, h: 720, alt: ["Adeline on the boat, the city lit up behind her", "船上的 Adeline，身后是城市夜景"] },
  ],
  paradigm: [
    { src: "/photos/paradigm/01.jpg", w: 540, h: 720, alt: ["Adeline’s place card at the fellowship dinner", "晚宴上 Adeline 的座位卡"] },
    { src: "/photos/paradigm/02.jpg", w: 540, h: 720, alt: ["The Paradigm sign", "Paradigm 的指示牌"] },
    { src: "/photos/paradigm/03.jpg", w: 552, h: 720, live: "/photos/paradigm/03.mp4", alt: ["The welcome letter to the fourth annual Paradigm Fellowship", "第四届 Paradigm Fellowship 的欢迎信"] },
    { src: "/photos/paradigm/04.jpg", w: 540, h: 720, alt: ["A fishing rod over the bay", "海湾上的钓竿"] },
    { src: "/photos/paradigm/05.jpg", w: 477, h: 720, alt: ["A fish just caught, the Golden Gate Bridge behind", "刚钓上的鱼，身后是金门大桥"] },
    { src: "/photos/paradigm/06.jpg", w: 540, h: 720, alt: ["The Golden Gate Bridge from the water", "从水面看金门大桥"] },
    { src: "/photos/paradigm/07.jpg", w: 540, h: 720, alt: ["Kayaking on the bay under grey skies", "阴天在海湾划皮划艇"] },
    { src: "/photos/paradigm/08.jpg", w: 540, h: 720, alt: ["Out on the bay by boat", "乘小艇出海"] },
  ],
  yc: [
    { src: "/photos/yc/01.jpg", w: 469, h: 720, alt: ["Adeline beside the giant Y Combinator “Y”", "Adeline 站在巨大的 Y Combinator “Y” 标志旁"] },
    { src: "/photos/yc/02.jpg", w: 540, h: 720, alt: ["The arena screen: “Jensen Huang, Founder & CEO, NVIDIA”", "场馆大屏：“Jensen Huang, Founder & CEO, NVIDIA”"] },
    { src: "/photos/yc/03.jpg", w: 540, h: 720, live: "/photos/yc/03.mp4", alt: ["Jensen Huang in conversation on stage", "黄仁勋在台上对谈"] },
    { src: "/photos/yc/04.jpg", w: 540, h: 720, live: "/photos/yc/04.mp4", alt: ["Jensen Huang on the big screen", "大屏上的黄仁勋"] },
    { src: "/photos/yc/05.jpg", w: 540, h: 720, live: "/photos/yc/05.mp4", alt: ["A fireside chat on the big screen above the stage", "舞台上方大屏里的炉边对谈"] },
  ],
  dempsey: [
    { src: "/photos/dempsey/01.jpg", w: 1134, h: 720, alt: ["Adeline and a teammate at the Arena booth", "Adeline 和队友在 Arena 展位"] },
    { src: "/photos/dempsey/02.jpg", w: 1053, h: 720, alt: ["Adeline walking a visitor through the Arena one-pager", "Adeline 给来访者讲解 Arena 单页"] },
    { src: "/photos/dempsey/03.jpg", w: 960, h: 720, alt: ["Adeline talking with a visitor at the showcase", "Adeline 在展会上和来访者交流"] },
    { src: "/photos/dempsey/04.jpg", w: 557, h: 720, alt: ["The Arena poster: problem, solution, market and team", "Arena 海报：问题、方案、市场和团队"] },
  ],
  // childhood stage and screen work; names on screens and posters blurred or left out
  stage: [
    { src: "/photos/stage/01.jpg", w: 960, h: 720, alt: ["Hosting on Hubei TV", "在湖北卫视主持"] },
    { src: "/photos/stage/02.jpg", w: 1458, h: 720, alt: ["Reciting in costume on Hubei TV's Voice of Kids", "在湖北卫视《童声朗朗》古装朗诵"] },
    { src: "/photos/stage/03.jpg", w: 1276, h: 720, alt: ["Performing on CCTV-14", "在 CCTV-14 少儿频道演出"] },
    { src: "/photos/stage/13.jpg", w: 445, h: 720, alt: ["On set, in Republican-era costume", "片场，一身民国戏服"] },
    { src: "/photos/stage/15.jpg", w: 608, h: 720, alt: ["Playing the pipa on stage, 2018", "2018 年，在台上弹琵琶"] },
    { src: "/photos/stage/14.jpg", w: 540, h: 720, alt: ["Two pipas, after the show", "演出后，两把琵琶"] },
    { src: "/photos/stage/04.jpg", w: 540, h: 720, alt: ["With the gold-award trophy, 2017 Hubei Children's Spring Festival Gala host competition", "2017 年湖北少儿春晚主持人大赛，捧着金奖奖杯"] },
    { src: "/photos/stage/09.jpg", w: 960, h: 720, alt: ["On Hubei TV's Voice of Kids", "在湖北卫视《童声朗朗》"] },
    { src: "/photos/stage/06.jpg", w: 720, h: 720, alt: ["The 2020 Future Dream Children's Spring Festival Gala stage", "2020「未来梦」少儿春晚舞台"] },
    { src: "/photos/stage/08.jpg", w: 540, h: 720, alt: ["At the 2019 Future Dream Children's Spring Festival Gala", "2019「未来梦」少儿春晚"] },
    { src: "/photos/stage/07.jpg", w: 1356, h: 720, alt: ["On stage at the 2018 Future Dream children's gala host competition", "2018「未来梦」少儿春晚小主持人大赛"] },
    { src: "/photos/stage/10.jpg", w: 1044, h: 720, alt: ["Reciting “Love Song of the Yangtze” on stage", "舞台朗诵《长江恋歌》"] },
    { src: "/photos/stage/11.jpg", w: 960, h: 720, alt: ["China Huayang Youth Language Arts Competition, Hubei division", "中国花样少年语言艺术大赛湖北赛区"] },
    { src: "/photos/stage/12.jpg", w: 960, h: 720, alt: ["Some of the trophies", "部分奖杯"] },
  ],
} satisfies Record<string, Shot[]>;
