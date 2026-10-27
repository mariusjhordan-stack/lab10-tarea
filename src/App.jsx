import { useMemo, useState } from 'react'
import ProductForm from './components/ProductForm.jsx'
import ProductTable from './components/ProductTable.jsx'
import { initialProducts } from './data/products.js'
import './App.css'

const STORAGE_KEY = 'nexo-inventory-products'

const currencyFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
})

function loadProducts() {
  try {
    const storedProducts = window.localStorage.getItem(STORAGE_KEY)
    if (!storedProducts) return initialProducts

    const parsedProducts = JSON.parse(storedProducts)
    if (!Array.isArray(parsedProducts)) {
      throw new Error('El formato guardado no es una lista de productos.')
    }

    return parsedProducts.map((product) => ({
      ...product,
      stock: Number.isInteger(product.stock) && product.stock >= 0 ? product.stock : 0,
    }))
  } catch (error) {
    console.error('No se pudieron cargar los productos guardados.', error)
    return initialProducts
  }
}

function App() {
  const [products, setProducts] = useState(loadProducts)
  const [editingProduct, setEditingProduct] = useState(null)
  const [storageError, setStorageError] = useState(false)

  const persistProducts = (nextProducts) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProducts))
      setStorageError(false)
    } catch (error) {
      console.error('No se pudieron guardar los cambios del inventario.', error)
      setStorageError(true)
    }
  }

  const addProduct = (productDetails) => {
    const usedCodes = new Set(products.map((product) => product.code))
    let nextNumber = 1
    let code = `PRD-${String(nextNumber).padStart(3, '0')}`
    while (usedCodes.has(code)) {
      nextNumber += 1
      code = `PRD-${String(nextNumber).padStart(3, '0')}`
    }
    const nextProducts = [
      { ...productDetails, code },
      ...products,
    ]
    setProducts(nextProducts)
    persistProducts(nextProducts)
    return code
  }

  const updateProduct = (productDetails, code) => {
    const nextProducts = products.map((product) =>
      product.code === code ? { ...productDetails, code } : product,
    )
    setProducts(nextProducts)
    persistProducts(nextProducts)
    setEditingProduct(null)
  }

  const deleteProduct = (code) => {
    const nextProducts = products.filter((product) => product.code !== code)
    setProducts(nextProducts)
    persistProducts(nextProducts)
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

  const inventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0,
  )
  const totalUnits = products.reduce((total, product) => total + product.stock, 0)
  const lowStockCount = products.filter((product) => product.stock <= 5).length
  const today = new Intl.DateTimeFormat('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

  const exportProducts = () => {
    const headers = ['Código', 'Descripción', 'Categoría', 'Precio (PEN)', 'Unidades']
    const rows = products.map((product) => [
      product.code,
      product.description,
      product.category,
      product.price.toFixed(2),
      product.stock,
    ])
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
      .join('\n')
    const file = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
    const downloadUrl = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `nexo-inventario-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.append(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#inicio" aria-label="TECSUP, inicio">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="m4.5 7.7 7.5 4.2 7.5-4.2M12 12v8.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="brand-name">TECSUP<small>INVENTARIO</small></span>
        </a>

        <p className="nav-caption">ESPACIO DE TRABAJO</p>
        <nav className="side-nav" aria-label="Navegación principal">
          <a className="nav-link" href="#inicio">
            <span className="nav-icon" aria-hidden="true">⌂</span> Resumen
          </a>
          <a className="nav-link active" href="#inventario" aria-current="page">
            <span className="nav-icon" aria-hidden="true">▦</span> Inventario
            <span className="nav-count">{products.length}</span>
          </a>
          <a className="nav-link" href="#categorias">
            <span className="nav-icon" aria-hidden="true">◫</span> Categorías
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="workspace-card">
            <span className="workspace-avatar">T</span>
            <span><strong>TECSUP</strong><small>Gestión de inventario</small></span>
            <span className="workspace-dots" aria-hidden="true">···</span>
          </div>
          <p className="sidebar-footnote">Sistema de gestión de inventario</p>
        </div>
      </aside>

      <div className="main-area" id="inicio">
        <header className="topbar">
          <div className="breadcrumb"><span>Causa</span><span>/</span><strong>Operaciones</strong></div>
          <div className="topbar-right">
            <span className="system-status"><i /> Sistema operativo</span>
            <span className="user-avatar" aria-label="Perfil de usuario">JS</span>
          </div>
        </header>

        <main className="page-content">
          <section className="page-heading">
            <div>
              <p className="eyebrow">{today}</p>
              <h1>Inventario <span>en orden.</span></h1>
              <p className="page-subtitle">Una vista clara de tus productos, existencias y valor comercial.</p>
            </div>
            <a className="primary-link" href="#nuevo-producto">
              <span aria-hidden="true">＋</span> Nuevo producto
            </a>
          </section>

          {storageError && (
            <div className="storage-warning" role="alert">
              No se pudieron guardar los cambios en este navegador. Revisa el espacio de almacenamiento disponible.
            </div>
          )}

          <section className="metrics-grid" aria-label="Indicadores del inventario">
            <article className="metric-card">
              <div className="metric-top"><span className="metric-icon icon-violet">▦</span><span className="metric-label">CATÁLOGO</span></div>
              <strong className="metric-value">{products.length.toLocaleString('es-PE')}</strong>
              <span className="metric-note">productos registrados</span>
            </article>
            <article className="metric-card">
              <div className="metric-top"><span className="metric-icon icon-mint">▤</span><span className="metric-label">EXISTENCIAS</span></div>
              <strong className="metric-value">{totalUnits.toLocaleString('es-PE')}</strong>
              <span className="metric-note">unidades en almacén</span>
            </article>
            <article className="metric-card">
              <div className="metric-top"><span className="metric-icon icon-amber">◷</span><span className="metric-label">STOCK BAJO</span></div>
              <strong className="metric-value">{lowStockCount}</strong>
              <span className="metric-note">productos con 5 unidades o menos</span>
            </article>
            <article className="metric-card metric-highlight">
              <div className="metric-top"><span className="metric-icon icon-light">S/</span><span className="metric-label">VALOR DE STOCK</span></div>
              <strong className="metric-value">{currencyFormatter.format(inventoryValue)}</strong>
              <span className="metric-note">precio por unidades disponibles</span>
            </article>
          </section>

          <section className="overview-grid">
            <div className="panel form-panel" id="nuevo-producto">
              <div className="panel-heading">
                <div><p className="panel-kicker">CATÁLOGO</p><h2>{editingProduct ? 'Editar producto' : 'Añadir producto'}</h2></div>
                <span className="panel-heading-icon" aria-hidden="true">＋</span>
              </div>
              <ProductForm
                key={editingProduct?.code ?? 'new-product'}
                onAddProduct={addProduct}
                editingProduct={editingProduct}
                onUpdateProduct={updateProduct}
                onCancelEdit={() => setEditingProduct(null)}
              />
            </div>

            <div className="panel category-panel" id="categorias">
              <div className="panel-heading">
                <div><p className="panel-kicker">COMPOSICIÓN</p><h2>Productos por categoría</h2></div>
                <span className="subtle-count">{categoryData.length} categorías</span>
              </div>
              {categoryData.length === 0 ? (
                <div className="empty-chart">Añade productos para visualizar la composición del catálogo.</div>
              ) : (
                <div className="category-list">
                  {categoryData.map(({ category, count }, index) => {
                    const percentage = Math.round((count / products.length) * 100)
                    return (
                      <div className="category-item" key={category}>
                        <div className="category-row">
                          <span className={`category-dot category-dot-${index % 4}`} />
                          <span className="category-name">{category}</span>
                          <span className="category-total">{count} <small>{percentage}%</small></span>
                        </div>
                        <div className="category-track" role="img" aria-label={`${category}: ${count} productos, ${percentage}%`}>
                          <span className={`category-fill category-fill-${index % 4}`} style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </section>

          <section id="inventario" className="inventory-section">
            <ProductTable
              products={products}
              onEditProduct={setEditingProduct}
              onDeleteProduct={deleteProduct}
              onExportProducts={exportProducts}
            />
          </section>

          <footer className="page-footer">
            <span>Panel de inventario</span>
            <span>Datos guardados en este navegador · Vista de demostración</span>
            <span>Jhordan Sullca Avalos</span>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default App
