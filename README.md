# 🙏 Ammi Legacy - App de Asistencia

App web interactiva para gestionar la asistencia en la ruta discipular Ammi Legacy (CRECE y EFI).

## ✨ Características

- 📝 **Registro de Asistencia**: Marca asistencia por estudiante y semana
- 📊 **Reportes por Ciclo**: Ve quién puede graduarse en cada ciclo
- 📈 **Estadísticas Generales**: Dashboard con datos de todos los ciclos
- 🆕 **Crear Ciclos**: Agrega nuevos ciclos sobre la marcha
- 💾 **Descargar Datos**: Exporta la información en JSON
- 📱 **Responsivo**: Funciona perfectamente en celular, tablet y computadora

## 🚀 Despliegue en Vercel (GRATIS)

### Opción A: La Más Fácil (Recomendada)

1. **Crea cuenta en GitHub**: https://github.com/signup
2. **Crea cuenta en Vercel**: https://vercel.com/signup
3. **Conecta Vercel con GitHub**:
   - En Vercel, haz clic en "Import Git Repository"
   - Selecciona el repositorio `ammi-legacy-app`
   - Vercel desplegará automáticamente
4. **¡Listo!** Recibirás un link como: `https://ammi-legacy-app.vercel.app`

### Opción B: Usando GitHub (Paso a Paso Manual)

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/tu_usuario/ammi-legacy-app.git
   cd ammi-legacy-app
   ```

2. **Instala dependencias**:
   ```bash
   npm install
   ```

3. **Sube a GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

4. **Desplega en Vercel**:
   - Ve a https://vercel.com/import
   - Conecta tu repositorio de GitHub
   - Vercel hará el resto automáticamente

## 📊 Cómo Usar la App

### Para el Maestro/Coordinador:

1. **Selecciona Ruta**: CRECE o EFI
2. **Selecciona Ciclo**: Elige el ciclo específico
3. **Registra Asistencia**:
   - ○ = Sin marcar
   - ✓ = Asistió (presencial o virtual)
   - ✗ = No asistió
4. **Agrega Estudiantes**: Escribe el nombre y presiona "Agregar"
5. **Ve Reportes**: Mira quién puede graduarse

### Requisitos de Graduación:
- **CRECE**: Todas las 5 semanas
- **EFI**: Todas las 14 semanas

## 💰 Costo

**¡TOTALMENTE GRATIS!**

- GitHub: Gratis ✅
- Vercel: Gratis ✅
- App: Gratis ✅

No necesitas tarjeta de crédito. Vercel ofrece 100GB de almacenamiento y ancho de banda ilimitado para aplicaciones como esta.

## 📱 Acceso desde el Celular

Una vez desplegada, puedes:
1. Compartir el link con tus maestros
2. Ellos entran desde cualquier navegador (Chrome, Safari, etc.)
3. Funciona perfectamente en celular y tablet
4. No necesitan instalar nada

## 🔄 Actualizaciones

Si cambias algo en el código:
1. Sube los cambios a GitHub
2. Vercel se actualiza automáticamente
3. ¡Sin necesidad de hacer nada más!

## 📧 Preguntas Frecuentes

**P: ¿Dónde se guardan los datos?**
R: En el navegador de cada dispositivo (localStorage). Descargar regularmente para respaldos.

**P: ¿Puedo darle acceso a múltiples maestros?**
R: Sí, solo comparte el link. Cada uno verá los mismos datos en tiempo real.

**P: ¿Qué pasa si el navegador se cierra?**
R: Los datos se mantienen guardados. Cada vez que entres, verás toda la información.

**P: ¿Puedo usar esto sin internet?**
R: Después de cargar una vez, funciona offline. Los cambios se sincronizan cuando vuelve la conexión.

## 🎯 Próximas Mejoras Posibles

- Sincronización en la nube
- Sistema de contraseñas
- Reportes en PDF
- Exportar a Excel
- Notificaciones por WhatsApp

---

**Hecho con ❤️ para Ammi Legacy**
