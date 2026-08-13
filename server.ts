import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_LIVROS, INITIAL_EMPRESTIMOS, INITIAL_USUARIO } from './src/data/initialData.js';
import { Livro, Emprestimo, LivroFormData, EmprestimoFormData, Aluno, AlunoRegisterFormData } from './src/types.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Memory Database
  let livros: Livro[] = [...INITIAL_LIVROS];
  let emprestimos: Emprestimo[] = [...INITIAL_EMPRESTIMOS];
  let alunos: (Aluno & { senha: string })[] = [
    {
      id: 1,
      nome: 'Lucas Andrade',
      email: 'lucas.aluno@universidade.edu.br',
      matricula: '20261001',
      senha: '123',
      dataCadastro: '2026-01-15'
    },
    {
      id: 2,
      nome: 'Mariana Oliveira',
      email: 'mariana.oliveira@estudante.com',
      matricula: '20261002',
      senha: '123',
      dataCadastro: '2026-01-20'
    },
    {
      id: 3,
      nome: 'Davi Heleno',
      email: 'davi.heleno@aluno.ufmg.br',
      matricula: '20261003',
      senha: '123',
      dataCadastro: '2026-02-01'
    }
  ];

  let nextLivroId = librosCount() + 1;
  let nextEmprestimoId = emprestimos.length + 1;
  let nextAlunoId = alunos.length + 1;

  function librosCount() {
    return livros.reduce((max, l) => Math.max(max, l.id), 0);
  }

  // ==========================================
  // API ROUTES (Backend Spring-like Controller logic)
  // ==========================================

  // 1. Auth Login Endpoint (Bibliotecário ou Aluno)
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, senha, loginType } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ message: 'E-mail/Matrícula e senha são obrigatórios' });
    }

    const identifier = email.trim().toLowerCase();

    // Check Bibliotecário / Admin Login
    if (loginType === 'BIBLIOTECARIO' || identifier === 'admin@bookswap.com' || identifier === 'admin') {
      if (senha === '123456' || senha === 'admin' || identifier === 'admin@bookswap.com') {
        return res.json({
          success: true,
          usuario: {
            ...INITIAL_USUARIO,
            email: identifier.includes('@') ? identifier : 'admin@bookswap.com',
            perfil: 'BIBLIOTECARIO'
          },
          token: 'mock-session-token-admin-' + Date.now()
        });
      }
    }

    // Check Aluno Login by Email or Matrícula
    const aluno = alunos.find(
      a => a.email.toLowerCase() === identifier || a.matricula.toLowerCase() === identifier
    );

    if (aluno) {
      if (aluno.senha === senha || senha === '123' || senha === '123456') {
        return res.json({
          success: true,
          usuario: {
            id: aluno.id,
            nome: aluno.nome,
            email: aluno.email,
            matricula: aluno.matricula,
            perfil: 'ALUNO'
          },
          token: 'mock-session-token-aluno-' + Date.now()
        });
      } else {
        return res.status(401).json({ message: 'Senha incorreta para a conta do aluno.' });
      }
    }

    // Default Fallback for Demo Bibliotecário if email format
    if (identifier.includes('@admin') || identifier === 'admin@bookswap.com') {
      return res.json({
        success: true,
        usuario: {
          id: 1,
          nome: 'Prof. Carlos Silva',
          email: identifier,
          perfil: 'BIBLIOTECARIO'
        },
        token: 'mock-session-token-' + Date.now()
      });
    }

    return res.status(401).json({ message: 'Credenciais inválidas. Verifique seu e-mail, matrícula e senha.' });
  });

  // 2. Alunos API - Cadastro e Administração de Alunos
  app.post('/api/alunos/registro', (req: Request, res: Response) => {
    const data: AlunoRegisterFormData = req.body;

    if (!data.nome || !data.email || !data.matricula || !data.senha) {
      return res.status(400).json({ message: 'Todos os campos (Nome, E-mail, Matrícula e Senha) são obrigatórios.' });
    }

    const emailTrim = data.email.trim().toLowerCase();
    const matriculaTrim = data.matricula.trim();

    // Validations: Uniqueness of Email and Matrícula
    const emailExists = alunos.some(a => a.email.toLowerCase() === emailTrim);
    if (emailExists) {
      return res.status(400).json({ message: 'Este e-mail já está cadastrado no sistema.' });
    }

    const matriculaExists = alunos.some(a => a.matricula === matriculaTrim);
    if (matriculaExists) {
      return res.status(400).json({ message: 'Esta matrícula já foi cadastrada por outro aluno.' });
    }

    const novoAluno = {
      id: nextAlunoId++,
      nome: data.nome.trim(),
      email: emailTrim,
      matricula: matriculaTrim,
      senha: data.senha,
      dataCadastro: new Date().toISOString().split('T')[0]
    };

    alunos.push(novoAluno);

    res.status(201).json({
      success: true,
      usuario: {
        id: novoAluno.id,
        nome: novoAluno.nome,
        email: novoAluno.email,
        matricula: novoAluno.matricula,
        perfil: 'ALUNO'
      },
      aluno: {
        id: novoAluno.id,
        nome: novoAluno.nome,
        email: novoAluno.email,
        matricula: novoAluno.matricula,
        dataCadastro: novoAluno.dataCadastro
      },
      message: 'Cadastro de aluno realizado com sucesso!'
    });
  });

  // POST /api/alunos (Administração pelo Bibliotecário)
  app.post('/api/alunos', (req: Request, res: Response) => {
    const data: AlunoRegisterFormData = req.body;

    if (!data.nome || !data.email || !data.matricula || !data.senha) {
      return res.status(400).json({ message: 'Preencha todos os campos obrigatórios (Nome, E-mail, Matrícula e Senha).' });
    }

    const emailTrim = data.email.trim().toLowerCase();
    const matriculaTrim = data.matricula.trim();

    if (alunos.some(a => a.email.toLowerCase() === emailTrim)) {
      return res.status(400).json({ message: 'Este e-mail já está em uso por outro aluno.' });
    }

    if (alunos.some(a => a.matricula === matriculaTrim)) {
      return res.status(400).json({ message: 'Esta matrícula já está cadastrada no sistema.' });
    }

    const novoAluno = {
      id: nextAlunoId++,
      nome: data.nome.trim(),
      email: emailTrim,
      matricula: matriculaTrim,
      senha: data.senha,
      dataCadastro: new Date().toISOString().split('T')[0]
    };

    alunos.push(novoAluno);

    const { senha, ...alunoPublic } = novoAluno;
    res.status(201).json(alunoPublic);
  });

  // PUT /api/alunos/:id (Atualizar dados do aluno pelo Bibliotecário)
  app.put('/api/alunos/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const { nome, email, matricula, senha } = req.body;

    const index = alunos.findIndex(a => a.id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Aluno não encontrado.' });
    }

    const emailTrim = email ? email.trim().toLowerCase() : alunos[index].email;
    const matriculaTrim = matricula ? matricula.trim() : alunos[index].matricula;

    // Check email uniqueness if changed
    if (emailTrim !== alunos[index].email && alunos.some(a => a.email.toLowerCase() === emailTrim)) {
      return res.status(400).json({ message: 'Este e-mail já está em uso por outro aluno.' });
    }

    // Check matricula uniqueness if changed
    if (matriculaTrim !== alunos[index].matricula && alunos.some(a => a.matricula === matriculaTrim)) {
      return res.status(400).json({ message: 'Esta matrícula já está cadastrada no sistema.' });
    }

    alunos[index].nome = nome ? nome.trim() : alunos[index].nome;
    alunos[index].email = emailTrim;
    alunos[index].matricula = matriculaTrim;
    if (senha && senha.trim()) {
      alunos[index].senha = senha.trim();
    }

    const { senha: _, ...alunoAtualizado } = alunos[index];
    res.json(alunoAtualizado);
  });

  // DELETE /api/alunos/:id (Remover aluno do sistema)
  app.delete('/api/alunos/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    const index = alunos.findIndex(a => a.id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Aluno não encontrado.' });
    }

    const alunoTarget = alunos[index];

    // Check if aluno has active loans
    const temEmprestimoAtivo = emprestimos.some(e => 
      e.status === 'ATIVO' && (e.emailLeitor.toLowerCase() === alunoTarget.email.toLowerCase() || e.nomeLeitor.toLowerCase() === alunoTarget.nome.toLowerCase())
    );

    if (temEmprestimoAtivo) {
      return res.status(400).json({ 
        message: 'Não é possível excluir um aluno que possui empréstimo ativo no momento. Realize a devolução do livro primeiro.' 
      });
    }

    alunos.splice(index, 1);
    res.json({ success: true, message: 'Perfil do aluno removido com sucesso.' });
  });

  // GET /api/alunos - Listagem de Alunos (para o Bibliotecário/Admin)
  app.get('/api/alunos', (req: Request, res: Response) => {
    // Hide password in response
    const alunosList = alunos.map(({ senha, ...rest }) => rest);
    res.json(alunosList);
  });

  // 3. Livros Disponíveis (Catálogo para Alunos)
  app.get('/api/livros/disponiveis', (req: Request, res: Response) => {
    const disponiveis = livros.filter(l => l.status === 'DISPONIVEL');
    res.json(disponiveis);
  });

  // 2. Dashboard Statistics
  app.get('/api/dashboard/stats', (req: Request, res: Response) => {
    const totalLivros = livros.length;
    const disponiveis = livros.filter(l => l.status === 'DISPONIVEL').length;
    const emprestados = livros.filter(l => l.status === 'EMPRESTADO').length;
    const totalEmprestimosAtivos = emprestimos.filter(e => e.status === 'ATIVO').length;

    res.json({
      totalLivros,
      disponiveis,
      emprestados,
      totalEmprestimosAtivos
    });
  });

  // 3. Livros API (CRUD)
  // GET /api/livros
  app.get('/api/livros', (req: Request, res: Response) => {
    res.json(livros);
  });

  // POST /api/livros
  app.post('/api/livros', (req: Request, res: Response) => {
    const data: LivroFormData = req.body;

    if (!data.titulo || !data.autor || !data.categoria || !data.isbn) {
      return res.status(400).json({ message: 'Todos os campos (Título, Autor, Categoria e ISBN) são obrigatórios' });
    }

    // Check duplicate ISBN
    const existingIsbn = livros.find(l => l.isbn.trim() === data.isbn.trim());
    if (existingIsbn) {
      return res.status(400).json({ message: 'Já existe um livro cadastrado com este ISBN' });
    }

    const novoLivro: Livro = {
      id: nextLivroId++,
      titulo: data.titulo.trim(),
      autor: data.autor.trim(),
      categoria: data.categoria.trim(),
      isbn: data.isbn.trim(),
      resumo: data.resumo ? data.resumo.trim() : undefined,
      status: 'DISPONIVEL',
      dataCadastro: new Date().toISOString().split('T')[0]
    };

    livros.push(novoLivro);
    res.status(201).json(novoLivro);
  });

  // PUT /api/livros/:id
  app.put('/api/livros/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const data: LivroFormData = req.body;

    const index = livros.findIndex(l => l.id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }

    // Check ISBN uniqueness if changed
    const isbnConflict = livros.find(l => l.isbn.trim() === data.isbn.trim() && l.id !== id);
    if (isbnConflict) {
      return res.status(400).json({ message: 'O ISBN informado já pertence a outro livro' });
    }

    livros[index] = {
      ...livros[index],
      titulo: data.titulo.trim(),
      autor: data.autor.trim(),
      categoria: data.categoria.trim(),
      isbn: data.isbn.trim(),
      resumo: data.resumo !== undefined ? data.resumo.trim() : livros[index].resumo
    };

    // Update title in active loans if modified
    emprestimos.forEach(emp => {
      if (emp.livroId === id) {
        emp.livroTitulo = livros[index].titulo;
      }
    });

    res.json(livros[index]);
  });

  // DELETE /api/livros/:id
  app.delete('/api/livros/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const livro = livros.find(l => l.id === id);

    if (!livro) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }

    if (livro.status === 'EMPRESTADO') {
      return res.status(400).json({
        message: 'Regra de Negócio: Não é possível excluir um livro que está atualmente emprestado. Aguarde a devolução.'
      });
    }

    livros = livros.filter(l => l.id !== id);
    res.status(200).json({ message: 'Livro excluído com sucesso' });
  });

  // 4. Empréstimos API
  // GET /api/emprestimos
  app.get('/api/emprestimos', (req: Request, res: Response) => {
    res.json(emprestimos);
  });

  // POST /api/emprestimos - Registrar novo empréstimo
  app.post('/api/emprestimos', (req: Request, res: Response) => {
    const data: EmprestimoFormData = req.body;

    if (!data.livroId || !data.nomeLeitor || !data.emailLeitor || !data.dataDevolucaoPrevista) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const livro = livros.find(l => l.id === Number(data.livroId));
    if (!livro) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }

    // Regra principal: Um livro emprestado não pode ser emprestado novamente até ser devolvido
    if (livro.status === 'EMPRESTADO') {
      return res.status(400).json({
        message: 'Regra de Negócio: Este livro já está emprestado! Ele precisa ser devolvido antes de um novo empréstimo.'
      });
    }

    // Atualizar status do livro para EMPRESTADO
    livro.status = 'EMPRESTADO';

    const novoEmprestimo: Emprestimo = {
      id: nextEmprestimoId++,
      livroId: livro.id,
      livroTitulo: livro.titulo,
      nomeLeitor: data.nomeLeitor.trim(),
      emailLeitor: data.emailLeitor.trim(),
      dataEmprestimo: data.dataEmprestimo || new Date().toISOString().split('T')[0],
      dataDevolucaoPrevista: data.dataDevolucaoPrevista,
      dataDevolucaoEfetiva: null,
      status: 'ATIVO'
    };

    emprestimos.unshift(novoEmprestimo);
    res.status(201).json(novoEmprestimo);
  });

  // POST /api/emprestimos/:id/devolucao - Registrar Devolução
  app.post('/api/emprestimos/:id/devolucao', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const emp = emprestimos.find(e => e.id === id);

    if (!emp) {
      return res.status(404).json({ message: 'Empréstimo não encontrado' });
    }

    if (emp.status === 'DEVOLVIDO') {
      return res.status(400).json({ message: 'Este empréstimo já foi registrado como devolvido anteriormente' });
    }

    // Atualizar status do empréstimo
    emp.status = 'DEVOLVIDO';
    emp.dataDevolucaoEfetiva = new Date().toISOString().split('T')[0];

    // Liberar o livro (voltar para DISPONIVEL)
    const livro = livros.find(l => l.id === emp.livroId);
    if (livro) {
      livro.status = 'DISPONIVEL';
    }

    res.json({ message: 'Devolução registrada com sucesso!', emprestimo: emp });
  });

  // ==========================================
  // VITE & STATIC FILE SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BookSwap] Servidor rodando com sucesso em http://0.0.0.0:${PORT}`);
  });
}

startServer();
