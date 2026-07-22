import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  SCROLL_ACHIEVE,
  SCROLL_BEFORE_AFTER,
  SCROLL_CLOSE,
  SCROLL_COSTS,
  SCROLL_HARMS,
  SCROLL_HERO,
  SCROLL_LESSONS,
  SCROLL_META,
  SCROLL_PROFIT,
  SCROLL_REVENUE,
  SCROLL_RISKS,
  SCROLL_TEAM,
  SCROLL_VISUALS,
  type ScrollTakeaway,
} from '../landingContent';
import { MLN_CONNECTIONS } from '../realWorldData';
import MlnChatBot from './MlnChatBot';
import {
  ChatGptIcon,
  ClaudeIcon,
  DeepSeekIcon,
  GeminiIcon,
} from './FooterAiIcons';

interface Props {
  onExplore: () => void;
  onPlayGame: () => void;
}

function SplitTitle({ line1, line2 }: { line1: string; line2: string }) {
  return (
    <h2 className='scroll-title'>
      <span>{line1}</span>
      {line2 ? <span>{line2}</span> : null}
    </h2>
  );
}

function ChapterHead({
  chapter,
  line1,
  line2,
  lead,
}: {
  chapter: string;
  line1: string;
  line2: string;
  lead: string;
}) {
  return (
    <div
      className='scroll-chapter-head'
      data-reveal
    >
      <p className='scroll-chapter-label'>{chapter}</p>
      <SplitTitle
        line1={line1}
        line2={line2}
      />
      <p className='scroll-lead'>{lead}</p>
    </div>
  );
}

function ChapterTakeaway({ takeaway }: { takeaway: ScrollTakeaway }) {
  return (
    <aside
      className='scroll-takeaway'
      data-reveal
    >
      <p className='scroll-takeaway-tag'>Điều rút ra</p>
      <h3 className='scroll-takeaway-concept'>{takeaway.concept}</h3>
      <p className='scroll-takeaway-body'>{takeaway.body}</p>
    </aside>
  );
}

function LessonCard({
  index,
  title,
  body,
  className = '',
}: {
  index: string;
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <article
      className={`scroll-lesson ${className}`.trim()}
      data-reveal
    >
      <span>{index}</span>
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}

function ChapterShell({
  id,
  bg,
  children,
  className = '',
}: {
  id: string;
  bg?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`scroll-chapter${bg ? ' has-photo' : ''} ${className}`.trim()}
      id={id}
    >
      {bg ? (
        <div
          className='scroll-chapter-bg'
          aria-hidden
        >
          <img
            src={bg}
            alt=''
            className='scroll-chapter-bg-img'
            loading='lazy'
            decoding='async'
          />
          <div className='scroll-chapter-bg-veil' />
        </div>
      ) : null}
      <div className='scroll-chapter-body'>{children}</div>
    </section>
  );
}

const BG = SCROLL_VISUALS.chapterBg;

export function StoryLanding({ onExplore, onPlayGame }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  // Lăn quá đầu trang thì ẩn dòng tên môn ở giữa topbar để không đè lên chữ các chương.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!rootRef.current) return;
    const nodes =
      rootRef.current.querySelectorAll<HTMLElement>('[data-reveal]');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add('is-in');
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <div
      className='scroll-book is-unlocked'
      ref={rootRef}
    >
      <header className={`scroll-topbar${scrolled ? ' is-scrolled' : ''}`}>
        <p className='scroll-topbar-brand'>
          {SCROLL_META.brand}
          <span>{SCROLL_META.brandYear}</span>
        </p>
        <p className='scroll-topbar-course'>{SCROLL_META.course}</p>
        <div className='scroll-topbar-actions'>
          <button
            type='button'
            className='scroll-topbar-ghost'
            onClick={onPlayGame}
          >
            Chơi cờ tỷ phú
          </button>
          <button
            type='button'
            className='scroll-topbar-cta'
            onClick={onExplore}
          >
            Vào mô phỏng
          </button>
        </div>
      </header>

      {/* HERO */}
      <section
        className='scroll-hero'
        aria-label='Mở đầu'
      >
        <div
          className='scroll-hero-bg'
          aria-hidden
        >
          <video
            className='scroll-hero-video'
            src='/hero.mp4'
            autoPlay
            muted
            loop
            playsInline
            preload='auto'
          />
          <div className='scroll-hero-veil' />
          <div className='scroll-hero-grain' />
        </div>
        <div
          className='scroll-hero-inner is-in'
          data-reveal
        >
          <p className='scroll-kicker'>{SCROLL_HERO.kicker}</p>
          <h1 className='scroll-hero-title'>
            <span>{SCROLL_HERO.titleLine1}</span>
            <span>{SCROLL_HERO.titleLine2}</span>
          </h1>
          <blockquote className='scroll-quote'>
            <p>“{SCROLL_HERO.quote}”</p>
            <cite>{SCROLL_HERO.quoteAttr}</cite>
          </blockquote>
          <p className='scroll-hint'>
            {SCROLL_META.scrollHint}
            <span className='scroll-hint-line' />
          </p>
        </div>
      </section>

      {/* 01 COSTS */}
      <ChapterShell
        id='costs'
        bg={BG.costs}
      >
        <ChapterHead
          chapter={SCROLL_COSTS.chapter}
          line1={SCROLL_COSTS.titleLine1}
          line2={SCROLL_COSTS.titleLine2}
          lead={SCROLL_COSTS.lead}
        />
        <div
          className='scroll-cost-table'
          data-reveal
        >
          {SCROLL_COSTS.rows.map((r) => (
            <article
              key={r.year}
              className='scroll-cost-row'
            >
              <span className='y'>{r.year}</span>
              <span className='h'>{r.host}</span>
              <span className='c'>{r.cost}</span>
              <span className='n'>{r.note}</span>
            </article>
          ))}
        </div>
        <h3
          className='scroll-subhead'
          data-reveal
        >
          {SCROLL_COSTS.breakdown.title}
        </h3>
        <div className='scroll-machine-grid'>
          {SCROLL_COSTS.breakdown.items.map((m, i) => (
            <article
              key={m.title}
              className='scroll-machine-card'
              data-reveal
            >
              <span className='scroll-machine-num'>0{i + 1}</span>
              <h3>{m.title}</h3>
              <p>{m.body}</p>
            </article>
          ))}
        </div>
        <ChapterTakeaway takeaway={SCROLL_COSTS.takeaway} />
        <p
          className='scroll-foot'
          data-reveal
        >
          {SCROLL_COSTS.foot}
        </p>
      </ChapterShell>

      {/* 02 REVENUE */}
      <ChapterShell
        id='revenue'
        bg={BG.revenue}
      >
        <ChapterHead
          chapter={SCROLL_REVENUE.chapter}
          line1={SCROLL_REVENUE.titleLine1}
          line2={SCROLL_REVENUE.titleLine2}
          lead={SCROLL_REVENUE.lead}
        />
        <div
          className='scroll-rev-block'
          data-reveal
        >
          <h3 className='scroll-subhead left'>{SCROLL_REVENUE.fifa.title}</h3>
          <div className='scroll-stat-grid'>
            {SCROLL_REVENUE.fifa.items.map((item) => (
              <article
                key={item.label}
                className='scroll-stat'
              >
                <span className='scroll-stat-label'>{item.label}</span>
                <span className='scroll-stat-value'>{item.value}</span>
                <span className='scroll-stat-note'>{item.note}</span>
              </article>
            ))}
          </div>
        </div>
        <div
          className='scroll-rev-block'
          data-reveal
        >
          <h3 className='scroll-subhead left'>{SCROLL_REVENUE.host.title}</h3>
          <div className='scroll-machine-grid'>
            {SCROLL_REVENUE.host.items.map((m, i) => (
              <article
                key={m.title}
                className='scroll-machine-card'
              >
                <span className='scroll-machine-num'>0{i + 1}</span>
                <h3>{m.title}</h3>
                <p>{m.body}</p>
              </article>
            ))}
          </div>
        </div>
        <ChapterTakeaway takeaway={SCROLL_REVENUE.takeaway} />
      </ChapterShell>

      {/* 03 PROFIT */}
      <ChapterShell
        id='profit'
        bg={BG.profit}
      >
        <ChapterHead
          chapter={SCROLL_PROFIT.chapter}
          line1={SCROLL_PROFIT.titleLine1}
          line2={SCROLL_PROFIT.titleLine2}
          lead={SCROLL_PROFIT.lead}
        />
        <div className='scroll-gap-grid'>
          {SCROLL_PROFIT.gaps.map((g) => (
            <article
              key={g.name}
              className='scroll-gap'
              data-reveal
            >
              <h3>{g.name}</h3>
              <div className='scroll-gap-nums'>
                <div>
                  <span className='lbl'>Kỳ vọng</span>
                  <span className='exp'>{g.expected}</span>
                </div>
                <span
                  className='arrow'
                  aria-hidden
                >
                  →
                </span>
                <div>
                  <span className='lbl'>Thực tế</span>
                  <span className='act'>{g.actual}</span>
                </div>
              </div>
              <p>{g.note}</p>
            </article>
          ))}
        </div>
        <div
          className='scroll-lesson-grid cols-3'
          style={{ marginTop: '2rem' }}
        >
          {SCROLL_PROFIT.points.map((p, i) => (
            <LessonCard
              key={p.title}
              index={`0${i + 1}`}
              title={p.title}
              body={p.body}
            />
          ))}
        </div>
        <div
          className='scroll-dual'
          data-reveal
          style={{ marginTop: '2.5rem' }}
        >
          <article className='scroll-dual-pane fifa'>
            <span className='scroll-dual-year'>
              {SCROLL_PROFIT.dual.left.year}
            </span>
            <h3>{SCROLL_PROFIT.dual.left.label}</h3>
            <ul>
              {SCROLL_PROFIT.dual.left.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </article>
          <article className='scroll-dual-pane host'>
            <span className='scroll-dual-year'>
              {SCROLL_PROFIT.dual.right.year}
            </span>
            <h3>{SCROLL_PROFIT.dual.right.label}</h3>
            <ul>
              {SCROLL_PROFIT.dual.right.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </article>
        </div>
        <ChapterTakeaway takeaway={SCROLL_PROFIT.takeaway} />
      </ChapterShell>

      {/* 04 ACHIEVEMENTS */}
      <ChapterShell
        id='achieve'
        bg={BG.achieve}
      >
        <ChapterHead
          chapter={SCROLL_ACHIEVE.chapter}
          line1={SCROLL_ACHIEVE.titleLine1}
          line2={SCROLL_ACHIEVE.titleLine2}
          lead={SCROLL_ACHIEVE.lead}
        />
        <div className='scroll-lesson-grid'>
          {SCROLL_ACHIEVE.items.map((item) => (
            <LessonCard
              key={item.index}
              index={item.index}
              title={item.title}
              body={item.body}
            />
          ))}
        </div>
        <ChapterTakeaway takeaway={SCROLL_ACHIEVE.takeaway} />
      </ChapterShell>

      {/* 05 BEFORE / AFTER */}
      <ChapterShell
        id='before-after'
        bg={BG['before-after']}
      >
        <ChapterHead
          chapter={SCROLL_BEFORE_AFTER.chapter}
          line1={SCROLL_BEFORE_AFTER.titleLine1}
          line2={SCROLL_BEFORE_AFTER.titleLine2}
          lead={SCROLL_BEFORE_AFTER.lead}
        />
        <div className='scroll-ba-list'>
          {SCROLL_BEFORE_AFTER.cases.map((c) => (
            <article
              key={c.name}
              className='scroll-ba'
              data-reveal
            >
              <h3 className='scroll-ba-name'>{c.name}</h3>
              <div className='scroll-ba-grid'>
                <div className='scroll-ba-col before'>
                  <h4>Trước</h4>
                  <ul>
                    {c.before.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div className='scroll-ba-col after'>
                  <h4>Sau</h4>
                  <ul>
                    {c.after.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
        <ChapterTakeaway takeaway={SCROLL_BEFORE_AFTER.takeaway} />
      </ChapterShell>

      {/* 06 RISKS */}
      <ChapterShell
        id='risks'
        bg={BG.risks}
      >
        <ChapterHead
          chapter={SCROLL_RISKS.chapter}
          line1={SCROLL_RISKS.titleLine1}
          line2={SCROLL_RISKS.titleLine2}
          lead={SCROLL_RISKS.lead}
        />
        <div className='scroll-lesson-grid'>
          {SCROLL_RISKS.items.map((item) => (
            <LessonCard
              key={item.index}
              index={item.index}
              title={item.title}
              body={item.body}
            />
          ))}
        </div>
        <ChapterTakeaway takeaway={SCROLL_RISKS.takeaway} />
      </ChapterShell>

      {/* 07 HARMS */}
      <ChapterShell
        id='harms'
        bg={BG.harms}
      >
        <ChapterHead
          chapter={SCROLL_HARMS.chapter}
          line1={SCROLL_HARMS.titleLine1}
          line2={SCROLL_HARMS.titleLine2}
          lead={SCROLL_HARMS.lead}
        />
        <div className='scroll-lesson-grid'>
          {SCROLL_HARMS.items.map((item) => (
            <LessonCard
              key={item.index}
              index={item.index}
              title={item.title}
              body={item.body}
              className='harm'
            />
          ))}
        </div>
        <ChapterTakeaway takeaway={SCROLL_HARMS.takeaway} />
      </ChapterShell>

      {/* LESSONS */}
      <ChapterShell
        id='lessons'
        bg={BG.lessons}
        className='scroll-lessons'
      >
        <div
          className='scroll-chapter-head'
          data-reveal
        >
          <p className='scroll-chapter-label'>{SCROLL_LESSONS.chapter}</p>
          <h2 className='scroll-title single'>{SCROLL_LESSONS.title}</h2>
          <p className='scroll-lead'>{SCROLL_LESSONS.lead}</p>
        </div>
        <div className='scroll-lesson-grid'>
          {MLN_CONNECTIONS.map((item, i) => (
            <LessonCard
              key={item.concept}
              index={`0${i + 1}`}
              title={item.concept}
              body={item.text}
            />
          ))}
        </div>
      </ChapterShell>

      {/* CLOSE */}
      <section className='scroll-close has-photo'>
        <div
          className='scroll-chapter-bg'
          aria-hidden
        >
          <img
            src={BG.close}
            alt=''
            className='scroll-chapter-bg-img'
            loading='lazy'
            decoding='async'
          />
          <div className='scroll-chapter-bg-veil' />
        </div>
        <blockquote
          className='scroll-close-quote'
          data-reveal
        >
          <p>“{SCROLL_CLOSE.quote}”</p>
        </blockquote>
        <div
          className='scroll-close-cta'
          data-reveal
        >
          <h2 className='scroll-title'>
            <span>{SCROLL_CLOSE.titleLine1}</span>
            <span>{SCROLL_CLOSE.titleLine2}</span>
          </h2>
          <div className='scroll-actions'>
            <button
              type='button'
              className='btn-primary'
              onClick={onExplore}
            >
              {SCROLL_CLOSE.ctaPrimary}
            </button>
            <button
              type='button'
              className='btn-secondary'
              onClick={onPlayGame}
            >
              Chơi cờ tỷ phú
            </button>
          </div>
        </div>
      </section>

      <footer className='scroll-footer'>
        <img
          src='/landing/messi.jpg'
          alt=''
          className='scroll-footer-photo scroll-footer-photo--left'
          loading='lazy'
          decoding='async'
          aria-hidden
        />
        <img
          src='/landing/ronaldo.jpg'
          alt=''
          className='scroll-footer-photo scroll-footer-photo--right'
          loading='lazy'
          decoding='async'
          aria-hidden
        />
        <div
          className='scroll-footer-veil'
          aria-hidden
        />
        <h3 className='scroll-footer-team-title'>{SCROLL_TEAM.group}</h3>
        <div className='scroll-footer-inner'>
          <div
            className='scroll-footer-ai scroll-footer-ai--left'
            aria-hidden
          >
            <GeminiIcon />
            <ClaudeIcon />
          </div>
          <ul className='scroll-footer-members'>
            {SCROLL_TEAM.members.map((m) => (
              <li key={m.id}>
                <span className='scroll-footer-name'>{m.name}</span>
                <span className='scroll-footer-id'>{m.id}</span>
              </li>
            ))}
          </ul>
          <div
            className='scroll-footer-ai scroll-footer-ai--right'
            aria-hidden
          >
            <ChatGptIcon />
            <DeepSeekIcon />
          </div>
        </div>
      </footer>

      <MlnChatBot />
    </div>
  );
}
