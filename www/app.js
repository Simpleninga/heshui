// 喝水打卡：数据只存在本机（localStorage），不需要服务器
const GOAL = 8;
const KEY = 'heshui-records'; // { "2026-11-14": 3, ... }

const $ = (id) => document.getElementById(id);
const WEEK = ['日', '一', '二', '三', '四', '五', '六'];

function dayKey(d) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
}

function save(records) { localStorage.setItem(KEY, JSON.stringify(records)); }

function tipFor(n) {
  if (n === 0) return '今天还没喝水';
  if (n < GOAL / 2) return '继续加油';
  if (n < GOAL) return `还差 ${GOAL - n} 杯`;
  return '今天达标了 🎉';
}

function render() {
  const records = load();
  const now = new Date();
  const today = dayKey(now);
  const n = records[today] || 0;

  $('date').textContent = `${now.getMonth() + 1}月${now.getDate()}日 星期${WEEK[now.getDay()]}`;
  $('count').textContent = n;
  $('goal').textContent = GOAL;
  $('tip').textContent = tipFor(n);

  const full = 540.35; // 2 * π * 86
  $('ring').style.strokeDashoffset = full * (1 - Math.min(n / GOAL, 1));

  const bars = $('bars');
  bars.innerHTML = '';
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const v = records[dayKey(d)] || 0;
    const el = document.createElement('div');
    el.className = 'bar' + (v >= GOAL ? ' done' : '');
    el.innerHTML = `<b>${v || ''}</b><i style="height:${Math.min(v / GOAL, 1) * 100}%"></i><span>${i === 0 ? '今天' : WEEK[d.getDay()]}</span>`;
    bars.appendChild(el);
  }
}

function change(delta) {
  const records = load();
  const today = dayKey(new Date());
  records[today] = Math.max(0, (records[today] || 0) + delta);
  save(records);
  render();
}

function platformName() {
  const ua = navigator.userAgent;
  if (window.heshuiDesktop) return window.heshuiDesktop.platform === 'darwin' ? 'Mac' : 'Windows';
  if (/iPad|Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return 'iPad';
  if (/iPhone/.test(ua)) return 'iPhone';
  if (/Android/.test(ua)) return '安卓';
  return '浏览器';
}

$('add').addEventListener('click', () => change(1));
$('minus').addEventListener('click', () => change(-1));
$('ver').textContent = window.APP_VERSION || '开发版';
$('platform').textContent = platformName();

render();
// 过了午夜自动换到新的一天
setInterval(render, 60 * 1000);
