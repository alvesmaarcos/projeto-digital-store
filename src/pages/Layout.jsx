import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { Logo } from "../components/Store";
import Drawer from "../components/Drawer";
import facebook from "../../assets/facebook.svg";
import instagram from "../../assets/instagram.svg";
import twitter from "../../assets/twitter.svg";
const NoticeContext = createContext(null);
export function useNotice() {
  return useContext(NoticeContext);
}
function Navigation({ onNavigate }) {
  const notice = useNotice(),
    location = useLocation();
  return (
    <nav className="navigation" aria-label="Navegação principal">
      <NavLink to="/" end onClick={onNavigate}>
        Home
      </NavLink>
      <NavLink
        to="/products"
        className={({ isActive }) =>
          isActive || location.pathname.startsWith("/product/") ? "active" : ""
        }
        onClick={onNavigate}
      >
        Produtos
      </NavLink>
      <Link to="/#categories" onClick={onNavigate}>
        Categorias
      </Link>
      <button
        onClick={() => {
          onNavigate?.();
          notice("Meus pedidos ainda não está disponível.");
        }}
      >
        Meus Pedidos
      </button>
    </nav>
  );
}
function Header() {
  const [menuOpen, setMenuOpen] = useState(false),
    [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation(),
    navigate = useNavigate(),
    notice = useNotice();
  const [search, setSearch] = useState(
    () => new URLSearchParams(location.search).get("filter") || "",
  );
  useEffect(() => {
    setSearch(new URLSearchParams(location.search).get("filter") || "");
  }, [location.search]);
  const close = useCallback(() => setMenuOpen(false), []);
  function submit(event) {
    event.preventDefault();
    navigate(
      `/products${search.trim() ? `?${new URLSearchParams({ filter: search.trim() })}` : ""}`,
    );
  }
  return (
    <header className="header">
      <div className="container">
        <div className="header-top">
          <button
            className="icon-button mobile-only"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu />
          </button>
          <Logo />
          <form
            className={`search-form ${searchOpen ? "search-open" : ""}`}
            onSubmit={submit}
          >
            <input
              aria-label="Pesquisar produtos"
              placeholder="Pesquisar produto..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button className="icon-button" aria-label="Buscar" type="submit">
              <Search />
            </button>
          </form>
          <div className="account">
            <button
              className="register"
              onClick={() => notice("O cadastro ainda não está disponível.")}
            >
              Cadastre-se
            </button>
            <button
              className="button"
              onClick={() =>
                notice("O acesso à conta ainda não está disponível.")
              }
            >
              Entrar
            </button>
          </div>
          <button
            className={`icon-button mobile-only ${searchOpen ? "pink" : ""}`}
            aria-label="Mostrar busca"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={21} />
          </button>
          <span className="cart" aria-label="Carrinho de compras ilustrativo">
            <ShoppingCart />
          </span>
        </div>
        <div className="desktop-navigation">
          <Navigation />
        </div>
      </div>
      {menuOpen && (
        <Drawer title="Páginas" onClose={close}>
          <Navigation onNavigate={close} />
          <div className="drawer-account">
            <button
              className="button"
              onClick={() => {
                close();
                notice("O acesso à conta ainda não está disponível.");
              }}
            >
              Entrar
            </button>
            <button
              className="register"
              onClick={() => {
                close();
                notice("O cadastro ainda não está disponível.");
              }}
            >
              Cadastre-se
            </button>
          </div>
        </Drawer>
      )}
    </header>
  );
}
export function Informations({ title, informations }) {
  return (
    <div className="footer-column">
      <h2>{title}</h2>
      {informations.map((item) => (
        <Link key={item.text} to={item.link}>
          {item.text}
        </Link>
      ))}
    </div>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <Logo light />
            <p>
              Estilo, conforto e novas possibilidades para todos os seus passos.
              Encontre a sua próxima combinação na Digital Store.
            </p>
            <div className="socials">
              {[
                [facebook, "Facebook", "https://www.facebook.com/"],
                [instagram, "Instagram", "https://www.instagram.com/"],
                [twitter, "Twitter", "https://twitter.com/"],
              ].map(([src, name, url]) => (
                <a
                  key={name}
                  href={url}
                  aria-label={name}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={src} alt="" />
                </a>
              ))}
            </div>
          </div>
          <Informations
            title="Informação"
            informations={[
              "Sobre Drip Store",
              "Segurança",
              "Wishlist",
              "Blog",
              "Trabalhe conosco",
              "Meus Pedidos",
            ].map((text, i) => ({
              text,
              link: `/info/${["sobre", "seguranca", "wishlist", "blog", "trabalhe-conosco", "pedidos"][i]}`,
            }))}
          />
          <Informations
            title="Categorias"
            informations={[
              "Camisetas",
              "Calças",
              "Bonés",
              "Headphones",
              "Tênis",
            ].map((text) => ({
              text,
              link: `/products?${new URLSearchParams({ filter: text })}`,
            }))}
          />
          <div className="footer-contact">
            <h2>Contato</h2>
            <p>
              Av. Santos Dumont, 1510 - 1 andar - Aldeota, Fortaleza - CE,
              60150-161
            </p>
            <a href="tel:+558530513411">(85) 3051-3411</a>
          </div>
        </div>
        <div className="copyright">
          © {new Date().getFullYear()} Digital Store
        </div>
      </div>
    </footer>
  );
}
export default function Layout({ children }) {
  const [notice, setNotice] = useState("");
  const location = useLocation();
  useEffect(() => {
    if (location.hash)
      requestAnimationFrame(() =>
        document.getElementById(location.hash.slice(1))?.scrollIntoView(),
      );
    else window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 6000);
    return () => clearTimeout(timer);
  }, [notice]);
  return (
    <NoticeContext.Provider value={setNotice}>
      <a className="skip-link" href="#main">
        Pular para conteúdo
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      {notice && (
        <div className="toast" role="status">
          {notice}
          <button
            className="icon-button"
            aria-label="Fechar aviso"
            onClick={() => setNotice("")}
          >
            <X size={18} />
          </button>
        </div>
      )}
    </NoticeContext.Provider>
  );
}
