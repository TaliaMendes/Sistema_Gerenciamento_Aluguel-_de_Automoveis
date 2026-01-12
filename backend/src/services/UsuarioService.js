import bcrypt from 'bcryptjs';
import * as UsuarioRepository from '../repositories/UsuarioRepository.js';

function validarTexto(campo, valor) {
  if (!valor || typeof valor !== 'string' || !valor.trim()) {
    throw new Error(`${campo} é obrigatório.`);
  }
  return valor.trim();
}

function validarEmail(email) {
  const e = validarTexto('email', email).toLowerCase();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  if (!valid) throw new Error('email inválido.');
  return e;
}

function validarSenha(senha) {
  const s = validarTexto('senha', senha);
  if (s.length < 4) throw new Error('A senha deve ter pelo menos 4 caracteres.');
  return s;
}

export function criarCliente({ nome, email, senha }) {
  const nomeValidado = validarTexto('nome', nome);
  const emailValidado = validarEmail(email);
  const senhaValidada = validarSenha(senha);

  const existente = UsuarioRepository.buscarPorEmail(emailValidado);
  if (existente) throw new Error('Este endereço de e-mail já está registado.');

  const senha_hash = bcrypt.hashSync(senhaValidada, 10);

  const id = UsuarioRepository.criarUsuario({
    nome: nomeValidado,
    email: emailValidado,
    senha_hash,
    tipo: 'CLIENTE'
  });

  return { id, nome: nomeValidado, email: emailValidado, tipo: 'CLIENTE' };
}

export function buscarUsuario(id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) throw new Error('id inválido.');

  const usuario = UsuarioRepository.buscarPorId(n);
  if (!usuario) throw new Error('Usuário não encontrado.');

  return usuario;
}

export function login({ email, senha }) {
  const emailValidado = validarEmail(email);
  const senhaValidada = validarSenha(senha);

  const usuario = UsuarioRepository.buscarPorEmail(emailValidado);
  if (!usuario) throw new Error('Credenciais inválidas.');

  const autenticacao = bcrypt.compareSync(senhaValidada, usuario.senha_hash);
  if (!autenticacao) throw new Error('Credenciais inválidas.');

  return { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo };
}
