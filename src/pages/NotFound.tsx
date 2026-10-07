import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { useSeo } from '../hooks/useSeo';
export default function NotFound() {
  useSeo('Page not found');
  return (
    <PageTransition>
      <section className="wrap py-28 text-center">
        <p className="font-display text-8xl font-semibold text-navy-q">404</p>
        <h1 className="mt-4 text-3xl font-semibold">This state could not be found</h1>
        <p className="mx-auto mt-3 max-w-md text-mute">The page you are looking for does not exist or has moved.</p>
        <Link to="/" className="btn btn-primary mt-8">Back to home</Link>
      </section>
    </PageTransition>
  );
}
