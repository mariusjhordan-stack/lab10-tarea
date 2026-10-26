import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert.jsx'
import { Button } from './ui/button.jsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card.jsx'
import { Input } from './ui/input.jsx'
import { Label } from './ui/label.jsx'

const emptyForm = { description: '', price: '', category: '' }

function ProductForm({
  onAddProduct,
  editingProduct,
  onUpdateProduct,
  onCancelEdit,
}) {
  const [form, setForm] = useState(() =>
    editingProduct
      ? {
          description: editingProduct.description,
          price: String(editingProduct.price),
          category: editingProduct.category,
        }
      : emptyForm,
  )
  const [errors, setErrors] = useState({})
  const [confirmation, setConfirmation] = useState('')

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
    setErrors((currentErrors) =>
      Object.fromEntries(
        Object.entries(currentErrors).filter(([field]) => field !== name),
      ),
    )
    setConfirmation('')
  }

  const clearForm = () => {
    setForm(emptyForm)
    setErrors({})
    setConfirmation('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const description = form.description.trim()
    const category = form.category.trim()
    const price = Number(form.price)
    const nextErrors = {}

    if (!description) {
      nextErrors.description = 'La descripción es obligatoria.'
    } else if (description.length < 3) {
      nextErrors.description = 'Ingresa al menos 3 caracteres.'
    }

    if (form.price.trim() === '' || !Number.isFinite(price) || price <= 0) {
      nextErrors.price = 'Ingresa un precio válido mayor que cero.'
    }

    if (!category) {
      nextErrors.category = 'La categoría es obligatoria.'
    }

    setErrors(nextErrors)
    setConfirmation('')

    if (Object.keys(nextErrors).length > 0) return

    if (editingProduct) {
      onUpdateProduct({ description, price, category }, editingProduct.code)
    } else {
      const code = onAddProduct({ description, price, category })
      setConfirmation(`Producto ${code} registrado correctamente.`)
      setForm(emptyForm)
    }
    setErrors({})
  }

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <CardHeader className="gap-1 border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
          <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <CardTitle className="text-base font-semibold text-slate-900">
          {editingProduct ? 'Editar producto' : 'Registrar producto'}
        </CardTitle>
        <CardDescription className="text-sm text-slate-500">
          {editingProduct
            ? `Actualiza los datos de ${editingProduct.code}.`
            : 'Completa los datos para agregarlo al catálogo.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-5 py-5 sm:px-6">
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm text-slate-700">
              Descripción <span className="text-rose-600">*</span>
            </Label>
            <Input
              id="description"
              name="description"
              value={form.description}
              onChange={updateField}
              placeholder="Ej. Teclado inalámbrico"
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? 'description-error' : undefined}
              className="h-10 rounded-lg border-slate-200 bg-white px-3 text-sm"
            />
            {errors.description && (
              <p id="description-error" className="text-xs text-rose-600">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm text-slate-700">
              Precio de venta <span className="text-rose-600">*</span>
            </Label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-500">
                S/
              </span>
              <Input
                id="price"
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                value={form.price}
                onChange={updateField}
                placeholder="0.00"
                aria-invalid={Boolean(errors.price)}
                aria-describedby={errors.price ? 'price-error' : undefined}
                className="h-10 rounded-lg border-slate-200 bg-white pl-7 text-sm"
              />
            </div>
            {errors.price && (
              <p id="price-error" className="text-xs text-rose-600">{errors.price}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm text-slate-700">
              Categoría <span className="text-rose-600">*</span>
            </Label>
            <Input
              id="category"
              name="category"
              value={form.category}
              onChange={updateField}
              placeholder="Ej. Tecnología"
              aria-invalid={Boolean(errors.category)}
              aria-describedby={errors.category ? 'category-error' : undefined}
              className="h-10 rounded-lg border-slate-200 bg-white px-3 text-sm"
            />
            {errors.category && (
              <p id="category-error" className="text-xs text-rose-600">{errors.category}</p>
            )}
          </div>

          <div className="space-y-3 pt-1">
            <Button
              type="submit"
              className="h-10 w-full rounded-lg bg-indigo-700 px-4 text-sm text-white hover:bg-indigo-800"
            >
              <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
                {editingProduct
                  ? <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  : <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
              </svg>
              {editingProduct ? 'Guardar cambios' : 'Registrar producto'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={clearForm}
              className="h-10 w-full rounded-lg border-slate-200 bg-white px-4 text-sm text-slate-700 hover:bg-slate-50"
            >
              Limpiar
            </Button>
            {editingProduct && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancelEdit}
                className="h-9 w-full rounded-lg text-sm text-slate-600"
              >
                Cancelar edición
              </Button>
            )}
          </div>

          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive" className="border-rose-200 bg-rose-50 text-rose-800">
              <AlertTitle className="text-sm">Revisa los datos</AlertTitle>
              <AlertDescription className="text-xs text-rose-700">
                Corrige los campos indicados antes de guardar.
              </AlertDescription>
            </Alert>
          )}

          {confirmation && (
            <Alert className="border-indigo-200 bg-indigo-50 text-indigo-800">
              <AlertTitle className="text-sm">Registro exitoso</AlertTitle>
              <AlertDescription className="text-xs text-indigo-700" aria-live="polite">
                {confirmation}
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

export default ProductForm
