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

    // get all prodects
    [HttpGet]
    [AllowAnonymous]
    public IActionResult GetAll()
    {
        return Ok(_context.Products.ToList());
    }

    // get product by ID
    [HttpGet("{id}")]
    [AllowAnonymous]
    public IActionResult GetById(int id)
    {
        var product = _context.Products.Find(id);
        if (product == null)
            return NotFound();

        return Ok(product);
    }

    // del product
    [HttpDelete("{id}")]
    [Authorize(Policy = "Admin")]
    public IActionResult Delete(int id)
    {
        var product = _context.Products.Find(id);
        if (product == null)
        {
          return NotFound();
        }

        _context.Products.Remove(product);
        _context.SaveChanges();
        return NoContent();
    }


    // create new product
    [HttpPost]
    [Authorize(Policy = "Admin")]
    public IActionResult Create([FromBody] Product product)
    {
        if (!ModelState.IsValid)
        {
          return BadRequest(ModelState);
        }

        // defult
        if (string.IsNullOrWhiteSpace(product.ImageUrl))
        {
            product.ImageUrl = "https://islandpress.org/files/default_book_cover_2015.jpg";
        }
        _context.Products.Add(product);
        _context.SaveChanges();

        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    // update product
    [HttpPut("{id}")]
    [Authorize(Policy = "Admin")]
    public IActionResult Update(int id, [FromBody] Product updatedProduct)
    {
        var product = _context.Products.Find(id);
        if (product == null)
        {
          return NotFound();
        }

        product.Name = updatedProduct.Name;
        product.Description = updatedProduct.Description;
        product.Price = updatedProduct.Price;
        product.Stock = updatedProduct.Stock;
        product.ImageUrl = updatedProduct.ImageUrl;

        _context.SaveChanges();
        return NoContent();
    }
}
