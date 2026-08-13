# 📚 Levantamento de Requisitos — Acervo Digital

## 1. Identificação do Projeto

**Nome:** Acervo Digital
**Instituição:** SESI Paulista
**Desenvolvido por:** Estudantes do SESI Paulista

---

## 2. Descrição do Projeto

O **Acervo Digital** é uma plataforma desenvolvida com o objetivo de modernizar e facilitar o gerenciamento do acervo de livros da instituição.

Atualmente, parte do controle dos livros, empréstimos e devoluções é realizado de forma manual, o que pode tornar o processo mais demorado e dificultar o acompanhamento dos materiais disponíveis e emprestados.

Como solução, o projeto propõe a digitalização desse processo, permitindo centralizar as informações dos livros, alunos, bibliotecários e empréstimos em uma única plataforma.

---

## 3. Problema Identificado

O gerenciamento manual do acervo pode gerar dificuldades, como:

* Dificuldade para localizar informações sobre os livros;
* Maior tempo para realizar registros de empréstimos e devoluções;
* Dificuldade para identificar quais livros estão em circulação;
* Dificuldade para identificar com qual aluno está determinado livro;
* Possibilidade de erros nos registros manuais;
* Dificuldade para manter as informações do acervo organizadas.

---

## 4. Objetivo do Sistema

O objetivo do **Acervo Digital** é oferecer uma solução para facilitar a organização e o gerenciamento dos livros da instituição, permitindo que alunos consultem o acervo e que bibliotecários controlem os livros, empréstimos e devoluções de forma digital.

---

# 5. Atores do Sistema

O sistema possui dois principais tipos de usuários:

### 👨‍🎓 Aluno

Usuário responsável por consultar o acervo e visualizar informações sobre os livros disponíveis.

### 📚 Bibliotecário

Usuário responsável pelo gerenciamento do acervo e pelo controle dos empréstimos e devoluções.

---

# 6. Requisitos Funcionais

Os requisitos funcionais descrevem as funcionalidades que o sistema deve oferecer.

### RF01 — Cadastro de alunos

O sistema deve permitir o cadastro de alunos para que possam utilizar a plataforma.

### RF02 — Cadastro de bibliotecários

O sistema deve permitir o cadastro de bibliotecários responsáveis pelo gerenciamento do acervo.

### RF03 — Cadastro de livros

O sistema deve permitir que bibliotecários cadastrem novos livros no acervo.

### RF04 — Edição de livros

O sistema deve permitir que bibliotecários alterem as informações cadastradas de um livro.

### RF05 — Remoção de livros

O sistema deve permitir que bibliotecários removam livros do acervo quando necessário.

### RF06 — Visualização do acervo

O sistema deve permitir que os usuários visualizem os livros cadastrados no acervo.

### RF07 — Consulta de disponibilidade

O sistema deve permitir identificar se determinado livro está disponível ou emprestado.

### RF08 — Busca de livros

O sistema deve permitir que os usuários encontrem livros por meio de uma funcionalidade de busca.

### RF09 — Registro de empréstimo

O sistema deve permitir que bibliotecários registrem o empréstimo de um livro para um aluno.

### RF10 — Registro de devolução

O sistema deve permitir que bibliotecários registrem a devolução de um livro.

### RF11 — Controle de livros em circulação

O sistema deve permitir que bibliotecários visualizem quais livros estão atualmente emprestados.

### RF12 — Identificação do responsável pelo empréstimo

O sistema deve permitir que o bibliotecário identifique qual aluno está com determinado livro emprestado.

### RF13 — Atualização da disponibilidade

O sistema deve atualizar a situação do livro após o registro de um empréstimo ou devolução.

---

# 7. Requisitos Não Funcionais

Os requisitos não funcionais definem características relacionadas à qualidade, segurança, usabilidade e funcionamento do sistema.

### RNF01 — Usabilidade

O sistema deve possuir uma interface simples, intuitiva e de fácil compreensão para os usuários.

### RNF02 — Acessibilidade

As informações e funcionalidades devem ser apresentadas de maneira clara e organizada, facilitando a utilização da plataforma.

### RNF03 — Segurança

O sistema deve controlar o acesso às funcionalidades de acordo com o tipo de usuário.

### RNF04 — Controle de acesso

Funcionalidades exclusivas dos bibliotecários devem estar disponíveis somente para usuários autorizados.

### RNF05 — Disponibilidade

O sistema deve ser acessível por meio de um navegador web.

### RNF06 — Desempenho

O sistema deve apresentar respostas adequadas durante as operações realizadas pelos usuários.

### RNF07 — Organização dos dados

As informações de alunos, bibliotecários, livros e empréstimos devem ser armazenadas de forma organizada.

### RNF08 — Manutenibilidade

O sistema deve possuir uma estrutura que permita futuras alterações, correções e adição de novas funcionalidades.

---

# 8. Regras de Negócio

As regras de negócio definem as condições que devem ser respeitadas durante a utilização do sistema.

### RN01 — Acesso do bibliotecário

Somente bibliotecários autorizados podem realizar operações de gerenciamento do acervo.

### RN02 — Cadastro de livros

O cadastro, edição e remoção de livros devem ser realizados por um bibliotecário.

### RN03 — Disponibilidade do livro

Um livro que esteja emprestado deve ser identificado como indisponível para um novo empréstimo.

### RN04 — Empréstimo

Um empréstimo deve estar associado a um livro e a um aluno.

### RN05 — Livro em circulação

Um livro só pode estar associado a um empréstimo ativo por vez.

### RN06 — Devolução

Ao registrar a devolução, o empréstimo deve ser encerrado e o livro deve voltar a ser considerado disponível.

### RN07 — Identificação do aluno

Todo livro em circulação deve possuir um aluno associado ao seu empréstimo.

### RN08 — Integridade das informações

As informações relacionadas aos livros, alunos e empréstimos devem permanecer consistentes durante as operações realizadas no sistema.

---

# 9. Casos de Uso

## 9.1 Caso de Uso — Aluno

O aluno pode utilizar o sistema para consultar o acervo.

### Funcionalidades

* Realizar cadastro;
* Acessar o sistema;
* Visualizar livros;
* Pesquisar livros;
* Consultar informações dos livros;
* Verificar disponibilidade dos livros.

### Fluxo principal

1. O aluno acessa o sistema.
2. O aluno realiza seu cadastro ou acesso.
3. O sistema apresenta o acervo disponível.
4. O aluno pode pesquisar ou selecionar um livro.
5. O sistema apresenta as informações do livro e sua disponibilidade.

---

## 9.2 Caso de Uso — Bibliotecário

O bibliotecário possui acesso às funcionalidades de gerenciamento do acervo.

### Funcionalidades

* Realizar cadastro;
* Acessar o sistema;
* Cadastrar livros;
* Editar livros;
* Remover livros;
* Consultar o acervo;
* Registrar empréstimos;
* Registrar devoluções;
* Consultar livros em circulação;
* Identificar o aluno responsável por um empréstimo.

### Fluxo de empréstimo

1. O bibliotecário acessa o sistema.
2. O bibliotecário seleciona a opção de empréstimo.
3. O sistema solicita as informações do aluno e do livro.
4. O bibliotecário registra o empréstimo.
5. O sistema associa o livro ao aluno.
6. O sistema atualiza a situação do livro para **emprestado**.

### Fluxo de devolução

1. O bibliotecário acessa o sistema.
2. O bibliotecário localiza o empréstimo ativo.
3. O bibliotecário registra a devolução.
4. O sistema encerra o empréstimo.
5. O sistema atualiza a situação do livro para **disponível**.

---

# 10. Diagramas de Caso de Uso

Os diagramas representam visualmente as interações entre os usuários e o sistema.

## 10.1 Diagrama Geral

![Diagrama de Caso de Uso Geral](./diagramas/caso-de-uso-geral.png)

## 10.2 Diagrama de Caso de Uso — Aluno

![Diagrama de Caso de Uso do Aluno](./diagramas/caso-de-uso-aluno.png)

## 10.3 Diagrama de Caso de Uso — Bibliotecário

![Diagrama de Caso de Uso do Bibliotecário](./diagramas/caso-de-uso-bibliotecario.png)

---

# 11. Tecnologias e Ferramentas

Durante o desenvolvimento do projeto foram utilizadas ferramentas de apoio à criação e organização da aplicação.

* **Google AI Studio:** utilizado como ferramenta de apoio ao desenvolvimento da aplicação;
* **GitHub:** utilizado para armazenamento, organização e versionamento do projeto;
* **Ferramentas de prototipação e design:** utilizadas para planejamento e desenvolvimento da interface.

---

# 12. Considerações Finais

O **Acervo Digital** busca solucionar uma necessidade identificada dentro da instituição, substituindo processos manuais por uma solução digital para gerenciamento do acervo.

A plataforma permite centralizar informações, facilitar a consulta dos livros e auxiliar os bibliotecários no controle de empréstimos e devoluções.

O projeto também possui possibilidade de evolução, permitindo a implementação de novas funcionalidades e melhorias conforme as necessidades da instituição.
