import Home from '../../components/home.js';

export default async function Page({ params }) {
  const { lang } = await params;
  return <Home lang={lang} />;
}
