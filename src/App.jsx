import { useMemo, useState } from 'react'
import ProductForm from './components/ProductForm.jsx'
import ProductTable from './components/ProductTable.jsx'
import { initialProducts } from './data/products.js'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './components/ui/card.jsx'

function App() {
  const [products, setProducts] = useState(initialProducts)
  const [editingProduct, setEditingProduct] = useState(null)

  const addProduct = (productDetails) => {
    const usedCodes = new Set(products.map((product) => product.code))
    let nextNumber = 1
    let code = `PRD-${String(nextNumber).padStart(3, '0')}`

    while (usedCodes.has(code)) {
      nextNumber += 1
      code = `PRD-${String(nextNumber).padStart(3, '0')}`
    }

    setProducts((currentProducts) => [
      { ...productDetails, code },
      ...currentProducts,
    ])

    return code
  }

  const updateProduct = (productDetails, code) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.code === code ? { ...productDetails, code } : product,
      ),
    )
    setEditingProduct(null)
  }

  const deleteProduct = (code) => {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.code !== code),
    )
    if (editingProduct?.code === code) setEditingProduct(null)
  }

  const categoryData = useMemo(() => {
    const counts = products.reduce((result, product) => {
      result[product.category] = (result[product.category] ?? 0) + 1
      return result
    }, {})

    return Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .sort((first, second) => second.count - first.count || first.category.localeCompare(second.category))
  }, [products])

  const inventoryValue = products.reduce((total, product) => total + product.price, 0)
  const currencyFormatter = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  })

  return (
    <div className="min-h-screen bg-[#f4f7fc] text-slate-900">
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#" className="flex items-center gap-3" aria-label="Inicio">
            <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-700 text-white shadow-sm shadow-indigo-900/15">
              <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
                <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                <path d="m4.5 7.7 7.5 4.2 7.5-4.2M12 12v8.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              </svg>
            </span>
            <span>
              <span className="block text-sm font-bold tracking-tight text-slate-900">Nexo Comercial</span>
              <span className="block text-xs text-slate-500">Panel de administración</span>
            </span>
          </a>
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-800">
            <span className="size-1.5 rounded-full bg-indigo-600" />
            Modo de demostración
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
        <section className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">
            Inventario
          </p>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Gestión de productos
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Administra el catálogo de tu empresa. Registra productos y consulta
                sus detalles en un solo lugar.
              </p>
            </div>
            <div className="flex w-fit items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
                  <path d="M5 6.5h14v13H5zM8 3.5v6M16 3.5v6M5 10h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>
                <span className="block text-lg font-semibold leading-5">{products.length}</span>
                <span className="block text-xs text-slate-500">Productos</span>
              </span>
            </div>
          </div>
        </section>

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Productos en catálogo</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{products.length}</p>
            <p className="mt-1 text-xs text-slate-500">Registros disponibles en esta sesión</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Categorías activas</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{categoryData.length}</p>
            <p className="mt-1 text-xs text-slate-500">Clasificaciones en el catálogo</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Valor del inventario</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-indigo-700">
              {currencyFormatter.format(inventoryValue)}
            </p>
            <p className="mt-1 text-xs text-slate-500">Suma de precios, sin persistencia</p>
          </div>
        </section>

        <section className="mb-6 grid items-start gap-6 lg:grid-cols-[minmax(280px,0.78fr)_minmax(0,1.6fr)]">
          <ProductForm
            key={editingProduct?.code ?? 'new-product'}
            onAddProduct={addProduct}
            editingProduct={editingProduct}
            onUpdateProduct={updateProduct}
            onCancelEdit={() => setEditingProduct(null)}
          />
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-900">Productos por categoría</CardTitle>
              <CardDescription className="text-sm text-slate-500">
                Distribución actual de los productos registrados.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {categoryData.length === 0 ? (
                <p className="py-4 text-sm text-slate-500">Agrega productos para ver la distribución.</p>
              ) : categoryData.map(({ category, count }) => {
                const percentage = Math.round((count / products.length) * 100)
                return (
                  <div key={category}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-slate-700">{category}</span>
                      <span className="text-xs tabular-nums text-slate-500">{count} · {percentage}%</span>
                    </div>
                    <div
                      className="h-2.5 overflow-hidden rounded-full bg-indigo-50"
                      role="img"
                      aria-label={`${category}: ${count} productos, ${percentage}%`}
                    >
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </section>

        <ProductTable
          products={products}
          onEditProduct={setEditingProduct}
          onDeleteProduct={deleteProduct}
        />

        <p className="mt-6 text-center text-xs text-slate-500">
S        </p>
      </main>
    </div>
  )
}

export default App
