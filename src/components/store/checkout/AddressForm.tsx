// FILE: src/components/store/checkout/AddressForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { MapPin, Plus } from 'lucide-react';
import type { CheckoutInput } from '@/validators/order.schema';
import { cn } from '@/lib/utils';

interface Address {
  _id?: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

interface AddressFormProps {
  onAddressSelect: (data: CheckoutInput | null) => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Lakshadweep', 'Puducherry'
];

export default function AddressForm({ onAddressSelect }: AddressFormProps) {
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'select' | 'new'>('select');
  
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  
  const [newAddress, setNewAddress] = useState<Address>({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    fetch('/api/addresses')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setSavedAddresses(data.data);
          const defaultAddr = data.data.find((a: Address) => a.isDefault) || data.data[0];
          setSelectedAddressId(defaultAddr._id);
          setMode('select');
        } else {
          setMode('new');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (mode === 'select' && selectedAddressId) {
      onAddressSelect({ addressId: selectedAddressId, notes });
    } else if (mode === 'new') {
      // Validate basic form before emitting
      const { name, phone, addressLine1, city, state, pincode } = newAddress;
      if (name && phone.length === 10 && addressLine1 && city && state && pincode.length === 6) {
        onAddressSelect({ newAddress, notes });
      } else {
        onAddressSelect(null);
      }
    } else {
      onAddressSelect(null);
    }
  }, [mode, selectedAddressId, newAddress, notes, onAddressSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (loading) {
    return <div className="h-40 flex items-center justify-center animate-pulse bg-brand-light rounded-2xl">Loading addresses...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      {savedAddresses.length > 0 && (
        <div className="flex gap-4 border-b border-brand-border pb-4">
          <button
            onClick={() => setMode('select')}
            className={cn(
              "pb-2 font-semibold text-sm transition-colors relative",
              mode === 'select' ? "text-brand-primary" : "text-brand-muted hover:text-brand-dark"
            )}
          >
            Saved Addresses
            {mode === 'select' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary rounded-t-full" />}
          </button>
          <button
            onClick={() => setMode('new')}
            className={cn(
              "pb-2 font-semibold text-sm transition-colors relative flex items-center gap-1",
              mode === 'new' ? "text-brand-primary" : "text-brand-muted hover:text-brand-dark"
            )}
          >
            <Plus size={16} /> Add New Address
            {mode === 'new' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary rounded-t-full" />}
          </button>
        </div>
      )}

      {/* Select Saved Address */}
      {mode === 'select' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedAddresses.map((addr) => (
            <label
              key={addr._id}
              className={cn(
                "relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                selectedAddressId === addr._id
                  ? "border-brand-primary bg-brand-primary/5 shadow-sm ring-1 ring-brand-primary"
                  : "border-brand-border bg-white hover:border-brand-primary/50"
              )}
            >
              <input
                type="radio"
                name="savedAddress"
                value={addr._id}
                checked={selectedAddressId === addr._id}
                onChange={() => setSelectedAddressId(addr._id || null)}
                className="mt-1 text-brand-primary focus:ring-brand-primary"
              />
              <div>
                <p className="font-bold text-brand-dark flex items-center gap-2">
                  {addr.name} 
                  {addr.isDefault && <span className="text-[10px] uppercase bg-brand-light px-2 py-0.5 rounded text-brand-muted">Default</span>}
                </p>
                <p className="text-sm text-brand-muted mt-1">{addr.addressLine1}</p>
                {addr.addressLine2 && <p className="text-sm text-brand-muted">{addr.addressLine2}</p>}
                <p className="text-sm text-brand-muted">{addr.city}, {addr.state} {addr.pincode}</p>
                <p className="text-sm font-medium text-brand-dark mt-2">Mobile: {addr.phone}</p>
              </div>
            </label>
          ))}
        </div>
      )}

      {/* New Address Form */}
      {mode === 'new' && (
        <div className="bg-white p-6 rounded-2xl border border-brand-border">
          <h3 className="font-semibold text-brand-dark mb-4 flex items-center gap-2">
            <MapPin size={18} className="text-brand-primary" /> Delivery Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-dark mb-1">Full Name</label>
              <input type="text" name="name" value={newAddress.name} onChange={handleInputChange} className="w-full border border-brand-border rounded-xl px-4 py-2.5 outline-none focus:border-brand-primary text-sm" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-dark mb-1">Phone Number</label>
              <input type="tel" name="phone" value={newAddress.phone} onChange={handleInputChange} placeholder="10-digit mobile number" className="w-full border border-brand-border rounded-xl px-4 py-2.5 outline-none focus:border-brand-primary text-sm" required maxLength={10} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-dark mb-1">Address Line 1</label>
              <input type="text" name="addressLine1" value={newAddress.addressLine1} onChange={handleInputChange} placeholder="Flat, House no., Building, Company, Apartment" className="w-full border border-brand-border rounded-xl px-4 py-2.5 outline-none focus:border-brand-primary text-sm" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-dark mb-1">Address Line 2 (Optional)</label>
              <input type="text" name="addressLine2" value={newAddress.addressLine2} onChange={handleInputChange} placeholder="Area, Street, Sector, Village" className="w-full border border-brand-border rounded-xl px-4 py-2.5 outline-none focus:border-brand-primary text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Pincode</label>
              <input type="text" name="pincode" value={newAddress.pincode} onChange={handleInputChange} className="w-full border border-brand-border rounded-xl px-4 py-2.5 outline-none focus:border-brand-primary text-sm" required maxLength={6} />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">City</label>
              <input type="text" name="city" value={newAddress.city} onChange={handleInputChange} className="w-full border border-brand-border rounded-xl px-4 py-2.5 outline-none focus:border-brand-primary text-sm" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-dark mb-1">State</label>
              <select name="state" value={newAddress.state} onChange={handleInputChange} className="w-full border border-brand-border rounded-xl px-4 py-2.5 outline-none focus:border-brand-primary text-sm bg-white" required>
                <option value="">Select State</option>
                {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Order Notes */}
      <div>
        <label className="block text-sm font-medium text-brand-dark mb-1">Order Notes (Optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes about your order, e.g. special notes for delivery."
          className="w-full border border-brand-border rounded-xl px-4 py-3 outline-none focus:border-brand-primary text-sm min-h-[100px]"
        />
      </div>
    </div>
  );
}
