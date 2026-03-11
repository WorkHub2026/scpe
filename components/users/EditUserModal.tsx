"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getUserById,
  adminSetTemporaryPassword,
} from "@/lib/services/userService";
import { toast } from "sonner";
export function EditUserModal({
  onClose,
  userId,
}: {
  onClose: () => void;
  userId: number;
}) {
  const [user, setUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [expiresInHours, setExpiresInHours] = useState(24);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchingUser = async () => {
      setLoading(true);
      try {
        const fetchedUser = await getUserById(userId);
        setUser(fetchedUser);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchingUser();
  }, []);
  const generateTempPassword = () => {
    const alphabet =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$";
    const bytes = new Uint8Array(12);
    window.crypto.getRandomValues(bytes);
    const pw = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
    setNewPassword(pw);
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminSetTemporaryPassword({
        user_id: user.user_id,
        temporaryPassword: newPassword,
        expiresInHours,
      });
      setLoading(false);
      onClose();
      toast.success("Temporary password set ✅");
    } catch (error) {
      console.log("Error at updating a user:", error);
      toast.error("Failed to set temporary password");
    }
  };
  return (
    <form onSubmit={handleEditUser}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {user ? `Edit User: ${user.username}` : "Edit User"}
          </DialogTitle>
          <DialogDescription>
            Set a temporary password. The user will be forced to change it on
            next login.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              readOnly
              defaultValue={user ? user.username : ""}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="name-1">Temporary Password</Label>
            <Input
              name="password"
              type="password"
              value={newPassword}
              placeholder="Enter a new password here"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={generateTempPassword}>
                Generate
              </Button>
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="expires">Expires (hours)</Label>
            <Input
              id="expires"
              name="expires"
              type="number"
              min={1}
              value={expiresInHours}
              onChange={(e) => setExpiresInHours(Number(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </form>
  );
}
