using CMSC447_T7.database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace CMSC447_T7.backend.Helpers
{
    public class DbHelper
    {
        //Inject DbContext by allowing access to global objects for services (connection to the database into the backend).
        public static IServiceCollection AddDatabase(IServiceCollection services, string? connection)
        {
            ArgumentNullException.ThrowIfNull(services);
            ArgumentNullException.ThrowIfNull(connection);
            return services.AddDbContext<DatabaseContext>(options => options.UseNpgsql(connection));
        }
        //Update / Create Database
        public static void CreateOrUpdateDatabase(WebApplication? app)
        {
            ArgumentNullException.ThrowIfNull(app);
            using var scope = app.Services.CreateScope();
            var services = scope.ServiceProvider;
            try
            {
                var dbContext = services.GetRequiredService<DatabaseContext>();
                dbContext.Database.Migrate();
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "An error occurred while migrating the database. ");
            }
        }
    }
}