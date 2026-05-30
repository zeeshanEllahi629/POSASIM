"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/front/profile");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      
      const data = await res.json();
      if (res.ok && data.status === 1) {
        setProfile(data.user);
        setOrders(data.orders);
      } else {
        setError(data.error || "Failed to load profile");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      // Clear cookie client-side
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", phone: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditClick = () => {
    setEditForm({ name: profile?.name || "", phone: profile?.mobile?.toString() || "" });
    setIsEditing(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await fetch("/api/front/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (data.status === 1) {
        setProfile(prev => ({ ...prev, name: data.user.name, mobile: data.user.mobile }));
        setIsEditing(false);
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (error) {
      alert("An error occurred");
    }
    setIsUpdating(false);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#0a0a0a]">
        <i className="fas fa-spinner fa-spin text-4xl text-red-600"></i>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center text-red-500">
          <i className="fas fa-exclamation-triangle text-4xl mb-4"></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-[#0a0a0a] text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Sidebar */}
        <div className="col-span-1 bg-[#111] border border-[#222] rounded-2xl p-6 shadow-xl h-fit">
          <div className="text-center border-b border-[#222] pb-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-500 text-4xl font-bold mx-auto mb-4">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold">{profile?.name}</h2>
            <p className="text-gray-400 text-sm">{profile?.email}</p>
            <button onClick={handleEditClick} className="mt-4 text-xs font-bold text-gray-400 hover:text-white transition-colors border border-[#333] px-3 py-1 rounded-full">
              <i className="fas fa-edit mr-1"></i> Edit Profile
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Mobile</span>
              <span className="font-semibold">{profile?.mobile || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Loyalty Tier</span>
              <span className="font-semibold text-red-500">{profile?.loyalty_tier || "Bronze"}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Points</span>
              <span className="font-semibold">{profile?.loyalty_points || 0}</span>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full mt-8 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 font-bold rounded-xl transition-all flex justify-center items-center gap-2"
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>

        {/* Order History */}
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-2xl font-extrabold mb-6 font-display">My Orders</h3>
          
          {orders.length === 0 ? (
            <div className="bg-[#111] border border-[#222] rounded-2xl p-12 text-center shadow-xl">
              <i className="fas fa-shopping-bag text-5xl text-gray-700 mb-4"></i>
              <h4 className="text-xl font-bold text-gray-300 mb-2">No orders yet</h4>
              <p className="text-gray-500 mb-6">Looks like you haven't placed an order yet.</p>
              <button onClick={() => router.push("/menu")} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all">
                Start Ordering
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-[#111] border border-[#222] rounded-xl p-5 hover:border-[#333] transition-all">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#222] pb-4 mb-4">
                    <div>
                      <h4 className="font-bold text-lg">Order #{order.order_number}</h4>
                      <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-xl font-bold text-red-500">${order.total_amount.toFixed(2)}</span>
                      <div className="mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 1 ? "bg-yellow-500/20 text-yellow-500" :
                          order.status === 2 ? "bg-blue-500/20 text-blue-500" :
                          order.status === 3 ? "bg-green-500/20 text-green-500" :
                          "bg-red-500/20 text-red-500"
                        }`}>
                          {order.status === 1 ? "Pending" : order.status === 2 ? "Processing" : order.status === 3 ? "Completed" : "Cancelled"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Items: {order.order_details?.length || "Various"}</span>
                    <button className="text-sm font-bold text-white hover:text-red-500 transition-colors">
                      View Details <i className="fas fa-chevron-right text-xs ml-1"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#111] border border-[#222] rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                  className="w-full bg-[#1a1a1a] border border-[#333] text-white rounded px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Mobile Number</label>
                <input 
                  type="tel" 
                  value={editForm.phone} 
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})} 
                  className="w-full bg-[#1a1a1a] border border-[#333] text-white rounded px-4 py-2"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#333]">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded border border-[#333] text-gray-300 hover:text-white">Cancel</button>
                <button type="submit" disabled={isUpdating} className="px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700">{isUpdating ? "Saving..." : "Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
