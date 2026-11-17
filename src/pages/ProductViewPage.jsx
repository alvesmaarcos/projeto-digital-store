import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Gallery,
  BuyBox,
  ProductOptions,
  Section,
  ProductListing,
  ResourceStatus,
} from "../components/Store";
import { useResource } from "../hooks/useResource";
import { getProductById, listProducts } from "../services/products";
import { useNotice } from "./Layout";
export default function ProductViewPage() {
  const { id } = useParams(),
    notice = useNotice();
  const loader = useCallback(
    async () => ({
      product: await getProductById(id),
      products: await listProducts(),
    }),
    [id],
  );
  const resource = useResource(loader),
    product = resource.data?.product;
  return (
    <div className="container detail-page">
      <ResourceStatus resource={resource}>
        {product ? (
          <>
            <nav className="breadcrumb" aria-label="Caminho da página">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/products">Produtos</Link>
              <span>/</span>
              <Link to="/products?filter=Tênis">Tênis</Link>
              <span>/</span>
              <span>{product.brand}</span>
              <span>/</span>
              <span aria-current="page">{product.name}</span>
            </nav>
            <div className="product-detail" key={id}>
              <Gallery
                images={product.images}
                showThumbs
                width="700"
                height="570"
                radius="4px"
              />
              <BuyBox
                {...product}
                onBuy={() => notice("A compra ainda não está disponível.")}
              >
                <ProductOptions label="Tamanho" options={product.sizes} />
                <ProductOptions
                  label="Cor"
                  options={product.colors}
                  type="color"
                  shape="circle"
                />
              </BuyBox>
            </div>
            <Section
              title="Produtos recomendados"
              link={{ text: "Ver todos", href: "/products" }}
            >
              <ProductListing
                products={resource.data.products
                  .filter((item) => item.id !== id)
                  .slice(0, 4)}
              />
            </Section>
          </>
        ) : (
          <div className="status">
            <h1>Produto não encontrado</h1>
            <Link className="button" to="/products">
              Voltar ao catálogo
            </Link>
          </div>
        )}
      </ResourceStatus>
    </div>
  );
}
