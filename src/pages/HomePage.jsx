import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Shirt,
  Headphones,
  Footprints,
} from "lucide-react";
import { Section, ProductListing, ResourceStatus } from "../components/Store";
import { useResource } from "../hooks/useResource";
import { listProducts } from "../services/products";
const loadHome = () => listProducts();
const banners = [
  {
    image: "/home-slide-1.jpeg",
    title: "Seu estilo, seu próximo passo",
    subtitle: "Melhores ofertas personalizadas",
  },
  {
    image: "/home-slide-2.jpeg",
    title: "Novos caminhos. Novas escolhas.",
    subtitle: "Encontre seu novo favorito",
  },
  {
    image: "/home-slide-3.jpeg",
    title: "Conforto que vai com você",
    subtitle: "Uma seleção para o seu dia",
  },
  {
    image: "/home-slide-4.jpeg",
    title: "Dê um passo fora do comum",
    subtitle: "Descubra nossa coleção",
  },
];
function Hero() {
  const [index, setIndex] = useState(0);
  const slide = banners[index];
  return (
    <section className="hero" aria-label="Ofertas em destaque">
      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="eyebrow">{slide.subtitle}</span>
          <h1>
            {slide.title} <span>🔥</span>
          </h1>
          <p>
            Encontre o seu próximo favorito. Estilo e conforto para acompanhar
            você em todos os momentos.
          </p>
          <Link className="button" to="/products">
            Ver Ofertas
          </Link>
        </div>
        <div className="hero-art">
          <div className="dot-pattern" />
          <img
            key={slide.image}
            src={slide.image}
            alt="Calçado da coleção em destaque"
          />
          <div className="hero-arrows">
            <button
              className="icon-button"
              aria-label="Oferta anterior"
              disabled={index === 0}
              onClick={() => setIndex(index - 1)}
            >
              <ChevronLeft />
            </button>
            <button
              className="icon-button"
              aria-label="Próxima oferta"
              disabled={index === banners.length - 1}
              onClick={() => setIndex(index + 1)}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
        <div className="hero-dots">
          {banners.map((_, i) => (
            <button
              key={i}
              className={index === i ? "active" : ""}
              aria-label={`Ver oferta ${i + 1}`}
              aria-pressed={index === i}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
function CollectionCards() {
  return (
    <div className="collections">
      {["Novo drop Supreme", "Coleção Adidas", "Novo Beats Bass"].map(
        (name, i) => (
          <Link
            to="/products"
            className="collection"
            key={name}
            aria-label={`Comprar ${name}`}
          >
            <img src={`/collection-${i + 1}.png`} alt={name} />
            <span className="badge">30% OFF</span>
            <span className="collection-cta">Comprar</span>
          </Link>
        ),
      )}
    </div>
  );
}
function Categories() {
  return (
    <div id="categories">
      <Section
        title="Coleções em destaque"
        titleAlign="center"
        className="categories-section"
      >
        <div className="categories">
          {[
            ["Camisetas", Shirt],
            ["Calças", Footprints],
            ["Bonés", Shirt],
            ["Headphones", Headphones],
            ["Tênis", Footprints],
          ].map(([name, Icon]) => (
            <Link
              key={name}
              to={`/products?${new URLSearchParams({ filter: name })}`}
            >
              <span>
                <Icon strokeWidth={1.3} size={55} />
              </span>
              <strong>{name}</strong>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
export default function HomePage() {
  const resource = useResource(loadHome);
  return (
    <>
      <Hero />
      <div className="container home-content">
        <Section title="Coleções em destaque">
          <CollectionCards />
        </Section>
        <Categories />
        <Section
          title="Produtos em alta"
          link={{ text: "Ver todos", href: "/products" }}
        >
          <ResourceStatus resource={resource}>
            {resource.data && (
              <ProductListing products={resource.data.slice(0, 8)} />
            )}
          </ResourceStatus>
        </Section>
      </div>
      <section className="special-offer">
        <div className="container special-inner">
          <div className="special-art">
            <img
              src="/produc-image-1.jpeg"
              alt="Tênis Air Jordan da coleção"
              loading="lazy"
            />
          </div>
          <div>
            <span className="eyebrow">Oferta especial</span>
            <h2>Air Jordan edição de colecionador</h2>
            <p>
              Uma presença marcante em cada detalhe. Descubra o encontro entre
              atitude, conforto e um estilo que atravessa gerações.
            </p>
            <Link className="button" to="/product/1">
              Ver Oferta
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
