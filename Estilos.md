## Estilização do Projeto

Abaixo a tabela com as váriáveis presentes no tailwind.config.js

| **Variável CSS**        | **Onde é usada (Semântica)**                                 |
| ----------------------- | ------------------------------------------------------------ |
| `--tas-primary`         | **Navbar**, Cabeçalhos principais, Bordas de destaque. É a cor da "marca". |
| `--tas-primary-hover`   | Estado de **hover** em botões ou links da cor primária.      |
| `--tas-secondary`       | **Ações Principais** (Botões "Salvar", "Criar"), Ícones de Sucesso, Links ativos. Transmite segurança. |
| `--tas-secondary-hover` | Hover dos elementos secundários.                             |
| `--tas-accent`          | **Destaques**, Status "Em Andamento", Números importantes (KPIs), Gráficos. Chama atenção. |
| `--tas-accent-hover`    | Hover dos elementos de acento.                               |
| `--tas-bg-page`         | **Fundo da Tela** (Background do `<body>`).                  |
| `--tas-bg-card`         | **Cartões**, Painéis, Tabelas. Onde o conteúdo vive.         |
| `--tas-text-on-card`    | **Texto Principal**. Títulos de cards, parágrafos, dados de tabelas. |
| `--tas-text-secondary`  | **Texto de Apoio**. Legendas, datas, labels de formulário, placeholders. |
| `--tas-text-on-primary` | Texto sobre a Navbar ou sobre botões sólidos (para contraste). |



# Guia de Paletas de Cores do TAS

Este documento serve como referência para os temas definidos no `src/index.css`. O sistema utiliza variáveis CSS para permitir a troca dinâmica de temas.

## Tabela de Cores por Tema

| **Tema**              | **Variável CSS**        | **Cor (Hex)** | **Descrição de Uso**                              |
| --------------------- | ----------------------- | ------------- | ------------------------------------------------- |
| **Confiança Moderna** | `--tas-primary`         | `#293B44`     | Navbar, Cabeçalhos, Bordas (Azul Petróleo Escuro) |
| (Original)            | `--tas-primary-hover`   | `#22313A`     | Hover em elementos primários                      |
|                       | `--tas-secondary`       | `#00875A`     | Ações Principais, Sucesso (Verde Esmeralda)       |
|                       | `--tas-secondary-hover` | `#007a50`     | Hover em elementos secundários                    |
|                       | `--tas-accent`          | `#FFC107`     | Destaques, Alertas (Âmbar/Dourado)                |
|                       | `--tas-accent-hover`    | `#ebb206`     | Hover em destaques                                |
|                       | `--tas-bg-page`         | `#DFE0E1`     | Fundo da Tela (Cinza Concreto)                    |
|                       | `--tas-bg-card`         | `#F2F2F2`     | Fundo de Cartões (Cinza Gelo)                     |
|                       | `--tas-text-on-card`    | `#212529`     | Texto Principal (Preto Suave)                     |
|                       | `--tas-text-secondary`  | `#6C757D`     | Texto Secundário (Cinza Médio)                    |
|                       | `--tas-text-on-primary` | `#FFFFFF`     | Texto em Fundo Escuro (Branco)                    |
| **Tech Blue**         | `--tas-primary`         | `#0F172A`     | Navbar, Cabeçalhos (Slate 900)                    |
| (Corporativo)         | `--tas-secondary`       | `#3B82F6`     | Ações Principais (Blue 500)                       |
|                       | `--tas-accent`          | `#F43F5E`     | Destaques (Rose 500)                              |
|                       | `--tas-bg-page`         | `#F1F5F9`     | Fundo da Tela (Slate 100)                         |
|                       | `--tas-bg-card`         | `#FFFFFF`     | Fundo de Cartões (Branco)                         |
| **Forest Trust**      | `--tas-primary`         | `#14532D`     | Navbar, Cabeçalhos (Green 900)                    |
| (Estabilidade)        | `--tas-secondary`       | `#15803D`     | Ações Principais (Green 700)                      |
|                       | `--tas-accent`          | `#D97706`     | Destaques (Amber 600)                             |
|                       | `--tas-bg-page`         | `#ECFDF5`     | Fundo da Tela (Green 50)                          |
|                       | `--tas-bg-card`         | `#FFFFFF`     | Fundo de Cartões (Branco)                         |
| **Modern Purple**     | `--tas-primary`         | `#4C1D95`     | Navbar, Cabeçalhos (Violet 900)                   |
| (Inovação)            | `--tas-secondary`       | `#8B5CF6`     | Ações Principais (Violet 500)                     |
|                       | `--tas-accent`          | `#06B6D4`     | Destaques (Cyan 500)                              |
|                       | `--tas-bg-page`         | `#F5F3FF`     | Fundo da Tela (Violet 50)                         |
|                       | `--tas-bg-card`         | `#FFFFFF`     | Fundo de Cartões (Branco)                         |
| **Warm Professional** | `--tas-primary`         | `#431407`     | Navbar, Cabeçalhos (Orange 950)                   |
| (Acolhedor)           | `--tas-secondary`       | `#EA580C`     | Ações Principais (Orange 600)                     |
|                       | `--tas-accent`          | `#0D9488`     | Destaques (Teal 600)                              |
|                       | `--tas-bg-page`         | `#FFF7ED`     | Fundo da Tela (Orange 50)                         |
|                       | `--tas-bg-card`         | `#FFFFFF`     | Fundo de Cartões (Branco)                         |
| **Slate Monochrome**  | `--tas-primary`         | `#000000`     | Navbar, Cabeçalhos (Preto)                        |
| (Minimalista)         | `--tas-secondary`       | `#475569`     | Ações Principais (Slate 600)                      |
|                       | `--tas-accent`          | `#000000`     | Destaques (Preto - Contraste)                     |
|                       | `--tas-bg-page`         | `#F8FAFC`     | Fundo da Tela (Slate 50)                          |
|                       | `--tas-bg-card`         | `#FFFFFF`     | Fundo de Cartões (Branco)                         |

## Cores de Status (Semânticas)

Estas cores tendem a ser consistentes entre os temas para manter a clareza, mas podem sofrer leves ajustes de saturação em temas específicos (como o Tech Blue).

- `--tas-status-success`: `#28A745` (Verde) / `#10B981` (Emerald)
- `--tas-status-warning`: `#FF8C00` (Laranja) / `#F59E0B` (Amber)
- `--tas-status-error`: `#DC3545` (Vermelho) / `#EF4444` (Red)
- `--tas-status-info`: `#17A2B8` (Ciano) / `#0EA5E9` (Sky)