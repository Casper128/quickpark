dotnet ef dbcontext scaffold \
"Host=localhost;Database=parqueadero_db;Username=admin;Password=admin123" \
Npgsql.EntityFrameworkCore.PostgreSQL \
--context DbContext \
--output-dir Models \
--force