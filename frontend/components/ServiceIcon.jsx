// Authored line icons and stage illustrations for the four capabilities.
// Strokes use pathLength="1" so CSS can draw them in on change.

const icons = {
  'digital-products': <><rect x="3" y="4" width="14" height="11" rx="1.5" /><path d="M3 7.5h14" /><rect x="14" y="10" width="7" height="10" rx="1.5" /><path d="M16.5 17.5h2" /></>,
  'business-technology': <><circle cx="12" cy="12" r="2.5" /><circle cx="4.5" cy="5" r="1.8" /><circle cx="19.5" cy="5" r="1.8" /><circle cx="4.5" cy="19" r="1.8" /><circle cx="19.5" cy="19" r="1.8" /><path d="M6 6.4l4.2 3.9M18 6.4l-4.2 3.9M6 17.6l4.2-3.9M18 17.6l-4.2-3.9" /></>,
  'ai-data': <><path d="M4 20V14M9 20V9M14 20v-7M19 20V5" /><path d="M12 2.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" /></>,
  'digital-growth': <><path d="M3 18l6-6 4 4 8-9" /><path d="M15 7h6v6" /><path d="M3 21h18" /></>,
};

export function ServiceIcon({ slug, size = 24, className = '' }) {
  return <svg className={'service-icon-svg ' + className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[slug]}</svg>;
}

const P = ({ d, i = 0 }) => <path className="draw" d={d} pathLength="1" style={{ '--d': i }} />;
const C = ({ cx, cy, r, i = 0 }) => <circle className="draw" cx={cx} cy={cy} r={r} pathLength="1" style={{ '--d': i }} />;
const R = ({ x, y, w, h, rx = 6, i = 0 }) => <rect className="draw" x={x} y={y} width={w} height={h} rx={rx} pathLength="1" style={{ '--d': i }} />;

const art = {
  'digital-products': <>
    <R x={40} y={34} w={190} h={128} i={0} />
    <P d="M40 58h190" i={1} />
    <C cx={54} cy={46} r={3} i={2} /><C cx={66} cy={46} r={3} i={2} />
    <P d="M60 82h70M60 98h96M60 114h52" i={3} />
    <R x={60} y={128} w={46} h={16} rx={8} i={4} />
    <R x={196} y={88} w={76} h={122} rx={12} i={5} />
    <P d="M222 196h24" i={6} />
    <R x={208} y={104} w={52} h={40} rx={4} i={6} />
    <P d="M208 158h40M208 170h28" i={7} />
  </>,
  'business-technology': <>
    <C cx={160} cy={110} r={26} i={0} />
    <P d="M148 110h24M160 98v24" i={1} />
    <C cx={60} cy={44} r={14} i={2} /><C cx={260} cy={44} r={14} i={2} />
    <C cx={60} cy={176} r={14} i={3} /><C cx={260} cy={176} r={14} i={3} />
    <P d="M72 52l66 44M248 52l-66 44M72 168l66-44M248 168l-66-44" i={4} />
    <P d="M74 44h172M74 176h172" i={5} />
    <C cx={160} cy={44} r={4} i={6} /><C cx={160} cy={176} r={4} i={6} />
  </>,
  'ai-data': <>
    <P d="M40 196h240" i={0} />
    <R x={56} y={140} w={30} h={56} rx={3} i={1} />
    <R x={106} y={112} w={30} h={84} rx={3} i={2} />
    <R x={156} y={124} w={30} h={72} rx={3} i={3} />
    <R x={206} y={84} w={30} h={112} rx={3} i={4} />
    <P d="M71 118C100 92 118 100 146 86s50-4 76-40" i={5} />
    <C cx={71} cy={118} r={4} i={6} /><C cx={146} cy={86} r={4} i={6} /><C cx={222} cy={46} r={4} i={6} />
    <P d="M262 24l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" i={7} />
  </>,
  'digital-growth': <>
    <C cx={232} cy={70} r={46} i={0} />
    <C cx={232} cy={70} r={30} i={1} />
    <C cx={232} cy={70} r={14} i={2} />
    <P d="M40 196l58-58 38 30 92-94" i={3} />
    <P d="M200 74h28v28" i={4} />
    <P d="M40 210h240" i={5} />
    <C cx={98} cy={138} r={4} i={6} /><C cx={136} cy={168} r={4} i={6} />
  </>,
};

export function ServiceArt({ slug }) {
  return <svg className="service-art" viewBox="0 0 320 220" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{art[slug]}</svg>;
}
