"use client";

import { useState } from "react";
import { Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function EditProfileButton({ initialName }: { initialName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name === initialName) return;

    setLoading(true);
    try {
      const { error } = await authClient.updateUser({
        name,
      });
      
      if (error) {
        throw new Error(error.message || "Failed to update profile");
      }
      
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update profile", error);
      alert(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="text-gray-600 rounded-full h-9 px-4 font-medium"
        onClick={() => setIsOpen(true)}
      >
        <Settings className="w-4 h-4 mr-2" />
        Edit Profile
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full"
                />
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading || !name.trim() || name === initialName}
                  className="bg-pink-500 hover:bg-pink-600 text-white border-0"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
