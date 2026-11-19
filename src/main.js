import { initTextPressure } from './text-pressure.js';
import { initCircularGallery } from './circular-gallery.js';
import { projects } from './projects.js';

document.querySelector('#app').innerHTML = `
  <header class="nav">
    <a class="wordmark" href="#top">BML<span> /</span></a>
    <nav aria-label="主导航"><a href="#work">作品</a><a href="#about">关于</a><a href="#contact">联系</a></nav>
    <a class="nav-cta" href="#contact">联系我 <span>↗</span></a>
    <button class="menu" aria-label="打开导航">☰</button>
  </header>
  <main id="top">
    <section class="hero">
      <video class="hero-video" autoplay muted playsinline loop preload="metadata" aria-hidden="true"><source src="/videos/hero-background.mp4" type="video/mp4"></video><div class="hero-video-shade"></div><div class="hero-grid"></div><div class="hero-watermark-wrap"><h1 class="hero-watermark" data-text-pressure="PORTFOLIO" aria-label="Portfolio"></h1></div><canvas id="particles" aria-hidden="true"></canvas>
      <div class="hero-meta"><span>INDUSTRIAL DESIGNER</span><span>BASED IN CHINA · 2025</span></div>
      <div class="hero-copy"><p class="eyebrow"><i></i> INDUSTRIAL DESIGNER · 2025</p><p class="hero-intro">我是薄明路</p><div class="hero-actions"><a class="button primary" href="#work">探索作品 <span>↓</span></a><a class="text-link" href="#about">认识我 <span>↗</span></a></div></div>
      <div class="hero-orbit"><span>HUMAN<br>× OBJECT<br>× FUTURE</span><b>◎</b></div>
      <div class="hero-bottom"><span>SELECTED WORKS — 2024 / 25</span><a href="#about">向下探索 <span>↓</span></a><span>01 — 04</span></div>
    </section>

    <section class="work section story-screen" id="work" data-screen="work" aria-label="精选作品">
      <div class="section-head"><div><p class="eyebrow"><i></i> SELECTED PROJECTS / 2024—2025</p><h2>精选作品<span class="dim">，为真实而设计。</span></h2></div><p class="section-note">从健康照护到可持续生活，<br>探索设计如何创造积极改变。</p></div>
      <div class="gallery-stage" id="works-gallery" role="region" aria-label="精选作品画廊" aria-roledescription="carousel" tabindex="0"><div class="gallery-track">${projects.map((p,i)=>`<article class="gallery-card" data-gallery-index="${i}"><button class="gallery-card-button" type="button" aria-label="打开作品：${p.title}，第 ${i+1} 个"><img src="/images/project-${p.image}.jpg" alt="${p.title}设计作品"><span class="gallery-card-shade"></span><span class="gallery-card-copy"><span class="project-type">${p.type} · ${p.year}</span><strong>${p.title}</strong><span>${p.desc}</span><i>查看完整项目 ↗</i></span></button></article>`).join('')}</div></div>
      <div class="gallery-controls"><button class="gallery-arrow" type="button" data-gallery-prev aria-label="上一个作品">←</button><span class="gallery-counter" aria-live="polite">01 <i>/</i> 04</span><button class="gallery-arrow" type="button" data-gallery-next aria-label="下一个作品">→</button></div>
      <p class="gallery-hint">拖动或滚动浏览 · 点击作品进入独立项目页</p>
    </section>

    <section class="about section story-screen" id="about" data-screen="about" aria-label="个人介绍">
      <div class="about-content">
        <div class="about-top"><p class="eyebrow"><i></i> A LITTLE ABOUT ME</p><span class="about-number">02 / PROFILE</span></div>
        <h2>Hi, 我是<br><span>薄明路。</span></h2>
        <p class="about-lead">燕山大学 · 工业设计</p>
        <p class="about-body">关注产品体验、健康照护与智能生活。我习惯从用户研究和场景观察出发，通过概念探索与原型验证打磨细节，让设计兼顾温度与落地。</p>
        <div class="stats"><div><b>4.009</b><span>GPA</span></div><div><b>1 / 44</b><span>专业排名</span></div><div><b>4</b><span>精选项目</span></div></div>
        <div class="experience"><div class="exp-title"><span>实践经历</span><span>EXPERIENCE</span></div><div class="exp-row"><time>2025.07 — 08</time><div><b>邯郸市睿图地理信息技术服务有限公司</b><p>实习生 · 工程资料整理、CAD 图纸打印与信息核对</p></div></div></div>
      </div>
      <span class="scene-index">02 <i>—</i> 03</span>
    </section>

    <section class="contact story-screen" id="contact" data-screen="contact" aria-label="联系方式">
      <div class="contact-inner">
        <p class="eyebrow"><i></i> LET'S MAKE SOMETHING MEANINGFUL</p>
        <span class="about-number">03 / CONTACT</span>
        <h2>让下一件好作品，<br><em>从一次对话开始。</em></h2>
        <p>期待和关注产品体验、健康生活与创新设计的你，一起把想法变成真实体验。</p>
        <a class="button primary" href="mailto:3406346305@qq.com">3406346305@qq.com <span>↗</span></a>
        <div class="contact-details"><a href="tel:19831027825"><span>TEL</span>19831027825</a><span><i>VX</i>19831027825</span></div>
      </div>
      <div class="contact-bottom"><span>BAO MINGLU · INDUSTRIAL DESIGNER</span><a href="#top">回到顶部 ↑</a><span>燕山大学 · 中国</span></div>
    </section>
  </main>

  <div class="pose-stage" aria-hidden="true" inert>
    <video class="pose-video" src="/videos/pose-scroll.webm?v=2" muted playsinline preload="auto"></video>
  </div>

  <section class="gallery-modal" data-gallery-modal hidden role="dialog" aria-modal="true" aria-label="作品详情">
    <header class="case-header"><a class="wordmark" href="#work" data-case-home>BML<span> /</span></a><span>SELECTED CASE STUDY <i>·</i> <b data-case-position>01 / 04</b></span><button class="gallery-modal-close" type="button" data-gallery-close aria-label="关闭作品详情">×</button></header>
    <div class="case-layout"><nav class="case-index" aria-label="切换作品">${projects.map((p,i)=>`<button type="button" data-case-index="${i}"><span>0${i+1}</span>${p.title}</button>`).join('')}</nav><article class="case-content"><div class="case-pages" data-case-pages aria-label="作品集详情页面"></div><footer class="case-footer"><span>BAO MINGLU · INDUSTRIAL DESIGN</span><div><button type="button" data-case-prev>← 上一个作品</button><button type="button" data-case-next>下一个作品 →</button></div></footer></article></div>
  </section>`;

const canvas = document.querySelector('#particles');
const ctx = canvas.getContext('2d');
let dots = [];
let heroPointer = { x: 0, y: 0 };
function resizeHeroParticles() {
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  const count = innerWidth < 700 ? 90 : 230;
  dots = Array.from({ length: count }, () => ({ angle: Math.random() * Math.PI * 2, radius: 30 + Math.random() * 130, size: .7 + Math.random() * 1.3, speed: (Math.random() - .5) * .002 }));
  heroPointer = { x: innerWidth * .74, y: innerHeight * .51 };
}
function drawHeroParticles() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  dots.forEach(dot => {
    dot.angle += dot.speed;
    const x = heroPointer.x + Math.cos(dot.angle) * dot.radius;
    const y = heroPointer.y + Math.sin(dot.angle) * dot.radius;
    ctx.beginPath();
    ctx.fillStyle = `rgba(193,220,207,${.2 + Math.random() * .35})`;
    ctx.arc(x, y, dot.size, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawHeroParticles);
}
resizeHeroParticles();
drawHeroParticles();
addEventListener('resize', resizeHeroParticles, { passive: true });
document.querySelector('.hero').addEventListener('pointermove', event => {
  const rect = event.currentTarget.getBoundingClientRect();
  heroPointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
});

document.querySelector('.menu').addEventListener('click', () => document.querySelector('.nav nav').classList.toggle('open'));
document.querySelectorAll('.nav nav a').forEach(link => link.addEventListener('click', () => document.querySelector('.nav nav').classList.remove('open')));
const nav = document.querySelector('.nav');
const hero = document.querySelector('.hero');
function updateNavState() { nav.classList.toggle('is-scrolled', scrollY > Math.max(0, hero.offsetHeight - nav.offsetHeight)); }
addEventListener('scroll', updateNavState, { passive: true });
addEventListener('resize', updateNavState, { passive: true });
updateNavState();

const scenes = [...document.querySelectorAll('[data-screen]')];
const poseStage = document.querySelector('.pose-stage');
const poseVideo = document.querySelector('.pose-video');
let scrollFrame = 0;
function updatePoseStage() {
  scrollFrame = 0;
  const position = scrollY + 1;
  const workTop = scenes[0]?.offsetTop || hero.offsetHeight;
  const lastSceneEnd = scenes[2]?.offsetTop + scenes[2]?.offsetHeight || 0;
  const visible = scrollY + innerHeight > workTop && position < lastSceneEnd;
  const clipTop = Math.max(0, Math.min(innerHeight, workTop - scrollY));
  poseStage.style.setProperty('--pose-clip-top', `${clipTop}px`);
  poseStage.style.setProperty('--pose-reveal', visible ? '1' : '0');
  poseStage.classList.toggle('is-visible', visible);
  if (!visible || poseVideo.readyState < HTMLMediaElement.HAVE_METADATA || scenes.length < 3) return;

  const fps = 24;
  const frameCount = Math.max(1, Math.floor(poseVideo.duration * fps));
  const aboutTop = scenes[1].offsetTop;
  const contactTop = scenes[2].offsetTop;
  const aboutPoseFrame = Math.min(51, frameCount - 1);
  let frame;
  if (scrollY <= aboutTop) {
    const progress = Math.max(0, Math.min(1, (scrollY - workTop) / Math.max(1, aboutTop - workTop)));
    frame = Math.round(progress * aboutPoseFrame);
  } else {
    const progress = Math.max(0, Math.min(1, (scrollY - aboutTop) / Math.max(1, contactTop - aboutTop)));
    frame = aboutPoseFrame + Math.round(progress * (frameCount - 1 - aboutPoseFrame));
  }
  const frameTime = frame / fps;
  if (Math.abs(poseVideo.currentTime - frameTime) > 0.004) poseVideo.currentTime = frameTime;
}
function requestPoseFrame() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updatePoseStage); }
addEventListener('scroll', requestPoseFrame, { passive: true });
addEventListener('resize', requestPoseFrame, { passive: true });
poseVideo.addEventListener('loadedmetadata', requestPoseFrame);
requestPoseFrame();

initTextPressure();
initCircularGallery();
