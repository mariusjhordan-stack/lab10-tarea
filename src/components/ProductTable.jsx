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

function ProductTable({ products, onEditProduct, onDeleteProduct }) {
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
        const matchesSearch = `${product.code} ${product.description}`
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
    <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <CardHeader className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
        <div>
          <CardTitle className="text-base font-semibold text-slate-900">Productos registrados</CardTitle>
          <CardDescription className="mt-1 text-sm text-slate-500">
            Busca, filtra, ordena y administra el catálogo.
          </CardDescription>
        </div>
        <span className="w-fit shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          {visibleProducts.length} de {products.length} productos
        </span>
      </CardHeader>

      <div className="grid gap-3 border-b border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-2 lg:grid-cols-[minmax(180px,1fr)_minmax(150px,0.7fr)_minmax(165px,0.8fr)_auto] sm:px-6">
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="none" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7" />
            <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <Input
            aria-label="Buscar productos"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar código o descripción"
            className="h-10 rounded-lg border-slate-200 bg-white pl-9 text-sm"
          />
        </div>

        <select
          aria-label="Filtrar por categoría"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"
        >
          <option value="">Todas las categorías</option>
          {categories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>

        <select
          aria-label="Ordenar productos"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"
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
          className="h-10 rounded-lg border-slate-200 bg-white px-3 text-sm text-slate-600"
        >
          Limpiar filtros
        </Button>
      </div>

      <CardContent className="p-0">
        <Table className="min-w-[760px] text-sm">
          <TableHeader className="bg-slate-50/80">
            <TableRow className="border-slate-100 hover:bg-slate-50/80">
              <TableHead className="h-11 pl-5 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:pl-6">
                Código
              </TableHead>
              <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Descripción
              </TableHead>
              <TableHead className="h-11 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Precio
              </TableHead>
              <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Categoría
              </TableHead>
              <TableHead className="h-11 pr-5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 sm:pr-6">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleProducts.map((product) => (
              <TableRow key={product.code} className="border-slate-100 hover:bg-indigo-50/30">
                <TableCell className="py-4 pl-5 font-mono text-xs font-medium text-slate-500 sm:pl-6">
                  {product.code}
                </TableCell>
                <TableCell className="max-w-56 whitespace-normal py-4 font-medium text-slate-800">
                  {product.description}
                </TableCell>
                <TableCell className="py-4 text-right font-medium tabular-nums text-slate-800">
                  {currencyFormatter.format(product.price)}
                </TableCell>
                <TableCell className="py-4">
                  <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-800">
                    {product.category}
                  </span>
                </TableCell>
                <TableCell className="py-3 pr-5 text-right sm:pr-6">
                  {confirmingCode === product.code ? (
                    <div className="flex items-center justify-end gap-1.5" role="group" aria-label={`Confirmar eliminación de ${product.description}`}>
                      <span className="mr-1 text-xs text-slate-600">¿Eliminar?</span>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setConfirmingCode(null)}
                        className="h-8 rounded-md border-slate-200 px-2 text-xs"
                      >
                        No
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          onDeleteProduct(product.code)
                          setConfirmingCode(null)
                        }}
                        className="h-8 rounded-md bg-rose-600 px-2 text-xs text-white hover:bg-rose-700"
                      >
                        Sí, eliminar
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onEditProduct(product)}
                        aria-label={`Editar ${product.description}`}
                        className="h-8 rounded-md px-2 text-xs text-indigo-700 hover:bg-indigo-50"
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setConfirmingCode(product.code)}
                        aria-label={`Eliminar ${product.description}`}
                        className="h-8 rounded-md px-2 text-xs text-rose-700 hover:bg-rose-50"
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
                <TableCell colSpan={5} className="h-28 text-center text-sm text-slate-500">
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
