import { useMemo, useState } from 'react'
import { Button } from './ui/button.jsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card.jsx'
import { Input } from './ui/input.jsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table.jsx'

const currencyFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
})

function ProductTable({ products, onEditProduct, onDeleteProduct, onExportProducts }) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortBy, setSortBy] = useState('code')
  const [confirmingCode, setConfirmingCode] = useState(null)

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))]
      .sort((first, second) => first.localeCompare(second)),
    [products],
  )

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('es')
    return products
      .filter((product) => {
        const matchesSearch = `${product.code} ${product.description} ${product.category}`
          .toLocaleLowerCase('es')
          .includes(normalizedSearch)
        return matchesSearch && (!categoryFilter || product.category === categoryFilter)
      })
      .sort((first, second) => {
        if (sortBy === 'price-asc') return first.price - second.price
        if (sortBy === 'price-desc') return second.price - first.price
        if (sortBy === 'description') return first.description.localeCompare(second.description, 'es')
        return first.code.localeCompare(second.code, 'es')
      })
  }, [categoryFilter, products, search, sortBy])

  const clearFilters = () => {
    setSearch('')
    setCategoryFilter('')
    setSortBy('code')
  }

  return (
    <Card className="inventory-card">
      <CardHeader className="inventory-card-heading">
        <div>
          <p className="panel-kicker">GESTIÓN DE PRODUCTOS</p>
          <CardTitle className="inventory-title">Todos los productos</CardTitle>
          <CardDescription className="inventory-description">
            Busca, filtra y administra las existencias de tu catálogo.
          </CardDescription>
        </div>
        <div className="inventory-actions">
          <span className="result-count">{visibleProducts.length} <span>de {products.length} productos</span></span>
          <Button
            type="button"
            variant="outline"
            onClick={onExportProducts}
            className="export-button"
            disabled={products.length === 0}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 15v4h14v-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Exportar CSV
          </Button>
        </div>
      </CardHeader>

      <div className="inventory-toolbar">
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="none" className="search-icon" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7" />
            <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <Input
            aria-label="Buscar productos"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar código o descripción"
            className="search-input"
          />
        </div>

        <select
          aria-label="Filtrar por categoría"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="filter-select"
        >
          <option value="">Todas las categorías</option>
          {categories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>

        <select
          aria-label="Ordenar productos"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="filter-select"
        >
          <option value="code">Ordenar: código</option>
          <option value="description">Ordenar: nombre</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
        </select>

        <Button
          type="button"
          variant="outline"
          onClick={clearFilters}
          className="clear-filters"
        >
          Limpiar filtros
        </Button>
      </div>

      <CardContent className="table-scroll">
        <Table className="inventory-table">
          <TableHeader className="table-header">
            <TableRow className="table-heading-row">
              <TableHead className="table-heading code-column">
                Código
              </TableHead>
              <TableHead className="table-heading">
                Descripción
              </TableHead>
              <TableHead className="table-heading text-right">
                Precio
              </TableHead>
              <TableHead className="table-heading">
                Categoría
              </TableHead>
              <TableHead className="table-heading text-center">
                Stock
              </TableHead>
              <TableHead className="table-heading actions-column">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleProducts.map((product) => (
              <TableRow key={product.code} className="product-row">
                <TableCell className="code-cell">
                  {product.code}
                </TableCell>
                <TableCell className="description-cell">
                  <span className="product-monogram" aria-hidden="true">
                    {product.description.slice(0, 1).toLocaleUpperCase('es')}
                  </span>
                  <span className="product-description">{product.description}</span>
                </TableCell>
                <TableCell className="price-cell">
                  {currencyFormatter.format(product.price)}
                </TableCell>
                <TableCell>
                  <span className="category-chip">
                    {product.category}
                  </span>
                </TableCell>
                <TableCell className="stock-cell">
                  <span className={`stock-pill ${product.stock <= 5 ? 'stock-low' : 'stock-healthy'}`}>
                    <i />{product.stock} {product.stock === 1 ? 'unidad' : 'unidades'}
                  </span>
                </TableCell>
                <TableCell className="actions-cell">
                  {confirmingCode === product.code ? (
                    <div className="delete-confirm" role="group" aria-label={`Confirmar eliminación de ${product.description}`}>
                      <span>¿Eliminar?</span>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setConfirmingCode(null)}
                        className="confirm-no"
                      >
                        No
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          onDeleteProduct(product.code)
                          setConfirmingCode(null)
                        }}
                        className="confirm-yes"
                      >
                        Sí, eliminar
                      </Button>
                    </div>
                  ) : (
                    <div className="row-actions">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onEditProduct(product)}
                        aria-label={`Editar ${product.description}`}
                        className="row-action edit-action"
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setConfirmingCode(product.code)}
                        aria-label={`Eliminar ${product.description}`}
                        className="row-action delete-action"
                      >
                        Eliminar
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {visibleProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="empty-table">
                  {products.length === 0
                    ? 'Todavía no hay productos en el catálogo.'
                    : 'No se encontraron productos con esos filtros.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default ProductTable
