export function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value || 0);
}

export function orderStatusLabel(status) {
  switch (status) {
    case 'new':
      return 'New';
    case 'contacted':
      return 'Contacted';
    case 'confirmed':
      return 'Confirmed';
    case 'completed':
      return 'Completed';
    default:
      return status || 'New';
  }
}
