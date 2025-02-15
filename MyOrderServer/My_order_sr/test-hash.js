import bcrypt from 'bcryptjs';

bcrypt.hash('admin123', 10, (err, hash) => {
  if (err) {
    console.error('❌ Error al generar hash:', err);
  } else {
    console.log('🔑 Hash generado:', hash);
  }
});

