using Microsoft.EntityFrameworkCore;
using ProductStoreAPI.Models;
using Microsoft.Extensions.Configuration;

namespace ProductStoreAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public AppDbContext() { }

        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }
    }
}