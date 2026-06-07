export const manifest = {
  screens: {
    scr_h5n2uz: { name: "Search & Discover", route: "/", position: { "x": 160, "y": 2200 } },
    scr_jzlxup: { name: "Login", route: "/login", position: { "x": 160, "y": 220 } },
    scr_efy3ti: { name: "Watchlist", route: "/watchlist", position: { "x": 160, "y": 4180 } },
    scr_nhl0td: { name: "Fund Detail", route: "/fund/119598", position: { "x": 1560, "y": 2200 } }
  },
  sections: {
    sec_qupfyd: { name: "Authentication", x: 0, y: 0, width: 1520, height: 1180 },
    sec_yz0qoq: { name: "Browse & Details", x: 0, y: 1980, width: 2920, height: 1180 },
    sec_dkuxqq: { name: "Watchlist", x: 0, y: 3960, width: 1520, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_qupfyd", children: [
    { kind: "screen", id: "scr_jzlxup" }]
  },
  { kind: "section", id: "sec_yz0qoq", children: [
    { kind: "screen", id: "scr_h5n2uz" },
    { kind: "screen", id: "scr_nhl0td" }]
  },
  { kind: "section", id: "sec_dkuxqq", children: [
    { kind: "screen", id: "scr_efy3ti" }]
  }]

};