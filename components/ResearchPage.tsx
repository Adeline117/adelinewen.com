import type { ReactNode } from "react";
import SubPage from "./SubPage";
import SybilMap from "./SybilMap";
import Cite from "./Cite";
import { BIB } from "./papers";

type Lang = "en" | "zh";

// /research and /zh/research: the airdrop Sybil work in full. Every figure is from the
// HasciDB paper (Nanyang Blockchain Conference 2026) and the database's documentation.
const ext = (href: string, text: ReactNode) => (
  <a className="tlink" href={href} target="_blank" rel="noopener noreferrer">
    {text}
  </a>
);

const COPY: Record<
  Lang,
  {
    label: string;
    title: ReactNode;
    lead: ReactNode;
    stats: { n: string; d: string }[];
    ind: { h: string; intro: string; rows: { name: string; rule: string; what: string }[] };
    cross: { h: string; p: string };
    papers: { h: string; items: { y: string; h: string; d?: string; pdf?: string; bib?: string }[] };
    links: { href: string; text: string }[];
    next: { href: string; text: string };
    other: string;
  }
> = {
  en: {
    label: "Research · UW CAIS Lab",
    title: (
      <>
        Catching <em>Sybils</em>.
      </>
    ),
    lead: (
      <>
        When a crypto project gives free tokens to its early users, an airdrop, one person can create thousands of wallets and claim again and again. This is a Sybil attack, and it has drained hundreds of millions of dollars from crypto projects. With {ext("https://faculty.washington.edu/weicaics/", "Prof. Wei Cai")} at the {ext("https://sites.uw.edu/weicaics/", "UW CAIS Lab")}, I built {ext("https://hascidb.org", "HasciDB")}, the largest open-source airdrop Sybil detection database, so the problem can be studied across projects instead of one airdrop at a time.
      </>
    ),
    stats: [
      { n: "2.54M", d: "Ethereum addresses checked" },
      { n: "964,034", d: "flagged as Sybil, 38.0% of all" },
      { n: "16", d: "airdrops, 2020–2024" },
    ],
    ind: {
      h: "Five indicators",
      intro:
        "Each address is checked for five behaviours real users rarely show. Crossing any one threshold flags it, every flag keeps the evidence behind it, and each address gets a 0–100 suspicion score.",
      rows: [
        { name: "Batch trading", rule: "BT ≥ 5", what: "Many addresses sending the same transaction to the same target within minutes." },
        { name: "Batch wallets", rule: "BW ≥ 10", what: "Many wallets funded from one source." },
        { name: "High frequency", rule: "HF ≥ 0.80", what: "A wallet active almost only inside the airdrop window." },
        { name: "Rapid funds", rule: "RF ≥ 0.50", what: "Claimed tokens sent straight on to one collecting address." },
        { name: "Multi-address", rule: "MA ≥ 5", what: "ETH passed round in circles between addresses to fake activity." },
      ],
    },
    cross: {
      h: "Across airdrops",
      p: "The same farmers come back airdrop after airdrop, so HasciDB checks every project together. Comparing them shows that a project’s distribution rules decide how much fraud it attracts: in the most exposed airdrop, Sybil addresses took 87.4% of the tokens; in the most resistant, 8.5%.",
    },
    papers: {
      h: "Papers",
      items: [
        { y: "Presented · Nanyang Blockchain Conference 2026", h: "HasciDB: A Database for Identifying Crypto Sybil Airdrop Hunters", d: "First author, with Wei Cai et al. Data and code are open source, and anyone can query the database free at hascidb.org.", pdf: "/papers/Wen2026-HasciDB-NBC.pdf", bib: BIB.nbc },
        { y: "Presented · IEEE SMC 2026 · IEEE Xplore", h: "Human-Centered Decision Support for Crypto Airdrop Governance: Interpretable Behavioral Modeling of Strategic Hunters", d: "Co-author. An extension of HasciDB toward interpretable, human-centered airdrop governance.", pdf: "/papers/Zastrow2026-Airdrop-Governance-SMC.pdf", bib: BIB.smc },
        { y: "Poster · INFORMS Annual Meeting 2026", h: "When AI Learns to Hide: Upper and Lower Bounds on Behavioral Identification of Automated Accounts" },
      ],
    },
    links: [
      { href: "https://hascidb.org", text: "Look up an address ↗" },
      { href: "https://hascidb.org/methodology", text: "How HasciDB scores ↗" },
    ],
    next: { href: "/arena", text: "Arena →" },
    other: "/zh/research",
  },
  zh: {
    label: "研究 · UW CAIS 实验室",
    title: (
      <>
        抓住 <em>Sybil</em>
      </>
    ),
    lead: (
      <>
        加密项目给早期用户免费发代币，叫做空投。一个人可以造出成千上万个钱包，一遍遍重复领取，这就是 Sybil 攻击，已经让加密项目损失了数亿美元。我在{ext("https://sites.uw.edu/weicaics/", "华盛顿大学 CAIS 实验室")}跟随 {ext("https://faculty.washington.edu/weicaics/", "Wei Cai 教授")}搭建了 {ext("https://hascidb.org", "HasciDB")}，最大的开源空投 Sybil 检测数据库，让这个问题可以跨项目研究，而不是一次只看一个空投。
      </>
    ),
    stats: [
      { n: "254 万", d: "个以太坊地址经过检查" },
      { n: "964,034", d: "个被标记为 Sybil，占 38.0%" },
      { n: "16", d: "个空投，2020–2024" },
    ],
    ind: {
      h: "五项指标",
      intro: "每个地址都检查五种真实用户很少出现的行为。任何一项越过阈值就会被标记，每次标记都保留证据，每个地址另有一个 0–100 的可疑分数。",
      rows: [
        { name: "批量交易", rule: "BT ≥ 5", what: "大量地址在几分钟内向同一目标发出相同的交易。" },
        { name: "批量钱包", rule: "BW ≥ 10", what: "大量钱包的资金来自同一个来源。" },
        { name: "高频集中", rule: "HF ≥ 0.80", what: "钱包几乎只在空投窗口期内活动。" },
        { name: "快速归集", rule: "RF ≥ 0.50", what: "领到的代币马上转进同一个归集地址。" },
        { name: "多地址循环", rule: "MA ≥ 5", what: "ETH 在地址之间绕圈转账，制造虚假活跃度。" },
      ],
    },
    cross: {
      h: "跨空投",
      p: "同一批羊毛党会在一个又一个空投里出现，所以 HasciDB 把所有项目放在一起检查。对比发现，项目的分发规则决定了它会招来多少作弊：最容易被攻破的空投，Sybil 地址拿走了 87.4% 的代币；最稳的只有 8.5%。",
    },
    papers: {
      h: "论文",
      items: [
        { y: "已报告 · 南洋区块链大会 2026", h: "HasciDB：识别加密 Sybil 空投猎人的数据库", d: "第一作者，与 Wei Cai 教授等合作。数据和代码全部开源，任何人都可以在 hascidb.org 免费查询。", pdf: "/papers/Wen2026-HasciDB-NBC.pdf", bib: BIB.nbc },
        { y: "已报告 · IEEE SMC 2026 · IEEE Xplore", h: "面向加密空投治理的​以人为本决策支持：​策略型猎手的​可解释行为建模", d: "合作者。HasciDB 的延伸工作，面向可解释、以人为本的空投治理。", pdf: "/papers/Zastrow2026-Airdrop-Governance-SMC.pdf", bib: BIB.smc },
        { y: "海报 · INFORMS 年会 2026", h: "When AI Learns to Hide: Upper and Lower Bounds on Behavioral Identification of Automated Accounts" },
      ],
    },
    links: [
      { href: "https://hascidb.org", text: "查询一个地址 ↗" },
      { href: "https://hascidb.org/methodology", text: "HasciDB 的评分方法 ↗" },
    ],
    next: { href: "/zh/arena", text: "Arena →" },
    other: "/research",
  },
};

export const RESEARCH_LD = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "HasciDB",
  alternateName: "HasciDB: A Cryptocurrency Airdrop Sybil Hunter Identification Database",
  description:
    "The largest open-source airdrop Sybil detection database: 2.54 million Ethereum addresses across 16 airdrops (2020–2024), each checked against five behavioural indicators and given a 0–100 suspicion score.",
  url: "https://hascidb.org",
  keywords: ["sybil detection", "airdrop", "ethereum", "blockchain security"],
  temporalCoverage: "2020/2024",
  isAccessibleForFree: true,
  license: "https://creativecommons.org/licenses/by/4.0/",
  creator: [
    { "@type": "Person", name: "Adeline Wen", url: "https://adelinewen.com" },
    { "@type": "Person", name: "Wei Cai" },
  ],
};

export default function ResearchPage({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <SubPage lang={lang} paper="research" other={t.other} next={t.next}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(RESEARCH_LD) }} />
      <section className="sec page-sec">
        <div className="arena-wrap">
          <div className="label">{t.label}</div>
          <h1>{t.title}</h1>
          <p className="lead">{t.lead}</p>

          <ul className="rows arena-stats">
            {t.stats.map((r) => (
              <li key={r.d}>
                <div className="rinfo">
                  <span className="n">{r.n}</span>
                  <span className="rd">{r.d}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="ablock">
            <h2>{t.ind.h}</h2>
            <div className="abody">
              <p>{t.ind.intro}</p>
              <ul className="aroad">
                {t.ind.rows.map((r) => (
                  <li key={r.rule}>
                    <div className="rp">{r.name}</div>
                    <div className="rw">{r.rule}</div>
                    <div className="rwhat">{r.what}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="ablock">
            <h2>{t.cross.h}</h2>
            <div className="abody">
              <p>{t.cross.p}</p>
              <SybilMap lang={lang} />
            </div>
          </div>

          <div className="ablock">
            <h2>{t.papers.h}</h2>
            <ul className="tl abody">
              {t.papers.items.map((p) => (
                <li key={p.h}>
                  <div className="y">{p.y}</div>
                  <div className="h">
                    {p.pdf ? (
                      <a className="ilink pdf" href={p.pdf} download>
                        {p.h}
                      </a>
                    ) : (
                      p.h
                    )}
                  </div>
                  {p.d && <div className="dsc">{p.d}</div>}
                  {p.bib && <Cite bib={p.bib} lang={lang} />}
                </li>
              ))}
            </ul>
          </div>

          <div className="page-links">
            {t.links.map((l) => (
              <a key={l.href} className="more" href={l.href} target="_blank" rel="noopener noreferrer">
                {l.text}
              </a>
            ))}
          </div>
        </div>
      </section>
    </SubPage>
  );
}
