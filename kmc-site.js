/* ============================================================
   KUAN-MING CHEN · ACADEMIC SITE — DATA + RENDER LAYER
   ------------------------------------------------------------
   ONE place to change content: edit the Google Sheet (see
   SHEET_ID below) OR edit the BAKED data object further down.
   This file does NO DOM access and attaches NO listeners —
   the .dc.html logic class calls these builders and injects
   the returned HTML. Everything is bilingual (en / zh).
   ============================================================ */
(function () {
  /* ----------------------------------------------------------
     1 · GOOGLE SHEET CONNECTION
     Paste your published Sheet ID between the quotes to make
     the site read live from your spreadsheet. Leave blank to
     use the built-in content below.
     The sheet must be shared "Anyone with the link · Viewer".
     Tab names must be: Settings, Papers, Featured, Students,
     Teaching, CV  (see the workbook you were given).
     ---------------------------------------------------------- */
  var SHEET_ID = "159H3nPt4zNgbztZnvKMTniD_Zt05mdBsmWRjPnuGxEc";

  var GR = "'Space Grotesk',sans-serif", MONO = "'Space Mono',monospace";
  var INK = "#1E1F1A", PAPER = "#F3F1EC", PANEL = "#ece9e1", MUTE = "#6e7066", FAINT = "#9a978c";
  var GREEN = "#1F6B4A";

  /* ----------------------------------------------------------
     2 · CONTROLLED VOCABULARIES (bilingual)
     ---------------------------------------------------------- */
  var STATUS = {
    published:   { color: "#1F6B4A", dot: "\u25CF", en: "Published",       zh: "\u5DF2\u767C\u8868" },
    forthcoming: { color: "#2F8F63", dot: "\u25D5", en: "Forthcoming",     zh: "\u5373\u5C07\u767C\u8868" },
    rr:          { color: "#C77D34", dot: "\u25D1", en: "R&R",             zh: "\u4FEE\u8A02\u91CD\u6295" },
    working:     { color: "#7BA88C", dot: "\u25D0", en: "Working paper",   zh: "\u5DE5\u4F5C\u8AD6\u6587" },
    progress:    { color: "#B9C2B0", dot: "\u25CB", en: "In progress",     zh: "\u9032\u884C\u4E2D" }
  };
  var INSTS = [
    { key: "household", en: "Households & Family", zh: "\u5BB6\u5EAD",       color: "#1F6B4A" },
    { key: "health",    en: "Health system",       zh: "\u885B\u751F\u9AD4\u7CFB", color: "#C77D34" },
    { key: "legal",     en: "Legal system",        zh: "\u6CD5\u5F8B\u9AD4\u7CFB", color: "#5B6BB5" },
    { key: "firms",     en: "Firms & Markets",     zh: "\u5EE0\u5546\u8207\u5E02\u5834", color: "#8A8174" }
  ];
  var INST_STAGES = {
    household: [
      { key: "child",  en: "Childhood & Schooling",    zh: "\u7AE5\u5E74\u8207\u5C31\u5B78" },
      { key: "edu",    en: "Education & Career Entry",  zh: "\u6559\u80B2\u8207\u8077\u6DAF\u8D77\u6B65" },
      { key: "dating", en: "Dating & Partnership",      zh: "\u4EA4\u5F80\u8207\u64C7\u5076" },
      { key: "family", en: "Marriage & Family",         zh: "\u5A5A\u59FB\u8207\u5BB6\u5EAD" },
      { key: "work",   en: "Work & Mid-life",           zh: "\u5DE5\u4F5C\u8207\u4E2D\u5E74" },
      { key: "care",   en: "Old-age Care & Legacy",     zh: "\u8001\u5E74\u7167\u8B77\u8207\u50B3\u627F" }
    ],
    health: [
      { key: "patients",   en: "Patients & Prevention", zh: "\u75C5\u60A3\u8207\u9810\u9632" },
      { key: "screening",  en: "Screening & Diagnosis",  zh: "\u7BE9\u6AA2\u8207\u8A3A\u65B7" },
      { key: "physicians", en: "Physicians",             zh: "\u91AB\u5E2B" },
      { key: "hospitals",  en: "Hospitals",              zh: "\u91AB\u9662" },
      { key: "ltc",        en: "Long-term Care",         zh: "\u9577\u671F\u7167\u8B77" }
    ],
    legal: [
      { key: "reporting", en: "Offense & Reporting", zh: "\u6848\u4EF6\u8207\u901A\u5831" },
      { key: "courts",    en: "Courts & Judges",      zh: "\u6CD5\u9662\u8207\u6CD5\u5B98" },
      { key: "verdicts",  en: "Verdicts & Sentencing", zh: "\u5224\u6C7A\u8207\u91CF\u5211" },
      { key: "reform",    en: "Law & Reform",          zh: "\u6CD5\u5236\u8207\u6539\u9769" }
    ],
    firms: [
      { key: "hiring",    en: "Entry & Hiring",       zh: "\u9032\u5165\u8207\u62DB\u52DF" },
      { key: "platforms", en: "Matching & Platforms",  zh: "\u5A92\u5408\u8207\u5E73\u53F0" },
      { key: "networks",  en: "Networks & Sorting",    zh: "\u7DB2\u7D61\u8207\u914D\u5C0D" },
      { key: "wages",     en: "Wages & Mobility",      zh: "\u85AA\u8CC7\u8207\u6D41\u52D5" }
    ]
  };
  var TOPICS = {
    children:   { en: "Children",   zh: "\u5152\u7AE5" },
    fertility:  { en: "Fertility",  zh: "\u751F\u80B2" },
    family:     { en: "Family",     zh: "\u5BB6\u5EAD" },
    health:     { en: "Health",     zh: "\u5065\u5EB7" },
    labor:      { en: "Labor",      zh: "\u52DE\u52D5" },
    matching:   { en: "Matching",   zh: "\u914D\u5C0D" },
    inequality: { en: "Inequality", zh: "\u4E0D\u5E73\u7B49" },
    legal:      { en: "Legal",      zh: "\u6CD5\u5F8B" },
    firms:      { en: "Firms",      zh: "\u5EE0\u5546" },
    aging:      { en: "Aging",      zh: "\u9AD8\u9F61" }
  };

  /* UI chrome strings */
  var UI = {
    nav: {
      home:     { en: "Home",     zh: "\u9996\u9801" },
      research: { en: "Research", zh: "\u7814\u7A76" },
      students: { en: "Students", zh: "\u5B78\u751F" },
      teaching: { en: "Teaching", zh: "\u6559\u5B78" },
      cv:       { en: "CV",       zh: "\u5C65\u6B77" },
      personal: { en: "Personal", zh: "\u751F\u6D3B" }
    },
    sub: {
      featured: { en: "Featured findings", zh: "\u91CD\u9EDE\u767C\u73FE" },
      map:      { en: "Lifecycle map",     zh: "\u751F\u547D\u6B77\u7A0B\u5730\u5716" },
      browse:   { en: "Browse all papers", zh: "\u6240\u6709\u8AD6\u6587" }
    }
  };

  /* ----------------------------------------------------------
     3 · BAKED CONTENT  (mirror of the spreadsheet)
     ---------------------------------------------------------- */
  var DATA = {
    settings: {
      name_en: "Kuan-Ming Chen", name_zh: "\u9673\u51A0\u9298",
      role_en: "Associate Professor of Economics", role_zh: "\u7D93\u6FDF\u5B78\u7CFB\u526F\u6559\u6388",
      dept_en: "Department of Economics, National Taiwan University",
      dept_zh: "\u570B\u7ACB\u81FA\u7063\u5927\u5B78\u7D93\u6FDF\u5B78\u7CFB",
      center_en: "Director, Behavioral & Data Science Research Center, NTU",
      center_zh: "\u81FA\u5927\u884C\u70BA\u8207\u8CC7\u6599\u79D1\u5B78\u7814\u7A76\u4E2D\u5FC3\u4E3B\u4EFB",
      hero_en: "Greetings!",
      hero_zh: "\u60A8\u597D\uFF01",
      blurb_en: "I am an associate professor at National Taiwan University, where I also direct the Behavioral & Data Science Research Center. I study how family members support one another: how families are formed, how care is arranged for children and older adults, and how financial tools are used to support family members.",
      blurb_zh: "\u6211\u662F\u570B\u7ACB\u81FA\u7063\u5927\u5B78\u7D93\u6FDF\u5B78\u7CFB\u526F\u6559\u6388\uFF0C\u4E26\u64D4\u4EFB\u884C\u70BA\u8207\u8CC7\u6599\u79D1\u5B78\u7814\u7A76\u4E2D\u5FC3\u4E3B\u4EFB\u3002\u6211\u7814\u7A76\u5BB6\u4EBA\u5982\u4F55\u4E92\u76F8\u652F\u6301\uFF1A\u5BB6\u5EAD\u5982\u4F55\u5F62\u6210\u3001\u5982\u4F55\u70BA\u5152\u7AE5\u8207\u9577\u8005\u5B89\u6392\u7167\u8B77\uFF0C\u4EE5\u53CA\u5BB6\u5EAD\u5982\u4F55\u904B\u7528\u91D1\u878D\u5DE5\u5177\u4E92\u76F8\u652F\u6301\u3002",
      email: "kuanmingchen@ntu.edu.tw",
      scholar: "https://scholar.google.com/citations?user=vNel9PsAAAAJ",
      orcid: "https://orcid.org/0009-0005-3881-5058",
      cv_url: "https://drive.google.com/file/d/1GTHTW3U1bK2jiWnSAzHgC3q-KiL3jVZu/view",
      dept_url: "https://econ.ntu.edu.tw/",
      center_url: "https://bdsrc.ntu.edu.tw/",
      photo: "assets/headshot.jpg"
    },

    papers: [
      { id: "instmajor", st: "rr", year: 2025,
        t_en: "Institution or Major? Understanding Student Preferences in College Admissions",
        t_zh: "\u9078\u6821\u9084\u662F\u9078\u7CFB\uFF1F\u7406\u89E3\u5927\u5B78\u62DB\u751F\u4E2D\u7684\u5B78\u751F\u504F\u597D",
        out_en: "Conditionally accepted \u00B7 Economic Inquiry", out_zh: "\u6709\u689D\u4EF6\u63A5\u53D7 \u00B7 Economic Inquiry",
        ins: ["household"], top: ["labor", "inequality", "children"], pos: { household: "edu" },
        co: ["Yu-Chang Chen", "Chi-Chao Hung", "Hau-Hung Yang"], stu: [], ssrn: "5423077",
        s_en: "Where applicants must pick an institution and a major at once, students prioritize institutional ranking over field of study \u2014 with little variation across gender or region.",
        s_zh: "\u7576\u7533\u8ACB\u8005\u5FC5\u9808\u540C\u6642\u9078\u64C7\u6821\u8207\u7CFB\uFF0C\u5B78\u751F\u660E\u986F\u504F\u597D\u6821\u7684\u6392\u540D\u52DD\u904E\u7CFB\u7684\u9818\u57DF\uFF0C\u4E14\u6027\u5225\u8207\u5730\u5340\u5DEE\u7570\u5F88\u5C0F\u3002" },

      { id: "incineq", st: "rr", year: 2024,
        t_en: "Income Inequality and Dynamics in Taiwan",
        t_zh: "\u81FA\u7063\u7684\u6240\u5F97\u4E0D\u5E73\u7B49\u8207\u52D5\u614B",
        out_en: "R&R \u00B7 Journal of Macroeconomics", out_zh: "\u4FEE\u8A02\u91CD\u6295 \u00B7 Journal of Macroeconomics",
        ins: ["firms"], top: ["inequality", "labor"], pos: { firms: "wages" },
        co: ["Hsuan-Li Su", "Yu-Ting Chiang", "Ming-Jen Lin"], stu: ["huang"], ssrn: "",
        s_en: "Using administrative tax data (2004\u20132020), earnings inequality fell for both men and women \u2014 driven by fast growth among low earners, with women at the bottom gaining most.",
        s_zh: "\u4F7F\u7528 2004\u20132020 \u5E74\u7A05\u7C4D\u884C\u653F\u8CC7\u6599\uFF0C\u7537\u5973\u7684\u6240\u5F97\u4E0D\u5E73\u7B49\u90FD\u4E0B\u964D\uFF0C\u4E3B\u8981\u4F86\u81EA\u4F4E\u6240\u5F97\u8005\u7684\u5FEB\u901F\u6210\u9577\uFF0C\u4EE5\u5E95\u5C64\u5973\u6027\u7372\u76CA\u6700\u5927\u3002" },

      { id: "catsdogs", st: "working", year: 2025,
        t_en: "Cats, Dogs, and Babies: Quasi-Experimental Evidence on Substitutes or Complements",
        t_zh: "\u8C93\u3001\u72D7\u8207\u5BF6\u5BF6\uFF1A\u66FF\u4EE3\u6216\u4E92\u88DC\u7684\u6E96\u5BE6\u9A57\u8B49\u64DA",
        out_en: "Working paper", out_zh: "\u5DE5\u4F5C\u8AD6\u6587",
        ins: ["household"], top: ["fertility", "family"], pos: { household: "family" },
        co: ["Ming-Jen Lin", "Hau-Hung Yang", "Yu-hsuan Shirley Yen"], stu: ["lo"], ssrn: "5656231",
        s_en: "Linking Taiwan's pet registry to tax records (23M people), dog adoption rises 21% after a birth, and adopting a dog raises the chance of later childbearing by 33% \u2014 pets and children are complements.",
        s_zh: "\u4E32\u63A5\u81FA\u7063\u5BF5\u7269\u767B\u8A18\u8207\u7A05\u7C4D\u8CC7\u6599\uFF082300 \u842C\u4EBA\uFF09\uFF0C\u751F\u80B2\u5F8C\u990A\u72D7\u6BD4\u4F8B\u4E0A\u5347 21%\uFF0C\u800C\u990A\u72D7\u4F7F\u65E5\u5F8C\u751F\u80B2\u6A5F\u7387\u63D0\u9AD8 33%\u2014\u2014\u5BF5\u7269\u8207\u5B69\u5B50\u662F\u4E92\u88DC\u800C\u975E\u66FF\u4EE3\u3002" },

      { id: "careworkers", st: "working", year: 2024,
        t_en: "Foreign-Born Care Workers and Their Care Recipients' Health Outcomes",
        t_zh: "\u5916\u7C4D\u770B\u8B77\u5DE5\u8207\u53D7\u7167\u8B77\u8005\u7684\u5065\u5EB7\u7D50\u679C",
        out_en: "Working paper", out_zh: "\u5DE5\u4F5C\u8AD6\u6587",
        ins: ["household", "health"], top: ["aging", "health", "labor"], pos: { household: "care", health: "ltc" },
        co: ["Su-Yuan Chan"], stu: [], ssrn: "4966797",
        s_en: "Hiring a live-in foreign-born care worker significantly reduces inpatient, outpatient and ER use \u2014 likely because health improves, with fewer falls.",
        s_zh: "\u96C7\u7528\u540C\u4F4F\u7684\u5916\u7C4D\u770B\u8B77\u5DE5\u986F\u8457\u964D\u4F4E\u4F4F\u9662\u3001\u9580\u8A3A\u8207\u6025\u8A3A\u4F7F\u7528\u2014\u2014\u53EF\u80FD\u56E0\u5065\u5EB7\u6539\u5584\u4E14\u8DCC\u5012\u6E1B\u5C11\u3002" },

      { id: "healthchecks", st: "working", year: 2024,
        t_en: "Selecting the Patients Who Benefit the Most: Evidence from Marginal Patients in Health Checks",
        t_zh: "\u7BE9\u9078\u53D7\u76CA\u6700\u5927\u7684\u75C5\u60A3\uFF1A\u4F86\u81EA\u5065\u6AA2\u908A\u969B\u75C5\u60A3\u7684\u8B49\u64DA",
        out_en: "Working paper", out_zh: "\u5DE5\u4F5C\u8AD6\u6587",
        ins: ["health"], top: ["health", "inequality"], pos: { health: "screening" },
        co: ["Lin-Tung Tsai"], stu: [], ssrn: "4858772",
        s_en: "Across 6M Taiwanese health checks, a hyperlipidemia diagnosis cuts short-term complications by 10.8%; age is the single best variable to target \u2014 the oldest 20% gain 3.5\u00D7 the benefit.",
        s_zh: "\u5728 600 \u842C\u6B21\u5065\u6AA2\u4E2D\uFF0C\u9AD8\u8840\u8102\u8A3A\u65B7\u4F7F\u77ED\u671F\u4F75\u767C\u75C7\u964D\u4F4E 10.8%\uFF1B\u4EE5\u5E74\u9F61\u70BA\u7BE9\u9078\u4F9D\u64DA\u6700\u4F73\u2014\u2014\u6700\u5E74\u9577\u7684 20% \u53D7\u76CA\u9054 3.5 \u500D\u3002" },

      { id: "careshocks", st: "working", year: 2024,
        t_en: "Family Trajectories and the Burden of Care in the Aftermath of Old-Age Health Shocks",
        t_zh: "\u8001\u5E74\u5065\u5EB7\u885D\u64CA\u5F8C\u7684\u5BB6\u5EAD\u8ECC\u8DE1\u8207\u7167\u8B77\u8CA0\u64D4",
        out_en: "Working paper", out_zh: "\u5DE5\u4F5C\u8AD6\u6587",
        ins: ["household", "health"], top: ["aging", "family", "health"], pos: { household: "care", health: "ltc" },
        co: ["Maxwell Kellogg", "Kuan-Ju Tseng"], stu: ["huang"], ssrn: "4741990",
        s_en: "Health shocks to the elderly make large families grow larger, while small families face sharp rises in mortality \u2014 \u201Cdeaths of despair.\u201D Expanding access to live-in caregivers makes that mortality response vanish.",
        s_zh: "\u8001\u5E74\u5065\u5EB7\u885D\u64CA\u4F7F\u5927\u5BB6\u5EAD\u66F4\u5927\uFF0C\u5C0F\u5BB6\u5EAD\u5247\u9762\u81E8\u6B7B\u4EA1\u98A8\u96AA\u9AD8\u6F32\u3002\u64F4\u5927\u540C\u4F4F\u770B\u8B77\u7BA1\u9053\u53EF\u4F7F\u9019\u985E\u6B7B\u4EA1\u53CD\u61C9\u6D88\u5931\u3002" },

      { id: "inherit", st: "progress", year: 2025,
        t_en: "The Effect of House-Inheriting on Labor Decisions",
        t_zh: "\u7E7C\u627F\u623F\u7522\u5C0D\u52DE\u52D5\u6C7A\u7B56\u7684\u5F71\u97FF",
        out_en: "In progress", out_zh: "\u9032\u884C\u4E2D",
        ins: ["household", "legal"], top: ["aging", "labor", "inequality"], pos: { household: "care", legal: "reform" },
        co: ["Ming-Jen Lin", "Kuan-Ju Tseng"], stu: [], ssrn: "",
        s_en: "Comparing people who lost a parent with and without inheriting a house, inheriting a house lowers labor income and the probability of working \u2014 a Carnegie effect that spills over to spouses.",
        s_zh: "\u6BD4\u8F03\u5931\u53BB\u96D9\u89AA\u4F46\u662F\u5426\u7E7C\u627F\u623F\u7522\u7684\u4EBA\uFF0C\u7E7C\u627F\u623F\u7522\u964D\u4F4E\u52DE\u52D5\u6240\u5F97\u8207\u5C31\u696D\u6A5F\u7387\u2014\u2014\u4E26\u6EA2\u51FA\u81F3\u914D\u5076\u3002" },

      { id: "spatialdating", st: "progress", year: 2025,
        t_en: "Spatial Learning in Online Dating",
        t_zh: "\u7DDA\u4E0A\u4EA4\u53CB\u4E2D\u7684\u7A7A\u9593\u5B78\u7FD2",
        out_en: "In progress", out_zh: "\u9032\u884C\u4E2D",
        ins: ["firms", "household"], top: ["matching"], pos: { firms: "platforms", household: "dating" },
        co: ["Yen-Chi Chen", "Ming-Jen Lin", "Yi Xin"], stu: ["lin-c"], ssrn: "",
        s_en: "How users learn about the dating market as they search across space.",
        s_zh: "\u4F7F\u7528\u8005\u5728\u8DE8\u7A7A\u9593\u641C\u5C0B\u6642\uFF0C\u5982\u4F55\u5B78\u7FD2\u8A8D\u8B58\u4EA4\u53CB\u5E02\u5834\u3002" },

      { id: "motherhood", st: "progress", year: 2025,
        t_en: "Delays in Motherhood: Differentiating the Effects of Birth and Miscarriage",
        t_zh: "\u5EF6\u5F8C\u751F\u80B2\uFF1A\u5340\u5206\u751F\u7522\u8207\u6D41\u7522\u7684\u5F71\u97FF",
        out_en: "In progress", out_zh: "\u9032\u884C\u4E2D",
        ins: ["household"], top: ["fertility", "family", "health"], pos: { household: "family" },
        co: ["Yenfang Chieng", "Hui Ding", "Warn Lekfuangfu"], stu: [], ssrn: "",
        s_en: "Separating how births and miscarriages each shape the timing of motherhood and later outcomes.",
        s_zh: "\u5206\u96E2\u751F\u7522\u8207\u6D41\u7522\u5404\u81EA\u5982\u4F55\u5F71\u97FF\u751F\u80B2\u6642\u9593\u8207\u65E5\u5F8C\u7D50\u679C\u3002" },

      { id: "schoolmh", st: "forthcoming", year: 2025,
        t_en: "School Milestones Impact Child Mental Health in Taiwan",
        t_zh: "\u5C31\u5B78\u91CC\u7A0B\u7891\u5C0D\u81FA\u7063\u5152\u7AE5\u5FC3\u7406\u5065\u5EB7\u7684\u5F71\u97FF",
        out_en: "Forthcoming \u00B7 The Economic Journal", out_zh: "\u5373\u5C07\u767C\u8868 \u00B7 The Economic Journal",
        ins: ["household", "health"], top: ["children", "health"], pos: { household: "child", health: "patients" },
        co: ["Janet Currie", "Hui Ding", "Wei-Lun Lo"], stu: ["lo"], ssrn: "4929521", nber: "32842",
        s_en: "School entry raises mental-health prescribing (ADHD and depression); psychiatric medication use falls sharply after high-stakes tests \u2014 effects track when educational stress rises and is relieved.",
        s_zh: "\u5165\u5B78\u63D0\u9AD8\u5FC3\u7406\u5065\u5EB7\u7528\u85E5\uFF08\u904E\u52D5\u8207\u6182\u9B31\uFF09\uFF1B\u8003\u8A66\u5F8C\u7528\u85E5\u986F\u8457\u4E0B\u964D\u2014\u2014\u6548\u679C\u96A8\u6559\u80B2\u58D3\u529B\u4E0A\u5347\u8207\u7D13\u89E3\u800C\u8B8A\u3002" },

      { id: "childdis", st: "forthcoming", year: 2025,
        t_en: "Impacts of Childhood Disability on Family: Labor, Marriage, Fertility, and Depression",
        t_zh: "\u5152\u7AE5\u8EAB\u5FC3\u969C\u7919\u5C0D\u5BB6\u5EAD\u7684\u5F71\u97FF\uFF1A\u52DE\u52D5\u3001\u5A5A\u59FB\u3001\u751F\u80B2\u8207\u6182\u9B31",
        out_en: "Forthcoming \u00B7 Journal of Public Economics", out_zh: "\u5373\u5C07\u767C\u8868 \u00B7 Journal of Public Economics",
        ins: ["household"], top: ["children", "family", "inequality"], pos: { household: "child" },
        co: ["Ming-Jen Lin", "Wei-Lun Lo"], stu: ["chen-r"], ssrn: "4088796",
        s_en: "A child's cerebral palsy lowers the mother's probability of working by 5.5pp, raises divorce by 2.1pp and depression by 25%, with larger effects for worse-off families.",
        s_zh: "\u5B69\u5B50\u7F79\u60A3\u8166\u6027\u9EBB\u75FA\u4F7F\u6BCD\u89AA\u5C31\u696D\u6A5F\u7387\u4E0B\u964D 5.5 \u500B\u767E\u5206\u9EDE\uFF0C\u96E2\u5A5A\u589E\u52A0 2.1 \u500B\u767E\u5206\u9EDE\u3001\u6182\u9B31\u589E\u52A0 25%\uFF0C\u5C0D\u8655\u5883\u8F03\u5DEE\u7684\u5BB6\u5EAD\u5F71\u97FF\u66F4\u5927\u3002" },

      { id: "ipv", st: "forthcoming", year: 2025,
        t_en: "Breaking Silence: How Intimate Partner Violence and Reporting Shape Later Life Outcomes",
        t_zh: "\u6253\u7834\u6C89\u9ED8\uFF1A\u89AA\u5BC6\u95DC\u4FC2\u66B4\u529B\u8207\u901A\u5831\u5982\u4F55\u5F62\u5851\u65E5\u5F8C\u4EBA\u751F",
        out_en: "Forthcoming \u00B7 Journal of Labor Economics", out_zh: "\u5373\u5C07\u767C\u8868 \u00B7 Journal of Labor Economics",
        ins: ["legal", "household"], top: ["family", "legal"], pos: { household: "family", legal: "reporting" },
        co: ["Harrison Chang", "Shiau-Fang Chao", "Ming-Jen Lin"], stu: [], ssrn: "4475647",
        media: [["CNA", "https://www.cna.com.tw/news/ahel/202506240134.aspx"], ["UDN", "https://udn.com/news/story/7266/8827384"], ["LTN", "https://news.ltn.com.tw/news/life/paper/1713217"]],
        s_en: "Separating the violence effect from the reporting effect: divorce rises after a report, women's employment recovers after reporting, and depression visits rise with both violence and reporting.",
        s_zh: "\u5206\u96E2\u66B4\u529B\u6548\u61C9\u8207\u901A\u5831\u6548\u61C9\uFF1A\u901A\u5831\u5F8C\u96E2\u5A5A\u4E0A\u5347\uFF0C\u5973\u6027\u5C31\u696D\u5728\u901A\u5831\u5F8C\u56DE\u5347\uFF0C\u800C\u6182\u9B31\u9580\u8A3A\u96A8\u66B4\u529B\u8207\u901A\u5831\u4E0A\u5347\u3002" },

      { id: "sorting", st: "forthcoming", year: 2025,
        t_en: "Labor Market Sorting in Taiwan",
        t_zh: "\u81FA\u7063\u52DE\u52D5\u5E02\u5834\u7684\u914D\u5C0D",
        out_en: "Forthcoming \u00B7 Taiwan Economic Review", out_zh: "\u5373\u5C07\u767C\u8868 \u00B7 \u7D93\u6FDF\u8AD6\u6587\u53E2\u520A",
        ins: ["firms"], top: ["labor", "firms", "inequality"], pos: { firms: "networks" },
        co: ["Lin-Tung Tsai", "Hau-Hung Yang"], stu: [], ssrn: "5149991",
        s_en: "First bias-corrected AKM estimates for Asia: individual effects explain 60% of wage variance, firms 14%, and sorting 13.5% \u2014 sorting nearly doubled over 15 years.",
        s_zh: "\u4E9E\u6D32\u9996\u500B\u504F\u8AA4\u4FEE\u6B63\u7684 AKM \u4F30\u8A08\uFF1A\u500B\u4EBA\u6548\u679C\u89E3\u91CB 60% \u85AA\u8CC7\u8B8A\u7570\u3001\u5EE0\u5546 14%\u3001\u914D\u5C0D 13.5%\u2014\u2014\u914D\u5C0D\u6210\u5206\u5341\u4E94\u5E74\u5167\u8FD1\u4E4E\u500D\u589E\u3002" },

      { id: "reswage", st: "published", year: 2025,
        t_en: "Reservation Wages and Workers' Valuation of Job Flexibility: Evidence from a Natural Field Experiment",
        t_zh: "\u4FDD\u7559\u5DE5\u8CC7\u8207\u52DE\u5DE5\u5C0D\u5DE5\u4F5C\u5F48\u6027\u7684\u8A55\u50F9\uFF1A\u4F86\u81EA\u81EA\u7136\u7530\u91CE\u5BE6\u9A57\u7684\u8B49\u64DA",
        out_en: "Journal of the European Economic Association, 2025", out_zh: "Journal of the European Economic Association\uFF0C2025",
        ins: ["firms"], top: ["labor"], pos: { firms: "wages" },
        co: ["Claire Ding", "John A. List", "Magne Mogstad"], stu: [], ssrn: "3686752",
        doi: "https://doi.org/10.1093/jeea/jvaf022",
        s_en: "A large Uber field experiment recovers labor-supply elasticities and how much drivers value the ability to customize and adjust their own schedule.",
        s_zh: "\u4E00\u9805\u5927\u578B Uber \u7530\u91CE\u5BE6\u9A57\u4F30\u8A08\u52DE\u52D5\u4F9B\u7D66\u5F48\u6027\uFF0C\u4EE5\u53CA\u99D5\u99DB\u8005\u5C0D\u81EA\u8A02\u8207\u8ABF\u6574\u73ED\u8868\u80FD\u529B\u7684\u8A55\u50F9\u3002" },

      { id: "dating", st: "published", year: 2023,
        t_en: "Reducing Recommendation Inequality via Two-Sided Matching: A Field Experiment of Online Dating",
        t_zh: "\u4EE5\u96D9\u908A\u5A92\u5408\u964D\u4F4E\u63A8\u85A6\u4E0D\u5E73\u7B49\uFF1A\u7DDA\u4E0A\u4EA4\u53CB\u7684\u7530\u91CE\u5BE6\u9A57",
        out_en: "International Economic Review, 2023", out_zh: "International Economic Review\uFF0C2023",
        ins: ["firms"], top: ["matching"], pos: { firms: "platforms" },
        co: ["Ming-Jen Lin", "Yu-Wei Hsieh"], stu: ["lin-c"], ssrn: "3718920",
        doi: "https://onlinelibrary.wiley.com/doi/epdf/10.1111/iere.12631",
        s_en: "A matching-theory recommender beats popularity-based algorithms: it produces more matches, spreads attention more evenly, and makes male users 4\u00D7 more likely to receive a response.",
        s_zh: "\u4EE5\u5A92\u5408\u7406\u8AD6\u70BA\u57FA\u790E\u7684\u63A8\u85A6\u7CFB\u7D71\u512A\u65BC\u4EE5\u4EBA\u6C23\u70BA\u672C\u7684\u6F14\u7B97\u6CD5\uFF1A\u914D\u5C0D\u66F4\u591A\u3001\u95DC\u6CE8\u66F4\u5747\uFF0C\u4E26\u4F7F\u7537\u6027\u4F7F\u7528\u8005\u7372\u5F97\u56DE\u8986\u7684\u6A5F\u7387\u63D0\u9AD8 4 \u500D\u3002" }
    ],

    featured: [
      { pid: "catsdogs", num: "+33%", color: "#1F6B4A", fig_en: "event study", fig_zh: "\u4E8B\u4EF6\u7814\u7A76",
        unit_en: "higher chance of childbearing after a couple adopts a dog",
        unit_zh: "\u592B\u59BB\u990A\u72D7\u5F8C\uFF0C\u751F\u80B2\u6A5F\u7387\u63D0\u9AD8",
        topic_en: "Fertility & Family", topic_zh: "\u751F\u80B2\u8207\u5BB6\u5EAD" },
      { pid: "healthchecks", num: "3.5\u00D7", color: "#C77D34", fig_en: "RD targeting", fig_zh: "\u4E0D\u9023\u7E8C\u8A2D\u8A08",
        unit_en: "larger health benefit for the oldest patients when age guides screening",
        unit_zh: "\u4EE5\u5E74\u9F61\u5F15\u5C0E\u7BE9\u6AA2\u6642\uFF0C\u6700\u5E74\u9577\u75C5\u60A3\u7684\u5065\u5EB7\u6548\u76CA",
        topic_en: "Health & Aging", topic_zh: "\u5065\u5EB7\u8207\u9AD8\u9F61" },
      { pid: "childdis", num: "\u22125.5pp", color: "#1F6B4A", fig_en: "child penalty", fig_zh: "\u80B2\u5152\u4EE3\u50F9",
        unit_en: "drop in a mother's probability of working after a child's disability",
        unit_zh: "\u5B69\u5B50\u8EAB\u5FC3\u969C\u7919\u5F8C\uFF0C\u6BCD\u89AA\u5C31\u696D\u6A5F\u7387\u4E0B\u964D",
        topic_en: "Family & Inequality", topic_zh: "\u5BB6\u5EAD\u8207\u4E0D\u5E73\u7B49" },
      { pid: "dating", num: "4\u00D7", color: "#5B6BB5", fig_en: "field experiment", fig_zh: "\u7530\u91CE\u5BE6\u9A57",
        unit_en: "more likely that male users receive a response under two-sided matching",
        unit_zh: "\u96D9\u908A\u5A92\u5408\u4E0B\uFF0C\u7537\u6027\u4F7F\u7528\u8005\u7372\u5F97\u56DE\u8986\u7684\u6A5F\u7387",
        topic_en: "Matching & Markets", topic_zh: "\u914D\u5C0D\u8207\u5E02\u5834" }
    ],

    /* Sample roster \u2014 replace with your own in the Students tab */
    students: [
      { id: "huang", name_en: "Pei-Chi Huang", name_zh: "\u9EC3\u4F69\u742A", year: 2022, role: "PhD advisee",
        place_en: "On the job market, 2026", place_zh: "2026 \u5C31\u696D\u5E02\u5834",
        traj_en: ["Masters, NTU \u00B7 2022", "PhD candidate, NTU \u00B7 2025"],
        traj_zh: ["\u53F0\u5927\u78A9\u58EB \u00B7 2022", "\u53F0\u5927\u535A\u58EB\u5019\u9078\u4EBA \u00B7 2025"], site: true },
      { id: "lin-c", name_en: "Cheng-Yu Lin", name_zh: "\u6797\u6210\u5B87", year: 2023, role: "RA",
        place_en: "Pre-doctoral fellow, MIT", place_zh: "MIT \u9810\u535A\u7814\u7A76\u54E1",
        traj_en: ["RA, NTU \u00B7 2023", "Pre-doc, MIT \u00B7 2024"],
        traj_zh: ["\u53F0\u5927\u7814\u7A76\u52A9\u7406 \u00B7 2023", "MIT \u9810\u535A \u00B7 2024"], site: true },
      { id: "lo", name_en: "Wei-Lun Lo", name_zh: "\u7F85\u5049\u502B", year: 2021, role: "PhD advisee",
        place_en: "PhD, University of Chicago", place_zh: "\u829D\u52A0\u54E5\u5927\u5B78\u535A\u58EB",
        traj_en: ["RA, NTU \u00B7 2021", "Pre-doc, Chicago \u00B7 2022", "PhD, U Chicago \u00B7 2024"],
        traj_zh: ["\u53F0\u5927\u7814\u7A76\u52A9\u7406 \u00B7 2021", "\u829D\u52A0\u54E5\u9810\u535A \u00B7 2022", "\u829D\u52A0\u54E5\u535A\u58EB \u00B7 2024"], site: true },
      { id: "chen-r", name_en: "Ruo-Yu Chen", name_zh: "\u9673\u82E5\u6986", year: 2023, role: "Masters",
        place_en: "Economist, Central Bank of Taiwan", place_zh: "\u4E2D\u592E\u9280\u884C\u7D93\u6FDF\u5B78\u5BB6",
        traj_en: ["Masters, NTU \u00B7 2023", "Central Bank \u00B7 2023"],
        traj_zh: ["\u53F0\u5927\u78A9\u58EB \u00B7 2023", "\u4E2D\u592E\u9280\u884C \u00B7 2023"], site: false },
      { id: "tsai-u", name_en: "Chia-Hao Tsai", name_zh: "\u8521\u5609\u8C6A", year: 2024, role: "Undergraduate",
        place_en: "Masters student, NTU Economics", place_zh: "\u53F0\u5927\u7D93\u6FDF\u7CFB\u78A9\u58EB\u751F",
        traj_en: ["Undergraduate RA, NTU \u00B7 2024"],
        traj_zh: ["\u53F0\u5927\u5927\u5C08\u7814\u7A76\u52A9\u7406 \u00B7 2024"], site: false }
    ],

    /* Sample courses \u2014 replace with your own in the Teaching tab */
    teaching: [
      { code: "ECON 5001", term: "2024\u2013", level: "Graduate",
        t_en: "Labor Economics", t_zh: "\u52DE\u52D5\u7D93\u6FDF\u5B78",
        role_en: "Instructor", role_zh: "\u6388\u8AB2\u6559\u5E2B",
        n_en: "PhD-level field course on labor supply, family, and applied microeconomics.",
        n_zh: "\u535A\u58EB\u7D1A\u9818\u57DF\u8AB2\uFF0C\u6DB5\u84CB\u52DE\u52D5\u4F9B\u7D66\u3001\u5BB6\u5EAD\u8207\u61C9\u7528\u5FAE\u89C0\u7D93\u6FDF\u5B78\u3002", syllabus: "" },
      { code: "ECON 3010", term: "2023\u2013", level: "Undergraduate",
        t_en: "Applied Econometrics & Causal Inference", t_zh: "\u61C9\u7528\u8A08\u91CF\u8207\u56E0\u679C\u63A8\u8AD6",
        role_en: "Instructor", role_zh: "\u6388\u8AB2\u6559\u5E2B",
        n_en: "Research designs for causal questions with real administrative data.",
        n_zh: "\u4EE5\u771F\u5BE6\u884C\u653F\u8CC7\u6599\u6559\u6388\u56E0\u679C\u554F\u984C\u7684\u7814\u7A76\u8A2D\u8A08\u3002", syllabus: "" },
      { code: "ECON 2001", term: "2023\u2013", level: "Undergraduate",
        t_en: "Principles of Microeconomics", t_zh: "\u5FAE\u89C0\u7D93\u6FDF\u5B78\u539F\u7406",
        role_en: "Instructor", role_zh: "\u6388\u8AB2\u6559\u5E2B",
        n_en: "Introductory microeconomics for first-year students.",
        n_zh: "\u9762\u5411\u5927\u4E00\u5B78\u751F\u7684\u5FAE\u89C0\u7D93\u6FDF\u5B78\u5C0E\u8AD6\u3002", syllabus: "" },
      { code: "ECON 7020", term: "2024", level: "PhD seminar",
        t_en: "Topics in Family & Health Economics", t_zh: "\u5BB6\u5EAD\u8207\u5065\u5EB7\u7D93\u6FDF\u5B78\u5C08\u984C",
        role_en: "Instructor", role_zh: "\u6388\u8AB2\u6559\u5E2B",
        n_en: "Reading seminar on frontier work in family and health economics.",
        n_zh: "\u5BB6\u5EAD\u8207\u5065\u5EB7\u7D93\u6FDF\u5B78\u524D\u6CBF\u6587\u737B\u7684\u95B1\u8B80\u8AB2\u7A0B\u3002", syllabus: "" }
    ],

    cv: {
      sections: [
        { t_en: "Appointments", t_zh: "\u5DE5\u4F5C\u7D93\u6B77", items: [
          { year: "2023\u2013", p_en: "Associate Professor of Economics", p_zh: "\u7D93\u6FDF\u5B78\u7CFB\u526F\u6559\u6388", s_en: "National Taiwan University", s_zh: "\u570B\u7ACB\u81FA\u7063\u5927\u5B78" },
          { year: "2023\u2013", p_en: "Director, Behavioral & Data Science Research Center", p_zh: "\u884C\u70BA\u8207\u8CC7\u6599\u79D1\u5B78\u7814\u7A76\u4E2D\u5FC3\u4E3B\u4EFB", s_en: "National Taiwan University", s_zh: "\u570B\u7ACB\u81FA\u7063\u5927\u5B78" }
        ]},
        { t_en: "Education", t_zh: "\u5B78\u6B77", items: [
          { year: "\u2014", p_en: "Ph.D. in Economics", p_zh: "\u7D93\u6FDF\u5B78\u535A\u58EB", s_en: "[University \u2014 edit in CV tab]", s_zh: "\u3014\u5B78\u6821 \u2014 \u8ACB\u65BC CV \u5206\u9801\u7DE8\u8F2F\u3015" }
        ]},
        { t_en: "Fields", t_zh: "\u7814\u7A76\u9818\u57DF", items: [
          { year: "", p_en: "Labor Economics \u00B7 Family Economics \u00B7 Health Economics \u00B7 Market Design", p_zh: "\u52DE\u52D5\u7D93\u6FDF\u5B78 \u00B7 \u5BB6\u5EAD\u7D93\u6FDF\u5B78 \u00B7 \u5065\u5EB7\u7D93\u6FDF\u5B78 \u00B7 \u5E02\u5834\u8A2D\u8A08", s_en: "", s_zh: "" }
        ]},
        { t_en: "Honors & Grants", t_zh: "\u69AE\u8B7D\u8207\u88DC\u52A9", items: [
          { year: "\u2014", p_en: "[Add grants and honors in the CV tab]", p_zh: "\u3014\u8ACB\u65BC CV \u5206\u9801\u65B0\u589E\u88DC\u52A9\u8207\u69AE\u8B7D\u3015", s_en: "", s_zh: "" }
        ]}
      ]
    }
  };

  /* ----------------------------------------------------------
     4 · HELPERS
     ---------------------------------------------------------- */
  var D = DATA;                              // active dataset (swapped by setData)
  function setData(d) { D = d || DATA; }
  function L(o, base, lang) { if (!o) return ""; return o[base + "_" + lang] || o[base + "_en"] || ""; }
  function LA(o, base, lang) { if (!o) return []; return o[base + "_" + lang] || o[base + "_en"] || []; }
  function ui(group, key, lang) { var g = UI[group] || {}; var e = g[key] || {}; return e[lang] || e.en || key; }
  function paper(id) { for (var i = 0; i < D.papers.length; i++) if (D.papers[i].id === id) return D.papers[i]; return null; }
  function student(id) { for (var i = 0; i < D.students.length; i++) if (D.students[i].id === id) return D.students[i]; return null; }
  function instObj(k) { for (var i = 0; i < INSTS.length; i++) if (INSTS[i].key === k) return INSTS[i]; return null; }
  function instColor(k) { var o = instObj(k); return o ? o.color : GREEN; }
  function stageLabel(inst, stage, lang) { var a = INST_STAGES[inst] || []; for (var i = 0; i < a.length; i++) if (a[i].key === stage) return a[i][lang] || a[i].en; return stage; }
  function firstStage(inst) { var a = INST_STAGES[inst] || []; return a.length ? a[0].key : null; }
  function papersAt(inst, stage, filter) {
    return D.papers.filter(function (p) {
      if (!p.pos || p.pos[inst] !== stage) return false;
      if (filter && filter !== "all" && p.st !== filter) return false;
      return true;
    });
  }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function chip(txt, bg, col, bord) {
    return '<span style="font-family:' + GR + '; font-size:11px; padding:3px 9px; border-radius:20px; background:' + bg + '; color:' + col + '; border:1px solid ' + (bord || "transparent") + ';">' + txt + '</span>';
  }
  function links(p, lang) {
    var out = [];
    if (p.doi) out.push('<a href="' + p.doi + '" target="_blank" style="color:' + GREEN + ';">' + (lang === "zh" ? "\u671F\u520A" : "Journal") + ' \u2197</a>');
    if (p.nber) out.push('<a href="https://www.nber.org/papers/w' + p.nber + '" target="_blank" style="color:' + GREEN + ';">NBER \u2197</a>');
    if (p.ssrn) out.push('<a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=' + p.ssrn + '" target="_blank" style="color:' + GREEN + ';">SSRN \u2197</a>');
    if (p.media && p.media.length) out.push('<span style="color:' + MUTE + ';">' + (lang === "zh" ? "\u5A92\u9AD4\uFF1A" : "Media: ") + p.media.map(function (m) { return '<a href="' + m[1] + '" target="_blank" style="color:' + MUTE + '; text-decoration:underline;">' + m[0] + '</a>'; }).join(" \u00B7 ") + '</span>');
    return out;
  }

  /* ====================  NAV + FOOTER  ==================== */
  function navHTML(route, lang) {
    var s = D.settings;
    var items = [["home", "#/"], ["research", "#/research"], ["students", "#/students"], ["teaching", "#/teaching"], ["cv", "#/cv"], ["personal", "#/personal"]];
    var navItems = items.map(function (it) {
      var on = (route === it[0]) || (route === "home" && it[0] === "home");
      return '<a href="' + it[1] + '" data-nav style="font-family:' + GR + '; font-size:13.5px; color:' + (on ? "#F3F1EC" : "#bfc0b6") + '; border-bottom:1.5px solid ' + (on ? "#F3F1EC" : "transparent") + '; padding-bottom:3px; transition:color .15s;">' + ui("nav", it[0], lang) + '</a>';
    }).join("");
    var toggle = '<span style="display:inline-flex; border:1px solid rgba(243,241,236,.3); border-radius:20px; overflow:hidden; font-size:12px; margin-left:6px;">'
      + '<span data-lang="en" style="cursor:pointer; padding:4px 11px; font-family:' + GR + '; ' + (lang === "en" ? "background:#F3F1EC; color:#1E1F1A;" : "color:#bfc0b6;") + '">EN</span>'
      + '<span data-lang="zh" style="cursor:pointer; padding:4px 11px; ' + (lang === "zh" ? "background:#F3F1EC; color:#1E1F1A;" : "color:#bfc0b6;") + '">\u4E2D\u6587</span></span>';
    return '<div class="kmc-nav" style="position:sticky; top:0; z-index:50; display:flex; justify-content:space-between; align-items:center; padding:18px var(--px); background:#1E1F1A; color:#F3F1EC;">'
      + '<a href="#/" data-nav style="font-family:' + GR + '; font-size:16px; font-weight:600; letter-spacing:-.01em; color:#F3F1EC;">' + esc(L(s, "name", lang)) + (lang === "en" ? ' <span style="color:#8f9189; font-weight:400;">\u9673\u51A0\u9298</span>' : ' <span style="color:#8f9189; font-weight:400; font-family:' + GR + ';">Kuan-Ming Chen</span>') + '</a>'
      + '<div class="kmc-navlinks" style="display:flex; gap:24px; align-items:center;">' + navItems + toggle + '</div></div>';
  }
  function footerHTML(lang) {
    var s = D.settings;
    return '<div style="background:#1E1F1A; color:#cfd0c7; padding:44px var(--px) 40px; margin-top:30px;">'
      + '<div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:24px;">'
      + '<div><div style="font-family:' + GR + '; font-size:18px; font-weight:600; color:#F3F1EC;">' + esc(L(s, "name", lang)) + ' \u9673\u51A0\u9298</div>'
      + '<div style="font-size:14px; color:#9a9c93; margin-top:6px; max-width:380px; line-height:1.5;">' + esc(L(s, "dept", lang)) + '</div></div>'
      + '<div style="display:flex; flex-direction:column; gap:7px; font-family:' + GR + '; font-size:13.5px;">'
      + '<a href="mailto:' + s.email + '" style="color:#cfd0c7;">' + s.email + '</a>'
      + '<a href="' + s.scholar + '" target="_blank" style="color:#cfd0c7;">Google Scholar \u2197</a>'
      + '<a href="' + s.orcid + '" target="_blank" style="color:#cfd0c7;">ORCID \u2197</a>'
      + '<a href="' + s.cv_url + '" target="_blank" style="color:#cfd0c7;">' + (lang === "zh" ? "\u4E0B\u8F09\u5C65\u6B77" : "Download CV") + ' \u2197</a>'
      + '</div></div>'
      + '<div style="font-family:' + MONO + '; font-size:11px; color:#6f716a; margin-top:30px;">\u00A9 ' + new Date().getFullYear() + ' ' + esc(L(s, "name", lang)) + ' \u00B7 National Taiwan University</div></div>';
  }

  function pillLinks(lang) {
    var s = D.settings;
    function pill(txt, href, solid) {
      return '<a href="' + href + '" target="_blank" style="font-family:' + GR + '; font-size:13px; padding:9px 16px; border-radius:24px; ' + (solid ? 'background:' + GREEN + '; color:#fff;' : 'border:1px solid rgba(30,31,26,.25); color:#1E1F1A;') + '">' + txt + '</a>';
    }
    return '<div style="display:flex; gap:10px; flex-wrap:wrap;">'
      + pill("Google Scholar", s.scholar, true)
      + pill("ORCID", s.orcid, false)
      + pill((lang === "zh" ? "\u5C65\u6B77 CV" : "CV") + " \u2197", s.cv_url, false)
      + pill((lang === "zh" ? "\u4F86\u4FE1" : "Email"), "mailto:" + s.email, false) + '</div>';
  }

  /* ====================  HOME  ==================== */
  function homeHTML(lang) {
    var s = D.settings;
    var hero = '<div style="display:grid; grid-template-columns:1fr 300px; gap:0;">'
      + '<div style="padding:60px var(--px) 54px;">'
      + '<div style="display:inline-flex; align-items:center; gap:8px; font-family:' + GR + '; font-size:12px; letter-spacing:.06em; text-transform:uppercase; color:' + GREEN + '; margin-bottom:20px;"><span style="width:7px; height:7px; background:' + GREEN + '; border-radius:50%;"></span>' + (lang === "zh" ? "\u52DE\u52D5\u7D93\u6FDF\u5B78\u5BB6 \u00B7 \u81FA\u5927" : "Labor economist \u00B7 NTU") + '</div>'
      + '<h1 style="font-family:' + GR + '; font-size:56px; line-height:1.02; font-weight:600; letter-spacing:-.02em; margin:0 0 20px; max-width:560px;">' + esc(L(s, "hero", lang)) + '</h1>'
      + '<p style="font-size:18.5px; line-height:1.62; color:#3c3d36; max-width:520px; margin:0 0 26px;">' + esc(L(s, "blurb", lang)) + '</p>'
      + pillLinks(lang) + '</div>'
      + (s.photo
          ? '<div class="kmc-hero-photo" style="border-left:1px solid rgba(30,31,26,.12); background:' + PANEL + '; min-height:420px;"><img src="' + esc(s.photo) + '" alt="' + esc(L(s, "name", lang)) + '" style="width:100%; height:100%; object-fit:cover; display:block;"></div>'
          : '<div class="kmc-hero-photo" style="background-image:repeating-linear-gradient(135deg,#e6e3da 0 10px,#eeeae1 10px 20px); border-left:1px solid rgba(30,31,26,.12); display:flex; align-items:flex-end; justify-content:center; padding:16px;"><span style="font-family:' + MONO + '; font-size:11px; color:' + FAINT + ';">headshot</span></div>')
      + '</div>';

    // selected findings (first 3 featured)
    var cards = D.featured.slice(0, 3).map(function (f) {
      return '<a href="#/featured" data-nav style="display:block; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 1px 2px rgba(0,0,0,.05);">'
        + (f.img
            ? '<div style="height:88px; overflow:hidden; background:' + f.color + '0c;"><img src="' + esc(f.img) + '" alt="" style="width:100%; height:100%; object-fit:cover; display:block;"></div>'
            : '<div style="height:70px; background-image:repeating-linear-gradient(135deg,' + f.color + '14 0 10px,' + f.color + '08 10px 20px); display:flex; align-items:flex-end; padding:8px 12px;"><span style="font-family:' + MONO + '; font-size:10px; color:' + f.color + '; opacity:.7;">' + esc(L(f, "fig", lang)) + '</span></div>')
        + '<div style="padding:20px 22px;"><span style="font-family:' + GR + '; font-size:10px; letter-spacing:.04em; text-transform:uppercase; color:' + f.color + '; background:' + f.color + '1c; padding:3px 9px; border-radius:20px;">' + esc(L(f, "topic", lang)) + '</span>'
        + '<div style="font-family:' + GR + '; font-size:42px; font-weight:700; color:' + f.color + '; letter-spacing:-.02em; line-height:1; margin:14px 0 8px;">' + f.num + '</div>'
        + '<p style="font-size:14.5px; line-height:1.5; color:' + MUTE + '; margin:0;">' + esc(L(f, "unit", lang)) + '</p></div></a>';
    }).join("");
    var findings = '<div style="padding:48px var(--px) 8px; border-top:1px solid rgba(30,31,26,.12);">'
      + '<div style="display:flex; align-items:baseline; justify-content:space-between; margin:0 0 22px;">'
      + '<h2 style="font-family:' + GR + '; font-size:14px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:' + GREEN + '; margin:0;">' + (lang === "zh" ? "\u91CD\u9EDE\u767C\u73FE" : "Selected findings") + '</h2>'
      + '<a href="#/featured" data-nav style="font-family:' + GR + '; font-size:13px; color:' + GREEN + ';">' + (lang === "zh" ? "\u67E5\u770B\u5168\u90E8 \u2192" : "All featured findings \u2192") + '</a></div>'
      + '<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px;">' + cards + '</div></div>';

    // research areas (institutions \u2192 map)
    var areas = INSTS.map(function (o) {
      var n = D.papers.filter(function (p) { return p.ins.indexOf(o.key) >= 0; }).length;
      return '<a href="#/research?inst=' + o.key + '" data-nav style="display:flex; flex-direction:column; gap:10px; background:#fff; border-radius:8px; padding:22px 24px; box-shadow:0 1px 2px rgba(0,0,0,.05); border-top:3px solid ' + o.color + ';">'
        + '<span style="font-family:' + GR + '; font-size:19px; font-weight:600; color:#1E1F1A;">' + esc(o[lang] || o.en) + '</span>'
        + '<span style="font-family:' + MONO + '; font-size:11px; color:' + FAINT + ';">' + n + (lang === "zh" ? " \u7BC7\u7814\u7A76" : " papers") + '</span></a>';
    }).join("");
    var areasBlock = '<div style="padding:44px var(--px) 56px;">'
      + '<div style="display:flex; align-items:baseline; justify-content:space-between; margin:0 0 20px;">'
      + '<h2 style="font-family:' + GR + '; font-size:14px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:' + GREEN + '; margin:0;">' + (lang === "zh" ? "\u7814\u7A76\u9818\u57DF" : "Where I work") + '</h2>'
      + '<a href="#/research" data-nav style="font-family:' + GR + '; font-size:13px; color:' + GREEN + ';">' + (lang === "zh" ? "\u751F\u547D\u6B77\u7A0B\u5730\u5716 \u2192" : "Explore the lifecycle map \u2192") + '</a></div>'
      + '<div style="display:grid; grid-template-columns:repeat(4,1fr); gap:13px;">' + areas + '</div></div>';

    return hero + findings + areasBlock;
  }

  /* ====================  RESEARCH (map)  ==================== */
  function researchSubnav(active, lang) {
    var tabs = [["featured", "#/featured"], ["map", "#/research"], ["browse", "#/browse"]];
    return '<div style="display:flex; gap:8px; padding:14px var(--px) 16px; background:#1E1F1A;">' + tabs.map(function (t) {
      var on = t[0] === active;
      return '<a href="' + t[1] + '" data-nav style="font-family:' + GR + '; font-size:12.5px; padding:6px 14px; border-radius:20px; ' + (on ? 'color:#1E1F1A; background:#F3F1EC;' : 'color:#bfc0b6; border:1px solid rgba(243,241,236,.25);') + '">' + ui("sub", t[0], lang) + '</a>';
    }).join("") + '</div>';
  }
  function tabsHTML(inst, lang) {
    return INSTS.map(function (o) {
      var on = o.key === inst;
      return '<span data-inst="' + o.key + '" style="cursor:pointer; font-family:' + GR + '; font-size:14px; font-weight:600; padding:9px 17px; border-radius:8px; background:' + (on ? o.color : "#fff") + '; color:' + (on ? "#fff" : "#3c3d36") + '; border:1px solid ' + (on ? o.color : "rgba(30,31,26,.18)") + '; box-shadow:0 1px 2px rgba(0,0,0,.04);">' + esc(o[lang] || o.en) + '</span>';
    }).join("");
  }
  function timelineHTML(inst, stage, pid, filter, lang) {
    var stages = INST_STAGES[inst], col = instColor(inst), n = stages.length, edge = (50 / n);
    var T = '<div style="position:absolute; left:' + edge + '%; right:' + edge + '%; top:8px; height:2px; background:linear-gradient(90deg,' + col + ',' + col + '40);"></div>';
    T += '<div class="kmc-timeline-inner" style="display:grid; grid-template-columns:repeat(' + n + ',1fr); position:relative;">';
    stages.forEach(function (st) {
      var cnt = papersAt(inst, st.key, filter).length, active = (stage === st.key && !pid);
      T += '<div data-stagecol="' + st.key + '" style="cursor:pointer; display:flex; flex-direction:column; align-items:center; text-align:center;">'
        + '<div style="width:' + (active ? 18 : 14) + 'px; height:' + (active ? 18 : 14) + 'px; border-radius:50%; background:' + col + '; border:3px solid ' + PAPER + '; transition:all .15s ease; opacity:' + (cnt ? 1 : .35) + '; box-shadow:' + (active ? "0 0 0 5px " + col + "22" : "none") + ';"></div>'
        + '<div style="font-family:' + GR + '; font-size:11.5px; font-weight:600; margin-top:13px; line-height:1.2; max-width:130px; color:' + (active ? INK : "#3c3d36") + ';">' + esc(st[lang] || st.en) + '</div>'
        + '<div style="font-family:' + MONO + '; font-size:10px; color:' + FAINT + '; margin-top:4px;">' + cnt + '</div></div>';
    });
    return T + '</div>';
  }
  function statusHTML(filter, lang) {
    var keys = ["all", "published", "forthcoming", "rr", "working", "progress"];
    var chips = keys.map(function (k) {
      var on = k === filter;
      var label = (k === "all") ? (lang === "zh" ? "\u5168\u90E8" : "All") : ('<span style="color:' + STATUS[k].color + ';">' + STATUS[k].dot + '</span> ' + (STATUS[k][lang] || STATUS[k].en));
      return '<span data-mapfilter="' + k + '" style="cursor:pointer; font-family:' + GR + '; font-size:13px; padding:6px 14px; border-radius:20px; background:' + (on ? INK : "#fff") + '; color:' + (on ? "#fff" : "#3c3d36") + '; border:1px solid ' + (on ? INK : "rgba(30,31,26,.2)") + ';">' + label + '</span>';
    }).join("");
    return '<span style="font-family:' + MONO + '; font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:' + FAINT + ';">' + (lang === "zh" ? "\u72C0\u614B" : "Status") + '</span>' + chips;
  }
  function paperDetailHTML(p, inst, stage, lang) {
    var st = STATUS[p.st];
    var insChips = p.ins.map(function (k) { var o = instObj(k); return chip(esc(o[lang] || o.en), "#fff", o.color, o.color); }).join(" ");
    var co = p.co.length ? ('<div style="font-size:14px; color:' + MUTE + '; font-style:italic; margin-top:6px;">' + (lang === "zh" ? "\u5408\u8457\uFF1A" : "with ") + esc(p.co.join(", ")) + '</div>') : "";
    var stu = p.stu.length ? ('<div style="margin-top:12px; display:flex; flex-wrap:wrap; gap:7px; align-items:center;"><span style="font-family:' + MONO + '; font-size:10px; letter-spacing:.08em; text-transform:uppercase; color:' + FAINT + ';">' + (lang === "zh" ? "\u5B78\u751F" : "Students") + '</span>' + p.stu.map(function (sid) { var ss = student(sid); return chip(esc((ss ? L(ss, "name", lang) : sid)) + " \u2197", "#f1ede3", INK, "rgba(30,31,26,.15)"); }).join(" ") + '</div>') : "";
    var back = '<div data-back style="cursor:pointer; display:inline-flex; align-items:center; gap:8px; font-family:' + GR + '; font-size:13px; font-weight:600; color:' + GREEN + '; background:#e3efe7; border:1px solid rgba(31,107,74,.35); padding:9px 15px; border-radius:24px; margin-bottom:20px;"><span style="font-size:16px; line-height:1;">\u2190</span> ' + (lang === "zh" ? "\u8FD4\u56DE" : "Back to ") + esc(stageLabel(inst, stage, lang)) + '</div>';
    var summ = L(p, "s", lang) ? '<p style="font-size:16px; line-height:1.6; color:#3c3d36; margin:16px 0 0; max-width:760px;">' + esc(L(p, "s", lang)) + '</p>' : "";
    return back
      + '<div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;"><span style="font-family:' + GR + '; font-size:10px; letter-spacing:.05em; text-transform:uppercase; color:#fff; background:' + st.color + '; padding:4px 10px; border-radius:20px;">' + (st[lang] || st.en) + '</span><span style="font-size:13px; color:' + MUTE + ';">' + esc(L(p, "out", lang)) + '</span></div>'
      + '<div style="font-family:' + GR + '; font-size:23px; font-weight:600; line-height:1.25; color:' + INK + '; max-width:760px;">' + esc(L(p, "t", lang)) + '</div>'
      + co + summ
      + '<div style="display:flex; flex-wrap:wrap; gap:7px; margin-top:14px; align-items:center;"><span style="font-family:' + MONO + '; font-size:10px; letter-spacing:.08em; text-transform:uppercase; color:' + FAINT + '; margin-right:2px;">' + (lang === "zh" ? "\u4EA6\u5C6C\u65BC" : "Also in") + '</span>' + insChips + '</div>'
      + stu
      + '<div style="display:flex; gap:16px; margin-top:16px; font-family:' + GR + '; font-size:13px; flex-wrap:wrap;">' + links(p, lang).join('<span style="color:#cfc9bd;">\u00B7</span>') + '</div>';
  }
  function stageListHTML(inst, stage, filter, lang) {
    var col = instColor(inst), label = stageLabel(inst, stage, lang), ps = papersAt(inst, stage, filter);
    var head = '<div style="display:flex; align-items:baseline; gap:12px; margin-bottom:14px;"><span style="font-family:' + GR + '; font-size:20px; font-weight:600; color:' + INK + ';">' + esc(label) + '</span><span style="font-family:' + MONO + '; font-size:11px; color:' + FAINT + ';">' + ps.length + (lang === "zh" ? " \u7BC7" : (" project" + (ps.length === 1 ? "" : "s"))) + '</span></div>';
    if (!ps.length) return head + '<div style="font-family:' + GR + '; color:' + FAINT + '; font-size:14px;">' + (lang === "zh" ? "\u6B64\u968E\u6BB5\u66AB\u7121\u7B26\u5408\u689D\u4EF6\u7684\u7814\u7A76\u3002" : "No projects at this stage" + (filter && filter !== "all" ? " for this status" : "") + ".") + '</div>';
    var items = ps.map(function (p) {
      var st = STATUS[p.st];
      return '<div data-open-pid="' + p.id + '" style="cursor:pointer; display:flex; align-items:center; justify-content:space-between; gap:14px; background:#fff; border-left:3px solid ' + col + '; border-radius:0 6px 6px 0; padding:13px 15px; box-shadow:0 1px 2px rgba(0,0,0,.05);">'
        + '<div><div style="font-family:' + GR + '; font-size:15px; font-weight:600; color:' + INK + '; line-height:1.3;">' + esc(L(p, "t", lang)) + '</div><div style="font-size:12px; color:' + MUTE + '; margin-top:3px;"><span style="color:' + st.color + ';">' + st.dot + '</span> ' + (st[lang] || st.en) + ' \u00B7 ' + esc(L(p, "out", lang)) + '</div></div>'
        + '<span style="font-family:' + GR + '; font-size:12px; color:' + col + '; white-space:nowrap;">' + (lang === "zh" ? "\u67E5\u770B \u2192" : "view \u2192") + '</span></div>';
    }).join("");
    return head + '<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; align-items:start;">' + items + '</div>';
  }
  function researchBodyHTML(s) {
    var lang = s.lang, inst = s.inst || "household", stage = s.stage || firstStage(inst), pid = s.pid || null, filter = s.filter || "all";
    var panel = pid ? paperDetailHTML(paper(pid), inst, stage, lang) : stageListHTML(inst, stage, filter, lang);
    return '<div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:34px;">' + tabsHTML(inst, lang) + '</div>'
      + '<div class="kmc-timeline" style="position:relative; padding:0 1%; margin-bottom:30px;">' + timelineHTML(inst, stage, pid, filter, lang) + '</div>'
      + '<div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:20px;">' + statusHTML(filter, lang) + '</div>'
      + '<div style="min-height:200px; background:' + PANEL + '; border-radius:8px; padding:24px 26px;">' + panel + '</div>';
  }
  function researchHTML(s) {
    var lang = s.lang;
    return researchSubnav("map", lang)
      + '<div style="padding:42px var(--px) 12px;"><h1 style="font-family:' + GR + '; font-size:46px; font-weight:600; letter-spacing:-.02em; margin:0 0 12px;">' + (lang === "zh" ? "\u6211\u7684\u7814\u7A76\u5730\u5716" : "A map of my research") + '</h1>'
      + '<p style="font-size:18px; line-height:1.6; color:#3c3d36; max-width:680px; margin:0;">' + (lang === "zh" ? "<strong>\u5148\u9078\u4E00\u500B\u5236\u5EA6</strong>\uFF0C\u4F9D\u5176\u5C08\u5C6C\u6B77\u7A0B\u5C55\u958B\u6642\u9593\u8EF8\uFF1B<strong>\u6ED1\u904E\u4EFB\u4E00\u968E\u6BB5</strong>\u53EF\u770B\u8A72\u968E\u6BB5\u7684\u7814\u7A76\uFF0C<strong>\u9EDE\u9078</strong>\u5247\u986F\u793A\u5B8C\u6574\u8CC7\u8A0A\u3002" : "<strong>Pick an institution</strong> to lay out its own timeline, <strong>hover a stage</strong> to see the projects there, and <strong>click one</strong> for full detail.") + '</p></div>'
      + '<div style="padding:30px var(--px) 48px;">' + researchBodyHTML(s) + '</div>';
  }

  /* ====================  FEATURED  ==================== */
  function featuredCount() { return D.featured.length; }
  function featuredSpotlightHTML(idx, lang) {
    var f = D.featured[idx % D.featured.length];
    var p = paper(f.pid) || {};
    return '<div style="display:grid; grid-template-columns:420px 1fr; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,.06);">'
      + (f.img
          ? '<div style="background:' + f.color + '0c; min-height:320px; overflow:hidden;"><img src="' + esc(f.img) + '" alt="" style="width:100%; height:100%; object-fit:cover; display:block;"></div>'
          : '<div style="background-image:repeating-linear-gradient(135deg,' + f.color + '14 0 11px,' + f.color + '09 11px 22px); display:flex; align-items:flex-end; justify-content:space-between; padding:14px; min-height:320px;"><span style="font-family:' + MONO + '; font-size:11px; color:' + f.color + '; opacity:.7;">' + (lang === "zh" ? "\u95DC\u9375\u5716 \u2014 " : "key figure \u2014 ") + esc(L(f, "fig", lang)) + '</span><span style="font-family:' + MONO + '; font-size:11px; color:' + f.color + '; opacity:.7;">fig. 1</span></div>')
      + '<div style="padding:34px 38px; display:flex; flex-direction:column; justify-content:center;">'
      + '<span style="font-family:' + GR + '; font-size:10px; letter-spacing:.04em; text-transform:uppercase; color:' + f.color + '; background:' + f.color + '1c; padding:4px 10px; border-radius:20px; align-self:flex-start;">' + esc(L(f, "topic", lang)) + '</span>'
      + '<div style="display:flex; align-items:baseline; gap:16px; margin:18px 0 8px;"><span style="font-family:' + GR + '; font-size:62px; font-weight:700; line-height:.9; color:' + f.color + '; letter-spacing:-.02em;">' + f.num + '</span><span style="font-size:15.5px; color:' + MUTE + '; line-height:1.35; max-width:250px;">' + esc(L(f, "unit", lang)) + '</span></div>'
      + '<div style="font-family:' + GR + '; font-size:23px; font-weight:600; line-height:1.2; margin-top:4px; color:' + INK + ';">' + esc(L(p, "t", lang)) + '</div>'
      + (p.co && p.co.length ? '<div style="font-size:14px; color:' + MUTE + '; font-style:italic; margin-top:5px;">' + (lang === "zh" ? "\u5408\u8457\uFF1A" : "with ") + esc(p.co.join(", ")) + ' \u00B7 ' + esc(L(p, "out", lang)) + '</div>' : "")
      + (L(p, "s", lang) ? '<p style="font-size:15.5px; line-height:1.55; color:#3c3d36; margin:14px 0 0;">' + esc(L(p, "s", lang)) + '</p>' : "")
      + '<div style="display:flex; gap:16px; margin-top:18px; font-family:' + GR + '; font-size:13px; flex-wrap:wrap;">' + links(p, lang).join('<span style="color:#cfc9bd;">\u00B7</span>') + '</div>'
      + '</div></div>';
  }
  function featuredDotsHTML(idx, lang) {
    var f = D.featured[idx % D.featured.length];
    var dots = D.featured.map(function (x, i) {
      var on = i === idx;
      return '<span data-feat-dot="' + i + '" style="cursor:pointer; width:' + (on ? 24 : 9) + 'px; height:9px; border-radius:20px; background:' + (on ? f.color : "#cfc9bd") + '; transition:all .3s ease; display:inline-block;"></span>';
    }).join("");
    return '<div style="display:flex; align-items:center; gap:14px;">'
      + '<span data-feat-prev style="cursor:pointer; font-family:' + GR + '; font-size:20px; line-height:1; color:' + MUTE + ';">\u2039</span>'
      + '<div style="display:flex; align-items:center; gap:7px;">' + dots + '</div>'
      + '<span data-feat-next style="cursor:pointer; font-family:' + GR + '; font-size:20px; line-height:1; color:' + MUTE + ';">\u203A</span>'
      + '<span style="font-family:' + MONO + '; font-size:11px; color:' + FAINT + '; margin-left:8px;">' + (idx + 1) + " / " + D.featured.length + (lang === "zh" ? " \u00B7 \u81EA\u52D5\u8F2A\u64AD" : " \u00B7 auto-rotates") + '</span></div>';
  }
  function featuredHTML(s) {
    var lang = s.lang;
    return researchSubnav("featured", lang)
      + '<div style="padding:42px var(--px) 8px;"><h1 style="font-family:' + GR + '; font-size:46px; font-weight:600; letter-spacing:-.02em; margin:0 0 12px;">' + (lang === "zh" ? "\u91CD\u9EDE\u767C\u73FE" : "Featured findings") + '</h1>'
      + '<p style="font-size:18px; line-height:1.6; color:#3c3d36; max-width:660px; margin:0;">' + (lang === "zh" ? "\u4E00\u500B\u8F2A\u64AD\u7684\u7126\u9EDE\uFF0C\u6BCF\u9805\u90FD\u914D\u4E0A\u6700\u80FD\u8AAA\u660E\u5B83\u7684\u90A3\u500B\u6578\u5B57\u3002\u53EF\u9EDE\u9078\u5C0E\u89BD\u9EDE\u6216\u7BAD\u982D\u3002" : "A rotating spotlight, each with the single number that captures it. Click a dot or arrow to steer.") + '</p></div>'
      + '<div style="padding:28px var(--px) 6px;">' + featuredSpotlightHTML(s.featIdx || 0, lang) + '</div>'
      + '<div style="padding:16px var(--px) 6px;">' + featuredDotsHTML(s.featIdx || 0, lang) + '</div>'
      + '<div style="padding:20px var(--px) 30px;"><a href="#/research" data-nav style="font-family:' + GR + '; font-size:13px; color:' + GREEN + ';">' + (lang === "zh" ? "\u5728\u751F\u547D\u6B77\u7A0B\u5730\u5716\u67E5\u770B\u6240\u6709\u7814\u7A76 \u2192" : "See all research on the lifecycle map \u2192") + '</a></div>';
  }

  /* ====================  BROWSE  ==================== */
  function browseFilter(s) {
    var q = (s.q || "").toLowerCase(), Lb = s.labels || {};
    var facets = { status: [], topic: [], inst: [] };
    Object.keys(Lb).forEach(function (k) { if (Lb[k]) { var sp = k.split(":"); if (facets[sp[0]]) facets[sp[0]].push(sp[1]); } });
    return D.papers.filter(function (p) {
      if (q) { var hay = (p.t_en + " " + p.t_zh + " " + p.co.join(" ") + " " + p.out_en).toLowerCase(); if (hay.indexOf(q) === -1) return false; }
      if (facets.status.length && facets.status.indexOf(p.st) === -1) return false;
      if (facets.topic.length && !facets.topic.some(function (t) { return p.top.indexOf(t) >= 0; })) return false;
      if (facets.inst.length && !facets.inst.some(function (t) { return p.ins.indexOf(t) >= 0; })) return false;
      return true;
    });
  }
  function browseCount(s) { return browseFilter(s).length + (s.lang === "zh" ? " / " + D.papers.length + " \u7BC7" : " of " + D.papers.length + " papers"); }
  function browseListHTML(s) {
    var lang = s.lang, list = browseFilter(s);
    if (!list.length) return '<div style="padding:40px 0; text-align:center; color:' + FAINT + '; font-family:' + GR + ';">' + (lang === "zh" ? "\u6C92\u6709\u7B26\u5408\u689D\u4EF6\u7684\u8AD6\u6587\u3002" : "No papers match these filters.") + '</div>';
    return list.map(function (p) {
      var st = STATUS[p.st];
      var tags = p.top.map(function (t) { return chip(esc(TOPICS[t] ? (TOPICS[t][lang] || TOPICS[t].en) : t), PANEL, MUTE); }).join(" ");
      var co = p.co.length ? '<span style="font-style:italic;"> \u2014 ' + (lang === "zh" ? "\u5408\u8457\uFF1A" : "with ") + esc(p.co.join(", ")) + '</span>' : "";
      return '<div style="display:grid; grid-template-columns:1fr auto; gap:18px; padding:16px 0; border-bottom:1px solid rgba(30,31,26,.1); align-items:start;">'
        + '<div><div style="font-family:' + GR + '; font-size:17px; font-weight:600; line-height:1.3; color:' + INK + ';">' + esc(L(p, "t", lang)) + '</div>'
        + '<div style="font-size:13.5px; color:' + MUTE + '; margin-top:3px;">' + esc(L(p, "out", lang)) + co + '</div>'
        + '<div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:9px; align-items:center;">' + tags + (links(p, lang).length ? '<span style="font-family:' + GR + '; font-size:12px; color:' + GREEN + '; margin-left:6px;">' + links(p, lang).join(' \u00B7 ') + '</span>' : "") + '</div></div>'
        + '<span style="font-family:' + GR + '; font-size:10px; letter-spacing:.05em; text-transform:uppercase; color:#fff; background:' + st.color + '; padding:4px 10px; border-radius:20px; white-space:nowrap;">' + (st[lang] || st.en) + '</span></div>';
    }).join("");
  }
  function browseChipsHTML(s) {
    var lang = s.lang, Lb = s.labels || {};
    function group(title, facet, entries) {
      var inner = entries.map(function (e) {
        var on = !!Lb[facet + ":" + e[0]];
        return '<span data-chip="' + facet + ":" + e[0] + '" style="cursor:pointer; font-family:' + GR + '; font-size:12px; padding:5px 12px; border-radius:20px; background:' + (on ? INK : "#fff") + '; color:' + (on ? "#fff" : "#3c3d36") + '; border:1px solid ' + (on ? INK : "rgba(30,31,26,.2)") + ';">' + esc(e[1]) + '</span>';
      }).join("");
      return '<div style="display:flex; align-items:baseline; gap:10px; margin-bottom:10px; flex-wrap:wrap;"><span style="font-family:' + MONO + '; font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:' + FAINT + '; width:78px; flex:none;">' + title + '</span><div style="display:flex; flex-wrap:wrap; gap:6px;">' + inner + '</div></div>';
    }
    var statusE = Object.keys(STATUS).map(function (k) { return [k, STATUS[k][lang] || STATUS[k].en]; });
    var topicE = Object.keys(TOPICS).map(function (k) { return [k, TOPICS[k][lang] || TOPICS[k].en]; });
    var instE = INSTS.map(function (i) { return [i.key, i[lang] || i.en]; });
    return group(lang === "zh" ? "\u72C0\u614B" : "Status", "status", statusE)
      + group(lang === "zh" ? "\u4E3B\u984C" : "Topic", "topic", topicE)
      + group(lang === "zh" ? "\u5236\u5EA6" : "Institution", "inst", instE);
  }
  function browseHTML(s) {
    var lang = s.lang;
    return researchSubnav("browse", lang)
      + '<div style="padding:42px var(--px) 14px;"><h1 style="font-family:' + GR + '; font-size:46px; font-weight:600; letter-spacing:-.02em; margin:0 0 12px;">' + (lang === "zh" ? "\u6240\u6709\u8AD6\u6587" : "Browse all papers") + '</h1>'
      + '<p style="font-size:18px; line-height:1.6; color:#3c3d36; max-width:640px; margin:0;">' + (lang === "zh" ? "\u53EF\u641C\u5C0B\u7684\u5B8C\u6574\u6E05\u55AE\u3002\u540C\u7D44\u5167\u7684\u7BE9\u9078\u6703\u64F4\u5927\u7D50\u679C\uFF0C\u8DE8\u7D44\u5247\u7E2E\u5C0F\u7D50\u679C\u3002" : "The full list, searchable. Filters within a group widen results; across groups they narrow.") + '</p></div>'
      + '<div style="padding:18px var(--px) 40px;">'
      + '<div style="display:flex; align-items:center; gap:12px; background:#fff; border:1px solid rgba(30,31,26,.16); border-radius:8px; padding:12px 16px; margin-bottom:20px;">'
      + '<span style="color:' + FAINT + '; font-size:16px;">\u2315</span>'
      + '<input type="text" data-browse-search value="' + esc(s.q || "") + '" placeholder="' + (lang === "zh" ? "\u641C\u5C0B\u6A19\u984C\u3001\u5408\u8457\u3001\u671F\u520A\u2026" : "Search titles, coauthors, journals\u2026") + '" style="border:none; background:transparent; flex:1; font-family:' + GR + '; font-size:15px; color:' + INK + '; outline:none;">'
      + '<span data-browse-count style="font-family:' + MONO + '; font-size:11px; color:' + FAINT + '; white-space:nowrap;">' + browseCount(s) + '</span></div>'
      + '<div style="margin-bottom:14px;">' + browseChipsHTML(s) + '</div>'
      + '<div data-browse-list>' + browseListHTML(s) + '</div></div>';
  }

  /* ====================  STUDENTS  ==================== */
  function roleColor(r) { if (r.indexOf("PhD") >= 0) return "#1F6B4A"; if (r.indexOf("Master") >= 0) return "#5E9B7A"; if (r.indexOf("Undergrad") >= 0) return "#9CC2A8"; if (r.indexOf("RA") >= 0) return "#C4BBA6"; return "#B0A88F"; }
  function studentsBodyHTML(s) {
    var lang = s.lang, open = s.sOpen;
    var sorted = D.students.slice().sort(function (a, b) { return b.year - a.year; });
    return sorted.map(function (st) {
      var isOpen = open === st.id, rc = roleColor(st.role);
      var theirPapers = D.papers.filter(function (p) { return p.stu.indexOf(st.id) >= 0; });
      var traj = LA(st, "traj", lang).map(function (step, i) { return (i ? '<span style="color:#c4bba6; margin:0 2px;">\u2192</span>' : "") + '<span style="font-family:' + GR + '; font-size:12.5px; color:#3c3d36; background:#f1ede3; padding:4px 10px; border-radius:20px;">' + esc(step) + '</span>'; }).join("");
      var papersHtml = theirPapers.length ? theirPapers.map(function (p) {
        var s2 = STATUS[p.st];
        return '<div style="display:flex; align-items:baseline; gap:9px; padding:8px 0; border-top:1px solid rgba(30,31,26,.08);"><span style="width:9px; height:9px; border-radius:50%; background:' + s2.color + '; flex:none; position:relative; top:4px;"></span><span style="font-family:' + GR + '; font-size:14px; font-weight:600; color:' + INK + '; line-height:1.3;">' + esc(L(p, "t", lang)) + '</span></div>';
      }).join("") : '<div style="font-size:13px; color:' + FAINT + '; font-style:italic; padding-top:6px;">' + (lang === "zh" ? "\u5C1A\u7121\u5217\u51FA\u7684\u5408\u4F5C\u8A08\u756B\u3002" : "No listed projects yet.") + '</div>';
      var body = isOpen ? ('<div style="margin-top:14px; padding-top:14px; border-top:1px solid rgba(30,31,26,.12);">'
        + '<div style="font-family:' + MONO + '; font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:' + FAINT + '; margin-bottom:9px;">' + (lang === "zh" ? "\u8077\u6DAF\u6B77\u7A0B" : "Career steps") + '</div>'
        + '<div style="display:flex; flex-wrap:wrap; gap:4px; align-items:center; margin-bottom:16px;">' + traj + '</div>'
        + '<div style="font-family:' + MONO + '; font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:' + FAINT + ';">' + (lang === "zh" ? "\u5408\u4F5C\u7814\u7A76" : "Worked with me on") + '</div>' + papersHtml
        + (st.site ? '<div style="margin-top:12px; font-family:' + GR + '; font-size:13px; color:' + GREEN + ';">' + (lang === "zh" ? "\u500B\u4EBA\u7DB2\u7AD9 \u2197" : "personal site \u2197") + '</div>' : "") + '</div>') : "";
      return '<div data-student-card="' + st.id + '" style="cursor:pointer; background:#fff; border-radius:7px; padding:18px 20px; box-shadow:0 1px 2px rgba(0,0,0,.05); border:1px solid ' + (isOpen ? "rgba(31,107,74,.3)" : "transparent") + '; align-self:start;">'
        + '<div style="display:flex; justify-content:space-between; align-items:start; gap:12px;">'
        + '<div><div style="font-family:' + GR + '; font-size:18px; font-weight:600; color:' + INK + ';">' + esc(L(st, "name", lang)) + '</div>'
        + '<div style="font-size:13px; color:' + MUTE + '; margin-top:3px; display:flex; align-items:center; gap:7px;"><span style="width:8px; height:8px; border-radius:50%; background:' + rc + ';"></span>' + esc(st.role) + ' \u00B7 ' + (lang === "zh" ? "\u81EA " : "since ") + st.year + '</div></div>'
        + '<span style="font-family:' + GR + '; font-size:18px; color:#c4bba6; transform:rotate(' + (isOpen ? "45" : "0") + 'deg);">+</span></div>'
        + '<div style="font-size:14.5px; color:#3c3d36; margin-top:10px;">\u2192 ' + esc(L(st, "place", lang)) + '</div>'
        + '<div style="font-family:' + MONO + '; font-size:10.5px; color:#b0a88f; margin-top:8px;">' + theirPapers.length + (lang === "zh" ? " \u7BC7\u5408\u4F5C" : (" project" + (theirPapers.length === 1 ? "" : "s") + " with me")) + (isOpen ? "" : (lang === "zh" ? " \u00B7 \u9EDE\u64CA\u5C55\u958B" : " \u00B7 click to expand")) + '</div>'
        + body + '</div>';
    }).join("");
  }
  function studentsHTML(s) {
    var lang = s.lang;
    var legend = [["PhD", "#1F6B4A"], ["Masters", "#5E9B7A"], ["Undergrad", "#9CC2A8"], ["RA", "#C4BBA6"]].map(function (x) {
      return '<span style="display:inline-flex; align-items:center; gap:6px;"><span style="width:8px; height:8px; border-radius:50%; background:' + x[1] + ';"></span>' + x[0] + '</span>';
    }).join("");
    return navspacer()
      + '<div style="padding:48px var(--px) 22px;"><h1 style="font-family:' + GR + '; font-size:46px; font-weight:600; letter-spacing:-.02em; margin:0 0 12px;">' + (lang === "zh" ? "\u5B78\u751F" : "Students") + '</h1>'
      + '<p style="font-size:18px; line-height:1.6; color:#3c3d36; max-width:640px; margin:0 0 18px;">' + (lang === "zh" ? "\u6211\u6307\u5C0E\u3001\u76E3\u7763\u6216\u62C5\u4EFB\u7814\u7A76\u52A9\u7406\u7684\u5B78\u751F\uFF0C\u4EE5\u53CA\u4ED6\u5011\u73FE\u5728\u7684\u53BB\u8655\u3002<strong>\u9EDE\u9078</strong>\u53EF\u770B\u5408\u4F5C\u7684\u8A08\u756B\u8207\u8077\u6DAF\u6B77\u7A0B\u3002" : "Students I've advised, supervised, or mentored as RAs, and where they are now. <strong>Click anyone</strong> to see the projects we worked on and their path since.") + ' <span style="color:' + FAINT + '; font-style:italic;">(' + (lang === "zh" ? "\u793A\u4F8B\u540D\u55AE\u2014\u8ACB\u65BC\u8A66\u7B97\u8868\u66F4\u65B0" : "Sample roster \u2014 edit in the Students tab") + ')</span></p>'
      + '<div style="display:flex; gap:16px; font-family:' + GR + '; font-size:12px; color:' + MUTE + '; align-items:center; flex-wrap:wrap;">' + legend + '</div></div>'
      + '<div data-students style="padding:6px var(--px) 40px; display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; align-items:start;">' + studentsBodyHTML(s) + '</div>';
  }

  /* ====================  TEACHING  ==================== */
  function teachingHTML(s) {
    var lang = s.lang;
    var rows = D.teaching.map(function (c) {
      return '<div style="display:grid; grid-template-columns:120px 1fr 150px; gap:20px; padding:20px 0; border-top:1px solid rgba(30,31,26,.12); align-items:start;">'
        + '<div><div style="font-family:' + MONO + '; font-size:12px; color:' + GREEN + ';">' + esc(c.code) + '</div><div style="font-family:' + MONO + '; font-size:11px; color:' + FAINT + '; margin-top:4px;">' + esc(c.term) + '</div></div>'
        + '<div><div style="font-family:' + GR + '; font-size:20px; font-weight:600; color:' + INK + ';">' + esc(L(c, "t", lang)) + '</div>'
        + '<div style="font-size:14px; color:' + MUTE + '; margin-top:6px; line-height:1.55; max-width:560px;">' + esc(L(c, "n", lang)) + '</div>'
        + (c.syllabus ? '<a href="' + c.syllabus + '" target="_blank" style="font-family:' + GR + '; font-size:13px; color:' + GREEN + '; display:inline-block; margin-top:8px;">' + (lang === "zh" ? "\u8AB2\u7DB1 \u2197" : "Syllabus \u2197") + '</a>' : "") + '</div>'
        + '<div style="justify-self:start;"><span style="font-family:' + GR + '; font-size:11px; padding:4px 11px; border-radius:20px; background:' + PANEL + '; color:#3c3d36;">' + esc(c.level) + '</span></div></div>';
    }).join("");
    return navspacer()
      + '<div style="padding:48px var(--px) 8px;"><h1 style="font-family:' + GR + '; font-size:46px; font-weight:600; letter-spacing:-.02em; margin:0 0 12px;">' + (lang === "zh" ? "\u6559\u5B78" : "Teaching") + '</h1>'
      + '<p style="font-size:18px; line-height:1.6; color:#3c3d36; max-width:640px; margin:0;">' + (lang === "zh" ? "\u6211\u5728\u81FA\u5927\u958B\u8A2D\u7684\u8AB2\u7A0B\u3002" : "Courses I teach at National Taiwan University.") + ' <span style="color:' + FAINT + '; font-style:italic;">(' + (lang === "zh" ? "\u793A\u4F8B\u2014\u8ACB\u65BC\u8A66\u7B97\u8868\u66F4\u65B0" : "Sample \u2014 edit in the Teaching tab") + ')</span></p></div>'
      + '<div style="padding:20px var(--px) 50px;"><div style="border-bottom:1px solid rgba(30,31,26,.12);">' + rows + '</div></div>';
  }

  /* ====================  CV  ==================== */
  function cvHTML(s) {
    var lang = s.lang, sgs = D.settings;
    var pubs = D.papers.filter(function (p) { return p.st === "published" || p.st === "forthcoming"; })
      .sort(function (a, b) { return (b.year || 0) - (a.year || 0); });
    var pubRows = pubs.map(function (p) {
      return '<div style="display:grid; grid-template-columns:64px 1fr; gap:18px; padding:14px 0; border-top:1px solid rgba(30,31,26,.1);">'
        + '<div style="font-family:' + MONO + '; font-size:13px; color:' + FAINT + ';">' + (p.year || "") + '</div>'
        + '<div><div style="font-family:' + GR + '; font-size:16px; font-weight:600; color:' + INK + '; line-height:1.35;">' + esc(L(p, "t", lang)) + '</div>'
        + '<div style="font-size:13.5px; color:' + MUTE + '; margin-top:3px;">' + (p.co.length ? (lang === "zh" ? "\u5408\u8457\uFF1A" : "with ") + esc(p.co.join(", ")) + ' \u00B7 ' : "") + '<span style="font-style:italic;">' + esc(L(p, "out", lang)) + '</span></div></div></div>';
    }).join("");

    var sections = D.cv.sections.map(function (sec) {
      var items = sec.items.map(function (it) {
        return '<div style="display:grid; grid-template-columns:64px 1fr; gap:18px; padding:13px 0; border-top:1px solid rgba(30,31,26,.1);">'
          + '<div style="font-family:' + MONO + '; font-size:13px; color:' + FAINT + ';">' + esc(it.year || "") + '</div>'
          + '<div><div style="font-family:' + GR + '; font-size:16px; font-weight:600; color:' + INK + '; line-height:1.35;">' + esc(L(it, "p", lang)) + '</div>'
          + (L(it, "s", lang) ? '<div style="font-size:13.5px; color:' + MUTE + '; margin-top:3px;">' + esc(L(it, "s", lang)) + '</div>' : "") + '</div></div>';
      }).join("");
      return '<div style="margin-bottom:34px;"><h2 style="font-family:' + GR + '; font-size:13px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:' + GREEN + '; margin:0 0 4px;">' + esc(L(sec, "t", lang)) + '</h2>' + items + '</div>';
    }).join("");

    return navspacer()
      + '<div style="padding:48px var(--px) 8px; display:grid; grid-template-columns:1fr auto; gap:30px; align-items:end;">'
      + '<div><h1 style="font-family:' + GR + '; font-size:46px; font-weight:600; letter-spacing:-.02em; margin:0 0 10px;">' + (lang === "zh" ? "\u5C65\u6B77" : "Curriculum Vitae") + '</h1>'
      + '<p style="font-size:17px; color:' + MUTE + '; margin:0;">' + esc(L(sgs, "name", lang)) + ' \u00B7 ' + esc(L(sgs, "dept", lang)) + '</p></div>'
      + '<a href="' + sgs.cv_url + '" target="_blank" style="font-family:' + GR + '; font-size:14px; font-weight:600; background:' + GREEN + '; color:#fff; padding:12px 22px; border-radius:24px; white-space:nowrap;">' + (lang === "zh" ? "\u4E0B\u8F09\u5B8C\u6574 PDF" : "Download full PDF") + ' \u2193</a></div>'
      + '<div style="padding:36px var(--px) 50px; display:grid; grid-template-columns:1fr 1.3fr; gap:50px; align-items:start;">'
      + '<div>' + sections + '</div>'
      + '<div><h2 style="font-family:' + GR + '; font-size:13px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:' + GREEN + '; margin:0 0 4px;">' + (lang === "zh" ? "\u767C\u8868\u8207\u5373\u5C07\u767C\u8868" : "Publications & forthcoming") + '</h2>' + pubRows + '</div></div>';
  }

  /* ====================  PERSONAL  ==================== */
  function personalHTML(s) {
    var lang = s.lang;
    var ph = function (label, sw) { return '<div style="border-radius:8px; background-image:repeating-linear-gradient(135deg,' + sw + '1 0 11px,' + sw + '2 11px 22px); border:1px solid rgba(30,31,26,.12); display:flex; align-items:flex-end; padding:14px; min-height:120px;"><span style="font-family:' + GR + '; font-size:13px; color:#3c3d36; background:rgba(243,241,236,.85); padding:5px 11px; border-radius:6px;">' + label + '</span></div>'; };
    var interests = [
      [lang === "zh" ? "\u5BB6\u5EAD\u8207\u65E5\u5E38" : "Family & the everyday", lang === "zh" ? "\u9031\u672B\u5E02\u96C6\u3001\u5169\u500B\u5B69\u5B50\uFF0C\u4EE5\u53CA\u9ED8\u9ED8\u63A8\u52D5\u7814\u7A76\u7684\u7167\u8B77\u65E5\u5E38\u3002" : "Weekend markets, two kids, and the small logistics of care that quietly motivate the research."],
      [lang === "zh" ? "\u5E95\u7247\u651D\u5F71" : "Film photography", lang === "zh" ? "\u4E00\u500B\u6162\u6162\u4F86\u7684\u55DC\u597D\u2014\u2014\u591A\u534A\u662F\u53F0\u5317\u8857\u982D\u3002" : "A slow hobby \u2014 mostly street scenes around Taipei on an old rangefinder."],
      [lang === "zh" ? "\u8DD1\u6B65\u8207\u7F8E\u98DF" : "Running & food", lang === "zh" ? "\u6CB3\u6FF1\u8DD1\u6B65\uFF0C\u7D42\u9EDE\u5E38\u5E38\u662F\u4E00\u7897\u725B\u8089\u9EB5\u3002" : "Riverside runs that conveniently end near a bowl of beef noodle soup."]
    ].map(function (x) {
      return '<div style="background:#fff; border-radius:7px; padding:20px 22px; box-shadow:0 1px 2px rgba(0,0,0,.05);"><div style="font-family:' + GR + '; font-size:17px; font-weight:600; margin-bottom:6px;">' + x[0] + '</div><p style="font-size:14.5px; line-height:1.55; color:' + MUTE + '; margin:0;">' + x[1] + '</p></div>';
    }).join("");
    return navspacer()
      + '<div style="padding:48px var(--px) 26px; display:grid; grid-template-columns:1fr 360px; gap:48px; align-items:center;">'
      + '<div><div style="font-family:' + GR + '; font-size:12px; letter-spacing:.1em; text-transform:uppercase; color:' + GREEN + '; margin-bottom:16px;">' + (lang === "zh" ? "\u7814\u7A76\u4E4B\u5916" : "Beyond research") + '</div>'
      + '<h1 style="font-family:' + GR + '; font-size:44px; font-weight:600; letter-spacing:-.02em; line-height:1.05; margin:0 0 18px;">' + (lang === "zh" ? "\u4E0B\u73ED\u4E4B\u5F8C" : "Off the clock") + '</h1>'
      + '<p style="font-size:18px; line-height:1.65; color:#3c3d36; margin:0; max-width:520px;">' + (lang === "zh" ? "\u6211\u7684\u7814\u7A76\u591A\u534A\u95DC\u4E4E\u5BB6\u5EAD\uFF0C\u96E3\u602A\u8FA6\u516C\u5BA4\u4E4B\u5916\u7684\u751F\u6D3B\u4E5F\u662F\u2014\u2014\u8207\u5B69\u5B50\u5728\u5927\u5B89\u6563\u6B65\u3001\u4E00\u53F0\u7E3D\u8AAA\u8981\u591A\u7528\u7684\u76F8\u6A5F\uFF0C\u4EE5\u53CA\u5C0B\u627E\u53F0\u5317\u6700\u68D2\u725B\u8089\u9EB5\u7684\u4EFB\u52D9\u3002" : "Most of my work is about families, so it's fitting that much of life outside the office is too \u2014 long walks with my kids, a camera I keep meaning to use more, and an ongoing search for the best beef noodle soup in Taipei.") + ' <span style="color:' + FAINT + '; font-style:italic;">(' + (lang === "zh" ? "\u793A\u4F8B\u6587\u5B57\u8207\u7167\u7247" : "Placeholder copy & photos") + ')</span></p></div>'
      + (D.settings.photo
          ? '<div style="aspect-ratio:4/5; border-radius:8px; overflow:hidden; border:1px solid rgba(30,31,26,.14);"><img src="' + esc(D.settings.photo) + '" alt="" style="width:100%; height:100%; object-fit:cover; display:block;"></div></div>'
          : '<div style="aspect-ratio:4/5; border-radius:8px; background-image:repeating-linear-gradient(135deg,#e6e3da 0 11px,#eeeae1 11px 22px); border:1px solid rgba(30,31,26,.14); display:flex; align-items:flex-end; justify-content:center; padding:14px;"><span style="font-family:' + MONO + '; font-size:11px; color:' + FAINT + ';">portrait photo</span></div></div>')
      + '<div style="padding:8px var(--px) 10px;"><div style="display:grid; grid-template-columns:2fr 1fr 1fr; gap:14px;">'
      + ph(lang === "zh" ? "\u7530\u91CE\u8ABF\u67E5\uFF0C\u82B1\u84EE 2023" : "Fieldwork in Hualien, 2023", "#e6e3da") + ph("photo", "#e9f0ea") + ph(lang === "zh" ? "\u7814\u8A0E\u6703\uFF0C\u6771\u4EAC" : "Conference, Tokyo", "#f3e7d6") + '</div></div>'
      + '<div style="padding:34px var(--px) 50px;"><div style="display:flex; align-items:baseline; gap:14px; margin-bottom:18px;"><h2 style="font-family:' + GR + '; font-size:13px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:' + GREEN + '; margin:0;">' + (lang === "zh" ? "\u6211\u5728\u4E4E\u7684\u5E7E\u4EF6\u4E8B" : "A few things I care about") + '</h2><span style="flex:1; height:1px; background:rgba(30,31,26,.12);"></span></div>'
      + '<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px;">' + interests + '</div></div>';
  }

  function navspacer() { return ""; }

  /* ====================  PAGE ROUTER  ==================== */
  function pageHTML(s) {
    switch (s.route) {
      case "research": return researchHTML(s);
      case "featured": return featuredHTML(s);
      case "browse":   return browseHTML(s);
      case "students": return studentsHTML(s);
      case "teaching": return teachingHTML(s);
      case "cv":       return cvHTML(s);
      case "personal": return personalHTML(s);
      default:          return homeHTML(s.lang);
    }
  }

  /* ----------------------------------------------------------
     5 · CSV PARSER + GOOGLE SHEET LOADER
     ---------------------------------------------------------- */
  function parseCSV(text) {
    var rows = [], row = [], cur = "", q = false, i = 0, c;
    for (; i < text.length; i++) {
      c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; }
        else cur += c;
      } else {
        if (c === '"') q = true;
        else if (c === ",") { row.push(cur); cur = ""; }
        else if (c === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
        else if (c === "\r") { /* skip */ }
        else cur += c;
      }
    }
    if (cur.length || row.length) { row.push(cur); rows.push(row); }
    if (!rows.length) return [];
    var head = rows[0].map(function (h) { return h.trim(); });
    return rows.slice(1).filter(function (r) { return r.some(function (v) { return v.trim() !== ""; }); }).map(function (r) {
      var o = {}; head.forEach(function (h, j) { o[h] = (r[j] || "").trim(); }); return o;
    });
  }
  function splitList(v) { return (v || "").split(/[;\u3001]/).map(function (x) { return x.trim(); }).filter(Boolean); }
  function parsePos(v) { var o = {}; splitList(v).forEach(function (pair) { var sp = pair.split(":"); if (sp.length === 2) o[sp[0].trim()] = sp[1].trim(); }); return o; }

  function normalize(tabs) {
    var out = JSON.parse(JSON.stringify(DATA)); // start from baked, override what's present
    try {
      if (tabs.Settings && tabs.Settings.length) {
        var st = {}; tabs.Settings.forEach(function (r) { if (r.key) st[r.key] = r.value || ""; });
        Object.keys(st).forEach(function (k) { out.settings[k] = st[k]; });
      }
      if (tabs.Papers && tabs.Papers.length) {
        out.papers = tabs.Papers.map(function (r) {
          return {
            id: r.id, st: r.status || "progress", year: parseInt(r.year, 10) || "",
            t_en: r.title_en, t_zh: r.title_zh, out_en: r.outlet_en, out_zh: r.outlet_zh,
            ins: splitList(r.institutions), top: splitList(r.topics), pos: parsePos(r.positions),
            co: splitList(r.coauthors), stu: splitList(r.students),
            ssrn: r.ssrn || "", nber: r.nber || "", doi: r.doi || "",
            media: splitList(r.media).map(function (m) { var sp = m.split("|"); return [sp[0], sp[1] || ""]; }),
            s_en: r.summary_en, s_zh: r.summary_zh
          };
        });
      }
      if (tabs.Featured && tabs.Featured.length) {
        out.featured = tabs.Featured.map(function (r) {
          return { pid: r.paper_id, num: r.number, color: r.color || GREEN, img: r.image || "", fig_en: r.fig_en, fig_zh: r.fig_zh,
            unit_en: r.unit_en, unit_zh: r.unit_zh, topic_en: r.topic_en, topic_zh: r.topic_zh };
        });
      }
      if (tabs.Students && tabs.Students.length) {
        out.students = tabs.Students.map(function (r) {
          return { id: r.id, name_en: r.name_en, name_zh: r.name_zh, year: parseInt(r.year, 10) || "",
            role: r.role || "", place_en: r.place_en, place_zh: r.place_zh,
            traj_en: splitList(r.trajectory_en), traj_zh: splitList(r.trajectory_zh),
            site: String(r.site).toLowerCase() === "true" || r.site === "1" };
        });
      }
      if (tabs.Teaching && tabs.Teaching.length) {
        out.teaching = tabs.Teaching.map(function (r) {
          return { code: r.code, term: r.term, level: r.level, t_en: r.title_en, t_zh: r.title_zh,
            role_en: r.role_en, role_zh: r.role_zh, n_en: r.note_en, n_zh: r.note_zh, syllabus: r.syllabus || "" };
        });
      }
      if (tabs.CV && tabs.CV.length) {
        var bySec = {};
        var order = [];
        tabs.CV.forEach(function (r) {
          var key = (r.section_en || "") + "||" + (r.section_zh || "");
          if (!bySec[key]) { bySec[key] = { t_en: r.section_en, t_zh: r.section_zh, items: [] }; order.push(key); }
          bySec[key].items.push({ year: r.year || "", p_en: r.primary_en, p_zh: r.primary_zh, s_en: r.secondary_en, s_zh: r.secondary_zh });
        });
        out.cv = { sections: order.map(function (k) { return bySec[k]; }) };
      }
    } catch (e) { console.warn("[KMC] normalize error, falling back", e); return DATA; }
    return out;
  }

  function gvizJSONToRows(txt) {
    var m = txt.match(/setResponse\(([\s\S]*)\)\s*;?\s*$/);
    if (!m) return [];
    var j;
    try { j = JSON.parse(m[1]); } catch (e) { return []; }
    if (!j.table || !j.table.cols) return [];
    var cols = j.table.cols.map(function (c) { return (c.label || "").trim(); });
    if (!cols.some(function (c) { return c; })) return [];   // no header labels -> treat as empty
    return (j.table.rows || []).map(function (row) {
      var o = {}, cells = row.c || [];
      cols.forEach(function (h, i) {
        if (!h) return;
        var cell = cells[i];
        var v = (cell && cell.v != null) ? cell.v : "";
        o[h] = (typeof v === "string") ? v.trim() : String(v);
      });
      return o;
    }).filter(function (o) { return Object.keys(o).some(function (k) { return o[k] !== ""; }); });
  }

  function fetchTab(t) {
    var base = "https://docs.google.com/spreadsheets/d/" + SHEET_ID + "/gviz/tq?";
    var jsonURL = base + "headers=1&sheet=" + encodeURIComponent(t);
    var csvURL = base + "tqx=out:csv&sheet=" + encodeURIComponent(t);
    // Primary: gviz JSON (reliable cross-origin). Fallback: CSV.
    return fetch(jsonURL).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
      .then(function (txt) {
        var rows = gvizJSONToRows(txt);
        if (rows.length) return rows;
        return fetch(csvURL).then(function (r) { return r.text(); }).then(function (c) { return parseCSV(c); });
      })
      .catch(function () { return fetch(csvURL).then(function (r) { return r.text(); }).then(function (c) { return parseCSV(c); }).catch(function () { return []; }); });
  }

  function load() {
    if (!SHEET_ID) return Promise.resolve(DATA);
    var tabs = ["Settings", "Papers", "Featured", "Students", "Teaching", "CV"];
    var results = {};
    return Promise.all(tabs.map(function (t) {
      return fetchTab(t).then(function (rows) { results[t] = rows; })
        .catch(function (e) { console.warn("[KMC] tab " + t + " failed", e); results[t] = []; });
    })).then(function () {
      var any = tabs.some(function (t) { return results[t] && results[t].length; });
      if (!any) { console.warn("[KMC] sheet reachable but empty \u2014 showing built-in content. Populate the Google Sheet to go live."); return DATA; }
      return normalize(results);
    }).catch(function (e) { console.warn("[KMC] sheet load failed, using built-in data", e); return DATA; });
  }

  /* ----------------------------------------------------------
     6 · EXPORT
     ---------------------------------------------------------- */
  window.KMC = {
    SHEET_ID: SHEET_ID,
    DATA: DATA,
    INSTS: INSTS,
    load: load,
    setData: setData,
    settings: function () { return D.settings; },
    navHTML: navHTML,
    footerHTML: footerHTML,
    pageHTML: pageHTML,
    // interactive sub-renderers (so the logic class can re-inject just a region)
    researchBodyHTML: researchBodyHTML,
    studentsBodyHTML: studentsBodyHTML,
    browseListHTML: browseListHTML,
    browseChipsHTML: browseChipsHTML,
    browseCount: browseCount,
    featuredSpotlightHTML: featuredSpotlightHTML,
    featuredDotsHTML: featuredDotsHTML,
    featuredCount: featuredCount,
    firstStage: firstStage
  };
})();
