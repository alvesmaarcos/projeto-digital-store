import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import headerLogo from "../../assets/logo-header.svg";
import footerLogo from "../../assets/logo-footer.svg";
export const money = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );
export function Logo({ light = false }) {
  return (
    <Link to="/" aria-label="Digital Store — início">
      <img
        className="logo"
        src={light ? footerLogo : headerLogo}
        alt="Digital Store"
        width="253"
        height="44"
      />
    </Link>
  );
}
export function Section({
  title,
  titleAlign = "left",
  link,
  children,
  className = "",
}) {
  return (
    <section className={`section ${className}`}>
      <div
        className={`section-heading ${titleAlign === "center" ? "center" : ""}`}
      >
        <h2>{title}</h2>
        {link && (
          <Link to={link.href}>
            {link.text}
            <ArrowRight size={22} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
export function ProductCard({
  id,
  image,
  imagem,
  name,
  category = "Tênis",
  price,
  priceDiscount,
}) {
  const discount = priceDiscount != null && priceDiscount < price;
  return (
    <Link className="product-card" to={`/product/${id}`}>
      <div className="product-photo">
        {discount && (
          <span className="badge">
            {Math.round((1 - priceDiscount / price) * 100)}% OFF
          </span>
        )}
        <img
          src={image || imagem}
          alt={name}
          loading="lazy"
          width="292"
          height="321"
        />
      </div>
      <small>{category}</small>
      <h3 title={name}>{name}</h3>
      <div className="prices">
        {discount && <del>{money(price)}</del>}
        <strong>{money(discount ? priceDiscount : price)}</strong>
      </div>
    </Link>
  );
}
export function ProductListing({ products, className = "" }) {
  return (
    <div className={`product-grid ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
export function Gallery({
  images,
  className = "",
  width = 700,
  height = 570,
  radius = "4px",
  showThumbs = false,
}) {
  const [index, setIndex] = useState(0);
  const current = Math.min(index, Math.max(0, images.length - 1));
  if (!images.length) return <div>Imagem indisponível</div>;
  return (
    <div
      className={`gallery ${className}`}
      style={{
        maxWidth: `${parseFloat(width)}px`,
        "--gallery-ratio": `${parseFloat(width)} / ${parseFloat(height)}`,
        "--gallery-radius": radius,
      }}
    >
      <div className="gallery-stage">
        <img
          key={images[current].src}
          src={images[current].src}
          alt={images[current].alt || `Imagem ${current + 1} do produto`}
        />
        <button
          className="gallery-prev icon-button"
          aria-label="Imagem anterior"
          disabled={current === 0}
          onClick={() => setIndex(current - 1)}
        >
          <ChevronLeft />
        </button>
        <button
          className="gallery-next icon-button"
          aria-label="Próxima imagem"
          disabled={current === images.length - 1}
          onClick={() => setIndex(current + 1)}
        >
          <ChevronRight />
        </button>
      </div>
      {showThumbs && (
        <div className="thumbnails">
          {images.map((item, i) => (
            <button
              key={item.src}
              onClick={() => setIndex(i)}
              aria-label={`Ver imagem ${i + 1}`}
              aria-pressed={current === i}
            >
              <img src={item.src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
export function ProductOptions({
  options,
  radius = "4px",
  shape = "square",
  type = "text",
  label = "Opções",
}) {
  const [selected, setSelected] = useState(null);
  return (
    <fieldset className="product-options">
      <legend>{label}</legend>
      <div>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`option ${shape} ${type} ${selected === option ? "selected" : ""}`}
            style={{
              borderRadius: shape === "circle" ? "50%" : radius,
              ...(type === "color" ? { backgroundColor: option } : {}),
            }}
            aria-label={
              type === "color" ? `Cor ${option}` : `Tamanho ${option}`
            }
            aria-pressed={selected === option}
            onClick={() => setSelected(option)}
          >
            {type === "text" ? option : ""}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
export function BuyBox({
  name,
  reference,
  stars,
  rating,
  price,
  priceDiscount,
  description,
  children,
  brand,
  onBuy,
}) {
  return (
    <div className="buy-box">
      <h1>{name}</h1>
      <p className="reference">
        Casual | {brand} | REF:{reference}
      </p>
      <div className="rating">
        <span className="stars" aria-label={`${stars} de 5 estrelas`}>
          ★★★★☆
        </span>
        <strong>
          {stars}
          <Star size={14} fill="currentColor" />
        </strong>
        <span>({rating} avaliações)</span>
      </div>
      <div className="detail-price">
        <strong>{money(priceDiscount ?? price)}</strong>
        {priceDiscount != null && <del>{money(price)}</del>}
      </div>
      <h2>Descrição do produto</h2>
      <p className="description">{description}</p>
      {children}
      <button className="button buy-button" onClick={onBuy}>
        COMPRAR
      </button>
    </div>
  );
}
export function FilterGroup({
  title,
  inputType = "checkbox",
  options,
  selected,
  onChange,
}) {
  const groupId = useId();
  const [localSelected, setLocalSelected] = useState([]);
  const values = selected ?? localSelected;
  function change(value) {
    const next =
      inputType === "radio"
        ? [value]
        : values.includes(value)
          ? values.filter((item) => item !== value)
          : [...values, value];
    if (onChange) onChange(next);
    else setLocalSelected(next);
  }
  return (
    <fieldset className="filter-group">
      <legend>{title}</legend>
      {options.map((option) => (
        <label key={option.value || option.text}>
          <input
            type={inputType}
            name={`${groupId}-${title}`}
            value={option.value || option.text}
            checked={values.includes(option.value || option.text)}
            onChange={() => change(option.value || option.text)}
          />
          {option.text}
        </label>
      ))}
    </fieldset>
  );
}
export function Filters({ selections = {}, onChange }) {
  const selectionProps = (title) => ({
    selected: selections[title],
    onChange: onChange ? (values) => onChange(title, values) : undefined,
  });
  return (
    <div className="filters">
      <FilterGroup
        title="Marca"
        {...selectionProps("Marca")}
        options={["Adidas", "Balenciaga", "K-Swiss", "Nike", "Puma"].map(
          (text) => ({ text }),
        )}
      />
      <FilterGroup
        title="Categoria"
        {...selectionProps("Categoria")}
        options={["Esporte e lazer", "Casual", "Utilitário", "Corrida"].map(
          (text) => ({ text }),
        )}
      />
      <FilterGroup
        title="Gênero"
        {...selectionProps("Gênero")}
        options={["Masculino", "Feminino", "Unissex"].map((text) => ({ text }))}
      />
      <FilterGroup
        title="Estado"
        {...selectionProps("Estado")}
        inputType="radio"
        options={["Novo", "Usado"].map((text) => ({ text }))}
      />
    </div>
  );
}
export function ResourceStatus({ resource, children }) {
  if (resource.loading)
    return (
      <div className="status" role="status">
        Carregando produtos…
      </div>
    );
  if (resource.error)
    return (
      <div className="status" role="alert">
        <p>{resource.error}</p>
        <button className="button" onClick={resource.retry}>
          Tentar novamente
        </button>
      </div>
    );
  return children;
}
