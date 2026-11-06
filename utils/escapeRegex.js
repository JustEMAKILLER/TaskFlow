// Convertir caracteres especiales para que una búsqueda no se interprete como código regex.
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = escapeRegex;
