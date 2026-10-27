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

const emptyForm = { description: '', price: '', category: '', stock: '' }

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
          stock: String(editingProduct.stock ?? 0),
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
    const stock = Number(form.stock)
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

    if (form.stock.trim() === '' || !Number.isInteger(stock) || stock < 0) {
      nextErrors.stock = 'Ingresa una cantidad entera igual o mayor que cero.'
    }

    setErrors(nextErrors)
    setConfirmation('')

    if (Object.keys(nextErrors).length > 0) return

    if (editingProduct) {
      onUpdateProduct({ description, price, category, stock }, editingProduct.code)
    } else {
      const code = onAddProduct({ description, price, category, stock })
      setConfirmation(`Producto ${code} registrado correctamente.`)
      setForm(emptyForm)
    }
    setErrors({})
  }

  return (
    <Card className="product-form-card">
      <CardHeader className="form-card-heading">
        <CardTitle className="form-card-title">
          {editingProduct ? 'Editar producto' : 'Registrar producto'}
        </CardTitle>
        <CardDescription className="form-card-description">
          {editingProduct
            ? `Actualiza los datos de ${editingProduct.code}.`
            : 'Completa los datos para agregarlo al catálogo.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="form-card-content">
        <form className="product-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <Label htmlFor="description" className="form-label">
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
              className="form-input"
            />
            {errors.description && (
              <p id="description-error" className="text-xs text-rose-600">{errors.description}</p>
            )}
          </div>

          <div className="form-field">
            <Label htmlFor="price" className="form-label">
              Precio de venta <span className="text-rose-600">*</span>
            </Label>
            <div className="relative">
              <span className="currency-prefix">
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
                className="form-input currency-input"
              />
            </div>
            {errors.price && (
              <p id="price-error" className="text-xs text-rose-600">{errors.price}</p>
            )}
          </div>

          <div className="form-field">
            <Label htmlFor="category" className="form-label">
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
              className="form-input"
            />
            {errors.category && (
              <p id="category-error" className="text-xs text-rose-600">{errors.category}</p>
            )}
          </div>

          <div className="form-field">
            <Label htmlFor="stock" className="form-label">
              Unidades disponibles <span className="text-rose-600">*</span>
            </Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={form.stock}
              onChange={updateField}
              placeholder="Ej. 24"
              aria-invalid={Boolean(errors.stock)}
              aria-describedby={errors.stock ? 'stock-error' : undefined}
              className="form-input"
            />
            {errors.stock && (
              <p id="stock-error" className="field-error">{errors.stock}</p>
            )}
          </div>

          <div className="form-actions">
            <Button
              type="submit"
              className="form-submit"
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
              className="form-clear"
            >
              Limpiar
            </Button>
            {editingProduct && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancelEdit}
                className="form-cancel"
              >
                Cancelar edición
              </Button>
            )}
          </div>

          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive" className="form-alert form-alert-error">
              <AlertTitle>Revisa los datos</AlertTitle>
              <AlertDescription>
                Corrige los campos indicados antes de guardar.
              </AlertDescription>
            </Alert>
          )}

          {confirmation && (
            <Alert className="form-alert form-alert-success">
              <AlertTitle>Registro exitoso</AlertTitle>
              <AlertDescription aria-live="polite">
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
