"use client";
// biome-ignore assist/source/organizeImports: <explanation>//
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, User, Phone, MapPin } from "lucide-react";

export function SellerOrders() {
  const recentBookings = [
    {
      id: "B001",
      service: "iPhone Screen Replacement",
      customer: "John Doe",
      phone: "+254712345678",
      date: "2024-01-15",
      time: "14:00",
      status: "Confirmed",
      location: "Nairobi CBD"
    },
    {
      id: "B002",
      service: "Laptop Motherboard Repair",
      customer: "Jane Smith",
      phone: "+254723456789",
      date: "2024-01-16",
      time: "10:00",
      status: "Pending",
      location: "Westlands"
    },
    {
      id: "B003",
      service: "Home Appliance Repair",
      customer: "Mike Johnson",
      phone: "+254734567890",
      date: "2024-01-14",
      time: "16:00",
      status: "Completed",
      location: "Karen"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Service Bookings</h2>
          <p className="text-muted-foreground">Manage your repair service bookings</p>
        </div>
        <Button>
          View All Bookings
        </Button>
      </div>

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 gap-6">
        {recentBookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{booking.service}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {booking.customer}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {booking.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {booking.location}
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{booking.date} at {booking.time}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Contact
                  </Button>
                  <Button size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      <Card className="text-center py-12">
        <CardContent>
          <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="mb-2">No Bookings Yet</CardTitle>
          <CardDescription className="mb-6">
            Your service bookings will appear here when customers book your repair services.
          </CardDescription>
          <Button>Promote Your Services</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}