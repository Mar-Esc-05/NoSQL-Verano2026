// ============================================
// Configuración API
// ============================================
const API_BASE = "http://localhost:3000";

// ============================================
// Helpers HTTP
// ============================================
async function leerCuerpo(resp) {
    const t = await resp.text();
    try { return t ? JSON.parse(t) : null; } catch { return t; }
}

async function apiGet(path) {
    const r = await fetch(`${API_BASE}${path}`);
    if (!r.ok) throw new Error("Error al obtener datos");
    return r.json();
}

async function apiPost(path, data) {
    const r = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!r.ok) throw new Error("Error al guardar");
    return leerCuerpo(r);
}

async function apiPut(path, data) {
    const r = await fetch(`${API_BASE}${path}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!r.ok) throw new Error("Error al actualizar");
    return leerCuerpo(r);
}

async function apiDelete(path) {
    const r = await fetch(`${API_BASE}${path}`, { method: "DELETE" });
    if (!r.ok) throw new Error("Error al eliminar");
    return true;
}

// ============================================
// DOM References
// ============================================
const tabs = document.querySelectorAll(".topbar-link");
const seccionPeliculas = document.getElementById("seccionPeliculas");
const seccionSeries = document.getElementById("seccionSeries");
const heroTitulo = document.getElementById("heroTitulo");
const heroSub = document.getElementById("heroSub");
const statIconPrincipal = document.getElementById("statIconPrincipal");
const statLabelPrincipal = document.getElementById("statLabelPrincipal");

// Películas
const listaPeliculas = document.getElementById("listaPeliculas");
const estadoVacioPeliculas = document.getElementById("estadoVacioPeliculas");
const contadorPeliculas = document.getElementById("contadorPeliculas");
const statTotal = document.getElementById("statTotal");
const statPromedio = document.getElementById("statPromedio");

// Series
const listaSeries = document.getElementById("listaSeries");
const estadoVacioSeries = document.getElementById("estadoVacioSeries");
const contadorSeries = document.getElementById("contadorSeries");
const statSeries = document.getElementById("statSeries");

// Modals
const modalPelicula = document.getElementById("modalPelicula");
const formulario = document.getElementById("formulario");
const modalTitulo = document.getElementById("modalTitulo");
const btnAbrirModal = document.getElementById("btnAbrirModal");
const btnCerrarModal = document.getElementById("btnCerrarModal");
const btnCancelar = document.getElementById("btnCancelar");
const btnConsultar = document.getElementById("btnConsultar");

const modalSerie = document.getElementById("modalSerie");
const formularioSerie = document.getElementById("formularioSerie");
const modalSerieTitulo = document.getElementById("modalSerieTitulo");
const btnCerrarModalSerie = document.getElementById("btnCerrarModalSerie");
const btnCancelarSerie = document.getElementById("btnCancelarSerie");

// ============================================
// Utilidades
// ============================================
const PALETA_GENEROS = {
    "acción": "#7a1f2b", "accion": "#7a1f2b",
    "comedia": "#8a5a12",
    "drama": "#33366b",
    "terror": "#1f1f1f",
    "ciencia ficción": "#12586b", "ciencia ficcion": "#12586b",
    "romance": "#7a2f5c",
    "documental": "#2f6b3a",
    "animación": "#6b4e12", "animacion": "#6b4e12",
    "thriller": "#1a2a3a",
    "aventura": "#2a5a3a",
    "fantasía": "#4a2a6a", "fantasia": "#4a2a6a",
    "musical": "#6a3a5a",
    "crimen": "#2a1a1a",
    "misterio": "#1a1a3a",
    "guerra": "#3a3a3a",
    "superhéroes": "#1a2a5a", "superheroes": "#1a2a5a",
    "familia": "#2a5a2a",
    "suspenso": "#2a1a2a",
    "hindú": "#6a4a1a", "hindi": "#6a4a1a"
};

function colorPorGenero(g) {
    return PALETA_GENEROS[(g || "").trim().toLowerCase()] || "#1a1a28";
}

function idDe(item) { return item.id ?? item._id; }

function esUrlValida(url) {
    if (!url) return false;
    try { new URL(url); return true; } catch { return false; }
}

// ============================================
// Tab switching
// ============================================
let tabActiva = "peliculas";

const TAB_CONFIG = {
    peliculas: { titulo: "Películas", sub: "Administra el catálogo de películas de tu plataforma de streaming.", icon: "🎬", label: "Películas" },
    series: { titulo: "Series", sub: "Administra el catálogo de series de tu plataforma de streaming.", icon: "📺", label: "Series" }
};

function cambiarTab(tab) {
    tabActiva = tab;

    tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === tab));

    const cfg = TAB_CONFIG[tab];
    heroTitulo.textContent = cfg.titulo;
    heroSub.textContent = cfg.sub;
    statIconPrincipal.textContent = cfg.icon;
    statLabelPrincipal.textContent = cfg.label;

    seccionPeliculas.hidden = tab !== "peliculas";
    seccionSeries.hidden = tab !== "series";
}

tabs.forEach(t => t.addEventListener("click", () => cambiarTab(t.dataset.tab)));

// ============================================
// Render tarjeta película
// ============================================
function crearTarjetaPelicula(pelicula) {
    const li = document.createElement("li");
    li.className = "tarjeta";

    const iniciales = (pelicula.titulo || "?").slice(0, 2).toUpperCase();
    const color = colorPorGenero(pelicula.genero);
    const rating = Number(pelicula.calificacion ?? 0).toFixed(1);
    const tienePortada = esUrlValida(pelicula.portada);

    const posterHTML = tienePortada
        ? `<img src="${pelicula.portada}" alt="${pelicula.titulo}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
           <div class="poster-placeholder" style="display:none;background:${color}">${iniciales}</div>`
        : `<div class="poster-placeholder" style="background:${color}">${iniciales}</div>`;

    li.innerHTML = `
        <div class="poster-wrap">
            ${posterHTML}
            <span class="rating-badge">${rating}</span>
            <div class="poster-overlay">
                <div class="overlay-meta">
                    <span class="overlay-pill">${pelicula.genero ?? ""}</span>
                    <span class="overlay-pill">${pelicula.año ?? ""}</span>
                    <span class="overlay-pill">${pelicula.duracion ?? ""} min</span>
                    <span class="overlay-pill">${pelicula.idioma ?? ""}</span>
                </div>
                <div class="overlay-actions">
                    <button class="overlay-btn overlay-btn--edit">Editar</button>
                    <button class="overlay-btn overlay-btn--delete">Eliminar</button>
                </div>
            </div>
        </div>
        <div class="tarjeta-info">
            <p class="tarjeta-titulo" title="${pelicula.titulo ?? ""}">${pelicula.titulo ?? ""}</p>
            <p class="tarjeta-meta-line">${pelicula.genero ?? ""} · ${pelicula.año ?? ""}</p>
        </div>`;

    li.querySelector(".overlay-btn--edit").addEventListener("click", () => abrirEdicionPelicula(pelicula));
    li.querySelector(".overlay-btn--delete").addEventListener("click", () => confirmarEliminarPelicula(pelicula));

    return li;
}

// ============================================
// Render tarjeta serie
// ============================================
function crearTarjetaSerie(serie) {
    const li = document.createElement("li");
    li.className = "tarjeta";

    const iniciales = (serie.titulo || "?").slice(0, 2).toUpperCase();
    const color = colorPorGenero(serie.genero);
    const rating = Number(serie.calificacion ?? 0).toFixed(1);
    const tienePortada = esUrlValida(serie.portada);

    const posterHTML = tienePortada
        ? `<img src="${serie.portada}" alt="${serie.titulo}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
           <div class="poster-placeholder" style="display:none;background:${color}">${iniciales}</div>`
        : `<div class="poster-placeholder" style="background:${color}">${iniciales}</div>`;

    li.innerHTML = `
        <div class="poster-wrap">
            ${posterHTML}
            <span class="rating-badge">${rating}</span>
            <span class="serie-badge">Serie</span>
            <div class="poster-overlay">
                <div class="overlay-meta">
                    <span class="overlay-pill">${serie.genero ?? ""}</span>
                    <span class="overlay-pill">${serie.año ?? ""}</span>
                    <span class="overlay-pill">${serie.temporadas ?? 0} temp</span>
                    <span class="overlay-pill">${serie.episodios ?? 0} epi</span>
                    <span class="overlay-pill">${serie.idioma ?? ""}</span>
                </div>
                <div class="overlay-actions">
                    <button class="overlay-btn overlay-btn--edit">Editar</button>
                    <button class="overlay-btn overlay-btn--delete">Eliminar</button>
                </div>
            </div>
        </div>
        <div class="tarjeta-info">
            <p class="tarjeta-titulo" title="${serie.titulo ?? ""}">${serie.titulo ?? ""}</p>
            <p class="tarjeta-meta-line">${serie.genero ?? ""} · ${serie.temporadas ?? 0} temporadas</p>
        </div>`;

    li.querySelector(".overlay-btn--edit").addEventListener("click", () => abrirEdicionSerie(serie));
    li.querySelector(".overlay-btn--delete").addEventListener("click", () => confirmarEliminarSerie(serie));

    return li;
}

// ============================================
// Renderizar
// ============================================
function renderizarPeliculas(peliculas) {
    listaPeliculas.innerHTML = "";
    const hay = Array.isArray(peliculas) && peliculas.length > 0;
    estadoVacioPeliculas.hidden = hay;

    if (hay) peliculas.forEach(p => listaPeliculas.appendChild(crearTarjetaPelicula(p)));

    contadorPeliculas.textContent = hay ? `${peliculas.length} película${peliculas.length === 1 ? "" : "s"}` : "";

    statTotal.textContent = hay ? peliculas.length : "0";
    if (hay) {
        const suma = peliculas.reduce((a, p) => a + Number(p.calificacion || 0), 0);
        statPromedio.textContent = (suma / peliculas.length).toFixed(1);
    } else {
        statPromedio.textContent = "-";
    }
}

function renderizarSeries(series) {
    listaSeries.innerHTML = "";
    const hay = Array.isArray(series) && series.length > 0;
    estadoVacioSeries.hidden = hay;

    if (hay) series.forEach(s => listaSeries.appendChild(crearTarjetaSerie(s)));

    contadorSeries.textContent = hay ? `${series.length} serie${series.length === 1 ? "" : "s"}` : "";
    statSeries.textContent = hay ? series.length : "0";
}

// ============================================
// Cargar datos
// ============================================
async function cargarPeliculas() {
    try {
        renderizarPeliculas(await apiGet("/peliculas"));
    } catch (e) {
        contadorPeliculas.textContent = "Error al cargar";
    }
}

async function cargarSeries() {
    try {
        renderizarSeries(await apiGet("/series"));
    } catch (e) {
        contadorSeries.textContent = "Error al cargar";
    }
}

async function cargarTodo() {
    await Promise.all([cargarPeliculas(), cargarSeries()]);
}

btnConsultar.addEventListener("click", cargarTodo);
cargarTodo();

// ============================================
// MODAL PELÍCULA
// ============================================
function limpiarFormPelicula() {
    formulario.reset();
    document.getElementById("peliculaId").value = "";
}

btnAbrirModal.addEventListener("click", () => {
    limpiarFormPelicula();
    modalTitulo.textContent = "Registrar película";
    modalPelicula.showModal();
    document.getElementById("titulo").focus();
});

function abrirEdicionPelicula(p) {
    document.getElementById("peliculaId").value = idDe(p);
    document.getElementById("titulo").value = p.titulo ?? "";
    document.getElementById("genero").value = p.genero ?? "";
    document.getElementById("año").value = p.año ?? "";
    document.getElementById("duracion").value = p.duracion ?? "";
    document.getElementById("idioma").value = p.idioma ?? "";
    document.getElementById("calificacion").value = p.calificacion ?? "";
    document.getElementById("nc").value = p.nc ?? "";
    document.getElementById("portada").value = p.portada ?? "";
    modalTitulo.textContent = "Editar película";
    modalPelicula.showModal();
}

function cerrarModalPelicula() { modalPelicula.close(); limpiarFormPelicula(); }

btnCerrarModal.addEventListener("click", cerrarModalPelicula);
btnCancelar.addEventListener("click", cerrarModalPelicula);

formulario.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("peliculaId").value;
    const datos = {
        titulo: document.getElementById("titulo").value,
        genero: document.getElementById("genero").value,
        año: Number(document.getElementById("año").value),
        duracion: Number(document.getElementById("duracion").value),
        idioma: document.getElementById("idioma").value,
        calificacion: Number(document.getElementById("calificacion").value),
        nc: document.getElementById("nc").value,
        portada: document.getElementById("portada").value.trim()
    };

    try {
        if (id) await apiPut(`/peliculas/${id}`, datos);
        else await apiPost("/peliculas", datos);
        cerrarModalPelicula();
        await cargarPeliculas();
    } catch (e) { alert(e.message); }
});

async function confirmarEliminarPelicula(p) {
    if (!confirm(`¿Eliminar "${p.titulo}"?`)) return;
    try { await apiDelete(`/peliculas/${idDe(p)}`); await cargarPeliculas(); } catch (e) { alert(e.message); }
}

// ============================================
// MODAL SERIE
// ============================================
function limpiarFormSerie() {
    formularioSerie.reset();
    document.getElementById("serieId").value = "";
}

function abrirCreacionSerie() {
    limpiarFormSerie();
    modalSerieTitulo.textContent = "Registrar serie";
    modalSerie.showModal();
    document.getElementById("sTitulo").focus();
}

function abrirEdicionSerie(s) {
    document.getElementById("serieId").value = idDe(s);
    document.getElementById("sTitulo").value = s.titulo ?? "";
    document.getElementById("sGenero").value = s.genero ?? "";
    document.getElementById("sAño").value = s.año ?? "";
    document.getElementById("sTemporadas").value = s.temporadas ?? "";
    document.getElementById("sEpisodios").value = s.episodios ?? "";
    document.getElementById("sIdioma").value = s.idioma ?? "";
    document.getElementById("sCalificacion").value = s.calificacion ?? "";
    document.getElementById("sNc").value = s.nc ?? "";
    document.getElementById("sPortada").value = s.portada ?? "";
    modalSerieTitulo.textContent = "Editar serie";
    modalSerie.showModal();
}

function cerrarModalSerie() { modalSerie.close(); limpiarFormSerie(); }

btnCerrarModalSerie.addEventListener("click", cerrarModalSerie);
btnCancelarSerie.addEventListener("click", cerrarModalSerie);

// El botón "+" abre el modal correcto según la pestaña activa
btnAbrirModal.removeEventListener("click", () => {});
btnAbrirModal.addEventListener("click", () => {
    if (tabActiva === "series") abrirCreacionSerie();
    else {
        limpiarFormPelicula();
        modalTitulo.textContent = "Registrar película";
        modalPelicula.showModal();
        document.getElementById("titulo").focus();
    }
});

formularioSerie.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("serieId").value;
    const datos = {
        titulo: document.getElementById("sTitulo").value,
        genero: document.getElementById("sGenero").value,
        año: Number(document.getElementById("sAño").value),
        temporadas: Number(document.getElementById("sTemporadas").value),
        episodios: Number(document.getElementById("sEpisodios").value),
        idioma: document.getElementById("sIdioma").value,
        calificacion: Number(document.getElementById("sCalificacion").value),
        nc: document.getElementById("sNc").value,
        portada: document.getElementById("sPortada").value.trim()
    };

    try {
        if (id) await apiPut(`/series/${id}`, datos);
        else await apiPost("/series", datos);
        cerrarModalSerie();
        await cargarSeries();
    } catch (e) { alert(e.message); }
});

async function confirmarEliminarSerie(s) {
    if (!confirm(`¿Eliminar "${s.titulo}"?`)) return;
    try { await apiDelete(`/series/${idDe(s)}`); await cargarSeries(); } catch (e) { alert(e.message); }
}
