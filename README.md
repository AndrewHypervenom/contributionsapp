# Visualizador 3D de Contribuciones de GitHub
Una aplicación React que crea una visualización 3D interactiva de tu historial de contribuciones en GitHub. Explora tu gráfico de contribuciones como un paisaje tridimensional donde la altura de cada barra representa tu nivel de actividad diaria.

Demo en Vivo: [contributionsapp](https://contributionsapp.vercel.app "contributionsapp")



https://github.com/user-attachments/assets/b00a5e94-8694-454f-b99c-9a9a521506e9



### Características

- Visualización 3D de datos de contribuciones de GitHub
- Controles de cámara interactivos para explorar la visualización
- Niveles de contribución codificados por color
- Estadísticas de contribución incluyendo:
 - Total de contribuciones
 - Racha más larga
 - Racha actual
 - Día más activo
- Diseño responsivo con advertencia para visualización óptima en escritorio
- Autenticación segura usando Tokens de Acceso Personal de GitHub

------------



### Stack Tecnológico

- React
- Three.js con React Three Fiber
- D3.js para escalado de datos
- Tailwind CSS para estilos
- Vite como herramienta de construcción

------------


### Configuración

1. Clona el repositorio:

```bash
git clone https://github.com/AndrewHypervenom/contributionsapp.git
```
```bash
cd contributionsapp
```

2. Instala las dependencias:

```bash
npm install
```

3. Inicia el servidor de desarrollo:

```bash
npm run dev
```

------------


### Uso

1. Genera un Token de Acceso Personal de GitHub:

- Ve a Configuración de GitHub → Configuración de desarrollador → Tokens de acceso personal → Tokens (classic)
- Genera un nuevo token con alcance read:user o repo
- Copia el token

2. Ingresa tu nombre de usuario de GitHub y el token generado en la aplicación
3. Usa los controles del mouse/táctiles para explorar la visualización 3D:

- Clic izquierdo + arrastrar para rotar
- Clic derecho + arrastrar para desplazar
- Scroll para zoom

------------


### Desarrollo

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Compila para producción
- `npm run preview` - Vista previa de compilación de producción
- `npm run lint` - Ejecuta ESLint

------------


### Contribuir
¡Las contribuciones son bienvenidas! No dudes en enviar un Pull Request. Para cambios importantes, por favor abre primero un issue para discutir qué te gustaría cambiar.

------------


Hecho con ❤️ para entusiastas de la productividad

### 📞 Contacto

GitHub: @AndrewHypervenom

Email: andrew.fajardo@hotmail.com
