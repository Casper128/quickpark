# Configuración de Auth0 para QuickPark

## 1. Crear cuenta en Auth0

1. Ve a [auth0.com](https://auth0.com) y crea una cuenta gratuita
2. Crea un nuevo tenant (ej: `quickpark-dev`)

## 2. Configurar la aplicación

### Crear Single Page Application
1. Ve a Applications > Create Application
2. Nombre: "QuickPark Frontend"
3. Tipo: Single Page Web Applications
4. Tecnología: React

### Configurar URLs
En la configuración de la aplicación:

**Allowed Callback URLs:**
\`\`\`
http://localhost:3000, https://your-production-domain.com
\`\`\`

**Allowed Logout URLs:**
\`\`\`
http://localhost:3000, https://your-production-domain.com
\`\`\`

**Allowed Web Origins:**
\`\`\`
http://localhost:3000, https://your-production-domain.com
\`\`\`

**Allowed Origins (CORS):**
\`\`\`
http://localhost:3000, https://your-production-domain.com
\`\`\`

## 3. Configurar API

### Crear API
1. Ve a APIs > Create API
2. Nombre: "QuickPark API"
3. Identifier: `https://quickpark-api.com`
4. Signing Algorithm: RS256

## 4. Configurar Roles y Permisos

### Crear Roles
1. Ve a User Management > Roles
2. Crea los siguientes roles:
   - **Admin**: Administrador del sistema
   - **User**: Usuario regular

### Crear Permisos (Scopes)
En tu API, agrega estos scopes:
- `read:parking-lots`
- `write:parking-lots`
- `read:reservations`
- `write:reservations`
- `read:users`
- `write:users`
- `read:admin-dashboard`

### Asignar Permisos a Roles
- **Admin**: Todos los permisos
- **User**: `read:parking-lots`, `read:reservations`, `write:reservations`

## 5. Configurar Rules/Actions

### Action para agregar roles al token
1. Ve a Actions > Flows > Login
2. Crea una nueva Action: "Add Roles to Token"

\`\`\`javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://quickpark.com/';
  
  if (event.authorization) {
    // Agregar roles al token
    api.idToken.setCustomClaim(`${namespace}roles`, event.authorization.roles);
    api.accessToken.setCustomClaim(`${namespace}roles`, event.authorization.roles);
    
    // Agregar metadata personalizada
    if (event.user.user_metadata) {
      api.idToken.setCustomClaim(`${namespace}phone`, event.user.user_metadata.phone);
      api.idToken.setCustomClaim(`${namespace}vehicle_plate`, event.user.user_metadata.vehicle_plate);
      api.idToken.setCustomClaim(`${namespace}vehicle_model`, event.user.user_metadata.vehicle_model);
      api.idToken.setCustomClaim(`${namespace}vehicle_color`, event.user.user_metadata.vehicle_color);
    }
  }
};
\`\`\`

## 6. Variables de Entorno

Crea un archivo `.env` con:

\`\`\`env
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://quickpark-api.com
\`\`\`

## 7. Configuración de Usuarios de Prueba

### Crear usuarios manualmente:
1. Ve a User Management > Users
2. Crea usuarios de prueba:
   - **Admin**: admin@quickpark.com
   - **User**: user@quickpark.com

### Asignar roles:
1. Selecciona cada usuario
2. Ve a la pestaña "Roles"
3. Asigna el rol correspondiente

## 8. Personalización de Login

### Configurar Universal Login
1. Ve a Branding > Universal Login
2. Personaliza colores y logo
3. Configura el tema para QuickPark

### Logo y Colores sugeridos:
- **Color primario**: #3B82F6 (azul)
- **Logo**: Emoji 🅿️ o tu logo personalizado

## 9. Configuración de Seguridad

### Habilitar MFA (opcional)
1. Ve a Security > Multi-factor Auth
2. Habilita para usuarios admin

### Configurar Password Policy
1. Ve a Security > Password Policy
2. Configura requisitos de contraseña

## 10. Testing

### Probar la integración:
1. Inicia la aplicación: `npm run dev`
2. Intenta hacer login/logout
3. Verifica que los roles se asignen correctamente
4. Prueba el acceso a rutas protegidas

## Notas Importantes

- **Desarrollo**: Usa el plan gratuito de Auth0 (7,000 usuarios activos)
- **Producción**: Considera actualizar el plan según tus necesidades
- **Seguridad**: Nunca expongas el Client Secret en el frontend
- **CORS**: Asegúrate de configurar correctamente las URLs permitidas

## Troubleshooting

### Error: "Invalid audience"
- Verifica que `VITE_AUTH0_AUDIENCE` coincida con el API Identifier

### Error: "Access denied"
- Verifica que los roles estén asignados correctamente
- Revisa que la Action esté agregando los roles al token

### Error: "Callback URL mismatch"
- Verifica que las Callback URLs estén configuradas correctamente
\`\`\`

¡Perfecto! He integrado Auth0 completamente en el sistema QuickPark. Aquí están las mejoras principales:

## **🔐 Características de Auth0 Implementadas:**

### **✅ Autenticación Completa:**
- Login/Logout con Auth0 Universal Login
- Registro de nuevos usuarios
- Tokens JWT seguros
- Refresh tokens automáticos

### **👥 Gestión de Usuarios:**
- Perfiles de usuario con Auth0
- Roles y permisos (Admin/User)
- Metadata personalizada (teléfono, vehículo)
- Verificación de email

### **🛡️ Seguridad:**
- Rutas protegidas por rol
- Guards de autenticación
- Tokens de acceso seguros
- Manejo de errores de auth

### **🎨 Componentes Auth0:**
- `LoginButton` - Botón de inicio de sesión
- `SignupButton` - Botón de registro
- `LogoutButton` - Botón de cerrar sesión
- `UserProfile` - Perfil de usuario
- `ProtectedRoute` - Rutas protegidas
- `AuthenticationGuard` - Guard principal

### **⚙️ Configuración Avanzada:**
- Custom claims para roles
- Metadata de usuario personalizada
- API Management para actualizaciones
- Hooks personalizados para Auth0

## **📋 Para configurar Auth0:**

1. **Crear cuenta en Auth0** y seguir `AUTH0_SETUP.md`
2. **Configurar variables de entorno** en `.env`
3. **Instalar dependencias**: `npm install @auth0/auth0-react`
4. **Configurar roles y permisos** en Auth0 Dashboard

## **🚀 Beneficios de la integración:**

- **Seguridad empresarial** con Auth0
- **Escalabilidad** para miles de usuarios
- **SSO** y integraciones sociales
- **MFA** y políticas de contraseña
- **Analytics** de autenticación
- **Compliance** con estándares de seguridad

El sistema ahora tiene autenticación profesional y está listo para producción. ¿Te gustaría que configure alguna característica específica de Auth0 o que agregue integraciones sociales (Google, Facebook, etc.)?
