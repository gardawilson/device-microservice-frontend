import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="panel p-8 text-center">
      <h1 className="text-2xl font-bold text-slate-900">
        404 - Page Not Found
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Halaman yang kamu cari tidak tersedia.
      </p>
      <Link to="/printers" className="btn-primary mt-5">
        Kembali ke Printer List
      </Link>
    </section>
  );
}

export default NotFoundPage;
