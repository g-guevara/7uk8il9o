# API Documentation - UAI Salas Events

Esta API proporciona acceso a los eventos y salas de la Universidad Adolfo Ibáñez. Webscrapping acomulado de hoy.uai.cl

## Base URL 
```
https://7uk8il9o.vercel.app
```

## Endpoints Disponibles

### 1. Obtener Todos los Eventos
```
GET /all_eventos
```

**Descripción:** Retorna todos los eventos disponibles (https://7uk8il9o.vercel.app/all_eventos) con información completa incluyendo el día de la semana.

**Respuesta:**
```json
[
  {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "Tipo": "Cátedra",
    "Evento": "Matemáticas I Sec 01",
    "Fecha": "2025-01-15",
    "Inicio": "08:30:00",
    "Fin": "10:00:00",
    "Sala": "A101",
    "Edificio": "Edificio A",
    "Campus": "Viña del Mar",
    "fechaActualizacion": "2025-01-10T10:00:00Z",
    "diaSemana": "Miércoles"
  }
]
```

### 2. Obtener Eventos Básicos
```
GET /eventos
```

**Descripción:** Retorna eventos de la colección básica (con día de la semana calculado dinámicamente).

## Campos de Respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_id` | String | ID único del evento |
| `Tipo` | String | Tipo de evento (Cátedra, Ayudantía, etc.) |
| `Evento` | String | Nombre del evento/ramo |
| `Fecha` | String | Fecha del evento (YYYY-MM-DD) |
| `Inicio` | String | Hora de inicio (HH:MM:SS) |
| `Fin` | String | Hora de fin (HH:MM:SS) |
| `Sala` | String | Número/código de la sala |
| `Edificio` | String | Nombre del edificio |
| `Campus` | String | Campus de la universidad |
| `fechaActualizacion` | String | Última actualización |
| `diaSemana` | String | Día de la semana |

## Ejemplos de Uso

### JavaScript (Fetch API)
```javascript
// Obtener todos los eventos
fetch('https://7uk8il9o.vercel.app/all_eventos')
  .then(response => response.json())
  .then(data => {
    console.log('Eventos:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### Python
```python
import requests

# Obtener todos los eventos
response = requests.get('https://7uk8il9o.vercel.app/all_eventos')
events = response.json()
print(f"Total de eventos: {len(events)}")
```

### cURL
```bash
# Obtener todos los eventos
curl -X GET https://7uk8il9o.vercel.app/all_eventos
```

## Filtrado y Procesamiento

Los datos vienen sin filtros aplicados. Puedes filtrar por:
- **Campus:** Viña del Mar, Santiago, etc.
- **Tipo:** Cátedra, Ayudantía, Laboratorio, etc.
- **Día de la semana:** Lunes, Martes, etc.
- **Edificio:** A, B, C, D, E, F
- **Horario:** Usando los campos Inicio y Fin

Como es un webscapping hay varios campos que tienen errores, tener en cuenta que no son datos limpios

### Ejemplo de Filtrado por Campus
```javascript
const eventos = await fetch('https://7uk8il9o.vercel.app/all_eventos')
  .then(res => res.json());

// Filtrar por campus Viña del Mar
const eventosVina = eventos.filter(evento => 
  evento.Campus === 'Viña del Mar'
);

// Filtrar por día específico
const eventosLunes = eventos.filter(evento => 
  evento.diaSemana === 'Lunes'
);
```

## Códigos de Respuesta

| Código | Descripción |
|--------|-------------|
| 200 | Solicitud exitosa |
| 500 | Error interno del servidor |

## Límites y Consideraciones

- La API no requiere autenticación
- No hay límites de rate limiting actualmente
- Los datos se actualizan periódicamente todos los dias
- Respuesta típica: ~10,000 eventos
- Tiempo de respuesta promedio: 1-3 segundos

## Soporte

Para dudas técnicas o problemas con la API, contacta al administrador del repositorio.
