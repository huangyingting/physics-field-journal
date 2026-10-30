import Link from 'next/link';

export default function NotFound() {
  return <div className="page not-found"><div className="eyebrow">FIELD NOTE / 404</div><h1>这条路径还没有被记录。<br />An uncharted path.</h1><p>回到学习概览，重新找到你的方向。 / Return to the journal to find your way.</p><Link className="button primary" href="/zh">返回概览 / Back to overview →</Link></div>;
}
