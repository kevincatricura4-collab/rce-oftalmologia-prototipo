# Especificación del prototipo

Extracto de los Capítulos I y II del Informe de Proyecto de Título y de las fichas en papel
RCE-OFT-F01, F02 y F03. Es la fuente de requisitos para construir las pantallas. Si algo de
aquí contradice al informe, manda el informe y hay que avisarle a Kevin.

## 1. Contexto

- **Proyecto:** Registro Clínico Electrónico de Oftalmología. Módulo de consulta médica
  oftalmológica para un hospital de la red pública de salud.
- **Establecimiento de referencia (ficticio):** Hospital San Lucas, Región del Biobío. Mediana
  complejidad, policlínico de oftalmología de nivel secundario. Cuatro jornadas semanales de
  24 cupos, dos oftalmólogos y un tecnólogo médico con mención en oftalmología.
- **Situación actual:** el SOME ya tiene en sistema la agenda y la lista de espera. Lo que pasa
  dentro del box se escribe a mano en ficha de papel; recetas y órdenes van en talonario.
- **Tres tipos de atención** sobre una misma base: consulta general, catarata (caso resolutivo,
  termina en indicación quirúrgica) y glaucoma (control crónico: se compara PIO, excavación y
  campo visual de cada ojo en el tiempo). Catarata y glaucoma son patologías GES.

### Fuera de alcance

No agenda horas, no maneja pabellón ni camas, no reemplaza la lista de espera. No guarda
imágenes de exámenes (solo la orden y dónde quedó el resultado). No cubre urgencia ni
hospitalización. Si la consulta termina en indicación quirúrgica, el módulo anota la decisión y
ahí acaba: el ingreso a la lista de espera quirúrgica sigue en el sistema del SOME. No se
conecta directo con el sistema del consultorio.

## 2. Decisiones de solución

| Decisión | Elegida | Por qué |
|---|---|---|
| Modalidad | Desarrollo propio | Ningún producto reúne examen por ojo, códigos estándar, receta óptica, orden de examen y FHIR dentro de la normativa chilena. |
| Tipo de aplicación | Web responsiva (SPA) | Se trabaja en el box frente a un computador; jefatura y administración generan reportes e imprimen; sirve también en tablet. |
| Ámbito de red | Intranet | Todos los usuarios trabajan dentro del hospital. Datos sensibles (Ley 21.719): no se exponen a internet. |

Stack del sistema final: backend Python + FastAPI, base de datos PostgreSQL, frontend web de
página única. Este repositorio contiene el frontend como prototipo con datos de prueba.

Consecuencia para el frontend: **no depender de CDN externos** (fuentes, íconos y scripts van
empaquetados), porque en intranet no hay salida a internet.

## 3. Roles y matriz de acceso

| Rol | Quién es | Qué hace |
|---|---|---|
| Oftalmólogo | Médico especialista del policlínico | Registra la consulta completa, diagnostica, prescribe, ordena exámenes y emite la contrarreferencia. |
| Tecnólogo médico / TENS | Profesional de pre-atención | Registra agudeza visual y tonometría antes de que el paciente entre al box. |
| Jefatura de policlínico | Oftalmólogo jefe o coordinador | Consulta reportes de actividad e indicadores del proyecto. |
| Administrador del sistema | Unidad de informática | Gestiona usuarios, roles, catálogos y plantillas. **No ve datos clínicos.** |

| Función | Oftalmólogo | Tecnólogo / TENS | Jefatura | Administrador |
|---|---|---|---|---|
| Ver SIC y ficha del paciente | Sí | Sí | No | No |
| Registrar pre-atención (AV y PIO) | Sí | Sí | No | No |
| Registrar anamnesis, examen y diagnóstico | Sí | No | No | No |
| Emitir recetas, órdenes y contrarreferencia | Sí | No | No | No |
| Ver historial clínico | Sí | Solo AV y PIO | No | No |
| Ver reportes agregados | Sí | No | Sí | No |
| Gestionar usuarios, roles y plantillas | No | No | No | Sí |

## 4. Requerimientos funcionales

| ID | Requerimiento | Detalle | Rol |
|---|---|---|---|
| RF-01 | Consultar la SIC de origen | Muestra los datos de la SIC que originó la atención y marca los campos de la NT 118 que vienen vacíos. | Oftalmólogo, Tecnólogo/TENS |
| RF-02 | Registrar ficha del paciente | Identificación, fecha y hora de atención y establecimiento de origen. | Oftalmólogo, Tecnólogo/TENS |
| RF-03 | Registrar pre-atención | Agudeza visual con y sin corrección y PIO, por ojo. | Tecnólogo/TENS |
| RF-04 | Registrar anamnesis | Motivo de consulta, antecedentes oftalmológicos y generales, fármacos en uso. | Oftalmólogo |
| RF-05 | Registrar examen por ojo | Refracción, biomicroscopía y fondo de ojo con lateralidad OD/OI/AO obligatoria. | Oftalmólogo |
| RF-06 | Aplicar tipo de atención | Al elegir consulta general, catarata o glaucoma se cargan los campos propios sobre la base común. | Oftalmólogo |
| RF-07 | Registrar diagnóstico codificado | Búsqueda por texto que devuelve el código CIE-10; lateralidad del diagnóstico. | Oftalmólogo |
| RF-08 | Emitir receta óptica | Esfera, cilindro, eje y adición por ojo; impresión y registro en la consulta. | Oftalmólogo |
| RF-09 | Emitir receta de medicamentos | Fármaco, dosis, frecuencia, duración y ojo; impresión y registro en la consulta. | Oftalmólogo |
| RF-10 | Ordenar examen de apoyo | Orden de OCT, campimetría o topografía asociada a la consulta; luego se registra dónde quedó el resultado. | Oftalmólogo |
| RF-11 | Cerrar consulta con desenlace | Alta, control con plazo, examen pendiente o indicación quirúrgica. Declara si hubo indicación de tratamiento. | Oftalmólogo |
| RF-12 | Emitir contrarreferencia | Documento estructurado hacia el establecimiento de origen: diagnóstico, conducta y control sugerido. | Oftalmólogo |
| RF-13 | Entregar resumen al paciente | Resumen impreso de la atención al término de la consulta. | Oftalmólogo |
| RF-14 | Consultar historial | Consultas anteriores del paciente; en glaucoma, PIO y excavación por ojo en el tiempo. | Oftalmólogo |
| RF-15 | Ver reportes de actividad | Consultas por tipo, diagnóstico y desenlace, e indicadores del proyecto por mes. | Jefatura |
| RF-16 | Gestionar usuarios y roles | Alta, baja y asignación de rol. | Administrador |
| RF-17 | Gestionar plantillas y catálogos | Agregar o modificar campos de un tipo de atención y catálogos (fármacos, exámenes) por configuración. | Administrador |

## 5. Requerimientos no funcionales

| ID | Requerimiento | Criterio | Cómo se ve en la interfaz |
|---|---|---|---|
| RNF-01 | Confidencialidad | Acceso solo con usuario y rol; cada lectura de ficha queda registrada (Ley 20.584). | Menú y rutas según rol. Aviso discreto de "acceso registrado" al abrir una ficha. |
| RNF-02 | Protección de datos | Cifrado en tránsito y en reposo; mínimo de datos necesario (Ley 21.719). | Cada rol ve solo lo que necesita (tecnólogo: solo AV y PIO del historial). |
| RNF-03 | Interoperabilidad | Modelo homologado a FHIR; códigos CIE-10 y SNOMED CT (Ley 21.668). | Diagnóstico siempre con código CIE-10 visible. |
| RNF-04 | Disponibilidad | Operativo en horario de atención; enlace de respaldo. | — |
| RNF-05 | Rendimiento | Registrar un examen no toma más que en papel. | Atajos: "Sin hallazgos", copiar OD a OI, valores precargados desde pre-atención, teclado primero. |
| RNF-06 | Usabilidad | Lo obligatorio se exige por estado del registro, no todo al inicio. | Se puede guardar borrador siempre. Lo obligatorio se revisa recién al cerrar, con lista de lo que falta. |
| RNF-07 | Mantenibilidad | Un tipo de atención nuevo se agrega por configuración. | El formulario de examen se dibuja desde una plantilla de campos, no está escrito a mano por tipo. |
| RNF-08 | Trazabilidad de autoría | Cada registro ligado de forma inmutable a su autor, fecha y hora. | Autor y hora visibles en cada bloque registrado; consulta cerrada queda en solo lectura. |
| RNF-09 | Respaldo | Copia diaria de la base de datos. | — |

## 6. Pantallas

El informe define diez pantallas. La consulta (pantallas 3 a 7) es un flujo de cinco pasos con
pestañas: **1 Anamnesis · 2 Examen · 3 Diagnóstico · 4 Indicaciones · 5 Cierre**.

Encabezado común de la aplicación: "RCE Oftalmología · Hospital San Lucas", a la derecha el rol
y la ubicación ("Oftalmólogo · Box 2"). Marca permanente de **"Datos de prueba"**.

Encabezado de paciente (pantallas 2 a 8): nombre, edad, N° de ficha, documento, y una línea
"Derivado por SIC desde {establecimiento} · sospecha de {diagnóstico}". Si la SIC vino
incompleta, aviso ámbar a la derecha, por ejemplo "SIC sin agudeza visual (NT 118)".

### Pantalla 1 — Agenda del día del box

Lista de pacientes citados en la jornada del box, con hora, paciente, establecimiento de
origen, sospecha diagnóstica, tipo de atención sugerido y **estado**:

| Estado | Significado | Acción principal |
|---|---|---|
| En espera | Llegó, sin mediciones | Tecnólogo/TENS: "Registrar pre-atención" |
| Con pre-atención | AV y PIO registradas | Oftalmólogo: "Abrir consulta" |
| En atención | Consulta abierta, borrador | Oftalmólogo: "Continuar consulta" |
| Cerrado | Consulta cerrada con desenlace | "Ver consulta" (solo lectura) |

Resumen de conteo por estado arriba. La agenda es de lectura: la citación es del SOME.

### Pantalla 2 — Pre-atención

La registra el tecnólogo médico o el TENS. Todo por ojo, OD a la izquierda y OI a la derecha.

- Agudeza visual: sin corrección, con corrección, estenopeico.
- PIO (mmHg): valor, método (aplanación, neumotonómetro, rebote), hora de la toma.
- Observaciones.
- Al guardar, el paciente pasa a "Con pre-atención" y los valores aparecen precargados en el
  examen del oftalmólogo, marcados "desde pre-atención".

### Pantalla 3 — Consulta, paso 1: SIC de origen y anamnesis

- **SIC de origen (solo lectura):** folio, fecha de emisión y días de espera transcurridos,
  establecimiento de origen, profesional que deriva **con su profesión** (puede ser médico o
  tecnólogo médico de UAPO), sospecha diagnóstica, fundamento de la derivación, hallazgos y
  exámenes previos (AV, PIO), antecedente de diabetes, fármacos en uso, marca GES, prioridad.
  Los campos que vinieron vacíos se marcan uno por uno, con ícono y texto (no solo color).
- **Anamnesis:** motivo de consulta, antecedentes oculares, antecedentes sistémicos (diabetes
  mellitus, hipertensión arterial, ninguno, otro), fármacos en uso.

### Pantalla 4 — Consulta, paso 2: examen por ojo

Es la pantalla que resuelve el problema central. Referencia visual:
`docs/referencia/figura-4-examen-glaucoma.png`.

- Selector de tipo de atención: Consulta general · Catarata · Glaucoma. Al cambiarlo se cargan
  los campos propios sin perder lo ya escrito en los campos comunes.
- Tabla con columnas fijas **Campo · OD · OI**. Nunca se invierte el orden.
- AV y PIO llegan precargadas desde la pre-atención, con la etiqueta "desde pre-atención".
- En glaucoma, panel lateral **"PIO en controles previos"**: fecha, OD, OI, y una nota de
  cambio de excavación ("Excavación OD: 0,6 en marzo, 0,7 hoy").
- Botones: "Guardar borrador" y "Continuar a diagnóstico".

### Pantalla 5 — Consulta, paso 3: diagnóstico

Búsqueda por texto que devuelve código y descripción CIE-10. Cada diagnóstico lleva
lateralidad (OD / OI / AO) obligatoria y marca de principal o secundario.

### Pantalla 6 — Consulta, paso 4: indicaciones

- **Receta óptica:** esfera, cilindro, eje y adición por ojo. Se puede partir desde la
  refracción del examen.
- **Receta de medicamentos:** fármaco (de catálogo), dosis, frecuencia, duración y ojo.
- **Orden de examen:** OCT, campimetría o topografía, con ojo; estado y referencia del
  resultado (dónde quedó).
- Cada documento se imprime para el paciente y queda guardado en la consulta.

### Pantalla 7 — Consulta, paso 5: cierre

- **Desenlace:** alta · control con plazo · examen pendiente · indicación quirúrgica.
- **¿Hubo indicación de tratamiento óptico o farmacológico?** Sí / No. Es obligatorio: de ahí
  sale el denominador del indicador de recetas.
- Lista de lo que falta para poder cerrar (campos obligatorios del tipo de atención).
- **Contrarreferencia** al establecimiento de origen: diagnóstico, conducta y control sugerido.
- **Resumen para el paciente**, en lenguaje simple, imprimible.
- Al cerrar queda autor, fecha y hora, y la consulta pasa a solo lectura.
- Si el desenlace es indicación quirúrgica: ojo a operar y nota de que la lista de espera
  quirúrgica se gestiona en el SOME.

### Pantalla 8 — Historial del paciente

Consultas anteriores en orden cronológico. En glaucoma, PIO y excavación (C/D) por ojo en el
tiempo. El tecnólogo/TENS ve solo AV y PIO.

### Pantalla 9 — Reportes de jefatura

Consultas por tipo de atención, por diagnóstico y por desenlace, y los tres indicadores del
proyecto por mes (sección 9). Solo datos agregados, sin pacientes identificables.

### Pantalla 10 — Administración

Usuarios y roles (alta, baja, asignación). Plantillas de tipo de atención (agregar o modificar
campos) y catálogos (fármacos, exámenes). Sin datos clínicos.

## 7. Plantillas de tipo de atención

Campos tomados de las fichas en papel. "Por ojo" significa un valor para OD y otro para OI.

### Base común (los tres tipos)

| Grupo | Campo | Lateralidad | Notas |
|---|---|---|---|
| Agudeza visual | Sin corrección | Por ojo | Desde pre-atención |
| Agudeza visual | Con corrección | Por ojo | Desde pre-atención |
| Agudeza visual | Estenopeico | Por ojo | Desde pre-atención |
| PIO | Valor (mmHg) | Por ojo | Desde pre-atención |
| PIO | Método, hora | AO | Desde pre-atención |
| Refracción | Esfera, cilindro, eje, adición | Por ojo | Base de la receta óptica |
| Biomicroscopía | Córnea, cámara anterior, cristalino | Por ojo | Atajo "Sin hallazgos" |
| Fondo de ojo | Papila, mácula, retina | Por ojo | Atajo "Sin hallazgos" |

### Catarata (RCE-OFT-F02) agrega

| Grupo | Campo | Lateralidad | Opciones |
|---|---|---|---|
| Cristalino | Tipo de opacidad | Por ojo | Nuclear, cortical, subcapsular posterior, otra |
| Cristalino | Grado | Por ojo | Según escala declarada |
| Cristalino | Reflejo rojo | Por ojo | |
| Función | Repercusión funcional | AO | Dificultad para leer, dificultad para conducir, deslumbramiento, ninguna |
| Función | Comorbilidad ocular | AO | Texto |
| Decisión | Indicación quirúrgica | AO | Sí / No |
| Decisión | Ojo a operar | OD / OI | |

### Glaucoma (RCE-OFT-F03) agrega

| Grupo | Campo | Lateralidad | Notas |
|---|---|---|---|
| Control | N° de control, fecha del control anterior | AO | |
| PIO | PIO objetivo | Por ojo | |
| Nervio óptico y ángulo | Relación C/D (excavación) | Por ojo | |
| Nervio óptico y ángulo | Paquimetría (µm) | Por ojo | |
| Nervio óptico y ángulo | Gonioscopía | Por ojo | |
| Nervio óptico y ángulo | Campo visual (fecha / resultado) | Por ojo | |
| Nervio óptico y ángulo | OCT (fecha / resultado) | Por ojo | |
| Tratamiento | Hipotensor: fármaco, posología, fecha de inicio | Por ojo | |
| Evolución | Controles previos: fecha, PIO OD/OI, C/D OD/OI, campo visual | — | Solo lectura, viene del historial |
| Evolución | Progresión | AO | Estable, progresa, no evaluable |

## 8. Modelo de datos

Modelo relacional en PostgreSQL; cada tabla clínica se homologa a un recurso FHIR. Los tipos
de TypeScript del prototipo deben reflejar estas entidades.

| Tabla | Contenido principal | Relaciones | Recurso FHIR |
|---|---|---|---|
| paciente | Documento, nombre, fecha de nacimiento, sexo, previsión | 1 a N con consulta | Patient |
| establecimiento | Código DEIS, nombre, tipo (CESFAM, UAPO, hospital) | 1 a N con sic | Organization |
| sic | Fecha de emisión, establecimiento de origen, sospecha diagnóstica, profesional que deriva | N a 1 con paciente; 1 a N con consulta | ServiceRequest |
| usuario | Nombre, RUN, profesión, rol | 1 a N con cada registro (autoría) | Practitioner |
| tipo_atencion | Nombre y plantilla de campos (configurable) | 1 a N con consulta | Questionnaire |
| consulta | Fecha y hora de inicio y cierre, tipo de atención, estado, desenlace, indicación de tratamiento (sí/no) | N a 1 con paciente, sic, usuario | Encounter |
| hallazgo | Campo examinado, lateralidad (OD/OI/AO), valor, unidad, código SNOMED CT | N a 1 con consulta | Observation |
| diagnostico | Código CIE-10, lateralidad, principal o secundario | N a 1 con consulta | Condition |
| receta_optica | Esfera, cilindro, eje, adición por ojo | N a 1 con consulta | VisionPrescription |
| receta_medicamento | Fármaco, dosis, frecuencia, duración, ojo | N a 1 con consulta | MedicationRequest |
| orden_examen | Tipo (OCT, campimetría, topografía), estado, referencia del resultado | N a 1 con consulta | ServiceRequest |
| contrarreferencia | Establecimiento de destino, diagnóstico, conducta, control sugerido, fecha de emisión | 1 a 1 con consulta | Communication |
| auditoria | Usuario, acción, tabla, registro, fecha y hora | N a 1 con usuario | AuditEvent |

La tabla `hallazgo` guarda cada medición como una fila con su lateralidad. Por eso un tipo de
atención nuevo solo agrega campos a su plantilla, sin cambiar el esquema.

## 9. Indicadores del proyecto

Son los tres objetivos específicos. Van en la pantalla de reportes, por mes, con su meta.

| Indicador | Meta | Medición |
|---|---|---|
| Consultas cerradas con todos los campos obligatorios de su tipo completos | ≥ 70% | Al sexto mes de operación |
| Consultas con indicación de tratamiento cuya receta se generó desde el módulo | ≥ 90% (línea base 0%) | Al cuarto mes de operación |
| Consultas con desenlace de alta que emitieron contrarreferencia | ≥ 80% | Al sexto mes de operación |

## 10. Reglas de dominio que la interfaz debe respetar

Vienen de cómo opera la red pública. Romper cualquiera vuelve el prototipo poco creíble para
un oftalmólogo.

1. **El oftalmólogo está en el hospital, no en el CESFAM.** En atención primaria hay UAPO con
   tecnólogos médicos.
2. **La SIC puede emitirla un tecnólogo médico.** Nunca asumir "médico solicitante": mostrar
   nombre y profesión del solicitante.
3. **Pacientes sin RUN existen.** Identificar con tipo de documento + número (RUN, pasaporte,
   identificador provisorio). Incluir al menos un paciente de prueba sin RUN.
4. **Todo hallazgo lleva ojo.** OD siempre a la izquierda de la pantalla, OI a la derecha. La
   diferencia nunca depende solo del color: siempre va la sigla.
5. **El registro se posterga si cuesta.** 20 a 30 pacientes por jornada. Pocos campos
   obligatorios durante la atención; exigir por estado y al cierre.
6. **La fecha de emisión de la SIC es un dato propio** y de ahí corre la espera. Mostrarla
   junto a los días transcurridos.
7. **Indicación quirúrgica cierra una espera y abre otra.** El módulo lo dice de forma
   explícita y no da el caso por "resuelto".
8. **La contrarreferencia es un documento estructurado,** no texto libre: diagnóstico,
   conducta, control sugerido, destino.
9. **Glaucoma es control de por vida.** La comparación en el tiempo, por ojo, es la función
   principal de esa plantilla.
10. **No mostrar cifras inventadas como si fueran reales.** Todo dato de pacientes, usuarios
    y reportes es de prueba y debe verse como tal.

## 11. Datos de prueba

Todo es ficticio. No usar nombres, RUN ni establecimientos reales.

- **Hospital:** Hospital San Lucas. **Box:** Box 2, jornada de la mañana.
- **Usuarios de prueba:** un oftalmólogo (Box 2), un tecnólogo médico (pre-atención), una
  jefatura de policlínico, un administrador de informática.
- **Establecimientos de origen:** CESFAM y UAPO con nombres ficticios.
- **Agenda:** unos diez pacientes repartidos en los cuatro estados, cubriendo los tres tipos
  de atención, al menos una SIC incompleta, una SIC emitida por tecnólogo médico de UAPO y un
  paciente sin RUN.
- **Paciente de referencia de la Figura 4 (glaucoma):** 67 años, ficha 000123, derivado por
  SIC desde CESFAM con sospecha de glaucoma, SIC sin agudeza visual.

  | Campo | OD | OI |
  |---|---|---|
  | AV sin corrección | 0,5 | 0,3 |
  | AV con corrección | 0,8 | 0,6 |
  | PIO (mmHg), desde pre-atención | 24 | 19 |
  | Excavación (C/D) | 0,7 | 0,5 |
  | Biomicroscopía | Sin hallazgos | Sin hallazgos |
  | Campo visual | Orden enviada | Orden enviada |

  PIO en controles previos: marzo 2026 → 26 / 20; junio 2026 → 25 / 19; hoy → 24 / 19.
  Excavación OD: 0,6 en marzo, 0,7 hoy.

- **Notación:** agudeza visual en decimal con coma (0,5). PIO en mmHg entero. Fechas en
  formato chileno (día-mes-año).
