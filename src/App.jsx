import React, { useState, useEffect } from 'react';

export default function AmmiLegacyApp() {
  const [ciclosData, setCiclosData] = useState({
    crece: [
      { id: 'c1', nombre: 'Crece Ciclo 1', semanas: 5, estudiantes: ['Juan Martínez', 'Ana Rodríguez', 'Carlos López', 'Daniela Torres', 'Felipe Sánchez'] },
      { id: 'c2', nombre: 'Crece Ciclo 2', semanas: 5, estudiantes: ['Sofía García', 'Miguel Ángel', 'Valentina Díaz', 'Martín Herrera'] },
      { id: 'c3', nombre: 'Crece Ciclo 3', semanas: 5, estudiantes: ['Diego Castillo', 'Camila Morales', 'Luciano Vargas', 'Mariana Ríos', 'Andrés Gutiérrez', 'Laura Mendoza'] },
      { id: 'c4', nombre: 'Crece Ciclo 4', semanas: 5, estudiantes: ['Isabella Romero', 'Sebastián Pérez', 'Catalina López'] }
    ],
    efi: [
      { id: 'e1', nombre: 'EFI Ciclo 1', semanas: 14, estudiantes: ['Roberto García', 'Alejandra López', 'Cristian Ruiz', 'Natalia Soto', 'Iván Domínguez', 'Lucía Cabrera', 'Mateo Fernández'] },
      { id: 'e2', nombre: 'EFI Ciclo 2', semanas: 14, estudiantes: ['Paloma Jiménez', 'Leonardo Vargas', 'Sofía Montoya', 'Ángel Medina', 'Camila Vergara'] },
      { id: 'e3', nombre: 'EFI Ciclo 3', semanas: 14, estudiantes: ['Sara González', 'Javier López'] }
    ]
  });

  const [tipoRuta, setTipoRuta] = useState('crece');
  const [cicloSeleccionado, setCicloSeleccionado] = useState('c1');
  const [asistencias, setAsistencias] = useState({});
  const [vista, setVista] = useState('registro');
  const [nuevoEstudiante, setNuevoEstudiante] = useState('');
  const [mostrarModalNuevoCiclo, setMostrarModalNuevoCiclo] = useState(false);
  const [nuevoCiclo, setNuevoCiclo] = useState({ nombre: '', semanas: 5 });

  // Inicializar datos
  useEffect(() => {
    const ciclosActuales = tipoRuta === 'crece' ? ciclosData.crece : ciclosData.efi;
    const ciclo = ciclosActuales.find(c => c.id === cicloSeleccionado);
    
    if (!asistencias[cicloSeleccionado]) {
      const datos = {};
      ciclo.estudiantes.forEach(est => {
        datos[est] = Array(ciclo.semanas).fill(0);
      });
      setAsistencias(prev => ({ ...prev, [cicloSeleccionado]: datos }));
    }
  }, [cicloSeleccionado, tipoRuta]);

  const ciclosActuales = tipoRuta === 'crece' ? ciclosData.crece : ciclosData.efi;
  const cicloActual = ciclosActuales.find(c => c.id === cicloSeleccionado);
  const datosAsistencia = asistencias[cicloSeleccionado] || {};

  const toggleAsistencia = (estudiante, semana) => {
    const nuevo = { ...datosAsistencia };
    if (!nuevo[estudiante]) nuevo[estudiante] = Array(cicloActual.semanas).fill(0);
    
    const valor = nuevo[estudiante][semana];
    nuevo[estudiante][semana] = valor === 0 ? 1 : valor === 1 ? 2 : 0;
    
    setAsistencias(prev => ({ ...prev, [cicloSeleccionado]: nuevo }));
  };

  const agregarEstudiante = () => {
    if (!nuevoEstudiante.trim()) return;
    
    const nuevo = { ...datosAsistencia };
    nuevo[nuevoEstudiante.trim()] = Array(cicloActual.semanas).fill(0);
    setAsistencias(prev => ({ ...prev, [cicloSeleccionado]: nuevo }));
    setNuevoEstudiante('');
  };

  const eliminarEstudiante = (estudiante) => {
    const nuevo = { ...datosAsistencia };
    delete nuevo[estudiante];
    setAsistencias(prev => ({ ...prev, [cicloSeleccionado]: nuevo }));
  };

  const calcularTotal = (estudiante) => {
    const registro = datosAsistencia[estudiante] || [];
    return registro.filter(v => v === 1).length;
  };

  const puedeGraduarse = (estudiante) => {
    return calcularTotal(estudiante) === cicloActual.semanas;
  };

  const agregarNuevoCiclo = () => {
    if (!nuevoCiclo.nombre.trim()) return;
    
    const tipo = tipoRuta === 'crece' ? 'crece' : 'efi';
    const nuevoId = `${tipo.charAt(0)}${ciclosData[tipo].length + 1}`;
    
    const cicloNuevo = {
      id: nuevoId,
      nombre: nuevoCiclo.nombre.trim(),
      semanas: parseInt(nuevoCiclo.semanas),
      estudiantes: []
    };
    
    setCiclosData(prev => ({
      ...prev,
      [tipo]: [...prev[tipo], cicloNuevo]
    }));
    
    setMostrarModalNuevoCiclo(false);
    setNuevoCiclo({ nombre: '', semanas: 5 });
    setCicloSeleccionado(nuevoId);
  };

  const descargarDatos = () => {
    const datos = JSON.stringify(asistencias, null, 2);
    const blob = new Blob([datos], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ammi-legacy-asistencia-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const renderAsistencia = (valor) => {
    if (valor === 0) return '○';
    if (valor === 1) return '✓';
    return '✗';
  };

  const colorAsistencia = (valor) => {
    if (valor === 0) return 'bg-gray-100 text-gray-400';
    if (valor === 1) return 'bg-green-100 text-green-700';
    return 'bg-red-100 text-red-700';
  };

  // Calcular estadísticas generales
  const calcularEstadisticas = () => {
    const stats = {
      creceTotales: 0,
      creceGraduados: 0,
      creceEnProgreso: 0,
      efiTotales: 0,
      efiGraduados: 0,
      efiEnProgreso: 0,
      porCiclo: {}
    };

    // CRECE
    ciclosData.crece.forEach(ciclo => {
      const datosC = asistencias[ciclo.id] || {};
      const estudiantes = Object.keys(datosC);
      
      stats.creceTotales += estudiantes.length;
      
      const graduados = estudiantes.filter(e => {
        const registro = datosC[e] || [];
        return registro.filter(v => v === 1).length === ciclo.semanas;
      }).length;
      
      stats.creceGraduados += graduados;
      stats.creceEnProgreso += estudiantes.length - graduados;
      
      stats.porCiclo[ciclo.id] = {
        nombre: ciclo.nombre,
        total: estudiantes.length,
        graduados: graduados,
        enProgreso: estudiantes.length - graduados
      };
    });

    // EFI
    ciclosData.efi.forEach(ciclo => {
      const datosE = asistencias[ciclo.id] || {};
      const estudiantes = Object.keys(datosE);
      
      stats.efiTotales += estudiantes.length;
      
      const graduados = estudiantes.filter(e => {
        const registro = datosE[e] || [];
        return registro.filter(v => v === 1).length === ciclo.semanas;
      }).length;
      
      stats.efiGraduados += graduados;
      stats.efiEnProgreso += estudiantes.length - graduados;
      
      stats.porCiclo[ciclo.id] = {
        nombre: ciclo.nombre,
        total: estudiantes.length,
        graduados: graduados,
        enProgreso: estudiantes.length - graduados
      };
    });

    return stats;
  };

  const stats = calcularEstadisticas();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%)', padding: '1rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '0.5rem' }}>
            🙏 AMMI LEGACY
          </h1>
          <p style={{ color: '#4b5563' }}>Sistema de Asistencia - CRECE y EFI</p>
        </div>

        {/* Selector de Ruta y Ciclo */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
              Selecciona Ruta
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => { setTipoRuta('crece'); setCicloSeleccionado('c1'); }}
                style={{
                  flex: 1,
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  background: tipoRuta === 'crece' ? '#2563eb' : '#d1d5db',
                  color: tipoRuta === 'crece' ? 'white' : '#374151',
                  transition: 'all 0.2s'
                }}
              >
                🎯 CRECE
              </button>
              <button
                onClick={() => { setTipoRuta('efi'); setCicloSeleccionado('e1'); }}
                style={{
                  flex: 1,
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  background: tipoRuta === 'efi' ? '#2563eb' : '#d1d5db',
                  color: tipoRuta === 'efi' ? 'white' : '#374151',
                  transition: 'all 0.2s'
                }}
              >
                📚 EFI
              </button>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
              Selecciona Ciclo
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                value={cicloSeleccionado}
                onChange={(e) => setCicloSeleccionado(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                {ciclosActuales.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
              <button
                onClick={() => setMostrarModalNuevoCiclo(true)}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                + Nuevo
              </button>
            </div>
          </div>
        </div>

        {/* Pestañas */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setVista('registro')}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              background: vista === 'registro' ? '#2563eb' : 'white',
              color: vista === 'registro' ? 'white' : '#374151',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            📝 Registro
          </button>
          <button
            onClick={() => setVista('reportes')}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              background: vista === 'reportes' ? '#2563eb' : 'white',
              color: vista === 'reportes' ? 'white' : '#374151',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            📊 Ciclo
          </button>
          <button
            onClick={() => setVista('estadisticas')}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              background: vista === 'estadisticas' ? '#2563eb' : 'white',
              color: vista === 'estadisticas' ? 'white' : '#374151',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            📈 Estadísticas
          </button>
          <button
            onClick={descargarDatos}
            style={{
              marginLeft: 'auto',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              background: '#16a34a',
              color: 'white',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            ⬇️ Descargar
          </button>
        </div>

        {/* MODAL: NUEVO CICLO */}
        {mostrarModalNuevoCiclo && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              borderRadius: '0.5rem',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
                Crear Nuevo Ciclo de {tipoRuta === 'crece' ? 'CRECE' : 'EFI'}
              </h3>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Nombre del Ciclo
                </label>
                <input
                  type="text"
                  value={nuevoCiclo.nombre}
                  onChange={(e) => setNuevoCiclo({ ...nuevoCiclo, nombre: e.target.value })}
                  placeholder="Ej: Crece Ciclo 5"
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Número de Semanas
                </label>
                <input
                  type="number"
                  value={nuevoCiclo.semanas}
                  onChange={(e) => setNuevoCiclo({ ...nuevoCiclo, semanas: e.target.value })}
                  min="1"
                  max="20"
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setMostrarModalNuevoCiclo(false)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 1rem',
                    background: '#d1d5db',
                    color: '#111827',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={agregarNuevoCiclo}
                  style={{
                    flex: 1,
                    padding: '0.5rem 1rem',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Crear Ciclo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VISTA: REGISTRO */}
        {vista === 'registro' && (
          <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
              {cicloActual.nombre}
            </h2>

            {/* Agregar estudiante */}
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#eff6ff', borderRadius: '0.5rem', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={nuevoEstudiante}
                onChange={(e) => setNuevoEstudiante(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && agregarEstudiante()}
                placeholder="Agregar nuevo estudiante..."
                style={{
                  flex: 1,
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
              <button
                onClick={agregarEstudiante}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                + Agregar
              </button>
            </div>

            {/* Tabla de asistencia */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#2563eb', color: 'white' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Estudiante</th>
                    {Array.from({ length: cicloActual.semanas }, (_, i) => (
                      <th key={i} style={{ padding: '0.75rem', textAlign: 'center' }}>S{i + 1}</th>
                    ))}
                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Total</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(datosAsistencia).map(([estudiante, registro]) => (
                    <tr key={estudiante} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '500', color: '#111827' }}>{estudiante}</td>
                      {registro.map((valor, semana) => (
                        <td key={semana} style={{ padding: '0.75rem', textAlign: 'center' }}>
                          <button
                            onClick={() => toggleAsistencia(estudiante, semana)}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '0.375rem',
                              fontWeight: 'bold',
                              fontSize: '1.125rem',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              background: valor === 0 ? '#f3f4f6' : valor === 1 ? '#dcfce7' : '#fee2e2',
                              color: valor === 0 ? '#9ca3af' : valor === 1 ? '#16a34a' : '#dc2626'
                            }}
                          >
                            {renderAsistencia(valor)}
                          </button>
                        </td>
                      ))}
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <span style={{
                          fontWeight: 'bold',
                          color: calcularTotal(estudiante) === cicloActual.semanas ? '#16a34a' : '#f97316'
                        }}>
                          {calcularTotal(estudiante)}/{cicloActual.semanas}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <button
                          onClick={() => eliminarEstudiante(estudiante)}
                          style={{
                            color: '#dc2626',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.25rem'
                          }}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#4b5563' }}>
              <p>○ = Sin marcar | <span style={{ color: '#16a34a' }}>✓ = Asistió</span> | <span style={{ color: '#dc2626' }}>✗ = No asistió</span></p>
            </div>
          </div>
        )}

        {/* VISTA: REPORTES DEL CICLO */}
        {vista === 'reportes' && (
          <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>
              {cicloActual.nombre} - Reportes
            </h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Resumen General */}
              <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)', borderRadius: '0.5rem', padding: '1rem', border: '1px solid #bfdbfe' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#1e3a8a', marginBottom: '0.75rem' }}>
                  📊 Resumen del Ciclo
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', textAlign: 'center' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Total Estudiantes</p>
                    <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#2563eb' }}>
                      {Object.keys(datosAsistencia).length}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Pueden Graduarse</p>
                    <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#16a34a' }}>
                      {Object.keys(datosAsistencia).filter(e => puedeGraduarse(e)).length}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>En Progreso</p>
                    <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#f97316' }}>
                      {Object.keys(datosAsistencia).filter(e => !puedeGraduarse(e) && calcularTotal(e) > 0).length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Estudiantes que pueden graduarse */}
              <div>
                <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#15803d', marginBottom: '0.75rem' }}>
                  ✅ Pueden Graduarse
                </h3>
                {Object.entries(datosAsistencia).filter(([e]) => puedeGraduarse(e)).length === 0 ? (
                  <p style={{ color: '#6b7280' }}>Aún no hay estudiantes listos para graduarse</p>
                ) : (
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {Object.entries(datosAsistencia)
                      .filter(([e]) => puedeGraduarse(e))
                      .map(([estudiante]) => (
                        <div key={estudiante} style={{
                          background: '#f0fdf4',
                          border: '1px solid #86efac',
                          borderRadius: '0.375rem',
                          padding: '0.75rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{ fontWeight: '500', color: '#111827' }}>{estudiante}</span>
                          <span style={{
                            background: '#16a34a',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            fontWeight: 'bold'
                          }}>
                            {calcularTotal(estudiante)}/{cicloActual.semanas} ✓
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Estudiantes en progreso */}
              <div>
                <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#b45309', marginBottom: '0.75rem' }}>
                  ⏳ En Progreso
                </h3>
                {Object.entries(datosAsistencia).filter(([e]) => !puedeGraduarse(e) && calcularTotal(e) > 0).length === 0 ? (
                  <p style={{ color: '#6b7280' }}>No hay estudiantes en progreso</p>
                ) : (
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {Object.entries(datosAsistencia)
                      .filter(([e]) => !puedeGraduarse(e) && calcularTotal(e) > 0)
                      .map(([estudiante]) => (
                        <div key={estudiante} style={{
                          background: '#fffbeb',
                          border: '1px solid #fde047',
                          borderRadius: '0.375rem',
                          padding: '0.75rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{ fontWeight: '500', color: '#111827' }}>{estudiante}</span>
                          <span style={{
                            background: '#b45309',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            fontWeight: 'bold'
                          }}>
                            {calcularTotal(estudiante)}/{cicloActual.semanas}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VISTA: ESTADÍSTICAS GENERALES */}
        {vista === 'estadisticas' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Resumen General */}
            <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>
                📈 Estadísticas Generales de Ammi Legacy
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {/* CRECE */}
                <div style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', borderRadius: '0.5rem', padding: '1.5rem', border: '2px solid #2563eb' }}>
                  <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#1e3a8a', marginBottom: '1rem' }}>🎯 CRECE</h3>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                      <span style={{ color: '#1e3a8a', fontWeight: '600' }}>Total de Estudiantes:</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>{stats.creceTotales}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                      <span style={{ color: '#15803d', fontWeight: '600' }}>Graduados:</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>{stats.creceGraduados}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#b45309', fontWeight: '600' }}>En Progreso:</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f97316' }}>{stats.creceEnProgreso}</span>
                    </div>
                  </div>
                </div>

                {/* EFI */}
                <div style={{ background: 'linear-gradient(135deg, #dce7f8 0%, #c9d5f4 100%)', borderRadius: '0.5rem', padding: '1.5rem', border: '2px solid #4f46e5' }}>
                  <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#3730a3', marginBottom: '1rem' }}>📚 EFI</h3>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                      <span style={{ color: '#3730a3', fontWeight: '600' }}>Total de Estudiantes:</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4f46e5' }}>{stats.efiTotales}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                      <span style={{ color: '#15803d', fontWeight: '600' }}>Graduados:</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>{stats.efiGraduados}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#b45309', fontWeight: '600' }}>En Progreso:</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f97316' }}>{stats.efiEnProgreso}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desglose por Ciclo */}
              <div>
                <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#111827', marginBottom: '1rem' }}>
                  📊 Desglose por Ciclo
                </h3>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontWeight: '600', color: '#2563eb', marginBottom: '0.75rem' }}>CRECE</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    {ciclosData.crece.map(ciclo => {
                      const statsC = stats.porCiclo[ciclo.id] || { total: 0, graduados: 0, enProgreso: 0 };
                      return (
                        <div key={ciclo.id} style={{
                          background: '#f0f9ff',
                          border: '1px solid #bfdbfe',
                          borderRadius: '0.375rem',
                          padding: '0.75rem'
                        }}>
                          <p style={{ fontWeight: '600', color: '#1e3a8a', marginBottom: '0.5rem' }}>{ciclo.nombre}</p>
                          <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                            <p>Total: <span style={{ fontWeight: 'bold', color: '#2563eb' }}>{statsC.total}</span></p>
                            <p>Graduados: <span style={{ fontWeight: 'bold', color: '#16a34a' }}>{statsC.graduados}</span></p>
                            <p>En Progreso: <span style={{ fontWeight: 'bold', color: '#f97316' }}>{statsC.enProgreso}</span></p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontWeight: '600', color: '#4f46e5', marginBottom: '0.75rem' }}>EFI</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    {ciclosData.efi.map(ciclo => {
                      const statsE = stats.porCiclo[ciclo.id] || { total: 0, graduados: 0, enProgreso: 0 };
                      return (
                        <div key={ciclo.id} style={{
                          background: '#f3f0ff',
                          border: '1px solid #d8cff8',
                          borderRadius: '0.375rem',
                          padding: '0.75rem'
                        }}>
                          <p style={{ fontWeight: '600', color: '#3730a3', marginBottom: '0.5rem' }}>{ciclo.nombre}</p>
                          <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                            <p>Total: <span style={{ fontWeight: 'bold', color: '#4f46e5' }}>{statsE.total}</span></p>
                            <p>Graduados: <span style={{ fontWeight: 'bold', color: '#16a34a' }}>{statsE.graduados}</span></p>
                            <p>En Progreso: <span style={{ fontWeight: 'bold', color: '#f97316' }}>{statsE.enProgreso}</span></p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
