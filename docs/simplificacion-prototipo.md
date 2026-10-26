# Simplificación del recorrido

Se conserva el alcance clínico de las fichas y se reduce la información visible al empezar:
los grupos de examen adicionales se despliegan a solicitud, la SIC es consultable y los
documentos se preparan cuando corresponden. Los campos del indicador de completitud siguen
visibles y el cierre mínimo conserva sus bloqueos.

Se reutilizan fármacos de la SIC y el tratamiento hipotensor actual mediante acciones
explícitas para revisión. La decisión de catarata se comparte entre examen y cierre; la
contrarreferencia puede partir de un borrador de los documentos emitidos y el plazo registrado.

Las recetas, órdenes y contrarreferencia validan los datos mínimos al emitir. Si se modifica
el contenido de un documento se requiere emitirlo de nuevo. Los resultados recibidos después
del cierre se guardan como anexos con autor y fecha, sin modificar la consulta original.

## Verificación

- `npm test`: valida documentos vacíos y completos, números de receta óptica, decisiones de
  catarata en ambas direcciones y anexos que conservan las órdenes y el cierre originales.
- `npm run build`: comprueba tipos y genera la versión de producción.
- Recorrido automatizado en Edge: desplegar y ocultar campos conservando datos; reutilizar
  tratamiento en receta; bloquear emisión incompleta y emitir una receta completa; invalidar
  la emisión al editar; sincronizar ojo de catarata; bloquear y luego emitir contrarreferencia;
  cerrar con confirmación por examen incompleto; agregar resultado a consulta cerrada,
  recargar y verificar persistencia; denegar la consulta al administrador.
- Migración de plantilla guardada: conserva campos personalizados y datos de consulta.
- Revisión visual de examen en claro y oscuro a 1366 × 768 y en tablet a 768 × 1024,
  sin desbordamiento horizontal de página. No se observaron errores de ejecución en el recorrido.

La validación clínica y la medición del tiempo de registro con profesionales siguen pendientes.
El almacenamiento, el ingreso y los permisos siguen siendo simulaciones del prototipo.
