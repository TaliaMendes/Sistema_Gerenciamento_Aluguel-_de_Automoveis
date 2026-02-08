import createError from 'http-errors';

export default function adminAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Basic ')) {
    return next(createError(401, 'Acesso restrito. Informe credenciais de administrador.'));
  }

  const base64 = header.replace('Basic ', '').trim();
  let decoded = '';
  try {
    decoded = Buffer.from(base64, 'base64').toString('utf8');
  } catch {
    return next(createError(401, 'Credenciais inválidas.'));
  }

  const [user, pass] = decoded.split(':');

  const adminUser = process.env.ADMIN_USER ;
  const adminPass = process.env.ADMIN_PASS ;

  if (user !== adminUser || pass !== adminPass) {
    return next(createError(403, 'Credenciais de administrador incorretas.'));
  }

  return next();
}
