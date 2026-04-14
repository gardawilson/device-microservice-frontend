import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import NotFoundPage from "./pages/NotFoundPage";
import PrinterDetailPage from "./pages/PrinterDetailPage";
import PrinterListPage from "./pages/PrinterListPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/printers" replace />} />
        <Route path="/printers" element={<PrinterListPage />} />
        <Route path="/printers/:printerId" element={<PrinterDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
