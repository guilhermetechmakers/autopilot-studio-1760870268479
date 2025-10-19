import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/templateEngine';
import type { PricingTable, PricingItem } from '@/types/proposal';

interface PricingTableBuilderProps {
  value: PricingTable;
  onChange: (value: PricingTable) => void;
}

export function PricingTableBuilder({ value, onChange }: PricingTableBuilderProps) {
  const [newItem, setNewItem] = useState<Partial<PricingItem>>({
    description: '',
    quantity: 1,
    unit_price: 0,
  });

  const calculateItemTotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  const calculateSubtotal = () => {
    return value.items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTaxAmount = () => {
    if (!value.tax_rate) return 0;
    return calculateSubtotal() * (value.tax_rate / 100);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTaxAmount();
    const discount = value.discount || 0;
    return subtotal + tax - discount;
  };

  const handleAddItem = () => {
    if (!newItem.description || !newItem.quantity || !newItem.unit_price) {
      return;
    }

    const item: PricingItem = {
      id: Date.now().toString(),
      description: newItem.description,
      quantity: newItem.quantity,
      unit_price: newItem.unit_price,
      total: calculateItemTotal(newItem.quantity, newItem.unit_price),
    };

    onChange({
      ...value,
      items: [...value.items, item],
      subtotal: calculateSubtotal(),
      tax_amount: calculateTaxAmount(),
      total: calculateTotal(),
    });

    setNewItem({ description: '', quantity: 1, unit_price: 0 });
  };

  const handleRemoveItem = (id: string) => {
    const updatedItems = value.items.filter(item => item.id !== id);
    onChange({
      ...value,
      items: updatedItems,
      subtotal: calculateSubtotal(),
      tax_amount: calculateTaxAmount(),
      total: calculateTotal(),
    });
  };

  const handleUpdateItem = (id: string, field: keyof PricingItem, newValue: string | number) => {
    const updatedItems = value.items.map(item => {
      if (item.id !== id) return item;

      const updated = { ...item, [field]: newValue };
      if (field === 'quantity' || field === 'unit_price') {
        updated.total = calculateItemTotal(updated.quantity, updated.unit_price);
      }
      return updated;
    });

    onChange({
      ...value,
      items: updatedItems,
      subtotal: calculateSubtotal(),
      tax_amount: calculateTaxAmount(),
      total: calculateTotal(),
    });
  };

  const handleTaxRateChange = (taxRate: number) => {
    onChange({
      ...value,
      tax_rate: taxRate,
      tax_amount: calculateTaxAmount(),
      total: calculateTotal(),
    });
  };

  const handleDiscountChange = (discount: number) => {
    onChange({
      ...value,
      discount,
      total: calculateTotal(),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Table</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Items table */}
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Description</TableHead>
                <TableHead className="w-[15%]">Quantity</TableHead>
                <TableHead className="w-[20%]">Unit Price</TableHead>
                <TableHead className="w-[20%]">Total</TableHead>
                <TableHead className="w-[5%]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {value.items.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Input
                      value={item.description}
                      onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                      className="border-0 bg-transparent"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value))}
                      className="border-0 bg-transparent"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) => handleUpdateItem(item.id, 'unit_price', parseFloat(e.target.value))}
                      className="border-0 bg-transparent"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(item.total, value.currency)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {/* Add new item row */}
              <TableRow>
                <TableCell>
                  <Input
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) })}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price"
                    value={newItem.unit_price}
                    onChange={(e) => setNewItem({ ...newItem, unit_price: parseFloat(e.target.value) })}
                  />
                </TableCell>
                <TableCell>
                  <Button onClick={handleAddItem} size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Totals */}
        <div className="space-y-4 max-w-md ml-auto">
          <div className="flex justify-between items-center">
            <span className="text-muted">Subtotal:</span>
            <span className="font-medium">{formatCurrency(calculateSubtotal(), value.currency)}</span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <Label htmlFor="tax-rate" className="text-muted">Tax Rate (%):</Label>
            <Input
              id="tax-rate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={value.tax_rate || 0}
              onChange={(e) => handleTaxRateChange(parseFloat(e.target.value) || 0)}
              className="w-24"
            />
            <span className="font-medium w-24 text-right">
              {formatCurrency(calculateTaxAmount(), value.currency)}
            </span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <Label htmlFor="discount" className="text-muted">Discount:</Label>
            <Input
              id="discount"
              type="number"
              min="0"
              step="0.01"
              value={value.discount || 0}
              onChange={(e) => handleDiscountChange(parseFloat(e.target.value) || 0)}
              className="w-24"
            />
            <span className="font-medium w-24 text-right">
              -{formatCurrency(value.discount || 0, value.currency)}
            </span>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-border">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(calculateTotal(), value.currency)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
