'use client';
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

interface BookingData {
  fullname: string;
  phonenumber: string;
  email: string;
  pickupAddress: string;
  pricingPlan: string;
  serviceType: string;
  pickupDate: string;
  pickupTime: string;
  specialInstructions: string;
}

export default function BookingForm() {
  const [formData, setFormData] = useState<BookingData>({
    fullname: '',
    phonenumber: '',
    email: '',
    pickupAddress: '',
    pricingPlan: '',
    serviceType: '',
    pickupDate: '',
    pickupTime: '',
    specialInstructions: '',
  });

  const handleChange = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to submit booking');

      const data = await res.json();
      console.log('Response:', data);

      toast({
        title: 'Booking Successful 🎉',
        description: 'Your laundry service has been booked successfully!',
      });

      // Reset form
      setFormData({
        fullname: '',
        phonenumber: '',
        email: '',
        pickupAddress: '',
        pricingPlan: '',
        serviceType: '',
        pickupDate: '',
        pickupTime: '',
        specialInstructions: '',
      });
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: 'Booking Failed ❌',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="max-w-lg mx-auto mt-10 p-6 shadow-lg border rounded-2xl bg-white">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-gray-800">
          Laundry Booking Form
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <Label>Full Name</Label>
            <Input
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <Label>Phone Number</Label>
            <Input
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* Email Address */}
          <div>
            <Label>Email Address</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Pickup Address */}
          <div>
            <Label>Pickup Address</Label>
            <Input
              name="pickupAddress"
              value={formData.pickupAddress}
              onChange={handleChange}
              placeholder="Enter your pickup address"
              required
            />
          </div>

          {/* Pricing Plan */}
          <div>
            <Label>Pricing Plan</Label>
            <Select
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, pricingPlan: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="express">Express</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Service Type */}
          <div>
            <Label>Service Type</Label>
            <Select
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, serviceType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wash">Wash Only</SelectItem>
                <SelectItem value="iron">Iron Only</SelectItem>
                <SelectItem value="wash_iron">Wash & Iron</SelectItem>
                <SelectItem value="dry_clean">Dry Clean</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pickup Date */}
          <div>
            <Label>Pickup Date</Label>
            <Input
              type="date"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* Pickup Time */}
          <div>
            <Label>Pickup Time</Label>
            <Input
              type="time"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              required
            />
          </div>

          {/* Special Instructions */}
          <div>
            <Label>Special Instructions</Label>
            <Textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              placeholder="Write any special instructions for pickup..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full text-lg font-semibold">
            Confirm Booking
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}




