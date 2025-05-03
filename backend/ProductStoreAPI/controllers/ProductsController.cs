using Microsoft.AspNetCore.Mvc;
using ProductStoreAPI.Models;
using ProductStoreAPI.Data;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    // קבלת כל המוצרים - פתוח לכולם
    [HttpGet]
    [AllowAnonymous]
    public IActionResult GetAll()
    {
        return Ok(_context.Products.ToList());
    }

    // קבלת מוצר לפי מזהה - פתוח לכולם
    [HttpGet("{id}")]
    [AllowAnonymous]
    public IActionResult GetById(int id)
    {
        var product = _context.Products.Find(id);
        if (product == null)
            return NotFound();

        return Ok(product);
    }

    // מחיקת מוצר לפי מזהה - רק למנהל
    [HttpDelete("{id}")]
    [Authorize(Policy = "Admin")]
    public IActionResult Delete(int id)
    {
        var product = _context.Products.Find(id);
        if (product == null)
            return NotFound();

        _context.Products.Remove(product);
        _context.SaveChanges();
        return NoContent();
    }

    // יצירת מוצר חדש - רק למנהל
    [HttpPost]
    [Authorize(Policy = "Admin")]
    public IActionResult Create([FromBody] Product product)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        _context.Products.Add(product);
        _context.SaveChanges();

        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    // עדכון מוצר - רק למנהל
    [HttpPut("{id}")]
    [Authorize(Policy = "Admin")]
    public IActionResult Update(int id, Product updatedProduct)
    {
        var product = _context.Products.Find(id);
        if (product == null)
            return NotFound();

        product.Name = updatedProduct.Name;
        product.Description = updatedProduct.Description;
        product.Price = updatedProduct.Price;
        product.Stock = updatedProduct.Stock;

        _context.SaveChanges();
        return NoContent();
    }
}
