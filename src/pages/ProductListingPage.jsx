import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter } from "lucide-react";
import { Filters, ProductListing, ResourceStatus } from "../components/Store";
import Drawer from "../components/Drawer";
import { useResource } from "../hooks/useResource";
import { listProducts } from "../services/products";
export default function ProductListingPage() {
  const [params] = useSearchParams(),
    search = params.get("filter") || "";
  const loader = useCallback(() => listProducts({ search }), [search]);
  const resource = useResource(loader);
  const [open, setOpen] = useState(false),
    [order, setOrder] = useState("relevance");
  const close = useCallback(() => setOpen(false), []);
  const [selections, setSelections] = useState({});
  const changeFilter = (title, values) =>
    setSelections((current) => ({ ...current, [title]: values }));
  return (
    <div className="container listing-page">
      <div className="listing-toolbar">
        <h1>
          {search ? <>Resultados para “{search}”</> : "Todos os produtos"}{" "}
          <span> - {resource.data?.length ?? 0} produtos</span>
        </h1>
        <div className="listing-controls">
          <label className="sort">
            <strong>Ordenar por:</strong>
            <select
              aria-label="Ordenar por"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            >
              <option value="relevance">mais relevantes</option>
              <option value="asc">Menor preço</option>
              <option value="desc">Maior preço</option>
            </select>
          </label>
          <button
            className="filter-toggle button"
            aria-label="Abrir filtros"
            onClick={() => setOpen(true)}
          >
            <Filter />
          </button>
        </div>
      </div>
      <div className="listing-layout">
        <aside className="filter-sidebar">
          <h2>Filtrar por</h2>
          <Filters selections={selections} onChange={changeFilter} />
        </aside>
        <ResourceStatus resource={resource}>
          {resource.data?.length ? (
            <ProductListing products={resource.data} className="listing-grid" />
          ) : (
            <div className="status">
              <h2>Nenhum produto encontrado</h2>
              <p>Tente buscar por “Tênis” ou “Nike”.</p>
            </div>
          )}
        </ResourceStatus>
      </div>
      {open && (
        <Drawer title="Filtrar por" onClose={close}>
          <Filters selections={selections} onChange={changeFilter} />
        </Drawer>
      )}
    </div>
  );
}
