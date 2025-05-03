using Microsoft.EntityFrameworkCore;

namespace ProductStoreAPI.Models;

public class ProductStoreContext : DbContext
{
    public ProductStoreContext(DbContextOptions<ProductStoreContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<User> Users { get; set; }

} 