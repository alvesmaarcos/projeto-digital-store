import { Navigate, Route, Routes, Link, useLocation } from "react-router-dom";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductViewPage from "./pages/ProductViewPage";
function ProductsRedirect() {
  const location = useLocation();
  return <Navigate replace to={`/products${location.search}`} />;
}
export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/produtos" element={<ProductsRedirect />} />
        <Route path="/product/:id" element={<ProductViewPage />} />
        <Route
          path="/info/:page"
          element={
            <div className="status">
              <h1>Em breve</h1>
              <p>Esta página ainda não está disponível.</p>
              <Link className="button" to="/">
                Voltar ao início
              </Link>
            </div>
          }
        />
        <Route
          path="*"
          element={
            <div className="status">
              <h1>Página não encontrada</h1>
              <Link className="button" to="/">
                Voltar ao início
              </Link>
            </div>
          }
        />
      </Routes>
    </Layout>
  );
}
