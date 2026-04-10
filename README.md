# 📋 User List App — Angular 17+

Projeto desenvolvido como parte de uma avaliação técnica para vaga de Desenvolvedor Front End Angular.

A aplicação consiste em uma listagem de usuários com CRUD em modal, utilizando Angular 17+, Angular Material, RxJS e formulários reativos.

---

## 🚀 Funcionalidades

- Listagem de usuários em cards
- Filtro por nome com debounce
- Modal de criação e edição de usuários
- Formulário reativo com validações
- Indicador de loading
- Estrutura baseada em features

---

## 🧰 Tecnologias utilizadas

- Angular 17+
- TypeScript
- Angular Material
- RxJS
- Reactive Forms
- Signals
- SCSS

---

## 📦 Instalação e execução

git clone https://github.com/seu-usuario/user-list-app.git
cd user-list-app
npm install
ng serve

A aplicação roda em:
http://localhost:4200

---

## 📁 Estrutura do projeto

src/app/features/users
 ├── user-list/
 ├── user-form-modal/
 ├── services/
 ├── models/

---

# 🧠 RESPOSTAS DA AVALIAÇÃO TÉCNICA

## 1. TypeScript e Qualidade de Código

### 1.1 Refatoração

Problemas do código original:
- Uso de any
- Lógica duplicada
- Loop manual para busca
- Baixa legibilidade

Código refatorado:

class Produto {
  constructor(
    public id: number,
    public descricao: string,
    public quantidadeEstoque: number
  ) {}
}

class Verdureira {
  constructor(
    private produtos: Produto[] = [
      new Produto(1, 'Maçã', 20),
      new Produto(2, 'Laranja', 0),
      new Produto(3, 'Limão', 20)
    ]
  ) {}

  private findProduto(id: number): Produto | undefined {
    return this.produtos.find(p => p.id === id);
  }

  getDescricaoProduto(produtoId: number): string {
    const produto = this.findProduto(produtoId);
    if (!produto) return 'Produto não encontrado';

    return produto.id + ' - ' + produto.descricao + ' (' + produto.quantidadeEstoque + 'x)';
  }

  hasEstoqueProduto(produtoId: number): boolean {
    const produto = this.findProduto(produtoId);
    return !!produto && produto.quantidadeEstoque > 0;
  }
}

---

### 1.2 Generics + Paginação

interface PaginaParams {
  page: number;
  size: number;
}

interface Pagina<T> {
  items: T[];
  total: number;
}

function filtrarEPaginar<T>(
  data: T[],
  filterFn: (item: T) => boolean,
  params: PaginaParams
): Pagina<T> {

  const filtrados = data.filter(filterFn);

  const start = (params.page - 1) * params.size;
  const end = start + params.size;

  return {
    items: filtrados.slice(start, end),
    total: filtrados.length
  };
}

Exemplo:

interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Bruno' },
  { id: 3, name: 'Carlos' }
];

const result = filtrarEPaginar(
  users,
  user => user.name.includes('a'),
  { page: 1, size: 2 }
);

---

## 2. Angular — Reatividade

### 2.1 ChangeDetection OnPush

Problema:
OnPush não detecta atualização automática em subscribe.

Solução:

import { ChangeDetectorRef } from '@angular/core';

constructor(
  private pessoaService: PessoaService,
  private cdr: ChangeDetectorRef
) {}

ngOnInit(): void {
  this.pessoaService.buscarPorId(1).subscribe((pessoa) => {
    this.texto = `Nome: ${pessoa.nome}`;
    this.cdr.markForCheck();
  });

  setInterval(() => this.contador++, 1000);
}

---

### 2.2 RxJS sem subscribe aninhado

ngOnInit(): void {
  const pessoaId = 1;

  this.pessoaService.buscarPorId(pessoaId).pipe(
    switchMap(pessoa =>
      this.pessoaService.buscarQuantidadeFamiliares(pessoaId).pipe(
        map(qtd => ({ pessoa, qtd }))
      )
    )
  ).subscribe(({ pessoa, qtd }) => {
    this.texto = `Nome: ${pessoa.nome} | familiares: ${qtd}`;
  });
}

---

### 2.3 Busca com debounce

search$ = new Subject<string>();
loading = signal(false);
results = signal<any[]>([]);

ngOnInit() {
  this.search$.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    tap(() => this.loading.set(true)),
    switchMap(value => this.api.search(value)),
    finalize(() => this.loading.set(false))
  ).subscribe(res => {
    this.results.set(res);
  });
}

---

## 2.4 Performance

- trackBy evita recriação de elementos DOM
- OnPush reduz change detection
- Default strategy recalcula tudo na árvore

---

## 3. Signals

items = signal<Item[]>([]);

total = computed(() =>
  this.items().reduce((acc, item) => acc + item.price * item.quantity, 0)
);

addItem(item: Item) {
  this.items.update(items => [...items, item]);
}

---

## 4. Projeto

Funcionalidades:
- CRUD de usuários
- Modal de edição/criação
- Filtro com debounce
- Angular Material

Melhorias futuras:
- NgRx
- Testes unitários
- Paginação
- Nx Monorepo

---

## 📌 Repositório

https://github.com/seu-usuario/user-list-app