using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using ProductStoreAPI.Data;

namespace ProductStoreAPI.Data
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();

            optionsBuilder.UseMySql(
                "server=localhost;port=3306;database=ProductDB;user=root;",
                new MySqlServerVersion(new Version(8, 0, 23))
            );

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}