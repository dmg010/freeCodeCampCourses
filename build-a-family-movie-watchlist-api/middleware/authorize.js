export function authorizeModification(req, res, next) {
  const role = req.user?.role;
  const userId = String(req.user?.id ?? '');
  const paramId = String(req.params.userId ?? '');

  if (role === 'parent') return next();
  if (role === 'child' && paramId === userId) return next();

  return res.status(403).json({ error: 'Access denied' });
}