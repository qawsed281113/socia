var builder = WebApplication.CreateBuilder(args);

// Configure Service Container

builder.Services
    .AddRazorPages()
    .AddRazorRuntimeCompilation();
builder.Services.AddControllers();

var app = builder.Build();

app.MapRazorPages();
app.MapControllers();

app.UseStaticFiles();

app.Run();
