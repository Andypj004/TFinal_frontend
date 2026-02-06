import React, { useMemo } from 'react';
import { FileText, DollarSign, Package, AlertTriangle, ShoppingCart } from 'lucide-react';
import MetricCard from './MetricCard';
import { useApi } from '../hooks/useApi';

const Dashboard = () => {
  const { data: products, loading: productsLoading } = useApi('/catalogo');
  const { data: inventoryValue, loading: inventoryLoading } = useApi('/inventario/reporte-valor');
  const { data: sales, loading: salesLoading } = useApi('/ventas/historial');
  const { data: alerts, loading: alertsLoading } = useApi('/inventario/alertas?limite=5');

  const isLoading = productsLoading || inventoryLoading || salesLoading || alertsLoading;

  const money = useMemo(
    () => new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }),
    []
  );

  const recentSales = useMemo(() => {
    if (!sales) return [];
    return [...sales]
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, 6);
  }, [sales]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MetricCard
            icon={DollarSign}
            value={money.format(inventoryValue?.valor_total_inventario ?? 0)}
            label="Valor inventario"
          />
          <MetricCard
            icon={Package}
            value={(products?.length ?? 0).toString()}
            label="Productos registrados"
            className="bg-slate-600"
          />
          <MetricCard
            icon={ShoppingCart}
            value={(sales?.length ?? 0).toString()}
            label="Ventas registradas"
            className="bg-slate-600"
          />
          <MetricCard
            icon={AlertTriangle}
            value={(alerts?.length ?? 0).toString()}
            label="Alertas de stock"
            className="bg-orange-600"
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Ventas recientes</h2>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Factura</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Cliente</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Fecha</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentSales.map((sale) => (
                  <tr key={sale.id_factura} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{sale.id_factura}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{sale.cliente_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(sale.fecha).toLocaleString('es-ES')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{money.format(sale.total)}</td>
                  </tr>
                ))}
                {recentSales.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No hay ventas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="w-80 bg-white shadow-lg border-l border-gray-200">
        <div className="p-6 h-full flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Stock bajo</h3>
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">
                <div>Producto</div>
                <div>Cantidad</div>
              </div>
              {alerts?.map((item) => (
                <div key={item.id} className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                  <div className="text-sm text-gray-900">{item.nombre}</div>
                  <div className="text-sm text-gray-900">{item.stock}</div>
                </div>
              ))}
              {(!alerts || alerts.length === 0) && (
                <div className="text-center text-gray-500 py-8">
                  Sin alertas de stock.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
