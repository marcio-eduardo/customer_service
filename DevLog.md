# DevLog

## 27/11/2025

- Análise inicial do código finalizada.
- Foram identificadas vulnerabilidades de segurança e pontos de melhoria na configuração do back-end.
- Nenhuma vulnerabilidade crítica foi encontrada no front-end, mas uma análise de dependências é recomendada.
- Criação dos arquivos `DevLog.md` e `Tarefas.md`.

## 28/11/2025

- Início da refatoração do modelo de dados para alinhar com as novas regras de negócio.
- Criados os arquivos `BD.md` e `BD-OLD.md` para documentar e comparar os modelos de dados.
- Removidas as classes de modelo e repositórios antigos: `ClientePf`, `ClientePJ` e `Technical`.
- Atualizado o arquivo `Tarefas.md` com o plano de refatoração.
- Análise de contexto realizada: Leitura de README, DevLog e Tarefas. Próximo foco identificado: Refatoração do Frontend (SignUp, CreateTicket, Company CRUD).
- Correção de Bug: Ajustado o menu dropdown "Configurações" que fechava prematuramente. Removido gap (`mt-0.5`) entre o botão e o menu.
- Melhoria de UX: Alterado o comportamento dos submenus "Empresas" e "Usuários" no NavigationBar. Agora são seções estáticas (sempre visíveis) para evitar layout shift e fechamento acidental do menu.
