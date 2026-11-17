import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { Gallery, ProductOptions, ResourceStatus } from "../components/Store";
import { useResource } from "../hooks/useResource";
import { listProducts, getProductById } from "../services/products";
describe("catálogo local", () => {
  it("normaliza acentos, maiúsculas e espaços; não expõe dados mutáveis", async () => {
    const all = await listProducts(),
      found = await listProducts({ search: "  TENIS  " });
    expect(found).toHaveLength(all.length);
    found[0].name = "Alterado";
    expect((await getProductById(found[0].id)).name).not.toBe("Alterado");
    expect(await listProducts({ search: "inexistente" })).toEqual([]);
    expect(await getProductById("inexistente")).toBeNull();
  });
});
describe("interações", () => {
  it("navega na galeria com limites e miniaturas", async () => {
    const user = userEvent.setup();
    render(
      <Gallery
        images={[{ src: "/1.jpg" }, { src: "/2.jpg" }, { src: "/3.jpg" }]}
        showThumbs
      />,
    );
    expect(
      screen.getByRole("button", { name: "Imagem anterior" }),
    ).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Próxima imagem" }));
    expect(
      screen.getByRole("button", { name: "Ver imagem 2" }),
    ).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "Ver imagem 3" }));
    expect(
      screen.getByRole("button", { name: "Próxima imagem" }),
    ).toBeDisabled();
  });
  it("mantém tamanho e cor independentes", async () => {
    const user = userEvent.setup();
    render(
      <>
        <ProductOptions options={["39", "40"]} label="Tamanho" />
        <ProductOptions
          options={["#000", "#fff"]}
          type="color"
          shape="circle"
          label="Cor"
        />
      </>,
    );
    await user.click(screen.getByRole("button", { name: "Tamanho 40" }));
    await user.click(screen.getByRole("button", { name: "Cor #000" }));
    expect(screen.getByRole("button", { name: "Tamanho 40" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Cor #000" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
  it("busca por Enter e mantém a contagem do catálogo", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );
    await user.type(
      screen.getByRole("textbox", { name: "Pesquisar produtos" }),
      "Nike{Enter}",
    );
    expect(
      await screen.findByRole("heading", { name: /Resultados para “Nike”/ }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /Resultados para “Nike”/ }),
      ).toHaveTextContent("3 produtos"),
    );
    await user.clear(
      screen.getByRole("textbox", { name: "Pesquisar produtos" }),
    );
    await user.type(
      screen.getByRole("textbox", { name: "Pesquisar produtos" }),
      "xyz",
    );
    await user.click(
      screen.getByRole("button", { name: "Buscar", exact: true }),
    );
    expect(
      await screen.findByRole("heading", { name: "Nenhum produto encontrado" }),
    ).toBeInTheDocument();
  });
  it("aceita a rota em português preservando a pesquisa", async () => {
    render(
      <MemoryRouter initialEntries={["/produtos?filter=Nike"]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole("heading", { name: /Resultados para “Nike”/ }),
    ).toBeInTheDocument();
  });
  it("trata identificador de produto inexistente", async () => {
    render(
      <MemoryRouter initialEntries={["/product/999"]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole("heading", { name: "Produto não encontrado" }),
    ).toBeInTheDocument();
  });
  it("abre filtros, contém o foco e fecha com Escape ou sobreposição", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/products"]}>
        <App />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("button", { name: "Abrir filtros" }));
    expect(
      screen.getByRole("dialog", { name: "Filtrar por" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fechar painel" })).toHaveFocus();
    await user.click(within(screen.getByRole('dialog')).getByLabelText('Nike'));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Abrir filtros" })).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Abrir filtros" }));
    expect(within(screen.getByRole('dialog')).getByLabelText('Nike')).toBeChecked();
    await user.click(document.querySelector(".drawer-overlay"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
describe("estados assíncronos", () => {
  it("mostra carregamento, erro e permite uma nova tentativa", async () => {
    const loader = vi
      .fn()
      .mockRejectedValueOnce(new Error("Offline"))
      .mockResolvedValueOnce([]);
    function Fixture() {
      const resource = useResource(loader);
      return (
        <ResourceStatus resource={resource}>
          <p>Carregado</p>
        </ResourceStatus>
      );
    }
    const user = userEvent.setup();
    render(<Fixture />);
    expect(screen.getByRole("status")).toHaveTextContent("Carregando");
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível",
    );
    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(await screen.findByText("Carregado")).toBeInTheDocument();
  });
});
