import { useEffect, useRef } from 'react';
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
} from '../landingContent';
import MlnChatBot from './MlnChatBot';

interface Props {
  onExplore: () => void;
  onPlayGame: () => void;
}

function SplitTitle({ line1, line2 }: { line1: string; line2: string }) {
  return (
    <h2 className='scroll-title'>
      <span>{line1}</span>
      <span>{line2}</span>
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

export function StoryLanding({ onExplore, onPlayGame }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

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
      <header className='scroll-topbar'>
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
      <section
        className='scroll-chapter'
        id='costs'
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
        <p
          className='scroll-foot'
          data-reveal
        >
          {SCROLL_COSTS.foot}
        </p>
      </section>

      {/* 02 REVENUE */}
      <section
        className='scroll-chapter'
        id='revenue'
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
      </section>

      {/* 03 PROFIT */}
      <section
        className='scroll-chapter'
        id='profit'
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
          className='scroll-lesson-grid'
          style={{ marginTop: '2rem' }}
        >
          {SCROLL_PROFIT.points.map((p, i) => (
            <article
              key={p.title}
              className='scroll-lesson'
              data-reveal
            >
              <span>0{i + 1}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
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
      </section>

      {/* 04 ACHIEVEMENTS */}
      <section
        className='scroll-chapter'
        id='achieve'
      >
        <ChapterHead
          chapter={SCROLL_ACHIEVE.chapter}
          line1={SCROLL_ACHIEVE.titleLine1}
          line2={SCROLL_ACHIEVE.titleLine2}
          lead={SCROLL_ACHIEVE.lead}
        />
        <div className='scroll-lesson-grid'>
          {SCROLL_ACHIEVE.items.map((item) => (
            <article
              key={item.index}
              className='scroll-lesson'
              data-reveal
            >
              <span>{item.index}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 05 BEFORE / AFTER */}
      <section
        className='scroll-chapter'
        id='before-after'
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
      </section>

      {/* 06 RISKS */}
      <section
        className='scroll-chapter'
        id='risks'
      >
        <ChapterHead
          chapter={SCROLL_RISKS.chapter}
          line1={SCROLL_RISKS.titleLine1}
          line2={SCROLL_RISKS.titleLine2}
          lead={SCROLL_RISKS.lead}
        />
        <div className='scroll-lesson-grid'>
          {SCROLL_RISKS.items.map((item) => (
            <article
              key={item.index}
              className='scroll-lesson'
              data-reveal
            >
              <span>{item.index}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 07 HARMS */}
      <section
        className='scroll-chapter'
        id='harms'
      >
        <ChapterHead
          chapter={SCROLL_HARMS.chapter}
          line1={SCROLL_HARMS.titleLine1}
          line2={SCROLL_HARMS.titleLine2}
          lead={SCROLL_HARMS.lead}
        />
        <div className='scroll-lesson-grid'>
          {SCROLL_HARMS.items.map((item) => (
            <article
              key={item.index}
              className='scroll-lesson harm'
              data-reveal
            >
              <span>{item.index}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* LESSONS */}
      <section className='scroll-chapter scroll-lessons'>
        <div
          className='scroll-chapter-head'
          data-reveal
        >
          <p className='scroll-chapter-label'>{SCROLL_LESSONS.chapter}</p>
          <h2 className='scroll-title single'>{SCROLL_LESSONS.title}</h2>
        </div>
        <div className='scroll-lesson-grid'>
          {SCROLL_LESSONS.items.map((item) => (
            <article
              key={item.index}
              className='scroll-lesson'
              data-reveal
            >
              <span>{item.index}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CLOSE */}
      <section className='scroll-close'>
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
              className='btn-ghost'
              onClick={onPlayGame}
            >
              Chơi cờ tỷ phú
            </button>
          </div>
        </div>
      </section>

      <MlnChatBot />
    </div>
  );
}
