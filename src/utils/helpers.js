export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getGradeColor = (grade) => {
  const colors = {
    'A+': 'text-green-600 bg-green-100',
    'A': 'text-green-600 bg-green-100',
    'B+': 'text-blue-600 bg-blue-100',
    'B': 'text-blue-600 bg-blue-100',
    'C+': 'text-yellow-600 bg-yellow-100',
    'C': 'text-yellow-600 bg-yellow-100',
    'D': 'text-orange-600 bg-orange-100',
    'F': 'text-red-600 bg-red-100',
  };
  return colors[grade] || 'text-gray-600 bg-gray-100';
};

export const getPercentageColor = (percentage) => {
  if (percentage >= 90) return 'text-green-600';
  if (percentage >= 80) return 'text-blue-600';
  if (percentage >= 70) return 'text-yellow-600';
  if (percentage >= 60) return 'text-orange-600';
  return 'text-red-600';
};

export const calculateGrade = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C+';
  if (percentage >= 40) return 'C';
  if (percentage >= 35) return 'D';
  return 'F';
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getRoleColor = (role) => {
  const colors = {
    admin: 'text-purple-600 bg-purple-100',
    teacher: 'text-blue-600 bg-blue-100',
    student: 'text-green-600 bg-green-100',
  };
  return colors[role] || 'text-gray-600 bg-gray-100';
};

export const getTestTypeColor = (type) => {
  const colors = {
    quiz: 'text-blue-600 bg-blue-100',
    midterm: 'text-yellow-600 bg-yellow-100',
    final: 'text-red-600 bg-red-100',
    assignment: 'text-green-600 bg-green-100',
    practical: 'text-purple-600 bg-purple-100',
  };
  return colors[type] || 'text-gray-600 bg-gray-100';
};

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    let aVal = a[key];
    let bVal = b[key];

    // Handle nested properties
    if (key.includes('.')) {
      const keys = key.split('.');
      aVal = keys.reduce((obj, k) => obj?.[k], a);
      bVal = keys.reduce((obj, k) => obj?.[k], b);
    }

    // Handle null/undefined values
    if (aVal == null) aVal = '';
    if (bVal == null) bVal = '';

    // Handle different data types
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (direction === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });
};

export const filterBy = (array, searchTerm, searchFields) => {
  if (!searchTerm) return array;

  const lowercaseSearch = searchTerm.toLowerCase();

  return array.filter(item => {
    return searchFields.some(field => {
      let value = item[field];

      // Handle nested properties
      if (field.includes('.')) {
        const keys = field.split('.');
        value = keys.reduce((obj, k) => obj?.[k], item);
      }

      if (value == null) return false;

      return String(value).toLowerCase().includes(lowercaseSearch);
    });
  });
};

export const generateChartColors = (count) => {
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316',
    '#ec4899', '#6366f1', '#14b8a6', '#eab308'
  ];

  if (count <= colors.length) {
    return colors.slice(0, count);
  }

  // Generate additional colors if needed
  const additionalColors = [];
  for (let i = colors.length; i < count; i++) {
    const hue = (i * 137.508) % 360; // Golden angle approximation
    additionalColors.push(`hsl(${hue}, 70%, 50%)`);
  }

  return [...colors, ...additionalColors];
};

export const exportToCSV = (data, filename) => {
  if (!data || !data.length) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      // Escape commas and quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
