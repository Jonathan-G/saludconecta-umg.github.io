// Servidor local mínimo para ver el sitio (sin dependencias). Soporta "Range" para que el video se pueda adelantar.
// Uso: node servir.js [puerto]      (por defecto 8080)
const http = require("http");
const fs = require("fs");
const path = require("path");

const raiz = __dirname;
const puerto = Number(process.argv[2] || process.env.PORT || 8080);
const tipos = {
    ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp", ".ico": "image/x-icon",
    ".mp4": "video/mp4", ".webm": "video/webm", ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".txt": "text/plain; charset=utf-8"
};

const servidor = http.createServer((req, res) => {
    let ruta;
    try { ruta = decodeURIComponent(new URL(req.url, "http://localhost").pathname); }
    catch { res.writeHead(400); return res.end("Solicitud inválida"); }
    if (ruta.endsWith("/")) ruta += "index.html";
    const archivo = path.normalize(path.join(raiz, ruta));
    if (!archivo.startsWith(raiz)) { res.writeHead(403); return res.end("Prohibido"); }

    fs.stat(archivo, (err, info) => {
        if (err || !info.isFile()) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            return res.end("No encontrado");
        }
        const tipo = tipos[path.extname(archivo).toLowerCase()] || "application/octet-stream";
        const cabeceras = { "Content-Type": tipo, "Accept-Ranges": "bytes", "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff" };
        const rango = /bytes=(\d*)-(\d*)/.exec(req.headers.range || "");
        if (rango && (rango[1] || rango[2])) {
            let inicio = rango[1] ? parseInt(rango[1], 10) : info.size - parseInt(rango[2], 10);
            let fin = rango[1] && rango[2] ? parseInt(rango[2], 10) : info.size - 1;
            if (inicio >= info.size || fin >= info.size || inicio > fin) {
                res.writeHead(416, { "Content-Range": `bytes */${info.size}` });
                return res.end();
            }
            res.writeHead(206, { ...cabeceras, "Content-Range": `bytes ${inicio}-${fin}/${info.size}`, "Content-Length": fin - inicio + 1 });
            return fs.createReadStream(archivo, { start: inicio, end: fin }).pipe(res);
        }
        res.writeHead(200, { ...cabeceras, "Content-Length": info.size });
        if (req.method === "HEAD") return res.end();
        fs.createReadStream(archivo).pipe(res);
    });
});

servidor.on("error", e => {
    if (e.code === "EADDRINUSE") console.error(`El puerto ${puerto} ya está en uso. Pruebe: node servir.js ${puerto + 1}`);
    else console.error(e.message);
    process.exit(1);
});
servidor.listen(puerto, "127.0.0.1", () => {
    console.log(`Sitio de SaludConecta en  http://localhost:${puerto}   (Ctrl+C para detener)`);
});
