import React, { useMemo, useState } from 'react';
import { FileSpreadsheet, TrendingUp } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('sales');

  const { data: sales, loading: salesLoading } = useApi('/ventas/historial');
  const { data: inventoryValue, loading: inventoryLoading } = useApi('/inventario/reporte-valor');
  const { data: products, loading: productsLoading } = useApi('/catalogo');

  const isLoading = salesLoading || inventoryLoading || productsLoading;

  const totalRevenue = useMemo(() => {
    if (!sales) return 0;
    return sales.reduce((sum, sale) => sum + sale.total, 0);
  }, [sales]);

  const totalItems = useMemo(() => {
    if (!sales) return 0;
    return sales.reduce((sum, sale) => sum + (sale.items?.length ?? 0), 0);
  }, [sales]);

  const exportToExcel = () => {
    if (selectedReport === 'sales') {
      if (!sales || sales.length === 0) {
        alert('No hay ventas para exportar');
        return;
      }

      const data = sales.map((sale) => ({
        factura: sale.id_factura,
        fecha: sale.fecha,
        cliente: sale.cliente_id,
        total: sale.total,
        items: sale.items?.length ?? 0
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, 'reporte_ventas.xlsx');
    } else {
      if (!products || products.length === 0) {
        alert('No hay productos para exportar');
        return;
      }

      const data = products.map((product) => ({
        id: product.id,
        nombre: product.nombre,
        codigo: product.codigoBarras,
        categoria: product.categoria,
        precio: product.precio,
        stock: product.stock
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, 'reporte_inventario.xlsx');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Cargando reporte...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 overflow-hidden">
        <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Reportes</h2>
              <button
                onClick={exportToExcel}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <FileSpreadsheet size={16} />
                <span>Exportar Excel</span>
              </button>
            </div>

            <div className="flex space-x-4">
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="sales">Ventas</option>
                <option value="inventory">Inventario</option>
              </select>
            </div>
          </div>

          {selectedReport === 'sales' && (
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp size={20} />
                  </div>
                  <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                  <div className="text-slate-200 text-sm">Ingresos Totales</div>
                </div>
                <div className="bg-slate-700 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp size={20} />
                  </div>
                  <div className="text-2xl font-bold">{totalItems}</div>
                  <div className="text-slate-200 text-sm">Lineas facturadas</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-auto">
            {selectedReport === 'sales' ? (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Factura</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Fecha</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Cliente</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sales?.map((sale) => (
                    <tr key={sale.id_factura} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{sale.id_factura}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(sale.fecha).toLocaleString('es-ES')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{sale.cliente_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${sale.total.toFixed(2)}</td>
                    </tr>
                  ))}
                  {(!sales || sales.length === 0) && (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        No hay ventas registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <div className="p-6 space-y-6">
                <div className="bg-slate-700 text-white p-4 rounded-lg">
                  <div className="text-sm text-slate-200">Valor total inventario</div>
                  <div className="text-2xl font-bold">
                    ${Number(inventoryValue?.valor_total_inventario ?? 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-slate-200">{inventoryValue?.items ?? 0} productos</div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">ID</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Producto</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Categoria</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Precio</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products?.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{product.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{product.nombre}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{product.categoria}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">${product.precio.toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{product.stock}</td>
                        </tr>
                      ))}
                      {(!products || products.length === 0) && (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                            No hay productos registrados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-80 bg-white shadow-lg border-l border-gray-200">
        <div className="p-6 h-full overflow-y-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Resumen</h3>
          <div className="space-y-4 text-sm text-gray-700">
            <p>Reporte seleccionado: {selectedReport === 'sales' ? 'Ventas' : 'Inventario'}</p>
            <p>Total ventas: {sales?.length ?? 0}</p>
            <p>Productos en catalogo: {products?.length ?? 0}</p>
            <p>Valor inventario: ${Number(inventoryValue?.valor_total_inventario ?? 0).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
